"use client";

import type { Choir } from '@/lib/choirs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { useChoirs } from '@/context/choirs-context';
import { useRouter, notFound } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ChoirAdminActions } from './choir-admin-actions';
import { useCallback, useEffect } from 'react';
import { EditToneDialog } from './edit-tone-dialog';
import { useFontSize } from '@/hooks/use-font-size';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface ChoirDetailClientProps {
  choirId: string;
}

const fontSizes = [
  'text-base',   // 16px
  'text-lg',   // 18px
  'text-xl',   // 20px
  'text-2xl',  // 24px
  'text-3xl',  // 30px
  'text-4xl',  // 36px
];

export function ChoirDetailClient({ choirId }: ChoirDetailClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { getChoirById, deleteChoir, updateChoir, isLoaded: isChoirsLoaded } = useChoirs();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);

  const choir = getChoirById(choirId);

  useEffect(() => {
    if (isChoirsLoaded && !choir) {
      notFound();
    }
  }, [isChoirsLoaded, choir]);

  useEffect(() => {
    if (choir && choirId !== choir.id) {
        router.replace(`/choirs/${choir.id}`);
    }
  }, [choir, choirId, router]);


  if (!isChoirsLoaded || !choir) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-16">
                <Skeleton className="h-10 w-10 rounded-full" />
                 <div className="flex-1 px-4">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                 </div>
                <div className="w-10" />
            </header>
            <main className="flex-1 py-8 container max-w-sm">
                <div className="space-y-4 text-center">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-5/6 mx-auto" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-4/6 mx-auto" />
                </div>
            </main>
        </div>
    );
  }

  const handleDelete = useCallback(async () => {
    await deleteChoir(choir.id);
    toast({ title: "Coro Eliminado", description: `"${choir.title}" se ha eliminado.` });
    router.push('/choirs');
  }, [deleteChoir, choir.id, choir.title, router, toast]);

  const handleUpdate = useCallback(async (updatedData: Omit<Choir, 'id'>): Promise<{ success: boolean }> => {
    const result = await updateChoir(choir.id, updatedData);
    if (result.success) {
      toast({ title: "Coro Actualizado" });
       if (result.newId && result.newId !== choir.id) {
          router.replace(`/choirs/${result.newId}`);
       }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: 'Ya existe un coro con ese título.',
      });
    }
    return { success: result.success };
  }, [choir.id, updateChoir, toast, router]);

  const handleToneUpdate = useCallback(async (newTone: string) => {
    const { id, ...restOfChoir } = choir;
    return handleUpdate({ ...restOfChoir, tone: newTone });
  }, [choir, handleUpdate]);


  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10"
      />
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-16">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/choirs">
            <ChevronLeft className="h-7 w-7" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="text-center px-4 overflow-hidden flex-1">
            <h1 className="font-bold font-headline text-lg truncate mb-1">{choir.title}</h1>
            <div className="flex items-center justify-center gap-2">
                <EditToneDialog song={choir} onToneUpdated={handleToneUpdate}>
                  <Button variant="outline" size="sm" className="h-auto px-2 py-0.5 text-xs">
                    {choir.tone || 'Tonalidad: Indefinida'}
                  </Button>
                </EditToneDialog>
                 {choir.speed && (
                    <Badge variant="secondary" className="text-xs capitalize">{choir.speed}</Badge>
                )}
            </div>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 py-8 flex justify-center px-4">
        <div className="max-w-[20rem] text-center">
            <div
                className={`font-body leading-relaxed transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}
            >
                {choir.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
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
           <Button variant="outline" size="icon" onClick={decreaseFontSize} disabled={!isFontLoaded || fontSizeIndex === 0} className="rounded-full h-14 w-14">
             <ZoomOut className="h-7 w-7" />
             <span className="sr-only">Reducir texto</span>
           </Button>
           <ChoirAdminActions choir={choir} onDelete={handleDelete} onUpdate={handleUpdate} />
           <Button variant="outline" size="icon" onClick={increaseFontSize} disabled={!isFontLoaded || fontSizeIndex === fontSizes.length - 1} className="rounded-full h-14 w-14">
             <ZoomIn className="h-7 w-7" />
             <span className="sr-only">Aumentar texto</span>
           </Button>
      </footer>
    </div>
  );
}

    