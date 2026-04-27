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
import { Plus, ShieldCheck, Search, CheckCircle2, ChevronRight, ListChecks, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn, normalizeSearchTerm } from '@/lib/utils';

const specialOccasionSchema = z.object({
  title: z.string().min(1, 'El título es requerido.'),
  category: z.enum(["Predicación", "Fúnebre", "Cumpleaños", "Bautismos"], {
    required_error: "Debes seleccionar una categoría."
  }),
  tone: z.string().optional(),
  hymnNumber: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().optional()
  ),
  lyrics: z.string().min(1, 'La letra es requerida.'),
});

type FormData = z.infer<typeof specialOccasionSchema>;

interface AddSpecialOccasionDialogProps {
  initialCategory?: SpecialCategory;
}

type SelectableSong = {
  title: string;
  lyrics: string;
  tone?: string;
  type: string;
  id: string;
  hymnNumber?: number;
  _searchIndex: string;
};

export function AddSpecialOccasionDialog({ initialCategory }: AddSpecialOccasionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [searchSong, setSearchSong] = useState('');
  const [selectedSongs, setSelectedSongs] = useState<SelectableSong[]>([]);
  const [importCategory, setImportCategory] = useState<SpecialCategory>(initialCategory || "Predicación");
  const [isImporting, setIsImporting] = useState(false);
  
  const { addSpecialOccasion } = useSpecialOccasions();
  const { toast } = useToast();

  const { hymns } = useHymns();
  const { praises } = usePraises();
  const { choirs } = useChoirs();
  const { youthChoirs } = useYouthChoirs();

  const allSongs: SelectableSong[] = useMemo(() => {
    return [
      ...hymns.map(h => ({ 
        id: `hymn-${h.number}`, 
        title: h.title, 
        lyrics: h.lyrics, 
        tone: h.tone, 
        type: 'Himno',
        hymnNumber: h.number,
        _searchIndex: normalizeSearchTerm(`${h.title} ${h.number} ${h.lyrics} ${h.tone || ''}`)
      })),
      ...praises.map(p => ({ 
        id: `praise-${p.id}`, 
        title: p.title, 
        lyrics: p.lyrics, 
        tone: p.tone, 
        type: 'Alabanza',
        _searchIndex: normalizeSearchTerm(`${p.title} ${p.lyrics} ${p.tone || ''}`)
      })),
      ...choirs.map(c => ({ 
        id: `choir-${c.id}`, 
        title: c.title, 
        lyrics: c.lyrics, 
        tone: c.tone, 
        type: 'Coro',
        _searchIndex: normalizeSearchTerm(`${c.title} ${c.lyrics} ${c.tone || ''}`)
      })),
      ...youthChoirs.map(yc => ({ 
        id: `youth-${yc.id}`, 
        title: yc.title, 
        lyrics: yc.lyrics, 
        tone: yc.tone, 
        type: 'Agrupación',
        _searchIndex: normalizeSearchTerm(`${yc.title} ${yc.lyrics} ${yc.tone || ''} ${yc.group}`)
      })),
    ].sort((a, b) => a.title.localeCompare(b.title));
  }, [hymns, praises, choirs, youthChoirs]);

  const filteredSongs = useMemo(() => {
    const term = normalizeSearchTerm(searchSong.trim());
    if (!term) return [];
    return allSongs.filter(s => s._searchIndex.includes(term)).slice(0, 50);
  }, [allSongs, searchSong]);

  const form = useForm<FormData>({
    resolver: zodResolver(specialOccasionSchema),
    defaultValues: {
      title: '',
      category: initialCategory || "Predicación",
      tone: '',
      hymnNumber: undefined,
      lyrics: '',
    },
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '4002') {
      setIsAuthenticated(true);
      toast({ 
        title: '🔓 Desbloqueado',
        className: 'fixed right-4 top-4 bg-emerald-500 text-white rounded-full flex items-center justify-center px-4 py-2 text-xs font-black border-none shadow-2xl z-[100] !m-0'
      });
    } else {
      toast({ variant: "destructive", title: "Clave incorrecta" });
    }
  };

  const toggleSongSelection = (song: SelectableSong) => {
    setSelectedSongs(prev => {
      const exists = prev.find(s => s.id === song.id);
      if (exists) {
        return prev.filter(s => s.id !== song.id);
      }
      return [...prev, song];
    });
  };

  const handleBulkImport = async () => {
    if (selectedSongs.length === 0) return;
    setIsImporting(true);
    
    for (const song of selectedSongs) {
      await addSpecialOccasion({
        title: song.title,
        lyrics: song.lyrics,
        tone: song.tone,
        hymnNumber: song.hymnNumber,
        category: importCategory,
        status: 'approved'
      });
    }
    
    setIsImporting(false);
    toast({ 
      title: "Importación Exitosa", 
      description: `Se han añadido ${selectedSongs.length} cantos.` 
    });
    setOpen(false);
    resetDialog();
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
    setSelectedSongs([]);
    form.reset({
      title: '',
      category: initialCategory || "Predicación",
      tone: '',
      hymnNumber: undefined,
      lyrics: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if(!o) resetDialog(); }}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 h-10 rounded-full border border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100 transition-all font-bold active:scale-95">
          <Plus className="h-4 w-4" />
          <span className="text-xs uppercase tracking-widest">Agregar</span>
        </button>
      </DialogTrigger>
      <DialogContent className={cn(
        isAuthenticated ? "sm:max-w-2xl h-[95vh] rounded-[2.5rem]" : "w-[95vw] max-w-[360px] rounded-[3rem] p-0 border border-white/20 dark:border-slate-800 shadow-[0_0_60px_rgba(0,0,0,0.15)] bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl overflow-hidden",
        "transition-all duration-500 ease-in-out"
      )} onCloseAutoFocus={(e) => e.preventDefault()}>
        {!isAuthenticated ? (
          <div className="p-8 sm:p-10 relative z-10">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-400/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px]" />
            </div>
            
            <DialogHeader className="text-center space-y-6 relative">
              <div className="relative mx-auto w-fit">
                <div className="absolute inset-0 bg-amber-500/40 blur-[40px] rounded-full scale-150 animate-pulse duration-1000" />
                <div className="relative p-5 bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 rounded-[1.5rem] rotate-3 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.4)] transition-transform hover:rotate-6">
                  <ShieldCheck className="h-10 w-10 text-white -rotate-3" />
                </div>
              </div>
              <div className="space-y-2">
                <DialogTitle className="text-2xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-amber-900 to-amber-500 dark:from-white dark:to-amber-400">
                  Acceso Seguro
                </DialogTitle>
                <DialogDescription className="text-[10px] font-bold tracking-[0.3em] text-amber-900/60 dark:text-amber-400/60 uppercase">
                  Clave Maestra
                </DialogDescription>
              </div>
            </DialogHeader>
            <form onSubmit={handleAuth} className="space-y-8 py-8 relative">
              <div className="space-y-2">
                <label className="sr-only">Contraseña</label>
                <Input 
                  type="password" 
                  placeholder="••••" 
                  className="text-center tracking-[1em] font-black h-14 text-xl rounded-2xl border-0 bg-black/5 dark:bg-white/5 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-amber-500/20 backdrop-blur-md shadow-inner transition-all hover:bg-black/10 dark:hover:bg-white/10" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus 
                />
              </div>
              <Button type="submit" className="w-full rounded-[2rem] h-16 font-black text-lg uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-600 focus:ring-4 focus:ring-amber-500/50 text-white hover:scale-[1.02] active:scale-95 transition-all shadow-[0_15px_30px_-5px_rgba(217,119,6,0.3)]">
                Desbloquear
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col h-full animate-in fade-in duration-500">
            <div className="px-6 pt-8 pb-2 border-b bg-muted/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <DialogTitle className="text-xl font-bold">Gestión de Especiales</DialogTitle>
                  <p className="text-xs text-muted-foreground">Agrega cantos en lote o manualmente.</p>
                </div>
                <Badge className="bg-amber-600 font-bold px-3">ADMIN</Badge>
              </div>
              <Tabs defaultValue="import" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-2xl h-12 p-1 bg-slate-200/50">
                  <TabsTrigger value="import" className="rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    <ListChecks className="h-3 w-3 mr-2" /> Selección Múltiple
                  </TabsTrigger>
                  <TabsTrigger value="manual" className="rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    <Plus className="h-3 w-3 mr-2" /> Carga Manual
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1 overflow-hidden">
              <Tabs defaultValue="import" className="h-full flex flex-col">
                <TabsContent value="import" className="mt-0 flex-1 overflow-hidden flex flex-col">
                  <div className="p-6 space-y-4 bg-background">
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-amber-600 transition-colors" />
                      <Input 
                        placeholder="Buscar por título o letra..." 
                        className="pl-12 h-14 rounded-2xl border-2 bg-background focus:ring-4 focus:ring-amber-500/10"
                        value={searchSong}
                        onChange={(e) => setSearchSong(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-100">
                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest ml-2">Destino:</span>
                      <Select value={importCategory} onValueChange={(v) => setImportCategory(v as SpecialCategory)}>
                        <SelectTrigger className="flex-1 h-10 rounded-xl bg-white border-amber-200 font-bold text-[10px]">
                          <SelectValue placeholder="Categoría Destino" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Predicación">🎤 Predicación</SelectItem>
                          <SelectItem value="Fúnebre">⛪ Fúnebre</SelectItem>
                          <SelectItem value="Cumpleaños">🎁 Cumpleaños</SelectItem>
                          <SelectItem value="Bautismos">💧 Bautismos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 px-6">
                    <div className="space-y-2 pb-24">
                      {filteredSongs.length > 0 ? filteredSongs.map((song) => {
                        const isSelected = selectedSongs.some(s => s.id === song.id);
                        return (
                          <div
                            key={song.id}
                            onClick={() => toggleSongSelection(song)}
                            className={cn(
                              "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group",
                              isSelected 
                                ? "bg-amber-100/50 border-amber-400 shadow-md translate-x-1" 
                                : "bg-white border-slate-100 hover:border-amber-200 hover:bg-slate-50"
                            )}
                          >
                            <Checkbox 
                              checked={isSelected} 
                              onCheckedChange={() => toggleSongSelection(song)}
                              className="h-5 w-5 border-2 rounded-md"
                            />
                            <div className="flex-1 min-w-0">
                              <p className={cn("font-bold text-sm truncate", isSelected ? "text-amber-900" : "text-slate-900")}>
                                {song.hymnNumber ? `${song.hymnNumber}. ` : ""}{song.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-[8px] font-black uppercase py-0 px-1.5 h-4 border-slate-200 text-slate-500">
                                  {song.type}
                                </Badge>
                                {song.tone && <span className="text-[9px] font-bold text-slate-400">· {song.tone}</span>}
                              </div>
                            </div>
                            <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                              isSelected ? "bg-amber-500 text-white" : "bg-slate-50 text-slate-300"
                            )}>
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </div>
                        );
                      }) : searchSong ? (
                        <div className="py-20 text-center opacity-40">
                          <Search className="h-12 w-12 mx-auto mb-4" />
                          <p className="text-xs font-black uppercase tracking-widest">Sin resultados</p>
                        </div>
                      ) : (
                        <div className="py-20 text-center opacity-30">
                          <ListChecks className="h-16 w-16 mx-auto mb-4" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Selecciona múltiples cantos</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {selectedSongs.length > 0 && (
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent animate-in slide-in-from-bottom-full duration-500">
                      <Button 
                        onClick={handleBulkImport} 
                        disabled={isImporting}
                        className="w-full h-16 text-lg font-bold rounded-2xl bg-green-600 hover:bg-green-700 shadow-2xl shadow-green-200"
                      >
                        {isImporting ? (
                          <Loader2 className="h-6 w-6 animate-spin mr-3" />
                        ) : (
                          <CheckCircle2 className="h-6 w-6 mr-3" />
                        )}
                        Importar {selectedSongs.length} a {importCategory}
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="manual" className="mt-0 flex-1 overflow-y-auto">
                  <ScrollArea className="h-full">
                    <div className="p-6 pb-10">
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Categoría</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="rounded-2xl h-14 border-2 bg-slate-50">
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
                                  <Input placeholder="Escribe el nombre del canto" className="rounded-2xl h-14 border-2" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="tone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Tonalidad</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="rounded-2xl h-14 border-2">
                                        <SelectValue placeholder="Tono" />
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
                              name="hymnNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Nº Himno (Opc.)</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="Ej: 116" className="rounded-2xl h-14 border-2" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="lyrics"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-black uppercase tracking-widest ml-1">Letra Completa</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Pega o escribe la letra aquí..." className="h-80 rounded-3xl border-2 resize-none p-6 font-body text-base leading-relaxed" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full h-16 font-black text-lg rounded-2xl bg-amber-600 hover:bg-amber-700 shadow-xl shadow-amber-100">
                            Publicar Canto
                          </Button>
                        </form>
                      </Form>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
