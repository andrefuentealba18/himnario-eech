"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { YouthChoir } from '@/lib/youth-choirs';
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

interface YouthChoirsContextType {
  youthChoirs: YouthChoir[];
  pendingYouthChoirs: YouthChoir[];
  addYouthChoir: (newYouthChoirData: Omit<YouthChoir, 'id'>) => Promise<{ success: boolean; youthChoir?: YouthChoir }>;
  addYouthChoirs: (newYouthChoirsData: Omit<YouthChoir, 'id'>[]) => Promise<{ addedCount: number, duplicates: number }>;
  deleteYouthChoir: (youthChoirId: string) => Promise<void>;
  updateYouthChoir: (youthChoirId: string, newYouthChoirData: Omit<YouthChoir, 'id'>) => Promise<{ success: boolean, newId?: string, error?: string }>;
  approveYouthChoir: (youthChoirId: string) => Promise<void>;
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
    return rawYouthChoirs ? [...rawYouthChoirs].filter(yc => yc.status !== 'pending').sort((a, b) => a.title.localeCompare(b.title)) : [];
  }, [rawYouthChoirs]);
  
  const pendingYouthChoirs = useMemo(() => {
    return rawYouthChoirs ? [...rawYouthChoirs].filter(yc => yc.status === 'pending').sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)) : [];
  }, [rawYouthChoirs]);
  
  const addYouthChoir = useCallback(async (newYouthChoirData: Omit<YouthChoir, 'id'>): Promise<{ success: boolean; youthChoir?: YouthChoir }> => {
    if (!firestore) return { success: false };
    const id = slugify(newYouthChoirData.title);
    
    const allYouthChoirs = rawYouthChoirs || [];
    if (allYouthChoirs.some(p => p.id === id)) {
      return { success: false };
    }

    const docRef = doc(firestore, 'youth-choirs', id);
    const dataToSave = { 
        ...newYouthChoirData,
        status: 'pending' as const,
        createdAt: serverTimestamp() 
    };
    await setDoc(docRef, removeUndefined(dataToSave));
    return { success: true, youthChoir: { ...newYouthChoirData, id } };
  }, [firestore, rawYouthChoirs]);

  const addYouthChoirs = useCallback(async (newYouthChoirsData: Omit<YouthChoir, 'id'>[]): Promise<{ addedCount: number, duplicates: number }> => {
    if (!firestore) return { addedCount: 0, duplicates: 0 };
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const allYouthChoirs = rawYouthChoirs || [];
    const existingTitles = new Set(allYouthChoirs.map(p => p.id));

    for (const youthChoirData of newYouthChoirsData) {
      const id = slugify(youthChoirData.title);
      if (existingTitles.has(id)) {
        duplicates++;
      } else {
        const docRef = doc(firestore, 'youth-choirs', id);
        const dataToSave = { 
            ...youthChoirData,
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
  }, [firestore, rawYouthChoirs]);

  const approveYouthChoir = useCallback(async (youthChoirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'youth-choirs', youthChoirId);
    await updateDoc(docRef, { status: 'approved' });
  }, [firestore]);

  const deleteYouthChoir = useCallback(async (youthChoirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'youth-choirs', youthChoirId);
    await deleteDoc(docRef);
  }, [firestore]);
  
  const updateYouthChoir = useCallback(async (youthChoirId: string, newYouthChoirData: Omit<YouthChoir, 'id'>): Promise<{ success: boolean, newId?: string, error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_not_ready' };
    const newId = slugify(newYouthChoirData.title);

    const allYouthChoirs = rawYouthChoirs || [];
    if (newId !== youthChoirId && allYouthChoirs.some(p => p.id === newId)) {
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
      console.error("Error updating youth choir:", error);
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: oldDocRef.path,
        operation: 'update',
        requestResourceData: dataToSave
      }));
      return { success: false, error: 'permission_denied' };
    }
  }, [firestore, rawYouthChoirs]);

  const getYouthChoirById = useCallback((id: string): YouthChoir | undefined => {
    return (rawYouthChoirs || []).find(p => p.id === id);
  }, [rawYouthChoirs]);

  const restoreYouthChoirs = useCallback(async (youthChoirsToRestore: Omit<YouthChoir, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
  
    // Delete all existing documents
    (rawYouthChoirs || []).forEach(yc => {
      const docRef = doc(firestore, 'youth-choirs', yc.id);
      batch.delete(docRef);
    });
    
    // Add new documents from backup
    youthChoirsToRestore.forEach(ycData => {
      const id = slugify(ycData.title);
      const docRef = doc(firestore, 'youth-choirs', id);
      const dataWithStatus = { ...ycData, status: 'approved' as const };
      batch.set(docRef, removeUndefined(dataWithStatus));
    });
  
    await batch.commit();
  }, [firestore, rawYouthChoirs]);

  const value = { youthChoirs, pendingYouthChoirs, addYouthChoir, addYouthChoirs, approveYouthChoir, deleteYouthChoir, updateYouthChoir, getYouthChoirById, restoreYouthChoirs, isLoaded };

  return <YouthChoirsContext.Provider value={value}>{children}</YouthChoirsContext.Provider>;
}

export function useYouthChoirs() {
  const context = useContext(YouthChoirsContext);
  if (context === undefined) {
    throw new Error('useYouthChoirs must be used within a YouthChoirsProvider');
  }
  return context;
}
