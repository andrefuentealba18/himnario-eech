
"use client";

import type { SpecialOccasion } from '@/lib/special-occasions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut, Share2, Star } from 'lucide-react';
import { useSpecialOccasions } from '@/context/special-occasions-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useRecents } from '@/hooks/use-recents';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useFontSize } from '@/hooks/use-font-size';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const fontSizes = [
  'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl',
];

export function SpecialOccasionDetailClient({ specialId }: { specialId: string }) {
  const { getSpecialById, isLoaded } = useSpecialOccasions();
  const { isFavorite, toggleFavorite, isLoaded: favsLoaded } = useFavorites();
  const { addRecent } = useRecents();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize } = useFontSize(fontSizes.length, 1);
  
  const song = getSpecialById(specialId);

  useEffect(() => {
    if (song) {
      addRecent({ id: song.id, title: song.title, type: 'praise' }); // Fallback type
    }
  }, [song, addRecent]);

  const handleShare = useCallback(() => {
    if (!song) return;
    const text = `*${song.category}: ${song.title}*\n\n${song.lyrics}\n\n_Enviado desde Himnario EECH Móvil_`;
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }, [song]);

  if (!isLoaded || !song) {
    return <div className="p-8"><Skeleton className="h-40 w-full rounded-2xl" /></div>;
  }

  const isFav = favsLoaded && isFavorite(song.id, 'special-occasion' as any);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/60 backdrop-blur-md pt-24 pb-6 px-4 border-b">
        <Button variant="ghost" size="icon" asChild className="h-12 w-12 rounded-full">
          <Link href="/special-occasions"><ChevronLeft className="h-7 w-7" /></Link>
        </Button>
        <div className="flex-1 flex flex-col items-center px-2 overflow-hidden">
          <h1 className="font-headline text-lg font-bold text-amber-600 truncate text-center w-full">{song.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-[10px] border-amber-200 text-amber-700 bg-amber-50">{song.category}</Badge>
            {song.tone && <Badge variant="secondary" className="text-[10px]">{song.tone}</Badge>}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(song.id, 'special-occasion' as any)} className="h-12 w-12 rounded-full">
          <Star className={`h-7 w-7 transition-all ${isFav ? 'fill-yellow-400 text-yellow-400 scale-125' : 'text-foreground/70'}`} />
        </Button>
      </header>

      <main className="flex-1 py-10 px-4 flex flex-col items-center justify-start overflow-y-auto">
        <div className="w-full max-w-3xl bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className={`font-body leading-relaxed text-center transition-all ${fontSizes[fontSizeIndex]}`}>
            {song.lyrics.split(/\n\s*\n/).map((p, i) => (
              <p key={i} className={`whitespace-pre-wrap mb-8 last:mb-0 ${p.trim().toUpperCase().startsWith('CORO') ? 'font-black text-amber-600' : 'text-foreground/90'}`}>{p}</p>
            ))}
          </div>
        </div>
        <div className="h-32" />
      </main>

      <footer className="fixed bottom-8 left-0 w-full z-30 flex justify-center px-4">
        <div className="flex items-center gap-3 bg-background/80 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl p-2.5">
          <Button variant="outline" size="icon" onClick={decreaseFontSize} className="rounded-full h-11 w-11"><ZoomOut className="h-5 w-5" /></Button>
          <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full h-11 w-11 text-green-600"><Share2 className="h-5 w-5" /></Button>
          <Button variant="outline" size="icon" onClick={increaseFontSize} className="rounded-full h-11 w-11"><ZoomIn className="h-5 w-5" /></Button>
        </div>
      </footer>
    </div>
  );
}
