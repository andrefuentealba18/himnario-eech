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
import { ChevronLeft, Trash2, BookOpen, Mic, Music, Users, Edit, Printer, Share2, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatRepertoireDate } from "@/lib/utils";
import type { SongReference, Repertoire } from "@/lib/repertoires";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface RepertoireDetailClientProps {
  repertoireId: string;
}

export function RepertoireDetailClient({ repertoireId }: RepertoireDetailClientProps) {
  const { getRepertoireById, fetchRepertoireDirectly, deleteRepertoire, isLoaded, currentChurchName } = useRepertoires();
  const router = useRouter();
  const { toast } = useToast();

  const [directRepertoire, setDirectRepertoire] = useState<Repertoire | null>(null);
  const [isDirectLoading, setIsDirectLoading] = useState(false);

  const localRepertoire = getRepertoireById(repertoireId);
  const repertoire = localRepertoire || directRepertoire;

  useEffect(() => {
    if (!localRepertoire && repertoireId) {
      setIsDirectLoading(true);
      fetchRepertoireDirectly(repertoireId)
        .then((found) => {
          if (found) setDirectRepertoire(found);
        })
        .finally(() => setIsDirectLoading(false));
    }
  }, [localRepertoire, repertoireId, fetchRepertoireDirectly]);

  const handleDelete = () => {
    deleteRepertoire(repertoireId);
    router.push("/repertoire");
  };

  const handleShare = () => {
    if (!repertoire) return;

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://himnario-eech.vercel.app';
    const repUrl = `${baseUrl}/repertoire/${repertoire.id}`;

    let songListText = '';
    if (repertoire.blocks && repertoire.blocks.length > 0) {
      songListText = repertoire.blocks.map((b) => {
        const songs = (b.songs || []).map((s) => `  • ${s.number ? s.number + '. ' : ''}${s.title}`).join('\n');
        return `*${b.title}*\n${songs || '  (Sin cantos)'}`;
      }).join('\n\n');
    }

    const churchText = (repertoire as any).churchName || currentChurchName;
    const shareMessage = `🎵 *Repertorio de Servicio - ${churchText}*\n👤 *Dirige:* ${repertoire.name}\n\n${songListText}\n\n📲 *Ver orden completo en la app:*\n${repUrl}`;

    if (navigator.share) {
      navigator.share({
        title: `Repertorio - ${repertoire.name}`,
        text: shareMessage,
        url: repUrl,
      }).catch(() => {});
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
      window.open(whatsappUrl, '_blank');
      toast({
        title: "Repertorio compartido",
        description: "Se ha abierto WhatsApp con el repertorio listo para enviar.",
      });
    }
  };

  if (!isLoaded || isDirectLoading) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium text-sm animate-pulse">Cargando repertorio en tiempo real...</p>
      </main>
    );
  }

  if (!repertoire) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Repertorio no encontrado</h2>
          <p className="text-slate-500 text-sm max-w-sm">
            Este repertorio no existe o pertenece a otra congregación.
          </p>
        </div>
        <Button asChild className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-8">
          <Link href="/repertoire">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Volver a Repertorios
          </Link>
        </Button>
      </main>
    );
  }

  const songTypeToIcon: Record<SongReference['type'], React.ReactNode> = {
    'hymn': <BookOpen className="h-5 w-5 text-primary" />,
    'praise': <Music className="h-5 w-5 text-primary" />,
    'choir': <Mic className="h-5 w-5 text-primary" />,
    'youth-choir': <Users className="h-5 w-5 text-primary" />,
  };

  const songTypeToHref: Record<SongReference['type'], string> = {
    'hymn': '/hymns/',
    'praise': '/praises/',
    'choir': '/choirs/',
    'youth-choir': '/youth-choirs/',
  };
  
  const renderSongs = (songs?: SongReference[]) => {
    if (!songs || songs.length === 0) {
      return (
        <p className="text-slate-400 italic p-3 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-white/10 text-sm">
          Ninguna alabanza asignada a este bloque.
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {songs.map((song, index) => (
          <Link 
            key={index} 
            href={`${songTypeToHref[song.type]}${song.type === 'hymn' ? song.number : song.id}?from=/repertoire/${repertoireId}`} 
            className="group flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 hover:ring-2 hover:ring-blue-100 dark:hover:ring-blue-900/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-full text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/30 transition-all duration-300">
              {songTypeToIcon[song.type]}
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-900 dark:group-hover:text-blue-400 text-sm sm:text-base">
              {song.number ? `${song.number}. ` : ''}{song.title}
            </span>
          </Link>
        ))}
      </div>
    );
  };

  const churchLabel = (repertoire as any).churchName || currentChurchName;

  return (
    <main className="flex flex-col items-center bg-transparent min-h-screen pb-24">
      {/* Top sticky header with safe notch padding for mobile */}
      <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-16 pb-4 sm:pt-6 sm:pb-4 border-b border-slate-200/60 dark:border-white/10 shadow-sm transition-all duration-300">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-2">
          <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full h-10 w-10 shrink-0" asChild>
            <Link href="/repertoire">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>

          <div className="text-center flex-1 px-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white capitalize truncate leading-tight">
              {repertoire.name.toLowerCase()}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {formatRepertoireDate(repertoire.createdAt)}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[10px] font-bold text-primary flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {churchLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleShare}
              className="h-10 w-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 transition-colors shadow-sm"
              title="Compartir por WhatsApp"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 transition-colors shadow-sm" asChild>
              <Link href={`/repertoire/${repertoireId}/edit`}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Editar</span>
              </Link>
            </Button>

            <Button className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-bold shadow-sm shadow-amber-500/30 hidden sm:flex border-none h-10 px-4 text-xs" asChild>
              <Link href={`/repertoire/${repertoireId}/print`}>
                <Printer className="mr-2 h-4 w-4" /> Exportar PDF
              </Link>
            </Button>

            <Button className="rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 shadow-sm shadow-amber-500/30 sm:hidden border-none h-10 w-10" size="icon" asChild>
              <Link href={`/repertoire/${repertoireId}/print`}>
                <Printer className="h-4 w-4" />
                <span className="sr-only">Exportar PDF</span>
              </Link>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-black">¿Eliminar repertorio?</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-slate-600 dark:text-slate-400">
                    Esta acción no se puede deshacer. Se eliminará permanentemente el repertorio de <strong className="text-slate-900 dark:text-white">{repertoire.name}</strong>.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
                  <AlertDialogCancel className="rounded-full font-bold">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="rounded-full font-bold bg-red-600 hover:bg-red-700 text-white">
                    Sí, eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-4">

        <div className="space-y-4">
          {repertoire.blocks && repertoire.blocks.length > 0 ? (
            repertoire.blocks.map((block) => (
              <div key={block.id} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-3xl shadow-lg shadow-slate-200/40 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-100/90 to-white dark:from-slate-800/60 dark:to-slate-900 px-5 py-3.5 border-b border-slate-100 dark:border-white/5">
                  <h2 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">{block.title}</h2>
                </div>
                <div className="p-4 sm:p-5">{renderSongs(block.songs)}</div>
              </div>
            ))
          ) : (
            <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-white/10">
              <p className="text-slate-500 italic">No hay bloques definidos en este repertorio.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
