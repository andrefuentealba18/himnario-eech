
"use client";

import type { Hymn } from '@/lib/hymns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useHymns } from '@/context/hymns-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useFontSize } from '@/hooks/use-font-size';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { HymnAdminActions } from '@/components/hymn-admin-actions';
import { Star, ChevronLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { useCallback } from 'react';
import { EditToneDialog } from './edit-tone-dialog';

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
  const router = useRouter();
  const { toast } = useToast();
  const { deleteHymn, updateHymn } = useHymns();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isFontLoaded } = useFontSize(fontSizes.length, 1);
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
  
  const isFav = isLoaded && isFavorite(hymn.number);

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
        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(hymn.number)} disabled={!isLoaded}>
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
              const isChorus = paragraph.startsWith('CORO:');
              return (
                <p key={pIndex} className={`whitespace-pre-wrap mb-4 ${isChorus ? 'font-bold leading-snug' : ''}`}>
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
