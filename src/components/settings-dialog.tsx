
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

const passwordSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida.'),
});

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

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
      <DialogContent className="w-[95vw] max-w-[360px] rounded-[3rem] p-0 border border-white/20 dark:border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.15)] bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl overflow-hidden" onCloseAutoFocus={(e) => e.preventDefault()}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px]" />
        </div>

        <div className="p-8 sm:p-10 relative z-10">
          <DialogHeader className="space-y-6 text-center">
            <div className="relative mx-auto group">
              <div className="absolute inset-0 bg-primary/40 blur-[40px] rounded-full scale-150 animate-pulse duration-1000 group-hover:scale-[2] transition-transform" />
              <div className="relative p-5 bg-gradient-to-tr from-primary via-blue-500 to-cyan-400 rounded-[1.5rem] rotate-3 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.4)] transition-transform hover:rotate-6">
                <ShieldCheck className="h-10 w-10 text-white -rotate-3 animate-in zoom-in-50 duration-500" />
              </div>
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-5 w-5 text-amber-400 animate-spin-slow" />
              </div>
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
                Panel de Control
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold tracking-[0.3em] text-slate-500 dark:text-slate-400 uppercase">
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
                        <Input 
                          type="password" 
                          placeholder="••••" 
                          {...field} 
                          className="text-center tracking-[1em] font-black h-14 text-xl rounded-2xl border-0 bg-black/5 dark:bg-white/5 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/20 backdrop-blur-md shadow-inner transition-all hover:bg-black/10 dark:hover:bg-white/10"
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage className="text-center font-bold text-xs uppercase" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full rounded-[2rem] h-16 font-black text-lg uppercase tracking-widest bg-gradient-to-r from-primary to-blue-600 focus:ring-4 focus:ring-primary/50 text-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)]">
                  Desbloquear Acceso
                </Button>
              </form>
            </Form>
          </div>

          <div className="text-center">
            <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">
              Ejército Evangélico de Chile
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
