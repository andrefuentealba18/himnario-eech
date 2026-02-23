"use client";

import type { Choir } from '@/lib/choirs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { useChoirs } from '@/context/choirs-context';
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

function ChoirDetailSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-20">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 px-4 text-center">
                    <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                    <div className="flex items-center justify-center gap-2">
                      <Skeleton className="h-5 w-1/4 mx-auto" />
                      <Skeleton className="h-5 w-1/4 mx-auto" />
                    </div>
                </div>
                <div className="w-10" />
            </header>
            <main className="flex-1 py-8 container max-w-2xl px-4">
                <div className="space-y-6 text-center">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-5/6 mx-auto" />
                    <Skeleton className="h-6 w-4/6 mx-auto mb-8" />
                    <Skeleton className="h-24 w-full rounded-lg" />
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

export function ChoirDetailClient({ choirId }: ChoirDetailClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getChoirById, deleteChoir, updateChoir, isLoaded: isChoirsLoaded } = useChoirs();
  const { fontSizeIndex, increaseFontSize, decreaseFontSize, isLoaded: isFontLoaded } = useFontSize(fontSizes.length, 1);
  const { toast } = useToast();

  const from = searchParams.get('from');
  const backHref = from === 'admin' ? '/admin?tab=more-settings' : '/choirs';

  const choir = getChoirById(choirId);

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
        toast({ variant: 'destructive', title: 'Error al actualizar', description: result.error === 'duplicate' ? 'Ya existe un coro con ese título.' : 'No se pudo guardar el cambio.' });
    }
    return result;
  }, [choir, updateChoir, router, toast]);

  const handleToneUpdate = useCallback(async (newTone: string) => {
    if (!choir) return { success: false };
    const { id, ...restOfChoir } = choir;
    return await handleUpdate({ ...restOfChoir, tone: newTone });
  }, [choir, handleUpdate]);

  useEffect(() => {
    if (isChoirsLoaded && !choir) {
      // If data is loaded but the specific choir is not found.
      // router.push('/404');
      return;
    }
    
    if (choir && choirId !== choir.id) {
        router.replace(`/choirs/${choir.id}`);
    }
  }, [choir, choirId, router, isChoirsLoaded]);

  if (!isChoirsLoaded || !choir) {
    return <ChoirDetailSkeleton />;
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-background">
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-fade-in" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-secondary/40 rounded-full filter blur-3xl opacity-30 animate-fade-in" />
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-10"
      />
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-20">
        <Button variant="ghost" size="icon" asChild>
          <Link href={backHref}>
            <ChevronLeft className="h-7 w-7" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="text-center px-4 overflow-hidden flex-1">
            <h1 className="font-headline text-2xl font-bold text-primary truncate">{choir.title}</h1>
            <div className="flex items-center justify-center gap-2 mt-1">
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
        <div className="w-full max-w-2xl">
            <div
                className={`font-body leading-relaxed text-center transition-all duration-200 ease-in-out ${fontSizes[fontSizeIndex]}`}
            >
                {choir.lyrics.split(/\n\s*\n/).map((paragraph, pIndex) => {
                  const isChorus = paragraph.toUpperCase().startsWith('CORO');
                  if (isChorus) {
                    return (
                        <div key={pIndex} className="mb-6 bg-primary/10 p-4 rounded-lg border border-primary/20">
                            <p className="whitespace-pre-wrap font-bold leading-snug">
                                {paragraph}
                            </p>
                        </div>
                    )
                  }
                  return (
                    <p key={pIndex} className="whitespace-pre-wrap mb-6">
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
