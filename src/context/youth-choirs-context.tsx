
"use client";

import { createContext, useContext, useCallback, ReactNode, useMemo, useEffect } from 'react';
import type { YouthChoir } from '@/lib/youth-choirs';
import { initialYouthChoirs } from '@/lib/youth-choirs-initial';
import { useFirestore, useCollection, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { useChurch } from '@/context/church-context';
import { collection, doc, writeBatch, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { notifyAdmin } from '@/lib/utils';
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
  const { currentChurch } = useChurch();
  const { toast } = useToast();
  
  const youthChoirsCollection = useMemoFirebase(() => 
    firestore ? firestore && currentChurch ? collection(firestore, 'churches', currentChurch.id, 'youth-choirs') : null : null
  , [firestore, currentChurch]);

  const { data: allData, isLoading } = useCollection<YouthChoir>(youthChoirsCollection);

  const isSyncing = isLoading;
  const isLoaded = (!isLoading || (allData && allData.length > 0) || initialYouthChoirs.length > 0);

  const youthChoirs = useMemo(() => {
    if (currentChurch && currentChurch.id !== 'eech-las-torres') {
      // For any other church, only return what is actually in Firestore. No defaults!
      const firestoreChoirs = allData ? allData.filter(yc => yc.status === 'approved' || !yc.status) : [];
      return firestoreChoirs.sort((a, b) => a.title.localeCompare(b.title));
    }

    // EECH Las Torres gets the hardcoded initial data merged with Firestore
    const fbYouthChoirsMap = new Map(allData?.map(yc => [yc.id, yc]) || []);
    
    const mergedYouthChoirs = initialYouthChoirs.map(initial => {
      const id = slugify(`${initial.group}-${initial.title}`);
      const fbData = fbYouthChoirsMap.get(id);
      if (fbData) {
        return { ...initial, ...fbData };
      }
      return { ...initial, id, status: 'approved' as const };
    }) as YouthChoir[];

    const initialIds = new Set(mergedYouthChoirs.map(yc => yc.id));
    if (allData) {
      allData.forEach(fbYouthChoir => {
        if (!initialIds.has(fbYouthChoir.id) && (fbYouthChoir.status === 'approved' || !fbYouthChoir.status)) {
          mergedYouthChoirs.push(fbYouthChoir);
        }
      });
    }

    return mergedYouthChoirs.sort((a, b) => a.title.localeCompare(b.title));
  }, [allData, currentChurch]);
  
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
    if (!firestore || !currentChurch) return { success: false };
    
    const id = `${slugify(newYouthChoirData.group)}-${slugify(newYouthChoirData.title)}-${Date.now().toString().slice(-4)}`;
    const docRef = doc(firestore, 'churches', currentChurch.id, 'youth-choirs', id);
    const dataToSave = { 
        ...newYouthChoirData,
        status: 'pending' as const,
        createdAt: serverTimestamp() 
    };

    setDoc(docRef, removeUndefined(dataToSave))
      .then(() => notifyAdmin('Agrupación', newYouthChoirData.title))
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
    if (!firestore || !currentChurch) return;
    
    const batch = writeBatch(firestore);
    let addedCount = 0;

    for (const youthChoirData of newYouthChoirsData) {
      const id = `${slugify(youthChoirData.group)}-${slugify(youthChoirData.title)}-${Date.now().toString().slice(-4)}-${addedCount}`;
      const docRef = doc(firestore, 'churches', currentChurch.id, 'youth-choirs', id);
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
        .then(() => notifyAdmin('Agrupaciones (Lote)', `${addedCount} alabanzas enviadas`))
        .catch((error) => {
          console.error("Error bulk adding youth choirs:", error);
        });
      toast({ title: 'Enviadas a Revisión', description: `Se han enviado ${addedCount} alabanzas para revisión.` });
    }
  }, [firestore, toast]);

  const approveYouthChoir = useCallback((youthChoirId: string) => {
    if (!firestore || !currentChurch) return;
    const docRef = doc(firestore, 'churches', currentChurch.id, 'youth-choirs', youthChoirId);
    updateDoc(docRef, { status: 'approved' })
      .catch((error) => {
        console.error("Error approving youth choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'update' }));
      });
    toast({ title: 'Alabanza Aprobada' });
  }, [firestore, toast]);

  const deleteYouthChoir = useCallback((youthChoirId: string) => {
    if (!firestore || !currentChurch) return;
    const docRef = doc(firestore, 'churches', currentChurch.id, 'youth-choirs', youthChoirId);
    deleteDoc(docRef)
      .catch((error) => {
        console.error("Error deleting youth choir:", error);
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: docRef.path, operation: 'delete' }));
      });
    toast({ title: 'Alabanza eliminada' });
  }, [firestore, toast]);
  
  const updateYouthChoir = useCallback(async (youthChoirId: string, newYouthChoirData: Omit<YouthChoir, 'id'>): Promise<{ success: boolean; error?: string }> => {
    if (!firestore) return { success: false, error: 'firestore_unavailable' };
    
    const docRef = doc(firestore, 'churches', currentChurch.id, 'youth-choirs', youthChoirId);
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
  }, [firestore, currentChurch]);

  const getYouthChoirById = useCallback((id: string): YouthChoir | undefined => {
    return allData?.find(p => p.id === id);
  }, [allData]);

  const restoreYouthChoirs = useCallback((youthChoirsToRestore: Omit<YouthChoir, 'id'>[]) => {
    if (!firestore || !currentChurch) return;
    const batch = writeBatch(firestore);
  
    allData?.forEach(yc => {
      const docRef = doc(firestore, 'churches', currentChurch.id, 'youth-choirs', yc.id);
      batch.delete(docRef);
    });
    
    youthChoirsToRestore.forEach(ycData => {
      const id = slugify(`${ycData.group}-${ycData.title}`);
      const docRef = doc(firestore, 'churches', currentChurch.id, 'youth-choirs', id);
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
