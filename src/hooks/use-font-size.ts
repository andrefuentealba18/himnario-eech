"use client";

import { useState, useEffect, useCallback } from 'react';

const FONT_SIZE_KEY = 'himnario_font_size_index';
const DEFAULT_FONT_SIZE_INDEX = 1; // 'text-base'

export function useFontSize(maxIndex: number) {
  const [fontSizeIndex, setFontSizeIndex] = useState(DEFAULT_FONT_SIZE_INDEX);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedIndex = localStorage.getItem(FONT_SIZE_KEY);
      if (storedIndex) {
        const parsedIndex = parseInt(storedIndex, 10);
        if (parsedIndex >= 0 && parsedIndex < maxIndex) {
          setFontSizeIndex(parsedIndex);
        }
      }
    } catch (error) {
      console.error("Failed to load font size from localStorage", error);
    }
    setIsLoaded(true);
  }, [maxIndex]);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FONT_SIZE_KEY, fontSizeIndex.toString());
      } catch (error) {
        console.error("Failed to save font size to localStorage", error);
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
