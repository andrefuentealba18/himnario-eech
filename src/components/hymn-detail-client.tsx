"use client";

import type { Hymn } from '@/lib/hymns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHymns } from '@/context/hymns-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useFontSize } from '@/hooks/use-font-size';
import { Button } from '@/components/ui/button';
import { HymnAdminActions } from '@/components/hymn-admin-actions';
import { Star, ChevronLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback } from 'react';
import { EditToneDialog } from './edit-tone-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface HymnDetailClientProps {
  hymnId: number;
}

const fontSizes = [
  'text-base', // 16px
  'text-lg',   // 18px
  'text-xl',   // 20px
  'text-2xl',  // 24px
  'text-3xl',  // 30px
  'text-4xl',  // 36px
  'text-5xl',  // 48px
  'text-6xl',  // 60px
  'text-7xl',  // 72px
];

function HymnDetailSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-20">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 px-4 text-center">
            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
            <div className="flex items-center justify-center gap-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-5 w-1/4" />
            </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </header>
      <main className="flex-1 py-8 container max-w-2xl px-4">
        <div className="space-y-6 text-center">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6 mx-auto" />
          <Skeleton className="h-6 w-4/6 mx-auto mb-8" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6 mx-auto" />
        </div>
      </main>
      <footer className="sticky bottom-0 z-20 flex items-center justify-center gap-4 bg-background/80 backdrop-blur-sm p-4 border-t">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-14 w-14 rounded-full" />
      </footer>
    </div>
  );
}

export function HymnDetailClient({ hymnId }: HymnDetailClientProps) {
  const router = useRouter();
  const { getHymnById, deleteHymn, updateHymn, isLoaded: isHymnsLoaded } = useHymns();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);
  const { isFavorite, toggleFavorite, isLoaded: isFavoritesLoaded } = useFavorites();
  const { toast } = useToast();
  
  const hymn = getHymnById(hymnId);

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

  if (!isHymnsLoaded || !hymn) {
    return <HymnDetailSkeleton />;
  }

  const isFav = isFavoritesLoaded && isFavorite(hymn.number);

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-fade-in" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-secondary/40 rounded-full filter blur-3xl opacity-30 animate-fade-in" />
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-10"
      />
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-20">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/hymns">
            <ChevronLeft className="h-7 w-7" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="text-center px-4 overflow-hidden flex-1">
            <h1 className="font-headline text-2xl font-bold text-primary truncate">{hymn.title}</h1>
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
        <div className="w-full max-w-2xl">
          <div
            className={`font-body leading-relaxed text-center transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}
          >
            {hymn.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
              const isChorus = paragraph.trim().toUpperCase().startsWith('CORO');
              if (isChorus) {
                  return (
                    <div key={pIndex} className="mb-6 bg-primary/10 p-4 rounded-lg border border-primary/20">
                        <p className="whitespace-pre-wrap font-bold leading-snug">
                            {paragraph}
                        </p>
                    </div>
                  )
              }
              return (
                 <p key={pIndex} className="whitespace-pre-wrap mb-6">
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
