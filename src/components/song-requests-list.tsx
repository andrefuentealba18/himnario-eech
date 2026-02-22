"use client";

import { useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { SongRequest } from '@/lib/song-requests';
import { usePraises } from '@/context/praises-context';
import { useChoirs } from '@/context/choirs-context';
import { useYouthChoirs } from '@/context/youth-choirs-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { format } from "date-fns";
import { es } from "date-fns/locale";

const categoryLabels: Record<SongRequest['category'], string> = {
  'praise': 'Alabanza',
  'choir': 'Coro',
  'youth-choir': 'Coro Juventud',
};

export function SongRequestsList() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const { addPraise } = usePraises();
  const { addChoir } = useChoirs();
  const { addYouthChoir } = useYouthChoirs();

  const requestsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'songRequests');
  }, [firestore]);

  const { data: allRequests, isLoading } = useCollection<SongRequest>(requestsCollection);

  const pendingRequests = useMemo(() => {
    if (!allRequests) return [];
    return allRequests.filter(req => req.status === 'pending');
  }, [allRequests]);

  const sortedRequests = useMemo(() => {
    if (!pendingRequests) return [];
    return [...pendingRequests].sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
  }, [pendingRequests]);

  const handleApprove = async (request: SongRequest) => {
    if (!firestore) return;

    let result: { success: boolean };
    const songData = {
      title: request.title,
      lyrics: request.lyrics,
      tone: request.tone,
    };

    if (request.category === 'praise') {
      result = await addPraise(songData);
    } else if (request.category === 'choir') {
      result = await addChoir({ ...songData, speed: request.speed });
    } else { // youth-choir
      result = await addYouthChoir(songData);
    }

    if (result.success) {
      const requestRef = doc(firestore, 'songRequests', request.id);
      await updateDoc(requestRef, { status: 'approved' });
      toast({ title: 'Solicitud Aprobada', description: `"${request.title}" ha sido añadida.` });
    } else {
      toast({ variant: 'destructive', title: 'Error al Aprobar', description: 'La canción ya existe en esa categoría.' });
    }
  };

  const handleReject = async (request: SongRequest) => {
    if (!firestore) return;
    const requestRef = doc(firestore, 'songRequests', request.id);
    await updateDoc(requestRef, { status: 'rejected' });
    toast({ title: 'Solicitud Rechazada' });
  };

  if (isLoading) {
    return <p>Cargando solicitudes...</p>;
  }

  if (!sortedRequests || sortedRequests.length === 0) {
    return <p className="text-muted-foreground">No hay nuevas solicitudes de canciones pendientes.</p>;
  }

  return (
    <div className="space-y-4">
      {sortedRequests.map(request => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{request.title}</CardTitle>
                <CardDescription>
                  Sugerida por <span className="font-semibold">{request.submitterName}</span> el {request.createdAt ? format(request.createdAt.toDate(), "d 'de' MMMM, yyyy", { locale: es }) : ''}
                </CardDescription>
              </div>
              <Badge variant="outline">{categoryLabels[request.category]}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap font-mono bg-muted p-4 rounded-md">{request.lyrics}</p>
            {(request.tone || request.speed) && (
              <div className="flex gap-4 mt-4 text-sm">
                {request.tone && <div><strong>Tonalidad:</strong> {request.tone}</div>}
                {request.speed && <div><strong>Velocidad:</strong> {request.speed}</div>}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => handleReject(request)}>
              <X className="mr-2 h-4 w-4" />
              Rechazar
            </Button>
            <Button size="sm" onClick={() => handleApprove(request)}>
              <Check className="mr-2 h-4 w-4" />
              Aprobar
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
