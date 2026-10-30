import { RepertoireBuilderClient } from '@/components/repertoire-builder-client';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewRepertoirePage() {
  return (
    <main className="flex flex-col items-center bg-background min-h-screen pb-16">
      <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-16 pb-4 sm:pt-6 sm:pb-4 border-b border-slate-200/60 dark:border-white/10 shadow-sm transition-all duration-300">
        <div className="w-full max-w-4xl mx-auto flex items-center justify-between gap-2">
          <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full h-10 w-10 shrink-0" asChild>
            <Link href="/repertoire">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-headline text-foreground text-center flex-1 truncate px-2">
            Crear Nuevo Repertorio
          </h1>
          <div className="w-10"></div>
        </div>
      </header>

      <div className="w-full max-w-4xl mx-auto p-4">
        <RepertoireBuilderClient />
      </div>
    </main>
  );
}
    