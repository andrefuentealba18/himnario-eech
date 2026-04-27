"use client";

import { useRepertoires } from "@/context/repertoires-context";
import { useHymns } from "@/context/hymns-context";
import { usePraises } from "@/context/praises-context";
import { useChoirs } from "@/context/choirs-context";
import { useYouthChoirs } from "@/context/youth-choirs-context";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { SongReference } from "@/lib/repertoires";
import { useEffect, useState } from "react";
import { Printer, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface RepertoirePrintClientProps {
  repertoireId: string;
}

export function RepertoirePrintClient({ repertoireId }: RepertoirePrintClientProps) {
  const { getRepertoireById, isLoaded: rLoaded } = useRepertoires();
  const { hymns, isLoaded: hLoaded } = useHymns();
  const { praises, isLoaded: pLoaded } = usePraises();
  const { choirs, isLoaded: cLoaded } = useChoirs();
  const { youthChoirs, isLoaded: ycLoaded } = useYouthChoirs();
  
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    if (rLoaded && hLoaded && pLoaded && cLoaded && ycLoaded) {
      setAllLoaded(true);
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [rLoaded, hLoaded, pLoaded, cLoaded, ycLoaded]);

  if (!allLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
             <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
             <p className="text-xl font-bold animate-pulse text-slate-800">Generando PDF...</p>
          </div>
      </div>
    );
  }

  const repertoire = getRepertoireById(repertoireId);

  if (!repertoire) {
    return <p className="p-8 text-center text-slate-800">Repertorio no encontrado.</p>;
  }

  const getLyricsForSong = (ref: SongReference) => {
    switch (ref.type) {
      case 'hymn': 
        return hymns.find(h => h.number === ref.number)?.lyrics || '';
      case 'praise':
        return praises.find(p => p.id === ref.id)?.lyrics || '';
      case 'choir':
        return choirs.find(c => c.id === ref.id)?.lyrics || '';
      case 'youth-choir':
        return youthChoirs.find(y => y.id === ref.id)?.lyrics || '';
      default:
        return '';
    }
  };
  
  const getToneForSong = (ref: SongReference) => {
    switch (ref.type) {
      case 'hymn': 
        return hymns.find(h => h.number === ref.number)?.tone;
      case 'praise':
        return praises.find(p => p.id === ref.id)?.tone;
      case 'choir':
        return choirs.find(c => c.id === ref.id)?.tone;
      case 'youth-choir':
        return youthChoirs.find(y => y.id === ref.id)?.tone;
      default:
        return null;
    }
  };

  const renderSection = (title: string, songs?: SongReference[]) => {
    if (!songs || songs.length === 0) return null;

    return (
      <div className="mb-10 w-full col-span-full">
        <h2 className="text-2xl font-black mb-6 pb-2 border-b-2 border-slate-900 text-slate-900 break-after-avoid w-full">{title}</h2>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
          {songs.map((song, idx) => {
            const lyrics = getLyricsForSong(song);
            const tone = getToneForSong(song);
            return (
              <div key={idx} className="print-no-break mb-8 pb-4 break-inside-avoid">
                <div className="flex flex-col items-start gap-1 mb-3">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                     {song.number ? `${song.number}. ` : ''}{song.title}
                  </h3>
                  {tone && <span className="text-xs font-black bg-slate-200 px-2 py-0.5 rounded-full text-slate-700">Tono: {tone}</span>}
                </div>
                <div className="text-[13px] sm:text-sm whitespace-pre-wrap font-serif text-slate-800 leading-tight font-medium">
                  {lyrics || <span className="italic text-slate-400">Letra no encontrada.</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
     <main className="min-h-screen bg-white">
      {/* HEADER NO IMPRIMIBLE */}
      <div className="print:hidden sticky top-0 bg-slate-100 p-4 flex items-center justify-between border-b border-slate-200 shadow-sm z-50">
        <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-200" asChild>
          <Link href={`/repertoire/${repertoireId}`}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Volver
          </Link>
        </Button>
        <div className="font-bold text-slate-800 hidden sm:block text-sm">Vista Previa de Impresión</div>
        <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/30">
          <Printer className="mr-2 h-4 w-4" /> Exportar a PDF
        </Button>
      </div>

      {/* CONTENIDO A IMPRIMIR */}
      <div className="max-w-7xl mx-auto p-4 sm:p-8 print:p-0 bg-white print:bg-transparent">
        <div className="text-center mb-10 pb-6 border-b-[6px] border-slate-900">
           <h1 className="text-3xl sm:text-5xl font-black font-headline text-slate-900 uppercase mb-2">
             {repertoire.name}
           </h1>
           <p className="text-base sm:text-lg text-slate-700 font-bold uppercase tracking-widest mt-4">
              {repertoire.createdAt ? format(repertoire.createdAt.toDate(), "EEEE, d 'de' MMMM, yyyy", { locale: es }) : ''}
           </p>
           <p className="text-[10px] text-slate-500 font-black mt-2 uppercase tracking-[0.3em]">Himnario Digital EECH</p>
        </div>

        <div className="flex flex-col w-full">
            {renderSection("1. Primeros Cantos", repertoire.firstHymns)}
            {renderSection("2. Alabanzas Generales", repertoire.generalPraises)}
            {renderSection("3. Alabanzas antes de la Palabra", repertoire.preWordPraises)}
            {renderSection("4. Alabanzas por los Enfermos", repertoire.sickPraises)}
            {renderSection("5. Alabanzas Intermedias", repertoire.intermediatePraises)}
            {renderSection("6. Alabanzas Finales", repertoire.finalPraises)}
        </div>
      </div>
    </main>
  );
}
