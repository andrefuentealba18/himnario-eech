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
      className="rounded-full w-12 h-12 bg-white/20 dark:bg-white/[0.05] backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-lg dark:shadow-blue-500/20 hover:bg-white/40 dark:hover:bg-white/[0.1] transition-all duration-500 group"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {theme === 'dark' ? (
          <Sun className="h-6 w-6 text-yellow-400 group-hover:rotate-90 transition-transform duration-700 animate-in zoom-in-50 spin-in-90" />
        ) : (
          <Moon className="h-6 w-6 text-primary group-hover:-rotate-45 transition-transform duration-700 animate-in zoom-in-50 spin-in-180" />
        )}
      </div>
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}