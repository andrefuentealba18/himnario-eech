
"use client";

import { useState, useEffect } from 'react';
import type { YouthChoir, GroupType } from '@/lib/youth-choirs';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function parseSongs(text: string, group: GroupType): Omit<YouthChoir, 'id'>[] {
    const songs: Omit<YouthChoir, 'id'>[] = [];
    if (!text || text.trim() === '') {
        return songs;
    }

    const lines = text.split('\n');
    let currentSong: Omit<YouthChoir, 'id'> | null = null;
    let currentLyrics: string[] = [];
    
    const ignorePattern = /^ejerci(t|ot)o evangelico de chile( templo)? las torres\s*\d*$/i;
    let justIgnoredHeader = false;

    for (const line of lines) {
        const trimmedLine = line.trim();
        
        if (justIgnoredHeader) {
            if (/^\d+$/.test(trimmedLine)) {
                justIgnoredHeader = false;
                continue;
            }
            if (trimmedLine === '') {
                continue;
            }
            justIgnoredHeader = false;
        }

        if (ignorePattern.test(trimmedLine)) {
            justIgnoredHeader = true;
            continue;
        }

        const isAllUpper = trimmedLine.length > 0 && trimmedLine === trimmedLine.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(trimmedLine);

        if (isAllUpper) {
            if (currentSong) {
                currentSong.lyrics = currentLyrics.join('\n').trim();
                if (currentSong.title && currentSong.lyrics) {
                    songs.push(currentSong);
                }
            }

            currentSong = { title: trimmedLine, lyrics: '', group };
            currentLyrics = [];
        } else {
            if (currentSong) {
                currentLyrics.push(line);
            }
        }
    }

    if (currentSong) {
        currentSong.lyrics = currentLyrics.join('\n').trim();
        if (currentSong.title && currentSong.lyrics) {
            songs.push(currentSong);
        }
    }

    return songs;
}

interface AddYouthChoirsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onYouthChoirsAdded: (youthChoirs: Omit<YouthChoir, 'id'>[]) => void;
  initialGroup?: GroupType;
}

export function AddYouthChoirsDialog({ open, onOpenChange, onYouthChoirsAdded, initialGroup }: AddYouthChoirsDialogProps) {
  const [text, setText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [group, setGroup] = useState<GroupType>("Coro Juventud");
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setText('');
      setIsParsing(false);
      setGroup(initialGroup || "Coro Juventud");
    }
  }, [open, initialGroup]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!text.trim()) {
      toast({ variant: "destructive", title: "Campo vacío", description: "El texto de las alabanzas es requerido." });
      return;
    }

    setIsParsing(true);

    setTimeout(() => {
      const parsed = parseSongs(text, group);
      
      if (parsed.length > 0) {
          onYouthChoirsAdded(parsed);
      } else {
          toast({
              variant: "destructive",
              title: 'Formato Incorrecto',
              description: 'No se pudieron procesar las alabanzas. Asegúrate que el título de cada alabanza esté completamente en mayúsculas.',
          });
      }
      
      setIsParsing(false);
      onOpenChange(false);
    }, 10);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" onCloseAutoFocus={(e) => { e.preventDefault(); onOpenChange(false); }}>
        <DialogHeader>
          <DialogTitle>Agregar Varias Alabanzas</DialogTitle>
          <DialogDescription>
            Selecciona la agrupación y pega el texto de varias alabanzas. Cada una debe comenzar con su título escrito completamente en MAYÚSCULAS.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="group-select">Agrupación</Label>
                <Select value={group} onValueChange={(v) => setGroup(v as GroupType)} disabled={isParsing}>
                  <SelectTrigger id="group-select">
                    <SelectValue placeholder="Selecciona la agrupación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coro Juventud">Coro Juventud</SelectItem>
                    <SelectItem value="Grupo Ciclista">Grupo Ciclista</SelectItem>
                    <SelectItem value="Departamento Infantil">Departamento Infantil</SelectItem>
                    <SelectItem value="Clase Dorcas">Clase Dorcas</SelectItem>
                    <SelectItem value="Departamento Juvenil">Departamento Juvenil</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="youth-choir-bulk-text">Texto de las alabanzas</Label>
                <Textarea 
                  id="youth-choir-bulk-text"
                  placeholder="TÍTULO EN MAYÚSCULAS&#10;Letra de la alabanza...&#10;...&#10;&#10;OTRO TÍTULO EN MAYÚSCULAS&#10;Letra de la otra alabanza..." 
                  className="h-64 min-h-[10rem]" 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={isParsing}
                />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isParsing}>
                {isParsing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isParsing ? 'Procesando...' : 'Enviar a Revisión'}
              </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
