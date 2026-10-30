"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { Repertoire } from '@/lib/repertoires';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useChurch } from '@/context/church-context';
import { collection, doc, getDoc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { removeUndefined } from '@/lib/utils';

interface RepertoiresContextType {
  repertoires: Repertoire[];
  addRepertoire: (newRepertoireData: Omit<Repertoire, 'id' | 'createdAt'>) => Promise<{ success: boolean; id?: string }>;
  updateRepertoire: (id: string, updatedData: Omit<Repertoire, 'id' | 'createdAt'>) => Promise<{ success: boolean }>;
  deleteRepertoire: (repertoireId: string) => Promise<void>;
  getRepertoireById: (id: string) => Repertoire | undefined;
  fetchRepertoireDirectly: (id: string) => Promise<Repertoire | null>;
  isLoaded: boolean;
  currentChurchName: string;
}

const RepertoiresContext = createContext<RepertoiresContextType | undefined>(undefined);

const getMillis = (createdAt: any): number => {
  if (!createdAt) return 0;
  if (typeof createdAt.toMillis === 'function') return createdAt.toMillis();
  if (typeof createdAt.toDate === 'function') return createdAt.toDate().getTime();
  if (createdAt.seconds) return createdAt.seconds * 1000;
  const d = new Date(createdAt);
  return isNaN(d.getTime()) ? 0 : d.getTime();
};

export function RepertoiresProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { currentChurch } = useChurch();
  const router = useRouter();
  const { toast } = useToast();
  
  const repertoiresCollectionRef = useMemoFirebase(() => 
    firestore && currentChurch ? collection(firestore, 'churches', currentChurch.id, 'repertoires') : null
  , [firestore, currentChurch?.id]);
  
  const { data: rawRepertoires, isLoading: isLoadingFromHook } = useCollection<Repertoire>(repertoiresCollectionRef);

  const isLoaded = !!firestore && !isLoadingFromHook && !!repertoiresCollectionRef;

  const repertoires = useMemo(() => {
    if (!rawRepertoires) return [];
    return [...rawRepertoires].sort((a, b) => {
      const timeA = getMillis(a.createdAt);
      const timeB = getMillis(b.createdAt);
      return timeB - timeA;
    });
  }, [rawRepertoires]);
  
  const addRepertoire = useCallback(async (newRepertoireData: Omit<Repertoire, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string }> => {
    if (!firestore || !repertoiresCollectionRef || !currentChurch) {
      toast({
        variant: 'destructive',
        title: 'Error al guardar',
        description: 'No se ha detectado la iglesia activa. Selecciona una iglesia primero.',
      });
      return { success: false };
    }
    
    try {
      const dataToSave = removeUndefined({
        ...newRepertoireData,
        churchId: currentChurch.id,
        churchName: currentChurch.name,
        createdAt: serverTimestamp(),
      });

      const docRef = await addDoc(repertoiresCollectionRef, dataToSave);

      toast({
        title: 'Repertorio Publicado',
        description: `El repertorio de "${newRepertoireData.name}" ya está visible para toda la congregación de ${currentChurch.name}.`,
      });

      router.push(`/repertoire/${docRef.id}`);
      return { success: true, id: docRef.id };
    } catch (e: any) {
      console.error("Error adding repertoire: ", e);
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: repertoiresCollectionRef.path,
        operation: 'create',
        requestResourceData: newRepertoireData
      }));
      toast({
        variant: 'destructive',
        title: 'Error al publicar',
        description: 'No se pudo guardar el repertorio en tiempo real. Intenta de nuevo.',
      });
      return { success: false };
    }
  }, [firestore, repertoiresCollectionRef, currentChurch, toast, router]);

  const updateRepertoire = useCallback(async (id: string, updatedData: Omit<Repertoire, 'id' | 'createdAt'>): Promise<{ success: boolean }> => {
    if (!firestore || !currentChurch) return { success: false };
    const docRef = doc(firestore, 'churches', currentChurch.id, 'repertoires', id);
    
    try {
      const cleanData = removeUndefined({
        ...updatedData,
        churchId: currentChurch.id,
        churchName: currentChurch.name,
      });

      await updateDoc(docRef, cleanData);

      toast({
        title: 'Repertorio Actualizado',
        description: `El repertorio de "${updatedData.name}" ha sido actualizado en tiempo real.`,
      });
      router.push(`/repertoire/${id}`);
      return { success: true };
    } catch (e: any) {
      console.error("Error updating repertoire: ", e);
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: updatedData
      }));
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: 'No se pudo actualizar el repertorio.',
      });
      return { success: false };
    }
  }, [firestore, currentChurch, toast, router]);

  const deleteRepertoire = useCallback(async (repertoireId: string) => {
    if (!firestore || !currentChurch) return;
    const docRef = doc(firestore, 'churches', currentChurch.id, 'repertoires', repertoireId);
    try {
      await deleteDoc(docRef);
      toast({
        title: 'Repertorio Eliminado',
        description: 'El repertorio ha sido retirado correctamente.',
      });
    } catch (e) {
      console.error("Error deleting repertoire: ", e);
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'delete'
      }));
      toast({
        variant: 'destructive',
        title: 'Error al eliminar',
        description: 'No se pudo eliminar el repertorio.',
      });
    }
  }, [firestore, currentChurch, toast]);
  
  const getRepertoireById = useCallback((id: string): Repertoire | undefined => {
    return repertoires.find(r => r.id === id);
  }, [repertoires]);

  const fetchRepertoireDirectly = useCallback(async (id: string): Promise<Repertoire | null> => {
    if (!firestore) return null;
    try {
      // 1. Try in current church
      if (currentChurch) {
        const docSnap = await getDoc(doc(firestore, 'churches', currentChurch.id, 'repertoires', id));
        if (docSnap.exists()) {
          return { ...(docSnap.data() as any), id: docSnap.id };
        }
      }
      // 2. Try in canonical Las Torres if different
      if (currentChurch?.id !== 'eech-las-torres') {
        const docSnap = await getDoc(doc(firestore, 'churches', 'eech-las-torres', 'repertoires', id));
        if (docSnap.exists()) {
          return { ...(docSnap.data() as any), id: docSnap.id };
        }
      }
    } catch (e) {
      console.error("Error fetching repertoire directly:", e);
    }
    return null;
  }, [firestore, currentChurch]);

  const value = { 
    repertoires, 
    addRepertoire, 
    updateRepertoire, 
    deleteRepertoire, 
    getRepertoireById, 
    fetchRepertoireDirectly,
    isLoaded,
    currentChurchName: currentChurch?.name || 'EECH Las Torres'
  };

  return <RepertoiresContext.Provider value={value}>{children}</RepertoiresContext.Provider>;
}

export function useRepertoires() {
  const context = useContext(RepertoiresContext);
  if (context === undefined) {
    throw new Error('useRepertoires must be used within a RepertoiresProvider');
  }
  return context;
}
