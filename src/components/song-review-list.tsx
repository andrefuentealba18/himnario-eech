"use client";

import { useMemo } from 'react';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import type { Praise } from '@/lib/praises';
import type { Choir } from '@/lib/choirs';
import type { YouthChoir } from '@/lib/youth-choirs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { Check, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditPraiseDialog } from './edit-praise-dialog';
import { EditChoirDialog } from './edit-choir-dialog';
import { EditYouthChoirDialog } from './edit-youth-choir-dialog';

type PendingSong = (Praise | Choir | YouthChoir) & { category: 'praise' | 'choir' | 'youth-choir' };

const categoryLabels = {
  praise: 'Alabanza',
  choir: 'Coro',
  'youth-choir': 'Coro Juventud',
};

export function SongReviewList() {
  const { pendingPraises, approvePraise, deletePraise, updatePraise, isLoaded: praisesLoaded } = usePraises();
  const { pendingChoirs, approveChoir, deleteChoir, updateChoir, isLoaded: choirsLoaded } = useChoirs();
  const { pendingYouthChoirs, approveYouthChoir, deleteYouthChoir, updateYouthChoir, isLoaded: youthChoirsLoaded } = useYouthChoirs();
  const { toast } = useToast();

  const isLoaded = praisesLoaded && choirsLoaded && youthChoirsLoaded;

  const allPendingSongs: PendingSong[] = useMemo(() => {
    if (!isLoaded) return [];
    return [
      ...pendingPraises.map(s => ({ ...s, category: 'praise' as const })),
      ...pendingChoirs.map(s => ({ ...s, category: 'choir' as const })),
      ...pendingYouthChoirs.map(s => ({ ...s, category: 'youth-choir' as const })),
    ].sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  }, [pendingPraises, pendingChoirs, pendingYouthChoirs, isLoaded]);

  const handleApprove = async (song: PendingSong) => {
    try {
      if (song.category === 'praise') await approvePraise(song.id);
      else if (song.category === 'choir') await approveChoir(song.id);
      else await approveYouthChoir(song.id);
      toast({ title: 'Canción Aprobada', description: `"${song.title}" ahora es visible para todos.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo aprobar la canción.' });
    }
  };

  const handleDelete = async (song: PendingSong) => {
    try {
      if (song.category === 'praise') await deletePraise(song.id);
      else if (song.category === 'choir') await deleteChoir(song.id);
      else await deleteYouthChoir(song.id);
      toast({ title: 'Canción Rechazada', description: `"${song.title}" ha sido eliminada.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'No se pudo eliminar la canción.' });
    }
  };

  const handleUpdate = (song: PendingSong) => {
    if (song.category === 'praise') return (data: Omit<Praise, 'id'>) => updatePraise(song.id, data);
    if (song.category === 'choir') return (data: Omit<Choir, 'id'>) => updateChoir(song.id, data);
    return (data: Omit<YouthChoir, 'id'>) => updateYouthChoir(song.id, data);
  };
  
  const renderEditDialog = (song: PendingSong) => {
    const onUpdate = handleUpdate(song);

    if (song.category === 'praise') {
        return (
            <EditPraiseDialog praise={song as Praise} onPraiseUpdated={onUpdate as any}>
                <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Modificar</Button>
            </EditPraiseDialog>
        );
    }
    if (song.category === 'choir') {
        return (
            <EditChoirDialog choir={song as Choir} onChoirUpdated={onUpdate as any}>
                <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Modificar</Button>
            </EditChoirDialog>
        );
    }
    if (song.category === 'youth-choir') {
        return (
            <EditYouthChoirDialog youthChoir={song as YouthChoir} onYouthChoirUpdated={onUpdate as any}>
                <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" /> Modificar</Button>
            </EditYouthChoirDialog>
        );
    }
    return null;
  }

  if (!isLoaded) {
    return <p>Cargando canciones para revisar...</p>;
  }

  if (allPendingSongs.length === 0) {
    return <p className="text-muted-foreground">No hay canciones nuevas pendientes de revisión.</p>;
  }

  return (
    <div className="space-y-4">
      {allPendingSongs.map(song => (
        <Card key={song.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{song.title}</CardTitle>
              <Badge variant="secondary">{categoryLabels[song.category]}</Badge>
            </div>
            <CardDescription>
              Tonalidad: {song.tone || 'No especificada'}
              {song.category === 'choir' && `, Velocidad: ${(song as Choir).speed || 'No especificada'}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm p-4 bg-muted rounded-md max-h-48 overflow-y-auto">
              {song.lyrics}
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /> Rechazar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>Esta acción eliminará permanentemente la canción "{song.title}".</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(song)}>Sí, rechazar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {renderEditDialog(song)}

            <Button size="sm" onClick={() => handleApprove(song)}>
              <Check className="mr-2 h-4 w-4" /> Aprobar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
