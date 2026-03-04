
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Book, Mic, Church, Library, ArrowRight } from 'lucide-react';
import { SettingsDialog } from '@/components/settings-dialog';
import { GlobalSearch } from '@/components/global-search';

const navigationItems = [
  {
    title: "Himnos",
    description: "Himnario oficial",
    href: "/hymns",
    icon: Book,
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-600",
    delay: "0.6s"
  },
  {
    title: "Alabanzas",
    description: "Cantos generales",
    href: "/praises",
    icon: Music,
    color: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-600",
    delay: "0.7s"
  },
  {
    title: "Coros",
    description: "Avivamiento",
    href: "/choirs",
    icon: Mic,
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-600",
    delay: "0.8s"
  },
  {
    title: "Agrupaciones",
    description: "Departamentos",
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
        <main className="container max-w-3xl mx-auto flex-1 flex flex-col items-center justify-center p-4 md:p-6">
          
          {/* Sección Hero con Icono Flotante */}
          <header className="w-full text-center space-y-4 mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-[2rem] mb-2 shadow-inner animate-float">
              <Church className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl md:text-7xl font-bold font-headline text-primary tracking-tighter leading-none">
                Himnario <span className="text-foreground">EECH</span>
              </h1>
              <p className="text-base md:text-xl text-muted-foreground font-body max-w-md mx-auto leading-tight font-medium">
                Tu cancionero espiritual digital.
              </p>
            </div>
          </header>

          {/* Buscador Global Estilizado */}
          <div className="w-full max-w-xl mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-background/60 backdrop-blur-2xl p-1.5 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-primary/10">
              <GlobalSearch />
            </div>
          </div>
          
          {/* Cuadrícula de Navegación (Botones tipo Card más compactos) */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {navigationItems.map((item) => (
              <div key={item.title} className="opacity-0 animate-fade-in-up" style={{ animationDelay: item.delay }}>
                <Link href={item.href} className="group block h-full">
                  <Card className="h-full border-primary/5 bg-background/40 backdrop-blur-md transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(var(--primary),0.15)] hover:-translate-y-1 group-active:scale-95 overflow-hidden relative border-2">
                    {/* Resplandor interno en hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <CardContent className="relative z-10 flex flex-col items-center sm:flex-row sm:items-center p-5 sm:p-6 gap-4 text-center sm:text-left">
                      <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${item.color} shadow-md group-hover:scale-110 transition-transform duration-500 border border-white/20 shrink-0`}>
                        <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                      </div>
                      <div className="flex-1 space-y-0.5 overflow-hidden">
                        <h3 className="font-bold text-lg font-headline flex items-center justify-center sm:justify-start group-hover:text-primary transition-colors">
                          <span className="truncate">{item.title}</span>
                          <ArrowRight className="h-4 w-4 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary hidden sm:inline-block" />
                        </h3>
                        <p className="text-xs text-muted-foreground font-body leading-tight truncate">
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
          <footer className="w-full text-center py-12 space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/20 to-transparent mx-auto" />
            <div className="flex flex-col items-center gap-3">
              <SettingsDialog />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Iglesia Ejército Evangélico de Chile</p>
                <p className="text-xs text-primary/60 italic font-medium">"Alabaré a Jehová en mi vida"</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
