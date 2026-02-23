"use client";

import type { Praise } from '@/lib/praises';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { usePraises } from '@/context/praises-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { PraiseAdminActions } from './praise-admin-actions';
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

interface PraiseDetailClientProps {
  praiseId: string;
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
  'text-7xl',  // 72px,
  'text-8xl',
  'text-9xl',
];

function PraiseDetailSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-24">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 px-4 text-center">
                    <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <Skeleton className="h-6 w-24 rounded-full" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
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

export function PraiseDetailClient({ praiseId }: PraiseDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getPraiseById, deletePraise, updatePraise, isLoaded: isPraisesLoaded } = usePraises();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);
  const { toast } = useToast();

  const from = searchParams.get('from');
  const backHref = from === 'admin' ? '/admin?tab=more-settings' : '/praises';

  const praise = getPraiseById(praiseId);

  const handleDelete = useCallback(() => {
    if (!praise) return;
    deletePraise(praise.id);
    router.push('/praises');
  }, [deletePraise, praise, router]);

  const handleUpdate = useCallback(async (updatedData: Omit<Praise, 'id'>) => {
    if (!praise) return { success: false };
    const result = await updatePraise(praise.id, updatedData);
    if(result.success) {
      toast({ title: "Alabanza Actualizada", description: `La alabanza "${updatedData.title}" se ha guardado correctamente.` });
       const newId = slugify(updatedData.title);
       if (newId !== praise.id) {
          router.replace(`/praises/${newId}`);
       }
    } else {
      toast({ variant: 'destructive', title: 'Error al actualizar', description: result.error === 'duplicate' ? 'Ya existe una alabanza con ese título.' : 'No se pudo guardar el cambio.' });
    }
    return result;
  }, [praise, updatePraise, router, toast]);

  const handleToneUpdate = useCallback(async (newTone: string) => {
    if (!praise) return { success: false };
    const { id, ...restOfPraise } = praise;
    return await handleUpdate({ ...restOfPraise, tone: newTone });
  }, [praise, handleUpdate]);
  
  useEffect(() => {
    if (isPraisesLoaded && !praise) {
      // If data is loaded but the specific praise is not found.
      // router.push('/404'); // or a custom not-found page
      return;
    }
    
    if (praise && praiseId !== praise.id) {
        router.replace(`/praises/${praise.id}`);
    }
  }, [praise, praiseId, router, isPraisesLoaded]);

  if (!isPraisesLoaded || !praise) {
    return <PraiseDetailSkeleton />;
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
            <div className="text-center px-2 overflow-hidden flex-1">
                <h1 className="font-headline text-lg font-bold text-primary truncate">{praise.title}</h1>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <EditToneDialog song={praise} onToneUpdated={handleToneUpdate}>
                        <Button variant="outline" size="sm" className="h-auto px-3 py-1 text-xs rounded-full">
                            {praise.tone || 'Tonalidad'}
                        </Button>
                    </EditToneDialog>
                    {praise.speed && (
                        <Badge variant="secondary" className="text-xs capitalize rounded-full px-3 py-1">{praise.speed}</Badge>
                    )}
                </div>
            </div>
            <div className="w-12 h-12" />
        </header>

      <main className="flex-1 py-8 px-4 flex justify-center items-start">
        <div className="w-full max-w-3xl bg-background/60 backdrop-blur-lg border rounded-2xl p-6 sm:p-10 shadow-xl">
            <div className={`font-body leading-loose text-center transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}>
                {praise.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
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
              <span className="sr-only">Reducir texto</span>
            </Button>
            <PraiseAdminActions praise={praise} onUpdate={handleUpdate} onDelete={handleDelete} />
            <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === fontSizes.length - 1} className="rounded-full h-10 w-10">
              <ZoomIn className="h-5 w-5" />
              <span className="sr-only">Aumentar texto</span>
            </Button>
         </div>
      </footer>
    </div>
  );
}
