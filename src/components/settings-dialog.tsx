
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
        variant: 'success',
        title: 'Acceso concedido',
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
      <DialogContent className="w-[95vw] max-w-[340px] rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl" onCloseAutoFocus={(e) => e.preventDefault()}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 p-8">
          <DialogHeader className="space-y-4 text-center">
            <div className="relative mx-auto group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse group-hover:scale-[2] transition-transform duration-700" />
              <div className="relative p-4 bg-gradient-to-tr from-primary to-blue-400 rounded-full w-fit mx-auto shadow-xl shadow-primary/20">
                <ShieldCheck className="h-8 w-8 text-white animate-in zoom-in-50 duration-500" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-4 w-4 text-amber-400 animate-spin-slow" />
              </div>
            </div>
            
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Panel de Control
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                Ingresa la clave maestra
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="py-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          className="text-center tracking-[0.8em] font-black h-16 text-2xl rounded-[1.25rem] border-2 border-slate-100 dark:border-white/10 bg-white/50 dark:bg-white/5 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-inner"
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage className="text-center font-bold text-[10px] uppercase" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full h-14 text-sm font-black uppercase tracking-widest rounded-[1.25rem] shadow-lg shadow-primary/30 bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all">
                  Desbloquear Acceso
                </Button>
              </form>
            </Form>
          </div>

          <div className="text-center">
            <p className="text-[8px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.3em]">
              Ejército Evangélico de Chile
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
