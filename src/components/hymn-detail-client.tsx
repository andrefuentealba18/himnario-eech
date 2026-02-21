"use client";

import type { Hymn } from '@/lib/hymns';
import Link from 'next/link';
import { useRouter, notFound } from 'next/navigation';
import { useHymns } from '@/context/hymns-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useFontSize } from '@/hooks/use-font-size';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { HymnAdminActions } from '@/components/hymn-admin-actions';
import { Star, ChevronLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { EditToneDialog } from './edit-tone-dialog';
import { Skeleton } from '@/components/ui/skeleton';

interface HymnDetailClientProps {
  hymnId: number;
}

const fontSizes = [
  'text-base',   // 16px
  'text-lg',   // 18px
  'text-xl',   // 20px
  'text-2xl',  // 24px
  'text-3xl',  // 30px
  'text-4xl',  // 36px
];

export function HymnDetailClient({ hymnId }: HymnDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { getHymnById, deleteHymn, updateHymn, isLoaded: isHymnsLoaded } = useHymns();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);
  const { isFavorite, toggleFavorite, isLoaded: isFavoritesLoaded } = useFavorites();
  
  const hymn = getHymnById(hymnId);

  useEffect(() => {
    if (isHymnsLoaded && !hymn) {
      notFound();
    }
  }, [isHymnsLoaded, hymn]);

  if (!isHymnsLoaded || !hymn) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-16">
                <Skeleton className="h-10 w-10 rounded-full" />
                 <div className="flex-1 px-4">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                 </div>
                <Skeleton className="h-10 w-10 rounded-full" />
            </header>
            <main className="flex-1 py-8 container max-w-sm">
                <div className="space-y-4 text-center">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-5/6 mx-auto" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-4/6 mx-auto" />
                </div>
            </main>
        </div>
    );
  }

  const isFav = isFavoritesLoaded && isFavorite(hymn.number);

  const handleDelete = useCallback(() => {
    deleteHymn(hymn.number);
    toast({ title: "Himno Eliminado", description: `El himno #${hymn.number} se ha eliminado.` });
    router.push('/hymns');
  }, [deleteHymn, hymn.number, router, toast]);

  const handleUpdate = useCallback((updatedData: Omit<Hymn, 'number'>): { success: boolean } => {
    const result = updateHymn(hymn.number, updatedData);
    if (result.success) {
      toast({ title: "Himno Actualizado" });
    }
    return result;
  }, [hymn.number, updateHymn, toast]);

  const handleToneUpdate = useCallback((newTone: string) => {
    const { number, ...restOfHymn } = hymn;
    return handleUpdate({ ...restOfHymn, tone: newTone });
  }, [hymn, handleUpdate]);


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
            <div className="flex items-center justify-center gap-2 mt-1">
                <p className="text-sm text-muted-foreground">
                  Himno Nº {hymn.number}
                </p>
                <EditToneDialog song={hymn} onToneUpdated={handleToneUpdate}>
                  <Button variant="outline" size="sm" className="h-auto px-2 py-0.5 text-xs">
                    {hymn.tone || 'Tonalidad: Indefinida'}
                  </Button>
                </EditToneDialog>
            </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(hymn.number)} disabled={!isFavoritesLoaded}>
          <Star className={`h-6 w-6 transition-all duration-200 ${isFav ? 'fill-primary text-primary scale-110' : 'text-foreground'}`} />
          <span className="sr-only">Marcar como favorito</span>
        </Button>
      </header>

      <main className="flex-1 py-8 flex justify-center px-4">
        <div className="max-w-[20rem] text-center">
          <div
            className={`font-body leading-relaxed transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}
          >
            {hymn.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
              const isChorus = paragraph.trim().toUpperCase().startsWith('CORO');
              if (isChorus) {
                  const chorusText = paragraph.substring(paragraph.toUpperCase().indexOf('CORO') + 4).trim().replace(/^:/, '').trim();
                  return (
                    <p key={pIndex} className="whitespace-pre-wrap mb-4 font-bold leading-snug">
                      CORO:
                      {chorusText && `\n${chorusText}`}
                    </p>
                  )
              }
              return (
                 <p key={pIndex} className="whitespace-pre-wrap mb-4">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </main>
      
      <footer className="sticky bottom-0 z-20 flex items-center justify-center gap-4 bg-background/80 backdrop-blur-sm p-4 border-t">
           <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={!isFontLoaded || fontSizeIndex === 0} className="rounded-full h-14 w-14">
             <ZoomOut className="h-7 w-7" />
             <span className="sr-only">Reducir texto</span>
           </Button>
           <HymnAdminActions hymn={hymn} onDelete={handleDelete} onUpdate={handleUpdate} />
           <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === fontSizes.length - 1} className="rounded-full h-14 w-14">
             <ZoomIn className="h-7 w-7" />
             <span className="sr-only">Aumentar texto</span>
           </Button>
      </footer>
    </div>
  );
}
