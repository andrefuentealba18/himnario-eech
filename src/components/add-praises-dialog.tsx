"use client";

import { useState, useEffect } from 'react';
import type { Praise } from '@/lib/praises';
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

function parsePraises(text: string): Omit<Praise, 'id'>[] {
    const praises: Omit<Praise, 'id'>[] = [];
    if (!text || text.trim() === '') {
        return praises;
    }

    const lines = text.split('\n');
    let currentPraise: Omit<Praise, 'id'> | null = null;
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
            if (currentPraise) {
                currentPraise.lyrics = currentLyrics.join('\n').trim();
                if (currentPraise.title && currentPraise.lyrics) {
                    praises.push(currentPraise);
                }
            }

            currentPraise = { title: trimmedLine, lyrics: '' };
            currentLyrics = [];
        } else {
            if (currentPraise) {
                currentLyrics.push(line);
            }
        }
    }

    if (currentPraise) {
        currentPraise.lyrics = currentLyrics.join('\n').trim();
        if (currentPraise.title && currentPraise.lyrics) {
            praises.push(currentPraise);
        }
    }

    return praises;
}


interface AddPraisesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPraisesAdded: (praises: Omit<Praise, 'id'>[]) => void;
}

export function AddPraisesDialog({ open, onOpenChange, onPraisesAdded }: AddPraisesDialogProps) {
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
            description: 'El texto de las alabanzas es requerido.',
        });
        return;
    }

    setIsParsing(true);
    
    setTimeout(() => {
      const parsedPraises = parsePraises(text);
      
      if (parsedPraises.length > 0) {
          onPraisesAdded(parsedPraises);
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
          <DialogTitle>Agregar Varias Alabanzas</DialogTitle>
          <DialogDescription>
            Pega el texto de varias alabanzas. Cada alabanza debe comenzar con su título escrito completamente en MAYÚSCULAS. Las alabanzas serán enviadas para revisión por un administrador.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="praise-bulk-text">Texto de las alabanzas</Label>
                <Textarea 
                  id="praise-bulk-text"
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
