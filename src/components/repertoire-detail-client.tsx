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
import type { SongReference } from "@/lib/repertoires";

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

  const songTypeToIcon: Record<SongReference['type'], React.ReactNode> = {
      'hymn': <BookOpen className="h-5 w-5 text-primary" />,
      'praise': <Music className="h-5 w-5 text-primary" />,
      'choir': <Mic className="h-5 w-5 text-primary" />,
      'youth-choir': <Users className="h-5 w-5 text-primary" />,
  }

  const songTypeToHref: Record<SongReference['type'], string> = {
      'hymn': '/hymns/',
      'praise': '/praises/',
      'choir': '/choirs/',
      'youth-choir': '/youth-choirs/',
  }
  
  const renderSongs = (songs?: SongReference[]) => {
    if (!songs || songs.length === 0) return <p className="text-muted-foreground p-3">No seleccionado</p>;
    return (
        <div className="space-y-1">
            {songs.map((song, index) => (
                <Link key={index} href={`${songTypeToHref[song.type]}${song.type === 'hymn' ? song.number : song.id}`} className="flex items-center gap-3 p-3 -mx-3 rounded-lg hover:bg-muted/50 transition-colors">
                    {songTypeToIcon[song.type]}
                    <span className="font-medium">{song.number ? `${song.number}. ` : ''}{song.title}</span>
                </Link>
            ))}
        </div>
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
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 font-bold" size="sm" asChild>
              <Link href={`/repertoire/${repertoireId}/print`}>
                 🖨️ <span className="hidden sm:inline ml-2">Exportar PDF</span>
              </Link>
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="h-9 w-9">
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
          </div>
        </header>

        <div className="p-4 space-y-6">
            <Card>
                <CardHeader><CardTitle>1. Primeros Cantos</CardTitle></CardHeader>
                <CardContent>{renderSongs(repertoire.firstHymns)}</CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>2. Alabanzas Generales</CardTitle></CardHeader>
                <CardContent>{renderSongs(repertoire.generalPraises)}</CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>3. Alabanzas antes de la Palabra</CardTitle></CardHeader>
                <CardContent>{renderSongs(repertoire.preWordPraises)}</CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>4. Alabanzas por los Enfermos</CardTitle></CardHeader>
                <CardContent>{renderSongs(repertoire.sickPraises)}</CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>5. Alabanzas Intermedias</CardTitle></CardHeader>
                <CardContent>{renderSongs(repertoire.intermediatePraises)}</CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle>6. Alabanzas Finales</CardTitle></CardHeader>
                <CardContent>{renderSongs(repertoire.finalPraises)}</CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
