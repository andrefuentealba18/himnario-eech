"use client";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useHymns } from "@/context/hymns-context";
import { usePraises } from "@/context/praises-context";
import { useChoirs } from "@/context/choirs-context";
import { useYouthChoirs } from "@/context/youth-choirs-context";
import { useRepertoires } from "@/context/repertoires-context";
import { useState, useMemo } from "react";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Plus, Trash2, ChevronsUpDown, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { cn, normalizeSearchTerm } from "@/lib/utils";
import type { SongReference, Repertoire } from "@/lib/repertoires";
const songIdSchema = z.object({ id: z.string().min(1, "Debes seleccionar un canto.") });
const blockSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "El nombre del bloque es requerido."),
  songs: z.array(songIdSchema).optional()
});
const repertoireSchema = z.object({
  name: z.string().min(1, "El nombre de quien dirige es requerido."),
  blocks: z.array(blockSchema).optional(),
});
type RepertoireFormData = z.infer<typeof repertoireSchema>;
const songItem = { id: "" };
const generateId = () => Math.random().toString(36).substring(2, 9);
function SearchableSelect({ songs, value, onChange, placeholder }: { songs: any[], value: string, onChange: (value: string) => void, placeholder: string }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const getSongValue = (song: any) => `${song.type}:${song.id}`;
    const selectedSongTitle = useMemo(() => {
        if (!value) return placeholder;
        const song = songs.find(s => getSongValue(s) === value);
        if (!song) return placeholder;
        return song.type === 'hymn' ? `${song.number}. ${song.title}` : song.title;
    }, [value, songs, placeholder]);
    const filteredSongs = useMemo(() => {
        const normalized = normalizeSearchTerm(search);
        if (!normalized) return songs;
        return songs.filter(song => 
            song._searchIndex.includes(normalized)
        );
    }, [search, songs]);
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal bg-background"
                >
                    <span className="truncate">{selectedSongTitle}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <div className="p-2 border-b">
                    <Input 
                        placeholder="Buscar por título o letra..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-9"
                    />
                </div>
                <ScrollArea className="h-60">
                    <div className="p-1">
                        {filteredSongs.length > 0 ? filteredSongs.map((song, index) => (
                            <div 
                                key={`${getSongValue(song)}-${index}`} 
                                onClick={() => {
                                    const songValue = getSongValue(song);
                                    onChange(songValue === value ? "" : songValue);
                                    setOpen(false);
                                    setSearch('');
                                }}
                                className="text-sm cursor-pointer p-2 hover:bg-accent rounded-sm flex items-center gap-2"
                            >
                                <Check className={cn("h-4 w-4", value === getSongValue(song) ? "opacity-100" : "opacity-0")} />
                                <span className="truncate">{song.number && `${song.number}. `}{song.title}</span>
                            </div>
                        )) : <div className="p-2 text-center text-sm text-muted-foreground">No se encontraron cantos.</div>}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
function MultiSongSelectField({ control, name, label, songs }: { control: Control<RepertoireFormData>, name: any, label: string, songs: any[] }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });
    return (
        <div className="mt-4">
            <FormLabel className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</FormLabel>
            <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormField
                            control={control}
                            name={`${name}.${index}.id` as any}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <SearchableSelect
                                            songs={songs}
                                            value={field.value as string}
                                            onChange={field.onChange}
                                            placeholder={`Seleccionar canto ${index + 1}...`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="destructive" size="icon" className="rounded-full shadow-sm shadow-red-500/20 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition-colors h-9 w-9 shrink-0" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button type="button" className="mt-3 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border-none shadow-sm px-4 h-8 text-xs" onClick={() => append(songItem)}>
                <Plus className="mr-1 h-3 w-3" />
                Agregar Canto
            </Button>
        </div>
    )
}
interface RepertoireBuilderClientProps {
  initialData?: Repertoire;
  repertoireId?: string;
}
export function RepertoireBuilderClient({ initialData, repertoireId }: RepertoireBuilderClientProps) {
  const { hymns, isLoaded: hymnsLoaded } = useHymns();
  const { praises, isLoaded: praisesLoaded } = usePraises();
  const { choirs, isLoaded: choirsLoaded } = useChoirs();
  const { youthChoirs, isLoaded: youthChoirsLoaded } = useYouthChoirs();
  const { addRepertoire, updateRepertoire } = useRepertoires();
  const allSongs = useMemo(() => {
    const combined = [
      ...hymns.map(h => ({ ...h, type: 'hymn' as const, _searchIndex: normalizeSearchTerm(`${h.title} ${h.number} ${h.lyrics} ${h.tone || ''}`) })),
      ...praises.map(p => ({ ...p, type: 'praise' as const, _searchIndex: normalizeSearchTerm(`${p.title} ${p.lyrics} ${p.tone || ''}`) })),
      ...choirs.map(c => ({ ...c, type: 'choir' as const, _searchIndex: normalizeSearchTerm(`${c.title} ${c.lyrics} ${c.tone || ''}`) })),
      ...youthChoirs.map(yc => ({ ...yc, type: 'youth-choir' as const, _searchIndex: normalizeSearchTerm(`${yc.title} ${yc.lyrics} ${yc.tone || ''} ${yc.group}`) }))
    ];
    
    const uniqueSongsMap = new Map();
    combined.forEach(song => {
      uniqueSongsMap.set(`${song.type}:${song.id}`, song);
    });
    
    return Array.from(uniqueSongsMap.values()).sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
  }, [hymns, praises, choirs, youthChoirs]);
  const isLoaded = hymnsLoaded && praisesLoaded && choirsLoaded && youthChoirsLoaded;
  // Transform initial data if it exists
  const defaultBlocks = useMemo(() => {
    if (initialData?.blocks && initialData.blocks.length > 0) {
      return initialData.blocks.map(b => ({
        id: b.id,
        title: b.title,
        songs: b.songs.map(s => ({ id: `${s.type}:${s.id}` }))
      }));
    }
    
    // Legacy mapping just in case they edit an old repertoire
    if (initialData && !initialData.blocks) {
      const blocks: any[] = [];
      const addBlockIfSongs = (title: string, songs?: SongReference[]) => {
        if (songs && songs.length > 0) {
          blocks.push({
            id: generateId(),
            title,
            songs: songs.map(s => ({ id: `${s.type}:${s.id}` }))
          });
        }
      };
      
      addBlockIfSongs("Primeros Cantos", initialData.firstHymns);
      addBlockIfSongs("Alabanzas Generales", initialData.generalPraises);
      addBlockIfSongs("Alabanzas antes de la Palabra", initialData.preWordPraises);
      addBlockIfSongs("Alabanzas por los Enfermos", initialData.sickPraises);
      addBlockIfSongs("Alabanzas Intermedias", initialData.intermediatePraises);
      addBlockIfSongs("Alabanzas Finales", initialData.finalPraises);
      
      if (blocks.length > 0) return blocks;
    }
    
    return [
      { id: generateId(), title: "Bloque 1", songs: [songItem] }
    ];
  }, [initialData]);
  const form = useForm<RepertoireFormData>({
    resolver: zodResolver(repertoireSchema),
    defaultValues: {
      name: initialData?.name || "",
      blocks: defaultBlocks,
    },
  });
  const { fields: blockFields, append: appendBlock, remove: removeBlock } = useFieldArray({
    control: form.control,
    name: "blocks",
  });
  const onSubmit = (data: RepertoireFormData) => {
    const findSong = (idWithType: string): SongReference | undefined => {
        if (!idWithType) return undefined;
        const [type, id] = idWithType.split(":");
        const song = allSongs.find(s => s.id === id && s.type === type);
        
        if (!song) return undefined;
        if (song.type === 'hymn') {
            return { id: song.id, number: song.number, title: song.title, type: 'hymn' };
        }
        return { id: song.id, title: song.title, type: song.type };
    }
    const blocksToSave = data.blocks?.map(block => {
      const mappedSongs = block.songs?.map(item => findSong(item.id)).filter(Boolean) as SongReference[] || [];
      return {
        id: block.id,
        title: block.title,
        songs: mappedSongs
      };
    }) || [];
    const repertoirePayload = {
      name: data.name,
      blocks: blocksToSave,
    };
    if (initialData && repertoireId) {
      updateRepertoire(repertoireId, repertoirePayload);
    } else {
      addRepertoire(repertoirePayload);
    }
  };
  if (!isLoaded) {
    return <p>Cargando datos de cantos...</p>;
  }
  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden mt-4">
      <div className="bg-gradient-to-r from-slate-100 to-white px-6 py-4 border-b border-slate-100">
        <h2 className="text-2xl sm:text-3xl font-cursive text-slate-900 capitalize leading-none pt-1">{initialData ? "Editar Repertorio" : "Arma tu Repertorio"}</h2>
        <p className="text-xs font-medium text-slate-500 mt-1">
            {initialData ? "Modifica los bloques y cantos del servicio." : "Completa el formulario para registrar el orden del servicio añadiendo bloques."}
        </p>
      </div>
      <div className="p-4 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-black text-slate-800">Tu Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de quien dirige" {...field} className="bg-white/80 border-slate-200 rounded-lg focus-visible:ring-blue-500 shadow-sm h-10 px-3" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              {blockFields.map((block, index) => (
                <div key={block.id} className="p-4 border border-slate-200/60 rounded-xl bg-white/50 relative shadow-sm hover:shadow-md hover:bg-white/80 transition-all duration-300 group">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <FormField
                      control={form.control}
                      name={`blocks.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-sm font-black text-slate-800">Nombre del Bloque</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej. Alabanzas de Adoración" {...field} className="bg-white border-slate-200 rounded-lg focus-visible:ring-blue-500 shadow-sm h-10 font-medium" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="mt-7 rounded-full shadow-sm bg-red-50 hover:bg-red-600 text-red-500 hover:text-white transition-colors h-9 w-9 shrink-0"
                      onClick={() => removeBlock(index)}
                      title="Eliminar bloque"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <MultiSongSelectField 
                    control={form.control} 
                    name={`blocks.${index}.songs`} 
                    label="Cantos de este bloque" 
                    songs={allSongs} 
                  />
                </div>
              ))}
            </div>
            <Button 
              type="button" 
              className="w-full border-dashed border-2 border-slate-300 bg-slate-50/50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-xl h-12 font-bold transition-colors shadow-sm"
              onClick={() => appendBlock({ id: generateId(), title: `Bloque ${blockFields.length + 1}`, songs: [songItem] })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Nuevo Bloque
            </Button>
            
            <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-xl shadow-blue-500/30 h-12 text-base border-none mt-6">
                {initialData ? "Guardar Cambios" : "Guardar Repertorio"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
