import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Book, Users, Mic, Church, ListMusic } from 'lucide-react';
import { SettingsDialog } from '@/components/settings-dialog';

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-20 animate-fade-in"
      />
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full filter blur-3xl opacity-30 animate-fade-in" style={{ animationDelay: '0.2s' }} />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-secondary/40 rounded-full filter blur-3xl opacity-30 animate-fade-in" style={{ animationDelay: '0.4s' }} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <main className="container mx-auto flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg text-center space-y-8">
            
            <header className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                <Church className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary tracking-tight">
                Himnario EECH
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-body">
                ¿Qué deseas cantar hoy?
              </p>
            </header>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Link href="/hymns" className="group block">
                  <Card className="transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50">
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                      <Book className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
                      <span className="font-semibold text-lg font-body">Himnos</span>
                    </CardContent>
                  </Card>
                </Link>
              </div>
              <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <Link href="/praises" className="group block">
                  <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-foreground/20">
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                      <Music className="h-10 w-10 text-foreground/80 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
                      <span className="font-semibold text-lg font-body">Alabanzas</span>
                    </CardContent>
                  </Card>
                </Link>
              </div>
              <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <Link href="/choirs" className="group block">
                  <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-foreground/20">
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                      <Mic className="h-10 w-10 text-foreground/80 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
                      <span className="font-semibold text-lg font-body">Coros</span>
                    </CardContent>
                  </Card>
                </Link>
              </div>
              <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                <Link href="/youth-choirs" className="group block">
                  <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-foreground/20">
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                      <Users className="h-10 w-10 text-foreground/80 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
                      <span className="font-semibold text-lg font-body">Coro Juventud</span>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
            
            <footer className="text-center text-sm text-muted-foreground pt-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
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
