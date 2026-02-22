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
    let currentSong: Partial<Choir> & { lyricsLines: string[] } | null = null;
    
    const ignorePattern = /^ejerci(t|ot)o evangelico de chile( templo)? las torres\s*\d*$/i;
    let justIgnoredHeader = false;

    const saveCurrentSong = () => {
        if (currentSong) {
            currentSong.lyrics = currentSong.lyricsLines.join('\n').trim();
            if (currentSong.title && currentSong.lyrics) {
                const { lyricsLines, ...songData } = currentSong;
                songs.push(songData as Omit<Choir, 'id'>);
            }
        }
    };

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
            // This is a potential title or metadata.
            let isMetadataLine = false;
            // Check if it's a metadata line (only if it's right after a title)
            if (currentSong && currentSong.lyricsLines.length === 0) {
                const metadataLine = trimmedLine.toUpperCase();
                let metadataFound = false;

                if (metadataLine.includes('RAPIDO')) {
                    currentSong.speed = 'Rapido';
                    metadataFound = true;
                } else if (metadataLine.includes('LENTO')) {
                    currentSong.speed = 'Lento';
                    metadataFound = true;
                }
    
                const tonePart = metadataLine.replace('RAPIDO', '').replace('LENTO', '').trim();
                if(tonePart) {
                    currentSong.tone = tonePart.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
                    metadataFound = true;
                }
                
                if (metadataFound) {
                    isMetadataLine = true;
                }
            }

            if (isMetadataLine) {
                // This was processed as metadata, so skip to next line
                continue;
            } else {
                // This is a new title
                saveCurrentSong();
                currentSong = { title: trimmedLine, lyricsLines: [] };
            }
        } else {
            // This is a lyric line, an ignored uppercase line, or an empty line.
            if (currentSong) {
                currentLyrics.push(line);
            }
        }
    }
    saveCurrentSong(); // Save the last song
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
          title: 'Coros enviados a revisión',
          description: `Se enviaron ${addedCount} coros nuevos. Se ignoraron ${duplicates} duplicados.`,
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
            Pega el texto de varios coros. Cada coro debe comenzar con su título en MAYÚSCULAS. Opcionalmente, en la línea siguiente puedes agregar la tonalidad y velocidad (ej: SOL MAYOR RAPIDO). Los coros serán enviados para revisión.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="choir-bulk-text">Texto de los coros</Label>
                <Textarea 
                  id="choir-bulk-text"
                  placeholder="TÍTULO EN MAYÚSCULAS&#10;SOL MAYOR RAPIDO&#10;Letra del coro...&#10;...&#10;&#10;OTRO TÍTULO EN MAYÚSCULAS&#10;..." 
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
