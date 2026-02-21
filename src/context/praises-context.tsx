"use client";

import { createContext, useContext, useEffect, useCallback, ReactNode, useMemo } from 'react';
import type { Praise } from '@/lib/praises';
import { useFirestore, useCollection } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch, getDoc } from 'firebase/firestore';

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
  isLoaded: boolean;
}

const PraisesContext = createContext<PraisesContextType | undefined>(undefined);

export function PraisesProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const praisesCollectionRef = useMemo(() => firestore ? collection(firestore, 'praises') : null, [firestore]);
  const { data: rawPraises, loading: isLoaded } = useCollection<Praise>(praisesCollectionRef);

  const praises = useMemo(() => {
    return rawPraises ? [...rawPraises].sort((a, b) => a.title.localeCompare(b.title)) : [];
  }, [rawPraises]);
  
  const addPraise = useCallback(async (newPraiseData: Omit<Praise, 'id'>): Promise<{ success: boolean; praise?: Praise }> => {
    if (!firestore) return { success: false };
    const id = slugify(newPraiseData.title);
    
    const docRef = doc(firestore, 'praises', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: false };
    }

    const newPraise = { ...newPraiseData, id };
    await setDoc(docRef, newPraiseData);
    return { success: true, praise: newPraise };
  }, [firestore]);

  const addPraises = useCallback(async (newPraisesData: Omit<Praise, 'id'>[]): Promise<{ addedCount: number, duplicates: number }> => {
    if (!firestore) return { addedCount: 0, duplicates: 0 };
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;

    // Firestore doesn't have an efficient "Set" to check against without reading all docs.
    // A better approach for very large datasets would be a cloud function.
    // For this client-side approach, we check one by one.
    for (const praiseData of newPraisesData) {
      const id = slugify(praiseData.title);
      const docRef = doc(firestore, 'praises', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        duplicates++;
      } else {
        batch.set(docRef, praiseData);
        addedCount++;
      }
    }
    
    if (addedCount > 0) {
      await batch.commit();
    }

    return { addedCount, duplicates };
  }, [firestore]);

  const deletePraise = useCallback(async (praiseId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'praises', praiseId);
    await deleteDoc(docRef);
  }, [firestore]);
  
  const updatePraise = useCallback(async (praiseId: string, newPraiseData: Omit<Praise, 'id'>): Promise<{ success: boolean, newId?: string, error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_not_ready' };
    const newId = slugify(newPraiseData.title);

    if (newId !== praiseId) {
        const newDocRef = doc(firestore, 'praises', newId);
        const docSnap = await getDoc(newDocRef);
        if (docSnap.exists()) {
            return { success: false, error: 'duplicate' };
        }
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
  }, [firestore]);

  const getPraiseById = useCallback((id: string): Praise | undefined => {
    if (!isLoaded) return undefined;
    return praises.find(p => p.id === id);
  }, [praises, isLoaded]);

  const value = { praises, addPraise, addPraises, deletePraise, updatePraise, getPraiseById, isLoaded: !isLoaded };

  return <PraisesContext.Provider value={value}>{children}</PraisesContext.Provider>;
}

export function usePraises() {
  const context = useContext(PraisesContext);
  if (context === undefined) {
    throw new Error('usePraises must be used within a PraisesProvider');
  }
  return context;
}
