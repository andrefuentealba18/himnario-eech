"use client";

import { useState, useEffect } from 'react';
import type { Choir } from '@/lib/choirs';
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

function parseSongs(text: string): Omit<Choir, 'id'>[] {
    const songs: Omit<Choir, 'id'>[] = [];
    if (!text || text.trim() === '') {
        return songs;
    }

    // The user specified that songs will be separated by two lines (a blank line).
    // This regex splits the text into blocks by one or more blank lines.
    const songBlocks = text.trim().split(/(?:\r?\n){2,}/);

    for (const block of songBlocks) {
        const trimmedBlock = block.trim();
        if (!trimmedBlock) {
            continue;
        }

        const lines = trimmedBlock.split(/\r?\n/);
        if (lines.length === 0) {
            continue;
        }

        // The first line is the title.
        const title = lines[0].trim();
        // The entire block is the lyrics, as per the new format.
        const lyrics = trimmedBlock;

        if (title && lyrics) {
            songs.push({ title, lyrics });
        }
    }
    return songs;
}


interface AddChoirsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChoirsAdded: (choirs: Omit<Choir, 'id'>[]) => void;
}

export function AddChoirsDialog({ open, onOpenChange, onChoirsAdded }: AddChoirsDialogProps) {
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
    if (text.trim() === '') {
        toast({
            variant: "destructive",
            title: 'Campo vacío',
            description: 'El texto de los coros es requerido.',
        });
        return;
    }
    
    setIsParsing(true);

    setTimeout(() => {
      const parsed = parseSongs(text);
      
      if (parsed.length > 0) {
          onChoirsAdded(parsed);
      } else {
          toast({
              variant: "destructive",
              title: 'Formato Incorrecto',
              description: 'No se pudieron procesar los coros. Asegúrate de separar cada coro con una línea en blanco.',
          });
      }
      
      setIsParsing(false);
      onOpenChange(false);
    }, 10);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Varios Coros</DialogTitle>
          <DialogDescription>
            Pega el texto de varios coros. La primera línea de cada coro será usada como su título. Separa cada coro con dos líneas (deja una línea en blanco entre ellos). Los coros serán enviados para revisión.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="choir-bulk-text">Texto de los coros</Label>
                <Textarea 
                  id="choir-bulk-text"
                  placeholder="La primera línea es el título...&#10;Letra del coro...&#10;...&#10;&#10;El siguiente coro empieza aquí...&#10;Su primera línea es el título..." 
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
