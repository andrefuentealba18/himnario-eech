
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
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
    delay: "0.1s"
  },
  {
    title: "Alabanzas",
    href: "/praises",
    icon: Music,
    color: "from-indigo-500/20 to-indigo-600/5",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    delay: "0.2s"
  },
  {
    title: "Coros",
    href: "/choirs",
    icon: Mic,
    color: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-600 dark:text-rose-400",
    delay: "0.3s"
  },
  {
    title: "Agrupaciones",
    href: "/youth-choirs",
    icon: Library,
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-600 dark:text-amber-400",
    delay: "0.4s"
  }
];

export default function HomePage() {
  const { isLoaded: hymnsLoaded } = useHymns();
  const { isLoaded: praisesLoaded } = usePraises();
  const { isLoaded: choirsLoaded } = useChoirs();
  const { isLoaded: youthChoirsLoaded } = useYouthChoirs();
  const { isLoaded: specialOccasionsLoaded } = useSpecialOccasions();
  const { isLoaded: appearanceLoaded } = useAppearance();
  
  const [showSplash, setShowSplash] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const splashSeen = sessionStorage.getItem('splash_seen');
    if (!splashSeen) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('splash_seen', 'true');
        setIsReady(true);
      }, 4500); 
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
    
    sessionStorage.removeItem('intro_seen_admin');
    sessionStorage.removeItem('intro_seen_hymns');
    sessionStorage.removeItem('intro_seen_praises');
    sessionStorage.removeItem('intro_seen_choirs');
    sessionStorage.removeItem('intro_seen_youth_choirs');
    sessionStorage.removeItem('intro_seen_special_occasions');
  }, []);

  const isFullySynced = hymnsLoaded && praisesLoaded && choirsLoaded && youthChoirsLoaded && specialOccasionsLoaded && appearanceLoaded;
  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[200] bg-white dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350vw] h-[350vw] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12)_0%,transparent_70%)] animate-aura-giant" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] h-[300vw] bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1)_0%,transparent_70%)] animate-aura-giant" style={{ animationDirection: 'reverse', animationDelay: '-5s' }} />
          <div className="absolute inset-0 design-grid opacity-[0.2] [mask-image:radial-gradient(circle_at_center,black_30%,transparent_100%)] animate-zoom-subtle" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 dark:via-slate-950/40 to-white dark:to-slate-950" />
        </div>

        <div className="relative flex flex-col items-center gap-16 text-center px-8 w-full max-w-lg">
          <div className="relative animate-in fade-in zoom-in-50 duration-1000 ease-out fill-mode-both">
            <div className="absolute inset-0 bg-blue-600/30 blur-[120px] rounded-full scale-[2] animate-pulse" />
            <div className="absolute inset-0 bg-amber-400/20 blur-[80px] rounded-full scale-150 animate-aura-slow" />
            
            <div className="relative p-1 bg-gradient-to-tr from-blue-600 via-white to-amber-400 rounded-full shadow-[0_0_50px_rgba(37,99,235,0.3)] transform transition-transform hover:scale-105 duration-1000">
              <div className="bg-white dark:bg-slate-900 rounded-full p-1.5 overflow-hidden w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center shadow-inner relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Image 
                  src={insigniaUrl} 
                  alt="EECH Logo" 
                  width={160} 
                  height={160} 
                  className="rounded-full object-cover animate-float"
                  priority
                />
              </div>
            </div>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/10 rounded-full animate-ping opacity-20" style={{ animationDuration: '3s' }} />
          </div>

          <div className="space-y-8 relative">
            <div className="overflow-hidden">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-headline text-slate-900 dark:text-white animate-title-reveal-big tracking-[0.25em] sm:tracking-[0.4em] uppercase drop-shadow-2xl">
                BIENVENIDO
              </h1>
            </div>
            
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-1000 fill-mode-both">
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 opacity-60">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
                  <span className="text-[10px] font-black tracking-[0.6em] text-primary uppercase">Himnario Digital</span>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
                </div>
                
                <div className="relative w-64 sm:w-80 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5 shadow-inner border border-slate-200/50 dark:border-white/10 mt-2">
                  <div className="absolute inset-0 flex">
                    <div className="h-full flex-1 bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,1)] animate-loading-beam-long" style={{ animationDelay: '0s' }} />
                    <div className="h-full w-24 bg-amber-400 shadow-[0_0_30px_rgba(251,191,36,1)] animate-loading-beam-long" style={{ animationDelay: '0.4s' }} />
                    <div className="h-full flex-1 bg-red-600 shadow-[0_0_30px_rgba(220,38,38,1)] animate-loading-beam-long" style={{ animationDelay: '0.8s' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-16 left-0 w-full text-center px-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1500 fill-mode-both">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 opacity-40">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <div className="h-px w-16 bg-slate-300 dark:bg-white/10" />
              <div className="h-1 w-1 rounded-full bg-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em] sm:tracking-[1em] ml-[0.5em] sm:ml-[1em]">
                Ejército Evangélico
              </p>
              <p className="text-[9px] font-bold text-primary/40 uppercase tracking-[0.5em]">
                de Chile
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) return null;

  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-foreground overflow-x-hidden font-body flex flex-col animate-in fade-in duration-1000">
      
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[150vw] h-[150vw] bg-gradient-to-tr from-primary/10 via-primary/5 to-purple-400/10 rounded-full animate-aura-slow blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 design-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

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

        <main className="container max-w-lg mx-auto flex-1 flex flex-col items-center p-6 pt-2 pb-6 space-y-8">
          
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
              <h1 className="text-4xl font-bold font-headline tracking-tighter text-slate-950 dark:text-white leading-tight text-glow">
                Himnario <span className="text-primary">EECH</span>
              </h1>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.4em] uppercase pt-1 opacity-70">
                Ejército Evangélico de Chile
              </p>
            </div>
          </header>

          <div className="w-full flex flex-col items-center">
            <GlobalSearch />
          </div>

          <div className="w-full max-w-md space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {navigationItems.map((item) => (
                <div key={item.title} className="animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: item.delay }}>
                  <Link href={item.href} className="group block h-full">
                    <Card className="h-full border-none bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl hover:bg-white/80 dark:hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-1 active:scale-95 overflow-hidden relative group app-card card-glow">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[120px] relative z-10">
                        <div className={`p-3 bg-white dark:bg-slate-900 shadow-lg group-hover:scale-110 transition-all duration-500 mb-3`} style={{ borderRadius: 'var(--ui-radius)' }}>
                          <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                        </div>
                        <h3 className="font-black text-[9px] uppercase tracking-[0.2em] font-body text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h3>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>

            <div className="animate-in fade-in zoom-in-95 duration-700 delay-500">
              <Link href="/special-occasions" className="group block">
                <Card className="border-none bg-gradient-to-r from-amber-500/10 to-amber-600/5 backdrop-blur-xl hover:bg-amber-500/20 transition-all duration-500 hover:-translate-y-1 active:scale-95 overflow-hidden relative app-card card-glow">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="flex items-center justify-center p-4 px-6 relative z-10 h-16 gap-4">
                    <div className="p-2.5 bg-white dark:bg-slate-900 shadow-lg rounded-xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-all duration-500">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 group-hover:text-amber-600 transition-colors">
                      Ocasiones Especiales
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
          
          <footer className="w-full text-center space-y-6 animate-in fade-in duration-1000 delay-500 mt-2">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-6">
                <InstallPWAButton />
                <div className="w-px h-4 bg-slate-300 dark:bg-white/10" />
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
