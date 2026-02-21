
"use client";

import type { Praise } from '@/lib/praises';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { usePraises } from '@/context/praises-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PraiseAdminActions } from './praise-admin-actions';
import { useCallback } from 'react';
import { EditToneDialog } from './edit-tone-dialog';
import { useFontSize } from '@/hooks/use-font-size';

interface PraiseDetailClientProps {
  praise: Praise;
}

const fontSizes = [
  'text-base',   // 16px
  'text-lg',   // 18px
  'text-xl',   // 20px
  'text-2xl',  // 24px
  'text-3xl',  // 30px
  'text-4xl',  // 36px
];

export function PraiseDetailClient({ praise }: PraiseDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { deletePraise, updatePraise } = usePraises();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded } = useFontSize(fontSizes.length, 1);

  const handleDelete = useCallback(() => {
    deletePraise(praise.id);
    toast({ title: "Alabanza Eliminada", description: `"${praise.title}" se ha eliminado.` });
    router.push('/praises');
  }, [deletePraise, praise.id, praise.title, router, toast]);

  const handleUpdate = useCallback((updatedData: Omit<Praise, 'id'>): { success: boolean, newId?: string } => {
    const result = updatePraise(praise.id, updatedData);
    if (result.success && result.newId) {
      toast({ title: "Alabanza Actualizada" });
      // If the ID (slug) changed, we need to redirect to the new URL
      if (result.newId !== praise.id) {
        router.replace(`/praises/${result.newId}`);
      }
      return { success: true };
    } else {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: 'Ya existe una alabanza con ese título.',
      });
      return { success: false };
    }
  }, [praise.id, updatePraise, router, toast]);

  const handleToneUpdate = useCallback((newTone: string) => {
    const { id, ...restOfPraise } = praise;
    return handleUpdate({ ...restOfPraise, tone: newTone });
  }, [praise, handleUpdate]);


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
        <div className="max-w-[20rem] text-center">
            <div
                className={`font-body leading-relaxed transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}
            >
                {praise.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
                  const isChorus = paragraph.toUpperCase().startsWith('CORO');
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
           <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={!isLoaded || fontSizeIndex === 0} className="rounded-full h-14 w-14">
             <ZoomOut className="h-7 w-7" />
             <span className="sr-only">Reducir texto</span>
           </Button>
           <PraiseAdminActions praise={praise} onDelete={handleDelete} onUpdate={handleUpdate} />
           <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isLoaded || fontSizeIndex === fontSizes.length - 1} className="rounded-full h-14 w-14">
             <ZoomIn className="h-7 w-7" />
             <span className="sr-only">Aumentar texto</span>
           </Button>
      </footer>
    </div>
  );
}
