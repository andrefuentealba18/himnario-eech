
"use client";

import { useState, useEffect } from "react";
import { Download, Smartphone, Share, PlusSquare, Monitor, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Escuchar el evento de instalación de Android/Chrome
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    window.addEventListener("appinstalled", () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Mostrar el prompt nativo de instalación
    deferredPrompt.prompt();
    
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]">
          <Download className="mr-2 h-4 w-4" />
          Descargar App
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            Instalar App Oficial
          </DialogTitle>
          <DialogDescription>
            Lleva el himnario en tu celular como una aplicación normal, sin usar el navegador.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {isInstallable ? (
            <div className="flex flex-col items-center gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10 shadow-inner">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-md">
                <Download className="h-10 w-10 text-primary animate-bounce" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold">¡Compatible con descarga directa!</p>
                <p className="text-xs text-muted-foreground">Toca el botón de abajo para instalar el himnario en tu dispositivo.</p>
              </div>
              <Button onClick={handleInstallClick} className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 rounded-xl">
                Instalar Ahora
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-xl border border-dashed border-muted-foreground/20">
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-3 tracking-widest text-center">Guía de instalación manual</p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-background rounded-lg shadow-sm border">
                    <div className="bg-primary h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white">1</div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold">Android (Chrome)</p>
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        Toca los <span className="font-bold">tres puntos (⋮)</span> arriba a la derecha y elige <span className="text-primary font-bold">"Instalar aplicación"</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-background rounded-lg shadow-sm border">
                    <div className="bg-primary h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white">2</div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold">iPhone / iPad (Safari)</p>
                      <p className="text-[11px] text-muted-foreground leading-tight flex items-center flex-wrap gap-1">
                        Toca compartir <Share className="h-3 w-3" /> abajo y busca <span className="text-primary font-bold">"Agregar a inicio"</span> <PlusSquare className="h-3 w-3" />.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-background rounded-lg shadow-sm border">
                    <div className="bg-primary h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 text-white">3</div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold">Computadora</p>
                      <p className="text-[11px] text-muted-foreground leading-tight">
                        Busca el icono de <span className="font-bold">monitor</span> <Monitor className="inline h-3 w-3" /> en la barra de direcciones arriba.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/20">
            <p className="text-[10px] text-amber-700 dark:text-amber-400 text-center leading-relaxed">
              <strong>Nota:</strong> Una vez instalada, el logo de la Iglesia aparecerá junto a tus otras aplicaciones y el himnario se abrirá sin barras de navegación.
            </p>
          </div>

          <Separator className="opacity-50" />

          <div className="flex flex-col items-center justify-center gap-2 opacity-60">
            <div className="flex items-center gap-1.5 text-primary">
              <ShieldCheck className="h-3 w-3" />
              <span className="text-[9px] font-black uppercase tracking-tighter">Software Protegido</span>
            </div>
            <p className="text-[8px] font-bold text-center leading-tight uppercase tracking-[0.1em] text-slate-500 max-w-[200px]">
              PATENTADO POR PABLO FB, TODOS LOS DERECHOS RESERVADOS
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
