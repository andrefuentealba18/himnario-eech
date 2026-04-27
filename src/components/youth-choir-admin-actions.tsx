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
import { Settings, Edit, Trash2, ShieldCheck } from 'lucide-react';
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
      toast({ 
        title: '🔓 Desbloqueado',
        className: 'fixed right-4 top-4 bg-emerald-500 text-white rounded-full flex items-center justify-center px-4 py-2 text-xs font-black border-none shadow-2xl z-[100] !m-0'
      });
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
      <DialogContent className={isAuthenticated ? "sm:max-w-lg rounded-[2.5rem]" : "w-[95vw] max-w-[360px] rounded-[3rem] p-0 border border-white/20 dark:border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.15)] bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl overflow-hidden"} onCloseAutoFocus={(e) => e.preventDefault()}>
        {!isAuthenticated ? (
          <div className="p-8 sm:p-10 relative z-10">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px]" />
            </div>
            
            <DialogHeader className="text-center space-y-6 relative">
              <div className="relative mx-auto w-fit">
                <div className="absolute inset-0 bg-primary/40 blur-[40px] rounded-full scale-150 animate-pulse duration-1000" />
                <div className="relative p-5 bg-gradient-to-tr from-primary via-blue-500 to-cyan-400 rounded-[1.5rem] rotate-3 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.4)] transition-transform hover:rotate-6">
                  <ShieldCheck className="h-10 w-10 text-white -rotate-3" />
                </div>
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
                  Acceso Seguro
                </DialogTitle>
                <DialogDescription className="text-[10px] font-bold tracking-[0.3em] text-slate-500 dark:text-slate-400 uppercase">
                  Clave Maestra
                </DialogDescription>
              </div>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onPasswordSubmit)} className="space-y-8 py-8 relative">
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
                          className="text-center tracking-[1em] font-black h-14 text-xl rounded-2xl border-0 bg-black/5 dark:bg-white/5 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/20 backdrop-blur-md shadow-inner transition-all hover:bg-black/10 dark:hover:bg-white/10" 
                          autoFocus 
                        />
                      </FormControl>
                      <FormMessage className="text-center font-bold text-xs" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full rounded-[2rem] h-16 font-black text-lg uppercase tracking-widest bg-gradient-to-r from-primary to-blue-600 focus:ring-4 focus:ring-primary/50 text-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)]">
                  Desbloquear
                </Button>
              </form>
            </Form>
          </div>
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
