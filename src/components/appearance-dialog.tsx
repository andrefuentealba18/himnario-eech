"use client";

import { useAppearance, type ColorTheme, type DisplayMode } from '@/hooks/use-appearance';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Palette, Sun, Moon, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const themes: { id: ColorTheme; name: string; color: string }[] = [
  { id: 'blue', name: 'Azul Celestial', color: 'bg-blue-500' },
  { id: 'purple', name: 'Púrpura Real', color: 'bg-purple-600' },
  { id: 'green', name: 'Verde Esperanza', color: 'bg-emerald-600' },
  { id: 'amber', name: 'Ámbar de Gloria', color: 'bg-amber-500' },
  { id: 'rose', name: 'Rosa de Sarón', color: 'bg-rose-500' },
];

export function AppearanceDialog() {
  const { colorTheme, setColorTheme, displayMode, setDisplayMode } = useAppearance();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-3 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-slate-200/50 dark:border-white/10 shadow-sm text-slate-600 dark:text-slate-300 hover:text-primary transition-all font-bold uppercase tracking-tighter text-[9px]"
        >
          <Palette className="mr-1.5 h-3.5 w-3.5 text-primary" />
          Apariencia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md border-none shadow-2xl rounded-3xl overflow-hidden p-0">
        <div className="bg-gradient-to-b from-primary/10 to-background p-6 space-y-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl font-headline font-bold text-center">Personalizar Estilo</DialogTitle>
            <DialogDescription className="text-center text-xs opacity-70">
              Elige el ambiente ideal para tu momento de adoración.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 pb-4">
            {/* SECCIÓN DE MODO CLARO/OSCURO */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-center">Modo de Pantalla</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setDisplayMode('light')}
                  className={cn(
                    "flex items-center justify-center gap-2 h-12 rounded-2xl border-2 transition-all duration-300 font-bold text-sm",
                    displayMode === 'light' 
                      ? "bg-white border-primary text-primary shadow-lg scale-105" 
                      : "bg-muted/50 border-transparent text-muted-foreground opacity-60 hover:opacity-100"
                  )}
                >
                  <Sun className="h-4 w-4" />
                  Día
                </button>
                <button 
                  onClick={() => setDisplayMode('dark')}
                  className={cn(
                    "flex items-center justify-center gap-2 h-12 rounded-2xl border-2 transition-all duration-300 font-bold text-sm",
                    displayMode === 'dark' 
                      ? "bg-slate-900 border-primary text-primary shadow-lg scale-105" 
                      : "bg-muted/50 border-transparent text-muted-foreground opacity-60 hover:opacity-100"
                  )}
                >
                  <Moon className="h-4 w-4" />
                  Noche
                </button>
              </div>
            </div>

            {/* SECCIÓN DE COLORES */}
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 text-center">Color del Tema</p>
              <div className="grid grid-cols-1 gap-2.5">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setColorTheme(t.id)}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all duration-300",
                      colorTheme === t.id 
                        ? "border-primary bg-white dark:bg-white/5 shadow-md scale-[1.02]" 
                        : "border-transparent bg-muted/30 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("h-5 w-5 rounded-full shadow-inner ring-2 ring-offset-2 ring-transparent transition-all", t.color, colorTheme === t.id && "ring-primary/30")} />
                      <span className={cn("text-xs font-bold transition-colors", colorTheme === t.id ? "text-foreground" : "text-foreground/60")}>
                        {t.name}
                      </span>
                    </div>
                    {colorTheme === t.id && (
                      <div className="bg-primary/10 p-1 rounded-full animate-in zoom-in-50 duration-300">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
            <p className="text-[9px] text-center text-primary/60 font-bold leading-relaxed uppercase tracking-wider">
              Ajustes guardados por determinación en este dispositivo
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
