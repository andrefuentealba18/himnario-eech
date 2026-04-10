"use client";

import { useHymns } from '@/context/hymns-context';
import { HymnListClient } from '@/components/hymn-list-client';
import { BookOpen, ChevronLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HymnsIndexPage() {
  const { hymns, isLoaded } = useHymns();

  return (
    <main className="relative flex flex-col items-center bg-background min-h-screen overflow-x-hidden">
      {/* Fondo Decorativo de Transición */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-30">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[120px] animate-aura" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[100px] animate-aura" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col h-screen animate-in fade-in duration-1000">
        <header className="sticky top-0 z-20 bg-background/60 backdrop-blur-xl p-4 border-b flex flex-col items-center gap-4 transition-all duration-500">
            <div className="flex items-center justify-between w-full">
              <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-primary/10 transition-colors">
                  <Link href="/">
                      <ChevronLeft className="h-6 w-6" />
                      <span className="sr-only">Volver</span>
                  </Link>
              </Button>
              
              <div className="flex flex-col items-center animate-title-reveal">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Himnario Oficial</span>
                  <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold font-headline text-foreground tracking-tighter text-glow">
                  Himnos
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {isLoaded && (
                  <Badge variant="secondary" className="animate-in zoom-in-50 duration-500 bg-primary/10 text-primary border-primary/20 font-bold px-3">
                    {hymns.length}
                  </Badge>
                )}
                <div className="p-2 bg-primary/5 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary animate-float" style={{ animationDuration: '3s' }} />
                </div>
              </div>
            </div>
        </header>

        <div className="p-4 flex-1 overflow-auto animate-slide-fade-up" style={{ animationDelay: '0.2s' }}>
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
              </div>
              <div className="text-center space-y-2">
                <p className="animate-pulse font-black uppercase tracking-[0.2em] text-xs">Sincronizando Cantoral...</p>
                <p className="text-[10px] opacity-60">Preparando alabanzas para uso offline</p>
              </div>
            </div>
          ) : (
            <HymnListClient hymns={hymns} />
          )}
        </div>
      </div>
    </main>
  );
}