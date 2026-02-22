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
import { cn } from "@/lib/utils";

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

function SearchableSelect({ songs, value, onChange, placeholder, type = 'praise' }: { songs: any[], value: string, onChange: (value: string) => void, placeholder: string, type?: 'hymn' | 'praise' }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selectedSongTitle = useMemo(() => {
        if (!value) return placeholder;
        const songId = type === 'hymn' ? value : value.split(':')[1];
        const song = songs.find(s => s.id === songId);
        if (!song) return placeholder;
        return type === 'hymn' ? `${song.number}. ${song.title}` : song.title;
    }, [value, songs, type, placeholder]);

    const filteredSongs = useMemo(() => {
        if (!search) return songs;
        const lowercasedSearch = search.toLowerCase();
        return songs.filter(song => 
            song.title.toLowerCase().includes(lowercasedSearch) ||
            (type === 'hymn' && song.number.toString().includes(lowercasedSearch))
        );
    }, [search, songs, type]);

    const getSongValue = (song: any) => type === 'hymn' ? song.id : `${song.type}:${song.id}`;

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
                        placeholder="Buscar canto..."
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
                                <span className="truncate">{type === 'hymn' && `${song.number}. `}{song.title}</span>
                            </div>
                        )) : <div className="p-2 text-center text-sm text-muted-foreground">No se encontraron cantos.</div>}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}

function MultiSongSelectField({ control, name, label, songs, type = 'praise' }: { control: Control<RepertoireFormData>, name: any, label: string, songs: any[], type?: 'hymn' | 'praise' }) {
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
                            name={`${name}.${index}.id`}
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <SearchableSelect
                                            songs={songs}
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder={`Seleccionar canto ${index + 1}...`}
                                            type={type}
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

  const allPraises = useMemo(() => {
    const combined = [
      ...praises.map(p => ({ ...p, type: 'praise' as const })),
      ...choirs.map(c => ({ ...c, type: 'choir' as const })),
      ...youthChoirs.map(yc => ({ ...yc, type: 'youth-choir' as const }))
    ];
    return combined.sort((a, b) => a.title.localeCompare(b.title));
  }, [praises, choirs, youthChoirs]);

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
    const findSong = (idWithType: string) => {
      if (!idWithType) return undefined;
      const [type, id] = idWithType.split(":");
      const song = allPraises.find(p => p.id === id && p.type === type);
      return song ? { id: song.id, title: song.title, type: song.type } : undefined;
    }

    const findHymn = (id: string) => {
        if (!id) return undefined;
        const hymn = hymns.find(h => h.id === id);
        return hymn ? { id: hymn.id, number: hymn.number, title: hymn.title } : undefined;
    }
    
    const filterAndMap = (arr: {id: string}[] | undefined, findFn: (id: string) => any) => {
        return arr?.map(item => findFn(item.id)).filter(Boolean) as any[] || [];
    }

    const repertoirePayload = {
      name: data.name,
      firstHymns: filterAndMap(data.firstHymns, findHymn),
      generalPraises: filterAndMap(data.generalPraises, findSong),
      preWordPraises: filterAndMap(data.preWordPraises, findSong),
      sickPraises: filterAndMap(data.sickPraises, findSong),
      intermediatePraises: filterAndMap(data.intermediatePraises, findSong),
      finalPraises: filterAndMap(data.finalPraises, findSong),
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

            <MultiSongSelectField control={form.control} name="firstHymns" label="1. Primeros Himnos" songs={hymns} type="hymn" />
            <MultiSongSelectField control={form.control} name="generalPraises" label="2. Alabanzas" songs={allPraises} />
            <MultiSongSelectField control={form.control} name="preWordPraises" label="3. Alabanzas antes de la Palabra" songs={allPraises} />
            <MultiSongSelectField control={form.control} name="sickPraises" label="4. Alabanzas por los Enfermos" songs={allPraises} />
            <MultiSongSelectField control={form.control} name="intermediatePraises" label="5. Alabanzas Intermedias" songs={allPraises} />
            <MultiSongSelectField control={form.control} name="finalPraises" label="6. Alabanzas Finales" songs={allPraises} />

            <Separator />
            
            <Button type="submit" size="lg" className="w-full">Guardar Repertorio</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
