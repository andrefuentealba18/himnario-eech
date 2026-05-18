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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Plus, Trash2, ChevronsUpDown, Check } from "lucide-react";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { cn, normalizeSearchTerm } from "@/lib/utils";
import type { SongReference } from "@/lib/repertoires";

const songIdSchema = z.object({ id: z.string().min(1, "Debes seleccionar un canto.") });

const repertoireSchema = z.object({
  name: z.string().min(1, "El nombre de quien dirige es requerido."),
  firstHymns: z.array(songIdSchema).optional(),
  generalPraises: z.array(songIdSchema).optional(),
  preWordPraises: z.array(songIdSchema).optional(),
  sickPraises: z.array(songIdSchema).optional(),
  intermediatePraises: z.array(songIdSchema).optional(),
  finalPraises: z.array(songIdSchema).optional(),
});

type RepertoireFormData = z.infer<typeof repertoireSchema>;

const songItem = { id: "" };

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
                    className="w-full justify-between font-normal"
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
                        {filteredSongs.length > 0 ? filteredSongs.map(song => (
                            <div 
                                key={getSongValue(song)} 
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
        <div>
            <FormLabel className="text-base font-semibold">{label}</FormLabel>
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
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append(songItem)}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Canto
            </Button>
        </div>
    )
}

export function RepertoireBuilderClient() {
  const { hymns, isLoaded: hymnsLoaded } = useHymns();
  const { praises, isLoaded: praisesLoaded } = usePraises();
  const { choirs, isLoaded: choirsLoaded } = useChoirs();
  const { youthChoirs, isLoaded: youthChoirsLoaded } = useYouthChoirs();
  const { addRepertoire } = useRepertoires();

  const allSongs = useMemo(() => {
    const combined = [
      ...hymns.map(h => ({ ...h, type: 'hymn' as const, _searchIndex: normalizeSearchTerm(`${h.title} ${h.number} ${h.lyrics} ${h.tone || ''}`) })),
      ...praises.map(p => ({ ...p, type: 'praise' as const, _searchIndex: normalizeSearchTerm(`${p.title} ${p.lyrics} ${p.tone || ''}`) })),
      ...choirs.map(c => ({ ...c, type: 'choir' as const, _searchIndex: normalizeSearchTerm(`${c.title} ${c.lyrics} ${c.tone || ''}`) })),
      ...youthChoirs.map(yc => ({ ...yc, type: 'youth-choir' as const, _searchIndex: normalizeSearchTerm(`${yc.title} ${yc.lyrics} ${yc.tone || ''} ${yc.group}`) }))
    ];
    return combined.sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }));
  }, [hymns, praises, choirs, youthChoirs]);

  const isLoaded = hymnsLoaded && praisesLoaded && choirsLoaded && youthChoirsLoaded;

  const form = useForm<RepertoireFormData>({
    resolver: zodResolver(repertoireSchema),
    defaultValues: {
      name: "",
      firstHymns: [songItem],
      generalPraises: [songItem],
      preWordPraises: [songItem],
      sickPraises: [songItem],
      intermediatePraises: [songItem],
      finalPraises: [songItem],
    },
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
    
    const filterAndMap = (arr: {id: string}[] | undefined) => {
        return arr?.map(item => findSong(item.id)).filter(Boolean) as SongReference[] || [];
    }

    const repertoirePayload = {
      name: data.name,
      firstHymns: filterAndMap(data.firstHymns),
      generalPraises: filterAndMap(data.generalPraises),
      preWordPraises: filterAndMap(data.preWordPraises),
      sickPraises: filterAndMap(data.sickPraises),
      intermediatePraises: filterAndMap(data.intermediatePraises),
      finalPraises: filterAndMap(data.finalPraises),
    };

    addRepertoire(repertoirePayload);
  };

  if (!isLoaded) {
    return <p>Cargando datos de cantos...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arma tu Repertorio</CardTitle>
        <CardDescription>Completa el formulario para registrar el orden del servicio.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Tu Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de quien dirige" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <MultiSongSelectField control={form.control} name="firstHymns" label="1. Primeros Cantos" songs={allSongs} />
            <MultiSongSelectField control={form.control} name="generalPraises" label="2. Alabanzas Generales" songs={allSongs} />
            <MultiSongSelectField control={form.control} name="preWordPraises" label="3. Alabanzas antes de la Palabra" songs={allSongs} />
            <MultiSongSelectField control={form.control} name="sickPraises" label="4. Alabanzas por los Enfermos" songs={allSongs} />
            <MultiSongSelectField control={form.control} name="intermediatePraises" label="5. Alabanzas Intermedias" songs={allSongs} />
            <MultiSongSelectField control={form.control} name="finalPraises" label="6. Alabanzas Finales" songs={allSongs} />

            <Separator />
            
            <Button type="submit" size="lg" className="w-full">Guardar Repertorio</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
