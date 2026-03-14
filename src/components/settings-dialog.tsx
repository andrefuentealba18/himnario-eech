
"use client";

import { useState, useEffect } from 'react';
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
import { Settings, Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const passwordSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida.'),
});

export function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Detectar preferencia de sistema o guardada
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
        <Button variant="ghost">
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Preferencias y Acceso</DialogTitle>
          <DialogDescription>
            Configura la apariencia de la app o accede al panel administrativo.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 border-y space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base font-bold">Modo Oscuro</Label>
              <p className="text-xs text-muted-foreground">Cambia el tema para descansar la vista.</p>
            </div>
            <div className="flex items-center gap-2">
              {isDarkMode ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-yellow-500" />}
              <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="text-center space-y-1 mb-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary/60">Administración</h4>
            <p className="text-xs text-muted-foreground">Requiere contraseña para cambios en la base de datos.</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña de Acceso</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} className="text-center tracking-widest" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="w-full">Acceder al Panel</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
