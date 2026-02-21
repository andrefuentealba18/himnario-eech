"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Hymn } from '@/lib/hymns';
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
import { useToast } from '@/hooks/use-toast';
import { Settings, Edit, Trash2 } from 'lucide-react';
import { EditHymnDialog } from './edit-hymn-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HymnAdminActionsProps {
  hymn: Hymn;
  onDelete: () => void;
  onUpdate: (data: Omit<Hymn, 'number'>) => { success: boolean };
}

const passwordSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida.'),
});

export function HymnAdminActions({ hymn, onDelete, onUpdate }: HymnAdminActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    if (values.password === 'Pablito_4002') {
      toast({ title: 'Acceso concedido' });
      setIsAuthenticated(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Contraseña Incorrecta',
        description: 'Por favor, inténtalo de nuevo.',
      });
      form.setValue('password', '');
    }
  }

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        setIsAuthenticated(false);
        form.reset();
      }, 300);
    }
  }

  const handleUpdate = (data: Omit<Hymn, 'number'>) => {
    const result = onUpdate(data);
    if(result.success){
      setDialogOpen(false);
    }
    return result;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-14 w-14">
          <Settings className="h-7 w-7" />
          <span className="sr-only">Configuración</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        {!isAuthenticated ? (
          <>
            <DialogHeader>
              <DialogTitle>Acceso de Administrador</DialogTitle>
              <DialogDescription>
                Ingresa la contraseña para editar o eliminar el himno.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onPasswordSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
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
                  <Button type="submit">Acceder</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Administrar Himno</DialogTitle>
              <DialogDescription>¿Qué deseas hacer con el himno #{hymn.number} "{hymn.title}"?</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 pt-4">
                <EditHymnDialog hymn={hymn} onHymnUpdated={handleUpdate}>
                    <Button variant="outline" className="w-full">
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                </EditHymnDialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará permanentemente el himno #{hymn.number}.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete}>Sí, eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
