"use client";

import type { Hymn } from '@/lib/hymns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHymns } from '@/context/hymns-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useFontSize } from '@/hooks/use-font-size';
import { useRecents } from '@/hooks/use-recents';
import { Button } from '@/components/ui/button';
import { HymnAdminActions } from '@/components/hymn-admin-actions';
import { Star, ChevronLeft, ZoomIn, ZoomOut, Share2, Sparkles } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { EditToneDialog } from './edit-tone-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface HymnDetailClientProps {
  hymnId: number;
}

const fontSizes = [
  'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl',
];

function HymnDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm pt-32 pb-6 px-4 border-b">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 px-4 text-center">
            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            <div className="flex items-center justify-center gap-2 mt-2">
                <Skeleton className="h-4 w-20 rounded-full" />
            </div>
        </div>
        <Skeleton className="h-10 w-10 rounded-full" />
      </header>
      <main className="flex-1 py-8 container max-w-2xl px-4">
        <div className="space-y-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mx-auto" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </main>
    </div>
  );
}

export function HymnDetailClient({ hymnId }: HymnDetailClientProps) {
  const router = useRouter();
  const { getHymnById, deleteHymn, updateHymn, isLoaded: isHymnsLoaded } = useHymns();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);
  const { isFavorite, toggleFavorite, isLoaded: isFavoritesLoaded } = useFavorites();
  const { addRecent } = useRecents();
  const { toast } = useToast();
  
  const hymn = getHymnById(hymnId);

  useEffect(() => {
    if (hymn) {
      addRecent({
        id: hymn.number,
        title: hymn.title,
        type: 'hymn',
        number: hymn.number
      });
    }
  }, [hymn, addRecent]);

  const handleDelete = useCallback(() => {
    if (!hymn) return;
    deleteHymn(hymn.number);
    router.push('/hymns');
  }, [deleteHymn, hymn, router]);

  const handleUpdate = useCallback(async (updatedData: Omit<Hymn, 'id' | 'number'>) => {
    if (!hymn) return { success: false };
    const result = await updateHymn(hymn.number, updatedData);
    if(result.success) {
      toast({ title: "Himno Actualizado", description: `El himno #${hymn.number} se ha guardado correctamente.` });
    } else {
      toast({ variant: 'destructive', title: 'Error al actualizar', description: 'No se pudo guardar el himno.' });
    }
    return result;
  }, [hymn, updateHymn, toast]);

  const handleToneUpdate = useCallback(async (newTone: string) => {
    if (!hymn) return { success: false };
    const { number, id, ...restOfHymn } = hymn;
    return await handleUpdate({ ...restOfHymn, tone: newTone });
  }, [hymn, handleUpdate]);

  const handleShare = useCallback(() => {
    if (!hymn) return;
    const text = `*Himno #${hymn.number}: ${hymn.title}*\n\n${hymn.lyrics}\n\n_Enviado desde Himnario EECH Móvil_`;
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }, [hymn]);

  if (!isHymnsLoaded || !hymn) {
    return <HymnDetailSkeleton />;
  }

  const isFav = isFavoritesLoaded && isFavorite(hymn.number, 'hymn');

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[140%] h-[140%] bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1)_0%,transparent_60%)] animate-aura-slow" />
        <div className="absolute bottom-0 left-0 w-[140%] h-[140%] bg-[radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.08)_0%,transparent_60%)] animate-aura-slow" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
        <div className="absolute inset-0 design-grid opacity-[0.03]" />
      </div>

      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/60 backdrop-blur-xl pt-16 pb-6 px-4 border-b transition-all duration-500">
        <Button variant="ghost" size="icon" asChild className="h-12 w-12 rounded-full hover:bg-primary/10">
          <Link href="/hymns">
            <ChevronLeft className="h-7 w-7 text-slate-600" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden px-2">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60">HIMNO OFICIAL</span>
            </div>
            <h1 className="font-headline text-lg font-bold text-foreground truncate text-center w-full tracking-tight">
              {hymn.title}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1.5">
                <p className="text-[10px] font-black text-white px-2.5 py-0.5 bg-primary/80 rounded-full shadow-lg shadow-primary/20">
                  Nº {hymn.number}
                </p>
                <EditToneDialog song={hymn} onToneUpdated={handleToneUpdate}>
                  <button className="text-[10px] font-bold text-primary px-2.5 py-0.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors backdrop-blur-md">
                    {hymn.tone || 'Tonalidad'}
                  </button>
                </EditToneDialog>
            </div>
        </div>

        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(hymn.number, 'hymn')} disabled={!isFavoritesLoaded} className="h-12 w-12 rounded-full">
          <Star className={`h-7 w-7 transition-all duration-500 transform-gpu ${isFav ? 'fill-yellow-400 text-yellow-400 scale-125 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'text-foreground/30'}`} />
          <span className="sr-only">Marcar como favorito</span>
        </Button>
      </header>

      <main className="flex-1 py-10 px-4 flex flex-col items-center justify-start overflow-y-auto">
        <div className="w-full max-w-3xl glass-morphism rounded-[2.5rem] p-8 sm:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 flex">
            <div className="h-full flex-1 bg-blue-600/40" />
            <div className="h-full flex-1 bg-white/40" />
            <div className="h-full flex-1 bg-red-600/40" />
          </div>
          
          <div className={`font-body leading-[1.8] text-center transition-all duration-300 ease-in-out ${fontSizes[fontSizeIndex]}`}>
            {hymn.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
              const lines = paragraph.trim().split('\n');
              const isChorus = lines[0].trim().toUpperCase().startsWith('CORO');
              
              return (
                <div key={pIndex} className={cn(
                  "mb-12 last:mb-0 transition-all duration-500",
                  isChorus ? "bg-primary/5 dark:bg-primary/10 p-8 rounded-3xl border border-primary/10 relative" : ""
                )}>
                  {isChorus && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg uppercase tracking-widest">
                      Coro
                    </div>
                  )}
                  {lines.map((line, lIndex) => {
                    if (isChorus && lIndex === 0) return null;
                    return (
                      <p key={lIndex} className={cn(
                        "whitespace-pre-wrap mb-1 last:mb-0",
                        isChorus ? "font-black text-primary dark:text-blue-400 italic" : "text-foreground/90 font-medium"
                      )}>
                        {line}
                      </p>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className="h-40 w-full" />
      </main>
      
      <footer className="fixed bottom-8 left-0 w-full z-30 flex items-center justify-center px-4 pointer-events-none">
         <div className="flex items-center justify-center gap-3 bg-background/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] p-2.5 animate-in slide-in-from-bottom-8 duration-1000 pointer-events-auto hover:scale-105 transition-transform">
            <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={!isFontLoaded || fontSizeIndex === 0} className="rounded-full h-12 w-12 bg-white/50 dark:bg-white/5 border-none shadow-inner active:scale-90 transition-all">
              <ZoomOut className="h-5 w-5" />
            </Button>
            <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
            <div className="flex gap-2">
              <HymnAdminActions hymn={hymn} onDelete={handleDelete} onUpdate={handleUpdate} />
              <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full h-12 w-12 text-green-600 hover:text-green-700 bg-white/50 dark:bg-white/5 border-none shadow-inner active:scale-90 transition-all">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-white/10" />
            <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === fontSizes.length - 1} className="rounded-full h-12 w-12 bg-white/50 dark:bg-white/5 border-none shadow-inner active:scale-90 transition-all">
              <ZoomIn className="h-5 w-5" />
            </Button>
         </div>
      </footer>
    </div>
  );
}