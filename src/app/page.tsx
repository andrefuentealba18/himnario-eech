
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Book, Mic, Church, Library, ArrowRight } from 'lucide-react';
import { SettingsDialog } from '@/components/settings-dialog';
import { GlobalSearch } from '@/components/global-search';

const navigationItems = [
  {
    title: "Himnos",
    description: "El himnario oficial completo",
    href: "/hymns",
    icon: Book,
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-600",
    delay: "0.6s"
  },
  {
    title: "Alabanzas",
    description: "Coros generales y especiales",
    href: "/praises",
    icon: Music,
    color: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-600",
    delay: "0.7s"
  },
  {
    title: "Coros",
    description: "Avivamiento y adoración",
    href: "/choirs",
    icon: Mic,
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-600",
    delay: "0.8s"
  },
  {
    title: "Agrupaciones",
    description: "Ciclistas, Dorcas y Juventud",
    href: "/youth-choirs",
    icon: Library,
    color: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-600",
    delay: "0.9s"
  }
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-x-hidden">
      {/* Fondo Animado con Esferas de Luz */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.05),transparent_50%)]" />
        <div className="absolute top-[-10%] -left-[10%] w-[70%] h-[70%] bg-primary/10 rounded-full filter blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] -right-[10%] w-[80%] h-[80%] bg-chart-5/10 rounded-full filter blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="container max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          
          {/* Sección Hero con Icono Flotante */}
          <header className="w-full text-center space-y-6 mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center justify-center p-5 bg-primary/10 rounded-[2.5rem] mb-4 shadow-inner animate-float">
              <Church className="h-14 w-14 text-primary" />
            </div>
            <div className="space-y-3">
              <h1 className="text-6xl md:text-8xl font-bold font-headline text-primary tracking-tighter leading-none">
                Himnario <span className="text-foreground">EECH</span>
              </h1>
              <p className="text-lg md:text-2xl text-muted-foreground font-body max-w-md mx-auto leading-tight font-medium">
                Tu cancionero espiritual digital.
              </p>
            </div>
          </header>

          {/* Buscador Global Estilizado */}
          <div className="w-full max-w-2xl mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-background/60 backdrop-blur-2xl p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-primary/10">
              <GlobalSearch />
            </div>
          </div>
          
          {/* Cuadrícula de Navegación (Botones tipo Card) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {navigationItems.map((item) => (
              <div key={item.title} className="opacity-0 animate-fade-in-up" style={{ animationDelay: item.delay }}>
                <Link href={item.href} className="group block h-full">
                  <Card className="h-full border-primary/10 bg-background/40 backdrop-blur-md transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(var(--primary),0.2)] hover:-translate-y-2 group-active:scale-95 overflow-hidden relative border-2">
                    {/* Resplandor interno en hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <CardContent className="relative z-10 flex items-center p-8 gap-6">
                      <div className={`p-5 rounded-3xl bg-gradient-to-br ${item.color} shadow-lg group-hover:scale-110 transition-transform duration-500 border border-white/20`}>
                        <item.icon className={`h-10 w-10 ${item.iconColor}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-bold text-2xl font-headline flex items-center group-hover:text-primary transition-colors">
                          {item.title}
                          <ArrowRight className="h-5 w-5 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                        </h3>
                        <p className="text-sm text-muted-foreground font-body leading-tight">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Footer Elegante */}
          <footer className="w-full text-center py-16 space-y-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary/30 to-transparent mx-auto" />
            <div className="flex flex-col items-center gap-4">
              <SettingsDialog />
              <div className="space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Iglesia Ejército Evangélico de Chile</p>
                <p className="text-sm text-primary/60 italic font-medium">"Alabaré a Jehová en mi vida; Cantaré salmos a mi Dios mientras viva."</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
