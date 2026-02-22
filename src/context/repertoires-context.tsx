"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { Repertoire } from '@/lib/repertoires';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface RepertoiresContextType {
  repertoires: Repertoire[];
  addRepertoire: (newRepertoireData: Omit<Repertoire, 'id' | 'createdAt'>) => Promise<{ success: boolean; id?: string }>;
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
    
    try {
        const docRef = await addDoc(repertoiresCollectionRef, {
            ...newRepertoireData,
            createdAt: serverTimestamp(),
        });
        toast({
            title: 'Repertorio Guardado',
            description: `El repertorio de "${newRepertoireData.name}" ha sido guardado.`,
        });
        router.push('/repertoire');
        return { success: true, id: docRef.id };
    } catch(e) {
        console.error("Error adding repertoire: ", e);
        toast({
            variant: 'destructive',
            title: 'Error al guardar',
            description: 'No se pudo guardar el repertorio.',
        });
        return { success: false };
    }
  }, [firestore, repertoiresCollectionRef, toast, router]);

  const deleteRepertoire = useCallback(async (repertoireId: string) => {
    if (!firestore) return;
    try {
        const docRef = doc(firestore, 'repertoires', repertoireId);
        await deleteDoc(docRef);
        toast({
            title: 'Repertorio Eliminado',
            description: 'El repertorio ha sido eliminado correctamente.',
        });
    } catch (e) {
        console.error("Error deleting repertoire: ", e);
        toast({
            variant: 'destructive',
            title: 'Error al eliminar',
            description: 'No se pudo eliminar el repertorio.',
        });
    }
  }, [firestore, toast]);
  
  const getRepertoireById = useCallback((id: string): Repertoire | undefined => {
    return repertoires.find(r => r.id === id);
  }, [repertoires]);

  const value = { repertoires, addRepertoire, deleteRepertoire, getRepertoireById, isLoaded };

  return <RepertoiresContext.Provider value={value}>{children}</RepertoiresContext.Provider>;
}

export function useRepertoires() {
  const context = useContext(RepertoiresContext);
  if (context === undefined) {
    throw new Error('useRepertoires must be used within a RepertoiresProvider');
  }
  return context;
}
    