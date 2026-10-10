
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
      <DialogContent className="w-[95vw] max-w-[380px] rounded-[3rem] p-0 border border-white/40 dark:border-white/10 shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)] bg-white/70 dark:bg-slate-950/60 backdrop-blur-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-500" onCloseAutoFocus={(e) => e.preventDefault()}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-500/30 dark:bg-blue-600/20 rounded-full blur-[80px] animate-pulse-slow" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-amber-400/20 dark:bg-amber-500/20 rounded-full blur-[80px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/10 dark:from-white/5 dark:to-transparent" />
          <div className="absolute inset-0 design-grid opacity-[0.05]" />
        </div>

        <div className="p-8 sm:p-10 relative z-10">
          <DialogHeader className="space-y-6 text-center">
            <div className="relative mx-auto group">
              <div className="absolute inset-0 bg-primary/40 blur-[40px] rounded-full scale-[1.8] animate-pulse-ring" />
              <div className="relative p-5 bg-gradient-to-tr from-blue-600 via-primary to-cyan-400 rounded-[1.8rem] shadow-[0_0_40px_rgba(59,130,246,0.5)] transition-transform hover:scale-110 duration-500 ring-2 ring-white/50 dark:ring-white/20">
                <ShieldCheck className="h-12 w-12 text-white animate-float" />
              </div>
              <div className="absolute -top-3 -right-3">
                <Sparkles className="h-6 w-6 text-amber-400 animate-spin-slow drop-shadow-md" />
              </div>
            </div>
            
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-blue-100 dark:to-slate-300 drop-shadow-sm">
                Panel de Control
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold tracking-[0.4em] text-primary/80 dark:text-blue-400 uppercase">
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
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                          <Input 
                            type="password" 
                            placeholder="••••" 
                            {...field} 
                            className="relative text-center tracking-[1.5em] font-black h-16 text-3xl rounded-2xl border border-white/50 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/20 backdrop-blur-xl shadow-inner transition-all text-slate-800 dark:text-white"
                            autoFocus
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-center font-bold text-[10px] uppercase pt-2" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full rounded-[2rem] h-16 font-black text-sm uppercase tracking-widest bg-gradient-to-r from-blue-600 via-primary to-cyan-500 focus:ring-4 focus:ring-primary/50 text-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_40px_-10px_rgba(59,130,246,0.8)] border border-white/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
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
