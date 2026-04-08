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
import { Settings, ShieldCheck, Download, Smartphone, Share, PlusSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Ajustes y Aplicación</DialogTitle>
          <DialogDescription>
            Instala el himnario en tu celular o accede al panel de administración.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="install" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="install">
              <Download className="mr-2 h-4 w-4" />
              Instalar App
            </TabsTrigger>
            <TabsTrigger value="admin">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="install" className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-sm">¿Cómo descargar el Himnario?</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Puedes tener el himnario como una aplicación real en tu pantalla de inicio siguiendo estos pasos:
                </p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="bg-muted h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold flex items-center gap-1">En Android (Chrome)</p>
                    <p className="text-[11px] text-muted-foreground">Toca los tres puntos (⋮) arriba a la derecha y selecciona <strong>"Instalar aplicación"</strong>.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="bg-muted h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold flex items-center gap-1">En iPhone (Safari)</p>
                    <p className="text-[11px] text-muted-foreground flex items-center flex-wrap gap-1">
                      Toca el botón compartir <Share className="h-3 w-3" /> abajo, luego busca y toca en <strong>"Agregar a inicio"</strong> <PlusSquare className="h-3 w-3" />.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-center text-slate-400 italic">
                Una vez instalada, la app funcionará mucho más rápido y en pantalla completa.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-2xl border border-primary/10">
              <ShieldCheck className="h-12 w-12 text-primary mb-2" />
              <p className="text-xs text-center text-muted-foreground">
                Acceso exclusivo para administradores del cancionero.
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
