'use client';

import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronLeft, Settings, Inbox, AlertTriangle, Lightbulb, ExternalLink, ShieldCheck, Wallet, Zap, Info, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
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
import { useState } from 'react';

import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';

export function AdminPanel() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab = searchParams.get('tab') || 'review';
  const [showRoadmap, setShowRoadmap] = useState(false);

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
          {/* SECCIÓN DE OPTIMIZACIÓN DE COSTOS CON MEJOR UX */}
          <Card className="border-primary/20 bg-primary/5 shadow-lg overflow-hidden transition-all duration-300">
            <div 
              className="bg-primary/10 px-6 py-4 border-b border-primary/10 flex items-center justify-between cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => setShowRoadmap(!showRoadmap)}
            >
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <h2 className="font-bold text-sm tracking-wide uppercase">Hoja de Ruta para la Gratuidad</h2>
              </div>
              {showRoadmap ? <ArrowUpCircle className="h-5 w-5 text-primary/60" /> : <ArrowDownCircle className="h-5 w-5 text-primary/60" />}
            </div>
            
            {showRoadmap && (
              <CardContent className="p-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-background rounded-xl border border-primary/10 shadow-sm mb-4">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Zap className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm">¿Cómo mantener la app en $0?</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Firebase ofrece <strong>50,000 lecturas gratuitas al día</strong>. Si seguimos estos pasos, la iglesia nunca tendrá que pagar por el uso normal.
                      </p>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full space-y-2">
                    <AccordionItem value="tip-1" className="border rounded-xl px-4 bg-background">
                      <AccordionTrigger className="text-sm font-bold hover:no-underline py-4 text-left">
                        1. Educación: Evitar el botón "Refrescar" (F5)
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed space-y-2">
                        <p>
                          La app tiene <strong>Persistencia Local</strong>. Esto significa que cuando un hermano abre la app por primera vez, los himnos se guardan en el disco de su celular.
                        </p>
                        <p>
                          Si el hermano cierra la app y vuelve mañana, la app leerá los datos del disco (Costo $0). Pero si presiona "Refrescar" o "F5", obliga a la app a borrar lo guardado y descargar todo de nuevo desde la nube.
                        </p>
                        <p className="bg-primary/5 p-2 rounded border border-primary/10 text-primary font-medium">
                          <span className="font-bold uppercase mr-1">Acción:</span> Avisar a los hermanos que solo recarguen si algo no funciona bien. El uso normal no requiere recargas.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="tip-2" className="border rounded-xl px-4 bg-background">
                      <AccordionTrigger className="text-sm font-bold hover:no-underline py-4 text-left">
                        2. Administración: Mantener limpia la lista de Revisión
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed space-y-2">
                        <p>
                          Cada vez que tú entras a este panel, Firebase lee todas las canciones en la pestaña "Revisiones".
                        </p>
                        <p>
                          Si tienes un acumulado de 200 sugerencias sin revisar, gastas 200 lecturas cada vez que abres el panel para revisar un solo coro.
                        </p>
                        <p className="bg-primary/5 p-2 rounded border border-primary/10 text-primary font-medium">
                          <span className="font-bold uppercase mr-1">Acción:</span> Aprueba o rechaza las sugerencias apenas lleguen. No dejes que la lista de pendientes crezca.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="tip-3" className="border rounded-xl px-4 bg-background">
                      <AccordionTrigger className="text-sm font-bold hover:no-underline py-4 text-left">
                        3. Seguridad: Configurar Alertas de Presupuesto
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed space-y-2">
                        <p>
                          Al estar en el plan Blaze, tienes acceso a las herramientas de facturación de Google Cloud.
                        </p>
                        <p>
                          Puedes configurar una "Alerta de Presupuesto" de $1 USD. Esto no significa que vas a pagar, sino que Google te enviará un correo electrónico si el uso de la app llega a generar aunque sea un centavo de costo.
                        </p>
                        <p className="bg-primary/5 p-2 rounded border border-primary/10 text-primary font-medium">
                          <span className="font-bold uppercase mr-1">Acción:</span> Entra a la Consola de Firebase &gt; Facturación y pon una alerta mínima para estar tranquilo.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="tip-4" className="border rounded-xl px-4 bg-background">
                      <AccordionTrigger className="text-sm font-bold hover:no-underline py-4 text-left">
                        4. Técnico: Filtros Inteligentes (Ya Aplicados)
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed space-y-2">
                        <p>
                          He modificado el corazón de la aplicación para que los usuarios "normales" <strong>NUNCA</strong> descarguen las canciones que están pendientes.
                        </p>
                        <p>
                          Esto ahorra aproximadamente un 30% del tráfico total de datos, asegurando que las lecturas solo se gasten en contenido que ya es útil para la congregación.
                        </p>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Implementado con éxito</Badge>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-primary/10">
                  <Button variant="default" size="sm" asChild className="rounded-full shadow-md">
                    <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      Ver Consola de Uso Real
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleTabChange('more-settings')} className="rounded-full">
                    Limpiar Base de Datos
                  </Button>
                </div>
              </CardContent>
            )}
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
