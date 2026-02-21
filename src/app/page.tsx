import { hymns } from '@/lib/hymns';
import { HymnListClient } from '@/components/hymn-list-client';
import { BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center bg-background min-h-screen">
      <div className="w-full max-w-2xl mx-auto">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-4 border-b">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline text-foreground">
                Himnario EECH
              </h1>
            </div>
        </header>

        <div className="p-4">
          <HymnListClient hymns={hymns} />
        </div>
      </div>
    </main>
  );
}
