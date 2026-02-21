"use client";

import type { Hymn } from '@/lib/hymns';
import Link from 'next/link';
import { useFavorites } from '@/hooks/use-favorites';
import { useFontSize } from '@/hooks/use-font-size';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, Plus, Minus } from 'lucide-react';

interface HymnDetailClientProps {
  hymn: Hymn;
}

const fontSizes = [
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
];

export function HymnDetailClient({ hymn }: HymnDetailClientProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length);
  
  const isFav = isLoaded && isFavorite(hymn.number);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/hymns">
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={decreaseFontSize} disabled={!isFontLoaded || fontSizeIndex === 0}>
             <Minus className="h-5 w-5" />
             <span className="sr-only">Reducir texto</span>
           </Button>
           <Button variant="ghost" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === fontSizes.length - 1}>
             <Plus className="h-5 w-5" />
             <span className="sr-only">Aumentar texto</span>
           </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(hymn.number)} disabled={!isLoaded}>
          <Star className={`h-6 w-6 transition-colors ${isFav ? 'fill-primary text-primary' : 'text-foreground'}`} />
          <span className="sr-only">Marcar como favorito</span>
        </Button>
      </header>

      <main className="flex-1 p-4">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-center font-headline">
              <span className="text-primary font-bold">{hymn.number}</span>. {hymn.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isFontLoaded && (
              <pre
                className={`whitespace-pre-wrap font-body leading-relaxed ${fontSizes[fontSizeIndex]}`}
                style={{ transition: 'font-size 0.2s ease-in-out' }}
              >
                {hymn.lyrics}
              </pre>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
