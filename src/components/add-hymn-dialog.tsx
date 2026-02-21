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
    if (!text) {
        return hymns;
    }

    const regex = /^\s*(\d+)\.\s*([^\r\n]+)/gm;
    let match;
    const hymnHeaders = [];

    // 1. Find all hymn headers (e.g., "116. Título")
    while ((match = regex.exec(text)) !== null) {
        const titleCandidate = match[2].trim();
        if (titleCandidate.length > 0 && titleCandidate.length < 100) {
             hymnHeaders.push({
                number: parseInt(match[1], 10),
                title: titleCandidate,
                startIndex: match.index,
                headerLength: match[0].length,
            });
        }
    }

    if (hymnHeaders.length === 0) return [];

    // 2. Process each hymn block found between headers
    for (let i = 0; i < hymnHeaders.length; i++) {
        const header = hymnHeaders[i];
        const nextHeader = hymnHeaders[i + 1];
        
        const contentStartIndex = header.startIndex + header.headerLength;
        const contentEndIndex = nextHeader ? nextHeader.startIndex : text.length;

        let content = text.substring(contentStartIndex, contentEndIndex).trim();
        
        let tone: string | undefined = undefined;
        let lyrics: string = content;

        if (content) {
            const lines = content.split('\n');
            let firstContentLineIndex = -1;
            let firstContentLine = '';
            
            // Find the first non-empty line, which might be the tone
            for (let j = 0; j < lines.length; j++) {
                if (lines[j].trim() !== '') {
                    firstContentLineIndex = j;
                    firstContentLine = lines[j].trim();
                    break;
                }
            }

            if (firstContentLine) {
                const isKeyInList = musicalKeys.find(k => k.toLowerCase() === firstContentLine.toLowerCase());
                const keyRegex = /^[A-G](s|b)?[mM]?\s*\.?\s*M?\.?$/i;

                // Check if this first line is a musical key
                if (isKeyInList || (keyRegex.test(firstContentLine) && firstContentLine.length < 15)) {
                    tone = firstContentLine;
                    // If it is a tone, the lyrics are everything *after* that line
                    lyrics = lines.slice(firstContentLineIndex + 1).join('\n').trim();
                } else {
                    // Otherwise, the entire block is lyrics
                    lyrics = content;
                }
            }
        }

        if (!isNaN(header.number) && header.title && lyrics) {
            hymns.push({
                number: header.number,
                title: header.title,
                lyrics: lyrics,
                tone: tone,
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
            description: 'No se pudieron procesar los himnos. Asegúrate que cada himno empiece con un número y un punto (ej: 116. Título).',
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Varios Himnos</DialogTitle>
          <DialogDescription>
            Pega el texto de varios himnos. Cada himno DEBE comenzar en una nueva línea con su número y un punto (ej: "116. Título"). Opcionalmente, puedes añadir la tonalidad en la línea siguiente al título.
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
                      placeholder="116. Mi nuevo himno...&#10;Tonalidad: Do Mayor&#10;Letra...&#10;&#10;117. Otro himno...&#10;Letra..." 
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
