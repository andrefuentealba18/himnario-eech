"use client";

import { createContext, useContext, useEffect, useCallback, ReactNode, useMemo } from 'react';
import type { Hymn } from '@/lib/hymns';
import { hymns as initialHymnsData } from '@/lib/hymns-initial';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
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
  addHymns: (newHymnsData: Omit<Hymn, 'id'>[]) => void;
  updateHymn: (hymnNumber: number, newHymnData: Omit<Hymn, 'id' | 'number'>) => void;
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
  
  const isLoaded = !!firestore && !isLoadingFromHook;

  const hymns = useMemo(() => {
    return rawHymns ? [...rawHymns].sort((a, b) => a.number - b.number) : [];
  }, [rawHymns]);

  useEffect(() => {
    const migrateData = () => {
        if (!firestore) return;
        if (isLoaded && rawHymns?.length === 0) {
            const migrationFlag = 'hymns_migrated_v2';
            if (localStorage.getItem(migrationFlag)) {
                return;
            }

            console.log('Migrating initial hymns to Firestore...');
            toast({ title: 'Configurando el himnario por primera vez...', description: 'Importando himnos a la nube. Esto puede tardar un momento.' });
            
            const batch = writeBatch(firestore);
            initialHymnsData.forEach((hymn) => {
                const docRef = doc(firestore, 'hymns', hymn.number.toString());
                const dataToSave = {
                    number: hymn.number,
                    title: hymn.title,
                    lyrics: hymn.lyrics,
                    tone: hymn.tone,
                };
                batch.set(docRef, removeUndefined(dataToSave));
            });

            batch.commit()
              .then(() => {
                localStorage.setItem(migrationFlag, 'true');
                toast({ title: '¡Himnario listo!', description: 'Todos los himnos han sido cargados en la nube.' });
              })
              .catch((error) => {
                console.error("Hymn migration failed:", error);
                toast({ variant: 'destructive', title: 'Error de Migración', description: 'No se pudieron cargar los himnos iniciales.' });
              });
        }
    };
    migrateData();
  }, [isLoaded, rawHymns, firestore, toast]);

  const addHymns = useCallback((newHymnsData: Omit<Hymn, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    const hymnsMap = new Map(hymns.map(h => [h.number, h]));
    let addedCount = 0;
    let updatedCount = 0;

    newHymnsData.forEach(hymn => {
        const docRef = doc(firestore, 'hymns', hymn.number.toString());
        const dataToSave = {
            number: hymn.number,
            title: hymn.title,
            lyrics: hymn.lyrics,
            tone: hymn.tone,
        };
        batch.set(docRef, removeUndefined(dataToSave), { merge: true });
        if (hymnsMap.has(hymn.number)) {
            updatedCount++;
        } else {
            addedCount++;
        }
    });

    batch.commit()
      .then(() => {
        toast({ title: 'Himnos Procesados', description: `Se agregaron ${addedCount} himnos nuevos y se actualizaron ${updatedCount} existentes.` });
      })
      .catch((error) => {
        console.error("Error adding/updating hymns:", error);
        toast({ variant: 'destructive', title: 'Error al Guardar', description: 'No se pudieron guardar los himnos.' });
      });
  }, [firestore, hymns, toast]);

  const updateHymn = useCallback((hymnNumber: number, newHymnData: Omit<Hymn, 'id' | 'number'>) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'hymns', hymnNumber.toString());
    const dataToSave = {
      ...newHymnData,
      number: hymnNumber,
    };
    setDoc(docRef, removeUndefined(dataToSave), { merge: true })
      .then(() => {
        toast({ title: 'Himno Actualizado', description: `El himno #${hymnNumber} se ha guardado correctamente.` });
      })
      .catch((error) => {
        console.error("Error updating hymn:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: dataToSave
        }));
        toast({ variant: 'destructive', title: 'Error al Actualizar', description: 'No se pudo guardar el himno.' });
      });
  }, [firestore, toast]);

  const deleteHymn = useCallback((hymnNumber: number) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'hymns', hymnNumber.toString());
    deleteDoc(docRef)
      .then(() => {
        toast({ title: 'Himno Eliminado', description: 'El himno se ha eliminado de la lista.' });
      })
      .catch((error) => {
        console.error("Error deleting hymn:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
        toast({ variant: 'destructive', title: 'Error al Eliminar', description: 'No se pudo eliminar el himno.' });
      });
  }, [firestore, toast]);
  
  const getHymnById = useCallback((id: number): Hymn | undefined => {
    return hymns.find(h => h.number === id);
  }, [hymns]);

  const restoreHymns = useCallback((hymnsToRestore: Omit<Hymn, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);

    hymns.forEach(hymn => {
      const docRef = doc(firestore, 'hymns', hymn.number.toString());
      batch.delete(docRef);
    });
    
    hymnsToRestore.forEach(hymn => {
      const docRef = doc(firestore, 'hymns', hymn.number.toString());
       const dataToSave = {
          number: hymn.number,
          title: hymn.title,
          lyrics: hymn.lyrics,
          tone: hymn.tone,
      };
      batch.set(docRef, removeUndefined(dataToSave));
    });

    batch.commit().catch(error => console.error("Error restoring hymns:", error));
  }, [firestore, hymns]);

  const value = { hymns, addHymns, updateHymn, deleteHymn, getHymnById, restoreHymns, isLoaded };

  return <HymnsContext.Provider value={value}>{children}</HymnsContext.Provider>;
}

export function useHymns() {
  const context = useContext(HymnsContext);
  if (context === undefined) {
    throw new Error('useHymns must be used within a HymnsProvider');
  }
  return context;
}
