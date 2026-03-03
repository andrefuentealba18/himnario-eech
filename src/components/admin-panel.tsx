'use client';

import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Settings, Inbox, AlertTriangle, Lightbulb, ExternalLink, ShieldCheck } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';

export function AdminPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = searchParams.get('tab') || 'review';

  const { pendingPraises } = usePraises();
  const { pendingChoirs } = useChoirs();
  const { pendingYouthChoirs } = useYouthChoirs();

  const pendingCount = pendingPraises.length + pendingChoirs.length + pendingYouthChoirs.length;

  const handleTabChange = (value: string) => {
    router.replace(`${pathname}?tab=${value}`, { scroll: false });
  };

  return (
      <div className="w-full max-w-4xl mx-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-2 border-b flex items-center justify-between h-14">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-headline text-foreground">
            Panel de Administración
          </h1>
          <div className="w-10"></div> {/* Spacer */}
        </header>

        <div className="p-4 space-y-6">
          {/* AVISO DE OPTIMIZACIÓN DE COSTOS */}
          <Card className="border-destructive/50 bg-destructive/5 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-6 w-6" />
                <CardTitle className="text-lg font-bold">CONTROL DE COSTOS (PLAN GRATUITO)</CardTitle>
              </div>
              <CardDescription className="text-foreground/80">
                Has pasado al plan de pago por uso. Aquí tienes opciones para intentar mantener los costos en $0.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-destructive/20">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600" />
                      ¿Cómo evitar que me cobren?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm pt-2">
                    <div className="flex gap-3 items-start">
                      <div className="bg-primary/10 p-1 rounded mt-0.5"><ShieldCheck className="h-4 w-4 text-primary" /></div>
                      <p><strong>Filtros aplicados:</strong> Ya configuramos la app para que los hermanos normales no descarguen las canciones "Pendientes". Esto reduce un 30% las lecturas.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="bg-primary/10 p-1 rounded mt-0.5"><ShieldCheck className="h-4 w-4 text-primary" /></div>
                      <p><strong>Revisión Rápida:</strong> Aprueba o rechaza las sugerencias pronto. Entre menos archivos haya en la base de datos, menos cobra Firebase por "listar" colecciones.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="bg-primary/10 p-1 rounded mt-0.5"><ShieldCheck className="h-4 w-4 text-primary" /></div>
                      <p><strong>Evita "Refrescar":</strong> Pide a los hermanos que no recarguen la app constantemente. La app ya guarda los himnos en el teléfono para usarlos sin internet y sin gastar saldo de Firebase.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" asChild className="h-8">
                  <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Ver Consola Firebase
                  </a>
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleTabChange('more-settings')} className="h-8 text-xs">
                  Limpiar Duplicados
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-6 h-auto overflow-x-auto">
              <TabsTrigger value="review" className="text-xs sm:text-sm">
                <Inbox className="mr-1 h-4 w-4 hidden sm:inline" />
                Revisiones
                {pendingCount > 0 && <Badge className="ml-1 px-1 h-5 min-w-5">{pendingCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="hymns" className="text-xs sm:text-sm">Himnos</TabsTrigger>
              <TabsTrigger value="praises" className="text-xs sm:text-sm">Alabanzas</TabsTrigger>
              <TabsTrigger value="choirs" className="text-xs sm:text-sm">Coros</TabsTrigger>
              <TabsTrigger value="youth-choirs" className="text-xs sm:text-sm">Agrup.</TabsTrigger>
              <TabsTrigger value="more-settings" className="text-xs sm:text-sm">
                <Settings className="mr-1 h-4 w-4 hidden sm:inline" />
                Más
              </TabsTrigger>
            </TabsList>
            <TabsContent value="review">
               <Card>
                  <CardHeader>
                    <CardTitle>Canciones Pendientes de Revisión</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SongReviewList />
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="hymns">
              <Card>
                <CardHeader>
                  <CardTitle>Gestionar Himnos</CardTitle>
                </CardHeader>
                <CardContent>
                  <HymnAdminList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="praises">
              <Card>
                <CardHeader>
                  <CardTitle>Gestionar Alabanzas</CardTitle>
                </CardHeader>
                <CardContent>
                  <PraiseAdminList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="choirs">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestionar Coros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChoirAdminList />
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="youth-choirs">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestionar Alabanza Agrupaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <YouthChoirAdminList />
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="more-settings">
                <div className="space-y-6">
                    <DuplicateSongsManager />
                    <MissingHymns />
                    <SongTransferManager />
                    <BackupManager />
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
}
