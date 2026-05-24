"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { SpecialOccasion, SpecialCategory } from '@/lib/special-occasions';
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

const specialOccasionSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  category: z.enum(["Predicación", "Fúnebre", "Cumpleaños", "Bautismos"], {
    required_error: "Debes seleccionar una categoría."
  }),
  tone: z.string().optional(),
  hymnNumber: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().optional()
  ),
  lyrics: z.string().min(1, 'La letra es requerida.'),
});

type FormData = z.infer<typeof specialOccasionSchema>;

interface EditSpecialOccasionDialogProps {
  children: React.ReactNode;
  specialOccasion: SpecialOccasion;
  onSpecialUpdated: (updatedData: Omit<SpecialOccasion, 'id'>) => Promise<{ success: boolean }>;
  onSaveComplete?: () => void;
}

export function EditSpecialOccasionDialog({ children, specialOccasion, onSpecialUpdated, onSaveComplete }: EditSpecialOccasionDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(specialOccasionSchema),
    defaultValues: {
      title: specialOccasion.title,
      category: specialOccasion.category,
      tone: specialOccasion.tone || '',
      hymnNumber: specialOccasion.hymnNumber,
      lyrics: specialOccasion.lyrics,
    },
  });
  
  useEffect(() => {
    if (open) {
      form.reset({
        title: specialOccasion.title,
        category: specialOccasion.category,
        tone: specialOccasion.tone || '',
        hymnNumber: specialOccasion.hymnNumber,
        lyrics: specialOccasion.lyrics,
      });
    }
  }, [specialOccasion, form, open]);

  async function onSubmit(values: FormData) {
    const result = await onSpecialUpdated(values);
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
          <DialogTitle>Editar Canto Especial</DialogTitle>
          <DialogDescription>
            Modifica los detalles del canto ceremonial.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la ocasión" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Predicación">🎤 Predicación</SelectItem>
                      <SelectItem value="Fúnebre">⛪ Fúnebre</SelectItem>
                      <SelectItem value="Cumpleaños">🎁 Cumpleaños</SelectItem>
                      <SelectItem value="Bautismos">💧 Bautismos</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input placeholder="Título del canto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas (Tonalidad)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Tono" />
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
                name="hymnNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº Himno (Opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ej: 116" 
                        value={field.value === undefined ? "" : field.value} 
                        onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="lyrics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Letra</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Letra del canto..." className="h-48" {...field} />
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
