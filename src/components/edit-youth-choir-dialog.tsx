
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { YouthChoir } from '@/lib/youth-choirs';
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

const youthChoirSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  tone: z.string().optional(),
  speed: z.string().optional(),
  lyrics: z.string().min(1, 'La letra es requerida.'),
  group: z.enum(["Coro Juventud", "Grupo Ciclista", "Departamento Infantil", "Clase Dorcas", "Departamento Juvenil"]),
});

type FormData = z.infer<typeof youthChoirSchema>;

interface EditYouthChoirDialogProps {
  children: React.ReactNode;
  youthChoir: YouthChoir;
  onYouthChoirUpdated: (updatedData: Omit<YouthChoir, 'id'>) => void;
  onSaveComplete?: () => void;
}

export function EditYouthChoirDialog({ children, youthChoir, onYouthChoirUpdated, onSaveComplete }: EditYouthChoirDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(youthChoirSchema),
    defaultValues: {
      title: youthChoir.title,
      tone: youthChoir.tone || '',
      speed: youthChoir.speed || '',
      lyrics: youthChoir.lyrics,
      group: youthChoir.group,
    },
  });
  
  useEffect(() => {
    if (open) {
      form.reset({
        title: youthChoir.title,
        tone: youthChoir.tone || '',
        speed: youthChoir.speed || '',
        lyrics: youthChoir.lyrics,
        group: youthChoir.group,
      });
    }
  }, [youthChoir, form, open]);


  function onSubmit(values: FormData) {
    onYouthChoirUpdated(values as Omit<YouthChoir, 'id'>);
    setOpen(false);
    onSaveComplete?.();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Editar Alabanza</DialogTitle>
          <DialogDescription>
            Modifica los detalles de la alabanza de agrupación.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agrupación</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la agrupación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Coro Juventud">Coro Juventud</SelectItem>
                      <SelectItem value="Grupo Ciclista">Grupo Ciclista</SelectItem>
                      <SelectItem value="Departamento Infantil">Departamento Infantil</SelectItem>
                      <SelectItem value="Clase Dorcas">Clase Dorcas</SelectItem>
                      <SelectItem value="Departamento Juvenil">Departamento Juvenil</SelectItem>
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
                    <Input placeholder="Título de la alabanza" {...field} />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona velocidad" />
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
            </div>
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
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
