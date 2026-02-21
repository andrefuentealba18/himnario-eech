"use client";

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { musicalKeys } from '@/lib/musical-keys';
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
import { ScrollArea } from '@/components/ui/scroll-area';

const toneSchema = z.object({
  tone: z.string().min(1, 'Debes escribir o seleccionar una tonalidad.'),
});
type ToneFormData = z.infer<typeof toneSchema>;

const passwordSchema = z.object({
  password: z.string().min(1, 'La contraseña es requerida.'),
});
type PasswordFormData = z.infer<typeof passwordSchema>;

interface EditToneDialogProps {
  children: React.ReactNode;
  song: { title: string; tone?: string };
  onToneUpdated: (newTone: string) => Promise<{ success: boolean }>;
}

export function EditToneDialog({ children, song, onToneUpdated }: EditToneDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const requiresAuth = !!song.tone;

  const toneForm = useForm<ToneFormData>({
    resolver: zodResolver(toneSchema),
    defaultValues: {
      tone: song.tone || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  });

  const filteredKeys = useMemo(() =>
    musicalKeys.filter(key =>
      key.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

  useEffect(() => {
    if (open) {
      const initialTone = song.tone || '';
      toneForm.setValue('tone', initialTone);
      setSearchTerm(initialTone);
      if (!requiresAuth) {
        setIsAuthenticated(true);
      }
    }
  }, [open, song.tone, toneForm, requiresAuth]);


  async function onToneSubmit(values: ToneFormData) {
    const result = await onToneUpdated(values.tone);
    if (result.success) {
      toast({ title: 'Tonalidad actualizada' });
      handleOpenChange(false);
    }
  }
  
  function onPasswordSubmit(values: PasswordFormData) {
    if (values.password === 'Pablito_4002') {
      toast({ title: 'Acceso concedido' });
      setIsAuthenticated(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Contraseña Incorrecta',
        description: 'Por favor, inténtalo de nuevo.',
      });
      passwordForm.reset();
    }
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setTimeout(() => {
        toneForm.reset({ tone: song.tone || '' });
        passwordForm.reset({ password: '' });
        setSearchTerm('');
        setIsAuthenticated(false);
      }, 300);
    }
  }

  const handleKeySelection = (key: string) => {
    toneForm.setValue('tone', key, { shouldValidate: true });
    setSearchTerm(key);
  };


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!isAuthenticated ? (
           <>
             <DialogHeader>
               <DialogTitle>Acceso de Administrador</DialogTitle>
               <DialogDescription>
                 Ingresa la contraseña para cambiar la tonalidad.
               </DialogDescription>
             </DialogHeader>
             <Form {...passwordForm}>
               <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 py-4">
                 <FormField
                   control={passwordForm.control}
                   name="password"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Contraseña</FormLabel>
                       <FormControl>
                         <Input type="password" placeholder="••••••••" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <DialogFooter>
                   <Button type="submit">Acceder</Button>
                 </DialogFooter>
               </form>
             </Form>
           </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Cambiar Tonalidad</DialogTitle>
              <DialogDescription>Escribe o selecciona la nueva tonalidad para "{song.title}".</DialogDescription>
            </DialogHeader>
            <Form {...toneForm}>
              <form onSubmit={toneForm.handleSubmit(onToneSubmit)} className="space-y-4 pt-4">
                <FormField
                  control={toneForm.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tonalidad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escribe o busca una tonalidad..."
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setSearchTerm(e.target.value);
                          }}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ScrollArea className="h-40 w-full rounded-md border">
                  <div className="p-1">
                    {filteredKeys.length > 0 ? (
                      filteredKeys.map(key => (
                        <div
                          key={key}
                          className="text-sm p-2 cursor-pointer rounded-sm hover:bg-accent"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleKeySelection(key);
                          }}
                        >
                          {key}
                        </div>
                      ))
                    ) : (
                      <p className="p-2 text-sm text-muted-foreground">No se encontraron tonalidades.</p>
                    )}
                  </div>
                </ScrollArea>
                
                <DialogFooter className="sm:justify-start gap-2 pt-2">
                    <Button type="submit" className="w-full">Guardar</Button>
                    <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="w-full">Cancelar</Button>
                </DialogFooter>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
