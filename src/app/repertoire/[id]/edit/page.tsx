"use client";

import { useRepertoires } from '@/context/repertoires-context';
import { RepertoireBuilderClient } from '@/components/repertoire-builder-client';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import type { Repertoire } from '@/lib/repertoires';

function EditRepertoireContent() {
  const params = useParams();
  const id = params?.id as string;
  const { getRepertoireById, fetchRepertoireDirectly, isLoaded } = useRepertoires();
  const [directRepertoire, setDirectRepertoire] = useState<Repertoire | null>(null);

  const localRepertoire = getRepertoireById(id);
  const repertoire = localRepertoire || directRepertoire;

  useEffect(() => {
    if (!localRepertoire && id) {
      fetchRepertoireDirectly(id).then((r) => {
        if (r) setDirectRepertoire(r);
      });
    }
  }, [localRepertoire, id, fetchRepertoireDirectly]);

  if (!isLoaded && !repertoire) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-slate-400 animate-pulse font-medium">Cargando repertorio...</p>
      </main>
    );
  }

  if (!repertoire) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Repertorio no encontrado</h2>
        <Button asChild className="rounded-full">
          <Link href="/repertoire">Volver a Repertorios</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center bg-transparent min-h-screen pb-16">
      <div className="w-full max-w-4xl mx-auto px-4">
        <header className="sticky top-4 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm border border-slate-200/60 dark:border-white/10 flex items-center justify-between mb-4 mt-2">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href={`/repertoire/${id}`}>
              <ChevronLeft className="h-6 w-6 text-slate-600" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-headline text-foreground">
            Editar Repertorio
          </h1>
          <div className="w-10"></div>
        </header>

        <div className="pt-2">
          <RepertoireBuilderClient initialData={repertoire} repertoireId={id} />
        </div>
      </div>
    </main>
  );
}

export default function EditRepertoirePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-slate-400">Cargando...</p></div>}>
      <EditRepertoireContent />
    </Suspense>
  );
}
