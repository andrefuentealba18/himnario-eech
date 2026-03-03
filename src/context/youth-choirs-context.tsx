
"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { YouthChoir } from '@/lib/youth-choirs';
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

interface YouthChoirsContextType {
  youthChoirs: YouthChoir[];
  pendingYouthChoirs: YouthChoir[];
  addYouthChoir: (newYouthChoirData: Omit<YouthChoir, 'id'>) => Promise<{ success: boolean }>;
  addYouthChoirs: (newYouthChoirsData: Omit<YouthChoir, 'id'>[]) => void;
  deleteYouthChoir: (youthChoirId: string) => void;
  updateYouthChoir: (youthChoirId: string, newYouthChoirData: Omit<YouthChoir, 'id'>) => Promise<{ success: boolean; error?: string }>;
  approveYouthChoir: (youthChoirId: string) => void;
  getYouthChoirById: (id: string) => YouthChoir | undefined;
  restoreYouthChoirs: (youthChoirsToRestore: Omit<YouthChoir, 'id'>[]) => void;
  isLoaded: boolean;
}

const YouthChoirsContext = createContext<YouthChoirsContextType | undefined>(undefined);

export function YouthChoirsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const youthChoirsCollection = useMemoFirebase(() => 
    firestore ? collection(firestore, 'youth-choirs') : null
  , [firestore]);

  const { data: allData, isLoading } = useCollection<YouthChoir>(youthChoirsCollection);

  const isLoaded = !!firestore && !isLoading;

  const youthChoirs = useMemo(() => {
    if (!allData) return [];
    return allData
      .filter(yc => yc.status === 'approved' || !yc.status)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [allData]);
  
  const pendingYouthChoirs = useMemo(() => {
    if (!allData) return [];
    return allData
      .filter(yc => yc.status === 'pending')
      .sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  }, [allData]);
  
  const addYouthChoir = useCallback(async (newYouthChoirData: Omit<YouthChoir, 'id'>) => {
    if (!firestore) return { success: false };
    // ID único basado en GRUPO + TÍTULO para evitar colisiones entre departamentos
    const id = slugify(`${newYouthChoirData.group}-${newYouthChoirData.title}`);
    
    if (allData?.some(p => p.id === id)) {
      toast({ variant: 'destructive', title: 'Error', description: `Esta alabanza ya existe en el grupo ${newYouthChoirData.group}.` });
      return { success: false };
    }

    const docRef = doc(firestore, 'youth-choirs', id);
    const dataToSave = { 
        ...newYouthChoirData,
        status: 'pending' as const,
        createdAt: serverTimestamp() 
    };

    try {
      await setDoc(docRef, removeUndefined(dataToSave));
      toast({ title: 'Enviado a Revisión', description: `"${newYouthChoirData.title}" ha sido enviada para ser revisada.` });
      return { success: true };
    } catch (error) {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: docRef.path,
        operation: 'create',
        requestResourceData: dataToSave
      }));
      return { success: false };
    }
  }, [firestore, allData, toast]);

  const addYouthChoirs = useCallback((newYouthChoirsData: Omit<YouthChoir, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    
    const existingIds = new Set(allData?.map(p => p.id) || []);

    for (const youthChoirData of newYouthChoirsData) {
      const id = slugify(`${youthChoirData.group}-${youthChoirData.title}`);
      if (!existingIds.has(id)) {
        const docRef = doc(firestore, 'youth-choirs', id);
        const dataToSave = { 
            ...youthChoirData,
            status: 'pending' as const,
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
          toast({ title: 'Enviadas a Revisión', description: `Se han enviado ${addedCount} alabanzas para revisión.` });
        })
        .catch(() => {
          toast({ variant: 'destructive', title: 'Error al Enviar', description: 'No se pudieron guardar las alabanzas.' });
        });
    }
  }, [firestore, allData, toast]);

  const approveYouthChoir = useCallback((youthChoirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'youth-choirs', youthChoirId);
    updateDoc(docRef, { status: 'approved' })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update' }));
      });
  }, [firestore]);

  const deleteYouthChoir = useCallback((youthChoirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'youth-choirs', youthChoirId);
    deleteDoc(docRef)
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
      });
  }, [firestore]);
  
  const updateYouthChoir = useCallback(async (youthChoirId: string, newYouthChoirData: Omit<YouthChoir, 'id'>): Promise<{ success: boolean; error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_unavailable' };
    const newId = slugify(`${newYouthChoirData.group}-${newYouthChoirData.title}`);

    if (newId !== youthChoirId && allData?.some(p => p.id === newId)) {
      return { success: false, error: 'duplicate' };
    }

    const oldDocRef = doc(firestore, 'youth-choirs', youthChoirId);
    const dataToSave = removeUndefined(newYouthChoirData);
    
    if (newId !== youthChoirId) {
        const newDocRef = doc(firestore, 'youth-choirs', newId);
        const batch = writeBatch(firestore);
        batch.delete(oldDocRef);
        batch.set(newDocRef, dataToSave);
        await batch.commit().catch(e => console.error(e));
    } else {
        await setDoc(oldDocRef, dataToSave, { merge: true }).catch(e => console.error(e));
    }
    return { success: true };
  }, [firestore, allData]);

  const getYouthChoirById = useCallback((id: string): YouthChoir | undefined => {
    return allData?.find(p => p.id === id);
  }, [allData]);

  const restoreYouthChoirs = useCallback((youthChoirsToRestore: Omit<YouthChoir, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
  
    allData?.forEach(yc => {
      const docRef = doc(firestore, 'youth-choirs', yc.id);
      batch.delete(docRef);
    });
    
    youthChoirsToRestore.forEach(ycData => {
      const id = slugify(`${ycData.group}-${ycData.title}`);
      const docRef = doc(firestore, 'youth-choirs', id);
      const dataWithStatus = { ...ycData, status: 'approved' as const };
      batch.set(docRef, removeUndefined(dataWithStatus));
    });
  
    batch.commit().catch(error => console.error("Error restoring group songs:", error));
  }, [firestore, allData]);

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
