"use client";

import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { displayMode, toggleDisplayMode, isLoaded } = useAppearance();

  if (!isLoaded) return <div className="w-12 h-12" />;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDisplayMode}
      className="rounded-full w-12 h-12 bg-white/20 dark:bg-white/[0.05] backdrop-blur-xl border border-slate-200/50 dark:border-white/10 shadow-lg dark:shadow-blue-500/20 hover:bg-white/40 dark:hover:bg-white/[0.1] transition-all duration-500 group"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {displayMode === 'dark' ? (
          <Sun className="h-6 w-6 text-yellow-400 group-hover:rotate-90 transition-transform duration-700 animate-in zoom-in-50 spin-in-90" />
        ) : (
          <Moon className="h-6 w-6 text-primary group-hover:-rotate-45 transition-transform duration-700 animate-in zoom-in-50 spin-in-180" />
        )}
      </div>
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}
