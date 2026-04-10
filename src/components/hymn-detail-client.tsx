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
import { Star, ChevronLeft, ZoomIn, ZoomOut, Share2 } from 'lucide-react';
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
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm pt-24 pb-6 px-4 border-b">
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
        <div className="absolute top-0 right-0 w-[120%] h-[120%] bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.08)_0%,transparent_60%)] animate-aura" />
        <div className="absolute bottom-0 left-0 w-[120%] h-[120%] bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.05)_0%,transparent_60%)] animate-aura" style={{ animationDuration: '20s' }} />
      </div>

      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/60 backdrop-blur-md pt-24 pb-6 px-4 border-b">
        <Button variant="ghost" size="icon" asChild className="h-12 w-12 rounded-full">
          <Link href="/hymns">
            <ChevronLeft className="h-7 w-7" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden px-2">
            <h1 className="font-headline text-lg font-bold text-primary truncate text-center w-full">
              {hymn.title}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200/50">
                  Himno Nº {hymn.number}
                </p>
                <EditToneDialog song={hymn} onToneUpdated={handleToneUpdate}>
                  <button className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                    {hymn.tone || 'Tonalidad'}
                  </button>
                </EditToneDialog>
            </div>
        </div>

        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(hymn.number, 'hymn')} disabled={!isFavoritesLoaded} className="h-12 w-12 rounded-full">
          <Star className={`h-7 w-7 transition-all duration-300 transform-gpu ${isFav ? 'fill-yellow-400 text-yellow-400 scale-125' : 'text-foreground/70'}`} />
          <span className="sr-only">Marcar como favorito</span>
        </Button>
      </header>

      <main className="flex-1 py-10 px-4 flex flex-col items-center justify-start overflow-y-auto">
        <div className="w-full max-w-3xl bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className={`font-body leading-relaxed text-center transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}>
            {hymn.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
              const isChorus = paragraph.trim().toUpperCase().startsWith('CORO');
              return (
                <p key={pIndex} className={`whitespace-pre-wrap mb-8 last:mb-0 ${isChorus ? 'font-black text-primary dark:text-blue-400' : 'text-foreground/90'}`}>
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
        <div className="h-32 w-full" /> {/* Spacer for footer */}
      </main>
      
      <footer className="fixed bottom-8 left-0 w-full z-30 flex items-center justify-center px-4 pointer-events-none">
         <div className="flex items-center justify-center gap-3 bg-background/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-2xl p-2.5 animate-in slide-in-from-bottom-8 duration-1000 pointer-events-auto">
            <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={!isFontLoaded || fontSizeIndex === 0} className="rounded-full h-11 w-11 bg-white/50 dark:bg-white/5">
              <ZoomOut className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
            <HymnAdminActions hymn={hymn} onDelete={handleDelete} onUpdate={handleUpdate} />
            <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full h-11 w-11 text-green-600 hover:text-green-700 bg-white/50 dark:bg-white/5">
              <Share2 className="h-5 w-5" />
            </Button>
            <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
            <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === fontSizes.length - 1} className="rounded-full h-11 w-11 bg-white/50 dark:bg-white/5">
              <ZoomIn className="h-5 w-5" />
            </Button>
         </div>
      </footer>
    </div>
  );
}
