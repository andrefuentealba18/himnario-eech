"use client";

import { useAppearance, type ColorTheme, type DisplayMode, type BackgroundDesign } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Palette, Sun, Moon, Check, Layout, BookOpen, Music, Mic, Library } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const themes: { id: ColorTheme; name: string; color: string; hex: string }[] = [
  { id: 'blue', name: 'Azul Celestial', color: 'bg-blue-500', hex: '#3b82f6' },
  { id: 'purple', name: 'Púrpura Real', color: 'bg-purple-600', hex: '#9333ea' },
  { id: 'green', name: 'Verde Esperanza', color: 'bg-emerald-600', hex: '#059669' },
  { id: 'amber', name: 'Ámbar de Gloria', color: 'bg-amber-500', hex: '#f59e0b' },
  { id: 'rose', name: 'Rosa de Sarón', color: 'bg-rose-500', hex: '#f43f5e' },
];

const designs: { id: BackgroundDesign; name: string; icon: any }[] = [
  { id: 'aura', name: 'Aura Celestial', icon: Palette },
  { id: 'grid', name: 'Red de Gracia', icon: Layout },
  { id: 'clean', name: 'Minimalista', icon: Check },
];

export function AppearanceDialog() {
  const { colorTheme, setColorTheme, displayMode, setDisplayMode, design, setDesign } = useAppearance();
  
  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-all font-bold uppercase tracking-tighter text-[10px] active:scale-95"
        >
          <Palette className="h-4 w-4 text-primary" />
          <span>Apariencia</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-0 max-h-[95vh] outline-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Personalizar Apariencia</DialogTitle>
          <DialogDescription>
            Ajusta los colores y el diseño de la pantalla de inicio del himnario.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gradient-to-b from-primary/10 to-background flex flex-col h-full overflow-hidden">
          
          {/* VISTA PREVIA QUE SIMULA EL INICIO (HOME) */}
          <div className="p-6 pb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-center mb-4">Vista Previa del Inicio</p>
            <div className={cn(
              "relative w-full aspect-[10/12] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-white/10 transition-all duration-500 mx-auto max-w-[240px]",
              displayMode === 'dark' ? "bg-slate-950" : "bg-slate-50",
              design === 'grid' && "design-grid"
            )}>
              {/* Fondo del Simulador */}
              {design === 'aura' && (
                <div className="absolute inset-0 -z-10 opacity-40">
                  <div className="absolute top-0 left-0 w-full h-full bg-primary/20 blur-3xl animate-pulse" />
                </div>
              )}

              {/* Contenido del Inicio Simulado */}
              <div className="absolute inset-0 flex flex-col items-center p-4 gap-4 overflow-hidden scale-90 sm:scale-100">
                {/* Logo */}
                <div className="relative p-0.5 bg-gradient-to-tr from-primary to-primary/40 rounded-full shadow-lg mt-2">
                  <div className="bg-white dark:bg-slate-900 rounded-full p-0.5 overflow-hidden w-12 h-12 flex items-center justify-center">
                    <Image src={insigniaUrl} alt="Logo" width={48} height={48} className="rounded-full object-cover" />
                  </div>
                </div>

                {/* Título */}
                <div className="text-center space-y-0.5">
                  <h4 className="text-sm font-bold font-headline leading-tight text-foreground">
                    Himnario <span className="text-primary">EECH</span>
                  </h4>
                  <p className="text-[6px] text-muted-foreground font-bold tracking-widest uppercase">Ejército Evangélico</p>
                </div>

                {/* Botón de Búsqueda Falso */}
                <div className="w-full h-6 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center px-2 gap-2">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  <div className="h-1.5 w-16 bg-muted-foreground/20 rounded-full" />
                </div>

                {/* Grid de Navegación Falso */}
                <div className="grid grid-cols-2 gap-2 w-full flex-1">
                  {[BookOpen, Music, Mic, Library].map((Icon, i) => (
                    <div key={i} className="rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center p-2 gap-1 shadow-sm">
                      <div className="p-1.5 rounded-lg bg-white dark:bg-slate-900 shadow-inner">
                        <Icon className="h-3 w-3 text-primary" />
                      </div>
                      <div className="h-1 w-8 bg-foreground/10 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6 h-[350px]">
            <div className="space-y-8 pb-10">
              {/* MODO DE PANTALLA */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Modo de Pantalla</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setDisplayMode('light')}
                    className={cn(
                      "flex items-center justify-center gap-2 h-12 rounded-2xl border-2 transition-all duration-300 font-bold text-xs active:scale-95",
                      displayMode === 'light' 
                        ? "bg-white border-primary text-primary shadow-lg" 
                        : "bg-muted/50 border-transparent text-muted-foreground opacity-60"
                    )}
                  >
                    <Sun className="h-4 w-4" /> Día
                  </button>
                  <button 
                    onClick={() => setDisplayMode('dark')}
                    className={cn(
                      "flex items-center justify-center gap-2 h-12 rounded-2xl border-2 transition-all duration-300 font-bold text-xs active:scale-95",
                      displayMode === 'dark' 
                        ? "bg-slate-900 border-primary text-primary shadow-lg" 
                        : "bg-muted/50 border-transparent text-muted-foreground opacity-60"
                    )}
                  >
                    <Moon className="h-4 w-4" /> Noche
                  </button>
                </div>
              </div>

              {/* COLOR DE IDENTIDAD */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Color del Himnario</p>
                <div className="grid grid-cols-5 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setColorTheme(t.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center aspect-square rounded-2xl transition-all duration-300 border-2 active:scale-90",
                        colorTheme === t.id 
                          ? "border-primary bg-white dark:bg-white/10 shadow-md scale-110 z-10" 
                          : "border-transparent bg-muted/30 grayscale-[0.5] hover:grayscale-0"
                      )}
                    >
                      <div className={cn("h-6 w-6 rounded-full shadow-inner", t.color)} />
                      {colorTheme === t.id && (
                        <div className="absolute -top-1 -right-1 bg-primary text-white p-0.5 rounded-full ring-2 ring-background">
                          <Check className="h-2 w-2" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* DISEÑOS DE FONDO */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Ambiente de Fondo</p>
                <div className="space-y-2">
                  {designs.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDesign(d.id)}
                      className={cn(
                        "flex items-center justify-between w-full p-3.5 rounded-2xl border-2 transition-all duration-300 active:scale-[0.98]",
                        design === d.id 
                          ? "border-primary bg-white dark:bg-white/10 shadow-md" 
                          : "border-transparent bg-muted/30 hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg transition-colors", design === d.id ? "bg-primary text-white" : "bg-primary/10 text-primary")}>
                          <d.icon className="h-4 w-4" />
                        </div>
                        <span className={cn("text-xs font-bold", design === d.id ? "text-foreground" : "text-foreground/60")}>
                          {d.name}
                        </span>
                      </div>
                      {design === d.id && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 pt-2 bg-background/80 backdrop-blur-md border-t border-slate-200 dark:border-white/10">
            <p className="text-[9px] text-center text-primary/60 font-black leading-relaxed uppercase tracking-widest">
              Configuración Guardada en el Dispositivo
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
