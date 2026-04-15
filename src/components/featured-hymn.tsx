"use client";

import { useHymns } from '@/context/hymns-context';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Hymn } from '@/lib/hymns';

export function FeaturedHymn() {
  const { hymns, isLoaded } = useHymns();
  const [featured, setFeatured] = useState<Hymn | null>(null);

  useEffect(() => {
    if (isLoaded && hymns.length > 0 && !featured) {
      // Usar la fecha actual como semilla para que cambie cada 24h
      const today = new Date().toDateString();
      const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const index = seed % hymns.length;
      setFeatured(hymns[index]);
    }
  }, [hymns, isLoaded, featured]);

  if (!isLoaded || !featured) return null;

  return (
    <div className="w-full max-w-lg mb-10 animate-in fade-in zoom-in-95 duration-1000 delay-300">
      <Link href={`/hymns/${featured.number}`}>
        <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-600/10 via-indigo-500/5 to-transparent hover:shadow-2xl transition-all duration-500 active:scale-[0.98] group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardContent className="p-0">
            <div className="flex items-center justify-between bg-primary/10 dark:bg-white/5 px-4 py-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80 dark:text-blue-400">Inspiración Diaria</span>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">Himno Nº {featured.number}</span>
            </div>
            <div className="p-6 flex items-center justify-between gap-4">
              <div className="space-y-1.5 overflow-hidden">
                <h3 className="font-bold text-xl text-slate-900 dark:text-white truncate group-hover:text-primary transition-colors">{featured.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1 italic italic opacity-80 font-medium">
                  "{featured.lyrics.split('\n')[0]}..."
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-lg group-hover:translate-x-1 transition-transform duration-300">
                <ArrowRight className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}