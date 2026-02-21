"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import type { Hymn } from '@/lib/hymns';
import { hymns as initialHymnsData } from '@/lib/hymns-initial';
import { useFirestore, useCollection } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface HymnsContextType {
  hymns: Hymn[];
  addHymn: (newHymn: Omit<Hymn, 'id'>) => Promise<boolean>;
  addHymns: (newHymnsData: Omit<Hymn, 'id'>[]) => Promise<{ addedCount: number, updatedCount: number }>;
  updateHymn: (hymnNumber: number, newHymnData: Omit<Hymn, 'id' | 'number'>) => Promise<{ success: boolean }>;
  deleteHymn: (hymnNumber: number) => Promise<void>;
  getHymnById: (id: number) => Hymn | undefined;
  isLoaded: boolean;
}

const HymnsContext = createContext<HymnsContextType | undefined>(undefined);

export function HymnsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const hymnsCollectionRef = useMemo(() => firestore ? collection(firestore, 'hymns') : null, [firestore]);
  const { data: rawHymns, loading: isLoading } = useCollection<Hymn>(hymnsCollectionRef);
  const { toast } = useToast();

  const hymns = useMemo(() => {
    return rawHymns ? [...rawHymns].sort((a, b) => a.number - b.number) : [];
  }, [rawHymns]);

  useEffect(() => {
    const migrateData = async () => {
        // Only migrate if firestore is ready, not loading, and the collection is empty.
        if (firestore && !isLoading && rawHymns?.length === 0) {
            const migrationFlag = 'hymns_migrated_v1';
            if (localStorage.getItem(migrationFlag)) {
                return;
            }

            console.log('Migrating initial hymns to Firestore...');
            toast({ title: 'Configurando el himnario por primera vez...', description: 'Importando himnos a la nube. Esto puede tardar un momento.' });
            
            const hymnsRef = collection(firestore, 'hymns');
            const batch = writeBatch(firestore);
            initialHymnsData.forEach((hymn) => {
                const docRef = doc(hymnsRef, hymn.number.toString());
                batch.set(docRef, hymn);
            });
            await batch.commit();

            localStorage.setItem(migrationFlag, 'true');
            toast({ title: '¡Himnario listo!', description: 'Todos los himnos han sido cargados en la nube.' });
        }
    };
    migrateData();
  }, [firestore, isLoading, rawHymns, toast]);

  const addHymn = useCallback(async (newHymn: Omit<Hymn, 'id'>): Promise<boolean> => {
    if (!firestore) return false;
    if (hymns.some(h => h.number === newHymn.number)) {
      return false; // Already exists
    }
    const docRef = doc(firestore, 'hymns', newHymn.number.toString());
    await setDoc(docRef, newHymn);
    return true;
  }, [firestore, hymns]);

  const addHymns = useCallback(async (newHymnsData: Omit<Hymn, 'id'>[]): Promise<{ addedCount: number, updatedCount: number }> => {
    if (!firestore) return { addedCount: 0, updatedCount: 0 };
    
    const batch = writeBatch(firestore);
    const hymnsMap = new Map(hymns.map(h => [h.number, h]));
    let addedCount = 0;
    let updatedCount = 0;

    newHymnsData.forEach(hymn => {
        const docRef = doc(firestore, 'hymns', hymn.number.toString());
        batch.set(docRef, hymn, { merge: true });
        if (hymnsMap.has(hymn.number)) {
            updatedCount++;
        } else {
            addedCount++;
        }
    });

    await batch.commit();
    return { addedCount, updatedCount };
  }, [firestore, hymns]);

  const updateHymn = useCallback(async (hymnNumber: number, newHymnData: Omit<Hymn, 'id' | 'number'>): Promise<{ success: boolean }> => {
    if (!firestore) return { success: false };
    const docRef = doc(firestore, 'hymns', hymnNumber.toString());
    await setDoc(docRef, { ...newHymnData, number: hymnNumber }, { merge: true });
    return { success: true };
  }, [firestore]);


  const deleteHymn = useCallback(async (hymnNumber: number) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'hymns', hymnNumber.toString());
    await deleteDoc(docRef);
  }, [firestore]);
  
  const getHymnById = useCallback((id: number): Hymn | undefined => {
    return hymns.find(h => h.number === id);
  }, [hymns]);

  const value = { hymns, addHymn, addHymns, updateHymn, deleteHymn, getHymnById, isLoaded: !isLoading };

  return <HymnsContext.Provider value={value}>{children}</HymnsContext.Provider>;
}

export function useHymns() {
  const context = useContext(HymnsContext);
  if (context === undefined) {
    throw new Error('useHymns must be used within a HymnsProvider');
  }
  return context;
}
