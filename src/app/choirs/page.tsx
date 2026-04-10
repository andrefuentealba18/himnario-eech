"use client";

import { useState, useEffect } from 'react';
import { ChoirListClient } from '@/components/choir-list-client';
import { Mic, ChevronLeft, Plus, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AddSingleChoirDialog } from '@/components/add-single-choir-dialog';
import { AddChoirsDialog } from '@/components/add-choirs-dialog';
import { useChoirs } from '@/context/choirs-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ChoirsIndexPage() {
  const { choirs, addChoir, addChoirs, isLoaded } = useChoirs();
  const [isSingleChoirDialogOpen, setSingleChoirDialogOpen] = useState(false);
  const [isMultiChoirDialogOpen, setMultiChoirDialogOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  const handleSingleOpenChange = (open: boolean) => {
    setSingleChoirDialogOpen(open);
    if (!open) {
      toast({ title: 'Actualizando la lista...' });
      setTimeout(() => window.location.reload(), 500);
    }
  };

  const handleMultiOpenChange = (open: boolean) => {
    setMultiChoirDialogOpen(open);
    if (!open) {
      toast({ title: 'Actualizando la lista...' });
      setTimeout(() => window.location.reload(), 500);
    }
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center overflow-hidden">
        {/* FONDO PATRIÓTICO TRANSLÚCIDO */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-red-50/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-blue-600/5 rounded-full blur-[140px] animate-aura-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-red-600/5 rounded-full blur-[160px] animate-aura-slow" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-0 design-grid opacity-[0.05]" />
        </div>
        
        {/* INSIGNIA SUPERIOR CON HALO DORADO */}
        <div className="absolute top-20 right-10 w-20 h-20 animate-in fade-in zoom-in-95 slide-in-from-top-10 duration-1000 ease-out">
          <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <Image 
            src={insigniaUrl} 
            alt="Insignia EECH" 
            width={80} 
            height={80} 
            className="relative rounded-full object-cover shadow-2xl border-2 border-white"
            priority
          />
        </div>

        {/* CONTENIDO CENTRAL */}
        <div className="relative flex flex-col items-center">
          <div className="space-y-8 text-center px-6">
            <div className="flex flex-col items-center gap-4 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Mic className="h-8 w-8 text-red-600 animate-pulse" />
              <div className="flex gap-1.5">
                <div className="h-1 w-6 bg-blue-600 rounded-full" />
                <div className="h-1 w-6 bg-amber-400 rounded-full" />
                <div className="h-1 w-6 bg-red-600 rounded-full" />
              </div>
            </div>
            
            <div className="relative">
              <h1 className="text-7xl font-black font-headline tracking-[0.3em] text-slate-900 animate-title-reveal uppercase">
                Coros
              </h1>
              <div className="absolute -inset-x-20 -bottom-6 h-px bg-gradient-to-r from-transparent via-blue-600/40 via-amber-400/60 via-red-600/40 to-transparent scale-x-0 animate-in slide-in-from-left duration-1000 delay-500 fill-mode-forwards" style={{ transform: 'scaleX(1)' }} />
            </div>
          </div>
        </div>

        {/* FOOTER OFICIAL */}
        <div className="absolute bottom-24 left-0 w-full text-center px-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] font-black tracking-[0.6em] text-slate-400 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800">
              Ejército Evangélico de Chile
            </p>
            <div className="flex items-center gap-4 opacity-30">
              <div className="h-px w-12 bg-blue-600" />
              <Sparkles className="h-3 w-3 text-amber-500" />
              <div className="h-px w-12 bg-red-600" />
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
                  Coros
                </h1>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold px-2">
                  {choirs.length}
                </Badge>
                <Mic className="h-6 w-6 text-primary" />
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
                      <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setSingleChoirDialogOpen(true); }}>
                        Agregar un coro
                      </DropdownMenuItem>
                       <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setMultiChoirDialogOpen(true); }}>
                        Agregar varios coros
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
          </header>

          <div className="p-4 flex-1 overflow-auto">
            {!isLoaded ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="animate-pulse font-bold uppercase tracking-widest text-[10px]">Sincronizando Coros...</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                <ChoirListClient choirs={choirs} />
              </div>
            )}
          </div>
        </div>
      </main>

      <AddSingleChoirDialog
        open={isSingleChoirDialogOpen}
        onOpenChange={handleSingleOpenChange}
        onChoirAdded={addChoir}
      />
      <AddChoirsDialog
        open={isMultiChoirDialogOpen}
        onOpenChange={handleMultiOpenChange}
        onChoirsAdded={addChoirs}
      />
    </>
  );
}