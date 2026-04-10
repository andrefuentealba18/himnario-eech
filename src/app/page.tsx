"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Book, Mic, Library, WifiOff } from 'lucide-react';
import { SettingsDialog } from '@/components/settings-dialog';
import { InstallPWAButton } from '@/components/install-pwa-button';
import { AppearanceDialog } from '@/components/appearance-dialog';
import { GlobalSearch } from '@/components/global-search';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useHymns } from '@/context/hymns-context';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { useAppearance } from '@/hooks/use-appearance';

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
  const { isLoaded: appearanceLoaded } = useAppearance();

  const isFullySynced = hymnsLoaded && praisesLoaded && choirsLoaded && youthChoirsLoaded && appearanceLoaded;

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-foreground overflow-x-hidden font-body flex flex-col">
      
      {/* FONDO ARTÍSTICO DINÁMICO */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 w-[150vw] h-[150vw] bg-gradient-to-tr from-primary/10 via-primary/5 to-purple-400/10 rounded-full animate-aura-slow blur-[100px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[100vw] h-[100vw] bg-gradient-to-bl from-amber-200/10 via-transparent to-rose-300/10 rounded-full animate-aura-slow blur-[120px] pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '50s' }} />
        <div className="absolute inset-0 design-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        
        {/* Barra Superior - Dejada tal cual según solicitud */}
        <div className="flex items-center justify-between px-6 pt-20 pb-4 animate-in fade-in duration-1000">
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

        <main className="container max-w-lg mx-auto flex-1 flex flex-col items-center p-6 pt-16 pb-6 space-y-10">
          
          {/* HEADER - Logo subido un poco (pt-16 en lugar de pt-32) */}
          <header className="w-full text-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-1000">
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
              <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-slate-950 dark:text-white leading-tight text-glow">
                Himnario <span className="text-primary">EECH</span>
              </h1>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold tracking-[0.4em] uppercase pt-2 opacity-70">
                Ejército Evangélico de Chile
              </p>
            </div>
          </header>

          {/* Buscador */}
          <div className="w-full flex flex-col items-center">
            <GlobalSearch />
          </div>

          {/* Navegación Principal */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {navigationItems.map((item) => (
              <div key={item.title} className="animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: item.delay }}>
                <Link href={item.href} className="group block h-full">
                  <Card className="h-full border-none bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl hover:bg-white/80 dark:hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-1 active:scale-95 overflow-hidden relative group app-card card-glow">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[140px] relative z-10">
                      <div className={`p-4 bg-white dark:bg-slate-900 shadow-lg group-hover:scale-110 transition-all duration-500 mb-4`} style={{ borderRadius: 'var(--ui-radius)' }}>
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <h3 className="font-black text-[10px] uppercase tracking-[0.2em] font-body text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors leading-tight">
                        {item.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Footer - Subido un poco (mt-6 pt-4 en lugar de mt-12 pt-4) */}
          <footer className="w-full text-center space-y-8 animate-in fade-in duration-1000 delay-500 mt-6 pt-4">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center justify-center gap-6">
                <InstallPWAButton />
                <div className="w-px h-4 bg-slate-300 dark:bg-white/10" />
                <SettingsDialog />
              </div>
              
              <div className="space-y-3 pb-10">
                <p className="text-xs font-headline italic font-bold text-primary/60">
                  "Alabaré a Jehová en mi vida"
                </p>
                <div className="space-y-1.5">
                  <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">Iglesia Ejército Evangélico de Chile</p>
                  <p className="text-[7px] font-black text-primary/30 uppercase tracking-[0.1em] border border-primary/5 rounded-full px-4 py-1.5 inline-block">
                    PABLO FUENTEALBA 2026
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
