"use client";

import { useMemo } from 'react';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { normalizeSearchTerm } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
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

type Song = {
  id: string;
  title: string;
  category: 'praise' | 'choir' | 'youth-choir';
  normalizedTitle: string;
};

const categoryLabels = {
  'praise': 'Alabanza',
  'choir': 'Coro',
  'youth-choir': 'Coro Juventud',
};

const categoryHrefs = {
  'praise': '/praises/',
  'choir': '/choirs/',
  'youth-choir': '/youth-choirs/',
};

export function DuplicateSongsManager() {
  const { praises, deletePraise, isLoaded: praisesLoaded } = usePraises();
  const { choirs, deleteChoir, isLoaded: choirsLoaded } = useChoirs();
  const { youthChoirs, deleteYouthChoir, isLoaded: youthChoirsLoaded } = useYouthChoirs();
  const { toast } = useToast();

  const isLoaded = praisesLoaded && choirsLoaded && youthChoirsLoaded;

  const allSongs: Song[] = useMemo(() => {
    if (!isLoaded) return [];
    return [
      ...praises.map(s => ({ ...s, category: 'praise' as const, normalizedTitle: normalizeSearchTerm(s.title) })),
      ...choirs.map(s => ({ ...s, category: 'choir' as const, normalizedTitle: normalizeSearchTerm(s.title) })),
      ...youthChoirs.map(s => ({ ...s, category: 'youth-choir' as const, normalizedTitle: normalizeSearchTerm(s.title) })),
    ];
  }, [praises, choirs, youthChoirs, isLoaded]);

  const duplicateGroups = useMemo(() => {
    const groups: { [key: string]: Song[] } = {};
    allSongs.forEach(song => {
      if (!groups[song.normalizedTitle]) {
        groups[song.normalizedTitle] = [];
      }
      groups[song.normalizedTitle].push(song);
    });

    return Object.values(groups)
      .filter(group => group.length > 1)
      .sort((a, b) => a[0].title.localeCompare(b[0].title));
  }, [allSongs]);

  const handleDelete = async (song: Song) => {
    try {
      if (song.category === 'praise') {
        await deletePraise(song.id);
      } else if (song.category === 'choir') {
        await deleteChoir(song.id);
      } else if (song.category === 'youth-choir') {
        await deleteYouthChoir(song.id);
      }
      toast({
        title: "Canción Eliminada",
        description: `"${song.title}" ha sido eliminada.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: "No se pudo eliminar la canción."
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Canciones Duplicadas</CardTitle>
        <CardDescription>
          Aquí se muestran las canciones (alabanzas, coros, etc.) que tienen el mismo título. Puedes revisarlas y eliminar las que no necesites.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isLoaded ? (
            <p>Cargando canciones...</p>
        ) : duplicateGroups.length > 0 ? (
          <div className="space-y-4">
            {duplicateGroups.map((group, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{group[0].title}</h3>
                <div className="space-y-2">
                  {group.map(song => (
                    <div key={`${song.category}-${song.id}`} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                      <div className="flex items-center gap-3">
                         <Badge variant="secondary">{categoryLabels[song.category]}</Badge>
                         <Link href={`${categoryHrefs[song.category]}${song.id}`} className="underline hover:text-primary">
                            Ver canción
                         </Link>
                      </div>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                             </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará permanentemente la canción "{song.title}" de la categoría "{categoryLabels[song.category]}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(song)}>
                                Sí, eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-green-600 font-semibold">¡Felicidades! No se encontraron canciones duplicadas.</p>
        )}
      </CardContent>
    </Card>
  );
}
