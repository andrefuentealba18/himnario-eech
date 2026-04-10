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
import { Palette, Sun, Moon, Check, Layout, BookOpen, Music, Mic, Library, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const themes: { id: ColorTheme; name: string; color: string; desc: string }[] = [
  { id: 'blue', name: 'Azul Infinito', color: 'bg-blue-500', desc: 'Paz y serenidad profunda' },
  { id: 'purple', name: 'Púrpura Real', color: 'bg-purple-600', desc: 'Majestad y soberanía' },
  { id: 'green', name: 'Esmeralda Vida', color: 'bg-emerald-600', desc: 'Esperanza y crecimiento' },
  { id: 'amber', name: 'Oro de Ofir', color: 'bg-amber-500', desc: 'Gloria y presencia divina' },
  { id: 'rose', name: 'Rosa de Sarón', color: 'bg-rose-500', desc: 'Amor y dulzura eterna' },
];

const designs: { id: BackgroundDesign; name: string; icon: any; desc: string }[] = [
  { id: 'aura', name: 'Aura Mística', icon: Sparkles, desc: 'Degradados fluidos espirituales' },
  { id: 'grid', name: 'Red de Gracia', icon: Layout, desc: 'Cuadrícula técnica elegante' },
  { id: 'clean', name: 'Luz Pura', icon: Check, desc: 'Minimalismo sin distracciones' },
];

export function AppearanceDialog() {
  const { colorTheme, setColorTheme, displayMode, setDisplayMode, design, setDesign } = useAppearance();
  
  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';

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
      <DialogContent className="sm:max-w-xl border-none shadow-2xl rounded-[2.5rem] overflow-hidden p-0 max-h-[95vh] outline-none flex flex-col md:flex-row bg-background">
        <DialogHeader className="sr-only">
          <DialogTitle>Personalizar Apariencia</DialogTitle>
          <DialogDescription>Ajusta la apariencia visual de tu Himnario.</DialogDescription>
        </DialogHeader>

        {/* LADO IZQUIERDO: VISTA PREVIA (Mini Home) */}
        <div className="md:w-72 bg-muted/30 p-6 flex flex-col items-center justify-center border-r border-border/50 relative overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-0 left-0 w-full h-full bg-primary/20 blur-[80px]" />
          </div>
          
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-center mb-6 relative z-10">Vista Previa Real</p>
          
          <div className={cn(
            "relative w-full aspect-[9/16] rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white dark:border-white/10 transition-all duration-500 card-glow",
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
              {/* Logo */}
              <div className="relative p-0.5 bg-gradient-to-tr from-primary to-primary/40 rounded-full shadow-lg">
                <div className="bg-white dark:bg-slate-900 rounded-full p-0.5 overflow-hidden w-14 h-14 flex items-center justify-center">
                  <Image src={insigniaUrl} alt="Logo" width={56} height={56} className="rounded-full object-cover" />
                </div>
              </div>

              {/* Título */}
              <div className="text-center space-y-0.5">
                <h4 className="text-sm font-bold font-headline leading-tight text-foreground text-glow">
                  Himnario <span className="text-primary">EECH</span>
                </h4>
                <p className="text-[6px] text-muted-foreground font-black tracking-widest uppercase">Ejército Evangélico</p>
              </div>

              {/* Buscador Falso */}
              <div className="w-full h-7 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center px-3 gap-2">
                <Palette className="h-2.5 w-2.5 text-muted-foreground/40" />
                <div className="h-1.5 w-20 bg-muted-foreground/10 rounded-full" />
              </div>

              {/* Grid de Navegación Falso */}
              <div className="grid grid-cols-2 gap-2 w-full mt-2">
                {[BookOpen, Music, Mic, Library].map((Icon, i) => (
                  <div key={i} className="rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center p-3 gap-2 shadow-sm">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 shadow-inner">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="h-1 w-10 bg-foreground/10 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: CONTROLES */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 h-[400px] md:h-[550px]">
            <div className="p-8 space-y-10">
              {/* MODO DE PANTALLA */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-4 bg-primary rounded-full" />
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

              {/* COLOR DE IDENTIDAD */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-4 bg-primary rounded-full" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Paleta Increíble</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setColorTheme(t.id)}
                      className={cn(
                        "flex items-center gap-4 w-full p-4 rounded-[1.5rem] border-2 transition-all duration-300 active:scale-[0.98] text-left group",
                        colorTheme === t.id 
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                          : "border-transparent bg-muted/30 hover:bg-muted/50"
                      )}
                    >
                      <div className={cn("h-10 w-10 rounded-full shadow-inner ring-4 ring-white dark:ring-slate-900 transition-transform group-hover:scale-110", t.color)} />
                      <div className="flex-1">
                        <p className={cn("text-sm font-bold", colorTheme === t.id ? "text-primary" : "text-foreground")}>{t.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{t.desc}</p>
                      </div>
                      {colorTheme === t.id && (
                        <div className="h-6 w-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* DISEÑOS DE FONDO */}
              <div className="space-y-4 pb-8">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-4 bg-primary rounded-full" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Estilo de Fondo</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {designs.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDesign(d.id)}
                      className={cn(
                        "flex items-center gap-4 w-full p-4 rounded-[1.5rem] border-2 transition-all duration-300 active:scale-[0.98] text-left",
                        design === d.id 
                          ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                          : "border-transparent bg-muted/30 hover:bg-muted/50"
                      )}
                    >
                      <div className={cn("p-2.5 rounded-2xl transition-all", design === d.id ? "bg-primary text-white scale-110" : "bg-primary/10 text-primary")}>
                        <d.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className={cn("text-sm font-bold", design === d.id ? "text-primary" : "text-foreground")}>{d.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium">{d.desc}</p>
                      </div>
                      {design === d.id && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 bg-background border-t border-border/50 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary/60">
              <Sparkles className="h-3 w-3" />
              <p className="text-[9px] font-black uppercase tracking-[0.2em]">Configuración Guardada</p>
            </div>
            <p className="text-[8px] text-muted-foreground text-center max-w-[200px]">Los cambios se aplican inmediatamente y quedarán guardados por determinación en este dispositivo.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}