
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
        <main className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center p-4 md:p-6">
          
          {/* Sección Hero más compacta */}
          <header className="w-full text-center space-y-3 mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-1 shadow-inner animate-float">
              <Church className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-0.5">
              <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary tracking-tighter leading-none">
                Himnario <span className="text-foreground">EECH</span>
              </h1>
              <p className="text-sm md:text-lg text-muted-foreground font-body max-w-xs mx-auto leading-tight font-medium">
                Tu cancionero espiritual digital.
              </p>
            </div>
          </header>

          {/* Buscador Global Estilizado */}
          <div className="w-full max-w-lg mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-background/60 backdrop-blur-2xl p-1 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-primary/10">
              <GlobalSearch />
            </div>
          </div>
          
          {/* Cuadrícula de Navegación más Compacta */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {navigationItems.map((item) => (
              <div key={item.title} className="opacity-0 animate-fade-in-up" style={{ animationDelay: item.delay }}>
                <Link href={item.href} className="group block h-full">
                  <Card className="h-full border-primary/5 bg-background/40 backdrop-blur-md transition-all duration-500 hover:shadow-[0_15px_30px_-10px_rgba(var(--primary),0.15)] hover:-translate-y-0.5 group-active:scale-95 overflow-hidden relative border-2">
                    {/* Resplandor interno en hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <CardContent className="relative z-10 flex flex-col items-center sm:flex-row sm:items-center p-3 sm:p-4 gap-3 text-center sm:text-left">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.color} shadow-sm group-hover:scale-105 transition-transform duration-500 border border-white/20 shrink-0`}>
                        <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                      </div>
                      <div className="flex-1 space-y-0 overflow-hidden">
                        <h3 className="font-bold text-base sm:text-lg font-headline flex items-center justify-center sm:justify-start group-hover:text-primary transition-colors leading-tight">
                          <span className="truncate">{item.title}</span>
                          <ArrowRight className="h-3.5 w-3.5 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary hidden sm:inline-block" />
                        </h3>
                        <p className="text-[10px] sm:text-xs text-muted-foreground font-body leading-tight truncate">
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
          <footer className="w-full text-center py-8 space-y-3 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-primary/20 to-transparent mx-auto" />
            <div className="flex flex-col items-center gap-2">
              <SettingsDialog />
              <div className="space-y-0.5">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Iglesia Ejército Evangélico de Chile</p>
                <p className="text-[11px] text-primary/60 italic font-medium">"Alabaré a Jehová en mi vida"</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
