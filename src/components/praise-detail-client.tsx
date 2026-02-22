"use client";

import type { Praise } from '@/lib/praises';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { usePraises } from '@/context/praises-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PraiseAdminActions } from './praise-admin-actions';
import { useCallback, useEffect } from 'react';
import { EditToneDialog } from './edit-tone-dialog';
import { useFontSize } from '@/hooks/use-font-size';
import { Skeleton } from '@/components/ui/skeleton';

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
  'text-7xl',  // 72px
];

function PraiseDetailSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-16">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 px-4 text-center">
                    <Skeleton className="h-5 w-3/4 mx-auto mb-1" />
                    <Skeleton className="h-5 w-1/4 mx-auto" />
                </div>
                <div className="w-10" />
            </header>
            <main className="flex-1 py-8 container max-w-prose px-4">
                <div className="space-y-4 text-center">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6 mx-auto" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-4/6 mx-auto" />
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

export function PraiseDetailClient({ praiseId }: PraiseDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { getPraiseById, deletePraise, updatePraise, isLoaded: isPraisesLoaded } = usePraises();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);

  const praise = getPraiseById(praiseId);

  const handleDelete = useCallback(async () => {
    if (!praise) return;
    try {
        await deletePraise(praise.id);
        toast({ title: "Alabanza Eliminada", description: `"${praise.title}" se ha eliminado.` });
        router.push('/praises');
    } catch(error) {
        toast({
            variant: 'destructive',
            title: 'Error al eliminar',
            description: 'No se pudo eliminar la alabanza. Es posible que no tengas permisos.',
        });
    }
  }, [deletePraise, praise, router, toast]);

  const handleUpdate = useCallback(async (updatedData: Omit<Praise, 'id'>): Promise<{ success: boolean, newId?: string }> => {
    if (!praise) return { success: false };
    const result = await updatePraise(praise.id, updatedData);
    if (result.success) {
      toast({ title: "Alabanza Actualizada" });
       if (result.newId && result.newId !== praise.id) {
          router.replace(`/praises/${result.newId}`);
       }
    } else {
        const description = result.error === 'duplicate'
        ? 'Ya existe una alabanza con ese título.'
        : 'No se pudo guardar el cambio. Es posible que no tengas permisos.';
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: description,
      });
    }
    return { success: result.success, newId: result.newId };
  }, [praise, updatePraise, toast, router]);

  const handleToneUpdate = useCallback(async (newTone: string) => {
    if (!praise) return { success: false };
    const { id, ...restOfPraise } = praise;
    return handleUpdate({ ...restOfPraise, tone: newTone });
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
    <div className="relative flex flex-col min-h-screen bg-background">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10"
      />
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-16">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/praises">
            <ChevronLeft className="h-7 w-7" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="text-center px-4 overflow-hidden flex-1">
            <h1 className="font-bold font-headline text-lg truncate mb-1">{praise.title}</h1>
            <EditToneDialog song={praise} onToneUpdated={handleToneUpdate}>
              <Button variant="outline" size="sm" className="h-auto px-2 py-0.5 text-xs">
                {praise.tone || 'Tonalidad: Indefinida'}
              </Button>
            </EditToneDialog>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 py-8 flex justify-center px-4">
        <div className="w-full max-w-2xl text-center">
            <div
                className={`font-body leading-relaxed transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}
            >
                {praise.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
                  const isChorus = paragraph.toUpperCase().startsWith('CORO');
                  return (
                    <p key={pIndex} className={`whitespace-pre-wrap mb-6 ${isChorus ? 'font-bold leading-snug' : ''}`}>
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
           <PraiseAdminActions praise={praise} onDelete={handleDelete} onUpdate={handleUpdate} />
           <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === fontSizes.length - 1} className="rounded-full h-14 w-14">
             <ZoomIn className="h-7 w-7" />
             <span className="sr-only">Aumentar texto</span>
           </Button>
      </footer>
    </div>
  );
}
