"use client";

import { useState, useEffect } from 'react';
import type { YouthChoir } from '@/lib/youth-choirs';
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

function parseSongs(text: string): Omit<YouthChoir, 'id'>[] {
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

            currentSong = { title: trimmedLine, lyrics: '' };
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
}

export function AddYouthChoirsDialog({ open, onOpenChange, onYouthChoirsAdded }: AddYouthChoirsDialogProps) {
  const [text, setText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setText('');
      setIsParsing(false);
    }
  }, [open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsParsing(true);

    setTimeout(() => {
      const parsed = parseSongs(text);
      
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
      <DialogContent className="sm:max-w-lg" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Agregar Varias Alabanzas (Coro Juventud)</DialogTitle>
          <DialogDescription>
            Pega el texto de varias alabanzas. Cada una debe comenzar con su título escrito completamente en MAYÚSCULAS. Serán enviadas a revisión.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
