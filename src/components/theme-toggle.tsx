"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    } else if (prefersDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full w-10 h-10 bg-white/20 dark:bg-slate-800/20 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:bg-white/40 dark:hover:bg-slate-800/40 transition-all duration-300 group"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-400 group-hover:rotate-45 transition-transform duration-500" />
      ) : (
        <Moon className="h-5 w-5 text-primary group-hover:-rotate-12 transition-transform duration-500" />
      )}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}
