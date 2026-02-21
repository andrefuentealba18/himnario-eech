
"use client";

import type { Praise } from '@/lib/praises';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { usePraises } from '@/context/praises-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { PraiseAdminActions } from './praise-admin-actions';
import { useCallback } from 'react';
import { EditToneDialog } from './edit-tone-dialog';

interface PraiseDetailClientProps {
  praise: Praise;
}

export function PraiseDetailClient({ praise }: PraiseDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { deletePraise, updatePraise } = usePraises();

  const handleDelete = useCallback(() => {
    deletePraise(praise.id);
    toast({ title: "Alabanza Eliminada", description: `"${praise.title}" se ha eliminado.` });
    router.push('/praises');
  }, [deletePraise, praise.id, praise.title, router, toast]);

  const handleUpdate = useCallback((updatedData: Omit<Praise, 'id'>): { success: boolean } => {
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
                className={`font-body leading-relaxed text-lg`}
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

      <footer className="container mx-auto text-center pb-8">
        <PraiseAdminActions praise={praise} onDelete={handleDelete} onUpdate={handleUpdate} />
      </footer>
    </div>
  );
}
