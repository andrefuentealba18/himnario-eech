
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { musicalKeys } from '@/lib/musical-keys';
import type { SpecialOccasion, SpecialCategory } from '@/lib/special-occasions';
import { useSpecialOccasions } from '@/context/special-occasions-context';
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
import { Plus } from 'lucide-react';

const specialOccasionSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  category: z.enum(["Predicación", "Fúnebre", "Cumpleaños", "Bautismos"], {
    required_error: "Debes seleccionar una categoría."
  }),
  tone: z.string().optional(),
  lyrics: z.string().min(1, 'La letra es requerida.'),
});

type FormData = z.infer<typeof specialOccasionSchema>;

interface AddSpecialOccasionDialogProps {
  initialCategory?: SpecialCategory;
}

export function AddSpecialOccasionDialog({ initialCategory }: AddSpecialOccasionDialogProps) {
  const [open, setOpen] = useState(false);
  const { addSpecialOccasion } = useSpecialOccasions();

  const form = useForm<FormData>({
    resolver: zodResolver(specialOccasionSchema),
    defaultValues: {
      title: '',
      category: initialCategory || "Predicación",
      tone: '',
      lyrics: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: '',
        category: initialCategory || "Predicación",
        tone: '',
        lyrics: '',
      });
    }
  }, [open, form, initialCategory]);

  function onSubmit(values: FormData) {
    addSpecialOccasion(values);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full h-10 px-4">
          <Plus className="mr-1 h-4 w-4" />
          Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Agregar Canto Especial</DialogTitle>
          <DialogDescription>
            Añade un cántico para una ocasión especial. Será enviado para revisión de administración.
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
                      <SelectItem value="Predicación">Predicación</SelectItem>
                      <SelectItem value="Fúnebre">Fúnebre</SelectItem>
                      <SelectItem value="Cumpleaños">Cumpleaños</SelectItem>
                      <SelectItem value="Bautismos">Bautismos</SelectItem>
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
            <FormField
              control={form.control}
              name="tone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (Tonalidad)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Opcional" />
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
                    <Textarea placeholder="Letra del canto..." className="h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full">Enviar a Revisión</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
