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
import { Palette, Sun, Moon, Check, Layout, BookOpen, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-3 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-all font-bold uppercase tracking-tighter text-[9px]"
        >
          <Palette className="mr-1.5 h-3.5 w-3.5 text-primary" />
          Personalizar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-0 max-h-[90vh]">
        <div className="bg-gradient-to-b from-primary/10 to-background flex flex-col h-full">
          
          {/* VISTA PREVIA DINÁMICA */}
          <div className="p-6 pb-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-center mb-4">Vista Previa del Diseño</p>
            <div className={cn(
              "relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10 transition-all duration-500",
              displayMode === 'dark' ? "bg-slate-950" : "bg-slate-50",
              design === 'grid' && "design-grid"
            )}>
              {/* Elementos Simulados */}
              <div className="absolute inset-0 flex flex-col p-4 gap-3">
                <div className="flex items-center justify-between">
                  <div className="h-2 w-16 bg-muted rounded-full opacity-50" />
                  <div className="h-4 w-4 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                </div>
                <div className="space-y-2 mt-2">
                  <div className="h-4 w-3/4 bg-foreground/10 rounded-lg" />
                  <div className="h-3 w-1/2 bg-foreground/5 rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <div className="h-12 rounded-xl bg-white/20 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="h-12 rounded-xl bg-white/20 dark:bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Music className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
              {/* Aura Simulada */}
              {design === 'aura' && (
                <div className="absolute inset-0 -z-10 opacity-30">
                  <div className="absolute top-0 left-0 w-full h-full bg-primary/20 blur-3xl animate-pulse" />
                </div>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1 p-6 h-[400px]">
            <div className="space-y-8 pb-10">
              {/* SECCIÓN DE MODO PANTALLA */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Modo de Pantalla</p>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setDisplayMode('light')}
                    className={cn(
                      "flex items-center justify-center gap-2 h-12 rounded-2xl border-2 transition-all duration-300 font-bold text-xs",
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
                      "flex items-center justify-center gap-2 h-12 rounded-2xl border-2 transition-all duration-300 font-bold text-xs",
                      displayMode === 'dark' 
                        ? "bg-slate-900 border-primary text-primary shadow-lg" 
                        : "bg-muted/50 border-transparent text-muted-foreground opacity-60"
                    )}
                  >
                    <Moon className="h-4 w-4" /> Noche
                  </button>
                </div>
              </div>

              {/* SECCIÓN DE COLORES */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Color de Identidad</p>
                <div className="grid grid-cols-5 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setColorTheme(t.id)}
                      className={cn(
                        "relative flex flex-col items-center justify-center aspect-square rounded-2xl transition-all duration-300 border-2",
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

              {/* SECCIÓN DE DISEÑOS DE FONDO */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Estilo de Fondo</p>
                <div className="space-y-2">
                  {designs.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDesign(d.id)}
                      className={cn(
                        "flex items-center justify-between w-full p-3.5 rounded-2xl border-2 transition-all duration-300",
                        design === d.id 
                          ? "border-primary bg-white dark:bg-white/10 shadow-md" 
                          : "border-transparent bg-muted/30 hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <d.icon className="h-4 w-4 text-primary" />
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

          <div className="p-6 pt-2 bg-background border-t">
            <p className="text-[9px] text-center text-primary/60 font-black leading-relaxed uppercase tracking-widest">
              Configuración de Identidad Guardada
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}