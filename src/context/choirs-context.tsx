"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { Choir } from '@/lib/choirs';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

interface ChoirsContextType {
  choirs: Choir[];
  addChoir: (newChoirData: Omit<Choir, 'id'>) => Promise<{ success: boolean; choir?: Choir }>;
  addChoirs: (newChoirsData: Omit<Choir, 'id'>[]) => Promise<{ addedCount: number, duplicates: number }>;
  deleteChoir: (choirId: string) => Promise<void>;
  updateChoir: (choirId: string, newChoirData: Omit<Choir, 'id'>) => Promise<{ success: boolean, newId?: string, error?: string }>;
  getChoirById: (id: string) => Choir | undefined;
  restoreChoirs: (choirsToRestore: Omit<Choir, 'id'>[]) => Promise<void>;
  isLoaded: boolean;
}

const ChoirsContext = createContext<ChoirsContextType | undefined>(undefined);

export function ChoirsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  
  const choirsCollectionRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'choirs') : null
  , [firestore]);
  
  const { data: rawChoirs, isLoading: isLoadingFromHook } = useCollection<Choir>(choirsCollectionRef);

  const isLoaded = !!firestore && !isLoadingFromHook;

  const choirs = useMemo(() => {
    return rawChoirs ? [...rawChoirs].sort((a, b) => a.title.localeCompare(b.title)) : [];
  }, [rawChoirs]);
  
  const addChoir = useCallback(async (newChoirData: Omit<Choir, 'id'>): Promise<{ success: boolean; choir?: Choir }> => {
    if (!firestore) return { success: false };
    const id = slugify(newChoirData.title);
    
    if (choirs.some(p => p.id === id)) {
      return { success: false };
    }

    const docRef = doc(firestore, 'choirs', id);
    const newChoir = { ...newChoirData, id };
    await setDoc(docRef, newChoirData);
    return { success: true, choir: newChoir };
  }, [firestore, choirs]);

  const addChoirs = useCallback(async (newChoirsData: Omit<Choir, 'id'>[]): Promise<{ addedCount: number, duplicates: number }> => {
    if (!firestore) return { addedCount: 0, duplicates: 0 };
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const existingTitles = new Set(choirs.map(p => p.id));

    for (const choirData of newChoirsData) {
      const id = slugify(choirData.title);
      if (existingTitles.has(id)) {
        duplicates++;
      } else {
        const docRef = doc(firestore, 'choirs', id);
        batch.set(docRef, choirData);
        addedCount++;
        existingTitles.add(id);
      }
    }
    
    if (addedCount > 0) {
      await batch.commit();
    }

    return { addedCount, duplicates };
  }, [firestore, choirs]);

  const deleteChoir = useCallback(async (choirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'choirs', choirId);
    await deleteDoc(docRef);
  }, [firestore]);
  
  const updateChoir = useCallback(async (choirId: string, newChoirData: Omit<Choir, 'id'>): Promise<{ success: boolean, newId?: string, error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_not_ready' };
    const newId = slugify(newChoirData.title);

    if (newId !== choirId && choirs.some(p => p.id === newId)) {
        return { success: false, error: 'duplicate' };
    }

    const oldDocRef = doc(firestore, 'choirs', choirId);
    
    if (newId !== choirId) {
        const newDocRef = doc(firestore, 'choirs', newId);
        const batch = writeBatch(firestore);
        batch.delete(oldDocRef);
        batch.set(newDocRef, newChoirData);
        await batch.commit();
    } else {
        await setDoc(oldDocRef, newChoirData, { merge: true });
    }
    
    return { success: true, newId: newId };
  }, [firestore, choirs]);

  const getChoirById = useCallback((id: string): Choir | undefined => {
    return choirs.find(p => p.id === id);
  }, [choirs]);

  const restoreChoirs = useCallback(async (choirsToRestore: Omit<Choir, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
  
    // Delete all existing documents
    choirs.forEach(choir => {
      const docRef = doc(firestore, 'choirs', choir.id);
      batch.delete(docRef);
    });
    
    // Add new documents from backup
    choirsToRestore.forEach(choirData => {
      const id = slugify(choirData.title);
      const docRef = doc(firestore, 'choirs', id);
      batch.set(docRef, choirData);
    });
  
    await batch.commit();
  }, [firestore, choirs]);

  const value = { choirs, addChoir, addChoirs, deleteChoir, updateChoir, getChoirById, restoreChoirs, isLoaded };

  return <ChoirsContext.Provider value={value}>{children}</ChoirsContext.Provider>;
}

export function useChoirs() {
  const context = useContext(ChoirsContext);
  if (context === undefined) {
    throw new Error('useChoirs must be used within a ChoirsProvider');
  }
  return context;
}
