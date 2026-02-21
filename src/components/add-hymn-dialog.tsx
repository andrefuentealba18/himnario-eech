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
    if (!text) {
        return hymns;
    }

    // This regex finds all lines that look like hymn titles: number, dot, and then the title text.
    const regex = /^\s*(\d+)\.\s*([^\r\n]+)/gm;
    let match;
    const hymnHeaders = [];

    while ((match = regex.exec(text)) !== null) {
        const titleCandidate = match[2].trim();
        // Basic heuristic: a title is not a super long line of text.
        if (titleCandidate.length > 0 && titleCandidate.length < 80) {
             hymnHeaders.push({
                number: parseInt(match[1], 10),
                title: titleCandidate,
                startIndex: match.index,
                headerLength: match[0].length,
            });
        }
    }

    if (hymnHeaders.length === 0) return [];

    for (let i = 0; i < hymnHeaders.length; i++) {
        const header = hymnHeaders[i];
        const nextHeader = hymnHeaders[i + 1];
        const contentStartIndex = header.startIndex + header.headerLength;
        const contentEndIndex = nextHeader ? nextHeader.startIndex : text.length;

        let lyrics = text.substring(contentStartIndex, contentEndIndex).trim();
        
        const lines = lyrics.split('\n');
        const firstLineTrimmed = lines[0]?.trim();
        if(firstLineTrimmed && /^[A-G](s|b)?[mM]?\s*\.?\s*M?\.?$/i.test(firstLineTrimmed)){
            lines.shift();
            lyrics = lines.join('\n').trim();
        }

        if (!isNaN(header.number) && header.title && lyrics) {
            hymns.push({
                number: header.number,
                title: header.title,
                lyrics: lyrics,
            });
        }
    }

    return hymns;
}


export function AddHymnDialog({ children, onHymnsAdded }: { children: React.ReactNode, onHymnsAdded: (hymns: Hymn[]) => number }) {
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
        const addedCount = onHymnsAdded(parsedHymns);
        toast({
          title: 'Himnos Procesados',
          description: `Se agregaron ${addedCount} himnos nuevos. Se ignoraron ${parsedHymns.length - addedCount} duplicados.`,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Varios Himnos</DialogTitle>
          <DialogDescription>
            Pega el texto de varios himnos. El sistema los separará automáticamente siempre que cada himno comience con su número seguido de un punto.
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
                      placeholder="116. Mi nuevo himno...&#10;Letra...&#10;&#10;117. Otro himno...&#10;Letra..." 
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
