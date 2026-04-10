"use client";

import { useState, useEffect } from 'react';
import { PraiseListClient } from '@/components/praise-list-client';
import { Music, ChevronLeft, Plus, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AddSinglePraiseDialog } from '@/components/add-single-praise-dialog';
import { AddPraisesDialog } from '@/components/add-praises-dialog';
import { usePraises } from '@/context/praises-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function PraisesIndexPage() {
  const { praises, addPraises, isLoaded, addPraise } = usePraises();
  const [isSinglePraiseDialogOpen, setSinglePraiseDialogOpen] = useState(false);
  const [isMultiPraiseDialogOpen, setMultiPraiseDialogOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  const handleSinglePraiseOpenChange = (open: boolean) => {
    setSinglePraiseDialogOpen(open);
    if (!open) {
      toast({ title: 'Actualizando la lista...' });
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleMultiPraiseOpenChange = (open: boolean) => {
    setMultiPraiseDialogOpen(open);
    if (!open) {
      toast({ title: 'Actualizando la lista...' });
      setTimeout(() => window.location.reload(), 500);
    }
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden transition-colors duration-700">
        {/* EFECTOS DE FONDO CINEMÁTICOS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-primary/5 rounded-full blur-[120px] animate-aura-slow" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
          <div className="absolute inset-0 design-grid opacity-10" />
        </div>
        
        {/* INSIGNIA ESQUINA SUPERIOR DERECHA */}
        <div className="absolute top-12 right-8 w-14 h-14 animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-1000 ease-out">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
          <Image 
            src={insigniaUrl} 
            alt="Insignia EECH" 
            width={56} 
            height={56} 
            className="relative rounded-full object-cover shadow-2xl border-2 border-white dark:border-white/10"
            priority
          />
        </div>

        {/* CONTENIDO CENTRAL */}
        <div className="relative flex flex-col items-center">
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
              <Music className="h-5 w-5 text-primary/40 animate-bounce" />
              <div className="h-px w-8 bg-primary/20" />
            </div>
            
            <div className="relative group">
              <h1 className="text-5xl font-black font-headline tracking-[0.1em] text-slate-900 dark:text-white animate-title-reveal uppercase text-glow">
                Alabanzas
              </h1>
              <div className="absolute -inset-x-8 -bottom-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent scale-x-0 animate-in slide-in-from-left duration-1000 delay-500 fill-mode-forwards" style={{ transform: 'scaleX(1)' }} />
            </div>

            <p className="text-[10px] font-black tracking-[0.6em] text-primary/60 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 pt-4">
              Cánticos Generales
            </p>
          </div>
        </div>

        {/* PIE DE PÁGINA SOLEMNE */}
        <div className="absolute bottom-16 left-0 w-full text-center px-6">
          <div className="flex items-center justify-center gap-4 mb-3 opacity-20 dark:opacity-40">
            <div className="h-px w-12 bg-slate-400" />
            <Sparkles className="h-3 w-3 text-slate-400" />
            <div className="h-px w-12 bg-slate-400" />
          </div>
          <p className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
            Ejército Evangélico de Chile
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="relative flex flex-col items-center bg-background min-h-screen animate-in fade-in duration-1000">
        <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[120px] animate-aura" />
          <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[100px] animate-aura" style={{ animationDirection: 'reverse' }} />
        </div>

        <div className="w-full max-w-2xl mx-auto flex flex-col h-screen">
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm pt-16 pb-6 px-4 border-b flex items-center justify-between relative">
              <Button variant="ghost" size="icon" asChild className="rounded-full">
                  <Link href="/">
                      <ChevronLeft className="h-6 w-6" />
                      <span className="sr-only">Volver</span>
                  </Link>
              </Button>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold font-headline text-foreground">
                  Alabanzas
                </h1>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold px-2">
                  {praises.length}
                </Badge>
                <Music className="h-6 w-6 text-primary" />
              </div>
              <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Plus className="mr-1 h-4 w-4" />
                        Agregar
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setSinglePraiseDialogOpen(true); }}>
                        Agregar una alabanza
                      </DropdownMenuItem>
                       <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setMultiPraiseDialogOpen(true); }}>
                        Agregar varias alabanzas
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
          </header>

          <div className="p-4 flex-1 overflow-auto">
            {!isLoaded ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="animate-pulse font-bold uppercase tracking-widest text-[10px]">Sincronizando Alabanzas...</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                <PraiseListClient praises={praises} />
              </div>
            )}
          </div>
        </div>
      </main>
      <AddSinglePraiseDialog
        open={isSinglePraiseDialogOpen}
        onOpenChange={handleSinglePraiseOpenChange}
        onPraiseAdded={addPraise}
      />
      <AddPraisesDialog
        open={isMultiPraiseDialogOpen}
        onOpenChange={handleMultiPraiseOpenChange}
        onPraisesAdded={addPraises}
      />
    </>
  );
}
