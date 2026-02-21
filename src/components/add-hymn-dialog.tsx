
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Hymn } from '@/lib/hymns';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const bulkHymnsSchema = z.object({
  hymnsText: z.string().min(1, 'El texto de los himnos es requerido.'),
});

function normalizeTone(input: string): string {
    if (!input || !input.trim()) {
        return 'Indefinida';
    }

    const cleaned = input.replace(/\.$/, '').trim();
    const parts = cleaned.split(/\s+/);

    if (parts.length < 1 || parts.length > 2) {
        return cleaned; // Return as is if format is unexpected
    }

    const notePart = parts[0].toLowerCase();
    const scalePart = parts.length === 2 ? parts[1] : '';

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

    if (scalePart === 'M') {
        return `${note} Mayor`;
    }
    if (scalePart === 'm') {
        return `${note} menor`;
    }
    
    // If no scale part, it might be something else, return as is.
    return cleaned;
}


function parseHymns(text: string): Hymn[] {
    const hymns: Hymn[] = [];
    if (!text.trim()) {
        return hymns;
    }
    
    const hymnBlocks = text.split(/^\s*(?=\d+\s+[A-ZÁÉÍÓÚÑ¿?¡!,'’\s]{5,})/m).filter(block => block.trim());

    if (hymnBlocks.length === 0 && text.trim().length > 0) {
        hymnBlocks.push(text.trim());
    }

    for (const block of hymnBlocks) {
        const lines = block.trim().split('\n');
        if (lines.length === 0) continue;
        
        const headerMatch = lines.shift()!.trim().match(/^(\d+)\s*(.*)/);
        if (!headerMatch) continue;
        
        const number = parseInt(headerMatch[1], 10);
        let title = headerMatch[2].trim();
        
        if (isNaN(number)) continue;

        let lyricsStartIndex = 0;
        
        if (title === '') {
            for (let i = 0; i < lines.length; i++) {
                const nextLine = lines[i].trim();
                if (nextLine !== '' && nextLine.toUpperCase() === nextLine) {
                    title = nextLine;
                    lyricsStartIndex = i + 1;
                    break;
                }
            }
        }
        
        if (!title) continue;

        let tone: string = "Indefinida";
        
        for (let i = lyricsStartIndex; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();
            if (trimmedLine === '') {
                continue; 
            }

            const isVerse = /^\d+\.?\s+/.test(trimmedLine);
            const isChorus = /^coro/i.test(trimmedLine);
            
            if (!isVerse && !isChorus && trimmedLine.length < 25) {
                tone = normalizeTone(trimmedLine);
                lyricsStartIndex = i + 1;
            } else {
                lyricsStartIndex = i;
            }
            break; 
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
    }

    return hymns;
}

export function AddHymnDialog({ children, onHymnsAdded }: { children: React.ReactNode, onHymnsAdded: (hymns: Hymn[]) => { addedCount: number, updatedCount: number } }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bulkHymnsSchema>>({
    resolver: zodResolver(bulkHymnsSchema),
    defaultValues: {
      hymnsText: '',
    },
  });

  function onSubmit(values: z.infer<typeof bulkHymnsSchema>) {
    const parsedHymns = parseHymns(values.hymnsText);
    
    if (parsedHymns.length > 0) {
        const { addedCount, updatedCount } = onHymnsAdded(parsedHymns);
        toast({
          title: 'Himnos Procesados',
          description: `Se agregaron ${addedCount} himnos nuevos y se actualizaron ${updatedCount} existentes.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: 'Formato Incorrecto',
            description: 'No se pudieron procesar los himnos. Asegúrate que cada himno empiece con un número y un título en mayúsculas (ej: 116 TÍTULO).',
        });
    }
    
    form.reset({hymnsText: ''});
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Agregar Varios Himnos</DialogTitle>
          <DialogDescription>
            Pega el texto de varios himnos. Cada himno debe comenzar en una nueva línea con su número seguido por el título en MAYÚSCULAS (ej: "116 TÍTULO DEL HIMNO"). La tonalidad puede ir en la línea siguiente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="hymnsText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto de los himnos</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="116 TÍTULO DEL HIMNO&#10;Sol M&#10;1. Letra del himno...&#10;...&#10;&#10;CORO&#10;Coro del himno...&#10;&#10;117 OTRO TÍTULO&#10;..." 
                      className="h-64 min-h-[10rem]" 
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Guardar Himnos</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
