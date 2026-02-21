"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { YouthChoir } from '@/lib/youth-choirs';

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
  text: z.string().min(1, 'El texto de las alabanzas es requerido.'),
});

function parseSongs(text: string): Omit<YouthChoir, 'id'>[] {
    const songs: Omit<YouthChoir, 'id'>[] = [];
    if (!text || text.trim() === '') {
        return songs;
    }

    const lines = text.split('\n');
    let currentSong: Omit<YouthChoir, 'id'> | null = null;
    let currentLyrics: string[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        
        const isTitle = trimmedLine.length > 0 && trimmedLine === trimmedLine.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(trimmedLine);

        if (isTitle) {
            if (currentSong) {
                currentSong.lyrics = currentLyrics.join('\n').trim();
                if (currentSong.title && currentSong.lyrics) {
                    songs.push(currentSong);
                }
            }

            currentSong = { title: trimmedLine, lyrics: '' };
            currentLyrics = [];
        } else {
            if (currentSong) {
                currentLyrics.push(line);
            }
        }
    }

    if (currentSong) {
        currentSong.lyrics = currentLyrics.join('\n').trim();
        if (currentSong.title && currentSong.lyrics) {
            songs.push(currentSong);
        }
    }

    return songs;
}


export function AddYouthChoirsDialog({ children, onYouthChoirsAdded }: { children: React.ReactNode, onYouthChoirsAdded: (youthChoirs: Omit<YouthChoir, 'id'>[]) => Promise<{ addedCount: number, duplicates: number }> }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bulkSchema>>({
    resolver: zodResolver(bulkSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof bulkSchema>) {
    const parsed = parseSongs(values.text);
    
    if (parsed.length > 0) {
        const { addedCount, duplicates } = await onYouthChoirsAdded(parsed);
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
    
    form.reset({text: ''});
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Varias Alabanzas (Coro Juventud)</DialogTitle>
          <DialogDescription>
            Pega el texto de varias alabanzas. Cada una debe comenzar con su título escrito completamente en MAYÚSCULAS.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto de las alabanzas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="TÍTULO EN MAYÚSCULAS&#10;Letra de la alabanza...&#10;...&#10;&#10;OTRO TÍTULO EN MAYÚSCULAS&#10;Letra de la otra alabanza..." 
                      className="h-64 min-h-[10rem]" 
                      {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Guardar Alabanzas</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    