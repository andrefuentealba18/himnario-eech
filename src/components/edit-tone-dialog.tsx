"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const passwordSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida.'),
});

const toneSchema = z.object({
  tone: z.string().min(1, 'Debes seleccionar una tonalidad.'),
});

type FormData = z.infer<typeof toneSchema>;

interface EditToneDialogProps {
  children: React.ReactNode;
  song: { title: string; tone?: string };
  onToneUpdated: (newTone: string) => { success: boolean };
}

export function EditToneDialog({ children, song, onToneUpdated }: EditToneDialogProps) {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const toneForm = useForm<FormData>({
    resolver: zodResolver(toneSchema),
    defaultValues: {
      tone: song.tone || '',
    },
  });

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    if (values.password === 'Pablito_4002') {
      toast({ title: 'Acceso concedido' });
      setIsAuthenticated(true);
      toneForm.reset({ tone: song.tone || '' });
    } else {
      toast({
        variant: 'destructive',
        title: 'Contraseña Incorrecta',
      });
      passwordForm.setValue('password', '');
    }
  }

  function onToneSubmit(values: FormData) {
    const result = onToneUpdated(values.tone);
    if (result.success) {
      toast({ title: 'Tonalidad actualizada' });
      handleOpenChange(false);
    }
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setTimeout(() => {
        setIsAuthenticated(false);
        passwordForm.reset();
        toneForm.reset({ tone: song.tone || '' });
      }, 300);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!isAuthenticated ? (
          <>
            <DialogHeader>
              <DialogTitle>Acceso de Administrador</DialogTitle>
              <DialogDescription>
                Ingresa la contraseña para cambiar la tonalidad.
              </DialogDescription>
            </DialogHeader>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 py-4">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" className="w-full">Acceder</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Cambiar Tonalidad</DialogTitle>
              <DialogDescription>Selecciona la nueva tonalidad para "{song.title}".</DialogDescription>
            </DialogHeader>
            <Form {...toneForm}>
              <form onSubmit={toneForm.handleSubmit(onToneSubmit)} className="space-y-6 pt-4">
                <FormField
                  control={toneForm.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tonalidad</FormLabel>
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
                <DialogFooter className="sm:justify-start gap-2">
                    <Button type="submit" className="w-full">Guardar</Button>
                    <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="w-full">Cancelar</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
