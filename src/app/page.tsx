import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Music, Book, Users, Mic } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-lg mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold font-headline text-primary tracking-tight">
            Himnario EECH
          </h1>
          <p className="text-xl text-muted-foreground font-body">
            ¿Qué deseas cantar hoy?
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button asChild size="lg" className="h-24 text-lg font-headline">
            <Link href="/hymns">
              <Book className="mr-3 h-6 w-6" /> Himnos
            </Link>
          </Button>
          <Button asChild size="lg" className="h-24 text-lg font-headline" disabled>
            <Link href="#">
              <Music className="mr-3 h-6 w-6" /> Alabanzas
            </Link>
          </Button>
          <Button asChild size="lg" className="h-24 text-lg font-headline" disabled>
            <Link href="#">
              <Mic className="mr-3 h-6 w-6" /> Coros
            </Link>
          </Button>
          <Button asChild size="lg" className="h-24 text-lg font-headline" disabled>
            <Link href="#">
              <Users className="mr-3 h-6 w-6" /> Alabanza Coro Juventud
            </Link>
          </Button>
        </div>
        <footer className="text-center text-sm text-muted-foreground">
          <p>Iglesia Evangélica Episcopal de Chile</p>
        </footer>
      </div>
    </main>
  );
}
