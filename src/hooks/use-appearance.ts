"use client";

import { useState, useEffect, useCallback } from 'react';

export type ColorTheme = 'blue' | 'purple' | 'green' | 'amber' | 'rose';
export type DisplayMode = 'light' | 'dark';

const COLOR_THEME_KEY = 'himnario_color_theme';
const DISPLAY_MODE_KEY = 'himnario_display_mode';

export function useAppearance() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('blue');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedColor = localStorage.getItem(COLOR_THEME_KEY) as ColorTheme;
    const savedMode = localStorage.getItem(DISPLAY_MODE_KEY) as DisplayMode;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedColor) setColorTheme(savedColor);
    if (savedMode) {
      setDisplayMode(savedMode);
    } else if (prefersDark) {
      setDisplayMode('dark');
    }
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    // Aplicar modo claro/oscuro
    if (displayMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(DISPLAY_MODE_KEY, displayMode);

    // Aplicar tema de color
    const themes: ColorTheme[] = ['blue', 'purple', 'green', 'amber', 'rose'];
    themes.forEach(t => document.documentElement.classList.remove(`theme-${t}`));
    if (colorTheme !== 'blue') {
      document.documentElement.classList.add(`theme-${colorTheme}`);
    }
    localStorage.setItem(COLOR_THEME_KEY, colorTheme);
  }, [colorTheme, displayMode, isLoaded]);

  const toggleDisplayMode = useCallback(() => {
    setDisplayMode(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return { 
    colorTheme, 
    setColorTheme, 
    displayMode, 
    setDisplayMode, 
    toggleDisplayMode,
    isLoaded 
  };
}
