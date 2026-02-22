import { RepertoireBuilderClient } from '@/components/repertoire-builder-client';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewRepertoirePage() {
  return (
     <main className="flex flex-col items-center bg-background min-h-screen">
      <div className="w-full max-w-4xl mx-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-2 border-b flex items-center justify-between h-14">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/repertoire">
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <h1 className="text-xl font-bold font-headline text-foreground">
            Crear Nuevo Repertorio
          </h1>
          <div className="w-10"></div>
        </header>

        <div className="p-4">
          <RepertoireBuilderClient />
        </div>
      </div>
    </main>
  );
}
    