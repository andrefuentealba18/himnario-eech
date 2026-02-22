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
  addHymn: (newHymn: Omit<Hymn, 'id'>) => Promise<boolean>;
  addHymns: (newHymnsData: Omit<Hymn, 'id'>[]) => Promise<{ addedCount: number, updatedCount: number }>;
  updateHymn: (hymnNumber: number, newHymnData: Omit<Hymn, 'id' | 'number'>) => Promise<{ success: boolean }>;
  deleteHymn: (hymnNumber: number) => Promise<void>;
  getHymnById: (id: number) => Hymn | undefined;
  restoreHymns: (hymnsToRestore: Omit<Hymn, 'id'>[]) => Promise<void>;
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
    const migrateData = async () => {
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
                batch.set(docRef, hymn);
            });

            try {
              await batch.commit();
              localStorage.setItem(migrationFlag, 'true');
              toast({ title: '¡Himnario listo!', description: 'Todos los himnos han sido cargados en la nube.' });
            } catch (error) {
              console.error("Hymn migration failed:", error);
              toast({ variant: 'destructive', title: 'Error de Migración', description: 'No se pudieron cargar los himnos iniciales.' });
            }
        }
    };
    migrateData();
  }, [isLoaded, rawHymns, firestore, toast]);

  const addHymn = useCallback(async (newHymn: Omit<Hymn, 'id'>): Promise<boolean> => {
    if (!firestore) return false;
    if (hymns.some(h => h.number === newHymn.number)) {
      return false;
    }
    const docRef = doc(firestore, 'hymns', newHymn.number.toString());
    await setDoc(docRef, removeUndefined(newHymn));
    return true;
  }, [firestore, hymns]);

  const addHymns = useCallback(async (newHymnsData: Omit<Hymn, 'id'>[]): Promise<{ addedCount: number, updatedCount: number }> => {
    if (!firestore) return { addedCount: 0, updatedCount: 0 };
    
    const batch = writeBatch(firestore);
    const hymnsMap = new Map(hymns.map(h => [h.number, h]));
    let addedCount = 0;
    let updatedCount = 0;

    newHymnsData.forEach(hymn => {
        const docRef = doc(firestore, 'hymns', hymn.number.toString());
        batch.set(docRef, removeUndefined(hymn), { merge: true });
        if (hymnsMap.has(hymn.number)) {
            updatedCount++;
        } else {
            addedCount++;
        }
    });

    await batch.commit();
    return { addedCount, updatedCount };
  }, [firestore, hymns]);

  const updateHymn = useCallback(async (hymnNumber: number, newHymnData: Omit<Hymn, 'id' | 'number'>): Promise<{ success: boolean }> => {
    if (!firestore) return { success: false };
    const docRef = doc(firestore, 'hymns', hymnNumber.toString());
    const dataToSave = removeUndefined({ ...newHymnData, number: hymnNumber });
    try {
        await setDoc(docRef, dataToSave, { merge: true });
        return { success: true };
    } catch(error) {
        console.error("Error updating hymn:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: docRef.path,
            operation: 'update',
            requestResourceData: dataToSave
        }));
        return { success: false };
    }
  }, [firestore]);


  const deleteHymn = useCallback(async (hymnNumber: number) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'hymns', hymnNumber.toString());
    await deleteDoc(docRef);
  }, [firestore]);
  
  const getHymnById = useCallback((id: number): Hymn | undefined => {
    return hymns.find(h => h.number === id);
  }, [hymns]);

  const restoreHymns = useCallback(async (hymnsToRestore: Omit<Hymn, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);

    // Delete all existing documents
    hymns.forEach(hymn => {
      const docRef = doc(firestore, 'hymns', hymn.number.toString());
      batch.delete(docRef);
    });
    
    // Add new documents from backup
    hymnsToRestore.forEach(hymn => {
      const docRef = doc(firestore, 'hymns', hymn.number.toString());
      batch.set(docRef, removeUndefined(hymn));
    });

    await batch.commit();
  }, [firestore, hymns]);

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
