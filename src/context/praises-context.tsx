
"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { Praise } from '@/lib/praises';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch, serverTimestamp, updateDoc, query } from 'firebase/firestore';
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
  
  // Obtenemos toda la colección para manejar el filtrado por estado localmente
  // Esto asegura que las canciones antiguas (sin el campo 'status') vuelvan a aparecer
  const praisesCollection = useMemoFirebase(() => 
    firestore ? collection(firestore, 'praises') : null
  , [firestore]);

  const { data: allData, isLoading } = useCollection<Praise>(praisesCollection);

  const isLoaded = !!firestore && !isLoading;

  const praises = useMemo(() => {
    if (!allData) return [];
    // MOSTRAR: Las aprobadas O las que no tienen estado (tus 560 canciones originales)
    return allData
      .filter(p => p.status === 'approved' || !p.status)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [allData]);
  
  const pendingPraises = useMemo(() => {
    if (!allData) return [];
    return allData
      .filter(p => p.status === 'pending')
      .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  }, [allData]);
  
  const addPraise = useCallback(async (newPraiseData: Omit<Praise, 'id'>) => {
    if (!firestore) return { success: false };
    const id = slugify(newPraiseData.title);
    
    if (praises.some(p => p.id === id) || pendingPraises.some(p => p.id === id)) {
      toast({ variant: 'destructive', title: 'Error', description: 'Ya existe una alabanza con ese título.' });
      return { success: false };
    }

    const docRef = doc(firestore, 'praises', id);
    const dataToSave = { 
        ...newPraiseData,
        status: 'approved' as const, // Guardar como aprobada por defecto para que aparezca altiro
        createdAt: serverTimestamp() 
    };

    try {
      await setDoc(docRef, removeUndefined(dataToSave));
      toast({ title: 'Alabanza Guardada', description: `"${newPraiseData.title}" ha sido agregada.` });
      return { success: true };
    } catch (error) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'create',
        requestResourceData: dataToSave
      }));
      return { success: false };
    }
  }, [firestore, praises, pendingPraises, toast]);

  const addPraises = useCallback((newPraisesData: Omit<Praise, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const existingIds = new Set([...praises.map(p => p.id), ...pendingPraises.map(p => p.id)]);

    for (const praiseData of newPraisesData) {
      const id = slugify(praiseData.title);
      if (existingIds.has(id)) {
        duplicates++;
      } else {
        const docRef = doc(firestore, 'praises', id);
        const dataToSave = { 
            ...praiseData,
            status: 'approved' as const, // Importar como aprobadas directamente
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
          toast({ title: 'Alabanzas Agregadas', description: `Se han agregado ${addedCount} alabanzas correctamente.` });
        })
        .catch(() => {
          toast({ variant: 'destructive', title: 'Error al Enviar', description: 'No se pudieron guardar las alabanzas.' });
        });
    }
  }, [firestore, praises, pendingPraises, toast]);

  const approvePraise = useCallback((praiseId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'praises', praiseId);
    updateDoc(docRef, { status: 'approved' })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update' }));
      });
  }, [firestore]);

  const deletePraise = useCallback((praiseId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'praises', praiseId);
    deleteDoc(docRef)
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
      });
  }, [firestore]);
  
  const updatePraise = useCallback(async (praiseId: string, newPraiseData: Omit<Praise, 'id'>): Promise<{ success: boolean; error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_unavailable' };
    const newId = slugify(newPraiseData.title);
    
    if (newId !== praiseId && (praises.some(p => p.id === newId) || pendingPraises.some(p => p.id === newId))) {
      return { success: false, error: 'duplicate' };
    }

    const oldDocRef = doc(firestore, 'praises', praiseId);
    const dataToSave = removeUndefined(newPraiseData);

    if (newId !== praiseId) {
        const newDocRef = doc(firestore, 'praises', newId);
        const batch = writeBatch(firestore);
        batch.delete(oldDocRef);
        batch.set(newDocRef, dataToSave);
        await batch.commit().catch(e => console.error(e));
    } else {
        await setDoc(oldDocRef, dataToSave, { merge: true }).catch(e => console.error(e));
    }
    return { success: true };
  }, [firestore, praises, pendingPraises]);

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
