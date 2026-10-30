"use client";

import { useRepertoires } from "@/context/repertoires-context";
import Link from "next/link";
import { formatRepertoireDate } from "@/lib/utils";
import { Button } from "./ui/button";
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
import { Trash2, Music, Share2, MapPin, Radio, Sparkles, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function RepertoireListClient() {
  const { repertoires, deleteRepertoire, isLoaded, currentChurchName } = useRepertoires();
  const { toast } = useToast();

  const handleShare = (repertoire: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://himnario-eech.vercel.app';
    const repUrl = `${baseUrl}/repertoire/${repertoire.id}`;

    let songListText = '';
    if (repertoire.blocks && repertoire.blocks.length > 0) {
      songListText = repertoire.blocks.map((b: any) => {
        const songs = (b.songs || []).map((s: any) => `  • ${s.number ? s.number + '. ' : ''}${s.title}`).join('\n');
        return `*${b.title}*\n${songs || '  (Sin cantos)'}`;
      }).join('\n\n');
    }

    const shareMessage = `🎵 *Repertorio de Servicio - ${currentChurchName}*\n👤 *Dirige:* ${repertoire.name}\n\n${songListText}\n\n📲 *Ver orden y letras en la app:*\n${repUrl}`;

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
        description: "Se ha abierto WhatsApp para enviar el repertorio.",
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-center text-slate-500 font-medium text-sm animate-pulse">
          Sincronizando repertorios de {currentChurchName}...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Church Scope & Real-Time Sync Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/10 p-2 rounded-full text-primary">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Congregación activa</p>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{currentChurchName}</h4>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider">En Vivo / Tiempo Real</span>
        </div>
      </div>

      {repertoires.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-200/70 dark:border-white/10 shadow-sm">
          <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-4">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">No hay repertorios en {currentChurchName}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
            Cuando crees un repertorio para el servicio, <strong>todos los miembros de {currentChurchName}</strong> podrán verlo aquí en tiempo real en sus teléfonos.
          </p>
          <Button asChild className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-8 shadow-lg shadow-blue-500/20">
            <Link href="/repertoire/new">
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Repertorio
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repertoires.map((repertoire) => {
            const firstSongTitle = repertoire.blocks?.[0]?.songs?.[0]?.title || repertoire.firstHymns?.[0]?.title || 'Sin alabanzas';
            const totalSongs = repertoire.blocks?.reduce((acc: number, b: any) => acc + (b.songs?.length || 0), 0) || 0;

            return (
              <div 
                key={repertoire.id} 
                className="group bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-3xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="bg-gradient-to-br from-slate-100/90 to-white dark:from-slate-800/60 dark:to-slate-900 p-6 border-b border-slate-100 dark:border-white/5 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-2xl sm:text-3xl font-cursive text-slate-900 dark:text-white capitalize mb-1 line-clamp-1 leading-tight">
                      {repertoire.name.toLowerCase()}
                    </h3>
                    <button
                      onClick={(e) => handleShare(repertoire, e)}
                      className="p-2 rounded-full hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors shrink-0"
                      title="Compartir por WhatsApp"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {formatRepertoireDate(repertoire.createdAt)}
                  </p>
                </div>

                <div className="p-6 pt-5 flex flex-col justify-between gap-5 bg-white/40 dark:bg-slate-900/30">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/40 p-2.5 rounded-full text-blue-600 dark:text-blue-400 shadow-sm shrink-0">
                      <Music className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                        {firstSongTitle}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {totalSongs} {totalSongs === 1 ? 'canto registrado' : 'cantos registrados'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-white/5">
                    <Button asChild className="rounded-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white transition-colors border-none shadow-sm font-bold px-6 text-xs h-9">
                      <Link href={`/repertoire/${repertoire.id}`}>Ver detalles</Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-black">¿Eliminar repertorio?</AlertDialogTitle>
                          <AlertDialogDescription className="text-sm text-slate-600 dark:text-slate-400">
                            Esta acción eliminará el repertorio de <strong className="text-slate-900 dark:text-white">{repertoire.name}</strong> para toda la congregación.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-2 sm:gap-0 mt-6">
                          <AlertDialogCancel className="rounded-full font-bold">Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteRepertoire(repertoire.id)} className="rounded-full font-bold bg-red-600 hover:bg-red-700 text-white">
                            Sí, eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
