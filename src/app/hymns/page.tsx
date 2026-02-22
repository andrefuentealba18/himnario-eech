"use client";

import { useHymns } from '@/context/hymns-context';
import { HymnListClient } from '@/components/hymn-list-client';
import { BookOpen, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';


export default function HymnsIndexPage() {
  const { hymns, isLoaded } = useHymns();

  return (
    <>
      <main className="flex flex-col items-center bg-background min-h-screen">
        <div className="w-full max-w-2xl mx-auto flex flex-col h-screen">
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-2 border-b flex items-center justify-center relative h-14">
              <Button variant="ghost" size="icon" asChild className="absolute left-2 top-1/2 -translate-y-1/2">
                  <Link href="/">
                      <ChevronLeft className="h-6 w-6" />
                      <span className="sr-only">Volver</span>
                  </Link>
              </Button>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold font-headline text-foreground">
                  Himnos
                </h1>
                <Badge variant="secondary" className="text-base font-semibold px-2">
                  {hymns.length}
                </Badge>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
          </header>

          <div className="p-4 flex-1 overflow-auto">
            {isLoaded ? <HymnListClient hymns={hymns} /> : <p>Cargando himnos...</p>}
          </div>

        </div>
      </main>
    </>
  );
}
