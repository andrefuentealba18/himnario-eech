
"use client";

import { createContext, useContext, useEffect, useCallback, ReactNode, useMemo } from 'react';
import type { Hymn } from '@/lib/hymns';
import { hymns as initialHymnsData } from '@/lib/hymns-initial';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

// Helper to remove undefined values from an object, which Firestore doesn't support.
const removeUndefined = (obj: Record<string, any>): Record<string, any> => {
  const newObj: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

interface HymnsContextType {
  hymns: Hymn[];
  addHymn: (newHymnData: Omit<Hymn, 'id'>) => void;
  addHymns: (newHymnsData: Omit<Hymn, 'id'>[]) => void;
  updateHymn: (hymnNumber: number, newHymnData: Omit<Hymn, 'id' | 'number'>) => Promise<{ success: boolean; error?: string }>;
  deleteHymn: (hymnNumber: number) => void;
  getHymnById: (id: number) => Hymn | undefined;
  restoreHymns: (hymnsToRestore: Omit<Hymn, 'id'>[]) => void;
  isLoaded: boolean;
}

const HymnsContext = createContext<HymnsContextType | undefined>(undefined);

export function HymnsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const hymnsCollectionRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'hymns') : null
  , [firestore]);

  const { data: rawHymns, isLoading: isLoadingFromHook } = useCollection<Hymn>(hymnsCollectionRef);
  
  // Consideramos cargado si tenemos el servicio y el hook ya no está en loading inicial
  const isLoaded = !!firestore && !isLoadingFromHook;

  const hymns = useMemo(() => {
    return rawHymns ? [...rawHymns].sort((a, b) => a.number - b.number) : [];
  }, [rawHymns]);

  useEffect(() => {
    const migrateData = async () => {
        if (!firestore || !isLoaded) return;
        
        // Si la colección está vacía en la nube, forzamos la migración inicial
        if (rawHymns?.length === 0) {
            const migrationFlag = 'hymns_migrated_v3_final';
            if (localStorage.getItem(migrationFlag)) {
                return;
            }

            console.log('Iniciando carga inicial de himnos...');
            
            try {
                const batch = writeBatch(firestore);
                initialHymnsData.forEach((hymn) => {
                    const docRef = doc(firestore, 'hymns', hymn.number.toString());
                    const dataToSave = {
                        number: hymn.number,
                        title: hymn.title,
                        lyrics: hymn.lyrics,
                        tone: hymn.tone || 'Indefinida',
                        createdAt: serverTimestamp()
                    };
                    batch.set(docRef, removeUndefined(dataToSave));
                });

                await batch.commit();
                localStorage.setItem(migrationFlag, 'true');
                console.log('Migración de himnos completada con éxito.');
            } catch (error) {
                console.error("Error al migrar himnos iniciales:", error);
            }
        }
    };
    migrateData();
  }, [isLoaded, rawHymns, firestore]);

  const addHymn = useCallback((newHymnData: Omit<Hymn, 'id'>) => {
    if (!firestore) {
      console.error("Firestore no disponible");
      return;
    }

    const docRef = doc(firestore, 'hymns', newHymnData.number.toString());
    const dataToSave = removeUndefined({
      ...newHymnData,
      createdAt: serverTimestamp()
    });
    
    setDoc(docRef, dataToSave, { merge: true })
      .then(() => {
        toast({ title: 'Himno Guardado', description: `El himno #${newHymnData.number} se ha guardado correctamente.` });
      })
      .catch((error) => {
        console.error("Error al guardar himno:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: docRef.path,
            operation: 'create',
            requestResourceData: dataToSave
        }));
      });
  }, [firestore, toast]);

  const addHymns = useCallback((newHymnsData: Omit<Hymn, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    newHymnsData.forEach(hymn => {
        const docRef = doc(firestore, 'hymns', hymn.number.toString());
        const dataToSave = {
            ...hymn,
            createdAt: serverTimestamp()
        };
        batch.set(docRef, removeUndefined(dataToSave), { merge: true });
    });

    batch.commit()
      .then(() => {
        toast({ title: 'Importación Completa', description: `Se han procesado ${newHymnsData.length} himnos.` });
      })
      .catch((error) => {
        console.error("Error en importación masiva de himnos:", error);
      });
  }, [firestore, toast]);

  const updateHymn = useCallback(async (hymnNumber: number, newHymnData: Omit<Hymn, 'id' | 'number'>): Promise<{ success: boolean; error?: string }> => {
    if (!firestore) return { success: false, error: 'no_firestore' };
    
    const docRef = doc(firestore, 'hymns', hymnNumber.toString());
    try {
      await setDoc(docRef, removeUndefined({ ...newHymnData, number: hymnNumber }), { merge: true });
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar himno:", error);
      return { success: false, error: 'update_failed' };
    }
  }, [firestore]);

  const deleteHymn = useCallback((hymnNumber: number) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'hymns', hymnNumber.toString());
    deleteDoc(docRef)
      .then(() => {
        toast({ title: 'Himno Eliminado' });
      })
      .catch((error) => {
        console.error("Error al eliminar himno:", error);
      });
  }, [firestore, toast]);
  
  const getHymnById = useCallback((id: number): Hymn | undefined => {
    return hymns.find(h => h.number === id);
  }, [hymns]);

  const restoreHymns = useCallback((hymnsToRestore: Omit<Hymn, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
    hymnsToRestore.forEach(hymn => {
      const docRef = doc(firestore, 'hymns', hymn.number.toString());
      batch.set(docRef, removeUndefined({ ...hymn, createdAt: serverTimestamp() }));
    });
    batch.commit().catch(e => console.error("Error al restaurar:", e));
  }, [firestore]);

  const value = { hymns, addHymn, addHymns, updateHymn, deleteHymn, getHymnById, restoreHymns, isLoaded };

  return <HymnsContext.Provider value={value}>{children}</HymnsContext.Provider>;
}

export function useHymns() {
  const context = useContext(HymnsContext);
  if (context === undefined) {
    throw new Error('useHymns must be used within a HymnsProvider');
  }
  return context;
}
