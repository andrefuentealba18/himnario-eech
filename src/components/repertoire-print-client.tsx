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
import { PlaceHolderImages } from "@/lib/placeholder-images";
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
      <div className="mb-4">
        <h2 className="text-lg sm:text-xl font-black mb-3 pb-1 border-b-2 border-slate-300 text-slate-800 uppercase tracking-wider text-center break-after-avoid">{title}</h2>
        <div className="flex flex-col gap-4">
          {songs.map((song, idx) => {
            const lyricsText = getLyricsForSong(song);
            const tone = getToneForSong(song);
            
            const paragraphs = lyricsText ? lyricsText.split(/\n\s*\n/) : [];
            return (
              <div key={idx} className="print-no-break pb-2 break-inside-avoid flex flex-col items-center">
                <div className="flex flex-col items-center gap-1 mb-2 text-center">
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                     {song.number ? `${song.number}. ` : ''}{song.title}
                  </h3>
                  {tone && <span className="text-[10px] font-black bg-slate-200 px-2 py-0.5 rounded-full text-slate-700">Tono: {tone}</span>}
                </div>
                <div className="text-[12px] font-serif text-slate-800 leading-tight font-medium text-center w-full">
                  {paragraphs.length > 0 ? paragraphs.map((paragraph, pIndex) => {
                    const lines = paragraph.trim().split('\n');
                    const isChorus = lines[0].trim().toUpperCase().startsWith('CORO');
                    
                    return (
                      <div key={pIndex} className={`mb-3 w-full ${isChorus ? 'border-2 border-blue-200 rounded-xl p-3 bg-blue-50 relative mt-4' : ''}`}>
                         {isChorus && (
                            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-100 px-3 py-0.5 rounded-full text-[8px] font-black text-blue-700 uppercase tracking-widest border border-blue-200">
                               Coro
                            </div>
                         )}
                         {lines.map((line, lIndex) => {
                           if (isChorus && lIndex === 0) return null;
                           return (
                             <p key={lIndex} className={`whitespace-pre-wrap ${isChorus ? 'font-bold italic text-slate-700' : ''}`}>
                               {line}
                             </p>
                           );
                         })}
                      </div>
                    );
                  }) : <span className="italic text-slate-400">Letra no encontrada.</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const insigniaUrl = (PlaceHolderImages || []).find(img => img.id === 'eech-insignia')?.imageUrl || 'https://i.postimg.cc/bNZNNhmG/606348111-1237680331839203-2151282478766843505-n.jpg';
  return (
     <main className="min-h-screen bg-white relative">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { 
            size: auto;
            margin: 12mm 10mm 15mm 10mm; 
          }
          body { 
            -webkit-print-color-adjust: exact;
            background: white !important;
          }
        }
      `}} />
      
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
      {/* CONTENIDO A IMPRIMIR (Simula una hoja A4 en pantalla, se adapta al papel al imprimir) */}
      <div className="max-w-[794px] print:max-w-none print:w-full mx-auto p-8 sm:p-12 print:p-10 print:pt-14 print:pb-24 bg-white shadow-2xl print:shadow-none my-8 print:my-0 relative min-h-[1123px] print:min-h-0">
        
        {/* INSIGNIA EECH ABSOLUTA IZQUIERDA */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-10 flex">
           <img src={insigniaUrl} alt="EECH" className="w-16 h-16 rounded-full object-cover" />
        </div>
        {/* FECHA ABSOLUTA DERECHA */}
        <div className="absolute top-6 sm:top-8 right-4 sm:right-10 block text-right">
           <p className="text-xs text-slate-700 font-bold uppercase tracking-widest">
              {repertoire.createdAt ? format(repertoire.createdAt.toDate(), "dd / MM / yyyy", { locale: es }) : ''}
           </p>
        </div>
        {/* TITULO CENTRAL */}
        <div className="text-center mb-8 pb-4 border-b-[4px] border-slate-900 px-8 sm:px-24 flex flex-col items-center">
           <div className="flex items-baseline justify-center gap-4 mb-1 flex-wrap">
             <span className="text-sm sm:text-base font-black uppercase tracking-widest text-slate-700">Repertorio:</span>
             <h1 className="text-4xl font-cursive text-slate-900 capitalize translate-y-1">
               {repertoire.name.toLowerCase()}
             </h1>
           </div>
        </div>
        {/* FOOTER AL FINAL DEL DOCUMENTO */}
        <div className="absolute print:fixed bottom-0 pb-2 left-0 w-full text-center z-50">
           <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em]">Himnario Digital EECH</p>
        </div>
        <div className="columns-1 sm:columns-2 print:columns-2 gap-12 sm:gap-12 print:gap-12 w-full">
            {repertoire.blocks && repertoire.blocks.length > 0 ? (
                repertoire.blocks.map((block) => (
                    <div key={block.id}>
                        {renderSection(block.title, block.songs)}
                    </div>
                ))
            ) : (
                <>
                    {renderSection("1. Primeros Cantos", repertoire.firstHymns)}
                    {renderSection("2. Alabanzas Generales", repertoire.generalPraises)}
                    {renderSection("3. Alabanzas antes de la Palabra", repertoire.preWordPraises)}
                    {renderSection("4. Alabanzas por los Enfermos", repertoire.sickPraises)}
                    {renderSection("5. Alabanzas Intermedias", repertoire.intermediatePraises)}
                    {renderSection("6. Alabanzas Finales", repertoire.finalPraises)}
                </>
            )}
        </div>
      </div>
    </main>
  );
}
