
"use client";

import { useMemo } from 'react';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Trash2, AlertCircle } from 'lucide-react';
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
  'praise': 'Alabanza General',
  'choir': 'Coro',
  'youth-choir': 'Agrupación',
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
      // El ID de grupo incluye la categoría para que NO marque como duplicado
      // canciones que están en categorías distintas (ej. Alabanza vs Agrupación)
      const groupKey = `${song.category}-${song.normalizedTitle}`;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(song);
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
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Limpieza de Duplicados (Por Categoría)
        </CardTitle>
        <CardDescription>
          Solo se muestran canciones repetidas <strong>dentro de la misma sección</strong>. Puedes tener la misma canción en Alabanzas y Agrupaciones sin problemas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isLoaded ? (
            <p className="text-center py-4">Cargando canciones...</p>
        ) : duplicateGroups.length > 0 ? (
          <div className="space-y-4">
            {duplicateGroups.map((group, index) => (
              <div key={index} className="p-4 border rounded-lg bg-yellow-50/30 border-yellow-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg">{group[0].title}</h3>
                  <Badge variant="outline" className="bg-white">{categoryLabels[group[0].category]}</Badge>
                </div>
                <div className="space-y-2">
                  {group.map(song => (
                    <div key={`${song.category}-${song.id}`} className="flex items-center justify-between p-3 rounded-md bg-background border shadow-sm">
                      <div className="flex items-center gap-3">
                         <Link href={`${categoryHrefs[song.category]}${song.id}?from=admin`} className="text-sm font-medium text-primary hover:underline">
                            Ver contenido
                         </Link>
                      </div>
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                             </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar este duplicado?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Se borrará definitivamente la versión de "{song.title}" en la categoría "{categoryLabels[song.category]}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(song)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
          <div className="text-center py-8 bg-green-50 rounded-xl border border-green-100">
            <p className="text-green-700 font-bold text-lg">¡Base de datos limpia!</p>
            <p className="text-green-600/80 text-sm">No se encontraron canciones duplicadas dentro de las mismas categorías.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
