
"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { SpecialOccasion, SpecialCategory } from '@/lib/special-occasions';
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

interface SpecialOccasionsContextType {
  specialOccasions: SpecialOccasion[];
  pendingSpecialOccasions: SpecialOccasion[];
  addSpecialOccasion: (data: Omit<SpecialOccasion, 'id'>) => Promise<{ success: boolean }>;
  deleteSpecialOccasion: (id: string) => void;
  updateSpecialOccasion: (id: string, data: Omit<SpecialOccasion, 'id'>) => Promise<{ success: boolean }>;
  approveSpecialOccasion: (id: string) => void;
  getSpecialById: (id: string) => SpecialOccasion | undefined;
  isLoaded: boolean;
}

const SpecialOccasionsContext = createContext<SpecialOccasionsContextType | undefined>(undefined);

export function SpecialOccasionsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const collectionRef = useMemoFirebase(() => 
    firestore ? collection(firestore, 'special-occasions') : null
  , [firestore]);

  const { data: allData, isLoading } = useCollection<SpecialOccasion>(collectionRef);

  const isLoaded = !!firestore && !isLoading;

  const specialOccasions = useMemo(() => {
    if (!allData) return [];
    return allData
      .filter(s => s.status === 'approved' || !s.status)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [allData]);

  const pendingSpecialOccasions = useMemo(() => {
    if (!allData) return [];
    return allData
      .filter(s => s.status === 'pending')
      .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  }, [allData]);

  const addSpecialOccasion = useCallback(async (data: Omit<SpecialOccasion, 'id'>) => {
    if (!firestore) return { success: false };
    const id = `${slugify(data.category)}-${slugify(data.title)}-${Date.now().toString().slice(-4)}`;
    const docRef = doc(firestore, 'special-occasions', id);
    const dataToSave = { ...data, status: 'pending' as const, createdAt: serverTimestamp() };
    
    setDoc(docRef, removeUndefined(dataToSave))
      .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'create', requestResourceData: dataToSave })));
    
    toast({ title: 'Enviado a Revisión' });
    return { success: true };
  }, [firestore, toast]);

  const deleteSpecialOccasion = useCallback((id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'special-occasions', id);
    deleteDoc(docRef).catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' })));
    toast({ title: 'Eliminado' });
  }, [firestore, toast]);

  const updateSpecialOccasion = useCallback(async (id: string, data: Omit<SpecialOccasion, 'id'>) => {
    if (!firestore) return { success: false };
    const docRef = doc(firestore, 'special-occasions', id);
    setDoc(docRef, removeUndefined(data), { merge: true })
      .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update', requestResourceData: data })));
    return { success: true };
  }, [firestore]);

  const approveSpecialOccasion = useCallback((id: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'special-occasions', id);
    updateDoc(docRef, { status: 'approved' });
    toast({ title: 'Aprobado' });
  }, [firestore, toast]);

  const getSpecialById = useCallback((id: string) => allData?.find(s => s.id === id), [allData]);

  return (
    <SpecialOccasionsContext.Provider value={{ specialOccasions, pendingSpecialOccasions, addSpecialOccasion, deleteSpecialOccasion, updateSpecialOccasion, approveSpecialOccasion, getSpecialById, isLoaded }}>
      {children}
    </SpecialOccasionsContext.Provider>
  );
}

export const useSpecialOccasions = () => {
  const context = useContext(SpecialOccasionsContext);
  if (!context) throw new Error('useSpecialOccasions must be used within SpecialOccasionsProvider');
  return context;
};
