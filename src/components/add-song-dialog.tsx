"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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

const songRequestSchema = z.object({
  category: z.enum(['Alabanzas', 'Coros', 'Alabanza Coro Juventud'], { required_error: 'Por favor selecciona una categoría.' }),
  submitterName: z.string().min(1, 'Tu nombre es requerido.'),
  title: z.string().min(1, 'El título es requerido.'),
  lyrics: z.string().min(1, 'La letra es requerida.'),
});

const categoryMap = {
  'Alabanzas': 'praise',
  'Coros': 'choir',
  'Alabanza Coro Juventud': 'youth-choir',
};

export function AddSongDialog() {
  const [open, setOpen] = useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof songRequestSchema>>({
    resolver: zodResolver(songRequestSchema),
    defaultValues: {
      category: undefined,
      submitterName: '',
      title: '',
      lyrics: '',
    },
  });

  async function onSubmit(values: z.infer<typeof songRequestSchema>) {
    if (!firestore) {
      toast({
        variant: "destructive",
        title: 'Error de Conexión',
        description: 'No se pudo enviar la sugerencia. Por favor, intenta de nuevo.',
      });
      return;
    }

    try {
      const requestsCollection = collection(firestore, 'songRequests');
      await addDoc(requestsCollection, {
        category: categoryMap[values.category],
        submitterName: values.submitterName,
        title: values.title,
        lyrics: values.lyrics,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Sugerencia Enviada',
        description: 'Gracias por tu contribución. La canción será revisada por un administrador.',
      });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo enviar tu sugerencia.',
      });
      console.error("Error submitting song request: ", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Sugerir Canción
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sugerir Nueva Canción</DialogTitle>
          <DialogDescription>
            Completa los detalles para sugerir una nueva canción. Un administrador la revisará.
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
            <FormField
              control={form.control}
              name="submitterName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tu Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de quien sugiere" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Enviar Sugerencia</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    
