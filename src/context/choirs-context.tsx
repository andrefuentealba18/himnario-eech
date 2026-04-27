
"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo, useEffect } from 'react';
import type { Choir } from '@/lib/choirs';
import { initialChoirs } from '@/lib/choirs-initial';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

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
  addChoir: (newChoirData: Omit<Choir, 'id'>) => Promise<{ success: boolean }>;
  addChoirs: (newChoirsData: Omit<Choir, 'id'>[]) => void;
  deleteChoir: (choirId: string) => void;
  updateChoir: (choirId: string, newChoirData: Omit<Choir, 'id'>) => Promise<{ success: boolean; error?: string }>;
  approveChoir: (choirId: string) => void;
  getChoirById: (id: string) => Choir | undefined;
  restoreChoirs: (choirsToRestore: Omit<Choir, 'id'>[]) => void;
  isLoaded: boolean;
  isSyncing: boolean;
}

const ChoirsContext = createContext<ChoirsContextType | undefined>(undefined);

export function ChoirsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const choirsCollection = useMemoFirebase(() => 
    firestore ? collection(firestore, 'choirs') : null
  , [firestore]);

  const { data: allData, isLoading } = useCollection<Choir>(choirsCollection);

  const isSyncing = isLoading;
  const isLoaded = !!firestore && (!isLoading || (allData && allData.length > 0) || initialChoirs.length > 0);

  const choirs = useMemo(() => {
    if (!allData || allData.length === 0) {
      return initialChoirs.map(c => ({
        ...c,
        id: slugify(c.title),
        status: 'approved' as const
      })) as Choir[];
    }
    return allData
      .filter(c => c.status === 'approved' || !c.status)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [allData]);
  
  const pendingChoirs = useMemo(() => {
    if (!allData) return [];
    return allData
      .filter(c => c.status === 'pending')
      .sort((a, b) => {
        const tA = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || Date.now();
        const tB = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || Date.now();
        return tB - tA;
      });
  }, [allData]);

  useEffect(() => {
    if (!!firestore && !isLoading && allData?.length === 0) {
      const migrationFlag = 'choirs_migrated_v1';
      if (localStorage.getItem(migrationFlag)) return;

      console.log('Migrating initial choirs...');
      const batch = writeBatch(firestore!);
      initialChoirs.forEach((choir) => {
        const id = slugify(choir.title);
        const docRef = doc(firestore!, 'choirs', id);
        batch.set(docRef, removeUndefined({ ...choir, status: 'approved', createdAt: serverTimestamp() }));
      });

      batch.commit()
        .then(() => {
          localStorage.setItem(migrationFlag, 'true');
        })
        .catch((error) => console.error("Error migrating choirs:", error));
    }
  }, [isLoading, allData, firestore]);
  
  const addChoir = useCallback(async (newChoirData: Omit<Choir, 'id'>) => {
    if (!firestore) return { success: false };
    
    const id = `${slugify(newChoirData.title)}-${Date.now().toString().slice(-4)}`;
    const docRef = doc(firestore, 'choirs', id);
    const dataToSave = { 
        ...newChoirData,
        status: 'pending' as const,
        createdAt: serverTimestamp() 
    };
    
    setDoc(docRef, removeUndefined(dataToSave))
      .catch((error) => {
        console.error("Error adding choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: dataToSave
        }));
      });

    toast({ title: 'Enviado a Revisión', description: `El coro "${newChoirData.title}" ha sido enviado.` });
    return { success: true };
  }, [firestore, toast]);

  const addChoirs = useCallback((newChoirsData: Omit<Choir, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    let addedCount = 0;

    for (const choirData of newChoirsData) {
      const id = `${slugify(choirData.title)}-${Date.now().toString().slice(-4)}-${addedCount}`;
      const docRef = doc(firestore, 'choirs', id);
      const dataToSave = { 
          ...choirData,
          status: 'pending' as const,
          createdAt: serverTimestamp() 
      };
      batch.set(docRef, removeUndefined(dataToSave));
      addedCount++;
    }
    
    if (addedCount > 0) {
      batch.commit()
        .catch((error) => {
          console.error("Error bulk adding choirs:", error);
        });
      toast({ title: 'Enviados a Revisión', description: `Se han enviado ${addedCount} coros para revisión.` });
    }
  }, [firestore, toast]);

  const approveChoir = useCallback((choirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'choirs', choirId);
    updateDoc(docRef, { status: 'approved' })
      .catch((error) => {
        console.error("Error approving choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update' }));
      });
    toast({ title: 'Coro Aprobado' });
  }, [firestore, toast]);

  const deleteChoir = useCallback((choirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'choirs', choirId);
    deleteDoc(docRef)
      .catch((error) => {
        console.error("Error deleting choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
      });
    toast({ title: 'Coro eliminado' });
  }, [firestore, toast]);
  
  const updateChoir = useCallback(async (choirId: string, newChoirData: Omit<Choir, 'id'>): Promise<{ success: boolean; error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_unavailable' };
    
    const docRef = doc(firestore, 'choirs', choirId);
    setDoc(docRef, removeUndefined(newChoirData), { merge: true })
      .catch((error) => {
        console.error("Error updating choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: newChoirData
        }));
      });
    return { success: true };
  }, [firestore]);

  const getChoirById = useCallback((id: string): Choir | undefined => {
    return allData?.find(p => p.id === id);
  }, [allData]);

  const restoreChoirs = useCallback((choirsToRestore: Omit<Choir, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
  
    allData?.forEach(choir => {
      const docRef = doc(firestore, 'choirs', choir.id);
      batch.delete(docRef);
    });
    
    choirsToRestore.forEach(choirData => {
      const id = slugify(choirData.title);
      const docRef = doc(firestore, 'choirs', id);
      const dataWithStatus = { ... choirData, status: 'approved' as const };
      batch.set(docRef, removeUndefined(dataWithStatus));
    });
  
    batch.commit().catch(error => console.error("Error restoring choirs:", error));
  }, [firestore, allData]);

  const value = { choirs, pendingChoirs, addChoir, addChoirs, approveChoir, deleteChoir, updateChoir, getChoirById, restoreChoirs, isLoaded, isSyncing };

  return <ChoirsContext.Provider value={value}>{children}</ChoirsContext.Provider>;
}

export function useChoirs() {
  const context = useContext(ChoirsContext);
  if (context === undefined) {
    throw new Error('useChoirs must be used within a ChoirsProvider');
  }
  return context;
}
