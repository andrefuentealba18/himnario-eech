"use client";

import type { SpecialOccasion } from '@/lib/special-occasions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut, Share2, Star } from 'lucide-react';
import { useSpecialOccasions } from '@/context/special-occasions-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useRecents } from '@/hooks/use-recents';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useFontSize } from '@/hooks/use-font-size';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const fontSizes = [
  'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl',
];

function DetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm pt-24 pb-6 px-4 border-b">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 px-4 text-center">
          <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
        </div>
        <div className="w-10 h-10" />
      </header>
      <main className="flex-1 py-8 container max-w-2xl px-4">
        <div className="space-y-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </main>
    </div>
  );
}

export function SpecialOccasionDetailClient({ specialId }: { specialId: string }) {
  const { getSpecialById, isLoaded: isDataLoaded } = useSpecialOccasions();
  const { isFavorite, toggleFavorite, isLoaded: isFavsLoaded } = useFavorites();
  const { addRecent } = useRecents();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize } = useFontSize(fontSizes.length, 1);
  const { toast } = useToast();
  
  const song = getSpecialById(specialId);

  useEffect(() => {
    if (song) {
      addRecent({
        id: song.id,
        title: song.title,
        type: 'praise' // Fallback para recents
      });
    }
  }, [song, addRecent]);

  const handleShare = useCallback(() => {
    if (!song) return;
    const text = `*Ocasión Especial (${song.category}): ${song.title}*\n\n${song.lyrics}\n\n_Enviado desde Himnario EECH Móvil_`;
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }, [song]);

  if (!isDataLoaded || !song) {
    return <DetailSkeleton />;
  }

  const isFav = isFavsLoaded && isFavorite(song.id, 'special-occasion');

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Fondo Patriótico Sutil */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[100vw] h-[100vw] bg-blue-500/5 rounded-full blur-[120px] animate-aura" />
        <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] bg-red-500/5 rounded-full blur-[100px] animate-aura" style={{ animationDirection: 'reverse' }} />
      </div>

      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/60 backdrop-blur-md pt-24 pb-6 px-4 border-b">
        <Button variant="ghost" size="icon" asChild className="h-12 w-12 rounded-full">
          <Link href="/special-occasions">
            <ChevronLeft className="h-7 w-7" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden px-2">
          <h1 className="font-headline text-lg font-bold text-amber-600 truncate text-center w-full">
            {song.title}
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Badge variant="outline" className="text-[10px] font-bold border-amber-200 text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">
              {song.category}
            </Badge>
            {song.tone && (
              <Badge variant="secondary" className="text-[10px] font-bold rounded-full px-2 py-0.5 bg-slate-100 dark:bg-white/5 border border-slate-200/50">
                {song.tone}
              </Badge>
            )}
          </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(song.id, 'special-occasion')} disabled={!isFavsLoaded} className="h-12 w-12 rounded-full">
          <Star className={`h-7 w-7 transition-all duration-300 transform-gpu ${isFav ? 'fill-yellow-400 text-yellow-400 scale-125' : 'text-foreground/70'}`} />
          <span className="sr-only">Marcar como favorito</span>
        </Button>
      </header>

      <main className="flex-1 py-10 px-4 flex flex-col items-center justify-start overflow-y-auto">
        <div className="w-full max-w-3xl bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className={`font-body leading-relaxed text-center transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}>
            {song.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
              const isChorus = paragraph.trim().toUpperCase().startsWith('CORO');
              return (
                <p key={pIndex} className={`whitespace-pre-wrap mb-8 last:mb-0 ${isChorus ? 'font-black text-amber-600 dark:text-amber-400' : 'text-foreground/90'}`}>
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
        <div className="h-32 w-full" />
      </main>

      <footer className="fixed bottom-8 left-0 w-full z-30 flex items-center justify-center px-4 pointer-events-none">
        <div className="flex items-center justify-center gap-3 bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-2xl p-2.5 animate-in slide-in-from-bottom-8 duration-1000 pointer-events-auto">
          <Button variant="outline" size="icon" onClick={decreaseFontSize} className="rounded-full h-11 w-11 bg-white/50 dark:bg-white/5">
            <ZoomOut className="h-5 w-5" />
          </Button>
          <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
          <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full h-11 w-11 text-green-600 hover:text-green-700 bg-white/50 dark:bg-white/5">
            <Share2 className="h-5 w-5" />
          </Button>
          <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
          <Button variant="outline" size="icon" onClick={increaseFontSize} className="rounded-full h-11 w-11 bg-white/50 dark:bg-white/5">
            <ZoomIn className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
