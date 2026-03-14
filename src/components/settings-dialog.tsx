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
        description: 'Redirigiendo a la página de administración...',
      });
      setOpen(false);
      router.push('/admin');
    } else {
      toast({
        variant: 'destructive',
        title: 'Contraseña Incorrecta',
        description: 'Por favor, inténtalo de nuevo.',
      });
    }
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-primary transition-colors">
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Acceso Administrativo</DialogTitle>
          <DialogDescription>
            Ingresa la contraseña para acceder al panel de gestión de alabanzas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-2xl border border-primary/10">
            <ShieldCheck className="h-12 w-12 text-primary mb-2" />
            <p className="text-xs text-center text-muted-foreground">
              Esta sección es exclusiva para los encargados del cancionero.
            </p>
          </div>

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
                        placeholder="Ingresa la contraseña" 
                        {...field} 
                        className="text-center tracking-[0.5em] font-bold h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20">
                  Entrar al Panel
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
