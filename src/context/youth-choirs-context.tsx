
"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo } from 'react';
import type { YouthChoir } from '@/lib/youth-choirs';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch, serverTimestamp, updateDoc, query, where } from 'firebase/firestore';
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
  addYouthChoir: (newYouthChoirData: Omit<YouthChoir, 'id'>) => void;
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
  
  const approvedQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'youth-choirs'), where('status', '==', 'approved')) : null
  , [firestore]);

  const pendingQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'youth-choirs'), where('status', '==', 'pending')) : null
  , [firestore]);
  
  const { data: approvedData, isLoading: isLoadingApproved } = useCollection<YouthChoir>(approvedQuery);
  const { data: pendingData, isLoading: isLoadingPending } = useCollection<YouthChoir>(pendingQuery);

  const isLoaded = !!firestore && !isLoadingApproved;

  const youthChoirs = useMemo(() => {
    return approvedData ? [...approvedData].sort((a, b) => a.title.localeCompare(b.title)) : [];
  }, [approvedData]);
  
  const pendingYouthChoirs = useMemo(() => {
    return pendingData ? [...pendingData].sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)) : [];
  }, [pendingData]);
  
  const addYouthChoir = useCallback((newYouthChoirData: Omit<YouthChoir, 'id'>) => {
    if (!firestore) return;
    const id = slugify(newYouthChoirData.title);
    
    if (youthChoirs.some(p => p.id === id) || pendingYouthChoirs.some(p => p.id === id)) {
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
        toast({ title: 'Alabanza Enviada', description: 'Será revisada por un administrador.' });
      })
      .catch((error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: dataToSave
        }));
      });
  }, [firestore, youthChoirs, pendingYouthChoirs, toast]);

  const addYouthChoirs = useCallback((newYouthChoirsData: Omit<YouthChoir, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    let addedCount = 0;
    let duplicates = 0;
    
    const existingIds = new Set([...youthChoirs.map(p => p.id), ...pendingYouthChoirs.map(p => p.id)]);

    for (const youthChoirData of newYouthChoirsData) {
      const id = slugify(youthChoirData.title);
      if (existingIds.has(id)) {
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
        existingIds.add(id);
      }
    }
    
    if (addedCount > 0) {
      batch.commit()
        .then(() => {
          toast({ title: 'Alabanzas Enviadas', description: `${addedCount} alabanzas enviadas a revisión. Se omitieron ${duplicates} duplicados.` });
        })
        .catch(() => {
          toast({ variant: 'destructive', title: 'Error al Enviar', description: 'No se pudieron enviar las alabanzas.' });
        });
    }
  }, [firestore, youthChoirs, pendingYouthChoirs, toast]);

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
    const newId = slugify(newYouthChoirData.title);

    if (newId !== youthChoirId && (youthChoirs.some(p => p.id === newId) || pendingYouthChoirs.some(p => p.id === newId))) {
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
  }, [firestore, youthChoirs, pendingYouthChoirs]);

  const getYouthChoirById = useCallback((id: string): YouthChoir | undefined => {
    return youthChoirs.find(p => p.id === id) || pendingYouthChoirs.find(p => p.id === id);
  }, [youthChoirs, pendingYouthChoirs]);

  const restoreYouthChoirs = useCallback((youthChoirsToRestore: Omit<YouthChoir, 'id'>[]) => {
    if (!firestore) return;
    const batch = writeBatch(firestore);
  
    [...youthChoirs, ...pendingYouthChoirs].forEach(yc => {
      const docRef = doc(firestore, 'youth-choirs', yc.id);
      batch.delete(docRef);
    });
    
    youthChoirsToRestore.forEach(ycData => {
      const id = slugify(ycData.title);
      const docRef = doc(firestore, 'youth-choirs', id);
      const dataWithStatus = { ...ycData, status: 'approved' as const };
      batch.set(docRef, removeUndefined(dataWithStatus));
    });
  
    batch.commit().catch(error => console.error("Error restoring group songs:", error));
  }, [firestore, youthChoirs, pendingYouthChoirs]);

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
