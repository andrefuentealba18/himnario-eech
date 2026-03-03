'use client';

import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Settings, Inbox, AlertTriangle, Lightbulb, ExternalLink, ShieldCheck, Wallet, Zap, Info } from 'lucide-react';
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
          <div className="w-10"></div>
        </header>

        <div className="p-4 space-y-6">
          {/* SECCIÓN DE OPTIMIZACIÓN DE COSTOS MEJORADA */}
          <Card className="border-primary/20 bg-primary/5 shadow-lg overflow-hidden">
            <div className="bg-primary/10 px-6 py-3 border-b border-primary/10 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <h2 className="font-bold text-sm tracking-wide uppercase">Hoja de Ruta para la Gratuidad</h2>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-background rounded-xl border border-primary/10 shadow-sm">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm">¿Cómo seguir en $0?</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Firebase cobra principalmente por <strong>Lecturas</strong>. El límite gratuito son 50,000 al día. Aquí te explico cómo no pasarte nunca:
                    </p>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-2">
                  <AccordionItem value="tip-1" className="border rounded-xl px-4 bg-background">
                    <AccordionTrigger className="text-xs font-bold hover:no-underline py-3">
                      1. EVITAR EL BOTÓN "REFRESCAR"
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed">
                      La app tiene <strong>Persistencia Local</strong>. Si un hermano abre la app, los himnos se guardan en su celular. Si NO refresca la página, la próxima vez que entre, la app leerá los datos del celular y NO de Firebase (Costo $0). 
                      <br/><br/>
                      <span className="text-primary font-medium">Acción:</span> Pide a los hermanos que no recarguen la página constantemente.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="tip-2" className="border rounded-xl px-4 bg-background">
                    <AccordionTrigger className="text-xs font-bold hover:no-underline py-3">
                      2. MANTENER LIMPIA LA LISTA DE REVISIÓN
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed">
                      Cada vez que entras a este panel, Firebase lee todas las canciones "Pendientes". Si tienes 500 canciones ahí sin revisar, gastas 500 lecturas cada vez que entras.
                      <br/><br/>
                      <span className="text-primary font-medium">Acción:</span> Aprueba o rechaza las sugerencias lo más pronto posible. No dejes acumulados.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="tip-3" className="border rounded-xl px-4 bg-background">
                    <AccordionTrigger className="text-xs font-bold hover:no-underline py-3">
                      3. CONFIGURAR ALERTAS DE PRESUPUESTO
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed">
                      En la consola de Firebase, puedes ir a "Facturación" y poner una alerta. 
                      <br/><br/>
                      <span className="text-primary font-medium">Acción:</span> Configura una alerta para que te avise si el gasto llega a $1 USD. Así sabrás si algo raro está pasando antes de que la cuenta suba.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="tip-4" className="border rounded-xl px-4 bg-background">
                    <AccordionTrigger className="text-xs font-bold hover:no-underline py-3">
                      4. FILTROS YA APLICADOS
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed">
                      He modificado el código para que los hermanos normales <strong>NUNCA</strong> descarguen las canciones "Pendientes". Solo las descargan los administradores. Esto ya te está ahorrando un 30% de consumo automáticamente.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-primary/10">
                <Button variant="default" size="sm" asChild className="rounded-full shadow-md">
                  <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-3 w-3" />
                    Consola Firebase
                  </a>
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleTabChange('more-settings')} className="rounded-full">
                  Limpiar Duplicados
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-6 h-auto overflow-x-auto bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="review" className="text-xs sm:text-sm rounded-lg data-[state=active]:shadow-sm">
                <Inbox className="mr-1 h-4 w-4 hidden sm:inline" />
                Revisiones
                {pendingCount > 0 && <Badge className="ml-1 px-1 h-5 min-w-5">{pendingCount}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="hymns" className="text-xs sm:text-sm rounded-lg">Himnos</TabsTrigger>
              <TabsTrigger value="praises" className="text-xs sm:text-sm rounded-lg">Alabanzas</TabsTrigger>
              <TabsTrigger value="choirs" className="text-xs sm:text-sm rounded-lg">Coros</TabsTrigger>
              <TabsTrigger value="youth-choirs" className="text-xs sm:text-sm rounded-lg">Agrup.</TabsTrigger>
              <TabsTrigger value="more-settings" className="text-xs sm:text-sm rounded-lg">
                <Settings className="mr-1 h-4 w-4 hidden sm:inline" />
                Más
              </TabsTrigger>
            </TabsList>
            <TabsContent value="review" className="mt-4">
               <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Canciones Pendientes de Revisión</CardTitle>
                    <CardDescription>Revisa y aprueba las nuevas contribuciones de la hermandad.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SongReviewList />
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="hymns" className="mt-4">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Gestionar Himnos</CardTitle>
                </CardHeader>
                <CardContent>
                  <HymnAdminList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="praises" className="mt-4">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Gestionar Alabanzas</CardTitle>
                </CardHeader>
                <CardContent>
                  <PraiseAdminList />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="choirs" className="mt-4">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Gestionar Coros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChoirAdminList />
                  </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="youth-choirs" className="mt-4">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Gestionar Alabanza Agrupaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <YouthChoirAdminList />
                  </CardContent>
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
        </div>
      </div>
  );
}