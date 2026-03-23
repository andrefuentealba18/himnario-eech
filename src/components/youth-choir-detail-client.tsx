
"use client";

import type { YouthChoir } from '@/lib/youth-choirs';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut, Share2, Star } from 'lucide-react';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useRecents } from '@/hooks/use-recents';
import { useRouter, useSearchParams } from 'next/navigation';
import { YouthChoirAdminActions } from './youth-choir-admin-actions';
import { useCallback, useEffect } from 'react';
import { EditToneDialog } from './edit-tone-dialog';
import { useFontSize } from '@/hooks/use-font-size';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

interface YouthChoirDetailClientProps {
  youthChoirId: string;
}

const fontSizes = [
  'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl',
];

const groupLogos: Record<string, string> = {
  "Grupo Ciclista": "https://i.postimg.cc/QtWZZ88d/Imagen1.png",
  "Coro Juventud": "https://i.postimg.cc/bvk974Xp/IMG_2532.jpg",
};

function YouthChoirDetailSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-24">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 px-4 text-center">
                    <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                </div>
                <div className="w-12 h-12" />
            </header>
            <main className="flex-1 py-8 container max-w-2xl px-4">
                <div className="space-y-8 text-center">
                    <Skeleton className="h-24 w-full rounded-lg" />
                </div>
            </main>
        </div>
    );
}

export function YouthChoirDetailClient({ youthChoirId }: YouthChoirDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getYouthChoirById, deleteYouthChoir, updateYouthChoir, isLoaded: isYouthChoirsLoaded } = useYouthChoirs();
  const { isFavorite, toggleFavorite, isLoaded: isFavoritesLoaded } = useFavorites();
  const { addRecent } = useRecents();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);
  const { toast } = useToast();
  
  const from = searchParams.get('from');
  const backHref = from === 'admin' ? '/admin?tab=more-settings' : '/youth-choirs';

  const youthChoir = getYouthChoirById(youthChoirId);
  const groupLogo = youthChoir ? groupLogos[youthChoir.group] : null;

  useEffect(() => {
    if (youthChoir) {
      addRecent({
        id: youthChoir.id,
        title: youthChoir.title,
        type: 'youth-choir'
      });
    }
  }, [youthChoir, addRecent]);

  const handleDelete = useCallback(() => {
    if (!youthChoir) return;
    deleteYouthChoir(youthChoir.id);
    router.push('/youth-choirs');
  }, [deleteYouthChoir, youthChoir, router]);

  const handleUpdate = useCallback(async (updatedData: Omit<YouthChoir, 'id'>) => {
    if (!youthChoir) return { success: false };
    const result = await updateYouthChoir(youthChoir.id, updatedData);
    if(result.success) {
      toast({ title: "Alabanza Actualizada", description: `La alabanza "${updatedData.title}" se ha guardado correctamente.` });
      const newId = slugify(updatedData.title);
      if (newId !== youthChoir.id) {
        router.replace(`/youth-choirs/${newId}`);
      }
    } else {
       toast({ variant: 'destructive', title: 'Error al actualizar', description: 'No se pudo guardar el cambio.' });
    }
    return result;
  }, [youthChoir, updateYouthChoir, router, toast]);

  const handleToneUpdate = useCallback(async (newTone: string) => {
    if (!youthChoir) return { success: false };
    const { id, ...restOfYouthChoir } = youthChoir;
    return await handleUpdate({ ...restOfYouthChoir, tone: newTone });
  }, [youthChoir, handleUpdate]);

  const handleShare = useCallback(() => {
    if (!youthChoir) return;
    const text = `*Alabanza (${youthChoir.group}): ${youthChoir.title}*\n\n${youthChoir.lyrics}\n\n_Enviado desde Himnario EECH Móvil_`;
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }, [youthChoir]);

  if (!isYouthChoirsLoaded || !youthChoir) {
    return <YouthChoirDetailSkeleton />;
  }

  const isFav = isFavoritesLoaded && isFavorite(youthChoir.id, 'youth-choir');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-chart-5/10 animate-fade-in" />
      </div>
      
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-24">
        <Button variant="ghost" size="icon" asChild className="h-12 w-12">
          <Link href={backHref}>
            <ChevronLeft className="h-7 w-7" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden px-2">
            <h1 className="font-headline text-lg font-bold text-primary truncate text-center w-full">
              {youthChoir.title}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
                <EditToneDialog song={youthChoir} onToneUpdated={handleToneUpdate}>
                <Button variant="outline" size="sm" className="h-auto px-3 py-1 text-xs rounded-full">
                    {youthChoir.tone || 'Tonalidad'}
                </Button>
                </EditToneDialog>
                {youthChoir.speed && (
                    <Badge variant="secondary" className="text-xs capitalize rounded-full px-3 py-1">
                      {youthChoir.speed === 'Rapido' ? 'Avivamiento' : 'Meditación'}
                    </Badge>
                )}
            </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(youthChoir.id, 'youth-choir')} disabled={!isFavoritesLoaded} className="h-12 w-12">
          <Star className={`h-7 w-7 transition-all duration-300 transform-gpu ${isFav ? 'fill-yellow-400 text-yellow-400 scale-125' : 'text-foreground/70'}`} />
          <span className="sr-only">Marcar como favorito</span>
        </Button>
      </header>

      <main className="flex-1 py-8 px-4 flex flex-col justify-center items-center relative overflow-hidden">
        {groupLogo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 opacity-[0.12] dark:opacity-[0.08]">
            <Image 
              src={groupLogo} 
              alt="Watermark" 
              width={600} 
              height={600} 
              className="object-contain scale-110 sm:scale-100"
              priority
            />
          </div>
        )}

        <div className="w-full max-w-3xl bg-background/60 backdrop-blur-lg border rounded-2xl p-6 sm:p-10 shadow-xl relative">
          <div className={`font-body leading-loose text-center transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}>
            {youthChoir.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
              const isChorus = paragraph.trim().toUpperCase().startsWith('CORO');
              return (
                <p key={pIndex} className={`whitespace-pre-wrap mb-6 ${isChorus ? 'font-semibold' : ''}`}>
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 z-20 flex items-center justify-center gap-4 bg-transparent p-4">
           <div className="flex items-center justify-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg p-2">
            <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={!isFontLoaded || fontSizeIndex === 0} className="rounded-full h-10 w-10">
              <ZoomOut className="h-5 w-5" />
            </Button>
            <YouthChoirAdminActions youthChoir={youthChoir} onDelete={handleDelete} onUpdate={handleUpdate} />
            <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full h-10 w-10 text-green-600 hover:text-green-700">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === fontSizes.length - 1} className="rounded-full h-10 w-10">
              <ZoomIn className="h-5 w-5" />
            </Button>
         </div>
      </footer>
    </div>
  );
}
