"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useHymns } from "@/context/hymns-context";
import { usePraises } from "@/context/praises-context";
import { useChoirs } from "@/context/choirs-context";
import { useYouthChoirs } from "@/context/youth-choirs-context";
import { useRepertoires } from "@/context/repertoires-context";
import { useMemo } from "react";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";

const repertoireSchema = z.object({
  name: z.string().min(1, "El nombre de quien dirige es requerido."),
  firstHymnId: z.string().optional(),
  generalPraises: z.array(z.object({ id: z.string().min(1, "Debes seleccionar una alabanza.") })).optional(),
  preWordPraiseId: z.string().optional(),
  sickPraiseId: z.string().optional(),
  intermediatePraiseId: z.string().optional(),
  finalPraiseId: z.string().optional(),
});

type RepertoireFormData = z.infer<typeof repertoireSchema>;

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
      generalPraises: [{ id: "" }]
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "generalPraises",
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

    const repertoirePayload = {
      name: data.name,
      firstHymn: findHymn(data.firstHymnId || ''),
      generalPraises: data.generalPraises?.map(p => findSong(p.id)).filter(Boolean) as any[],
      preWordPraise: findSong(data.preWordPraiseId || ''),
      sickPraise: findSong(data.sickPraiseId || ''),
      intermediatePraise: findSong(data.intermediatePraiseId || ''),
      finalPraise: findSong(data.finalPraiseId || ''),
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

            <SongSelectField form={form} name="firstHymnId" label="1. Primer Himno" songs={hymns} type="hymn" />
            
            <div>
              <FormLabel className="text-base font-semibold">2. Alabanzas</FormLabel>
              <div className="space-y-4 mt-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                   <FormField
                      control={form.control}
                      name={`generalPraises.${index}.id`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={`Seleccionar alabanza ${index + 1}...`} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {allPraises.map((song) => (
                                <SelectItem key={`${song.type}:${song.id}`} value={`${song.type}:${song.id}`}>
                                  {song.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ id: "" })}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Alabanza
              </Button>
            </div>

            <SongSelectField form={form} name="preWordPraiseId" label="3. Alabanza antes de la Palabra" songs={allPraises} />
            <SongSelectField form={form} name="sickPraiseId" label="4. Alabanza por los Enfermos" songs={allPraises} />
            <SongSelectField form={form} name="intermediatePraiseId" label="5. Alabanza Intermedia" songs={allPraises} />
            <SongSelectField form={form} name="finalPraiseId" label="6. Alabanza Final" songs={allPraises} />

            <Separator />
            
            <Button type="submit" size="lg" className="w-full">Guardar Repertorio</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function SongSelectField({ form, name, label, songs, type = 'praise' }: { form: any, name: string, label: string, songs: any[], type?: 'hymn' | 'praise' }) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
            <FormItem>
                <FormLabel className="text-base font-semibold">{label}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                    <SelectValue placeholder="Seleccionar un canto..." />
                    </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {songs.map((song) => (
                    <SelectItem key={type === 'hymn' ? song.id : `${song.type}:${song.id}`} value={type === 'hymn' ? song.id : `${song.type}:${song.id}`}>
                        {type === 'hymn' && `${song.number}. `}{song.title}
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
            )}
        />
    )
}
    