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
      <DialogContent className="w-[95vw] sm:max-w-3xl border border-white/20 dark:border-slate-800 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden p-0 max-h-[90vh] outline-none flex flex-col md:flex-row bg-white/95 dark:bg-slate-950/95 backdrop-blur-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Personalizar Experiencia Visual</DialogTitle>
          <DialogDescription>Selecciona una de nuestras atmósferas diseñadas para tu meditación.</DialogDescription>
        </DialogHeader>

        {/* LADO IZQUIERDO: VISTA PREVIA */}
        <div className="hidden md:flex md:w-80 bg-slate-100/50 dark:bg-black/20 p-8 flex-col items-center justify-center border-r border-white/10 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
             <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/40 rounded-full blur-[100px] animate-pulse" />
             <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
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
            <div className="p-6 md:p-10 space-y-10">
              {/* MODO DE PANTALLA */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Ambiente Lumínico</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setDisplayMode('light')}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-4 h-32 rounded-[2rem] border-2 transition-all duration-500 font-black text-sm uppercase tracking-widest overflow-hidden group active:scale-95",
                      displayMode === 'light' 
                        ? "bg-gradient-to-br from-white to-amber-50 dark:from-slate-800 dark:to-slate-900 border-amber-400 text-amber-500 shadow-[0_15px_30px_-10px_rgba(251,191,36,0.3)] scale-[1.02]" 
                        : "bg-slate-50/50 dark:bg-white/5 border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-amber-100/30 dark:to-amber-900/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Sun className={cn("h-10 w-10 transition-transform duration-700", displayMode === 'light' ? "rotate-45" : "group-hover:rotate-45")} /> 
                    <span>Día</span>
                  </button>
                  <button 
                    onClick={() => setDisplayMode('dark')}
                    className={cn(
                      "relative flex flex-col items-center justify-center gap-4 h-32 rounded-[2rem] border-2 transition-all duration-500 font-black text-sm uppercase tracking-widest overflow-hidden group active:scale-95",
                      displayMode === 'dark' 
                        ? "bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500 text-indigo-400 shadow-[0_15px_30px_-10px_rgba(99,102,241,0.3)] scale-[1.02]" 
                        : "bg-slate-50/50 dark:bg-white/5 border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Moon className={cn("h-10 w-10 transition-transform duration-700", displayMode === 'dark' ? "-rotate-12" : "group-hover:-rotate-12")} /> 
                    <span>Noche</span>
                  </button>
                </div>
              </div>

              {/* ATMÓSFERAS */}
              <div className="space-y-5 pb-8">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Visiones del Himnario</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {atmospheres.map((atm) => {
                    const isSelected = colorTheme === atm.color && design === atm.design;
                    return (
                      <button
                        key={atm.id}
                        onClick={() => setAtmosphere(atm.color, atm.design)}
                        className={cn(
                          "group relative flex items-center gap-5 w-full p-5 transition-all duration-500 overflow-hidden active:scale-[0.98]",
                          isSelected 
                            ? "rounded-[2rem] border-2 border-primary bg-white dark:bg-slate-900 shadow-2xl shadow-primary/20 scale-[1.02] z-10" 
                            : "rounded-[1.5rem] border-2 border-transparent bg-slate-50/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:rounded-[2rem]"
                        )}
                      >
                        {/* Background glow when selected */}
                        {isSelected && (
                          <div className={cn("absolute inset-y-0 left-0 w-1/2 opacity-10 bg-gradient-to-r pointer-events-none", 
                            atm.color === 'blue' ? 'from-blue-500' :
                            atm.color === 'purple' ? 'from-purple-500' :
                            atm.color === 'amber' ? 'from-amber-500' :
                            atm.color === 'green' ? 'from-emerald-500' : 'from-rose-500',
                            "to-transparent"
                          )} />
                        )}
                        
                        <div className={cn(
                          "relative z-10 p-4 transition-all duration-700 rounded-2xl shadow-inner shrink-0",
                          isSelected ? "bg-primary text-white rotate-0" : "bg-white dark:bg-slate-800 text-slate-400 group-hover:rotate-12 group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          <atm.icon className="h-7 w-7" />
                        </div>
                        
                        <div className="relative z-10 flex-1 text-left min-w-0 py-1">
                          <p className={cn("text-lg font-black tracking-tighter truncate transition-colors", isSelected ? "text-primary" : "text-foreground")}>{atm.name}</p>
                          <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-1 truncate">{atm.desc}</p>
                        </div>
                        
                        <div className={cn(
                           "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-500 shrink-0",
                           isSelected ? "bg-primary border-primary text-white scale-100" : "border-slate-200 dark:border-slate-700 scale-0 opacity-0 bg-transparent text-transparent group-hover:scale-50 group-hover:opacity-50"
                        )}>
                          <Check className="h-4 w-4" />
                        </div>
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
