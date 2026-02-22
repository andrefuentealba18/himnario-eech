"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { YouthChoir } from '@/lib/youth-choirs';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

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
  addYouthChoir: (newYouthChoirData: Omit<YouthChoir, 'id'>) => void;
  addYouthChoirs: (newYouthChoirsData: Omit<YouthChoir, 'id'>[]) => void;
  deleteYouthChoir: (youthChoirId: string) => void;
  updateYouthChoir: (youthChoirId: string, newYouthChoirData: Omit<YouthChoir, 'id'>) => void;
  approveYouthChoir: (youthChoirId: string) => void;
  getYouthChoirById: (id: string) => YouthChoir | undefined;
  restoreYouthChoirs: (youthChoirsToRestore: Omit<YouthChoir, 'id'>[]) => void;
  isLoaded: boolean;
}

const YouthChoirsContext = createContext<YouthChoirsContextType | undefined>(undefined);

export function YouthChoirsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
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
  
  const addYouthChoir = useCallback((newYouthChoirData: Omit<YouthChoir, 'id'>) => {
    if (!firestore) return;
    const id = slugify(newYouthChoirData.title);
    
    if ((rawYouthChoirs || []).some(p => p.id === id)) {
      toast({ variant: 'destructive', title: 'Error', description: 'Ya existe una alabanza con ese título.' });
      return;
    }

    const docRef = doc(firestore, 'youth-choirs', id);
    const dataToSave = { 
        ...newYouthChoirData,
        status: 'pending' as const,
        createdAt: serverTimestamp() 
    };

    setDoc(docRef, removeUndefined(dataToSave))
      .then(() => {
        toast({ title: 'Alabanza Enviada a Revisión', description: `La alabanza "${newYouthChoirData.title}" ha sido enviada.` });
      })
      .catch((error) => {
        console.error("Error adding youth choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: dataToSave
        }));
        toast({ variant: 'destructive', title: 'Error al Enviar', description: 'No se pudo enviar la alabanza.' });
      });
  }, [firestore, rawYouthChoirs, toast]);

  const addYouthChoirs = useCallback((newYouthChoirsData: Omit<YouthChoir, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const existingTitles = new Set((rawYouthChoirs || []).map(p => p.id));

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
      batch.commit()
        .then(() => {
          toast({ title: 'Alabanzas Enviadas a Revisión', description: `Se enviaron ${addedCount} alabanzas nuevas. Se ignoraron ${duplicates} duplicados.` });
        })
        .catch((error) => {
          console.error("Error adding youth choirs in batch:", error);
          toast({ variant: 'destructive', title: 'Error al Enviar', description: 'No se pudieron enviar las alabanzas.' });
        });
    } else {
      toast({ title: 'No se agregaron alabanzas', description: `Se encontraron ${duplicates} duplicados.` });
    }
  }, [firestore, rawYouthChoirs, toast]);

  const approveYouthChoir = useCallback((youthChoirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'youth-choirs', youthChoirId);
    updateDoc(docRef, { status: 'approved' })
      .then(() => {
        toast({ title: 'Alabanza Aprobada', description: `La alabanza ahora es visible para todos.` });
      })
      .catch((error) => {
        console.error("Error approving youth choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update' }));
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo aprobar la alabanza.' });
      });
  }, [firestore, toast]);

  const deleteYouthChoir = useCallback((youthChoirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'youth-choirs', youthChoirId);
    deleteDoc(docRef)
      .then(() => {
        toast({ title: 'Alabanza Eliminada', description: 'La alabanza se ha eliminado de la lista.' });
      })
      .catch((error) => {
        console.error("Error deleting youth choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
        toast({ variant: 'destructive', title: 'Error al eliminar', description: 'No se pudo eliminar la alabanza.' });
      });
  }, [firestore, toast]);
  
  const updateYouthChoir = useCallback((youthChoirId: string, newYouthChoirData: Omit<YouthChoir, 'id'>) => {
    if (!firestore) return;
    const newId = slugify(newYouthChoirData.title);

    if (newId !== youthChoirId && (rawYouthChoirs || []).some(p => p.id === newId)) {
      toast({ variant: 'destructive', title: 'Error al actualizar', description: 'Ya existe una alabanza con ese título.' });
      return;
    }

    const oldDocRef = doc(firestore, 'youth-choirs', youthChoirId);
    const dataToSave = removeUndefined(newYouthChoirData);
    
    const handleSuccess = () => {
      toast({ title: "Alabanza Actualizada", description: `La alabanza "${newYouthChoirData.title}" se ha guardado correctamente.` });
      if (newId !== youthChoirId) {
        router.replace(`/youth-choirs/${newId}`);
      }
    };
    const handleError = (error: any) => {
      console.error("Error updating youth choir:", error);
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: oldDocRef.path,
        operation: 'update',
        requestResourceData: dataToSave
      }));
      toast({ variant: 'destructive', title: 'Error al actualizar', description: 'No se pudo guardar el cambio.' });
    };

    if (newId !== youthChoirId) {
        const newDocRef = doc(firestore, 'youth-choirs', newId);
        const batch = writeBatch(firestore);
        batch.delete(oldDocRef);
        batch.set(newDocRef, dataToSave);
        batch.commit().then(handleSuccess).catch(handleError);
    } else {
        setDoc(oldDocRef, dataToSave, { merge: true }).then(handleSuccess).catch(handleError);
    }
  }, [firestore, rawYouthChoirs, toast, router]);

  const getYouthChoirById = useCallback((id: string): YouthChoir | undefined => {
    return (rawYouthChoirs || []).find(p => p.id === id);
  }, [rawYouthChoirs]);

  const restoreYouthChoirs = useCallback((youthChoirsToRestore: Omit<YouthChoir, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
  
    (rawYouthChoirs || []).forEach(yc => {
      const docRef = doc(firestore, 'youth-choirs', yc.id);
      batch.delete(docRef);
    });
    
    youthChoirsToRestore.forEach(ycData => {
      const id = slugify(ycData.title);
      const docRef = doc(firestore, 'youth-choirs', id);
      const dataWithStatus = { ...ycData, status: 'approved' as const };
      batch.set(docRef, removeUndefined(dataWithStatus));
    });
  
    batch.commit().catch(error => console.error("Error restoring youth choirs:", error));
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
