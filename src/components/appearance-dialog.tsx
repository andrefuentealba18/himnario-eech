"use client";

import { useAppearance, type ColorTheme, type BackgroundDesign } from '@/hooks/use-appearance';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Palette, Sun, Moon, Check, Sparkles, Layout, Wind, SunMedium, Heart, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface Atmosphere {
  id: string;
  name: string;
  desc: string;
  color: ColorTheme;
  design: BackgroundDesign;
  icon: any;
  previewColor: string;
  styleName: string;
}

const atmospheres: Atmosphere[] = [
  { id: 'peace', name: 'Océano de Paz', desc: 'Diseño fluido y calma infinita', color: 'blue', design: 'aura', icon: Wind, previewColor: 'bg-blue-500', styleName: 'Orgánico' },
  { id: 'zion', name: 'Monte de Sión', desc: 'Cuadrícula técnica y orden divino', color: 'purple', design: 'grid', icon: Layout, previewColor: 'bg-purple-600', styleName: 'Técnico' },
  { id: 'glory', name: 'Luz del Mundo', desc: 'Resplandor áureo y presencia', color: 'amber', design: 'aura', icon: SunMedium, previewColor: 'bg-amber-500', styleName: 'Majestuoso' },
  { id: 'life', name: 'Valle de Bendición', desc: 'Minimalismo y esperanza viva', color: 'green', design: 'clean', icon: Sparkles, previewColor: 'bg-emerald-600', styleName: 'Limpio' },
  { id: 'love', name: 'Rosa de Sarón', desc: 'Dulzura eterna y curvas suaves', color: 'rose', design: 'grid', icon: Heart, previewColor: 'bg-rose-500', styleName: 'Elegante' },
];

export function AppearanceDialog() {
  const { colorTheme, design, setAtmosphere, displayMode, setDisplayMode } = useAppearance();
  
  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

  const currentAtmosphere = atmospheres.find(a => a.color === colorTheme && a.design === design) || atmospheres[0];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-all font-bold uppercase tracking-tighter text-[10px] active:scale-95 group"
        >
          <Palette className="h-4 w-4 text-primary group-hover:rotate-12 transition-transform" />
          <span>Apariencia</span>
        </button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-2xl border-none shadow-2xl rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden p-0 max-h-[90vh] outline-none flex flex-col md:flex-row bg-background">
        <DialogHeader className="sr-only">
          <DialogTitle>Personalizar Experiencia Visual</DialogTitle>
          <DialogDescription>Selecciona una de nuestras atmósferas diseñadas para tu meditación.</DialogDescription>
        </DialogHeader>

        {/* LADO IZQUIERDO: VISTA PREVIA (Oculta en móviles pequeños para ganar espacio) */}
        <div className="hidden md:flex md:w-72 bg-muted/20 p-6 flex-col items-center justify-center border-r border-border/50 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-primary/20 blur-[80px]" />
          </div>
          
          <div className="space-y-1 mb-6 text-center relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Estilo: {currentAtmosphere.styleName}</p>
            <h4 className="text-sm font-bold text-primary">{currentAtmosphere.name}</h4>
          </div>
          
          <div className={cn(
            "relative w-full aspect-[9/16] overflow-hidden shadow-2xl border-[4px] border-white dark:border-white/10 transition-all duration-700 card-glow",
            displayMode === 'dark' ? "bg-slate-950" : "bg-slate-50",
            design === 'grid' && "design-grid"
          )} style={{ borderRadius: 'calc(var(--ui-radius) * 1.5)' }}>
            <div className="absolute inset-0 flex flex-col items-center p-4 pt-8 gap-4 overflow-hidden">
              <div className="relative p-0.5 bg-gradient-to-tr from-primary to-primary/40 rounded-full shadow-lg">
                <div className="bg-white dark:bg-slate-900 rounded-full p-0.5 overflow-hidden w-10 h-10 flex items-center justify-center">
                  <Image src={insigniaUrl} alt="Logo" width={40} height={40} className="rounded-full object-cover" />
                </div>
              </div>
              <h4 className="text-[9px] font-bold font-headline text-foreground">Himnario EECH</h4>
              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/20 h-8 rounded-lg shadow-sm" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: CONTROLES (Scrollable para móviles) */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-4 md:p-6 border-b border-border/50 flex items-center justify-between md:hidden">
            <h3 className="font-bold text-sm">Personalizar Diseño</h3>
            <div className="flex items-center gap-2">
              <div className={cn("w-3 h-3 rounded-full animate-pulse", currentAtmosphere.previewColor)} />
              <span className="text-[10px] font-bold uppercase text-muted-foreground">{currentAtmosphere.name}</span>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6 md:p-8 space-y-8">
              {/* MODO DE PANTALLA */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Ambiente Lumínico</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setDisplayMode('light')}
                    className={cn(
                      "flex items-center justify-center gap-2 h-12 border-2 transition-all duration-300 font-bold text-xs active:scale-95",
                      displayMode === 'light' 
                        ? "bg-white border-primary text-primary shadow-lg shadow-primary/10" 
                        : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
                    )}
                    style={{ borderRadius: 'var(--ui-radius)' }}
                  >
                    <Sun className="h-4 w-4" /> Día
                  </button>
                  <button 
                    onClick={() => setDisplayMode('dark')}
                    className={cn(
                      "flex items-center justify-center gap-2 h-12 border-2 transition-all duration-300 font-bold text-xs active:scale-95",
                      displayMode === 'dark' 
                        ? "bg-slate-900 border-primary text-primary shadow-lg shadow-primary/10" 
                        : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
                    )}
                    style={{ borderRadius: 'var(--ui-radius)' }}
                  >
                    <Moon className="h-4 w-4" /> Noche
                  </button>
                </div>
              </div>

              {/* ATMÓSFERAS */}
              <div className="space-y-4 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Visiones del Himnario</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {atmospheres.map((atm) => {
                    const isSelected = colorTheme === atm.color && design === atm.design;
                    return (
                      <button
                        key={atm.id}
                        onClick={() => setAtmosphere(atm.color, atm.design)}
                        className={cn(
                          "flex items-center gap-4 w-full p-4 border-2 transition-all duration-500 active:scale-[0.98] text-left group relative overflow-hidden",
                          isSelected 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-transparent bg-muted/30 hover:bg-muted/50"
                        )}
                        style={{ borderRadius: 'var(--ui-radius)' }}
                      >
                        <div className={cn(
                          "p-2.5 transition-all duration-500",
                          isSelected ? "bg-primary text-white scale-110" : "bg-primary/10 text-primary group-hover:scale-105"
                        )} style={{ borderRadius: 'calc(var(--ui-radius) * 0.8)' }}>
                          <atm.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-xs font-bold tracking-tight truncate", isSelected ? "text-primary" : "text-foreground")}>{atm.name}</p>
                          <p className="text-[9px] text-muted-foreground font-medium leading-tight truncate">{atm.desc}</p>
                        </div>
                        {isSelected && (
                          <div className="h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 bg-muted/10 border-t border-border/50 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary/60">
              <Sparkles className="h-3 w-3" />
              <p className="text-[8px] font-black uppercase tracking-[0.2em]">Diseño Exclusivo EECH</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
