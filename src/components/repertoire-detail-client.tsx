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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ChevronLeft, Trash2, BookOpen, Mic, Music, Users, Edit, Printer } from "lucide-react";
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
    if (!songs || songs.length === 0) return <p className="text-slate-400 italic p-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-sm">Ninguna alabanza asignada a este bloque.</p>;
    return (
        <div className="space-y-2">
            {songs.map((song, index) => (
                <Link key={index} href={`${songTypeToHref[song.type]}${song.type === 'hymn' ? song.number : song.id}?from=/repertoire/${repertoireId}`} className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-300 hover:ring-2 hover:ring-blue-100 hover:-translate-y-0.5 transition-all duration-300">
                    <div className="bg-slate-100 p-2 rounded-full text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/30 transition-all duration-300">
                        {songTypeToIcon[song.type]}
                    </div>
                    <span className="font-bold text-slate-700 group-hover:text-blue-900 text-sm sm:text-base">{song.number ? `${song.number}. ` : ''}{song.title}</span>
                </Link>
            ))}
        </div>
    )
  }

  return (
     <main className="flex flex-col items-center bg-transparent min-h-screen pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <header className="sticky top-4 z-10 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-slate-200/60 flex items-center justify-between mb-5 mt-2">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full h-9 w-9" asChild>
            <Link href="/repertoire">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-cursive text-slate-900 capitalize leading-none pt-1">
              {repertoire.name.toLowerCase()}
            </h1>
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 mt-1">
                {repertoire.createdAt ? format(repertoire.createdAt.toDate(), "d 'de' MMMM, yyyy", { locale: es }) : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 transition-colors shadow-sm" asChild>
              <Link href={`/repertoire/${repertoireId}/edit`}>
                 <Edit className="h-4 w-4" />
                 <span className="sr-only">Editar</span>
              </Link>
            </Button>
            <Button className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold shadow-sm shadow-amber-500/30 hidden sm:flex border-none h-9 px-4 text-xs" asChild>
              <Link href={`/repertoire/${repertoireId}/print`}>
                 <Printer className="mr-2 h-3 w-3" /> Exportar PDF
              </Link>
            </Button>
            {/* Mobile print icon */}
            <Button className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 shadow-sm shadow-amber-500/30 sm:hidden border-none h-9 w-9" size="icon" asChild>
              <Link href={`/repertoire/${repertoireId}/print`}>
                 <Printer className="h-3 w-3" />
              </Link>
            </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="h-9 w-9 rounded-full shadow-sm shadow-red-500/30">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                     <AlertDialogTitle className="text-xl font-black">¿Eliminar repertorio?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-slate-600">
                      Esta acción no se puede deshacer. Se eliminará permanentemente el repertorio de <strong className="text-slate-900">{repertoire.name}</strong>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
                    <AlertDialogCancel className="rounded-full font-bold">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="rounded-full font-bold bg-red-600 hover:bg-red-700">
                      Sí, eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          </div>
        </header>

        <div className="space-y-4">
            {repertoire.blocks && repertoire.blocks.length > 0 ? (
                // New Dynamic Blocks rendering
                repertoire.blocks.map((block) => (
                    <div key={block.id} className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl shadow-lg shadow-slate-200/40 overflow-hidden">
                        <div className="bg-gradient-to-r from-slate-100 to-white px-5 py-3 border-b border-slate-100">
                            <h2 className="text-base font-black text-slate-800 uppercase tracking-widest">{block.title}</h2>
                        </div>
                        <div className="p-4 sm:p-5">{renderSongs(block.songs)}</div>
                    </div>
                ))
            ) : (
                // Legacy Hardcoded Blocks rendering
                <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-slate-100">
                    <p className="text-slate-500 italic">No hay bloques definidos en este repertorio.</p>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}
