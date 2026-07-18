import { Button } from '@/components/ui/button';
import { RepertoireListClient } from '@/components/repertoire-list-client';
import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function RepertoiresPage() {
  return (
    <main className="flex flex-col items-center bg-transparent min-h-screen pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both pt-4">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <header className="sticky top-12 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-lg shadow-black/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between mb-8 mt-8">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-full h-10 w-10" asChild>
            <Link href="/">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold font-headline text-slate-900 dark:text-white text-center flex-1">
            Repertorios Guardados
          </h1>
          <Button className="rounded-full h-10 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 border-none transition-all hover:scale-105" asChild>
            <Link href="/repertoire/new">
              <Plus className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline text-xs">Crear Nuevo</span>
            </Link>
          </Button>
        </header>

        <div className="pt-2">
          <RepertoireListClient />
        </div>
      </div>
    </main>
  );
}
    