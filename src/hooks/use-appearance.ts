"use client";

import { useState, useEffect, useCallback } from 'react';

export type ColorTheme = 'blue' | 'purple' | 'green' | 'amber' | 'rose';
export type DisplayMode = 'light' | 'dark';
export type BackgroundDesign = 'aura' | 'grid' | 'clean';

const COLOR_THEME_KEY = 'himnario_color_theme';
const DISPLAY_MODE_KEY = 'himnario_display_mode';
const DESIGN_KEY = 'himnario_background_design';

export function useAppearance() {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('blue');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('light');
  const [design, setDesign] = useState<BackgroundDesign>('aura');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedColor = localStorage.getItem(COLOR_THEME_KEY) as ColorTheme;
    const savedMode = localStorage.getItem(DISPLAY_MODE_KEY) as DisplayMode;
    const savedDesign = localStorage.getItem(DESIGN_KEY) as BackgroundDesign;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedColor) setColorTheme(savedColor);
    if (savedDesign) setDesign(savedDesign);
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

    // Aplicar diseño de fondo
    document.documentElement.classList.remove('design-grid', 'design-none');
    if (design === 'grid') document.documentElement.classList.add('design-grid');
    if (design === 'clean') document.documentElement.classList.add('design-none');
    localStorage.setItem(DESIGN_KEY, design);

  }, [colorTheme, displayMode, design, isLoaded]);

  const toggleDisplayMode = useCallback(() => {
    setDisplayMode(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return { 
    colorTheme, 
    setColorTheme, 
    displayMode, 
    setDisplayMode, 
    design,
    setDesign,
    toggleDisplayMode,
    isLoaded 
  };
}