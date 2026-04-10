
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
    delay: "0.2s"
  },
  {
    title: "Alabanzas",
    href: "/praises",
    icon: Music,
    color: "from-indigo-500/20 to-indigo-600/5",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    delay: "0.3s"
  },
  {
    title: "Coros",
    href: "/choirs",
    icon: Mic,
    color: "from-rose-500/20 to-rose-600/5",
    iconColor: "text-rose-600 dark:text-rose-400",
    delay: "0.4s"
  },
  {
    title: "Agrupaciones",
    href: "/youth-choirs",
    icon: Library,
    color: "from-amber-500/20 to-amber-600/5",
    iconColor: "text-amber-600 dark:text-amber-400",
    delay: "0.5s"
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
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 text-foreground overflow-x-hidden font-body">
      
      {/* FONDO ARTÍSTICO DINÁMICO MEJORADO */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        {/* Capas de Aura */}
        <div className="absolute top-1/2 left-1/2 w-[150vw] h-[150vw] bg-gradient-to-tr from-primary/10 via-primary/5 to-purple-400/10 rounded-full animate-aura-slow blur-[100px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[100vw] h-[100vw] bg-gradient-to-bl from-amber-200/10 via-transparent to-rose-300/10 rounded-full animate-aura-slow blur-[120px] pointer-events-none" style={{ animationDirection: 'reverse', animationDuration: '50s' }} />
        
        {/* Grid de Fondo */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Barra Superior Minimalista */}
        <div className="flex items-center justify-between p-4 md:p-6 animate-in fade-in duration-1000">
          <div className="flex items-center gap-2">
            {isFullySynced ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-green-500/20 shadow-sm transition-all duration-500 hover:scale-105">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">Offline Listo</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-md border border-amber-500/20 shadow-sm">
                <WifiOff className="h-3 w-3 text-amber-500 animate-bounce" />
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Sincronizando...</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <AppearanceDialog />
          </div>
        </div>

        <main className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center p-6 pb-20">
          
          {/* HEADER DE BIENVENIDA INNOVADOR */}
          <header className="w-full text-center space-y-6 mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="relative inline-flex items-center justify-center group">
              <div className="absolute inset-0 bg-primary/30 blur-[60px] rounded-full scale-150 animate-pulse-soft opacity-50" />
              <div className="relative p-1 bg-gradient-to-tr from-primary via-primary/60 to-primary/40 rounded-full shadow-2xl animate-float group-hover:scale-105 transition-transform duration-700">
                <div className="bg-white dark:bg-slate-900 rounded-full p-1 overflow-hidden flex items-center justify-center w-28 h-24 md:w-36 md:h-36">
                  <Image 
                    src={insigniaUrl} 
                    alt="Insignia EECH" 
                    width={144} 
                    height={144} 
                    className="rounded-full object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
                    priority
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-3 text-primary/40 mb-2">
                <div className="h-px w-8 bg-current" />
                <span className="text-[10px] font-black tracking-[0.4em] uppercase">Bienvenido</span>
                <div className="h-px w-8 bg-current" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tighter text-slate-950 dark:text-white leading-[0.9] text-glow">
                Himnario <span className="text-primary block sm:inline mt-2 sm:mt-0">EECH</span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold tracking-[0.6em] uppercase pt-4 opacity-70">
                Ejército Evangélico de Chile
              </p>
            </div>
          </header>

          {/* Buscador */}
          <div className="w-full mb-12 flex flex-col items-center">
            <GlobalSearch />
          </div>

          {/* Navegación Principal en Cuadrícula Moderna */}
          <div className="grid grid-cols-2 gap-5 w-full max-w-lg mb-16">
            {navigationItems.map((item) => (
              <div key={item.title} className="animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: item.delay }}>
                <Link href={item.href} className="group block h-full">
                  <Card className="h-full border-none bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl hover:bg-white/80 dark:hover:bg-white/[0.08] transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(var(--primary),0.2)] hover:-translate-y-2 active:scale-95 overflow-hidden relative group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[160px] relative z-10">
                      <div className={`p-5 rounded-3xl bg-white dark:bg-slate-900 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-5`}>
                        <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                      </div>
                      <h3 className="font-black text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-body text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors leading-tight">
                        {item.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Footer Elegante */}
          <footer className="w-full text-center space-y-10 animate-in fade-in duration-1000 delay-700">
            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center justify-center gap-6">
                <InstallPWAButton />
                <div className="w-px h-6 bg-slate-300 dark:bg-white/10" />
                <SettingsDialog />
              </div>
              
              <div className="space-y-4">
                <p className="text-sm font-headline italic font-bold text-primary/60 text-glow">
                  "Alabaré a Jehová en mi vida"
                </p>
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Iglesia Ejército Evangélico de Chile</p>
                  <p className="text-[8px] font-black text-primary/40 uppercase tracking-[0.2em] border border-primary/10 rounded-full px-4 py-1.5 inline-block">
                    PATENTADO POR PABLO FUENTEALBA 2026
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
