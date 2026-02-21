
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

const bulkSchema = z.object({
  text: z.string().min(1, 'El texto de los himnos es requerido.'),
});

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
    
    // Default to Major if scale part is 'M' or not specified but note is valid
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
    
    const hymnBlocks = text.split(/^\s*(?=\d+\s+[A-ZÁÉÍÓÚÑ¿?¡!,'’\s]{5,})/m).filter(block => block.trim());

    if (hymnBlocks.length === 0 && text.trim().length > 0) {
        hymnBlocks.push(text.trim());
    }
    
    hymnBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        if (lines.length === 0) return;

        const headerMatch = lines.shift()!.trim().match(/^(\d+)\s+([A-ZÁÉÍÓÚÑ¿?¡!,\s'’]+)/);
        if (!headerMatch) return;
        
        const number = parseInt(headerMatch[1], 10);
        let title = headerMatch[2].trim();
        
        if (isNaN(number)) return;

        let lyricsStartIndex = 0;
        let tone: string = "Indefinida";

        if (lines.length > 0) {
            const potentialToneLine = lines[0].trim();
            // Basic check if it's a verse or chorus
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

export function AddHymnDialog({ children, onHymnsAdded }: { children: React.ReactNode, onHymnsAdded: (hymns: Omit<Hymn, 'id'>[]) => Promise<{ addedCount: number, updatedCount: number }> }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bulkSchema>>({
    resolver: zodResolver(bulkSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof bulkSchema>) {
    const parsedHymns = parseHymns(values.text);
    
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
            description: 'No se pudieron procesar los himnos. Asegúrate que cada himno empiece con un número y un título en mayúsculas (ej: 116 TÍTULO).',
        });
    }
    
    form.reset({text: ''});
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
              name="text"
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
