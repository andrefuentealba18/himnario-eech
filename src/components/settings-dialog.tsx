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
import { Settings, ShieldCheck } from 'lucide-react';

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
        title: 'Acceso concedido',
        description: 'Redirigiendo...',
      });
      setOpen(false);
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
      <DialogContent className="w-[90vw] max-w-[320px] rounded-[2rem] p-6 border-none shadow-2xl overflow-hidden" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader className="space-y-2 text-center">
          <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight">Panel de Control</DialogTitle>
          <DialogDescription className="text-xs">
            Ingresa la clave maestra.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        className="text-center tracking-[0.8em] font-black h-12 text-xl rounded-xl border-2"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl shadow-lg shadow-primary/20">
                  Entrar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
