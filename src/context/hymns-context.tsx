"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Hymn } from '@/lib/hymns';
import { hymns as initialHymns } from '@/lib/hymns';

const HYMNS_KEY = 'himnario_hymns';

interface HymnsContextType {
  hymns: Hymn[];
  addHymn: (newHymn: Hymn) => boolean;
  addHymns: (newHymnsData: Hymn[]) => { addedCount: number, updatedCount: number };
  updateHymn: (hymnNumber: number, newHymnData: Omit<Hymn, 'number'>) => { success: boolean };
  deleteHymn: (hymnNumber: number) => void;
  getHymnById: (id: number) => Hymn | undefined;
  isLoaded: boolean;
}

const HymnsContext = createContext<HymnsContextType | undefined>(undefined);

export function HymnsProvider({ children }: { children: ReactNode }) {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHymnsRaw = localStorage.getItem(HYMNS_KEY);
      if (storedHymnsRaw) {
        const storedHymns = JSON.parse(storedHymnsRaw);
        if (Array.isArray(storedHymns) && storedHymns.length > 0) {
          setHymns(storedHymns);
        } else {
          setHymns(initialHymns.sort((a, b) => a.number - b.number));
        }
      } else {
        setHymns(initialHymns.sort((a, b) => a.number - b.number));
      }
    } catch (error) {
      console.error("Failed to load or parse hymns from localStorage", error);
      setHymns(initialHymns.sort((a, b) => a.number - b.number));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(HYMNS_KEY, JSON.stringify(hymns));
      } catch (error) {
        console.error("Failed to save hymns to localStorage", error);
      }
    }
  }, [hymns, isLoaded]);

  const addHymn = useCallback((newHymn: Hymn): boolean => {
    if (hymns.some(h => h.number === newHymn.number)) {
      return false; // Already exists
    }
    setHymns(prevHymns => [...prevHymns, newHymn].sort((a, b) => a.number - b.number));
    return true;
  }, [hymns]);

  const addHymns = useCallback((newHymnsData: Hymn[]): { addedCount: number, updatedCount: number } => {
    const hymnsMap = new Map(hymns.map(h => [h.number, h]));
    let addedCount = 0;
    let updatedCount = 0;

    newHymnsData.forEach(hymn => {
        if (hymnsMap.has(hymn.number)) {
            updatedCount++;
        } else {
            addedCount++;
        }
        hymnsMap.set(hymn.number, hymn);
    });

    const newHymns = Array.from(hymnsMap.values()).sort((a, b) => a.number - b.number);
    setHymns(newHymns);

    return { addedCount, updatedCount };
  }, [hymns]);

  const updateHymn = useCallback((hymnNumber: number, newHymnData: Omit<Hymn, 'number'>): { success: boolean } => {
    setHymns(prevHymns => {
        const updatedHymns = prevHymns.map(h => 
            h.number === hymnNumber ? { ...h, ...newHymnData, number: hymnNumber } : h
        );
        return updatedHymns;
    });
    return { success: true };
  }, []);


  const deleteHymn = useCallback((hymnNumber: number) => {
    setHymns(prevHymns => prevHymns.filter(h => h.number !== hymnNumber));
  }, []);
  
  const getHymnById = useCallback((id: number): Hymn | undefined => {
    if (!isLoaded) return undefined;
    return hymns.find(h => h.number === id);
  }, [hymns, isLoaded]);

  const value = { hymns, addHymn, addHymns, updateHymn, deleteHymn, getHymnById, isLoaded };

  return <HymnsContext.Provider value={value}>{children}</HymnsContext.Provider>;
}

export function useHymns() {
  const context = useContext(HymnsContext);
  if (context === undefined) {
    throw new Error('useHymns must be used within a HymnsProvider');
  }
  return context;
}
