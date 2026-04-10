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
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden">
        {/* FONDO CINEMÁTICO GIGANTE */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-[160vw] h-[160vw] bg-indigo-600/10 rounded-full blur-[140px] animate-aura-giant" />
          <div className="absolute bottom-[10%] left-[10%] w-[140vw] h-[140vw] bg-blue-600/10 rounded-full blur-[160px] animate-aura-giant" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-0 design-grid opacity-[0.08]" />
        </div>
        
        {/* INSIGNIA SUPERIOR MAGNIFICADA */}
        <div className="absolute top-24 right-12 w-24 h-24 animate-in fade-in zoom-in-95 slide-in-from-top-10 duration-1000 ease-out">
          <div className="absolute inset-0 bg-amber-400/20 blur-[80px] rounded-full scale-150 animate-pulse" />
          <div className="relative p-1.5 bg-gradient-to-tr from-amber-400/60 to-transparent rounded-full shadow-2xl">
            <Image 
              src={insigniaUrl} 
              alt="Insignia EECH" 
              width={96} 
              height={96} 
              className="relative rounded-full object-cover border-2 border-white/80"
              priority
            />
          </div>
        </div>

        {/* CONTENIDO CENTRAL */}
        <div className="relative flex flex-col items-center">
          <div className="space-y-12 text-center px-6">
            <div className="relative">
              <h1 className="text-7xl font-black font-headline text-slate-900 animate-title-reveal-big uppercase tracking-[0.2em]">
                Alabanzas
              </h1>
              
              {/* PISTA DE CARGA TRICOLOR GIGANTE */}
              <div className="mt-12 relative w-72 h-2 mx-auto overflow-hidden rounded-full bg-slate-100 shadow-inner border border-slate-200/50">
                <div className="absolute inset-0 flex">
                  <div className="h-full w-32 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)] animate-loading-beam-long" style={{ animationDelay: '0s' }} />
                  <div className="h-full w-24 bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-loading-beam-long" style={{ animationDelay: '0.4s' }} />
                  <div className="h-full w-32 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-loading-beam-long" style={{ animationDelay: '0.8s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER INSTITUCIONAL */}
        <div className="absolute bottom-24 left-0 w-full text-center px-8">
          <div className="flex flex-col items-center gap-6">
            <p className="text-[11px] font-black tracking-[0.8em] text-slate-400 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
              Ejército Evangélico de Chile
            </p>
            <div className="flex items-center gap-8 opacity-40">
              <div className="h-px w-20 bg-blue-600" />
              <Sparkles className="h-4 w-4 text-amber-500 animate-spin-slow" />
              <div className="h-px w-20 bg-red-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="relative flex flex-col items-center bg-background min-h-screen animate-in fade-in duration-1000">
        <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-[100vw] h-[100vw] bg-primary/10 rounded-full blur-[140px] animate-aura-giant" />
          <div className="absolute bottom-0 left-0 w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[120px] animate-aura-giant" style={{ animationDirection: 'reverse' }} />
        </div>

        <div className="w-full max-w-2xl mx-auto flex flex-col h-screen">
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm pt-16 pb-6 px-4 border-b flex items-center justify-between relative">
              <Button variant="ghost" size="icon" asChild className="rounded-full h-12 w-12">
                  <Link href="/">
                      <ChevronLeft className="h-7 w-7" />
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
                      <Button variant="outline" size="sm" className="rounded-full h-10 px-4">
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