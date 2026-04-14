'use client';

import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Settings, Inbox, AlertTriangle, Lightbulb, ExternalLink, ShieldCheck, Wallet, Zap, Info, ArrowDownCircle, ArrowUpCircle, Sparkles, Bot } from 'lucide-react';
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
import { AppAssistantChat } from '@/components/app-assistant-chat';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState } from 'react';

import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { useSpecialOccasions } from '@/context/special-occasions-context';

export function AdminPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = searchParams.get('tab') || 'review';
  const [showRoadmap, setShowRoadmap] = useState(false);

  const { pendingPraises } = usePraises();
  const { pendingChoirs } = useChoirs();
  const { pendingYouthChoirs } = useYouthChoirs();
  const { pendingSpecialOccasions } = useSpecialOccasions();

  const pendingCount = pendingPraises.length + pendingChoirs.length + pendingYouthChoirs.length + pendingSpecialOccasions.length;

  const handleTabChange = (value: string) => {
    router.replace(`${pathname}?tab=${value}`, { scroll: false });
  };

  return (
      <div className="w-full max-w-4xl mx-auto pb-20">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm p-2 border-b flex items-center justify-between h-14">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/"><ChevronLeft className="h-6 w-6" /><span className="sr-only">Volver</span></Link>
          </Button>
          <h1 className="text-xl font-bold font-headline text-foreground">Panel de Administración</h1>
          <div className="w-10"></div>
        </header>

        <div className="p-4 space-y-6">
          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 h-auto bg-muted/50 p-1 rounded-xl gap-1 overflow-x-auto">
              <TabsTrigger value="review" className="text-[10px] md:text-xs">Revisión {pendingCount > 0 && <Badge className="ml-1 px-1 h-4 min-w-4 text-[8px]">{pendingCount}</Badge>}</TabsTrigger>
              <TabsTrigger value="assistant" className="text-[10px] md:text-xs bg-primary/10 text-primary data-[state=active]:bg-primary data-[state=active]:text-white">
                <Bot className="h-3 w-3 mr-1" /> Asistente
              </TabsTrigger>
              <TabsTrigger value="hymns" className="text-[10px] md:text-xs">Himnos</TabsTrigger>
              <TabsTrigger value="praises" className="text-[10px] md:text-xs">Alabanzas</TabsTrigger>
              <TabsTrigger value="choirs" className="text-[10px] md:text-xs">Coros</TabsTrigger>
              <TabsTrigger value="youth-choirs" className="text-[10px] md:text-xs">Agrup.</TabsTrigger>
              <TabsTrigger value="special" className="text-[10px] md:text-xs">Especial</TabsTrigger>
              <TabsTrigger value="more-settings" className="text-[10px] md:text-xs">Más</TabsTrigger>
            </TabsList>
            
            <TabsContent value="review" className="mt-4"><SongReviewList /></TabsContent>
            <TabsContent value="assistant" className="mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <AppAssistantChat />
            </TabsContent>
            <TabsContent value="hymns" className="mt-4"><HymnAdminList /></TabsContent>
            <TabsContent value="praises" className="mt-4"><PraiseAdminList /></TabsContent>
            <TabsContent value="choirs" className="mt-4"><ChoirAdminList /></TabsContent>
            <TabsContent value="youth-choirs" className="mt-4"><YouthChoirAdminList /></TabsContent>
            <TabsContent value="special" className="mt-4">
              <Card>
                <CardHeader><CardTitle>Ocasiones Especiales</CardTitle></CardHeader>
                <CardContent><p className="text-sm text-muted-foreground">Gestiona los cantos de Bautismos, Matrimonios, etc.</p></CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="more-settings" className="mt-4">
              <div className="space-y-6">
                <DuplicateSongsManager />
                <MissingHymns />
                <SongTransferManager />
                <BackupManager />
              </div>
            </TabsContent>
          </Tabs>

          <Card className="border-primary/20 bg-primary/5 shadow-lg overflow-hidden transition-all duration-300">
            <div className="bg-primary/10 px-6 py-4 border-b border-primary/10 flex items-center justify-between cursor-pointer" onClick={() => setShowRoadmap(!showRoadmap)}>
              <div className="flex items-center gap-2"><Wallet className="h-5 w-5 text-primary" /><h2 className="font-bold text-sm tracking-wide uppercase">Hoja de Ruta</h2></div>
              {showRoadmap ? <ArrowUpCircle className="h-5 w-5 text-primary/60" /> : <ArrowDownCircle className="h-5 w-5 text-primary/60" />}
            </div>
            {showRoadmap && (
              <CardContent className="p-6">
                <p className="text-xs text-muted-foreground mb-4">Consejos para optimizar el uso de Firebase y mantener costos en $0.</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
  );
}
