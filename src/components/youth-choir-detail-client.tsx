
"use client";

import type { YouthChoir } from '@/lib/youth-choirs';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut, Share2 } from 'lucide-react';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { YouthChoirAdminActions } from './youth-choir-admin-actions';
import { useCallback, useEffect } from 'react';
import { EditToneDialog } from './edit-tone-dialog';
import { useFontSize } from '@/hooks/use-font-size';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

function YouthChoirDetailSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-24">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 px-4 text-center">
                    <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                    <Skeleton className="h-6 w-24 mx-auto mt-2 rounded-full" />
                </div>
                <div className="w-12 h-12" />
            </header>
            <main className="flex-1 py-8 container max-w-2xl px-4">
                <div className="space-y-8 text-center">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6 mx-auto" />
                    <Skeleton className="h-6 w-4/6 mx-auto mb-8" />
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6 mx-auto" />
                </div>
            </main>
            <footer className="sticky bottom-0 z-20 flex items-center justify-center gap-4 bg-transparent p-4">
              <div className="flex items-center justify-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg p-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-14 w-14 rounded-full" />
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </footer>
        </div>
    );
}

export function YouthChoirDetailClient({ youthChoirId }: YouthChoirDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getYouthChoirById, deleteYouthChoir, updateYouthChoir, isLoaded: isYouthChoirsLoaded } = useYouthChoirs();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);
  const { toast } = useToast();
  
  const from = searchParams.get('from');
  const backHref = from === 'admin' ? '/admin?tab=more-settings' : '/youth-choirs';

  const youthChoir = getYouthChoirById(youthChoirId);

  const isCiclista = youthChoir?.group === 'Grupo Ciclista';

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
       toast({ variant: 'destructive', title: 'Error al actualizar', description: result.error === 'duplicate' ? 'Ya existe una alabanza con ese título.' : 'No se pudo guardar el cambio.' });
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

  useEffect(() => {
    if (isYouthChoirsLoaded && !youthChoir) {
      return;
    }

    if (youthChoir && youthChoirId !== youthChoir.id) {
        router.replace(`/youth-choirs/${youthChoir.id}`);
    }
  }, [youthChoir, youthChoirId, router, isYouthChoirsLoaded]);

  if (!isYouthChoirsLoaded || !youthChoir) {
    return <YouthChoirDetailSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-chart-5/10 animate-fade-in" />
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/20 rounded-full filter blur-3xl opacity-50 animate-pulse-slow" />
        <div className="absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 bg-chart-4/20 rounded-full filter blur-3xl opacity-40 animate-pulse-slow" style={{ animationDelay: '2s' }} />
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
                    <Badge variant="secondary" className="text-xs capitalize rounded-full px-3 py-1">{youthChoir.speed}</Badge>
                )}
            </div>
        </div>
        <div className="w-12 h-12" />
      </header>

      <main className="flex-1 py-8 px-4 flex flex-col justify-center items-center">
        <div className={cn(
          "w-full max-w-3xl bg-background/60 backdrop-blur-lg border rounded-2xl shadow-xl overflow-hidden transition-all duration-500",
          isCiclista && "bg-white dark:bg-slate-950 border-emerald-500/20 shadow-emerald-500/10 border-2"
        )}>
          {/* Header especial para Grupo Ciclista */}
          {isCiclista && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 flex flex-col items-center border-b border-emerald-500/10">
              <div className="relative w-20 h-20 mb-4 animate-float">
                <Image 
                  src="https://i.postimg.cc/QtWZZ88d/Imagen1.png" 
                  alt="Logo Grupo Ciclista" 
                  fill 
                  className="object-contain"
                  data-ai-hint="cyclist logo"
                />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.3em] mb-1">
                  Alabanza Agrupación
                </p>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  GRUPO CICLISTA EECH
                </h2>
              </div>
            </div>
          )}

          <div className={cn(
            "p-6 sm:p-10",
            isCiclista ? "font-body text-slate-900 dark:text-slate-100" : "font-body"
          )}>
            <div className={`leading-loose text-center transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}>
              {youthChoir.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
                const isChorus = paragraph.trim().toUpperCase().startsWith('CORO');
                return (
                  <p 
                    key={pIndex} 
                    className={cn(
                      "whitespace-pre-wrap mb-8",
                      isChorus && "font-bold text-emerald-700 dark:text-emerald-400 italic",
                      isCiclista && "tracking-tight"
                    )}
                  >
                    {paragraph}
                  </p>
                );
              })}
            </div>
            
            {isCiclista && (
              <div className="mt-10 pt-6 border-t border-emerald-500/10 text-center">
                <p className="text-[9px] font-bold text-emerald-600/40 uppercase tracking-widest">
                  "Pedaleando con Cristo en el corazón"
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 z-20 flex items-center justify-center gap-4 bg-transparent p-4">
           <div className="flex items-center justify-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full shadow-lg p-2">
            <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={!isFontLoaded || fontSizeIndex === 0} className="rounded-full h-10 w-10">
              <ZoomOut className="h-5 w-5" />
              <span className="sr-only">Reducir texto</span>
            </Button>
            <YouthChoirAdminActions youthChoir={youthChoir} onDelete={handleDelete} onUpdate={handleUpdate} />
            <Button variant="outline" size="icon" onClick={handleShare} className="rounded-full h-10 w-10 text-green-600 hover:text-green-700 hover:bg-green-50">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Compartir en WhatsApp</span>
            </Button>
            <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === fontSizes.length - 1} className="rounded-full h-10 w-10">
              <ZoomIn className="h-5 w-5" />
              <span className="sr-only">Aumentar texto</span>
            </Button>
         </div>
      </footer>
    </div>
  );
}
