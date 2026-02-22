"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { Praise } from '@/lib/praises';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch, serverTimestamp, updateDoc } from 'firebase/firestore';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

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

interface PraisesContextType {
  praises: Praise[];
  pendingPraises: Praise[];
  addPraise: (newPraiseData: Omit<Praise, 'id'>) => Promise<{ success: boolean; praise?: Praise }>;
  addPraises: (newPraisesData: Omit<Praise, 'id'>[]) => Promise<{ addedCount: number, duplicates: number }>;
  deletePraise: (praiseId: string) => Promise<void>;
  updatePraise: (praiseId: string, newPraiseData: Omit<Praise, 'id'>) => Promise<{ success: boolean, newId?: string, error?: string }>;
  approvePraise: (praiseId: string) => Promise<void>;
  getPraiseById: (id: string) => Praise | undefined;
  restorePraises: (praisesToRestore: Omit<Praise, 'id'>[]) => Promise<void>;
  isLoaded: boolean;
}

const PraisesContext = createContext<PraisesContextType | undefined>(undefined);

export function PraisesProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  
  const praisesCollectionRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'praises') : null
  , [firestore]);
  
  const { data: rawPraises, isLoading: isLoadingFromHook } = useCollection<Praise>(praisesCollectionRef);

  const isLoaded = !!firestore && !isLoadingFromHook;

  const praises = useMemo(() => {
    return rawPraises ? [...rawPraises].filter(p => p.status !== 'pending').sort((a, b) => a.title.localeCompare(b.title)) : [];
  }, [rawPraises]);
  
  const pendingPraises = useMemo(() => {
    return rawPraises ? [...rawPraises].filter(p => p.status === 'pending').sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)) : [];
  }, [rawPraises]);
  
  const addPraise = useCallback(async (newPraiseData: Omit<Praise, 'id'>): Promise<{ success: boolean; praise?: Praise }> => {
    if (!firestore) return { success: false };
    const id = slugify(newPraiseData.title);
    
    const allPraises = rawPraises || [];
    if (allPraises.some(p => p.id === id)) {
      return { success: false };
    }

    const docRef = doc(firestore, 'praises', id);
    const dataToSave = { 
        ...newPraiseData,
        status: 'pending' as const,
        createdAt: serverTimestamp() 
    };
    await setDoc(docRef, removeUndefined(dataToSave));
    return { success: true, praise: { ...newPraiseData, id } };
  }, [firestore, rawPraises]);

  const addPraises = useCallback(async (newPraisesData: Omit<Praise, 'id'>[]): Promise<{ addedCount: number, duplicates: number }> => {
    if (!firestore) return { addedCount: 0, duplicates: 0 };
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const allPraises = rawPraises || [];
    const existingTitles = new Set(allPraises.map(p => p.id));

    for (const praiseData of newPraisesData) {
      const id = slugify(praiseData.title);
      if (existingTitles.has(id)) {
        duplicates++;
      } else {
        const docRef = doc(firestore, 'praises', id);
        const dataToSave = { 
            ...praiseData,
            status: 'pending' as const,
            createdAt: serverTimestamp() 
        };
        batch.set(docRef, removeUndefined(dataToSave));
        addedCount++;
        existingTitles.add(id);
      }
    }
    
    if (addedCount > 0) {
      await batch.commit();
    }

    return { addedCount, duplicates };
  }, [firestore, rawPraises]);

  const approvePraise = useCallback(async (praiseId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'praises', praiseId);
    await updateDoc(docRef, { status: 'approved' });
  }, [firestore]);

  const deletePraise = useCallback(async (praiseId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'praises', praiseId);
    await deleteDoc(docRef);
  }, [firestore]);
  
  const updatePraise = useCallback(async (praiseId: string, newPraiseData: Omit<Praise, 'id'>): Promise<{ success: boolean, newId?: string, error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_not_ready' };
    const newId = slugify(newPraiseData.title);
    
    const allPraises = rawPraises || [];
    if (newId !== praiseId && allPraises.some(p => p.id === newId)) {
        return { success: false, error: 'duplicate' };
    }

    const oldDocRef = doc(firestore, 'praises', praiseId);
    const dataToSave = removeUndefined(newPraiseData);
    
    try {
      if (newId !== praiseId) {
          const newDocRef = doc(firestore, 'praises', newId);
          const batch = writeBatch(firestore);
          batch.delete(oldDocRef);
          batch.set(newDocRef, dataToSave);
          await batch.commit();
      } else {
          await setDoc(oldDocRef, dataToSave, { merge: true });
      }
      return { success: true, newId: newId };
    } catch (error) {
      console.error("Error updating praise:", error);
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: oldDocRef.path,
        operation: 'update',
        requestResourceData: dataToSave
      }));
      return { success: false, error: 'permission_denied' };
    }
  }, [firestore, rawPraises]);

  const getPraiseById = useCallback((id: string): Praise | undefined => {
    return (rawPraises || []).find(p => p.id === id);
  }, [rawPraises]);

  const restorePraises = useCallback(async (praisesToRestore: Omit<Praise, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);

    // Delete all existing documents
    (rawPraises || []).forEach(praise => {
      const docRef = doc(firestore, 'praises', praise.id);
      batch.delete(docRef);
    });
    
    // Add new documents from backup
    praisesToRestore.forEach(praiseData => {
      const id = slugify(praiseData.title);
      const docRef = doc(firestore, 'praises', id);
      const dataWithStatus = { ...praiseData, status: 'approved' as const };
      batch.set(docRef, removeUndefined(dataWithStatus));
    });

    await batch.commit();
  }, [firestore, rawPraises]);

  const value = { praises, pendingPraises, addPraise, addPraises, deletePraise, updatePraise, approvePraise, getPraiseById, restorePraises, isLoaded };

  return <PraisesContext.Provider value={value}>{children}</PraisesContext.Provider>;
}

export function usePraises() {
  const context = useContext(PraisesContext);
  if (context === undefined) {
    throw new Error('usePraises must be used within a PraisesProvider');
  }
  return context;
}
