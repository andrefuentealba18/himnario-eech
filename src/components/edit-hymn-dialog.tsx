"use client";

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const hymnSchema = z.object({
  number: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().positive('El número debe ser mayor que cero.')
  ),
  title: z.string().min(1, 'El título es requerido.'),
  tone: z.string().optional(),
  lyrics: z.string().min(1, 'La letra es requerida.'),
});

type FormData = z.infer<typeof hymnSchema>;

interface EditHymnDialogProps {
  children: React.ReactNode;
  hymn: Hymn;
  onHymnUpdated: (updatedData: Omit<Hymn, 'number'>) => { success: boolean };
  onSaveComplete?: () => void;
}

export function EditHymnDialog({ children, hymn, onHymnUpdated, onSaveComplete }: EditHymnDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(hymnSchema),
    defaultValues: {
      number: hymn.number,
      title: hymn.title,
      tone: hymn.tone,
      lyrics: hymn.lyrics,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        number: hymn.number,
        title: hymn.title,
        tone: hymn.tone || '',
        lyrics: hymn.lyrics,
      });
    }
  }, [hymn, form, open]);

  function onSubmit(values: FormData) {
    const { number, ...updateData } = values;
    const result = onHymnUpdated(updateData);
    if (result.success) {
      setOpen(false);
      onSaveComplete?.();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Editar Himno #{hymn.number}</DialogTitle>
          <DialogDescription>
            Modifica los detalles del himno.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título del himno" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (Tonalidad)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una tonalidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {musicalKeys.map(key => (
                        <SelectItem key={key} value={key}>{key}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lyrics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Letra</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Letra del himno..." className="h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
