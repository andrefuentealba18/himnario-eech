"use client";

import type { Hymn } from '@/lib/hymns';
import Link from 'next/link';
import { useFavorites } from '@/hooks/use-favorites';
import { useFontSize } from '@/hooks/use-font-size';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ZoomIn, ZoomOut } from 'lucide-react';

interface HymnDetailClientProps {
  hymn: Hymn;
}

const fontSizes = [
  'text-base',   // 16px
  'text-lg',   // 18px
  'text-xl',   // 20px
  'text-2xl',  // 24px
  'text-3xl',  // 30px
  'text-4xl',  // 36px
];

export function HymnDetailClient({ hymn }: HymnDetailClientProps) {
  // Start with a larger default font size, index 1 ('text-lg')
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
  
  const isFav = isLoaded && isFavorite(hymn.number);

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10"
      />
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-16">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/hymns">
            <ChevronLeft className="h-7 w-7" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="text-center px-4 overflow-hidden flex-1">
            <h1 className="font-bold font-headline text-lg truncate">{hymn.title}</h1>
            <p className="text-sm text-muted-foreground">Himno Nº {hymn.number}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(hymn.number)} disabled={!isLoaded}>
          <Star className={`h-6 w-6 transition-all duration-200 ${isFav ? 'fill-primary text-primary scale-110' : 'text-foreground'}`} />
          <span className="sr-only">Marcar como favorito</span>
        </Button>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-3xl px-6 text-center">
            {isFontLoaded ? (
              <div
                className={`font-body leading-loose transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}
              >
                {hymn.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
                  const isChorus = paragraph.startsWith('CORO:');
                  return (
                    <div key={pIndex} className="mb-6">
                      {paragraph.split('\n').map((line, lIndex) => (
                        <p key={lIndex} className={isChorus ? 'font-bold' : ''}>
                          {line}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            ) : (
                <div className="space-y-6">
                    <div className="h-6 w-3/4 bg-muted rounded animate-pulse mx-auto" />
                    <div className="h-6 w-full bg-muted rounded animate-pulse mx-auto" />
                    <div className="h-6 w-5/6 bg-muted rounded animate-pulse mx-auto" />
                    <div className="h-6 w-full bg-muted rounded animate-pulse mx-auto" />
                     <div className="h-6 w-3/4 bg-muted rounded animate-pulse pt-4 mx-auto" />
                    <div className="h-6 w-full bg-muted rounded animate-pulse mx-auto" />
                    <div className="h-6 w-5/6 bg-muted rounded animate-pulse mx-auto" />
                </div>
            )}
        </div>
      </main>
      
      <footer className="sticky bottom-0 z-20 flex items-center justify-center gap-4 bg-background/80 backdrop-blur-sm p-4 border-t">
           <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={!isFontLoaded || fontSizeIndex === 0} className="rounded-full h-14 w-14">
             <ZoomOut className="h-7 w-7" />
             <span className="sr-only">Reducir texto</span>
           </Button>
           <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === fontSizes.length - 1} className="rounded-full h-14 w-14">
             <ZoomIn className="h-7 w-7" />
             <span className="sr-only">Aumentar texto</span>
           </Button>
      </footer>
    </div>
  );
}
