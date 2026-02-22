"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { YouthChoir } from '@/lib/youth-choirs';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';

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

interface YouthChoirsContextType {
  youthChoirs: YouthChoir[];
  addYouthChoir: (newYouthChoirData: Omit<YouthChoir, 'id'>) => Promise<{ success: boolean; youthChoir?: YouthChoir }>;
  addYouthChoirs: (newYouthChoirsData: Omit<YouthChoir, 'id'>[]) => Promise<{ addedCount: number, duplicates: number }>;
  deleteYouthChoir: (youthChoirId: string) => Promise<void>;
  updateYouthChoir: (youthChoirId: string, newYouthChoirData: Omit<YouthChoir, 'id'>) => Promise<{ success: boolean, newId?: string, error?: string }>;
  getYouthChoirById: (id: string) => YouthChoir | undefined;
  restoreYouthChoirs: (youthChoirsToRestore: Omit<YouthChoir, 'id'>[]) => Promise<void>;
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
    await setDoc(docRef, removeUndefined(newYouthChoirData));
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
        batch.set(docRef, removeUndefined(youthChoirData));
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
    const dataToSave = removeUndefined(newYouthChoirData);
    
    try {
      if (newId !== youthChoirId) {
          const newDocRef = doc(firestore, 'youth-choirs', newId);
          const batch = writeBatch(firestore);
          batch.delete(oldDocRef);
          batch.set(newDocRef, dataToSave);
          await batch.commit();
      } else {
          await setDoc(oldDocRef, dataToSave, { merge: true });
      }
      return { success: true, newId: newId };
    } catch (error) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: oldDocRef.path,
        operation: 'update',
        requestResourceData: dataToSave
      }));
      throw error;
    }
  }, [firestore, youthChoirs]);

  const getYouthChoirById = useCallback((id: string): YouthChoir | undefined => {
    return youthChoirs.find(p => p.id === id);
  }, [youthChoirs]);

  const restoreYouthChoirs = useCallback(async (youthChoirsToRestore: Omit<YouthChoir, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
  
    // Delete all existing documents
    youthChoirs.forEach(yc => {
      const docRef = doc(firestore, 'youth-choirs', yc.id);
      batch.delete(docRef);
    });
    
    // Add new documents from backup
    youthChoirsToRestore.forEach(ycData => {
      const id = slugify(ycData.title);
      const docRef = doc(firestore, 'youth-choirs', id);
      batch.set(docRef, removeUndefined(ycData));
    });
  
    await batch.commit();
  }, [firestore, youthChoirs]);

  const value = { youthChoirs, addYouthChoir, addYouthChoirs, deleteYouthChoir, updateYouthChoir, getYouthChoirById, restoreYouthChoirs, isLoaded };

  return <YouthChoirsContext.Provider value={value}>{children}</YouthChoirsContext.Provider>;
}

export function useYouthChoirs() {
  const context = useContext(YouthChoirsContext);
  if (context === undefined) {
    throw new Error('useYouthChoirs must be used within a YouthChoirsProvider');
  }
  return context;
}
