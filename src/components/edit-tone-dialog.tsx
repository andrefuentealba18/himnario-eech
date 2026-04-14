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
import { ShieldCheck, Sparkles } from 'lucide-react';

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
  onToneUpdated: (newTone: string) => Promise<{ success: boolean; error?: string }>;
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
      toast({ 
        variant: 'success',
        title: 'Tonalidad actualizada' 
      });
      handleOpenChange(false);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo guardar la tonalidad.' });
    }
  }
  
  function onPasswordSubmit(values: PasswordFormData) {
    if (values.password === '4002') {
      toast({ 
        variant: 'success',
        title: 'Acceso concedido' 
      });
      setIsAuthenticated(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Contraseña Incorrecta',
        description: 'Por favor, inténtalo de nuevo.',
      });
    }
    passwordForm.reset();
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
      <DialogContent className={isAuthenticated ? "sm:max-w-md rounded-[2.5rem]" : "w-[95vw] max-w-[320px] rounded-[2.5rem] p-0 border-none shadow-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl overflow-hidden"}>
        {!isAuthenticated ? (
           <div className="p-8">
             <DialogHeader className="text-center space-y-4">
               <div className="relative mx-auto w-fit">
                 <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                 <div className="relative p-4 bg-gradient-to-tr from-primary to-blue-400 rounded-full shadow-xl">
                   <ShieldCheck className="h-7 w-7 text-white" />
                 </div>
               </div>
               <div className="space-y-1">
                 <DialogTitle className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Admin</DialogTitle>
                 <DialogDescription className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                   Ingresa la clave para editar
                 </DialogDescription>
               </div>
             </DialogHeader>
             <Form {...passwordForm}>
               <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6 py-6">
                 <FormField
                   control={passwordForm.control}
                   name="password"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel className="sr-only">Contraseña</FormLabel>
                       <FormControl>
                         <Input 
                           type="password" 
                           placeholder="••••" 
                           {...field} 
                           className="text-center tracking-[0.8em] font-black h-14 text-xl rounded-[1rem] border-2 bg-white/50 dark:bg-white/5 focus:border-primary transition-all shadow-inner" 
                           autoFocus 
                         />
                       </FormControl>
                       <FormMessage className="text-center text-[10px] font-bold uppercase mt-2" />
                     </FormItem>
                   )}
                 />
                 <Button type="submit" className="w-full rounded-[1rem] h-14 font-black uppercase tracking-widest shadow-lg shadow-primary/20 bg-primary text-white">
                   Acceder
                 </Button>
               </form>
             </Form>
           </div>
        ) : (
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl font-bold">Cambiar Tonalidad</DialogTitle>
              <DialogDescription className="text-sm">Escribe o selecciona la nueva tonalidad para "{song.title}".</DialogDescription>
            </DialogHeader>
            <Form {...toneForm}>
              <form onSubmit={toneForm.handleSubmit(onToneSubmit)} className="space-y-4 pt-6">
                <FormField
                  control={toneForm.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-[10px] uppercase tracking-widest ml-1">Tonalidad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Escribe o busca una tonalidad..."
                          {...field}
                          className="rounded-xl h-12 border-2"
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

                <ScrollArea className="h-48 w-full rounded-xl border-2 bg-slate-50 dark:bg-black/20">
                  <div className="p-2">
                    {filteredKeys.length > 0 ? (
                      filteredKeys.map(key => (
                        <div
                          key={key}
                          className="text-sm font-bold p-3 cursor-pointer rounded-lg hover:bg-primary hover:text-white transition-colors mb-1"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleKeySelection(key);
                          }}
                        >
                          {key}
                        </div>
                      ))
                    ) : (
                      <p className="p-4 text-xs font-bold uppercase text-center text-muted-foreground opacity-50">No se hallaron tonos</p>
                    )}
                  </div>
                </ScrollArea>
                
                <DialogFooter className="sm:justify-start gap-3 pt-4">
                    <Button type="submit" className="flex-1 h-12 rounded-xl font-bold">Guardar</Button>
                    <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="flex-1 h-12 rounded-xl font-bold border-2">Cancelar</Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
