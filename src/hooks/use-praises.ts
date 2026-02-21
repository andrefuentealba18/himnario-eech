"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Praise } from '@/lib/praises';

const PRAISES_KEY = 'himnario_praises';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function usePraises() {
  const [praises, setPraises] = useState<Praise[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedPraises = localStorage.getItem(PRAISES_KEY);
      if (storedPraises) {
        setPraises(JSON.parse(storedPraises));
      }
    } catch (error) {
      console.error("Failed to load praises from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(PRAISES_KEY, JSON.stringify(praises));
      } catch (error) {
        console.error("Failed to save praises to localStorage", error);
      }
    }
  }, [praises, isLoaded]);

  const addPraise = useCallback((newPraiseData: Omit<Praise, 'id'>): { success: boolean; praise?: Praise } => {
    const id = slugify(newPraiseData.title);
    if (praises.some(p => p.id === id)) {
      return { success: false };
    }
    const newPraise = { ...newPraiseData, id };
    setPraises(prevPraises => [...prevPraises, newPraise].sort((a, b) => a.title.localeCompare(b.title)));
    return { success: true, praise: newPraise };
  }, [praises]);

  const addPraises = useCallback((newPraisesData: Omit<Praise, 'id'>[]): { addedCount: number, duplicates: number } => {
    const existingIds = new Set(praises.map(p => p.id));
    const uniqueNewPraises: Praise[] = [];

    newPraisesData.forEach(praiseData => {
        const id = slugify(praiseData.title);
        if (!existingIds.has(id)) {
            uniqueNewPraises.push({ ...praiseData, id });
            existingIds.add(id);
        }
    });

    if (uniqueNewPraises.length > 0) {
        setPraises(prevPraises => [...prevPraises, ...uniqueNewPraises].sort((a, b) => a.title.localeCompare(b.title)));
    }

    return {
        addedCount: uniqueNewPraises.length,
        duplicates: newPraisesData.length - uniqueNewPraises.length
    };
  }, [praises]);

  const getPraiseById = useCallback((id: string): Praise | undefined => {
    if (!isLoaded) return undefined;
    return praises.find(p => p.id === id);
  }, [praises, isLoaded]);

  return { praises, addPraise, addPraises, getPraiseById, isLoaded };
}
