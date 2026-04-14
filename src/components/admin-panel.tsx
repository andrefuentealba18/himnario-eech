
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ShieldCheck, Sparkles, Loader2, Lock, LayoutDashboard } from 'lucide-react';
import { HymnAdminList } from '@/components/hymn-admin-list';
import { PraiseAdminList } from '@/components/praise-admin-list';
import { ChoirAdminList } from '@/components/choir-admin-list';
import { YouthChoirAdminList } from '@/components/youth-choir-admin-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MissingHymns } from '@/components/missing-hymns';
import { BackupManager } from '@/components/backup-manager';
import { SongTransferManager } from '@/components/song-transfer-manager';
import { DuplicateSongsManager } from '@/components/duplicate-songs-manager';
import { SongReviewList } from '@/components/song-review-list';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { useSpecialOccasions } from '@/context/special-occasions-context';

export function AdminPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = searchParams.get('tab') || 'review';

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
      }, 3500); // Un poco más largo para disfrutar el saludo
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, []);

  const handleTabChange = (value: string) => {
    router.replace(`${pathname}?tab=${value}`, { scroll: false });
  };

  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden animate-in fade-in duration-700">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-white to-amber-50/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-blue-600/5 rounded-full blur-[160px] animate-aura-giant" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[180vw] bg-amber-400/10 rounded-full blur-[180px] animate-aura-giant" style={{ animationDirection: 'reverse', animationDelay: '-3s' }} />
          <div className="absolute inset-0 design-grid opacity-[0.08]" />
        </div>
        
        <div className="relative mb-16 animate-in fade-in zoom-in-95 slide-in-from-top-10 duration-1000 ease-out flex flex-col items-center">
          <div className="absolute inset-0 bg-amber-400/25 blur-[100px] rounded-full scale-150 animate-pulse" />
          <div className="relative p-2 bg-gradient-to-tr from-amber-400 via-white to-blue-400 rounded-full shadow-2xl">
            <div className="bg-white rounded-full p-1 overflow-hidden w-32 h-32 flex items-center justify-center shadow-inner">
              <Image 
                src={insigniaUrl} 
                alt="Insignia EECH" 
                width={128} 
                height={128} 
                className="rounded-full object-cover"
                priority
              />
            </div>
          </div>
          <div className="absolute -bottom-4 right-0 bg-blue-600 p-2.5 rounded-2xl shadow-xl border-4 border-white animate-bounce delay-700">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="space-y-12 text-center px-8 max-w-md">
            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-500">
                <div className="h-px w-8 bg-amber-500/40" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400">Acceso Autorizado</span>
                <div className="h-px w-8 bg-amber-500/40" />
              </div>
              
              <h1 className="text-5xl font-black font-headline text-slate-900 animate-title-reveal-big uppercase tracking-[0.1em] leading-tight">
                Bienvenido
              </h1>
              
              <p className="mt-6 text-[11px] font-black tracking-[0.3em] text-primary/70 uppercase animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000 leading-relaxed">
                Panel de Control del Administrador
              </p>
              
              <div className="mt-12 relative w-72 h-2 mx-auto overflow-hidden rounded-full bg-slate-100 shadow-inner border border-slate-200/50">
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

        <div className="p-4 space-y-6">
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-7 h-auto bg-muted/50 p-1 rounded-2xl gap-1 overflow-x-auto">
              <TabsTrigger value="review" className="text-[10px] md:text-xs rounded-xl h-10">Revisión {pendingCount > 0 && <Badge className="ml-1 px-1 h-4 min-w-4 text-[8px]">{pendingCount}</Badge>}</TabsTrigger>
              <TabsTrigger value="hymns" className="text-[10px] md:text-xs rounded-xl h-10">Himnos</TabsTrigger>
              <TabsTrigger value="praises" className="text-[10px] md:text-xs rounded-xl h-10">Alabanzas</TabsTrigger>
              <TabsTrigger value="choirs" className="text-[10px] md:text-xs rounded-xl h-10">Coros</TabsTrigger>
              <TabsTrigger value="youth-choirs" className="text-[10px] md:text-xs rounded-xl h-10">Agrup.</TabsTrigger>
              <TabsTrigger value="special" className="text-[10px] md:text-xs rounded-xl h-10">Especial</TabsTrigger>
              <TabsTrigger value="more-settings" className="text-[10px] md:text-xs rounded-xl h-10">Más</TabsTrigger>
            </TabsList>
            
            <TabsContent value="review" className="mt-6 space-y-4">
              <SongReviewList />
            </TabsContent>
            
            <TabsContent value="hymns" className="mt-6">
              <HymnAdminList />
            </TabsContent>
            
            <TabsContent value="praises" className="mt-6">
              <PraiseAdminList />
            </TabsContent>
            
            <TabsContent value="choirs" className="mt-6">
              <ChoirAdminList />
            </TabsContent>
            
            <TabsContent value="youth-choirs" className="mt-6">
              <YouthChoirAdminList />
            </TabsContent>
            
            <TabsContent value="special" className="mt-6">
              <Card className="app-card overflow-hidden">
                <div className="h-1 w-full bg-amber-500" />
                <CardHeader>
                  <CardTitle className="text-lg">Ocasiones Especiales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Gestiona los cantos de Bautismos, Matrimonios y otras ceremonias. 
                    Puedes agregar cantos manualmente o importarlos desde las otras secciones usando el buscador integrado en la sección pública.
                  </p>
                  <Button asChild className="mt-6 rounded-xl bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-100">
                    <Link href="/special-occasions">Ir a Especiales</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="more-settings" className="mt-6 space-y-8 pb-10">
              <DuplicateSongsManager />
              <MissingHymns />
              <SongTransferManager />
              <BackupManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}
