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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    
    // Always show intro for 3 seconds
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-[180vw] h-[180vw] bg-blue-600/10 rounded-full blur-[160px] animate-aura-giant" />
          <div className="absolute bottom-[20%] right-[20%] w-[150vw] h-[150vw] bg-red-600/10 rounded-full blur-[180px] animate-aura-giant" style={{ animationDirection: 'reverse', animationDelay: '-5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white/20 backdrop-blur-sm" />
          <div className="absolute inset-0 design-grid opacity-[0.08]" />
        </div>
        
        <div className="relative mb-16 animate-in fade-in zoom-in-95 duration-1000 ease-out">
          <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full scale-150 animate-pulse" />
          <div className="relative p-1.5 bg-gradient-to-tr from-blue-600 via-white to-red-600 rounded-full shadow-2xl">
            <div className="bg-white rounded-full p-1">
              <Image 
                src={insigniaUrl} 
                alt="Insignia EECH" 
                width={120} 
                height={120} 
                className="relative rounded-full object-cover border-4 border-white shadow-inner"
                priority
              />
            </div>
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="space-y-12 text-center px-6">
            <div className="relative">
              <h1 className="text-4xl font-black font-headline text-slate-900 animate-title-reveal-big uppercase tracking-[0.4em]">
                Himnos
              </h1>
              
              <div className="mt-12 relative w-80 h-2 mx-auto overflow-hidden rounded-full bg-slate-100 shadow-inner border border-slate-200/50">
                <div className="absolute inset-0 flex">
                  <div className="h-full flex-1 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)] animate-loading-beam-long" style={{ animationDelay: '0s' }} />
                  <div className="h-full w-24 bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-loading-beam-long" style={{ animationDelay: '0.4s' }} />
                  <div className="h-full flex-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-loading-beam-long" style={{ animationDelay: '0.8s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-20 left-0 w-full text-center px-8">
          <div className="flex flex-col items-center gap-6">
            <p className="text-[11px] font-black tracking-[0.8em] text-slate-400 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
              Ejército Evangélico de Chile
            </p>
            <div className="flex items-center gap-8 opacity-40">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-blue-600" />
              <Sparkles className="h-4 w-4 text-amber-500 animate-spin-slow" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-red-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) return null;

  return (
    <main className="relative flex flex-col items-center bg-background min-h-screen overflow-x-hidden animate-in fade-in duration-1000">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[120vw] h-[120vw] bg-blue-600/5 rounded-full blur-[140px] animate-aura-giant" />
        <div className="absolute bottom-0 left-0 w-[100vw] h-[100vw] bg-red-600/5 rounded-full blur-[120px] animate-aura-giant" style={{ animationDirection: 'reverse' }} />
        <div className="absolute inset-0 design-grid opacity-20" />
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
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Oficial</span>
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

        <div className="p-4 flex-1 overflow-auto animate-in fade-in slide-in-from-bottom-2 duration-700">
          <HymnListClient hymns={hymns} />
        </div>
      </div>
    </main>
  );
}