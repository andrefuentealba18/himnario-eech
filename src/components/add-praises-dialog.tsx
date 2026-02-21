"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Praise } from '@/lib/praises';

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

const bulkPraisesSchema = z.object({
  praisesText: z.string().min(1, 'El texto de las alabanzas es requerido.'),
});

function parsePraises(text: string): Omit<Praise, 'id'>[] {
    const praises: Omit<Praise, 'id'>[] = [];
    if (!text || text.trim() === '') {
        return praises;
    }

    const lines = text.split('\n');
    let currentPraise: Omit<Praise, 'id'> | null = null;
    let currentLyrics: string[] = [];

    for (const line of lines) {
        const trimmedLine = line.trim();
        
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


export function AddPraisesDialog({ children, onPraisesAdded }: { children: React.ReactNode, onPraisesAdded: (praises: Omit<Praise, 'id'>[]) => { addedCount: number, duplicates: number } }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof bulkPraisesSchema>>({
    resolver: zodResolver(bulkPraisesSchema),
    defaultValues: {
      praisesText: '',
    },
  });

  function onSubmit(values: z.infer<typeof bulkPraisesSchema>) {
    const parsedPraises = parsePraises(values.praisesText);
    
    if (parsedPraises.length > 0) {
        const { addedCount, duplicates } = onPraisesAdded(parsedPraises);
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
    
    form.reset({praisesText: ''});
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Varias Alabanzas</DialogTitle>
          <DialogDescription>
            Pega el texto de varias alabanzas. Cada alabanza debe comenzar con su título escrito completamente en MAYÚSCULAS. El sistema las separará automáticamente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="praisesText"
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
