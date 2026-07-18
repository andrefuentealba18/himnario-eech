"use client";

import { useRepertoires } from "@/context/repertoires-context";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
import { Trash2, Music } from "lucide-react";

export function RepertoireListClient() {
  const { repertoires, deleteRepertoire, isLoaded } = useRepertoires();

  if (!isLoaded) {
    return <p className="text-center text-slate-500 mt-12 animate-pulse">Cargando repertorios...</p>;
  }

  if (repertoires.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm mt-8">
        <h2 className="text-2xl font-black text-slate-700 mb-2">No hay repertorios guardados</h2>
        <p className="text-slate-500">Crea tu primer repertorio para que aparezca aquí.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {repertoires.map((repertoire) => (
        <div key={repertoire.id} className="group bg-white/60 backdrop-blur-xl border border-white rounded-3xl shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
          <div className="bg-gradient-to-br from-slate-100 to-white p-6 border-b border-slate-100 flex-1">
             <h3 className="text-3xl font-cursive text-slate-900 capitalize mb-1 line-clamp-1 leading-tight">{repertoire.name.toLowerCase()}</h3>
             <p className="text-xs font-black uppercase tracking-widest text-slate-400">
               {repertoire.createdAt ? format(repertoire.createdAt.toDate(), "d 'de' MMMM, yyyy", { locale: es }) : ''}
             </p>
          </div>
          <div className="p-6 pt-5 flex flex-col justify-between gap-6 bg-white/40">
            <div className="flex items-center gap-3">
               <div className="bg-blue-100 p-2.5 rounded-full text-blue-600 shadow-sm">
                  <Music className="h-4 w-4" />
               </div>
               <p className="text-sm font-medium text-slate-600 truncate flex-1">
                 {repertoire.firstHymns?.[0]?.title || repertoire.blocks?.[0]?.songs?.[0]?.title || 'Sin alabanzas'}
               </p>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <Button asChild className="rounded-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white transition-colors border-none shadow-sm font-bold px-6">
                <Link href={`/repertoire/${repertoire.id}`}>Ver detalles</Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="rounded-full h-10 w-10 shadow-lg shadow-red-500/20">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-black">¿Eliminar repertorio?</AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-slate-600">
                      Esta acción no se puede deshacer. Se eliminará permanentemente el repertorio de <strong className="text-slate-900">{repertoire.name}</strong>.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="gap-2 sm:gap-0 mt-6">
                    <AlertDialogCancel className="rounded-full font-bold">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteRepertoire(repertoire.id)} className="rounded-full font-bold bg-red-600 hover:bg-red-700">
                      Sí, eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
    
