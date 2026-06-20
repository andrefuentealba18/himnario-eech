
"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { Repertoire } from '@/lib/repertoires';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface RepertoiresContextType {
  repertoires: Repertoire[];
  addRepertoire: (newRepertoireData: Omit<Repertoire, 'id' | 'createdAt'>) => Promise<{ success: boolean; id?: string }>;
  updateRepertoire: (id: string, updatedData: Omit<Repertoire, 'id' | 'createdAt'>) => Promise<{ success: boolean }>;
  deleteRepertoire: (repertoireId: string) => Promise<void>;
  getRepertoireById: (id: string) => Repertoire | undefined;
  isLoaded: boolean;
}

const RepertoiresContext = createContext<RepertoiresContextType | undefined>(undefined);

export function RepertoiresProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const repertoiresCollectionRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'repertoires') : null
  , [firestore]);
  
  const { data: rawRepertoires, isLoading: isLoadingFromHook } = useCollection<Repertoire>(repertoiresCollectionRef);

  const isLoaded = !!firestore && !isLoadingFromHook;

  const repertoires = useMemo(() => {
    if (!rawRepertoires) return [];
    return [...rawRepertoires].sort((a, b) => {
        if (a.createdAt && b.createdAt) {
            return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
    });
  }, [rawRepertoires]);
  
  const addRepertoire = useCallback(async (newRepertoireData: Omit<Repertoire, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string }> => {
    if (!firestore || !repertoiresCollectionRef) return { success: false };
    
    const dataToSave = {
        ...newRepertoireData,
        createdAt: serverTimestamp(),
    };

    addDoc(repertoiresCollectionRef, dataToSave)
      .catch((e) => {
        console.error("Error adding repertoire: ", e);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: repertoiresCollectionRef.path,
          operation: 'create',
          requestResourceData: dataToSave
        }));
      });

    toast({
        title: 'Repertorio Guardado',
        description: `El repertorio de "${newRepertoireData.name}" ha sido guardado.`,
    });
    router.push('/repertoire');
    return { success: true };
  }, [firestore, repertoiresCollectionRef, toast, router]);

  const updateRepertoire = useCallback(async (id: string, updatedData: Omit<Repertoire, 'id' | 'createdAt'>): Promise<{ success: boolean }> => {
    if (!firestore) return { success: false };
    const docRef = doc(firestore, 'repertoires', id);
    
    // We update without modifying the createdAt
    updateDoc(docRef, updatedData as any)
      .catch((e) => {
        console.error("Error updating repertoire: ", e);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: updatedData
        }));
      });

    toast({
        title: 'Repertorio Actualizado',
        description: `El repertorio de "${updatedData.name}" ha sido actualizado.`,
    });
    router.push(`/repertoire/${id}`);
    return { success: true };
  }, [firestore, toast, router]);

  const deleteRepertoire = useCallback(async (repertoireId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'repertoires', repertoireId);
    deleteDoc(docRef)
      .catch((e) => {
        console.error("Error deleting repertoire: ", e);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'delete'
        }));
      });
    toast({
        title: 'Repertorio Eliminado',
        description: 'El repertorio ha sido eliminado correctamente.',
    });
  }, [firestore, toast]);
  
  const getRepertoireById = useCallback((id: string): Repertoire | undefined => {
    return repertoires.find(r => r.id === id);
  }, [repertoires]);

  const value = { repertoires, addRepertoire, updateRepertoire, deleteRepertoire, getRepertoireById, isLoaded };

  return <RepertoiresContext.Provider value={value}>{children}</RepertoiresContext.Provider>;
}

export function useRepertoires() {
  const context = useContext(RepertoiresContext);
  if (context === undefined) {
    throw new Error('useRepertoires must be used within a RepertoiresProvider');
  }
  return context;
}
