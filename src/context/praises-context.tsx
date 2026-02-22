"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { Praise } from '@/lib/praises';
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

interface PraisesContextType {
  praises: Praise[];
  pendingPraises: Praise[];
  addPraise: (newPraiseData: Omit<Praise, 'id'>) => void;
  addPraises: (newPraisesData: Omit<Praise, 'id'>[]) => void;
  deletePraise: (praiseId: string) => void;
  updatePraise: (praiseId: string, newPraiseData: Omit<Praise, 'id'>) => void;
  approvePraise: (praiseId: string) => void;
  getPraiseById: (id: string) => Praise | undefined;
  restorePraises: (praisesToRestore: Omit<Praise, 'id'>[]) => void;
  isLoaded: boolean;
}

const PraisesContext = createContext<PraisesContextType | undefined>(undefined);

export function PraisesProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const praisesCollectionRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'praises') : null
  , [firestore]);
  
  const { data: rawPraises, isLoading: isLoadingFromHook } = useCollection<Praise>(praisesCollectionRef);

  const isLoaded = !!firestore && !isLoadingFromHook;

  const praises = useMemo(() => {
    return rawPraises ? [...rawPraises].filter(p => p.status !== 'pending').sort((a, b) => a.title.localeCompare(b.title)) : [];
  }, [rawPraises]);
  
  const pendingPraises = useMemo(() => {
    return rawPraises ? [...rawPraises].filter(p => p.status === 'pending').sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)) : [];
  }, [rawPraises]);
  
  const addPraise = useCallback((newPraiseData: Omit<Praise, 'id'>) => {
    if (!firestore) return;
    const id = slugify(newPraiseData.title);
    
    if ((rawPraises || []).some(p => p.id === id)) {
      toast({ variant: 'destructive', title: 'Error', description: 'Ya existe una alabanza con ese título.' });
      return;
    }

    const docRef = doc(firestore, 'praises', id);
    const dataToSave = { 
        ...newPraiseData,
        status: 'pending' as const,
        createdAt: serverTimestamp() 
    };

    setDoc(docRef, removeUndefined(dataToSave))
      .then(() => {
        toast({ title: 'Alabanza Enviada a Revisión', description: `La alabanza "${newPraiseData.title}" ha sido enviada.` });
      })
      .catch((error) => {
        console.error("Error adding praise:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: dataToSave
        }));
        toast({ variant: 'destructive', title: 'Error al Enviar', description: 'No se pudo enviar la alabanza.' });
      });

  }, [firestore, rawPraises, toast]);

  const addPraises = useCallback((newPraisesData: Omit<Praise, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const existingTitles = new Set((rawPraises || []).map(p => p.id));

    for (const praiseData of newPraisesData) {
      const id = slugify(praiseData.title);
      if (existingTitles.has(id)) {
        duplicates++;
      } else {
        const docRef = doc(firestore, 'praises', id);
        const dataToSave = { 
            ...praiseData,
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
          console.error("Error adding praises in batch:", error);
          toast({ variant: 'destructive', title: 'Error al Enviar', description: 'No se pudieron enviar las alabanzas.' });
        });
    } else {
      toast({ title: 'No se agregaron alabanzas', description: `Se encontraron ${duplicates} duplicados.` });
    }
  }, [firestore, rawPraises, toast]);

  const approvePraise = useCallback((praiseId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'praises', praiseId);
    updateDoc(docRef, { status: 'approved' })
      .then(() => {
        toast({ title: 'Alabanza Aprobada', description: `La alabanza ahora es visible para todos.` });
      })
      .catch((error) => {
        console.error("Error approving praise:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update' }));
        toast({ variant: 'destructive', title: 'Error', description: 'No se pudo aprobar la alabanza.' });
      });
  }, [firestore, toast]);

  const deletePraise = useCallback((praiseId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'praises', praiseId);
    deleteDoc(docRef)
      .then(() => {
        toast({ title: 'Alabanza Eliminada', description: 'La alabanza se ha eliminado de la lista.' });
      })
      .catch((error) => {
        console.error("Error deleting praise:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
        toast({ variant: 'destructive', title: 'Error al eliminar', description: 'No se pudo eliminar la alabanza.' });
      });
  }, [firestore, toast]);
  
  const updatePraise = useCallback((praiseId: string, newPraiseData: Omit<Praise, 'id'>) => {
    if (!firestore) return;
    const newId = slugify(newPraiseData.title);
    
    if (newId !== praiseId && (rawPraises || []).some(p => p.id === newId)) {
      toast({ variant: 'destructive', title: 'Error al actualizar', description: 'Ya existe una alabanza con ese título.' });
      return;
    }

    const oldDocRef = doc(firestore, 'praises', praiseId);
    const dataToSave = removeUndefined(newPraiseData);

    const handleSuccess = () => {
      toast({ title: "Alabanza Actualizada", description: `La alabanza "${newPraiseData.title}" se ha guardado correctamente.` });
       if (newId !== praiseId) {
          router.replace(`/praises/${newId}`);
       }
    };
    const handleError = (error: any) => {
      console.error("Error updating praise:", error);
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: oldDocRef.path,
        operation: 'update',
        requestResourceData: dataToSave
      }));
      toast({ variant: 'destructive', title: 'Error al actualizar', description: 'No se pudo guardar el cambio.' });
    };
    
    if (newId !== praiseId) {
        const newDocRef = doc(firestore, 'praises', newId);
        const batch = writeBatch(firestore);
        batch.delete(oldDocRef);
        batch.set(newDocRef, dataToSave);
        batch.commit().then(handleSuccess).catch(handleError);
    } else {
        setDoc(oldDocRef, dataToSave, { merge: true }).then(handleSuccess).catch(handleError);
    }
  }, [firestore, rawPraises, toast, router]);

  const getPraiseById = useCallback((id: string): Praise | undefined => {
    return (rawPraises || []).find(p => p.id === id);
  }, [rawPraises]);

  const restorePraises = useCallback((praisesToRestore: Omit<Praise, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);

    (rawPraises || []).forEach(praise => {
      const docRef = doc(firestore, 'praises', praise.id);
      batch.delete(docRef);
    });
    
    praisesToRestore.forEach(praiseData => {
      const id = slugify(praiseData.title);
      const docRef = doc(firestore, 'praises', id);
      const dataWithStatus = { ...praiseData, status: 'approved' as const };
      batch.set(docRef, removeUndefined(dataWithStatus));
    });

    batch.commit().catch(error => console.error("Error restoring praises:", error));
  }, [firestore, rawPraises]);

  const value = { praises, pendingPraises, addPraise, addPraises, deletePraise, updatePraise, approvePraise, getPraiseById, restorePraises, isLoaded };

  return <PraisesContext.Provider value={value}>{children}</PraisesContext.Provider>;
}

export function usePraises() {
  const context = useContext(PraisesContext);
  if (context === undefined) {
    throw new Error('usePraises must be used within a PraisesProvider');
  }
  return context;
}
