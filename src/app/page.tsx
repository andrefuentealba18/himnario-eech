
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
      {/* Fondo Animado Mejorado */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.05),transparent_50%)]" />
        <div className="absolute top-[-10%] -left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full filter blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] -right-[10%] w-[60%] h-[60%] bg-chart-5/10 rounded-full filter blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="container max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          
          {/* Hero Section */}
          <header className="w-full text-center space-y-6 mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-3xl mb-4 shadow-inner">
              <Church className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-bold font-headline text-primary tracking-tight leading-none">
                Himnario <span className="text-foreground">EECH</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-body max-w-md mx-auto leading-relaxed">
                Tu cancionero espiritual digital. <br className="hidden md:block" />
                ¿Qué deseas cantar hoy para el Señor?
              </p>
            </div>
          </header>

          {/* Buscador Global con Sombra */}
          <div className="w-full max-w-2xl mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-background/40 backdrop-blur-xl p-2 rounded-full shadow-2xl border border-primary/10">
              <GlobalSearch />
            </div>
          </div>
          
          {/* Grid de Navegación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {navigationItems.map((item) => (
              <div key={item.title} className="opacity-0 animate-fade-in-up" style={{ animationDelay: item.delay }}>
                <Link href={item.href} className="group block h-full">
                  <Card className="h-full border-primary/5 bg-background/60 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 group-active:scale-95 overflow-hidden relative">
                    {/* Decoración de fondo de la tarjeta */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} rounded-full -mr-16 -mt-16 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />
                    
                    <CardContent className="relative z-10 flex items-center p-6 gap-5">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                        <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-bold text-xl font-headline flex items-center group-hover:text-primary transition-colors">
                          {item.title}
                          <ArrowRight className="h-4 w-4 ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
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
          
          {/* Footer Animado */}
          <footer className="w-full text-center py-12 space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '1.1s' }}>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/20 to-transparent mx-auto mb-6" />
            <div className="flex flex-col items-center gap-4">
              <SettingsDialog />
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Iglesia Ejército Evangélico de Chile</p>
                <p className="text-xs text-muted-foreground/60 italic">"Alabaré a Jehová en mi vida; Cantaré salmos a mi Dios mientras viva."</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
