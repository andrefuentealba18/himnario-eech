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
import { Palette, Sun, Moon, Check, Sparkles, Layout, Wind, SunMedium, Heart } from 'lucide-react';
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
}

const atmospheres: Atmosphere[] = [
  { id: 'peace', name: 'Océano de Paz', desc: 'Aura celestial y calma infinita', color: 'blue', design: 'aura', icon: Wind, previewColor: 'bg-blue-500' },
  { id: 'zion', name: 'Monte de Sión', desc: 'Elegancia técnica y red de gracia', color: 'purple', design: 'grid', icon: Layout, previewColor: 'bg-purple-600' },
  { id: 'glory', name: 'Luz del Mundo', desc: 'Resplandor dorado y presencia', color: 'amber', design: 'aura', icon: SunMedium, previewColor: 'bg-amber-500' },
  { id: 'life', name: 'Valle de Bendición', desc: 'Minimalismo y esperanza viva', color: 'green', design: 'clean', icon: Sparkles, previewColor: 'bg-emerald-600' },
  { id: 'love', name: 'Rosa de Sarón', desc: 'Dulzura eterna y orden divino', color: 'rose', design: 'grid', icon: Heart, previewColor: 'bg-rose-500' },
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
      <DialogContent className="sm:max-w-2xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-0 max-h-[95vh] outline-none flex flex-col md:flex-row bg-background">
        <DialogHeader className="sr-only">
          <DialogTitle>Personalizar Experiencia Visual</DialogTitle>
          <DialogDescription>Selecciona una de nuestras atmósferas diseñadas para tu meditación.</DialogDescription>
        </DialogHeader>

        {/* LADO IZQUIERDO: VISTA PREVIA (Mini Home) */}
        <div className="md:w-80 bg-muted/20 p-6 flex flex-col items-center justify-center border-r border-border/50 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-primary/20 blur-[80px]" />
          </div>
          
          <div className="space-y-1 mb-6 text-center relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Vista Previa</p>
            <h4 className="text-sm font-bold text-primary">{currentAtmosphere.name}</h4>
          </div>
          
          <div className={cn(
            "relative w-full aspect-[9/16] rounded-[2rem] overflow-hidden shadow-2xl border-[4px] border-white dark:border-white/10 transition-all duration-700 card-glow",
            displayMode === 'dark' ? "bg-slate-950" : "bg-slate-50",
            design === 'grid' && "design-grid"
          )}>
            {/* Fondo Dinámico Simulado */}
            {design === 'aura' && (
              <div className="absolute inset-0 opacity-40">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/30 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }} />
              </div>
            )}

            {/* Contenido Home Simulado */}
            <div className="absolute inset-0 flex flex-col items-center p-4 pt-8 gap-4 overflow-hidden">
              <div className="relative p-0.5 bg-gradient-to-tr from-primary to-primary/40 rounded-full shadow-lg">
                <div className="bg-white dark:bg-slate-900 rounded-full p-0.5 overflow-hidden w-12 h-12 flex items-center justify-center">
                  <Image src={insigniaUrl} alt="Logo" width={48} height={48} className="rounded-full object-cover" />
                </div>
              </div>

              <div className="text-center space-y-0.5">
                <h4 className="text-[10px] font-bold font-headline leading-tight text-foreground text-glow">
                  Himnario <span className="text-primary">EECH</span>
                </h4>
                <p className="text-[5px] text-muted-foreground font-black tracking-widest uppercase">Ejército Evangélico</p>
              </div>

              <div className="w-full h-6 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center px-3 gap-2">
                <div className="h-1 w-12 bg-muted-foreground/10 rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-2 w-full mt-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center p-3 gap-2 shadow-sm">
                    <div className="h-1 w-8 bg-primary/20 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: CONTROLES */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 h-[450px] md:h-[600px]">
            <div className="p-8 space-y-10">
              {/* MODO DE PANTALLA */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Ambiente Lumínico</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setDisplayMode('light')}
                    className={cn(
                      "flex items-center justify-center gap-3 h-14 rounded-[1.5rem] border-2 transition-all duration-300 font-bold text-sm active:scale-95",
                      displayMode === 'light' 
                        ? "bg-white border-primary text-primary shadow-xl shadow-primary/10" 
                        : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted opacity-70"
                    )}
                  >
                    <Sun className="h-5 w-5" /> Día
                  </button>
                  <button 
                    onClick={() => setDisplayMode('dark')}
                    className={cn(
                      "flex items-center justify-center gap-3 h-14 rounded-[1.5rem] border-2 transition-all duration-300 font-bold text-sm active:scale-95",
                      displayMode === 'dark' 
                        ? "bg-slate-900 border-primary text-primary shadow-xl shadow-primary/10" 
                        : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted opacity-70"
                    )}
                  >
                    <Moon className="h-5 w-5" /> Noche
                  </button>
                </div>
              </div>

              {/* ATMÓSFERAS */}
              <div className="space-y-4 pb-8">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-4 bg-primary rounded-full" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Visiones del Himnario</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {atmospheres.map((atm) => {
                    const isSelected = colorTheme === atm.color && design === atm.design;
                    return (
                      <button
                        key={atm.id}
                        onClick={() => setAtmosphere(atm.color, atm.design)}
                        className={cn(
                          "flex items-center gap-4 w-full p-5 rounded-[1.75rem] border-2 transition-all duration-500 active:scale-[0.98] text-left group relative overflow-hidden",
                          isSelected 
                            ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" 
                            : "border-transparent bg-muted/30 hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "p-3 rounded-2xl transition-all duration-500 shadow-inner",
                          isSelected ? "bg-primary text-white scale-110 rotate-3" : "bg-primary/10 text-primary group-hover:scale-105"
                        )}>
                          <atm.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <p className={cn("text-sm font-bold tracking-tight", isSelected ? "text-primary" : "text-foreground")}>{atm.name}</p>
                          <p className="text-[10px] text-muted-foreground font-medium leading-tight">{atm.desc}</p>
                        </div>
                        {isSelected ? (
                          <div className="h-7 w-7 bg-primary text-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50">
                            <Check className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className={cn("h-3 w-3 rounded-full opacity-40", atm.previewColor)} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 bg-background border-t border-border/50 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-primary/60">
              <Sparkles className="h-3 w-3" />
              <p className="text-[9px] font-black uppercase tracking-[0.2em]">Diseño Patentado</p>
            </div>
            <p className="text-[8px] text-muted-foreground text-center max-w-[220px] leading-relaxed">
              Los cambios se aplican inmediatamente y quedarán guardados por determinación en este dispositivo.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
