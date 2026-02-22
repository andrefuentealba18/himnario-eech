
"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { musicalKeys } from '@/lib/musical-keys';
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

const praiseRequestSchema = z.object({
  submitterName: z.string().min(1, 'Tu nombre es requerido.'),
  title: z.string().min(1, 'El título es requerido.'),
  tone: z.string().optional(),
  lyrics: z.string().min(1, 'La letra es requerida.'),
});

type FormData = z.infer<typeof praiseRequestSchema>;

interface AddSinglePraiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddSinglePraiseDialog({ open, onOpenChange }: AddSinglePraiseDialogProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(praiseRequestSchema),
    defaultValues: {
      submitterName: '',
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
        ...values,
        category: 'praise',
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Sugerencia Enviada',
        description: 'Gracias por tu contribución. La alabanza será revisada por un administrador antes de ser agregada.',
      });
      onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sugerir Nueva Alabanza</DialogTitle>
          <DialogDescription>
            Completa los detalles para sugerir una nueva alabanza. Un administrador la revisará.
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
