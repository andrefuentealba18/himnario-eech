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
    if (!text) {
        return praises;
    }

    // Use a more robust regex to split by one or more blank lines.
    const praiseBlocks = text.trim().split(/\n\s*\n+/);

    for (const block of praiseBlocks) {
        // Trim each block and filter out any empty lines that might result from extra whitespace.
        const lines = block.trim().split('\n').filter(line => line.trim() !== '');
        
        if (lines.length > 0) {
            const title = lines.shift()!.trim();
            const lyrics = lines.join('\n').trim();

            // Only add the praise if both title and lyrics are present.
            if (title && lyrics) {
                praises.push({ title, lyrics });
            }
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
            description: 'No se pudieron procesar las alabanzas. Asegúrate de separar cada alabanza con una línea en blanco, y que la primera línea de cada una sea el título.',
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
            Pega el texto de varias alabanzas. La primera línea de cada bloque debe ser el título. Separa cada alabanza con al menos una línea en blanco.
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
                      placeholder="Título de alabanza 1...&#10;Letra...&#10;&#10;Título de alabanza 2...&#10;Letra..." 
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
