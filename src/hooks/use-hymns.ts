"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Hymn } from '@/lib/hymns';
import { hymns as initialHymns } from '@/lib/hymns';

const HYMNS_KEY = 'himnario_hymns';

export function useHymns() {
  const [hymns, setHymns] = useState<Hymn[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHymns = localStorage.getItem(HYMNS_KEY);
      if (storedHymns) {
        setHymns(JSON.parse(storedHymns));
      } else {
        setHymns(initialHymns.sort((a, b) => a.number - b.number));
      }
    } catch (error) {
      console.error("Failed to load hymns from localStorage", error);
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

  const addHymns = useCallback((newHymnsData: Hymn[]): { addedCount: number, duplicates: number } => {
    const existingNumbers = new Set(hymns.map(p => p.number));
    const uniqueNewHymns: Hymn[] = [];

    newHymnsData.forEach(hymn => {
        if (!existingNumbers.has(hymn.number)) {
            uniqueNewHymns.push(hymn);
            existingNumbers.add(hymn.number);
        }
    });

    if (uniqueNewHymns.length > 0) {
        setHymns(prevHymns => [...prevHymns, ...uniqueNewHymns].sort((a, b) => a.number - b.number));
    }

    return {
        addedCount: uniqueNewHymns.length,
        duplicates: newHymnsData.length - uniqueNewHymns.length
    };
  }, [hymns]);

  const deleteHymn = useCallback((hymnNumber: number) => {
    setHymns(prevHymns => prevHymns.filter(h => h.number !== hymnNumber));
  }, []);
  
  const getHymnById = useCallback((id: number): Hymn | undefined => {
    if (!isLoaded) return undefined;
    return hymns.find(h => h.number === id);
  }, [hymns, isLoaded]);

  return { hymns, addHymn, addHymns, deleteHymn, getHymnById, isLoaded };
}
