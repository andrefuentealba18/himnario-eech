"use client";

import { useState, useEffect } from 'react';
import type { YouthChoir } from '@/lib/youth-choirs';

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
        
        if (justIgnoredHeader && /^\d+$/.test(trimmedLine)) {
            justIgnoredHeader = false;
            continue;
        }
        justIgnoredHeader = false;

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
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setText('');
    }
  }, [open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
    
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
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
                />
            </div>
            <DialogFooter>
              <Button type="submit">Enviar a Revisión</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
