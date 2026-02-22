import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Music, Book, Users, Mic, Church, ListMusic } from 'lucide-react';
import { SettingsDialog } from '@/components/settings-dialog';

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary -z-20 animate-fade-in"
      />
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl opacity-50 animate-fade-in" style={{ animationDelay: '0.2s' }} />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-secondary rounded-full filter blur-3xl opacity-50 animate-fade-in" style={{ animationDelay: '0.4s' }} />

      <div className="relative z-10">
        <header className="absolute top-0 left-0 w-full p-4 flex justify-end opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            
        </header>
        
        <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md text-center space-y-8">
            
            <header className="space-y-4">
              <div className="inline-block p-4 bg-primary/20 rounded-full mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Church className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary tracking-tight opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                Himnario EECH
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-body opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                ¿Qué deseas cantar hoy?
              </p>
            </header>
            
            <div className="grid grid-cols-1 gap-4 w-full">
              <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <Button asChild size="lg" className="h-16 w-full text-lg font-body shadow-lg transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-1">
                  <Link href="/hymns">
                    <Book className="mr-4 h-6 w-6" /> Himnos
                  </Link>
                </Button>
              </div>
              <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                <Button asChild size="lg" className="h-16 w-full text-lg font-body shadow-lg transition-all duration-300 hover:shadow-accent-foreground/20 hover:-translate-y-1" variant="secondary">
                  <Link href="/praises">
                    <Music className="mr-4 h-6 w-6" /> Alabanzas
                  </Link>
                </Button>
              </div>
              <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                <Button asChild size="lg" className="h-16 w-full text-lg font-body shadow-lg" variant="secondary">
                  <Link href="/choirs">
                    <Mic className="mr-4 h-6 w-6" /> Coros
                  </Link>
                </Button>
              </div>
              <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                <Button asChild size="lg" className="h-16 w-full text-lg font-body shadow-lg" variant="secondary">
                  <Link href="/youth-choirs">
                    <Users className="mr-4 h-6 w-6" /> Alabanza Coro Juventud
                  </Link>
                </Button>
              </div>
            </div>
            
            <footer className="text-center text-sm text-muted-foreground pt-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '1s' }}>
              <div className="flex justify-center items-center gap-4">
                <Button asChild variant="ghost">
                  <Link href="/repertoire">
                    <ListMusic className="mr-2 h-4 w-4" />
                    Arma tu repertorio
                  </Link>
                </Button>
                <SettingsDialog />
              </div>
              <p className="mt-2">Iglesia Ejército Evangélico de Chile</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

    