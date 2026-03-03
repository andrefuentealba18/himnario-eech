"use client";

import { useState, useMemo, useEffect } from 'react';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Loader2, Copy, Move, Search } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { normalizeSearchTerm } from '@/lib/utils';
import type { Praise } from '@/lib/praises';
import type { Choir } from '@/lib/choirs';
import type { YouthChoir, GroupType } from '@/lib/youth-choirs';

type Category = 'praises' | 'choirs' | 'youth-choirs';

const categoryLabels: Record<Category, string> = {
  'praises': 'Alabanzas',
  'choirs': 'Coros',
  'youth-choirs': 'Agrupaciones',
};

const groups: GroupType[] = [
  "Coro Juventud",
  "Grupo Ciclista",
  "Departamento Infantil",
  "Clase Dorcas",
  "Departamento Juvenil"
];

export function SongTransferManager() {
  const { praises, addPraise, deletePraise, isLoaded: praisesLoaded } = usePraises();
  const { choirs, addChoir, deleteChoir, isLoaded: choirsLoaded } = useChoirs();
  const { youthChoirs, addYouthChoir, deleteYouthChoir, isLoaded: youthChoirsLoaded } = useYouthChoirs();
  const { toast } = useToast();

  const [sourceCategory, setSourceCategory] = useState<Category | ''>('');
  const [destinationCategory, setDestinationCategory] = useState<Category | ''>('');
  const [targetGroup, setTargetGroup] = useState<GroupType>("Coro Juventud");
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [keepSource, setKeepSource] = useState(false); // Default to move (delete source)

  const isLoaded = praisesLoaded && choirsLoaded && youthChoirsLoaded;

  const sourceSongs = useMemo(() => {
    if (!sourceCategory) return [];
    switch (sourceCategory) {
      case 'praises': return praises;
      case 'choirs': return choirs;
      case 'youth-choirs': return youthChoirs;
      default: return [];
    }
  }, [sourceCategory, praises, choirs, youthChoirs]);

  const filteredSongs = useMemo(() => {
    const normalized = normalizeSearchTerm(searchTerm);
    if (!normalized) return sourceSongs;
    return sourceSongs.filter(song => 
      normalizeSearchTerm(song.title).includes(normalized)
    );
  }, [sourceSongs, searchTerm]);
  
  useEffect(() => {
    setSelectedSongs(new Set());
    setSearchTerm('');
  }, [sourceCategory]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelection = new Set(selectedSongs);
      filteredSongs.forEach(s => newSelection.add(s.id));
      setSelectedSongs(newSelection);
    } else {
      const newSelection = new Set(selectedSongs);
      filteredSongs.forEach(s => newSelection.delete(s.id));
      setSelectedSongs(newSelection);
    }
  };

  const handleSongSelect = (songId: string, checked: boolean) => {
    setSelectedSongs(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(songId);
      } else {
        newSet.delete(songId);
      }
      return newSet;
    });
  };

  const handleTransfer = async () => {
    if (!sourceCategory || !destinationCategory || selectedSongs.size === 0) return;
    
    setIsTransferring(true);
    let successCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;

    const songsToProcess = sourceSongs.filter(s => selectedSongs.has(s.id));

    for (const song of songsToProcess) {
      try {
        let addResult: { success: boolean };

        const baseData = {
          title: song.title,
          lyrics: song.lyrics,
          tone: song.tone,
        };

        if (destinationCategory === 'praises') {
          addResult = await addPraise(baseData);
        } else if (destinationCategory === 'choirs') {
          addResult = await addChoir({ ...baseData, speed: (song as any).speed });
        } else { // youth-choirs (Agrupaciones)
          addResult = await addYouthChoir({ ...baseData, group: targetGroup });
        }
        
        if (addResult.success) {
          if (!keepSource) {
            if (sourceCategory === 'praises') {
              await deletePraise(song.id);
            } else if (sourceCategory === 'choirs') {
              await deleteChoir(song.id);
            } else { // youth-choirs
              await deleteYouthChoir(song.id);
            }
          }
          successCount++;
        } else {
          duplicateCount++;
        }
      } catch(e) {
        errorCount++;
        console.error(`Error al procesar canción: ${song.title}`, e);
      }
    }
    
    setIsTransferring(false);
    setSelectedSongs(new Set());
    setSearchTerm('');

    toast({
      title: keepSource ? "Copia Finalizada" : "Traspaso Completado",
      description: `${successCount} canciones procesadas. ${duplicateCount} duplicados omitidos. ${errorCount} errores.`,
    });
  };
  
  const isAllFilteredSelected = filteredSongs.length > 0 && filteredSongs.every(s => selectedSongs.has(s.id));
  const isAnyFilteredSelected = filteredSongs.some(s => selectedSongs.has(s.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Traspasar o Copiar Canciones</CardTitle>
        <CardDescription>
          Mueve canciones entre categorías. Puedes elegir mantener el original o moverlo definitivamente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-lg gap-4">
          <div className="flex items-center gap-3">
            {keepSource ? <Copy className="h-5 w-5 text-primary" /> : <Move className="h-5 w-5 text-primary" />}
            <div>
              <p className="font-medium text-sm">{keepSource ? "Modo: Copiar" : "Modo: Traspasar"}</p>
              <p className="text-xs text-muted-foreground">
                {keepSource ? "Las canciones se mantendrán en la categoría actual." : "Las canciones se eliminarán del origen al terminar."}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="mode-switch" className="text-xs">Mantener en origen</Label>
            <Switch 
              id="mode-switch" 
              checked={keepSource} 
              onCheckedChange={setKeepSource} 
              disabled={isTransferring}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="space-y-2">
            <Label htmlFor="source-category">Origen</Label>
            <Select value={sourceCategory} onValueChange={(v) => setSourceCategory(v as Category)} disabled={isTransferring}>
              <SelectTrigger id="source-category">
                <SelectValue placeholder="Seleccionar origen..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="hidden md:flex pt-6">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination-category">Destino</Label>
             <Select value={destinationCategory} onValueChange={(v) => setDestinationCategory(v as Category)} disabled={isTransferring}>
              <SelectTrigger id="destination-category">
                <SelectValue placeholder="Seleccionar destino..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {destinationCategory === 'youth-choirs' && (
          <div className="p-4 border border-primary/20 bg-primary/5 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2">
            <Label htmlFor="target-group" className="text-primary font-semibold">Seleccionar Agrupación de Destino</Label>
            <Select value={targetGroup} onValueChange={(v) => setTargetGroup(v as GroupType)} disabled={isTransferring}>
              <SelectTrigger id="target-group" className="bg-background">
                <SelectValue placeholder="¿A qué agrupación?" />
              </SelectTrigger>
              <SelectContent>
                {groups.map(g => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {sourceCategory && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <Label>Canciones en "{categoryLabels[sourceCategory]}"</Label>
                <span className="text-xs text-muted-foreground">{selectedSongs.size} seleccionadas en total</span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar canción para seleccionar..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isTransferring}
                />
              </div>
            </div>

            <ScrollArea className="h-64 w-full rounded-md border">
                <div className="p-4">
                    {!isLoaded ? <p>Cargando...</p> : (
                        sourceSongs.length > 0 ? (
                            <>
                                <div className="flex items-center space-x-2 pb-2 border-b mb-2 sticky top-0 bg-background z-10">
                                  <Checkbox
                                    id="select-all"
                                    checked={isAllFilteredSelected ? true : isAnyFilteredSelected && !isAllFilteredSelected ? 'indeterminate' : false}
                                    onCheckedChange={(checked) => handleSelectAll(!!checked)}
                                    aria-label="Seleccionar todo lo filtrado"
                                    disabled={isTransferring}
                                  />
                                  <label
                                    htmlFor="select-all"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {searchTerm ? `Seleccionar lo filtrado (${filteredSongs.length})` : `Seleccionar todo (${sourceSongs.length})`}
                                  </label>
                                </div>
                                <div className="space-y-1">
                                  {filteredSongs.length > 0 ? (
                                    filteredSongs.map(song => (
                                        <div key={song.id} className="flex items-center space-x-2 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors">
                                            <Checkbox
                                                id={song.id}
                                                checked={selectedSongs.has(song.id)}
                                                onCheckedChange={(checked) => handleSongSelect(song.id, !!checked)}
                                                disabled={isTransferring}
                                            />
                                            <label htmlFor={song.id} className="text-sm w-full truncate cursor-pointer">
                                                {song.title}
                                                {sourceCategory === 'youth-choirs' && (
                                                  <span className="ml-2 text-[10px] text-muted-foreground opacity-70">
                                                    ({(song as YouthChoir).group})
                                                  </span>
                                                )}
                                            </label>
                                        </div>
                                    ))
                                  ) : (
                                    <p className="text-sm text-muted-foreground text-center py-10">No se encontraron canciones con ese nombre.</p>
                                  )}
                                </div>
                            </>
                        ) : <p className="text-sm text-muted-foreground text-center py-10">No hay canciones en esta categoría.</p>
                    )}
                </div>
            </ScrollArea>
          </div>
        )}

        <div className="flex justify-end gap-3">
            <Button 
                variant="outline"
                onClick={() => { setSourceCategory(''); setDestinationCategory(''); setSelectedSongs(new Set()); setSearchTerm(''); }}
                disabled={isTransferring || (!sourceCategory && !destinationCategory)}
            >
              Limpiar
            </Button>
            <Button 
                onClick={handleTransfer}
                disabled={!sourceCategory || !destinationCategory || selectedSongs.size === 0 || isTransferring}>
                {isTransferring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {keepSource ? "Copiar" : "Traspasar"} ({selectedSongs.size})
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
