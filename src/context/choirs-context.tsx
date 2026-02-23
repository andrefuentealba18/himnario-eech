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
  addChoir: (newChoirData: Omit<Choir, 'id'>) => void;
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
  
  const addChoir = useCallback((newChoirData: Omit<Choir, 'id'>) => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo conectar a la base de datos.' });
      return;
    }
    const id = slugify(newChoirData.title);
    
    if ((rawChoirs || []).some(p => p.id === id)) {
      toast({ variant: 'destructive', title: 'Error', description: 'Ya existe un coro con ese título.' });
      return;
    }

    const docRef = doc(firestore, 'choirs', id);
    const dataToSave = { 
        ...newChoirData,
        status: 'pending' as const,
        createdAt: serverTimestamp() 
    };
    
    setDoc(docRef, removeUndefined(dataToSave))
      .then(() => {
        toast({ title: 'Coro Enviado', description: 'Será revisado por un administrador.' });
      })
      .catch((error) => {
        console.error("Error adding choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: dataToSave
        }));
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo enviar el coro.' });
      });
  }, [firestore, rawChoirs, toast]);

  const addChoirs = useCallback((newChoirsData: Omit<Choir, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const existingTitles = new Set((rawChoirs || []).map(p => p.id));

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
      batch.commit()
        .then(() => {
          toast({ title: 'Coros Enviados', description: `${addedCount} coros enviados a revisión. Se omitieron ${duplicates} duplicados.` });
        })
        .catch((error) => {
          console.error("Error adding choirs in batch:", error);
          toast({ variant: 'destructive', title: 'Error al Enviar', description: 'No se pudieron enviar los coros.' });
        });
    } else {
      toast({ title: 'No se agregaron coros', description: `Se encontraron ${duplicates} duplicados.` });
    }
  }, [firestore, rawChoirs, toast]);

  const approveChoir = useCallback((choirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'choirs', choirId);
    updateDoc(docRef, { status: 'approved' })
      .then(() => {
        toast({ title: 'Coro Aprobado', description: `El coro ahora es visible para todos.` });
      })
      .catch((error) => {
        console.error("Error approving choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update' }));
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo aprobar el coro.' });
      });
  }, [firestore, toast]);

  const deleteChoir = useCallback((choirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'choirs', choirId);
    deleteDoc(docRef)
      .then(() => {
        toast({ title: 'Coro Eliminado', description: 'El coro se ha eliminado de la lista.' });
      })
      .catch((error) => {
        console.error("Error deleting choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
        toast({ variant: 'destructive', title: 'Error al eliminar', description: 'No se pudo eliminar el coro.' });
      });
  }, [firestore, toast]);
  
  const updateChoir = useCallback(async (choirId: string, newChoirData: Omit<Choir, 'id'>): Promise<{ success: boolean; error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_unavailable' };
    const newId = slugify(newChoirData.title);
    
    if (newId !== choirId && (rawChoirs || []).some(p => p.id === newId)) {
      return { success: false, error: 'duplicate' };
    }

    const oldDocRef = doc(firestore, 'choirs', choirId);
    const dataToSave = removeUndefined(newChoirData);

    const handleError = (error: any) => {
      console.error("Error updating choir:", error);
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: oldDocRef.path,
        operation: 'update',
        requestResourceData: dataToSave
      }));
    };

    if (newId !== choirId) {
        const newDocRef = doc(firestore, 'choirs', newId);
        const batch = writeBatch(firestore);
        batch.delete(oldDocRef);
        batch.set(newDocRef, dataToSave);
        batch.commit().catch(handleError);
    } else {
        setDoc(oldDocRef, dataToSave, { merge: true }).catch(handleError);
    }
    return { success: true };
  }, [firestore, rawChoirs]);

  const getChoirById = useCallback((id: string): Choir | undefined => {
    return (rawChoirs || []).find(p => p.id === id);
  }, [rawChoirs]);

  const restoreChoirs = useCallback((choirsToRestore: Omit<Choir, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
  
    (rawChoirs || []).forEach(choir => {
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
