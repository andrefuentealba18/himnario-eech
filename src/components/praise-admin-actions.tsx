"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Praise } from '@/lib/praises';
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
import { Settings, Edit, Trash2, ShieldCheck, Sparkles } from 'lucide-react';
import { EditPraiseDialog } from './edit-praise-dialog';
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

interface PraiseAdminActionsProps {
  praise: Praise;
  onDelete: () => Promise<void>;
  onUpdate: (data: Omit<Praise, 'id'>) => Promise<{ success: boolean }>;
}

const passwordSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida.'),
});

export function PraiseAdminActions({ praise, onDelete, onUpdate }: PraiseAdminActionsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    if (values.password === '4002') {
      toast({ 
        variant: 'success',
        title: 'Acceso concedido' 
      });
      setIsAuthenticated(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Clave Incorrecta',
        description: 'Inténtalo de nuevo.',
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

  const handleUpdate = async (data: Omit<Praise, 'id'>) => {
    const result = await onUpdate(data);
    return result;
  }
  
  const handleSaveComplete = () => {
      handleOpenChange(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full h-12 w-12 bg-white/50 dark:bg-white/5 border-none shadow-inner active:scale-90 transition-all">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Configuración</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={isAuthenticated ? "sm:max-w-lg rounded-[2.5rem]" : "w-[95vw] max-w-[320px] rounded-[2.5rem] p-0 border-none shadow-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl overflow-hidden"} onCloseAutoFocus={(e) => e.preventDefault()}>
        {!isAuthenticated ? (
          <div className="p-8">
            <DialogHeader className="text-center space-y-4">
              <div className="relative mx-auto w-fit">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <div className="relative p-4 bg-gradient-to-tr from-primary to-blue-400 rounded-full shadow-xl">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Acceso Admin</DialogTitle>
                <DialogDescription className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                  Confirma tu clave
                </DialogDescription>
              </div>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onPasswordSubmit)} className="space-y-6 py-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Contraseña</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••" 
                          {...field} 
                          className="text-center tracking-[0.8em] font-black h-14 text-xl rounded-[1rem] border-2 bg-white/50 dark:bg-white/5 focus:border-primary transition-all shadow-inner" 
                          autoFocus 
                        />
                      </FormControl>
                      <FormMessage className="text-center text-[10px] font-bold uppercase mt-2" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full rounded-[1rem] h-14 font-black uppercase tracking-widest shadow-lg shadow-primary/20 bg-primary text-white">
                  Entrar
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl font-bold">Administrar Alabanza</DialogTitle>
              <DialogDescription className="text-sm">¿Qué deseas hacer con "{praise.title}"?</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 pt-6">
                <EditPraiseDialog praise={praise} onPraiseUpdated={handleUpdate} onSaveComplete={handleSaveComplete}>
                    <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-2">
                        <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                </EditPraiseDialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full h-12 rounded-xl font-bold shadow-lg shadow-red-200 dark:shadow-none">
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-[2.5rem]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold">¿Estás realmente seguro?</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                                Esta acción no se puede deshacer. Se eliminará permanentemente la alabanza "{praise.title}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2">
                            <AlertDialogCancel className="rounded-xl h-12 font-bold">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete} className="rounded-xl h-12 font-bold bg-destructive">Sí, eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
