
"use client";

import { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSpecialOccasions } from '@/context/special-occasions-context';
import { SpecialOccasionListClient } from '@/components/special-occasion-list-client';

export default function SpecialOccasionsPage() {
  const { specialOccasions, isLoaded } = useSpecialOccasions();
  const [showIntro, setShowIntro] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-red-50/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-blue-600/5 rounded-full blur-[140px] animate-aura-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-red-600/5 rounded-full blur-[160px] animate-aura-slow" style={{ animationDirection: 'reverse' }} />
          <div className="absolute inset-0 design-grid opacity-[0.05]" />
        </div>
        
        <div className="absolute top-20 right-10 w-20 h-20 animate-in fade-in zoom-in-95 slide-in-from-top-10 duration-1000 ease-out">
          <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative p-1 bg-gradient-to-tr from-amber-400/40 to-transparent rounded-full shadow-2xl">
            <Image src={insigniaUrl} alt="Insignia EECH" width={80} height={80} className="relative rounded-full object-cover border-2 border-white/80" priority />
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="space-y-12 text-center px-6">
            <div className="relative">
              <h1 className="text-5xl font-black font-headline text-slate-900 animate-title-reveal uppercase leading-tight">
                Ocasiones<br/><span className="text-amber-600">Especiales</span>
              </h1>
              
              <div className="mt-10 relative w-64 h-1.5 mx-auto overflow-hidden rounded-full bg-slate-100 shadow-inner border border-slate-200/50">
                <div className="absolute inset-0 flex">
                  <div className="h-full w-24 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)] rounded-full animate-loading-beam" style={{ animationDelay: '0s' }} />
                  <div className="h-full w-20 bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)] rounded-full animate-loading-beam" style={{ animationDelay: '0.3s' }} />
                  <div className="h-full w-24 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] rounded-full animate-loading-beam" style={{ animationDelay: '0.6s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-24 left-0 w-full text-center px-8">
          <div className="flex flex-col items-center gap-5">
            <p className="text-[10px] font-black tracking-[0.6em] text-slate-400 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800">
              Ejército Evangélico de Chile
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex flex-col items-center bg-background min-h-screen animate-in fade-in duration-1000">
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[120px] animate-aura" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[100px] animate-aura" style={{ animationDirection: 'reverse' }} />
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col h-screen">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm pt-12 pb-4 px-4 border-b flex items-center justify-between relative">
          {selectedCategory ? (
            <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)} className="rounded-full h-10 w-10">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" asChild className="rounded-full h-10 w-10">
              <Link href="/">
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Volver</span>
              </Link>
            </Button>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold font-headline text-foreground">
              {selectedCategory || "Ocasiones Especiales"}
            </h1>
            {!selectedCategory && <Sparkles className="h-5 w-5 text-amber-500" />}
          </div>
          <div className="w-10"></div>
        </header>

        <div className="p-4 flex-1 overflow-auto">
          {!isLoaded ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="animate-pulse font-bold uppercase tracking-widest text-[10px]">Sincronizando...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <SpecialOccasionListClient 
                specialOccasions={specialOccasions} 
                activeCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
