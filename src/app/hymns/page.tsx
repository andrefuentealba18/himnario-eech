"use client";

import { useState, useEffect } from 'react';
import { useHymns } from '@/context/hymns-context';
import { HymnListClient } from '@/components/hymn-list-client';
import { BookOpen, ChevronLeft, Loader2, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HymnsIndexPage() {
  const { hymns, isLoaded } = useHymns();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // La animación dura 2.2 segundos para un efecto más solemne y fluido
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  if (showIntro) {
    return (
      <main className="fixed inset-0 z-[100] flex items-center justify-center bg-white overflow-hidden">
        {/* Fondo Etéreo de Claridad */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-primary/10 rounded-full blur-[140px] animate-aura-slow opacity-60" />
          <div className="absolute inset-0 design-grid opacity-[0.03]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Elemento Decorativo Superior */}
          <div className="flex flex-col items-center animate-in fade-in zoom-in-90 duration-1000">
            <div className="p-4 bg-primary/5 rounded-full mb-6 border border-primary/10 shadow-sm">
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            
            <div className="relative">
              {/* Título con Animación de Revelado y Expansión */}
              <h1 className="text-5xl md:text-8xl font-bold font-headline text-slate-900 tracking-[0.4em] uppercase text-glow animate-title-reveal text-center">
                Himnos
              </h1>
              
              {/* Líneas de Acompañamiento Cinemático */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-in slide-in-from-left-full duration-1000 fill-mode-forwards" style={{ width: '80%', animationDelay: '0.5s' }} />
            </div>

            <div className="mt-10 flex flex-col items-center gap-2 opacity-0 animate-in fade-in duration-1000 fill-mode-forwards" style={{ animationDelay: '1s' }}>
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400">
                Cantoral Sagrado
              </p>
              <div className="h-1 w-1 rounded-full bg-primary/40 animate-bounce" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex flex-col items-center bg-background min-h-screen overflow-x-hidden">
      {/* Fondo Decorativo de Transición Suave */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[120px] animate-aura" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[100px] animate-aura" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col h-screen animate-in fade-in slide-in-from-bottom-2 duration-1000">
        <header className="sticky top-0 z-20 bg-background/60 backdrop-blur-xl p-4 border-b flex flex-col items-center gap-4 transition-all duration-500">
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
                <h1 className="text-3xl font-bold font-headline text-foreground tracking-tighter text-glow">
                  Himnos
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {isLoaded && (
                  <Badge variant="secondary" className="animate-in zoom-in-50 duration-500 bg-primary/10 text-primary border-primary/20 font-bold px-3 h-7">
                    {hymns.length}
                  </Badge>
                )}
                <div className="p-2 bg-primary/5 rounded-full border border-primary/10 shadow-sm">
                  <BookOpen className="h-6 w-6 text-primary animate-float" style={{ animationDuration: '4s' }} />
                </div>
              </div>
            </div>
        </header>

        <div className="p-4 flex-1 overflow-auto animate-slide-fade-up" style={{ animationDelay: '0.2s' }}>
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
            <div className="animate-in fade-in duration-700">
              <HymnListClient hymns={hymns} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
