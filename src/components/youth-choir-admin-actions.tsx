"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { YouthChoir } from '@/lib/youth-choirs';
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
import { EditYouthChoirDialog } from './edit-youth-choir-dialog';
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

interface YouthChoirAdminActionsProps {
  youthChoir: YouthChoir;
  onDelete: () => Promise<void>;
  onUpdate: (data: Omit<YouthChoir, 'id'>) => Promise<{ success: boolean }>;
}

const passwordSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida.'),
});

export function YouthChoirAdminActions({ youthChoir, onDelete, onUpdate }: YouthChoirAdminActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    if (values.password === '4002') {
      toast({ title: 'Acceso concedido' });
      setIsAuthenticated(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Contraseña Incorrecta',
        description: 'Por favor, inténtalo de nuevo.',
      });
    }
    form.reset();
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

  const handleUpdate = async (data: Omit<YouthChoir, 'id'>) => {
    const result = await onUpdate(data);
    return result;
  }
  
  const handleSaveComplete = () => {
      handleOpenChange(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Configuración</span>
        </Button>
      </DialogTrigger>
      <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        {!isAuthenticated ? (
          <>
            <DialogHeader>
              <DialogTitle>Acceso de Administrador</DialogTitle>
              <DialogDescription>
                Ingresa la contraseña para editar o eliminar la alabanza.
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
              <DialogTitle>Administrar Alabanza</DialogTitle>
              <DialogDescription>¿Qué deseas hacer con "{youthChoir.title}"?</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 pt-4">
                <EditYouthChoirDialog youthChoir={youthChoir} onYouthChoirUpdated={handleUpdate} onSaveComplete={handleSaveComplete}>
                    <Button variant="outline" className="w-full">
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                </EditYouthChoirDialog>

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
                                Esta acción no se puede deshacer. Se eliminará permanentemente la alabanza "{youthChoir.title}".
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
