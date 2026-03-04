
"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { Praise } from '@/lib/praises';
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

interface PraisesContextType {
  praises: Praise[];
  pendingPraises: Praise[];
  addPraise: (newPraiseData: Omit<Praise, 'id'>) => Promise<{ success: boolean }>;
  addPraises: (newPraisesData: Omit<Praise, 'id'>[]) => void;
  deletePraise: (praiseId: string) => void;
  updatePraise: (praiseId: string, newPraiseData: Omit<Praise, 'id'>) => Promise<{ success: boolean; error?: string }>;
  approvePraise: (praiseId: string) => void;
  getPraiseById: (id: string) => Praise | undefined;
  restorePraises: (praisesToRestore: Omit<Praise, 'id'>[]) => void;
  isLoaded: boolean;
}

const PraisesContext = createContext<PraisesContextType | undefined>(undefined);

export function PraisesProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const praisesCollection = useMemoFirebase(() => 
    firestore ? collection(firestore, 'praises') : null
  , [firestore]);

  const { data: allData, isLoading } = useCollection<Praise>(praisesCollection);

  const isLoaded = !!firestore && !isLoading;

  const praises = useMemo(() => {
    if (!allData) return [];
    return allData
      .filter(p => p.status === 'approved' || !p.status)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [allData]);
  
  const pendingPraises = useMemo(() => {
    if (!allData) return [];
    return allData
      .filter(p => p.status === 'pending')
      .sort((a, b) => {
        const tA = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || Date.now();
        const tB = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || Date.now();
        return tB - tA;
      });
  }, [allData]);
  
  const addPraise = useCallback(async (newPraiseData: Omit<Praise, 'id'>) => {
    if (!firestore) return { success: false };
    
    // Generamos un ID único pero legible para evitar colisiones en revisión
    const id = `${slugify(newPraiseData.title)}-${Date.now().toString().slice(-4)}`;
    
    const docRef = doc(firestore, 'praises', id);
    const dataToSave = { 
        ...newPraiseData,
        status: 'pending' as const,
        createdAt: serverTimestamp() 
    };

    // Envío inmediato sin esperar al servidor
    setDoc(docRef, removeUndefined(dataToSave))
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: dataToSave
        }));
      });

    toast({ title: 'Enviada a Revisión', description: `"${newPraiseData.title}" aparecerá en el panel de administrador.` });
    return { success: true };
  }, [firestore, toast]);

  const addPraises = useCallback((newPraisesData: Omit<Praise, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    let addedCount = 0;

    for (const praiseData of newPraisesData) {
      const id = `${slugify(praiseData.title)}-${Date.now().toString().slice(-4)}-${addedCount}`;
      const docRef = doc(firestore, 'praises', id);
      const dataToSave = { 
          ...praiseData,
          status: 'pending' as const,
          createdAt: serverTimestamp() 
      };
      batch.set(docRef, removeUndefined(dataToSave));
      addedCount++;
    }
    
    if (addedCount > 0) {
      batch.commit()
        .then(() => {
          toast({ title: 'Lote Enviado', description: `Se enviaron ${addedCount} alabanzas a revisión.` });
        })
        .catch(() => {
          toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron guardar las alabanzas.' });
        });
    }
  }, [firestore, toast]);

  const approvePraise = useCallback((praiseId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'praises', praiseId);
    updateDoc(docRef, { status: 'approved' })
      .then(() => toast({ title: 'Alabanza Aprobada' }))
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update' }));
      });
  }, [firestore, toast]);

  const deletePraise = useCallback((praiseId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'praises', praiseId);
    deleteDoc(docRef)
      .then(() => toast({ title: 'Eliminado de revisión' }))
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
      });
  }, [firestore, toast]);
  
  const updatePraise = useCallback(async (praiseId: string, newPraiseData: Omit<Praise, 'id'>): Promise<{ success: boolean; error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_unavailable' };
    
    const docRef = doc(firestore, 'praises', praiseId);
    setDoc(docRef, removeUndefined(newPraiseData), { merge: true }).catch(e => console.error(e));
    
    return { success: true };
  }, [firestore]);

  const getPraiseById = useCallback((id: string): Praise | undefined => {
    return allData?.find(p => p.id === id);
  }, [allData]);

  const restorePraises = useCallback((praisesToRestore: Omit<Praise, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);

    allData?.forEach(praise => {
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
  }, [firestore, allData]);

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
