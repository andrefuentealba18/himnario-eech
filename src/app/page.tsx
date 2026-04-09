
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Book, Mic, Library, WifiOff, CheckCircle2, Sparkles } from 'lucide-react';
import { SettingsDialog } from '@/components/settings-dialog';
import { InstallPWAButton } from '@/components/install-pwa-button';
import { GlobalSearch } from '@/components/global-search';
import { ThemeToggle } from '@/components/theme-toggle';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useHymns } from '@/context/hymns-context';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { Badge } from '@/components/ui/badge';

const navigationItems = [
  {
    title: "Himnos",
    href: "/hymns",
    icon: Book,
    color: "bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    delay: "0.2s"
  },
  {
    title: "Alabanzas",
    href: "/praises",
    icon: Music,
    color: "bg-indigo-500/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    delay: "0.3s"
  },
  {
    title: "Coros",
    href: "/choirs",
    icon: Mic,
    color: "bg-rose-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
    delay: "0.4s"
  },
  {
    title: "Agrupaciones",
    href: "/youth-choirs",
    icon: Library,
    color: "bg-orange-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
    delay: "0.5s"
  }
];

export default function HomePage() {
  const { isLoaded: hymnsLoaded } = useHymns();
  const { isLoaded: praisesLoaded } = usePraises();
  const { isLoaded: choirsLoaded } = useChoirs();
  const { isLoaded: youthChoirsLoaded } = useYouthChoirs();

  const isFullySynced = hymnsLoaded && praisesLoaded && choirsLoaded && youthChoirsLoaded;

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-x-hidden font-body selection:bg-primary/20">
      
      {/* FONDO ARTÍSTICO DINÁMICO */}
      <div className="fixed inset-0 -z-20 overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-30 dark:opacity-5" />
        
        {/* Luces Celestiales Animadas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[80%] h-[70%] bg-blue-400/20 dark:bg-blue-900/30 blur-[120px] rounded-full animate-aura" style={{ animationDuration: '35s' }} />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-amber-200/20 dark:bg-amber-600/10 blur-[100px] rounded-full animate-aura" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />
          <div className="absolute -bottom-[10%] left-[10%] w-[90%] h-[60%] bg-rose-200/20 dark:bg-purple-900/20 blur-[130px] rounded-full animate-aura" style={{ animationDuration: '45s' }} />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/40 dark:from-black/20 dark:to-black/40" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Barra Superior con Status */}
        <div className="flex items-center justify-between p-4 md:p-6 animate-in fade-in duration-1000">
          <div className="flex items-center gap-2">
            {isFullySynced ? (
              <Badge variant="outline" className="bg-white/60 dark:bg-white/5 backdrop-blur-md border-green-200 text-green-600 dark:border-green-500/20 dark:text-green-400 gap-1.5 py-1 px-3 rounded-full shadow-sm scale-90 sm:scale-100">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Modo Offline Listo</span>
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-white/60 dark:bg-white/5 backdrop-blur-md border-amber-200 text-amber-600 gap-1.5 py-1 px-3 rounded-full animate-pulse scale-90 sm:scale-100">
                <WifiOff className="h-3.5 w-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Sincronizando...</span>
              </Badge>
            )}
          </div>
          <ThemeToggle />
        </div>

        <main className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center p-6 pb-12">
          
          {/* HEADER DE BIENVENIDA */}
          <header className="w-full text-center space-y-4 mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
            <div className="relative inline-flex items-center justify-center mb-2">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse-slow" />
              <div className="relative p-1.5 bg-gradient-to-tr from-amber-400 via-yellow-100 to-amber-600 rounded-full shadow-2xl animate-float">
                <div className="bg-white dark:bg-slate-900 rounded-full p-1 overflow-hidden flex items-center justify-center w-24 h-24 md:w-32 md:h-32">
                  <Image 
                    src={insigniaUrl} 
                    alt="Insignia EECH" 
                    width={128} 
                    height={128} 
                    className="rounded-full object-cover w-full h-full"
                    priority
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-primary/60 dark:text-blue-400/60 mb-1">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase">Bienvenido</span>
                <Sparkles className="h-4 w-4" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-slate-900 dark:text-foreground leading-tight">
                Himnario <span className="text-primary dark:text-blue-400">EECH</span>
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 dark:text-muted-foreground font-black tracking-[0.5em] uppercase pl-2">
                Ejército Evangélico de Chile
              </p>
            </div>
          </header>

          {/* Buscador Global */}
          <div className="w-full max-w-lg mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <GlobalSearch />
          </div>

          {/* Navegación Principal */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-12">
            {navigationItems.map((item) => (
              <div key={item.title} className="animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: item.delay }}>
                <Link href={item.href} className="group block h-full">
                  <Card className="h-full border-white/50 dark:border-white/5 bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl hover:bg-white/80 dark:hover:bg-white/[0.08] transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 active:scale-95 overflow-hidden relative shadow-lg border-2">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[140px]">
                      <div className={`p-4 rounded-2xl ${item.color} mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner`}>
                        <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-[11px] md:text-xs uppercase tracking-widest font-body text-slate-700 dark:text-foreground group-hover:text-primary transition-colors leading-tight px-1">
                        {item.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Footer Informativo */}
          <footer className="w-full text-center mt-auto pb-10 space-y-8 animate-in fade-in duration-1000 delay-500">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent mx-auto" />
            
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center justify-center gap-3">
                <InstallPWAButton />
                <div className="w-px h-4 bg-slate-300 dark:bg-white/10" />
                <SettingsDialog />
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-headline italic font-bold text-primary/50 dark:text-blue-400/40">
                  "Alabaré a Jehová en mi vida"
                </p>
                <div className="space-y-1 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                  <p>Iglesia Ejército Evangélico de Chile</p>
                  <p className="opacity-60">2026 Todos los derechos reservados</p>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
