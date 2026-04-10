"use client";

import { useState, useEffect } from 'react';
import { useHymns } from '@/context/hymns-context';
import { HymnListClient } from '@/components/hymn-list-client';
import { BookOpen, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HymnsIndexPage() {
  const { hymns, isLoaded } = useHymns();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden transition-colors duration-700">
        {/* EFECTOS DE FONDO CINEMÁTICOS */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-primary/5 rounded-full blur-[120px] animate-aura-slow" />
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-40" />
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
              <Sparkles className="h-5 w-5 text-primary/40" />
              <div className="h-px w-8 bg-primary/20" />
            </div>
            
            <div className="relative group">
              <h1 className="text-6xl font-black font-headline tracking-[0.2em] text-slate-900 dark:text-white animate-title-reveal uppercase text-glow">
                Himnos
              </h1>
              <div className="absolute -inset-x-10 -bottom-4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent scale-x-0 animate-in slide-in-from-left duration-1000 delay-500 fill-mode-forwards" style={{ transform: 'scaleX(1)' }} />
            </div>

            <p className="text-[10px] font-black tracking-[0.6em] text-primary/60 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 pt-4">
              Cantoral Oficial
            </p>
          </div>
        </div>

        {/* PIE DE PÁGINA SOLEMNE */}
        <div className="absolute bottom-16 left-0 w-full text-center px-6">
          <div className="flex items-center justify-center gap-4 mb-3 opacity-20 dark:opacity-40">
            <div className="h-px w-12 bg-slate-400" />
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
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
    <main className="relative flex flex-col items-center bg-background min-h-screen overflow-x-hidden animate-in fade-in duration-1000">
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[120px] animate-aura" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[100px] animate-aura" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col h-screen">
        <header className="sticky top-0 z-20 bg-background/60 backdrop-blur-xl pt-16 pb-6 px-4 border-b flex flex-col items-center gap-4 transition-all duration-500">
            <div className="flex items-center justify-between w-full">
              <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 transition-colors h-12 w-12">
                  <Link href="/">
                      <ChevronLeft className="h-7 w-7 text-slate-600" />
                      <span className="sr-only">Volver</span>
                  </Link>
              </Button>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-px w-4 bg-primary/30" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Himnario Oficial</span>
                  <div className="h-px w-4 bg-primary/30" />
                </div>
                <h1 className="text-2xl font-bold font-headline text-foreground tracking-tighter text-glow">
                  Himnos
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {isLoaded && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold px-3 h-7">
                    {hymns.length}
                  </Badge>
                )}
                <div className="p-2 bg-primary/5 rounded-full border border-primary/10 shadow-sm">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
        </header>

        <div className="p-4 flex-1 overflow-auto">
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse scale-150" />
                <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
              </div>
              <div className="text-center space-y-3">
                <p className="animate-pulse font-black uppercase tracking-[0.3em] text-xs text-primary">Sincronizando Cantoral</p>
                <p className="text-[10px] opacity-60 font-medium italic">Preparando alabanzas para uso offline...</p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <HymnListClient hymns={hymns} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
