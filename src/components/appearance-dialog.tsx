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
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]">
          <Palette className="mr-2 h-4 w-4" />
          Apariencia
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Personalizar Apariencia</DialogTitle>
          <DialogDescription>
            Elige el estilo que más te guste para tu himnario.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* SECCIÓN DE MODO CLARO/OSCURO */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Modo de Pantalla</p>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant={displayMode === 'light' ? 'default' : 'outline'}
                className="h-12 flex items-center justify-center gap-2 rounded-xl"
                onClick={() => setDisplayMode('light')}
              >
                <Sun className="h-4 w-4" />
                Día
              </Button>
              <Button 
                variant={displayMode === 'dark' ? 'default' : 'outline'}
                className="h-12 flex items-center justify-center gap-2 rounded-xl"
                onClick={() => setDisplayMode('dark')}
              >
                <Moon className="h-4 w-4" />
                Noche
              </Button>
            </div>
          </div>

          {/* SECCIÓN DE COLORES */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Color del Tema</p>
            <div className="grid grid-cols-1 gap-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setColorTheme(t.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-2xl border-2 transition-all duration-300",
                    colorTheme === t.id 
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02]" 
                      : "border-transparent hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("h-6 w-6 rounded-full shadow-inner", t.color)} />
                    <span className="text-sm font-bold text-foreground/80">{t.name}</span>
                  </div>
                  {colorTheme === t.id && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
          <p className="text-[9px] text-center text-primary/60 font-medium leading-relaxed">
            * Estos ajustes se guardan automáticamente en tu dispositivo para siempre.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
