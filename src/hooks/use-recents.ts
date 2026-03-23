
"use client";

import { useState, useEffect, useCallback } from 'react';

const RECENTS_KEY = 'himnario_recents';
const MAX_RECENTS = 5;

export type RecentItem = {
  id: string | number;
  title: string;
  type: 'hymn' | 'praise' | 'choir' | 'youth-choir';
  number?: number;
  timestamp: number;
};

export function useRecents() {
  const [recents, setRecents] = useState<RecentItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTS_KEY);
      if (stored) {
        setRecents(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error cargando recientes", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
    }
  }, [recents, isLoaded]);

  const addRecent = useCallback((item: Omit<RecentItem, 'timestamp'>) => {
    setRecents(prev => {
      // Eliminar si ya existe para moverlo al principio
      const filtered = prev.filter(r => !(r.id === item.id && r.type === item.type));
      const newItem = { ...item, timestamp: Date.now() };
      return [newItem, ...filtered].slice(0, MAX_RECENTS);
    });
  }, []);

  return { recents, addRecent, isLoaded };
}
