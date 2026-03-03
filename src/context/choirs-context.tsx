
"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { Choir } from '@/lib/choirs';
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
}

const ChoirsContext = createContext<ChoirsContextType | undefined>(undefined);

export function ChoirsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const choirsCollection = useMemoFirebase(() => 
    firestore ? collection(firestore, 'choirs') : null
  , [firestore]);

  const { data: allData, isLoading } = useCollection<Choir>(choirsCollection);

  const isLoaded = !!firestore && !isLoading;

  const choirs = useMemo(() => {
    if (!allData) return [];
    // MOSTRAR: Las aprobadas O las que no tienen estado (los 200+ coros originales)
    return allData
      .filter(c => c.status === 'approved' || !c.status)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [allData]);
  
  const pendingChoirs = useMemo(() => {
    if (!allData) return [];
    return allData
      .filter(c => c.status === 'pending')
      .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  }, [allData]);
  
  const addChoir = useCallback(async (newChoirData: Omit<Choir, 'id'>) => {
    if (!firestore) return { success: false };
    const id = slugify(newChoirData.title);
    
    if (choirs.some(p => p.id === id) || pendingChoirs.some(p => p.id === id)) {
      toast({ variant: 'destructive', title: 'Error', description: 'Ya existe un coro con ese título.' });
      return { success: false };
    }

    const docRef = doc(firestore, 'choirs', id);
    const dataToSave = { 
        ...newChoirData,
        status: 'approved' as const, // Aprobación directa para visibilidad inmediata
        createdAt: serverTimestamp() 
    };
    
    try {
      await setDoc(docRef, removeUndefined(dataToSave));
      toast({ title: 'Coro Guardado', description: `"${newChoirData.title}" ha sido agregado.` });
      return { success: true };
    } catch (error) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'create',
        requestResourceData: dataToSave
      }));
      return { success: false };
    }
  }, [firestore, choirs, pendingChoirs, toast]);

  const addChoirs = useCallback((newChoirsData: Omit<Choir, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const existingIds = new Set([...choirs.map(p => p.id), ...pendingChoirs.map(p => p.id)]);

    for (const choirData of newChoirsData) {
      const id = slugify(choirData.title);
      if (existingIds.has(id)) {
        duplicates++;
      } else {
        const docRef = doc(firestore, 'choirs', id);
        const dataToSave = { 
            ...choirData,
            status: 'approved' as const,
            createdAt: serverTimestamp() 
        };
        batch.set(docRef, removeUndefined(dataToSave));
        addedCount++;
        existingIds.add(id);
      }
    }
    
    if (addedCount > 0) {
      batch.commit()
        .then(() => {
          toast({ title: 'Coros Agregados', description: `Se han agregado ${addedCount} coros correctamente.` });
        })
        .catch(() => {
          toast({ variant: 'destructive', title: 'Error al Enviar', description: 'No se pudieron guardar los coros.' });
        });
    }
  }, [firestore, choirs, pendingChoirs, toast]);

  const approveChoir = useCallback((choirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'choirs', choirId);
    updateDoc(docRef, { status: 'approved' })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update' }));
      });
  }, [firestore]);

  const deleteChoir = useCallback((choirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'choirs', choirId);
    deleteDoc(docRef)
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
      });
  }, [firestore]);
  
  const updateChoir = useCallback(async (choirId: string, newChoirData: Omit<Choir, 'id'>): Promise<{ success: boolean; error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_unavailable' };
    const newId = slugify(newChoirData.title);
    
    if (newId !== choirId && (choirs.some(p => p.id === newId) || pendingChoirs.some(p => p.id === newId))) {
      return { success: false, error: 'duplicate' };
    }

    const oldDocRef = doc(firestore, 'choirs', choirId);
    const dataToSave = removeUndefined(newChoirData);

    if (newId !== choirId) {
        const newDocRef = doc(firestore, 'choirs', newId);
        const batch = writeBatch(firestore);
        batch.delete(oldDocRef);
        batch.set(newDocRef, dataToSave);
        await batch.commit().catch(e => console.error(e));
    } else {
        await setDoc(oldDocRef, dataToSave, { merge: true }).catch(e => console.error(e));
    }
    return { success: true };
  }, [firestore, choirs, pendingChoirs]);

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
      const dataWithStatus = { ...choirData, status: 'approved' as const };
      batch.set(docRef, removeUndefined(dataWithStatus));
    });
  
    batch.commit().catch(error => console.error("Error restoring choirs:", error));
  }, [firestore, allData]);

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
