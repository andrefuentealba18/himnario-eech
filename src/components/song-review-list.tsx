
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
import { Check, Edit, Trash2, Loader2, Inbox, RefreshCw } from 'lucide-react';
import { EditPraiseDialog } from './edit-praise-dialog';
import { EditChoirDialog } from './edit-choir-dialog';
import { EditYouthChoirDialog } from './edit-youth-choir-dialog';

type PendingSong = (Praise | Choir | YouthChoir) & { category: 'praise' | 'choir' | 'youth-choir' };

const categoryLabels = {
  praise: 'Alabanza General',
  choir: 'Coro',
  'youth-choir': 'Agrupación',
};

export function SongReviewList() {
  const { pendingPraises, approvePraise, deletePraise, updatePraise, isLoaded: praisesLoaded } = usePraises();
  const { pendingChoirs, approveChoir, deleteChoir, updateChoir, isLoaded: choirsLoaded } = useChoirs();
  const { pendingYouthChoirs, approveYouthChoir, deleteYouthChoir, updateYouthChoir, isLoaded: youthChoirsLoaded } = useYouthChoirs();

  const isAnyLoading = !praisesLoaded || !choirsLoaded || !youthChoirsLoaded;

  const allPendingSongs: PendingSong[] = useMemo(() => {
    const list = [
      ...pendingPraises.map(s => ({ ...s, category: 'praise' as const })),
      ...pendingChoirs.map(s => ({ ...s, category: 'choir' as const })),
      ...pendingYouthChoirs.map(s => ({ ...s, category: 'youth-choir' as const })),
    ];

    // Ordenar por fecha de creación (más recientes primero)
    return list.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || Date.now();
      const timeB = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || Date.now();
      return timeB - timeA;
    });
  }, [pendingPraises, pendingChoirs, pendingYouthChoirs]);

  const handleApprove = (song: PendingSong) => {
    if (song.category === 'praise') approvePraise(song.id);
    else if (song.category === 'choir') approveChoir(song.id);
    else approveYouthChoir(song.id);
  };

  const handleDelete = (song: PendingSong) => {
    if (song.category === 'praise') deletePraise(song.id);
    else if (song.category === 'choir') deleteChoir(song.id);
    else deleteYouthChoir(song.id);
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
                <Button variant="outline" size="sm" className="h-9"><Edit className="mr-2 h-4 w-4" /> Modificar</Button>
            </EditPraiseDialog>
        );
    }
    if (song.category === 'choir') {
        return (
            <EditChoirDialog choir={song as Choir} onChoirUpdated={onUpdate as any}>
                <Button variant="outline" size="sm" className="h-9"><Edit className="mr-2 h-4 w-4" /> Modificar</Button>
            </EditChoirDialog>
        );
    }
    if (song.category === 'youth-choir') {
        return (
            <EditYouthChoirDialog youthChoir={song as YouthChoir} onYouthChoirUpdated={onUpdate as any}>
                <Button variant="outline" size="sm" className="h-9"><Edit className="mr-2 h-4 w-4" /> Modificar</Button>
            </EditYouthChoirDialog>
        );
    }
    return null;
  }

  if (allPendingSongs.length === 0) {
    if (isAnyLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse text-sm font-medium">Sincronizando con la nube...</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="bg-muted p-6 rounded-full">
          <Inbox className="h-12 w-12 text-muted-foreground/50" />
        </div>
        <div>
          <h3 className="text-xl font-bold">¡Todo al día!</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">No hay canciones nuevas esperando revisión en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isAnyLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-2 rounded-md justify-center border border-primary/10">
          <RefreshCw className="h-3 w-3 animate-spin" />
          Actualizando lista en tiempo real...
        </div>
      )}
      
      <div className="grid gap-4">
        {allPendingSongs.map(song => (
          <Card key={song.id} className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-foreground leading-tight">{song.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none">
                      {categoryLabels[song.category]}
                    </Badge>
                    {song.category === 'youth-choir' && (
                      <Badge variant="outline" className="border-primary/30 text-primary">{(song as YouthChoir).group}</Badge>
                    )}
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded font-mono">
                  {song.id.substring(0, 8)}
                </div>
              </div>
              <CardDescription className="pt-2 text-xs flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium text-foreground/70">
                  Tonalidad: <span className="text-primary font-bold">{song.tone || 'Indefinida'}</span>
                </span>
                {(song.category === 'choir' || (song as any).speed) && (
                  <span className="flex items-center gap-1 font-medium text-foreground/70">
                    Velocidad: <span className="text-primary font-bold">{(song as any).speed || '---'}</span>
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="relative group">
                <p className="whitespace-pre-wrap text-sm p-4 bg-muted/50 rounded-lg max-h-60 overflow-y-auto font-body leading-relaxed border border-transparent group-hover:border-primary/20 transition-colors">
                  {song.lyrics}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 bg-muted/20 py-3 px-6 rounded-b-lg border-t">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" /> Rechazar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar contribución?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Si rechazas esta canción, se borrará permanentemente de la base de datos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(song)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Sí, eliminar permanentemente
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex gap-2">
                {renderEditDialog(song)}
                <Button size="sm" onClick={() => handleApprove(song)} className="bg-green-600 hover:bg-green-700 shadow-sm">
                  <Check className="mr-2 h-4 w-4" /> Aprobar y Publicar
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
