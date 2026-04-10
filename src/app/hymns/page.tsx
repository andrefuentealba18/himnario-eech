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
    const timer = setTimeout(() => setShowIntro(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden">
        {/* FONDO CLARO Y VIBRANTE */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-100 animate-gradient-move opacity-100" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-blue-400/5 rounded-full blur-[140px] animate-aura-slow" />
          <div className="absolute inset-0 design-grid opacity-[0.1]" />
        </div>
        
        {/* INSIGNIA SUPERIOR */}
        <div className="absolute top-16 right-10 w-16 h-16 animate-in fade-in zoom-in-95 slide-in-from-top-6 duration-1000 ease-out">
          <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full scale-150 animate-pulse" />
          <Image 
            src={insigniaUrl} 
            alt="Insignia EECH" 
            width={64} 
            height={64} 
            className="relative rounded-full object-cover shadow-xl border-2 border-slate-200"
            priority
          />
        </div>

        {/* CONTENIDO CENTRAL MINIMALISTA */}
        <div className="relative flex flex-col items-center">
          <div className="space-y-6 text-center px-6">
            <div className="flex flex-col items-center gap-3 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Sparkles className="h-6 w-6 text-blue-500 animate-pulse" />
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
            </div>
            
            <div className="relative">
              <h1 className="text-7xl font-black font-headline tracking-[0.2em] text-slate-900 animate-title-reveal uppercase drop-shadow-sm">
                Himnos
              </h1>
              <div className="absolute -inset-x-16 -bottom-4 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent scale-x-0 animate-in slide-in-from-left duration-1000 delay-500 fill-mode-forwards" style={{ transform: 'scaleX(1)' }} />
            </div>
          </div>
        </div>

        {/* FOOTER ELEGANTE */}
        <div className="absolute bottom-20 left-0 w-full text-center px-8">
          <div className="flex items-center justify-center gap-6 mb-4 opacity-40">
            <div className="h-px w-16 bg-blue-300" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <div className="h-px w-16 bg-blue-300" />
          </div>
          <p className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800">
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
                <h1 className="text-2xl font-bold font-headline text-foreground tracking-tighter">
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