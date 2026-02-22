"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { musicalKeys } from '@/lib/musical-keys';
import type { Choir } from '@/lib/choirs';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const choirSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  tone: z.string().optional(),
  lyrics: z.string().min(1, 'La letra es requerida.'),
  speed: z.string().optional(),
});

type FormData = z.infer<typeof choirSchema>;

interface AddSingleChoirDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onChoirAdded: (choir: Omit<Choir, 'id'>) => Promise<{ success: boolean; choir?: Choir }>;
}

export function AddSingleChoirDialog({ open, onOpenChange, onChoirAdded }: AddSingleChoirDialogProps) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(choirSchema),
    defaultValues: {
      title: '',
      tone: '',
      lyrics: '',
      speed: '',
    },
  });
  
  useEffect(() => {
    if(open) {
        form.reset();
    }
  }, [open, form]);

  async function onSubmit(values: FormData) {
    const result = await onChoirAdded(values);

    if (result.success) {
      toast({
        title: 'Coro Enviado a Revisión',
        description: `El coro "${values.title}" ha sido enviado.`,
      });
      onOpenChange(false);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Ya existe un coro con ese título.',
        });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Coro</DialogTitle>
          <DialogDescription>
            Completa los detalles para agregar un nuevo coro. Será enviado para revisión.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título del coro" {...field} />
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
              name="speed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Velocidad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una velocidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Rapido">Rápido (Avivamiento)</SelectItem>
                      <SelectItem value="Lento">Lento (Meditación)</SelectItem>
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
                    <Textarea placeholder="Letra del coro..." className="h-32" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Enviar a Revisión</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
