"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { Praise } from '@/lib/praises';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

interface PraisesContextType {
  praises: Praise[];
  addPraise: (newPraiseData: Omit<Praise, 'id'>) => Promise<{ success: boolean; praise?: Praise }>;
  addPraises: (newPraisesData: Omit<Praise, 'id'>[]) => Promise<{ addedCount: number, duplicates: number }>;
  deletePraise: (praiseId: string) => Promise<void>;
  updatePraise: (praiseId: string, newPraiseData: Omit<Praise, 'id'>) => Promise<{ success: boolean, newId?: string, error?: string }>;
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
    return rawPraises ? [...rawPraises].sort((a, b) => a.title.localeCompare(b.title)) : [];
  }, [rawPraises]);
  
  const addPraise = useCallback(async (newPraiseData: Omit<Praise, 'id'>): Promise<{ success: boolean; praise?: Praise }> => {
    if (!firestore) return { success: false };
    const id = slugify(newPraiseData.title);
    
    if (praises.some(p => p.id === id)) {
      return { success: false };
    }

    const docRef = doc(firestore, 'praises', id);
    const newPraise = { ...newPraiseData, id };
    await setDoc(docRef, newPraiseData);
    return { success: true, praise: newPraise };
  }, [firestore, praises]);

  const addPraises = useCallback(async (newPraisesData: Omit<Praise, 'id'>[]): Promise<{ addedCount: number, duplicates: number }> => {
    if (!firestore) return { addedCount: 0, duplicates: 0 };
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const existingTitles = new Set(praises.map(p => p.id));

    for (const praiseData of newPraisesData) {
      const id = slugify(praiseData.title);
      if (existingTitles.has(id)) {
        duplicates++;
      } else {
        const docRef = doc(firestore, 'praises', id);
        batch.set(docRef, praiseData);
        addedCount++;
        existingTitles.add(id);
      }
    }
    
    if (addedCount > 0) {
      await batch.commit();
    }

    return { addedCount, duplicates };
  }, [firestore, praises]);

  const deletePraise = useCallback(async (praiseId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'praises', praiseId);
    await deleteDoc(docRef);
  }, [firestore]);
  
  const updatePraise = useCallback(async (praiseId: string, newPraiseData: Omit<Praise, 'id'>): Promise<{ success: boolean, newId?: string, error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_not_ready' };
    const newId = slugify(newPraiseData.title);

    if (newId !== praiseId && praises.some(p => p.id === newId)) {
        return { success: false, error: 'duplicate' };
    }

    const oldDocRef = doc(firestore, 'praises', praiseId);
    
    if (newId !== praiseId) {
        const newDocRef = doc(firestore, 'praises', newId);
        const batch = writeBatch(firestore);
        batch.delete(oldDocRef);
        batch.set(newDocRef, newPraiseData);
        await batch.commit();
    } else {
        await setDoc(oldDocRef, newPraiseData, { merge: true });
    }
    
    return { success: true, newId: newId };
  }, [firestore, praises]);

  const getPraiseById = useCallback((id: string): Praise | undefined => {
    return praises.find(p => p.id === id);
  }, [praises]);

  const restorePraises = useCallback(async (praisesToRestore: Omit<Praise, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);

    // Delete all existing documents
    praises.forEach(praise => {
      const docRef = doc(firestore, 'praises', praise.id);
      batch.delete(docRef);
    });
    
    // Add new documents from backup
    praisesToRestore.forEach(praiseData => {
      const id = slugify(praiseData.title);
      const docRef = doc(firestore, 'praises', id);
      batch.set(docRef, praiseData);
    });

    await batch.commit();
  }, [firestore, praises]);

  const value = { praises, addPraise, addPraises, deletePraise, updatePraise, getPraiseById, restorePraises, isLoaded };

  return <PraisesContext.Provider value={value}>{children}</PraisesContext.Provider>;
}

export function usePraises() {
  const context = useContext(PraisesContext);
  if (context === undefined) {
    throw new Error('usePraises must be used within a PraisesProvider');
  }
  return context;
}
