"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// New schema for bulk input
const bulkHymnsSchema = z.object({
  hymnsText: z.string().min(1, 'El texto de los himnos es requerido.'),
});

// Simple parser function
function parseHymns(text: string) {
  const hymns = [];
  const hymnBlocks = text.trim().split(/[\r\n]*-{3,}[\r\n]*/);

  for (const block of hymnBlocks) {
    if (block.trim() === '') continue;
    
    const lines = block.trim().split('\n');
    const firstLine = lines.shift()?.trim() || '';
    
    const match = firstLine.match(/^(\d+)\s*\.\s*(.*)/);
    
    if (match) {
      const number = parseInt(match[1], 10);
      const title = match[2].trim();
      const lyrics = lines.join('\n').trim();
      
      if (!isNaN(number) && title && lyrics) {
        hymns.push({ number, title, lyrics });
      }
    }
  }
  return hymns;
}


export function AddHymnDialog() {
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
        console.log("Himnos procesados:", parsedHymns);
        toast({
          title: 'Himnos Procesados (Simulación)',
          description: `Se procesaron ${parsedHymns.length} himnos. En una app real, estos se guardarían.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: 'Formato Incorrecto',
            description: 'No se pudieron procesar los himnos. Revisa el formato y el separador "---".',
        });
    }
    
    form.reset({hymnsText: ''});
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Himnos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Varios Himnos</DialogTitle>
          <DialogDescription>
            Pega el texto de varios himnos. Separa cada himno con una línea que contenga tres guiones (---).
            <br />
            <strong className="text-foreground">Formato por himno:</strong>
            <br />
            [Número]. [Título]
            <br />
            [Letra del himno...]
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
                      placeholder="1. Título del primer himno...&#10;Letra...&#10;---&#10;2. Título del segundo himno...&#10;Letra..." 
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
