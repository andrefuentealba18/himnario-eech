
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { musicalKeys } from '@/lib/musical-keys';
import type { SpecialOccasion, SpecialCategory } from '@/lib/special-occasions';
import { useSpecialOccasions } from '@/context/special-occasions-context';
import { useHymns } from '@/context/hymns-context';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, ShieldCheck, Search, Check, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const specialOccasionSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  category: z.enum(["Predicación", "Fúnebre", "Cumpleaños", "Bautismos"], {
    required_error: "Debes seleccionar una categoría."
  }),
  tone: z.string().optional(),
  lyrics: z.string().min(1, 'La letra es requerida.'),
});

type FormData = z.infer<typeof specialOccasionSchema>;

interface AddSpecialOccasionDialogProps {
  initialCategory?: SpecialCategory;
}

export function AddSpecialOccasionDialog({ initialCategory }: AddSpecialOccasionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchSong, setSearchSong] = useState('');
  const { addSpecialOccasion } = useSpecialOccasions();
  const { toast } = useToast();

  // Data for song picker
  const { hymns } = useHymns();
  const { praises } = usePraises();
  const { choirs } = useChoirs();
  const { youthChoirs } = useYouthChoirs();

  const allSongs = useMemo(() => {
    return [
      ...hymns.map(h => ({ title: `${h.number}. ${h.title}`, lyrics: h.lyrics, tone: h.tone, type: 'Himno' })),
      ...praises.map(p => ({ title: p.title, lyrics: p.lyrics, tone: p.tone, type: 'Alabanza' })),
      ...choirs.map(c => ({ title: c.title, lyrics: c.lyrics, tone: c.tone, type: 'Coro' })),
      ...youthChoirs.map(yc => ({ title: yc.title, lyrics: yc.lyrics, tone: yc.tone, type: 'Agrupación' })),
    ].sort((a, b) => a.title.localeCompare(b.title));
  }, [hymns, praises, choirs, youthChoirs]);

  const filteredSongs = useMemo(() => {
    if (!searchSong) return [];
    return allSongs.filter(s => s.title.toLowerCase().includes(searchSong.toLowerCase())).slice(0, 20);
  }, [allSongs, searchSong]);

  const form = useForm<FormData>({
    resolver: zodResolver(specialOccasionSchema),
    defaultValues: {
      title: '',
      category: initialCategory || "Predicación",
      tone: '',
      lyrics: '',
    },
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '4002') {
      setIsAuthenticated(true);
      toast({ title: "Acceso concedido" });
    } else {
      toast({ variant: "destructive", title: "Contraseña incorrecta" });
    }
  };

  const selectSongToCopy = (song: any) => {
    form.setValue('title', song.title.replace(/^\d+\.\s*/, ''));
    form.setValue('lyrics', song.lyrics);
    form.setValue('tone', song.tone || '');
    toast({ title: "Canto seleccionado", description: "Se han copiado los datos al formulario." });
  };

  function onSubmit(values: FormData) {
    // Como es administrador, lo mandamos como aprobado directamente
    addSpecialOccasion({ ...values, status: 'approved' as any });
    setOpen(false);
    resetDialog();
  }

  const resetDialog = () => {
    setIsAuthenticated(false);
    setPassword('');
    setSearchSong('');
    form.reset({
      title: '',
      category: initialCategory || "Predicación",
      tone: '',
      lyrics: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if(!o) resetDialog(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full h-10 px-4 border-primary/30 text-primary hover:bg-primary/5">
          <Plus className="mr-1 h-4 w-4" />
          Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-[2rem]">
        {!isAuthenticated ? (
          <div className="p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-center flex flex-col items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                Acceso de Administración
              </DialogTitle>
              <DialogDescription className="text-center">
                Ingresa la clave maestra para gestionar Ocasiones Especiales.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input 
                type="password" 
                placeholder="Contraseña" 
                className="text-center tracking-[0.5em] font-bold h-12 text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="w-full h-12 font-bold">Validar Acceso</Button>
            </form>
          </div>
        ) : (
          <Tabs defaultValue="manual" className="w-full h-full flex flex-col">
            <div className="px-6 pt-6 pb-2 border-b bg-muted/20">
              <DialogHeader className="mb-4">
                <DialogTitle>Agregar Canto Especial</DialogTitle>
                <DialogDescription>Importa uno existente o escribe uno nuevo.</DialogDescription>
              </DialogHeader>
              <TabsList className="grid w-full grid-cols-2 rounded-full h-10">
                <TabsTrigger value="manual" className="rounded-full text-xs font-bold">Escribir Nuevo</TabsTrigger>
                <TabsTrigger value="import" className="rounded-full text-xs font-bold">Importar Existente</TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 p-6 overflow-y-auto">
              <TabsContent value="import" className="mt-0 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar en Himnos, Alabanzas o Coros..." 
                    className="pl-10 rounded-xl"
                    value={searchSong}
                    onChange={(e) => setSearchSong(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  {filteredSongs.length > 0 ? filteredSongs.map((song, i) => (
                    <button
                      key={i}
                      onClick={() => selectSongToCopy(song)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all text-left group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{song.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{song.type}</p>
                      </div>
                      <Copy className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )) : searchSong ? (
                    <p className="text-center py-10 text-xs text-muted-foreground font-bold uppercase tracking-widest">No se encontraron resultados</p>
                  ) : (
                    <div className="text-center py-10 opacity-40">
                      <Search className="h-10 w-10 mx-auto mb-2" />
                      <p className="text-xs font-bold uppercase tracking-widest">Busca un canto para copiar</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="manual" className="mt-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categoría Destino</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl h-11">
                                <SelectValue placeholder="Selecciona la ocasión" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Predicación">🎤 Predicación</SelectItem>
                              <SelectItem value="Fúnebre">⛪ Fúnebre</SelectItem>
                              <SelectItem value="Cumpleaños">🎁 Cumpleaños</SelectItem>
                              <SelectItem value="Bautismos">💧 Bautismos</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Título</FormLabel>
                          <FormControl>
                            <Input placeholder="Título del canto" className="rounded-xl h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tonalidad</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="rounded-xl h-11">
                                <SelectValue placeholder="Opcional" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {musicalKeys.map(key => (
                                <SelectItem key={key} value={key}>{key}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lyrics"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Letra</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Letra del canto..." className="h-40 rounded-xl resize-none" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full h-12 font-bold shadow-lg shadow-primary/20 rounded-xl">
                      Guardar Canto Especial
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
