import { hymns } from '@/lib/hymns';
import { HymnListClient } from '@/components/hymn-list-client';
import { BookOpen, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HymnsIndexPage() {
  return (
    <main className="flex flex-col items-center bg-background min-h-screen">
      <div className="w-full max-w-2xl mx-auto">
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
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
        </header>

        <div className="p-4">
          <HymnListClient hymns={hymns} />
        </div>
      </div>
    </main>
  );
}
