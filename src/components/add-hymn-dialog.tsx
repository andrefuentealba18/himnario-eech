
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Hymn } from '@/lib/hymns';
import { musicalKeys } from '@/lib/musical-keys';

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

function parseHymns(text: string): Hymn[] {
    const hymns: Hymn[] = [];
    if (!text.trim()) {
        return hymns;
    }

    // Split text into potential hymn blocks. Each block should start with a number.
    const hymnBlocks = text.split(/^\s*(?=\d+\.?\s*)/m).filter(block => block.trim());

    if (hymnBlocks.length === 0) return [];

    for (const block of hymnBlocks) {
        const lines = block.trim().split('\n');
        if (lines.length === 0) continue;

        // The first line should be the number and title. e.g., "1. HIMNO" or "1 HIMNO"
        const headerMatch = lines[0].match(/^(\d+)\.?\s*(.*)/);
        if (!headerMatch) continue;

        const number = parseInt(headerMatch[1], 10);
        let title = headerMatch[2].trim();
        let lyricsLines = lines.slice(1);
        
        // Handle case where title is on the next line (e.g. "1." on one line, "TITLE" on the next)
        if (title === '' && lyricsLines.length > 0) {
            title = lyricsLines[0].trim();
            lyricsLines = lyricsLines.slice(1);
        }
        
        if (!title) continue;

        let tone: string | undefined = undefined;

        // Check if the next non-empty line is a tone
        let firstContentLineIndex = -1;
        for (let i = 0; i < lyricsLines.length; i++) {
            if (lyricsLines[i].trim() !== '') {
                firstContentLineIndex = i;
                break;
            }
        }

        if (firstContentLineIndex !== -1) {
            const potentialTone = lyricsLines[firstContentLineIndex].trim();
            const isKeyInList = musicalKeys.some(k => k.toLowerCase() === potentialTone.toLowerCase());
            const keyRegex = /^[A-G](s|b)?[mM]?\s*\.?\s*M?\.?$/i;
            const toneKeywordRegex = /^(tono|tonalidad|notas):/i;

            if (toneKeywordRegex.test(potentialTone) || isKeyInList || (keyRegex.test(potentialTone) && potentialTone.length < 20)) {
                tone = potentialTone.replace(toneKeywordRegex, '').trim();
                lyricsLines = lyricsLines.slice(firstContentLineIndex + 1);
            }
        }

        const lyrics = lyricsLines.join('\n').trim();

        if (!isNaN(number) && title && lyrics) {
            hymns.push({
                number,
                title,
                lyrics,
                tone,
            });
        }
    }

    return hymns;
}


export function AddHymnDialog({ children, onHymnsAdded }: { children: React.ReactNode, onHymnsAdded: (hymns: Hymn[]) => { addedCount: number, duplicates: number } }) {
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
        const { addedCount, duplicates } = onHymnsAdded(parsedHymns);
        toast({
          title: 'Himnos Procesados',
          description: `Se agregaron ${addedCount} himnos nuevos. Se ignoraron ${duplicates} duplicados.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: 'Formato Incorrecto',
            description: 'No se pudieron procesar los himnos. Asegúrate que cada himno empiece con un número y un título (ej: 116. Título).',
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
            Pega el texto de varios himnos. Cada himno debe comenzar en una nueva línea con su número (ej: "116 Título" o "116. Título"). El punto después del número es opcional. Opcionalmente, puedes añadir la tonalidad en la línea siguiente al título.
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
                      placeholder="116 Mi nuevo himno...&#10;Tonalidad: Do Mayor&#10;Letra...&#10;&#10;117. Otro himno...&#10;Letra..." 
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
