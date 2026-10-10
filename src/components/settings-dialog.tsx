
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
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
import { Settings, ShieldCheck, Sparkles } from 'lucide-react';
import { useChurch } from '@/context/church-context';
import { MapPin } from 'lucide-react';

const passwordSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida.'),
});

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { currentChurch } = useChurch();

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof passwordSchema>) {
    if (values.password === '4002') {
      toast({ 
        title: '🔓 Desbloqueado',
        className: 'fixed right-4 top-4 bg-emerald-500 text-white rounded-full flex items-center justify-center px-4 py-2 text-xs font-black border-none shadow-2xl z-[100] !m-0'
      });
      setOpen(false);
      // Forzamos el reseteo de la animación para que se vea al entrar
      sessionStorage.removeItem('intro_seen_admin');
      router.push('/admin');
    } else {
      toast({
        variant: 'destructive',
        title: 'Contraseña Incorrecta',
        description: 'Inténtalo de nuevo.',
      });
    }
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]">
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] max-w-[320px] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-950 animate-in fade-in zoom-in-95 duration-300" onCloseAutoFocus={(e) => e.preventDefault()}>
        <div className="relative z-10">
          <DialogHeader className="space-y-6 text-center">
            <div className="mx-auto w-12 h-12 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-slate-700 dark:text-slate-300" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Panel de Control
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Ingresa la clave maestra
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="py-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Input 
                            type="password" 
                            placeholder="••••" 
                            {...field} 
                            className="text-center tracking-[1em] font-bold h-12 text-2xl rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 focus:ring-2 focus:ring-primary/20 transition-all text-slate-800 dark:text-white"
                            autoFocus
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-center font-bold text-[10px] uppercase pt-2" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full rounded-xl h-12 font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
                  
                  <span className="relative z-10 flex items-center justify-center">
                    Desbloquear Acceso
                  </span>
                </Button>
              </form>
            </Form>

          
            </div>

          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] flex items-center justify-center gap-2">
              <span className="h-px w-4 bg-slate-300 dark:bg-slate-700" />
              Seguridad EECH
              <span className="h-px w-4 bg-slate-300 dark:bg-slate-700" />
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
