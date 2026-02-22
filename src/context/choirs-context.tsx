"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { Choir } from '@/lib/choirs';
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

interface ChoirsContextType {
  choirs: Choir[];
  pendingChoirs: Choir[];
  addChoir: (newChoirData: Omit<Choir, 'id'>) => Promise<{ success: boolean; choir?: Choir }>;
  addChoirs: (newChoirsData: Omit<Choir, 'id'>[]) => Promise<{ addedCount: number, duplicates: number }>;
  deleteChoir: (choirId: string) => Promise<void>;
  updateChoir: (choirId: string, newChoirData: Omit<Choir, 'id'>) => Promise<{ success: boolean, newId?: string, error?: string }>;
  approveChoir: (choirId: string) => Promise<void>;
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
    return rawChoirs ? [...rawChoirs].filter(c => c.status !== 'pending').sort((a, b) => a.title.localeCompare(b.title)) : [];
  }, [rawChoirs]);
  
  const pendingChoirs = useMemo(() => {
    return rawChoirs ? [...rawChoirs].filter(c => c.status === 'pending').sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)) : [];
  }, [rawChoirs]);
  
  const addChoir = useCallback(async (newChoirData: Omit<Choir, 'id'>): Promise<{ success: boolean; choir?: Choir }> => {
    if (!firestore) return { success: false };
    const id = slugify(newChoirData.title);
    
    const allChoirs = rawChoirs || [];
    if (allChoirs.some(p => p.id === id)) {
      return { success: false };
    }

    const docRef = doc(firestore, 'choirs', id);
    const dataToSave = { 
        ...newChoirData,
        status: 'pending' as const,
        createdAt: serverTimestamp() 
    };
    await setDoc(docRef, removeUndefined(dataToSave));
    return { success: true, choir: { ...newChoirData, id } };
  }, [firestore, rawChoirs]);

  const addChoirs = useCallback(async (newChoirsData: Omit<Choir, 'id'>[]): Promise<{ addedCount: number, duplicates: number }> => {
    if (!firestore) return { addedCount: 0, duplicates: 0 };
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const allChoirs = rawChoirs || [];
    const existingTitles = new Set(allChoirs.map(p => p.id));

    for (const choirData of newChoirsData) {
      const id = slugify(choirData.title);
      if (existingTitles.has(id)) {
        duplicates++;
      } else {
        const docRef = doc(firestore, 'choirs', id);
        const dataToSave = { 
            ...choirData,
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
  }, [firestore, rawChoirs]);

  const approveChoir = useCallback(async (choirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'choirs', choirId);
    await updateDoc(docRef, { status: 'approved' });
  }, [firestore]);

  const deleteChoir = useCallback(async (choirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'choirs', choirId);
    await deleteDoc(docRef);
  }, [firestore]);
  
  const updateChoir = useCallback(async (choirId: string, newChoirData: Omit<Choir, 'id'>): Promise<{ success: boolean, newId?: string, error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_not_ready' };
    const newId = slugify(newChoirData.title);
    
    const allChoirs = rawChoirs || [];
    if (newId !== choirId && allChoirs.some(p => p.id === newId)) {
        return { success: false, error: 'duplicate' };
    }

    const oldDocRef = doc(firestore, 'choirs', choirId);
    const dataToSave = removeUndefined(newChoirData);
    
    try {
      if (newId !== choirId) {
          const newDocRef = doc(firestore, 'choirs', newId);
          const batch = writeBatch(firestore);
          batch.delete(oldDocRef);
          batch.set(newDocRef, dataToSave);
          await batch.commit();
      } else {
          await setDoc(oldDocRef, dataToSave, { merge: true });
      }
      return { success: true, newId: newId };
    } catch(error) {
        console.error("Error updating choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: oldDocRef.path,
            operation: 'update',
            requestResourceData: dataToSave
        }));
        return { success: false, error: 'permission_denied' };
    }
  }, [firestore, rawChoirs]);

  const getChoirById = useCallback((id: string): Choir | undefined => {
    return (rawChoirs || []).find(p => p.id === id);
  }, [rawChoirs]);

  const restoreChoirs = useCallback(async (choirsToRestore: Omit<Choir, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
  
    // Delete all existing documents
    (rawChoirs || []).forEach(choir => {
      const docRef = doc(firestore, 'choirs', choir.id);
      batch.delete(docRef);
    });
    
    // Add new documents from backup
    choirsToRestore.forEach(choirData => {
      const id = slugify(choirData.title);
      const docRef = doc(firestore, 'choirs', id);
      const dataWithStatus = { ...choirData, status: 'approved' as const };
      batch.set(docRef, removeUndefined(dataWithStatus));
    });
  
    await batch.commit();
  }, [firestore, rawChoirs]);

  const value = { choirs, pendingChoirs, addChoir, addChoirs, approveChoir, deleteChoir, updateChoir, getChoirById, restoreChoirs, isLoaded };

  return <ChoirsContext.Provider value={value}>{children}</ChoirsContext.Provider>;
}

export function useChoirs() {
  const context = useContext(ChoirsContext);
  if (context === undefined) {
    throw new Error('useChoirs must be used within a ChoirsProvider');
  }
  return context;
}
