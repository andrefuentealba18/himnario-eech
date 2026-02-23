"use client";

import { useState, useEffect, useCallback } from 'react';

const FONT_SIZE_KEY = 'himnario_font_size_index';
const DEFAULT_FONT_SIZE_INDEX = 1; // Corresponds to the second element in the fontSizes array

export function useFontSize(maxIndex: number, defaultIndex: number = DEFAULT_FONT_SIZE_INDEX) {
  const [fontSizeIndex, setFontSizeIndex] = useState(defaultIndex);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedIndex = localStorage.getItem(FONT_SIZE_KEY);
      if (storedIndex) {
        const parsedIndex = parseInt(storedIndex, 10);
        if (parsedIndex >= 0 && parsedIndex < maxIndex) {
          setFontSizeIndex(parsedIndex);
        }
      } else {
        // If nothing is stored, use the default passed to the hook
        setFontSizeIndex(defaultIndex);
      }
    } catch (error) {
      console.error("No se pudo cargar el tamaño de fuente desde localStorage", error);
    }
    setIsLoaded(true);
  }, [maxIndex, defaultIndex]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FONT_SIZE_KEY, fontSizeIndex.toString());
      } catch (error) {
        console.error("No se pudo guardar el tamaño de fuente en localStorage", error);
      }
    }
  }, [fontSizeIndex, isLoaded]);

  const increaseFontSize = useCallback(() => {
    setFontSizeIndex(prevIndex => Math.min(prevIndex + 1, maxIndex - 1));
  }, [maxIndex]);

  const decreaseFontSize = useCallback(() => {
    setFontSizeIndex(prevIndex => Math.max(prevIndex - 1, 0));
  }, []);

  return { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded };
}
