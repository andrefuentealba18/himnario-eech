"use client";

import { useHymns } from '@/context/hymns-context';
import { HymnListClient } from '@/components/hymn-list-client';
import { BookOpen, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HymnsIndexPage() {
  const { hymns, isLoaded } = useHymns();

  return (
    <main className="relative flex flex-col items-center bg-background min-h-screen overflow-x-hidden">
      {/* Fondo Decorativo de Transición Suave */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[120px] animate-aura" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[100px] animate-aura" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col h-screen">
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
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold px-3 h-7">
                    {hymns.length}
                  </Badge>
                )}
                <div className="p-2 bg-primary/5 rounded-full border border-primary/10 shadow-sm">
                  <BookOpen className="h-6 w-6 text-primary animate-float" style={{ animationDuration: '4s' }} />
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
            <div className="animate-in fade-in duration-700">
              <HymnListClient hymns={hymns} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
