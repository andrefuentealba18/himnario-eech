
"use client";

import type { Choir } from '@/lib/choirs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut, Share2, Star } from 'lucide-react';
import { useChoirs } from '@/context/choirs-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useRecents } from '@/hooks/use-recents';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChoirAdminActions } from './choir-admin-actions';
import { useCallback, useEffect } from 'react';
import { EditToneDialog } from './edit-tone-dialog';
import { useFontSize } from '@/hooks/use-font-size';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
    
interface ChoirDetailClientProps {
  choirId: string;
}

const fontSizes = [
  'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl',
];

function ChoirDetailSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm pt-32 pb-8 px-4 border-b h-48">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 px-4 text-center">
                    <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                </div>
                <div className="w-12 h-12" />
            </header>
            <main className="flex-1 py-8 container max-w-2xl px-4">
                <div className="space-y-8 text-center">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                </div>
            </main>
        </div>
    );
}

export function ChoirDetailClient({ choirId }: ChoirDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getChoirById, deleteChoir, updateChoir, isLoaded: isChoirsLoaded } = useChoirs();
  const { isFavorite, toggleFavorite, isLoaded: isFavoritesLoaded } = useFavorites();
  const { addRecent } = useRecents();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);
  const { toast } = useToast();

  const from = searchParams.get('from');
  const backHref = from === 'admin' ? '/admin?tab=more-settings' : '/choirs';

  const choir = getChoirById(choirId);

  useEffect(() => {
    if (choir) {
      addRecent({
        id: choir.id,
        title: choir.title,
        type: 'choir'
      });
    }
  }, [choir, addRecent]);

  const handleDelete = useCallback(() => {
    if (!choir) return;
    deleteChoir(choir.id);
    router.push('/choirs');
  }, [deleteChoir, choir, router]);

  const handleUpdate = useCallback(async (updatedData: Omit<Choir, 'id'>) => {
    if (!choir) return { success: false };
    const result = await updateChoir(choir.id, updatedData);
    if(result.success) {
        toast({ title: "Coro Actualizado", description: `El coro "${updatedData.title}" se ha guardado correctamente.` });
        const newId = slugify(updatedData.title);
        if (newId !== choir.id) {
          router.replace(`/choirs/${newId}`);
        }
    } else {
        toast({ variant: 'destructive', title: 'Error al actualizar', description: 'No se pudo guardar el cambio.' });
    }
    return result;
  }, [choir, updateChoir, router, toast]);

  const handleToneUpdate = useCallback(async (newTone: string) => {
    if (!choir) return { success: false };
    const { id, ...restOfChoir } = choir;
    return await handleUpdate({ ...restOfChoir, tone: newTone });
  }, [choir, handleUpdate]);

  const handleShare = useCallback(() => {
    if (!choir) return;
    const text = `*Coro: ${choir.title}*\n\n${choir.lyrics}\n\n_Enviado desde Himnario EECH Móvil_`;
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }, [choir]);

  if (!isChoirsLoaded || !choir) {
    return <ChoirDetailSkeleton />;
  }

  const isFav = isFavoritesLoaded && isFavorite(choir.id, 'choir');

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[20%] w-[140%] h-[140%] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(225,232,255,0.2)_0deg,transparent_120deg,rgba(255,225,232,0.15)_240deg,transparent_360deg)] animate-aura" />
      </div>

      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/60 backdrop-blur-md pt-32 pb-8 px-4 border-b h-48">
        <Button variant="ghost" size="icon" asChild className="h-12 w-12">
          <Link href={backHref}>
            <ChevronLeft className="h-7 w-7" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden px-2">
            <h1 className="font-headline text-lg font-bold text-primary truncate text-center w-full">
              {choir.title}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
                <EditToneDialog song={choir} onToneUpdated={handleToneUpdate}>
                  <Button variant="outline" size="sm" className="h-auto px-3 py-1 text-xs rounded-full bg-white/50 backdrop-blur-sm">
                    {choir.tone || 'Tonalidad'}
                  </Button>
                </EditToneDialog>
                 {choir.speed && (
                    <Badge variant="secondary" className="text-xs capitalize rounded-full px-3 py-1 bg-white/50 backdrop-blur-sm">
                      {choir.speed === 'Rapido' ? 'Avivamiento' : 'Meditación'}
                    </Badge>
                )}
            </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(choir.id, 'choir')} disabled={!isFavoritesLoaded} className="h-12 w-12">
          <Star className={`h-7 w-7 transition-all duration-300 transform-gpu ${isFav ? 'fill-yellow-400 text-yellow-400 scale-125' : 'text-foreground/70'}`} />
          <span className="sr-only">Marcar como favorito</span>
        </Button>
      </header>

      <main className="flex-1 py-8 px-4 flex flex-col justify-center items-center">
        <div className="w-full max-w-3xl bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-1000">
          <div className={`font-body leading-loose text-center transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}>
            {choir.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
              const isChorus = paragraph.trim().toUpperCase().startsWith('CORO');
              return (
                <p key={pIndex} className={`whitespace-pre-wrap mb-6 ${isChorus ? 'font-black text-primary dark:text-blue-400' : 'text-foreground/90'}`}>
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 z-20 flex items-center justify-center gap-4 bg-transparent p-4 pb-8">
           <div className="flex items-center justify-center gap-2 bg-background/60 backdrop-blur-xl border border-white/50 rounded-full shadow-2xl p-2 animate-in slide-in-from-bottom-4 duration-1000">
            <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={!isFontLoaded || fontSizeIndex === 0} className="rounded-full h-10 w-10 bg-white/50">
              <ZoomOut className="h-5 w-5" />
            </Button>
            <ChoirAdminActions choir={choir} onDelete={handleDelete} onUpdate={handleUpdate} />
            <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full h-10 w-10 text-green-600 hover:text-green-700 bg-white/50">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === fontSizes.length - 1} className="rounded-full h-10 w-10 bg-white/50">
              <ZoomIn className="h-5 w-5" />
            </Button>
         </div>
      </footer>
    </div>
  );
}
