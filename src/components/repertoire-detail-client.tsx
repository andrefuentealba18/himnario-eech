"use client";

import { useRepertoires } from "@/context/repertoires-context";
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
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ChevronLeft, Trash2, BookOpen, Mic, Music, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { HymnReference, SongReference } from "@/lib/repertoires";

interface RepertoireDetailClientProps {
  repertoireId: string;
}

export function RepertoireDetailClient({ repertoireId }: RepertoireDetailClientProps) {
  const { getRepertoireById, deleteRepertoire, isLoaded } = useRepertoires();
  const router = useRouter();
  const repertoire = getRepertoireById(repertoireId);

  const handleDelete = () => {
    deleteRepertoire(repertoireId);
    router.push("/repertoire");
  };

  if (!isLoaded) {
    return <p>Cargando repertorio...</p>;
  }

  if (!repertoire) {
    return <p>Repertorio no encontrado.</p>;
  }

  const songTypeToIcon = {
      'praise': <Music className="h-5 w-5 text-primary" />,
      'choir': <Mic className="h-5 w-5 text-primary" />,
      'youth-choir': <Users className="h-5 w-5 text-primary" />,
  }

  const songTypeToHref = {
      'praise': '/praises/',
      'choir': '/choirs/',
      'youth-choir': '/youth-choirs/',
  }

  const renderHymn = (hymn?: HymnReference | null) => {
    if (!hymn) return <p className="text-muted-foreground">No seleccionado</p>;
    return (
        <Link href={`/hymns/${hymn.number}`} className="flex items-center gap-3 p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-medium">{hymn.number}. {hymn.title}</span>
        </Link>
    )
  }
  
  const renderSong = (song?: SongReference | null) => {
    if (!song) return <p className="text-muted-foreground">No seleccionado</p>;
    return (
        <Link href={`${songTypeToHref[song.type]}${song.id}`} className="flex items-center gap-3 p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors">
            {songTypeToIcon[song.type]}
            <span className="font-medium">{song.title}</span>
        </Link>
    )
  }

  return (
     <main className="flex flex-col items-center bg-background min-h-screen">
      <div className="w-full max-w-4xl mx-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-2 border-b flex items-center justify-between h-14">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/repertoire">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold font-headline text-foreground">
              {repertoire.name}
            </h1>
            <p className="text-sm text-muted-foreground">
                {repertoire.createdAt ? format(repertoire.createdAt.toDate(), "EEEE, d 'de' MMMM, yyyy", { locale: es }) : ''}
            </p>
          </div>
          <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Se eliminará permanentemente el repertorio de "{repertoire.name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Sí, eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </header>

        <div className="p-4 space-y-6">
            <Card>
                <CardHeader><CardTitle>1. Primer Himno</CardTitle></CardHeader>
                <CardContent>{renderHymn(repertoire.firstHymn)}</CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>2. Alabanzas</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                    {repertoire.generalPraises && repertoire.generalPraises.length > 0 ? (
                        repertoire.generalPraises.map((song, index) => <div key={index}>{renderSong(song)}</div>)
                    ) : (
                        <p className="text-muted-foreground">No se seleccionaron alabanzas generales.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>3. Alabanza antes de la Palabra</CardTitle></CardHeader>
                <CardContent>{renderSong(repertoire.preWordPraise)}</CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>4. Alabanza por los Enfermos</CardTitle></CardHeader>
                <CardContent>{renderSong(repertoire.sickPraise)}</CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>5. Alabanza Intermedia</CardTitle></CardHeader>
                <CardContent>{renderSong(repertoire.intermediatePraise)}</CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>6. Alabanza Final</CardTitle></CardHeader>
                <CardContent>{renderSong(repertoire.finalPraise)}</CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
    