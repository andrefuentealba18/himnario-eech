
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

function parseHymns(text: string): Hymn[] {
    const hymns: Hymn[] = [];
    if (!text.trim()) {
        return hymns;
    }

    // This regex splits the text into hymn blocks.
    // It looks for a line that starts with a number, followed by whitespace (like a tab), 
    // and then a title in uppercase letters. This helps distinguish a hymn title from a numbered verse.
    const hymnBlocks = text.split(/^\s*(?=\d+[\s\t]+[A-ZÁÉÍÓÚÑ'’,\.¡! ]{5,})/m).filter(block => block.trim());

    if (hymnBlocks.length === 0) {
        return [];
    }

    for (const block of hymnBlocks) {
        const lines = block.trim().split('\n');
        if (lines.length === 0) continue;

        // 1. Parse Number and Title from the first line.
        const headerLine = lines.shift()!.trim();
        const headerMatch = headerLine.match(/^(\d+)\.?[\s\t]+(.*)/);
        if (!headerMatch) continue;
        
        const number = parseInt(headerMatch[1], 10);
        let title = headerMatch[2].trim();
        
        if (isNaN(number) || !title) continue;

        let tone: string | undefined = undefined;
        let lyricsStartIndex = 0;

        // 2. Look for the tone in the next non-empty lines
        for (let i = 0; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();
            if (trimmedLine === '') {
                continue; // Skip empty lines
            }

            // Check if this line is the tone
            const isVerse = /^\d+\./.test(trimmedLine);
            const isChorus = /^coro/i.test(trimmedLine);

            if (!isVerse && !isChorus && trimmedLine.length > 0 && trimmedLine.length < 25) {
                // It looks like a tone.
                tone = trimmedLine;
                lyricsStartIndex = i + 1; // Lyrics start on the next line
            } else {
                // It doesn't look like a tone, so it must be the start of the lyrics.
                lyricsStartIndex = i;
            }
            break; // Stop after checking the first non-empty line
        }

        const lyrics = lines.slice(lyricsStartIndex).join('\n').trim();

        if (lyrics) {
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
                      placeholder="116 TÍTULO DEL HIMNO&#10;Sol Mayor&#10;1. Letra del himno...&#10;...&#10;&#10;CORO&#10;Coro del himno...&#10;&#10;117 OTRO TÍTULO&#10;..." 
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
