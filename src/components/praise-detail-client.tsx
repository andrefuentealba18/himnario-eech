"use client";

import type { Praise } from '@/lib/praises';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut, Share2, Star, Music, FileText } from 'lucide-react';
import { usePraises } from '@/context/praises-context';
import { useFavorites } from '@/hooks/use-favorites';
import { useRecents } from '@/hooks/use-recents';
import { useRouter, useSearchParams } from 'next/navigation';
import { PraiseAdminActions } from './praise-admin-actions';
import { useCallback, useEffect } from 'react';
import { EditToneDialog } from './edit-tone-dialog';
import { useFontSize } from '@/hooks/use-font-size';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn, formatForOpenLP } from '@/lib/utils';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

interface PraiseDetailClientProps {
  praiseId: string;
}

const fontSizes = [
  'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl',
];

function PraiseDetailSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-transparent">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm pt-32 pb-6 px-4 border-b">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 px-4 text-center">
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                </div>
                <div className="w-10 h-10" />
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

export function PraiseDetailClient({ praiseId }: PraiseDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getPraiseById, deletePraise, updatePraise, isLoaded: isPraisesLoaded } = usePraises();
  const { isFavorite, toggleFavorite, isLoaded: isFavoritesLoaded } = useFavorites();
  const { addRecent } = useRecents();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);
  const { toast } = useToast();

  const from = searchParams.get('from');
  const backHref = from === 'admin' ? '/admin?tab=more-settings' : (from?.startsWith('/') ? from : '/praises');

  const praise = getPraiseById(praiseId);

  useEffect(() => {
    if (praise) {
      addRecent({
        id: praise.id,
        title: praise.title,
        type: 'praise'
      });
    }
  }, [praise, addRecent]);

  const handleDelete = useCallback(async () => {
    if (!praise) return;
    deletePraise(praise.id);
    router.push('/praises');
  }, [deletePraise, praise, router]);

  const handleUpdate = useCallback(async (updatedData: Omit<Praise, 'id'>) => {
    if (!praise) return { success: false };
    const result = await updatePraise(praise.id, updatedData);
    if(result.success) {
      toast({ title: "Alabanza Actualizada", description: `La alabanza "${updatedData.title}" se ha guardado correctamente.` });
    } else {
      toast({ variant: 'destructive', title: 'Error al actualizar', description: 'No se pudo guardar el cambio.' });
    }
    return result;
  }, [praise, updatePraise, router, toast]);

  const handleToneUpdate = useCallback(async (newTone: string) => {
    if (!praise) return { success: false };
    const { id, ...restOfPraise } = praise;
    return await handleUpdate({ ...restOfPraise, tone: newTone });
  }, [praise, handleUpdate]);

  const handleShare = useCallback(() => {
    if (!praise) return;
    const text = `*Alabanza: ${praise.title}*\n\n${praise.lyrics}\n\n_Enviado desde Himnario EECH Móvil_`;
    const shareUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }, [praise]);
  
  const handleOpenLPCopy = useCallback(() => {
    if (!praise) return;
    const formatted = formatForOpenLP(praise.lyrics);
    navigator.clipboard.writeText(formatted);
    toast({ title: "Formato OpenLP Copiado", description: "La alabanza ha sido copiada al portapapeles." });
  }, [praise, toast]);
  
  if (!isPraisesLoaded || !praise) {
    return <PraiseDetailSkeleton />;
  }

  const isFav = isFavoritesLoaded && isFavorite(praise.id, 'praise');

  return (
    <div className="flex flex-col min-h-screen bg-transparent relative overflow-hidden">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[120vw] h-[120vw] bg-blue-600/10 rounded-full blur-[140px] animate-aura-giant" />
          <div className="absolute bottom-0 left-0 w-[100vw] h-[100vw] bg-red-600/10 rounded-full blur-[120px] animate-aura-giant" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-0 design-grid opacity-[0.04]" />
        </div>

        <header className="sticky top-0 z-20 flex items-center justify-between bg-background/60 backdrop-blur-xl pt-8 pb-3 px-4 border-b">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full hover:bg-primary/10">
              <Link href={backHref}>
                <ChevronLeft className="h-5 w-5 text-slate-600" />
                <span className="sr-only">Volver</span>
            </Link>
            </Button>
            
            <div className="flex-1 flex flex-col items-center justify-center overflow-hidden px-2">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Music className="h-3 w-3 text-indigo-500" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600/60">ALABANZA GENERAL</span>
                </div>
                <h1 className="font-headline text-lg font-bold text-foreground truncate text-center w-full tracking-tight">
                  {praise.title}
                </h1>
                <div className="flex items-center justify-center gap-2 mt-1.5">
                    <EditToneDialog song={praise} onToneUpdated={handleToneUpdate}>
                        <button className="text-[10px] font-bold text-primary px-3 py-0.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md">
                            {praise.tone || 'Tonalidad'}
                        </button>
                    </EditToneDialog>
                    {praise.speed && (
                        <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-tighter rounded-full px-3 py-0.5 bg-slate-100 dark:bg-white/5 border border-slate-200/50">
                          {praise.speed}
                        </Badge>
                    )}
                </div>
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => toggleFavorite(praise.id, 'praise')} disabled={!isFavoritesLoaded} className="h-12 w-12 rounded-full">
              <Star className={`h-7 w-7 transition-all duration-500 transform-gpu ${isFav ? 'fill-yellow-400 text-yellow-400 scale-125 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]' : 'text-foreground/30'}`} />
              <span className="sr-only">Marcar como favorito</span>
            </Button>
        </header>

      <main className="flex-1 py-10 px-4 flex flex-col items-center justify-start overflow-y-auto">
        <div className="w-full max-w-3xl glass-morphism rounded-[2.5rem] p-8 sm:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 mt-4 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 flex">
              <div className="h-full flex-1 bg-blue-600/40" />
              <div className="h-full flex-1 bg-white/40" />
              <div className="h-full flex-1 bg-red-600/40" />
            </div>
            
            <div className={`font-body leading-[1.8] text-center transition-all duration-300 ease-in-out ${fontSizes[fontSizeIndex]}`}>
                {praise.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
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
              <PraiseAdminActions praise={praise} onUpdate={handleUpdate} onDelete={handleDelete} />
              <Button variant="outline" size="icon" onClick={handleOpenLPCopy} className="rounded-full h-12 w-12 text-blue-600 hover:text-blue-700 bg-white/50 dark:bg-white/5 border-none shadow-inner active:scale-90 transition-all" title="Copiar para OpenLP">
                <FileText className="h-5 w-5" />
              </Button>
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