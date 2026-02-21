import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Music, Book, Users, Mic, Church } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background -z-10"
      />
      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md text-center space-y-12">
          
          <header className="space-y-4">
            <div className="inline-block p-3 bg-primary/20 rounded-full mb-4">
              <Church className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold font-headline text-primary tracking-tight">
              Himnario EECH
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-body">
              ¿Qué deseas cantar hoy?
            </p>
          </header>
          
          <div className="grid grid-cols-1 gap-4 w-full">
            <Button asChild size="lg" className="h-20 text-xl font-body transition-transform hover:scale-105 shadow-lg">
              <Link href="/hymns">
                <Book className="mr-4 h-7 w-7" /> Himnos
              </Link>
            </Button>
            <Button asChild size="lg" className="h-20 text-xl font-body transition-transform hover:scale-105" variant="secondary" disabled>
              <Link href="#">
                <Music className="mr-4 h-7 w-7" /> Alabanzas
              </Link>
            </Button>
            <Button asChild size="lg" className="h-20 text-xl font-body transition-transform hover:scale-105" variant="secondary" disabled>
              <Link href="#">
                <Mic className="mr-4 h-7 w-7" /> Coros
              </Link>
            </Button>
            <Button asChild size="lg" className="h-20 text-xl font-body transition-transform hover:scale-105" variant="secondary" disabled>
              <Link href="#">
                <Users className="mr-4 h-7 w-7" /> Alabanza Coro Juventud
              </Link>
            </Button>
          </div>
          
          <footer className="text-center text-sm text-muted-foreground pt-8">
            <p>Iglesia Ejército Evangélico de Chile</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
