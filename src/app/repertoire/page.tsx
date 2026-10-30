import { Button } from '@/components/ui/button';
import { RepertoireListClient } from '@/components/repertoire-list-client';
import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function RepertoiresPage() {
  return (
    <main className="flex flex-col items-center bg-transparent min-h-screen pb-24 animate-in fade-in duration-500">
      <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-16 pb-4 sm:pt-6 sm:pb-4 border-b border-slate-200/60 dark:border-white/10 shadow-sm transition-all duration-300">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-2">
          <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full h-10 w-10 shrink-0" asChild>
            <Link href="/">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold font-headline text-slate-900 dark:text-white text-center flex-1 truncate px-2">
            Repertorios Guardados
          </h1>
          <Button className="rounded-full h-10 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 border-none transition-all hover:scale-105 shrink-0" asChild>
            <Link href="/repertoire/new">
              <Plus className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline text-xs">Crear Nuevo</span>
            </Link>
          </Button>
        </div>
      </header>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <RepertoireListClient />
      </div>
    </main>
  );
}
    