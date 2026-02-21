"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';

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
import { useToast } from '@/hooks/use-toast';

const songSchema = z.object({
  category: z.enum(['Alabanzas', 'Coros', 'Alabanza Coro Juventud'], { required_error: 'Por favor selecciona una categoría.' }),
  title: z.string().min(1, 'El título es requerido.'),
  lyrics: z.string().min(1, 'La letra es requerida.'),
});

export function AddSongDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { addPraise } = usePraises();
  const { addChoir } = useChoirs();
  const { addYouthChoir } = useYouthChoirs();

  const form = useForm<z.infer<typeof songSchema>>({
    resolver: zodResolver(songSchema),
    defaultValues: {
      category: undefined,
      title: '',
      lyrics: '',
    },
  });

  async function onSubmit(values: z.infer<typeof songSchema>) {
    let result: { success: boolean };
    const songData = { title: values.title, lyrics: values.lyrics };

    switch (values.category) {
      case 'Alabanzas':
        result = await addPraise(songData);
        break;
      case 'Coros':
        result = await addChoir(songData);
        break;
      case 'Alabanza Coro Juventud':
        result = await addYouthChoir(songData);
        break;
      default:
        toast({ variant: 'destructive', title: 'Categoría no válida' });
        return;
    }

    if (result.success) {
      toast({
        title: 'Canción Guardada',
        description: `"${values.title}" se guardó en ${values.category}.`,
      });
      form.reset();
      setOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error al Guardar',
        description: `Ya existe una canción con el título "${values.title}" en esa categoría.`,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Canción
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Canción</DialogTitle>
          <DialogDescription>
            Completa los detalles de la nueva canción. Haz clic en guardar cuando termines.
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Alabanzas">Alabanzas</SelectItem>
                      <SelectItem value="Coros">Coros</SelectItem>
                      <SelectItem value="Alabanza Coro Juventud">Alabanza Coro Juventud</SelectItem>
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
                    <Input placeholder="Título de la canción" {...field} />
                  </FormControl>
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
                    <Textarea placeholder="Letra de la canción..." className="h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Guardar Canción</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    