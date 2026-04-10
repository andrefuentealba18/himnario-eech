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
    const timer = setTimeout(() => setShowIntro(false), 2800);
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
      <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        {/* FONDO VIBRANTE VIOLETA/INDIGO */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-950 to-violet-900 animate-gradient-move opacity-90" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] bg-violet-500/10 rounded-full blur-[130px] animate-aura-slow" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-violet-500/10 to-transparent" />
          <div className="absolute inset-0 design-grid opacity-[0.08]" />
        </div>
        
        {/* INSIGNIA SUPERIOR */}
        <div className="absolute top-16 right-10 w-16 h-16 animate-in fade-in zoom-in-95 slide-in-from-top-6 duration-1000 ease-out">
          <div className="absolute inset-0 bg-violet-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <Image 
            src={insigniaUrl} 
            alt="Insignia EECH" 
            width={64} 
            height={64} 
            className="relative rounded-full object-cover shadow-[0_0_40px_rgba(139,92,246,0.3)] border-2 border-white/15"
            priority
          />
        </div>

        {/* CONTENIDO CENTRAL DINÁMICO */}
        <div className="relative flex flex-col items-center">
          <div className="space-y-8 text-center px-6">
            <div className="flex flex-col items-center gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Music className="h-6 w-6 text-violet-400 animate-bounce" />
              <div className="h-px w-10 bg-violet-400/30" />
            </div>
            
            <div className="relative">
              <h1 className="text-6xl font-black font-headline tracking-[0.15em] text-white animate-title-reveal uppercase text-glow drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                Alabanzas
              </h1>
              <div className="absolute -inset-x-12 -bottom-6 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent scale-x-0 animate-in slide-in-from-left duration-1000 delay-500 fill-mode-forwards" style={{ transform: 'scaleX(1)' }} />
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800">
              <p className="text-[11px] font-black tracking-[0.7em] text-violet-300/60 uppercase pt-6">
                Cánticos Generales
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER SOLEMNE */}
        <div className="absolute bottom-20 left-0 w-full text-center px-8">
          <div className="flex items-center justify-center gap-6 mb-4 opacity-25">
            <div className="h-px w-14 bg-slate-400" />
            <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
            <div className="h-px w-14 bg-slate-400" />
          </div>
          <p className="text-[10px] font-black tracking-[0.5em] text-slate-500 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
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