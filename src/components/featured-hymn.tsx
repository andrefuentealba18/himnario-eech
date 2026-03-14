
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
      // Usar la fecha actual como semilla para que el himno cambie solo una vez al día
      const today = new Date().toDateString();
      const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const index = seed % hymns.length;
      setFeatured(hymns[index]);
    }
  }, [hymns, isLoaded, featured]);

  if (!isLoaded || !featured) return null;

  return (
    <div className="w-full max-w-lg mb-8 animate-in fade-in zoom-in-95 duration-700 delay-300">
      <Link href={`/hymns/${featured.number}`}>
        <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover:shadow-md transition-all active:scale-[0.98]">
          <CardContent className="p-0">
            <div className="flex items-center justify-between bg-primary/10 px-4 py-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Sugerencia del Día</span>
              </div>
              <span className="text-[10px] font-bold text-primary/60">Himno #{featured.number}</span>
            </div>
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-1 overflow-hidden">
                <h3 className="font-bold text-lg text-slate-900 truncate">{featured.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1 italic">
                  "{featured.lyrics.split('\n')[0]}..."
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
