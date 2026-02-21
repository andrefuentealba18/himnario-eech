"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { YouthChoir } from '@/lib/youth-choirs';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

interface YouthChoirsContextType {
  youthChoirs: YouthChoir[];
  addYouthChoir: (newYouthChoirData: Omit<YouthChoir, 'id'>) => Promise<{ success: boolean; youthChoir?: YouthChoir }>;
  addYouthChoirs: (newYouthChoirsData: Omit<YouthChoir, 'id'>[]) => Promise<{ addedCount: number, duplicates: number }>;
  deleteYouthChoir: (youthChoirId: string) => Promise<void>;
  updateYouthChoir: (youthChoirId: string, newYouthChoirData: Omit<YouthChoir, 'id'>) => Promise<{ success: boolean, newId?: string, error?: string }>;
  getYouthChoirById: (id: string) => YouthChoir | undefined;
  isLoaded: boolean;
}

const YouthChoirsContext = createContext<YouthChoirsContextType | undefined>(undefined);

export function YouthChoirsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  
  const youthChoirsCollectionRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'youth-choirs') : null
  , [firestore]);
  
  const { data: rawYouthChoirs, isLoading: isLoadingFromHook } = useCollection<YouthChoir>(youthChoirsCollectionRef);

  const isLoaded = !!firestore && !isLoadingFromHook;

  const youthChoirs = useMemo(() => {
    return rawYouthChoirs ? [...rawYouthChoirs].sort((a, b) => a.title.localeCompare(b.title)) : [];
  }, [rawYouthChoirs]);
  
  const addYouthChoir = useCallback(async (newYouthChoirData: Omit<YouthChoir, 'id'>): Promise<{ success: boolean; youthChoir?: YouthChoir }> => {
    if (!firestore) return { success: false };
    const id = slugify(newYouthChoirData.title);
    
    if (youthChoirs.some(p => p.id === id)) {
      return { success: false };
    }

    const docRef = doc(firestore, 'youth-choirs', id);
    const newYouthChoir = { ...newYouthChoirData, id };
    await setDoc(docRef, newYouthChoirData);
    return { success: true, youthChoir: newYouthChoir };
  }, [firestore, youthChoirs]);

  const addYouthChoirs = useCallback(async (newYouthChoirsData: Omit<YouthChoir, 'id'>[]): Promise<{ addedCount: number, duplicates: number }> => {
    if (!firestore) return { addedCount: 0, duplicates: 0 };
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const existingTitles = new Set(youthChoirs.map(p => p.id));

    for (const youthChoirData of newYouthChoirsData) {
      const id = slugify(youthChoirData.title);
      if (existingTitles.has(id)) {
        duplicates++;
      } else {
        const docRef = doc(firestore, 'youth-choirs', id);
        batch.set(docRef, youthChoirData);
        addedCount++;
        existingTitles.add(id);
      }
    }
    
    if (addedCount > 0) {
      await batch.commit();
    }

    return { addedCount, duplicates };
  }, [firestore, youthChoirs]);

  const deleteYouthChoir = useCallback(async (youthChoirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'youth-choirs', youthChoirId);
    await deleteDoc(docRef);
  }, [firestore]);
  
  const updateYouthChoir = useCallback(async (youthChoirId: string, newYouthChoirData: Omit<YouthChoir, 'id'>): Promise<{ success: boolean, newId?: string, error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_not_ready' };
    const newId = slugify(newYouthChoirData.title);

    if (newId !== youthChoirId && youthChoirs.some(p => p.id === newId)) {
        return { success: false, error: 'duplicate' };
    }

    const oldDocRef = doc(firestore, 'youth-choirs', youthChoirId);
    
    if (newId !== youthChoirId) {
        const newDocRef = doc(firestore, 'youth-choirs', newId);
        const batch = writeBatch(firestore);
        batch.delete(oldDocRef);
        batch.set(newDocRef, newYouthChoirData);
        await batch.commit();
    } else {
        await setDoc(oldDocRef, newYouthChoirData, { merge: true });
    }
    
    return { success: true, newId: newId };
  }, [firestore, youthChoirs]);

  const getYouthChoirById = useCallback((id: string): YouthChoir | undefined => {
    return youthChoirs.find(p => p.id === id);
  }, [youthChoirs]);

  const value = { youthChoirs, addYouthChoir, addYouthChoirs, deleteYouthChoir, updateYouthChoir, getYouthChoirById, isLoaded };

  return <YouthChoirsContext.Provider value={value}>{children}</YouthChoirsContext.Provider>;
}

export function useYouthChoirs() {
  const context = useContext(YouthChoirsContext);
  if (context === undefined) {
    throw new Error('useYouthChoirs must be used within a YouthChoirsProvider');
  }
  return context;
}

    