
"use client";

import { useMemo } from 'react';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { useSpecialOccasions } from '@/context/special-occasions-context';
import type { Praise } from '@/lib/praises';
import type { Choir } from '@/lib/choirs';
import type { YouthChoir } from '@/lib/youth-choirs';
import type { SpecialOccasion } from '@/lib/special-occasions';
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
import { Check, Edit, Trash2, Loader2, Inbox, RefreshCw, Eye } from 'lucide-react';
import { EditPraiseDialog } from './edit-praise-dialog';
import { EditChoirDialog } from './edit-choir-dialog';
import { EditYouthChoirDialog } from './edit-youth-choir-dialog';

type PendingSong = (Praise | Choir | YouthChoir | SpecialOccasion) & { categoryType: 'praise' | 'choir' | 'youth-choir' | 'special-occasion' };

const categoryLabels = {
  praise: 'Alabanza General',
  choir: 'Coro',
  'youth-choir': 'Agrupación',
  'special-occasion': 'Ocasión Especial',
};

export function SongReviewList() {
  const { pendingPraises, approvePraise, deletePraise, updatePraise, isLoaded: praisesLoaded } = usePraises();
  const { pendingChoirs, approveChoir, deleteChoir, updateChoir, isLoaded: choirsLoaded } = useChoirs();
  const { pendingYouthChoirs, approveYouthChoir, deleteYouthChoir, updateYouthChoir, isLoaded: youthChoirsLoaded } = useYouthChoirs();
  const { pendingSpecialOccasions, approveSpecialOccasion, deleteSpecialOccasion, updateSpecialOccasion, isLoaded: specialsLoaded } = useSpecialOccasions();

  const allPendingSongs: PendingSong[] = useMemo(() => {
    const list: PendingSong[] = [
      ...pendingPraises.map(s => ({ ...s, categoryType: 'praise' as const })),
      ...pendingChoirs.map(s => ({ ...s, categoryType: 'choir' as const })),
      ...pendingYouthChoirs.map(s => ({ ...s, categoryType: 'youth-choir' as const })),
      ...pendingSpecialOccasions.map(s => ({ ...s, categoryType: 'special-occasion' as const })),
    ];

    return list.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || Date.now();
      const timeB = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || Date.now();
      return timeB - timeA;
    });
  }, [pendingPraises, pendingChoirs, pendingYouthChoirs, pendingSpecialOccasions]);

  const handleApprove = (song: PendingSong) => {
    if (song.categoryType === 'praise') approvePraise(song.id);
    else if (song.categoryType === 'choir') approveChoir(song.id);
    else if (song.categoryType === 'youth-choir') approveYouthChoir(song.id);
    else approveSpecialOccasion(song.id);
  };

  const handleDelete = (song: PendingSong) => {
    if (song.categoryType === 'praise') deletePraise(song.id);
    else if (song.categoryType === 'choir') deleteChoir(song.id);
    else if (song.categoryType === 'youth-choir') deleteYouthChoir(song.id);
    else deleteSpecialOccasion(song.id);
  };

  const handleUpdate = (song: PendingSong) => {
    if (song.categoryType === 'praise') return (data: Omit<Praise, 'id'>) => updatePraise(song.id, data);
    if (song.categoryType === 'choir') return (data: Omit<Choir, 'id'>) => updateChoir(song.id, data);
    if (song.categoryType === 'youth-choir') return (data: Omit<YouthChoir, 'id'>) => updateYouthChoir(song.id, data);
    return (data: Omit<SpecialOccasion, 'id'>) => updateSpecialOccasion(song.id, data);
  };
  
  const renderEditDialog = (song: PendingSong) => {
    const onUpdate = handleUpdate(song);

    if (song.categoryType === 'praise') {
        return (
            <EditPraiseDialog praise={song as Praise} onPraiseUpdated={onUpdate as any}>
                <Button variant="outline" size="sm" className="h-10 rounded-xl"><Edit className="mr-2 h-4 w-4" /> Editar</Button>
            </EditPraiseDialog>
        );
    }
    if (song.categoryType === 'choir') {
        return (
            <EditChoirDialog choir={song as Choir} onChoirUpdated={onUpdate as any}>
                <Button variant="outline" size="sm" className="h-10 rounded-xl"><Edit className="mr-2 h-4 w-4" /> Editar</Button>
            </EditChoirDialog>
        );
    }
    if (song.categoryType === 'youth-choir') {
        return (
            <EditYouthChoirDialog youthChoir={song as YouthChoir} onYouthChoirUpdated={onUpdate as any}>
                <Button variant="outline" size="sm" className="h-10 rounded-xl"><Edit className="mr-2 h-4 w-4" /> Editar</Button>
            </EditYouthChoirDialog>
        );
    }
    return null;
  }

  const isAnyLoading = !praisesLoaded || !choirsLoaded || !youthChoirsLoaded || !specialsLoaded;

  if (allPendingSongs.length === 0) {
    if (isAnyLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-muted-foreground animate-pulse text-sm font-medium">Sincronizando pendientes...</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="bg-muted p-8 rounded-full">
          <Inbox className="h-16 w-16 text-muted-foreground/30" />
        </div>
        <div>
          <h3 className="text-xl font-bold">¡Todo al día!</h3>
          <p className="text-muted-foreground max-w-xs mx-auto text-sm mt-1">No hay nuevas alabanzas esperando tu aprobación.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Cantos en Espera ({allPendingSongs.length})</h2>
        {isAnyLoading && <RefreshCw className="h-3 w-3 animate-spin text-primary" />}
      </div>
      
      <div className="grid gap-4">
        {allPendingSongs.map(song => (
          <Card key={song.id} className="border-none bg-white dark:bg-white/5 shadow-md hover:shadow-lg transition-all duration-300 rounded-[2rem] overflow-hidden group">
            <div className="h-1.5 w-full bg-amber-500 opacity-60" />
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-foreground leading-tight">{song.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-none font-bold text-[10px]">
                      {categoryLabels[song.categoryType]}
                    </Badge>
                    {song.categoryType === 'youth-choir' && (
                      <Badge variant="outline" className="border-primary/20 text-primary text-[10px] font-bold">{(song as YouthChoir).group}</Badge>
                    )}
                  </div>
                </div>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <Eye className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nota:</span>
                <Badge variant="outline" className="text-primary font-black border-primary/20 bg-primary/5">{song.tone || 'Indefinida'}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="relative">
                <p className="whitespace-pre-wrap text-sm p-5 bg-slate-50 dark:bg-black/20 rounded-2xl max-h-48 overflow-y-auto font-body leading-relaxed border border-transparent group-hover:border-amber-200/50 transition-colors">
                  {song.lyrics}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-3 bg-muted/10 py-4 px-6 rounded-b-[2rem] border-t border-slate-100 dark:border-white/5">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 h-10 rounded-xl px-4 font-bold">
                    <Trash2 className="mr-2 h-4 w-4" /> Rechazar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2rem]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar sugerencia?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción borrará permanentemente la propuesta de "{song.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(song)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex gap-2">
                {renderEditDialog(song)}
                <Button size="sm" onClick={() => handleApprove(song)} className="bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 h-10 rounded-xl px-6 font-bold">
                  <Check className="mr-2 h-4 w-4" /> Aprobar
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
