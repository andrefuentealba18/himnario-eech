
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

    const hymnBlocks = text.split(/^\s*(?=\d+\.?\s*)/m).filter(block => block.trim());

    if (hymnBlocks.length === 0) return [];

    for (const block of hymnBlocks) {
        let lines = block.trim().split('\n');
        if (lines.length === 0) continue;

        // 1. Parse Number and Title
        const headerMatch = lines.shift()!.match(/^(\d+)\.?\s*(.*)/);
        if (!headerMatch) continue;

        const number = parseInt(headerMatch[1], 10);
        let title = headerMatch[2].trim();
        
        // Handle case where title is on the next line
        if (title === '') {
            while(lines.length > 0 && lines[0].trim() === '') lines.shift(); // remove empty lines
            if (lines.length > 0) {
                title = lines.shift()!.trim();
            } else {
                continue; // no title
            }
        }
        
        if (!title) continue;

        // 2. Parse Tone (Tonalidad)
        let tone: string | undefined = undefined;
        while(lines.length > 0 && lines[0].trim() === '') lines.shift(); // remove empty lines

        if(lines.length > 0) {
            const potentialTone = lines[0].trim();
            const toneKeywordRegex = /^(tono|tonalidad|notas)\s*:\s*/i;

            const isKeyInList = musicalKeys.some(k => k.toLowerCase() === potentialTone.toLowerCase());

            if (toneKeywordRegex.test(potentialTone)) {
                tone = potentialTone.replace(toneKeywordRegex, '').trim();
                lines.shift();
            } else if (isKeyInList) {
                tone = potentialTone;
                lines.shift();
            }
        }
        
        // 3. The rest is lyrics
        const lyrics = lines.join('\n').trim();

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
