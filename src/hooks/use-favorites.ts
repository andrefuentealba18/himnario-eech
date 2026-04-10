"use client";

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'himnario_favorites_v2';
const LEGACY_FAVORITES_KEY = 'himnario_favorites';

export type FavoriteItem = {
  id: string | number;
  type: 'hymn' | 'praise' | 'choir' | 'youth-choir' | 'special-occasion';
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        const legacy = localStorage.getItem(LEGACY_FAVORITES_KEY);
        if (legacy) {
          const legacyIds: number[] = JSON.parse(legacy);
          const migrated: FavoriteItem[] = legacyIds.map(id => ({ id, type: 'hymn' }));
          setFavorites(migrated);
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(migrated));
        }
      }
    } catch (error) {
      console.error("Error cargando favoritos", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = useCallback((id: string | number, type: FavoriteItem['type']) => {
    setFavorites(prev => {
      const index = prev.findIndex(f => f.id === id && f.type === type);
      if (index >= 0) {
        return prev.filter((_, i) => i !== index);
      }
      return [...prev, { id, type }];
    });
  }, []);

  const isFavorite = useCallback((id: string | number, type: FavoriteItem['type']) => {
    return favorites.some(f => f.id === id && f.type === type);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
