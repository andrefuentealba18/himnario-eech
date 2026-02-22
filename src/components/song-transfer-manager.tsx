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
import { ArrowRight, Loader2 } from 'lucide-react';
import type { Praise } from '@/lib/praises';
import type { Choir } from '@/lib/choirs';
import type { YouthChoir } from '@/lib/youth-choirs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Song = Praise | Choir | YouthChoir;
type Category = 'praises' | 'choirs' | 'youth-choirs';

const categoryLabels: Record<Category, string> = {
  'praises': 'Alabanzas',
  'choirs': 'Coros',
  'youth-choirs': 'Coro Juventud',
};

export function SongTransferManager() {
  const { praises, addPraise, deletePraise, isLoaded: praisesLoaded } = usePraises();
  const { choirs, addChoir, deleteChoir, isLoaded: choirsLoaded } = useChoirs();
  const { youthChoirs, addYouthChoir, deleteYouthChoir, isLoaded: youthChoirsLoaded } = useYouthChoirs();
  const { toast } = useToast();

  const [sourceCategory, setSourceCategory] = useState<Category | ''>('');
  const [destinationCategory, setDestinationCategory] = useState<Category | ''>('');
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [isTransferring, setIsTransferring] = useState(false);

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
  
  useEffect(() => {
    setSelectedSongs(new Set());
  }, [sourceCategory]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked) {
      setSelectedSongs(new Set(sourceSongs.map(s => s.id)));
    } else {
      setSelectedSongs(new Set());
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

    const songsToMove = sourceSongs.filter(s => selectedSongs.has(s.id));

    for (const song of songsToMove) {
      try {
        let addResult: { success: boolean };

        // Add to destination
        if (destinationCategory === 'praises') {
          addResult = await addPraise({ title: song.title, lyrics: song.lyrics, tone: song.tone });
        } else if (destinationCategory === 'choirs') {
          addResult = await addChoir({ title: song.title, lyrics: song.lyrics, tone: song.tone, speed: (song as Choir).speed });
        } else { // youth-choirs
          addResult = await addYouthChoir({ title: song.title, lyrics: song.lyrics, tone: song.tone });
        }
        
        if (addResult.success) {
          // Delete from source if add was successful
          if (sourceCategory === 'praises') {
            await deletePraise(song.id);
          } else if (sourceCategory === 'choirs') {
            await deleteChoir(song.id);
          } else { // youth-choirs
            await deleteYouthChoir(song.id);
          }
          successCount++;
        } else {
          duplicateCount++;
        }
      } catch(e) {
        errorCount++;
        console.error(`Failed to transfer song: ${song.title}`, e);
      }
    }
    
    setIsTransferring(false);
    setSelectedSongs(new Set());

    toast({
      title: "Transferencia Completada",
      description: `${successCount} canciones movidas. ${duplicateCount} duplicados omitidos. ${errorCount} errores.`,
    });
  };
  
  const isSelectAllChecked = sourceSongs.length > 0 && selectedSongs.size === sourceSongs.length;
  const isSelectAllIndeterminate = selectedSongs.size > 0 && selectedSongs.size < sourceSongs.length;


  return (
    <Card>
      <CardHeader>
        <CardTitle>Traspasar Canciones</CardTitle>
        <CardDescription>
          Mueve canciones de una categoría a otra. Las canciones se eliminarán de la categoría de origen y se añadirán a la de destino.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="source-category">Desde</Label>
            <Select value={sourceCategory} onValueChange={(v) => setSourceCategory(v as Category)}>
              <SelectTrigger id="source-category">
                <SelectValue placeholder="Seleccionar origen..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels)
                    .filter(([key]) => key !== destinationCategory)
                    .map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-6">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex-1 space-y-2">
            <Label htmlFor="destination-category">Hacia</Label>
             <Select value={destinationCategory} onValueChange={(v) => setDestinationCategory(v as Category)}>
              <SelectTrigger id="destination-category">
                <SelectValue placeholder="Seleccionar destino..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels)
                    .filter(([key]) => key !== sourceCategory)
                    .map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {sourceCategory && (
          <div>
            <Label>Canciones en "{categoryLabels[sourceCategory]}"</Label>
            <ScrollArea className="h-64 w-full rounded-md border mt-2">
                <div className="p-4">
                    {!isLoaded ? <p>Cargando...</p> : (
                        sourceSongs.length > 0 ? (
                            <>
                                <div className="flex items-center space-x-2 pb-2 border-b mb-2">
                                  <Checkbox
                                    id="select-all"
                                    checked={isSelectAllChecked}
                                    onCheckedChange={handleSelectAll}
                                    aria-label="Seleccionar todo"
                                  />
                                  <label
                                    htmlFor="select-all"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Seleccionar todo ({selectedSongs.size} / {sourceSongs.length})
                                  </label>
                                </div>
                                {sourceSongs.map(song => (
                                    <div key={song.id} className="flex items-center space-x-2 py-1">
                                        <Checkbox
                                            id={song.id}
                                            checked={selectedSongs.has(song.id)}
                                            onCheckedChange={(checked) => handleSongSelect(song.id, !!checked)}
                                        />
                                        <label htmlFor={song.id} className="text-sm w-full truncate">
                                            {song.title}
                                        </label>
                                    </div>
                                ))}
                            </>
                        ) : <p className="text-sm text-muted-foreground">No hay canciones en esta categoría.</p>
                    )}
                </div>
            </ScrollArea>
          </div>
        )}

        <div className="flex justify-end">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                     <Button disabled={!sourceCategory || !destinationCategory || selectedSongs.size === 0 || isTransferring}>
                        {isTransferring && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Traspasar ({selectedSongs.size})
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmar traspaso?</AlertDialogTitle>
                        <AlertDialogDescription>
                           Se moverán {selectedSongs.size} canciones desde "{sourceCategory && categoryLabels[sourceCategory]}" hacia "{destinationCategory && categoryLabels[destinationCategory]}". Esta acción es irreversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleTransfer}>Sí, traspasar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
