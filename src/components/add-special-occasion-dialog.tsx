
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
import { Plus, ShieldCheck, Search, Copy, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
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
    const term = searchSong.toLowerCase().trim();
    if (!term) return [];
    return allSongs.filter(s => 
      s.title.toLowerCase().includes(term) || 
      (s.type === 'Himno' && s.title.includes(term))
    ).slice(0, 15);
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
      toast({ title: "Acceso autorizado", description: "Ya puedes gestionar las categorías especiales." });
    } else {
      toast({ variant: "destructive", title: "Clave incorrecta" });
    }
  };

  const selectSongToCopy = (song: any) => {
    form.setValue('title', song.title.replace(/^\d+\.\s*/, ''));
    form.setValue('lyrics', song.lyrics);
    form.setValue('tone', song.tone || '');
    toast({ 
      title: "Canto Seleccionado", 
      description: "Datos copiados. Selecciona la categoría destino y guarda.",
    });
  };

  function onSubmit(values: FormData) {
    addSpecialOccasion({ ...values, status: 'approved' });
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
        <Button variant="outline" size="sm" className="rounded-full h-10 px-4 border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all font-bold">
          <Plus className="mr-1.5 h-4 w-4" />
          Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-lg max-h-[92vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-[2.5rem] bg-background">
        {!isAuthenticated ? (
          <div className="p-8 space-y-8 flex flex-col items-center">
            <div className="p-5 bg-amber-50 rounded-full">
              <ShieldCheck className="h-12 w-12 text-amber-600" />
            </div>
            <div className="space-y-2 text-center">
              <DialogTitle className="text-2xl font-bold tracking-tight">Zona de Administración</DialogTitle>
              <DialogDescription>Solo el administrador puede asignar cantos a ocasiones especiales.</DialogDescription>
            </div>
            <form onSubmit={handleAuth} className="w-full space-y-4">
              <Input 
                type="password" 
                placeholder="Ingresa la clave maestra" 
                className="text-center tracking-[0.6em] font-black h-14 text-xl rounded-2xl border-2 focus:border-amber-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <Button type="submit" className="w-full h-14 text-lg font-bold rounded-2xl bg-amber-600 hover:bg-amber-700 shadow-lg shadow-amber-200">
                Validar Identidad
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="px-6 pt-8 pb-4 border-b bg-muted/30">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <DialogTitle className="text-xl font-bold">Asignar Canto Especial</DialogTitle>
                  <p className="text-xs text-muted-foreground">Importa desde tu lista o escribe uno nuevo.</p>
                </div>
                <Badge className="bg-amber-600">Admin</Badge>
              </div>
              <Tabs defaultValue="import" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-2xl h-12 p-1 bg-slate-200/50">
                  <TabsTrigger value="import" className="rounded-xl text-xs font-black uppercase tracking-widest">
                    <Search className="h-3.5 w-3.5 mr-2" /> Importar
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="rounded-xl text-xs font-black uppercase tracking-widest">
                    <Plus className="h-3.5 w-3.5 mr-2" /> Manual
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6">
                <Tabs defaultValue="import" className="w-full">
                  <TabsContent value="import" className="mt-0 space-y-6">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-amber-600 transition-colors" />
                      <Input 
                        placeholder="Escribe título o número..." 
                        className="pl-12 h-14 rounded-2xl border-2 bg-background focus:ring-4 focus:ring-amber-500/10"
                        value={searchSong}
                        onChange={(e) => setSearchSong(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      {filteredSongs.length > 0 ? filteredSongs.map((song, i) => (
                        <button
                          key={i}
                          onClick={() => selectSongToCopy(song)}
                          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all text-left shadow-sm active:scale-[0.98]"
                        >
                          <div className="flex-1 min-w-0 mr-4">
                            <p className="font-bold text-sm text-slate-900 truncate">{song.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-black uppercase tracking-tighter text-amber-600/70">{song.type}</span>
                              {song.tone && <span className="text-[9px] font-bold text-slate-400">· {song.tone}</span>}
                            </div>
                          </div>
                          <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600">
                            <Copy className="h-4 w-4" />
                          </div>
                        </button>
                      )) : searchSong ? (
                        <div className="py-12 text-center space-y-2 opacity-50">
                          <Search className="h-10 w-10 mx-auto text-slate-300" />
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No hay coincidencias</p>
                        </div>
                      ) : (
                        <div className="py-12 text-center space-y-3 opacity-40">
                          <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                            <Plus className="h-8 w-8 text-slate-400" />
                          </div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Busca un canto para empezar</p>
                        </div>
                      )}
                    </div>

                    {form.watch('title') && (
                      <div className="p-4 rounded-2xl bg-green-50 border border-green-100 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-2 text-green-700 mb-4">
                          <CheckCircle2 className="h-5 w-5" />
                          <p className="text-xs font-bold">Canto cargado: "{form.watch('title')}"</p>
                        </div>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Asignar a:</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="rounded-xl h-12 bg-white border-2">
                                        <SelectValue placeholder="Categoría" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Predicación">🎤 Predicación</SelectItem>
                                      <SelectItem value="Fúnebre">⛪ Fúnebre</SelectItem>
                                      <SelectItem value="Cumpleaños">🎁 Cumpleaños</SelectItem>
                                      <SelectItem value="Bautismos">💧 Bautismos</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                            <Button type="submit" className="w-full h-12 font-bold rounded-xl bg-green-600 hover:bg-green-700 shadow-md">
                              Guardar en {form.watch('category')}
                            </Button>
                          </form>
                        </Form>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="manual" className="mt-0">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Categoría</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="rounded-2xl h-14 border-2">
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
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Título</FormLabel>
                              <FormControl>
                                <Input placeholder="Título del canto" className="rounded-2xl h-14 border-2" {...field} />
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
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Tonalidad</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="rounded-2xl h-14 border-2">
                                    <SelectValue placeholder="Selecciona tono (opcional)" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {musicalKeys.map(key => (
                                    <SelectItem key={key} value={key}>{key}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lyrics"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Letra</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Escribe la letra aquí..." className="h-48 rounded-2xl border-2 resize-none p-4" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full h-14 font-bold text-lg rounded-2xl bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-100">
                          Publicar Canto
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
