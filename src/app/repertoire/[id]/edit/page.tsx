"use client";

import { useRepertoires } from '@/context/repertoires-context';
import { RepertoireBuilderClient } from '@/components/repertoire-builder-client';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EditRepertoirePage() {
  const params = useParams();
  const id = params.id as string;
  const { getRepertoireById, isLoaded } = useRepertoires();

  if (!isLoaded) {
      return (
          <main className="flex flex-col items-center justify-center min-h-screen">
              <p>Cargando repertorio...</p>
          </main>
      )
  }

  const repertoire = getRepertoireById(id);

  if (!repertoire) {
      return (
          <main className="flex flex-col items-center justify-center min-h-screen">
              <p>Repertorio no encontrado.</p>
          </main>
      )
  }

  return (
     <main className="flex flex-col items-center bg-background min-h-screen">
      <div className="w-full max-w-4xl mx-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-2 border-b flex items-center justify-between h-14">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/repertoire/${id}`}>
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-headline text-foreground">
            Editar Repertorio
          </h1>
          <div className="w-10"></div>
        </header>

        <div className="p-4">
          <RepertoireBuilderClient initialData={repertoire} repertoireId={id} />
        </div>
      </div>
    </main>
  );
}
