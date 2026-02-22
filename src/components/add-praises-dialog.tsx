"use client";

import { useState, useEffect } from 'react';
import type { Praise } from '@/lib/praises';

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

    const ignorePattern = /^ejercito evangelico de chile las torres\s*\d*$/i;

    for (const line of lines) {
        const trimmedLine = line.trim();

        if (ignorePattern.test(trimmedLine)) {
            continue;
        }
        
        const isTitle = trimmedLine.length > 0 && trimmedLine === trimmedLine.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(trimmedLine);

        if (isTitle) {
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
  onPraisesAdded: (praises: Omit<Praise, 'id'>[]) => Promise<{ addedCount: number, duplicates: number }>;
}

export function AddPraisesDialog({ open, onOpenChange, onPraisesAdded }: AddPraisesDialogProps) {
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
            description: 'El texto de las alabanzas es requerido.',
        });
        return;
    }
    
    const parsedPraises = parsePraises(text);
    
    if (parsedPraises.length > 0) {
        const { addedCount, duplicates } = await onPraisesAdded(parsedPraises);
        toast({
          title: 'Alabanzas Procesadas',
          description: `Se agregaron ${addedCount} alabanzas nuevas. Se ignoraron ${duplicates} duplicados.`,
        });
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
          <DialogTitle>Agregar Varias Alabanzas</DialogTitle>
          <DialogDescription>
            Pega el texto de varias alabanzas. Cada alabanza debe comenzar con su título escrito completamente en MAYÚSCULAS. El sistema las separará automáticamente.
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
                />
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Alabanzas</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
