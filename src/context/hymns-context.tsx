
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
  isSyncing: boolean;
}

const HymnsContext = createContext<HymnsContextType | undefined>(undefined);

export function HymnsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const hymnsCollectionRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'hymns') : null
  , [firestore]);

  const { data: rawHymns, isLoading: isLoadingFromHook } = useCollection<Hymn>(hymnsCollectionRef);
  
  const isSyncing = isLoadingFromHook;
  // isLoaded now means "we have data to show", which is true if we have initial data or firestore data
  const isLoaded = !!firestore && (!isLoadingFromHook || (rawHymns && rawHymns.length > 0) || initialHymnsData.length > 0);

  const hymns = useMemo(() => {
    if (!rawHymns || rawHymns.length === 0) {
      return [...initialHymnsData].sort((a, b) => a.number - b.number) as unknown as Hymn[];
    }
    return [...rawHymns].sort((a, b) => a.number - b.number);
  }, [rawHymns]);

  useEffect(() => {
    const migrateData = async () => {
        if (!firestore || isLoadingFromHook) return;
        
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

                batch.commit().catch(e => console.error("Error al confirmar lote de himnos:", e));
                localStorage.setItem(migrationFlag, 'true');
            } catch (error) {
                console.error("Error al migrar himnos iniciales:", error);
            }
        }
    };
    migrateData();
  }, [isLoadingFromHook, rawHymns, firestore]);

  const addHymn = useCallback((newHymnData: Omit<Hymn, 'id'>) => {
    if (!firestore) return;

    const docRef = doc(firestore, 'hymns', newHymnData.number.toString());
    const dataToSave = {
      ...newHymnData,
      createdAt: serverTimestamp()
    };
    
    setDoc(docRef, removeUndefined(dataToSave), { merge: true })
      .catch((error) => {
        console.error("Error al guardar himno:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: docRef.path,
            operation: 'write',
            requestResourceData: dataToSave
        }));
      });

    toast({ title: 'Himno Guardado', description: `El himno #${newHymnData.number} se ha guardado correctamente.` });
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
      .catch((error) => {
        console.error("Error en importación masiva de himnos:", error);
      });

    toast({ title: 'Importación Completa', description: `Se han procesado ${newHymnsData.length} himnos.` });
  }, [firestore, toast]);

  const updateHymn = useCallback(async (hymnNumber: number, newHymnData: Omit<Hymn, 'id' | 'number'>): Promise<{ success: boolean; error?: string }> => {
    if (!firestore) return { success: false, error: 'no_firestore' };
    
    const docRef = doc(firestore, 'hymns', hymnNumber.toString());
    const updateData = { ...newHymnData, number: hymnNumber };
    
    setDoc(docRef, removeUndefined(updateData), { merge: true })
      .catch((error) => {
        console.error("Error al actualizar himno:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: updateData
        }));
      });

    return { success: true };
  }, [firestore]);

  const deleteHymn = useCallback((hymnNumber: number) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'hymns', hymnNumber.toString());
    deleteDoc(docRef)
      .catch((error) => {
        console.error("Error al eliminar himno:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete'
        }));
      });
    toast({ title: 'Himno Eliminado' });
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

  const value = { hymns, addHymn, addHymns, updateHymn, deleteHymn, getHymnById, restoreHymns, isLoaded, isSyncing };

  return <HymnsContext.Provider value={value}>{children}</HymnsContext.Provider>;
}

export function useHymns() {
  const context = useContext(HymnsContext);
  if (context === undefined) {
    throw new Error('useHymns must be used within a HymnsProvider');
  }
  return context;
}
