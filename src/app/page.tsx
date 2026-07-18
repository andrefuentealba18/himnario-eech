"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Book, Mic, Library, WifiOff, Sparkles, Loader2, ChevronRight, ShieldCheck } from 'lucide-react';
import { SettingsDialog } from '@/components/settings-dialog';
import { InstallPWAButton } from '@/components/install-pwa-button';
import { AppearanceDialog } from '@/components/appearance-dialog';
import { GlobalSearch } from '@/components/global-search';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useHymns } from '@/context/hymns-context';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { useSpecialOccasions } from '@/context/special-occasions-context';
import { useAppearance } from '@/hooks/use-appearance';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: "Himnos",
    href: "/hymns",
    icon: Book,
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-600 dark:text-blue-400",
    delay: "250ms"
  },
  {
    title: "Alabanzas",
    href: "/praises",
    icon: Music,
    color: "from-indigo-500/20 to-indigo-600/5",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    delay: "350ms"
  },
  {
    title: "Coros",
    href: "/choirs",
    icon: Mic,
    color: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-600 dark:text-rose-400",
    delay: "450ms"
  },
  {
    title: "Agrupaciones",
    href: "/youth-choirs",
    icon: Library,
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-600 dark:text-amber-400",
    delay: "550ms"
  }
];

export default function HomePage() {
  const { isLoaded: hymnsLoaded } = useHymns();
  const { isLoaded: praisesLoaded } = usePraises();
  const { isLoaded: choirsLoaded } = useChoirs();
  const { isLoaded: youthChoirsLoaded } = useYouthChoirs();
  const { isLoaded: specialOccasionsLoaded } = useSpecialOccasions();
  const { isLoaded: appearanceLoaded } = useAppearance();
  
  const [showSplash, setShowSplash] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    
    // Smooth cinematic exit sequence: trigger exit style first, then unmount
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2800);

    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3600);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  const isFullySynced = hymnsLoaded && praisesLoaded && choirsLoaded && youthChoirsLoaded && specialOccasionsLoaded && appearanceLoaded;

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  if (showSplash) {
    return (
      <div 
        className={cn(
          "fixed inset-0 z-[200] bg-white dark:bg-[#020617] flex flex-col items-center justify-center overflow-hidden transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          isExiting ? "opacity-0 scale-[1.03] pointer-events-none blur-2xl" : "opacity-100 scale-100"
        )}
      >
        
        {/* Soft, luxury ambient glow in the center */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="absolute w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-600/5 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
        </div>

        {/* Floating background particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-[20%] left-[10%] w-1.5 h-1.5 bg-primary/20 dark:bg-primary/40 rounded-full blur-[0.5px] animate-float" style={{ animationDuration: '10s' }} />
          <div className="absolute top-[60%] left-[85%] w-2 h-2 bg-amber-400/15 dark:bg-amber-400/25 rounded-full blur-[0.5px] animate-float" style={{ animationDuration: '14s', animationDelay: '1.5s' }} />
          <div className="absolute top-[80%] left-[25%] w-1.5 h-1.5 bg-blue-500/15 dark:bg-blue-500/20 rounded-full blur-[0.5px] animate-float" style={{ animationDuration: '12s', animationDelay: '2.5s' }} />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-10 text-center px-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-[1400ms] ease-out">
          
          {/* Logo container with high-end dual ring border */}
          <div className="relative animate-in zoom-in-75 fade-in duration-[1600ms] ease-out fill-mode-both">
            {/* Elegant outer thin rings */}
            <div className="absolute inset-[-15px] border border-slate-200 dark:border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '30s' }} />
            <div className="absolute inset-[-30px] border border-dashed border-slate-200 dark:border-white/5 rounded-full animate-spin-slow" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />
            <div className="absolute inset-[-5px] border border-primary/20 dark:border-primary/10 rounded-full animate-pulse-slow" />

            {/* Expanding Pulse Radar Waves */}
            <div className="absolute top-1/2 left-1/2 w-36 h-36 rounded-full border border-primary/20 dark:border-primary/10 animate-pulse-ring" style={{ animationDelay: '0s' }} />
            <div className="absolute top-1/2 left-1/2 w-36 h-36 rounded-full border border-amber-400/10 dark:border-amber-400/5 animate-pulse-ring" style={{ animationDelay: '1.2s' }} />

            <div className="relative p-1.5 bg-white/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-white/10 rounded-full shadow-[0_0_80px_rgba(0,0,0,0.1)] dark:shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl animate-float">
              <div className="bg-white dark:bg-slate-950 rounded-full p-1 overflow-hidden w-36 h-36 flex items-center justify-center relative group">
                <Image 
                  src={insigniaUrl} 
                  alt="EECH Logo" 
                  width={144}
                  height={144}
                  className="rounded-full object-cover w-full h-full opacity-90"
                  priority
                />
                
                {/* Logo shine sweep overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-[150%] skew-x-[-25deg] animate-shine-sweep pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-6 relative w-full pt-4">
            {/* Premium Typography Reveal */}
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center">
                <div className="flex overflow-hidden pb-4">
                  {"BIENVENIDO".split("").map((letter, i) => (
                    <span 
                      key={i} 
                      className="text-4xl sm:text-5xl font-black font-headline text-slate-950 dark:text-white drop-shadow-[0_8px_16px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_8px_16px_rgba(255,255,255,0.03)] opacity-0 animate-letter-reveal"
                      style={{ 
                        animationDelay: `${0.4 + i * 0.08}s` 
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              </div>
              <p 
                className="text-[10px] text-slate-400 dark:text-slate-500 font-black tracking-[0.4em] uppercase opacity-0 animate-in fade-in slide-in-from-top-2 fill-mode-both"
                style={{ animationDelay: '1400ms', animationDuration: '1000ms' }}
              >
                Himnario Digital EECH
              </p>
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-[1600ms] fill-mode-both w-full pt-2">
              <div className="flex flex-col items-center gap-4">
                
                {/* Modern Minimalist Loading Dots (Office-style) */}
                <div className="flex flex-col items-center w-full">
                  <div className="relative w-64 h-4 overflow-hidden">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-office-dot-1 absolute top-1/2 -translate-y-1/2" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-office-dot-2 absolute top-1/2 -translate-y-1/2" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-office-dot-3 absolute top-1/2 -translate-y-1/2" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-office-dot-4 absolute top-1/2 -translate-y-1/2" />
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-office-dot-5 absolute top-1/2 -translate-y-1/2" />
                  </div>
                  <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] pt-3 opacity-60">
                    Cargando
                  </span>
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Global Branding Footer */}
        <div className="absolute bottom-12 w-full text-center px-10 animate-in fade-in duration-1000 delay-[2200ms] fill-mode-both">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4 opacity-35">
              <div className="h-[1px] w-6 bg-slate-400 dark:bg-slate-600" />
              <Sparkles className="h-3.5 w-3.5 text-amber-500/80 animate-pulse" />
              <div className="h-[1px] w-6 bg-slate-400 dark:bg-slate-600" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-[0.8em] ml-[0.8em] drop-shadow-sm">
              Ejército Evangélico de Chile
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) return null;

  return (
    <div className="relative min-h-screen w-full bg-transparent text-foreground overflow-x-hidden font-body flex flex-col animate-in fade-in duration-1000">

      <div className="relative z-10 flex flex-col flex-1">
        
        <div className="flex items-center justify-between px-6 pt-16 pb-4">
          <div className="flex items-center gap-2">
            {isFullySynced ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-green-500/20 shadow-sm transition-all duration-500 hover:scale-105">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[8px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">Offline</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-amber-500/20 shadow-sm">
                <WifiOff className="h-2.5 w-2.5 text-amber-500 animate-bounce" />
                <span className="text-[8px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Sinc...</span>
              </div>
            )}
          </div>
          <AppearanceDialog />
        </div>

        <main className="container max-w-lg mx-auto flex-1 flex flex-col items-center p-4 pt-2 pb-6 space-y-5">
          
          <header className="w-full text-center space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="relative inline-flex items-center justify-center group">
              <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full scale-150 opacity-50" />
              <div className="relative p-1 bg-gradient-to-tr from-primary/80 to-primary/30 rounded-full shadow-xl animate-float">
                <div className="bg-white dark:bg-slate-900 rounded-full p-0.5 overflow-hidden flex items-center justify-center w-24 h-24">
                  <Image 
                    src={insigniaUrl} 
                    alt="Insignia EECH" 
                    width={96} 
                    height={96} 
                    className="rounded-full object-cover w-full h-full opacity-95"
                    priority
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary/40 mb-1">
                <div className="h-px w-6 bg-current" />
                <span className="text-[9px] font-black tracking-[0.3em] uppercase">Oficial</span>
                <div className="h-px w-6 bg-current" />
              </div>
              <h1 className="text-5xl sm:text-6xl font-cursive text-slate-900 dark:text-white leading-tight drop-shadow-lg pb-2 flex items-center justify-center gap-4">
                Himnario <span className="text-primary font-cursive text-3xl sm:text-4xl ml-2 sm:ml-4">EECH</span>
              </h1>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.4em] uppercase pt-1 opacity-70">
                Ejército Evangélico de Chile
              </p>
            </div>
          </header>

          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-3 duration-[900ms] delay-[150ms] fill-mode-both">
            <GlobalSearch />
          </div>

          <div className="w-full max-w-md space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {navigationItems.map((item) => (
                <div key={item.title} className="animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: item.delay }}>
                  <Link href={item.href} className="group block h-full">
                    <Card className="h-full bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl hover:bg-white/90 dark:hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2 active:scale-95 overflow-hidden relative group rounded-3xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-40 transition-opacity duration-500`} />
                      <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full min-h-[110px] relative z-10">
                        <div className={`p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm group-hover:shadow-lg rounded-2xl group-hover:scale-110 transition-all duration-500 ring-1 ring-black/5 dark:ring-white/10 mb-3`}>
                          <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                        </div>
                        <h3 className="font-bold text-[10px] uppercase tracking-widest font-body text-slate-700 dark:text-slate-200 group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-700 delay-[650ms] fill-mode-both">
              <Link href="/repertoire" className="group block h-full">
                <Card className="h-full bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl hover:bg-white/90 dark:hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2 active:scale-95 overflow-hidden relative group rounded-3xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 opacity-10 group-hover:opacity-40 transition-opacity duration-500" />
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[130px] relative z-10">
                    <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm group-hover:shadow-lg rounded-2xl group-hover:scale-110 transition-all duration-500 ring-1 ring-black/5 dark:ring-white/10 mb-3">
                      <Book className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="font-bold text-[10px] uppercase tracking-widest font-body text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 transition-colors leading-tight">
                      Repertorios
                    </h3>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/special-occasions" className="group block h-full">
                <Card className="h-full bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl hover:bg-white/90 dark:hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2 active:scale-95 overflow-hidden relative group rounded-3xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-amber-600/5 opacity-10 group-hover:opacity-40 transition-opacity duration-500" />
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[130px] relative z-10">
                    <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm group-hover:shadow-lg rounded-2xl group-hover:scale-110 transition-all duration-500 ring-1 ring-black/5 dark:ring-white/10 mb-3">
                      <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h3 className="font-bold text-[10px] uppercase tracking-widest font-body text-slate-700 dark:text-slate-200 group-hover:text-amber-600 transition-colors leading-tight">
                      Especiales
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
          
          <footer className="w-full text-center space-y-6 animate-in fade-in duration-1000 delay-[750ms] mt-2">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-6">
                <InstallPWAButton />

                <SettingsDialog />
              </div>
              
              <div className="space-y-2 pb-8">
                <p className="text-xs font-headline italic font-bold text-primary/60">
                  "Alabaré a Jehová en mi vida"
                </p>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Iglesia Ejército Evangélico de Chile</p>
                  <p className="text-[7px] font-black text-primary/30 uppercase tracking-[0.1em] border border-primary/5 rounded-full px-4 py-1 inline-block">
                    PF - TODOS LOS DERECHOS RESERVADOS 2026
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
