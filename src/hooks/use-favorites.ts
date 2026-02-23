"use client";

import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'himnario_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(new Set(JSON.parse(storedFavorites)));
      }
    } catch (error) {
      console.error("No se pudieron cargar los favoritos desde localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
      } catch (error) {
        console.error("No se pudieron guardar los favoritos en localStorage", error);
      }
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = useCallback((hymnNumber: number) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(hymnNumber)) {
        newFavorites.delete(hymnNumber);
      } else {
        newFavorites.add(hymnNumber);
      }
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((hymnNumber: number) => {
    return favorites.has(hymnNumber);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
