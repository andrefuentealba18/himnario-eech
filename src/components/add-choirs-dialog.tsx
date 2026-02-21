"use client";

import { useState, useEffect } from 'react';
import type { Choir } from '@/lib/choirs';

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

function parseSongs(text: string): Omit<Choir, 'id'>[] {
    const songs: Omit<Choir, 'id'>[] = [];
    if (!text || text.trim() === '') {
        return songs;
    }

    const lines = text.split('\n');
    let currentSong: Omit<Choir, 'id'> | null = null;
    let currentLyrics: string[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        
        const isTitle = trimmedLine.length > 0 && trimmedLine === trimmedLine.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(trimmedLine);

        if (isTitle) {
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

interface AddChoirsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChoirsAdded: (choirs: Omit<Choir, 'id'>[]) => Promise<{ addedCount: number, duplicates: number }>;
}

export function AddChoirsDialog({ open, onOpenChange, onChoirsAdded }: AddChoirsDialogProps) {
  const [text, setText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setText('');
    }
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (text.trim() === '') {
        toast({
            variant: "destructive",
            title: 'Campo vacío',
            description: 'El texto de los coros es requerido.',
        });
        return;
    }
    
    const parsed = parseSongs(text);
    
    if (parsed.length > 0) {
        const { addedCount, duplicates } = await onChoirsAdded(parsed);
        toast({
          title: 'Coros Procesados',
          description: `Se agregaron ${addedCount} coros nuevos. Se ignoraron ${duplicates} duplicados.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: 'Formato Incorrecto',
            description: 'No se pudieron procesar los coros. Asegúrate que el título de cada coro esté completamente en mayúsculas.',
        });
    }
    
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Varios Coros</DialogTitle>
          <DialogDescription>
            Pega el texto de varios coros. Cada uno debe comenzar con su título escrito completamente en MAYÚSCULAS.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="choir-bulk-text">Texto de los coros</Label>
                <Textarea 
                  id="choir-bulk-text"
                  placeholder="TÍTULO EN MAYÚSCULAS&#10;Letra del coro...&#10;...&#10;&#10;OTRO TÍTULO EN MAYÚSCULAS&#10;Letra del otro coro..." 
                  className="h-64 min-h-[10rem]"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Coros</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
