"use client";

import { useState, useEffect } from 'react';
import type { Hymn } from '@/lib/hymns';

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

function normalizeTone(input: string): string {
    if (!input || !input.trim()) {
        return 'Indefinida';
    }

    const cleaned = input.replace(/\.$/, '').trim();
    const parts = cleaned.split(/\s+/);

    if (parts.length === 0 || parts.length > 2) {
        return cleaned; 
    }
    
    const notePart = parts[0].toLowerCase();
    const scalePart = parts.length > 1 ? parts[1].toLowerCase() : '';

    const noteMap: { [key: string]: string } = {
        'do': 'Do',
        'do#': 'Do# / Reb', 'reb': 'Do# / Reb',
        're': 'Re',
        're#': 'Re# / Mib', 'mib': 'Re# / Mib',
        'mi': 'Mi',
        'fa': 'Fa',
        'fa#': 'Fa# / Solb', 'solb': 'Fa# / Solb',
        'sol': 'Sol',
        'sol#': 'Sol# / Lab', 'lab': 'Sol# / Lab',
        'la': 'La',
        'la#': 'La# / Sib', 'sib': 'La# / Sib',
        'si': 'Si',
    };

    const note = noteMap[notePart];
    if (!note) {
        return cleaned; // If note part is not recognized, return original
    }

    if (scalePart === 'm') {
        return `${note} menor`;
    }
    
    if (scalePart === 'm.' || scalePart === 'm' || scalePart === 'menor') {
        return `${note} menor`;
    }

    if (scalePart === 'M' || scalePart === 'm' || scalePart === '' || scalePart === 'mayor') {
        return `${note} Mayor`;
    }


    return cleaned;
}


function parseHymns(text: string): Omit<Hymn, 'id'>[] {
    const hymns: Omit<Hymn, 'id'>[] = [];
    if (!text.trim()) {
        return hymns;
    }
    
    // Updated regex to handle titles with special characters like '¿' and '¡'
    const hymnBlocks = text.split(/^\s*(?=\d+\s+.+)/m).filter(block => block.trim());

    if (hymnBlocks.length === 0 && text.trim().length > 0) {
        hymnBlocks.push(text.trim());
    }
    
    hymnBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        if (lines.length === 0) return;

        const headerMatch = lines.shift()!.trim().match(/^(\d+)\s+(.+)/);
        if (!headerMatch) return;
        
        const number = parseInt(headerMatch[1], 10);
        let title = headerMatch[2].trim();
        
        if (isNaN(number)) return;

        let lyricsStartIndex = 0;
        let tone: string = "Indefinida";

        if (lines.length > 0) {
            const potentialToneLine = lines[0].trim();
            const isVerse = /^\d+\.?\s+/.test(potentialToneLine);
            const isChorus = /^coro/i.test(potentialToneLine);

            if (!isVerse && !isChorus && potentialToneLine.length < 25 && potentialToneLine.length > 0) {
                tone = normalizeTone(potentialToneLine);
                lyricsStartIndex = 1;
            }
        }
        
        const lyrics = lines.slice(lyricsStartIndex).join('\n').trim();

        if (lyrics || tone !== "Indefinida") {
             hymns.push({
                number,
                title,
                lyrics,
                tone: tone,
            });
        }
    });

    return hymns;
}

interface AddHymnDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHymnsAdded: (hymns: Omit<Hymn, 'id'>[]) => Promise<{ addedCount: number, updatedCount: number }>;
}

export function AddHymnDialog({ open, onOpenChange, onHymnsAdded }: AddHymnDialogProps) {
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
            description: 'El texto de los himnos es requerido.',
        });
        return;
    }
    
    const parsedHymns = parseHymns(text);
    
    if (parsedHymns.length > 0) {
        const { addedCount, updatedCount } = await onHymnsAdded(parsedHymns);
        toast({
          title: 'Himnos Procesados',
          description: `Se agregaron ${addedCount} himnos nuevos y se actualizaron ${updatedCount} existentes.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: 'Formato Incorrecto',
            description: 'No se pudieron procesar los himnos. Asegúrate que cada himno empiece con un número y un título.',
        });
    }
    
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Agregar Varios Himnos</DialogTitle>
          <DialogDescription>
            Pega el texto de varios himnos. Cada himno debe comenzar en una nueva línea con su número seguido por el título. La tonalidad puede ir en la línea siguiente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="hymn-bulk-text">Texto de los himnos</Label>
                <Textarea 
                  id="hymn-bulk-text"
                  placeholder="116 TÍTULO DEL HIMNO&#10;Sol M&#10;1. Letra del himno...&#10;...&#10;&#10;CORO&#10;Coro del himno...&#10;&#10;117 OTRO TÍTULO&#10;..." 
                  className="h-64 min-h-[10rem]"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Himnos</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
