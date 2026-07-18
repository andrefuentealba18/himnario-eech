import { Button } from '@/components/ui/button';
import { RepertoireListClient } from '@/components/repertoire-list-client';
import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';

export default function RepertoiresPage() {
  return (
    <main className="flex flex-col items-center bg-transparent min-h-screen pb-24">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
        <header className="sticky top-4 z-10 bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm border border-slate-200/60 flex items-center justify-between mb-8 mt-4">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full" asChild>
            <Link href="/">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline text-slate-900 text-center flex-1">
            Repertorios Guardados
          </h1>
          <Button className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 border-none" asChild>
            <Link href="/repertoire/new">
              <Plus className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Crear Nuevo</span>
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
    