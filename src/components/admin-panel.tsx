
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Sparkles, 
  Book, 
  Music, 
  Mic, 
  Library, 
  Settings, 
  ClipboardCheck, 
  LayoutDashboard,
  ArrowLeft,
  ArrowRight,
  Plus
} from 'lucide-react';
import { HymnAdminList } from '@/components/hymn-admin-list';
import { PraiseAdminList } from '@/components/praise-admin-list';
import { ChoirAdminList } from '@/components/choir-admin-list';
import { YouthChoirAdminList } from '@/components/youth-choir-admin-list';
import { MissingHymns } from '@/components/missing-hymns';
import { BackupManager } from '@/components/backup-manager';
import { SongTransferManager } from '@/components/song-transfer-manager';
import { SpecialOccasionAdminList } from '@/components/special-occasion-admin-list';
import { DuplicateSongsManager } from '@/components/duplicate-songs-manager';
import { SongReviewList } from '@/components/song-review-list';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { useSpecialOccasions } from '@/context/special-occasions-context';

export function AdminPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = searchParams.get('tab') || 'menu';

  const { pendingPraises } = usePraises();
  const { pendingChoirs } = useChoirs();
  const { pendingYouthChoirs } = useYouthChoirs();
  const { pendingSpecialOccasions } = useSpecialOccasions();

  const [showIntro, setShowIntro] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const pendingCount = pendingPraises.length + pendingChoirs.length + pendingYouthChoirs.length + pendingSpecialOccasions.length;

  useEffect(() => {
    const introSeen = sessionStorage.getItem('intro_seen_admin');
    if (!introSeen) {
      setShowIntro(true);
      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem('intro_seen_admin', 'true');
        setIsReady(true);
      }, 3500); 
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, []);

  const handleTabChange = (value: string) => {
    router.replace(`${pathname}?tab=${value}`, { scroll: false });
  };

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  const adminMenuItems = [
    { 
      id: 'review', 
      label: 'Revisión', 
      desc: 'Pendientes por aprobar',
      icon: ClipboardCheck, 
      color: 'from-amber-500/20 to-amber-600/5', 
      iconColor: 'text-amber-600',
      count: pendingCount 
    },
    { 
      id: 'hymns', 
      label: 'Himnos', 
      desc: 'Gestión del Himnario',
      icon: Book, 
      color: 'from-blue-500/20 to-blue-600/5',
      iconColor: 'text-blue-600'
    },
    { 
      id: 'praises', 
      label: 'Alabanzas', 
      desc: 'Alabanzas Generales',
      icon: Music, 
      color: 'from-indigo-500/20 to-indigo-600/5',
      iconColor: 'text-indigo-600'
    },
    { 
      id: 'choirs', 
      label: 'Coros', 
      desc: 'Avivamiento y Meditación',
      icon: Mic, 
      color: 'from-rose-500/20 to-rose-600/5',
      iconColor: 'text-rose-600'
    },
    { 
      id: 'youth-choirs', 
      label: 'Agrupaciones', 
      desc: 'Cantos de Grupos',
      icon: Library, 
      color: 'from-orange-500/20 to-orange-600/5',
      iconColor: 'text-orange-600'
    },
    { 
      id: 'special', 
      label: 'Especiales', 
      desc: 'Ocasiones Ceremoniales',
      icon: Sparkles, 
      color: 'from-purple-500/20 to-purple-600/5',
      iconColor: 'text-purple-600'
    },
    { 
      id: 'more-settings', 
      label: 'Ajustes', 
      desc: 'Backups y Traspasos',
      icon: Settings, 
      color: 'from-slate-500/20 to-slate-600/5',
      iconColor: 'text-slate-600'
    },
  ];

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-700">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-white to-amber-50/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-blue-600/5 rounded-full blur-[160px] animate-aura-giant" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[180vw] bg-amber-400/10 rounded-full blur-[180px] animate-aura-giant" style={{ animationDirection: 'reverse', animationDelay: '-3s' }} />
          <div className="absolute inset-0 design-grid opacity-[0.08]" />
        </div>
        
        <div className="relative mb-12 animate-in fade-in zoom-in-95 slide-in-from-top-10 duration-1000 ease-out flex flex-col items-center">
          <div className="absolute inset-0 bg-amber-400/25 blur-[100px] rounded-full scale-150 animate-pulse" />
          <div className="relative p-2 bg-gradient-to-tr from-amber-400 via-white to-blue-400 rounded-full shadow-2xl">
            <div className="bg-white rounded-full p-1 overflow-hidden w-28 h-28 flex items-center justify-center shadow-inner">
              <Image 
                src={insigniaUrl} 
                alt="Insignia EECH" 
                width={112} 
                height={112} 
                className="rounded-full object-cover"
                priority
              />
            </div>
          </div>
          <div className="absolute -bottom-2 right-0 bg-blue-600 p-2 rounded-xl shadow-xl border-4 border-white animate-bounce delay-700">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="space-y-8 text-center px-8 max-w-lg">
            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
                <div className="h-px w-8 bg-amber-500/40" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400">Acceso Autorizado</span>
                <div className="h-px w-8 bg-amber-500/40" />
              </div>
              
              <h1 className="text-lg sm:text-xl md:text-2xl font-black font-headline text-slate-900 animate-title-reveal-big uppercase tracking-[0.05em] sm:tracking-[0.1em] leading-tight px-4">
                BIENVENIDO AL PANEL DE CONTROL DEL ADMINISTRADOR
              </h1>
              
              <div className="mt-12 relative w-64 sm:w-72 h-2 mx-auto overflow-hidden rounded-full bg-slate-100 shadow-inner border border-slate-200/50">
                <div className="absolute inset-0 flex">
                  <div className="h-full flex-1 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.8)] animate-loading-beam-long" style={{ animationDelay: '0s' }} />
                  <div className="h-full w-20 bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] animate-loading-beam-long" style={{ animationDelay: '0.4s' }} />
                  <div className="h-full flex-1 bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-loading-beam-long" style={{ animationDelay: '0.8s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-16 left-0 w-full text-center px-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[9px] font-black tracking-[0.6em] text-slate-400 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
              Ejército Evangélico de Chile
            </p>
            <div className="flex items-center gap-6 opacity-30">
              <div className="h-px w-16 bg-blue-600" />
              <Sparkles className="h-3 w-3 text-amber-500 animate-spin-slow" />
              <div className="h-px w-16 bg-red-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isReady) return null;

  return (
      <div className="w-full max-w-4xl mx-auto pb-20 animate-in fade-in duration-1000">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm pt-16 pb-4 px-4 border-b flex items-center justify-between min-h-[100px]">
          <Button variant="ghost" size="icon" asChild className="rounded-full h-12 w-12 hover:bg-primary/10 transition-colors">
            <Link href="/"><ChevronLeft className="h-7 w-7 text-slate-600" /><span className="sr-only">Volver</span></Link>
          </Button>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-0.5">
              <ShieldCheck className="h-3 w-3 text-amber-600" />
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Gestión Oficial</span>
            </div>
            <h1 className="text-xl font-bold font-headline text-foreground leading-tight tracking-tight">Panel Administrativo</h1>
          </div>
          <div className="p-2 bg-primary/5 rounded-xl border border-primary/10">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
        </header>

        <main className="p-4 space-y-6">
          {tab === 'menu' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="col-span-full mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-1">Selecciona Categoría para gestionar</p>
              </div>
              {adminMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className="group relative flex items-center gap-4 p-5 rounded-[2rem] bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 hover:border-primary/30 hover:bg-slate-50 transition-all duration-500 shadow-sm hover:shadow-xl active:scale-95 text-left overflow-hidden"
                >
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    item.color
                  )} />
                  <div className="relative z-10 p-4 rounded-[1.5rem] bg-white dark:bg-slate-900 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <item.icon className={cn("h-6 w-6", item.iconColor)} />
                  </div>
                  <div className="relative z-10 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-xs uppercase tracking-widest text-slate-800 dark:text-slate-200">{item.label}</h3>
                      {item.count !== undefined && item.count > 0 && (
                        <Badge className="bg-red-600 text-white font-black animate-pulse h-6 min-w-6 flex items-center justify-center">
                          {item.count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{item.desc}</p>
                  </div>
                  <div className="relative z-10 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" size="sm" onClick={() => handleTabChange('menu')} className="rounded-full h-10 px-4">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Menú
                </Button>
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                <Badge variant="secondary" className="capitalize px-3 font-bold">{tab.replace('-', ' ')}</Badge>
              </div>

              {tab === 'review' && <SongReviewList />}
              {tab === 'hymns' && <HymnAdminList />}
              {tab === 'praises' && <PraiseAdminList />}
              {tab === 'choirs' && <ChoirAdminList />}
              {tab === 'youth-choirs' && <YouthChoirAdminList />}
              {tab === 'special' && <SpecialOccasionAdminList />}
              {tab === 'more-settings' && (
                <div className="space-y-8 pb-10">
                  <DuplicateSongsManager />
                  <MissingHymns />
                  <SongTransferManager />
                  <BackupManager />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
  );
}
