"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { musicalKeys } from '@/lib/musical-keys';
import type { Praise } from '@/lib/praises';

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

const praiseSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  tone: z.string().optional(),
  lyrics: z.string().min(1, 'La letra es requerida.'),
});

type FormData = z.infer<typeof praiseSchema>;

interface AddSinglePraiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPraiseAdded: (praise: Omit<Praise, 'id'>) => Promise<{ success: boolean; praise?: Praise }>;
}

export function AddSinglePraiseDialog({ open, onOpenChange, onPraiseAdded }: AddSinglePraiseDialogProps) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(praiseSchema),
    defaultValues: {
      title: '',
      tone: '',
      lyrics: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(values: FormData) {
    const result = await onPraiseAdded(values);
    if(result.success){
        toast({
            title: 'Alabanza Enviada a Revisión',
            description: `La alabanza "${values.title}" ha sido enviada.`,
        });
        onOpenChange(false);
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Ya existe una alabanza con ese título.',
        });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Alabanza</DialogTitle>
          <DialogDescription>
            Completa los detalles para agregar una nueva alabanza. Será enviada a revisión.
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
                    <Input placeholder="Título de la alabanza" {...field} />
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
                    <Textarea placeholder="Letra de la alabanza..." className="h-32" {...field} />
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
