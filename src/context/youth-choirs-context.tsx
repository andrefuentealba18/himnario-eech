
"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo, useEffect } from 'react';
import type { YouthChoir } from '@/lib/youth-choirs';
import { initialYouthChoirs } from '@/lib/youth-choirs-initial';
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
  isSyncing: boolean;
}

const YouthChoirsContext = createContext<YouthChoirsContextType | undefined>(undefined);

export function YouthChoirsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const youthChoirsCollection = useMemoFirebase(() => 
    firestore ? collection(firestore, 'youth-choirs') : null
  , [firestore]);

  const { data: allData, isLoading } = useCollection<YouthChoir>(youthChoirsCollection);

  const isSyncing = isLoading;
  const isLoaded = (!isLoading || (allData && allData.length > 0) || initialYouthChoirs.length > 0);

  const youthChoirs = useMemo(() => {
    // Merge initial local data with Firestore data
    const fbYouthChoirsMap = new Map(allData?.map(yc => [yc.id, yc]) || []);
    
    // First, map all initial youth choirs, overlaying any Firestore updates
    const mergedYouthChoirs = initialYouthChoirs.map(initial => {
      const id = slugify(`${initial.group}-${initial.title}`);
      const fbData = fbYouthChoirsMap.get(id);
      if (fbData) {
        return { ...initial, ...fbData };
      }
      return { ...initial, id, status: 'approved' as const };
    }) as YouthChoir[];

    // Then, add any NEW youth choirs from Firestore that are not in initialYouthChoirs
    const initialIds = new Set(mergedYouthChoirs.map(yc => yc.id));
    if (allData) {
      allData.forEach(fbYouthChoir => {
        if (!initialIds.has(fbYouthChoir.id) && (fbYouthChoir.status === 'approved' || !fbYouthChoir.status)) {
          mergedYouthChoirs.push(fbYouthChoir);
        }
      });
    }

    return mergedYouthChoirs.sort((a, b) => a.title.localeCompare(b.title));
  }, [allData]);
  
  const pendingYouthChoirs = useMemo(() => {
    if (!allData) return [];
    return allData
      .filter(yc => yc.status === 'pending')
      .sort((a, b) => {
        const tA = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || Date.now();
        const tB = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || Date.now();
        return tB - tA;
      });
  }, [allData]);

  useEffect(() => {
    if (!!firestore && !isLoading && allData?.length === 0) {
      const migrationFlag = 'youth_choirs_migrated_v2';
      if (localStorage.getItem(migrationFlag)) return;

      console.log('Migrating initial youth choirs...');
      const migrateInBatches = async () => {
        try {
          const chunkSize = 400;
          for (let i = 0; i < initialYouthChoirs.length; i += chunkSize) {
            const chunk = initialYouthChoirs.slice(i, i + chunkSize);
            const batch = writeBatch(firestore!);
            chunk.forEach((yc) => {
              const id = slugify(`${yc.group}-${yc.title}`);
              const docRef = doc(firestore!, 'youth-choirs', id);
              batch.set(docRef, removeUndefined({ ...yc, status: 'approved', createdAt: serverTimestamp() }));
            });
            await batch.commit();
          }
          localStorage.setItem(migrationFlag, 'true');
        } catch (error) {
          console.error("Error migrating youth choirs:", error);
        }
      };

      migrateInBatches();
    }
  }, [isLoading, allData, firestore]);
  
  const addYouthChoir = useCallback(async (newYouthChoirData: Omit<YouthChoir, 'id'>) => {
    if (!firestore) return { success: false };
    
    const id = `${slugify(newYouthChoirData.group)}-${slugify(newYouthChoirData.title)}-${Date.now().toString().slice(-4)}`;
    const docRef = doc(firestore, 'youth-choirs', id);
    const dataToSave = { 
        ...newYouthChoirData,
        status: 'pending' as const,
        createdAt: serverTimestamp() 
    };

    setDoc(docRef, removeUndefined(dataToSave))
      .catch((error) => {
        console.error("Error adding youth choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: dataToSave
        }));
      });

    toast({ title: 'Enviado a Revisión', description: `La alabanza de ${newYouthChoirData.group} ha sido enviada.` });
    return { success: true };
  }, [firestore, toast]);

  const addYouthChoirs = useCallback((newYouthChoirsData: Omit<YouthChoir, 'id'>[]) => {
    if (!firestore) return;
    
    const batch = writeBatch(firestore);
    let addedCount = 0;

    for (const youthChoirData of newYouthChoirsData) {
      const id = `${slugify(youthChoirData.group)}-${slugify(youthChoirData.title)}-${Date.now().toString().slice(-4)}-${addedCount}`;
      const docRef = doc(firestore, 'youth-choirs', id);
      const dataToSave = { 
          ...youthChoirData,
          status: 'pending' as const,
          createdAt: serverTimestamp() 
      };
      batch.set(docRef, removeUndefined(dataToSave));
      addedCount++;
    }
    
    if (addedCount > 0) {
      batch.commit()
        .catch((error) => {
          console.error("Error bulk adding youth choirs:", error);
        });
      toast({ title: 'Enviadas a Revisión', description: `Se han enviado ${addedCount} alabanzas para revisión.` });
    }
  }, [firestore, toast]);

  const approveYouthChoir = useCallback((youthChoirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'youth-choirs', youthChoirId);
    updateDoc(docRef, { status: 'approved' })
      .catch((error) => {
        console.error("Error approving youth choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update' }));
      });
    toast({ title: 'Alabanza Aprobada' });
  }, [firestore, toast]);

  const deleteYouthChoir = useCallback((youthChoirId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'youth-choirs', youthChoirId);
    deleteDoc(docRef)
      .catch((error) => {
        console.error("Error deleting youth choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
      });
    toast({ title: 'Alabanza eliminada' });
  }, [firestore, toast]);
  
  const updateYouthChoir = useCallback(async (youthChoirId: string, newYouthChoirData: Omit<YouthChoir, 'id'>): Promise<{ success: boolean; error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_unavailable' };
    
    const docRef = doc(firestore, 'youth-choirs', youthChoirId);
    setDoc(docRef, removeUndefined(newYouthChoirData), { merge: true })
      .catch((error) => {
        console.error("Error updating youth choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'update',
          requestResourceData: newYouthChoirData
        }));
      });
    return { success: true };
  }, [firestore]);

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

  const value = { youthChoirs, pendingYouthChoirs, addYouthChoir, addYouthChoirs, approveYouthChoir, deleteYouthChoir, updateYouthChoir, getYouthChoirById, restoreYouthChoirs, isLoaded, isSyncing };

  return <YouthChoirsContext.Provider value={value}>{children}</YouthChoirsContext.Provider>;
}

export function useYouthChoirs() {
  const context = useContext(YouthChoirsContext);
  if (context === undefined) {
    throw new Error('useYouthChoirs must be used within a YouthChoirsProvider');
  }
  return context;
}
