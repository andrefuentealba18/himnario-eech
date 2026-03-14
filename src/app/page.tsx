import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Book, Mic, Church, Library } from 'lucide-react';
import { SettingsDialog } from '@/components/settings-dialog';
import { GlobalSearch } from '@/components/global-search';
import { ThemeToggle } from '@/components/theme-toggle';

const navigationItems = [
  {
    title: "Himnos",
    href: "/hymns",
    icon: Book,
    color: "bg-blue-50 dark:bg-blue-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    delay: "0.2s"
  },
  {
    title: "Alabanzas",
    href: "/praises",
    icon: Music,
    color: "bg-indigo-50 dark:bg-indigo-500/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    delay: "0.3s"
  },
  {
    title: "Coros",
    href: "/choirs",
    icon: Mic,
    color: "bg-rose-50 dark:bg-rose-500/10",
    iconColor: "text-rose-600 dark:text-rose-400",
    delay: "0.4s"
  },
  {
    title: "Agrupaciones",
    href: "/youth-choirs",
    icon: Library,
    color: "bg-orange-50 dark:bg-orange-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
    delay: "0.5s"
  }
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-x-hidden font-body transition-colors duration-1000">
      {/* Fondo Animado Mejorado */}
      <div className="fixed inset-0 -z-20 overflow-hidden bg-background">
        {/* Capa de Patrón Institucional */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
        
        {/* Esferas de Color con Animación Orgánica */}
        <div className="absolute top-[-10%] -left-[10%] w-[70%] h-[70%] bg-blue-400/15 dark:bg-blue-600/10 rounded-full filter blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] -right-[10%] w-[80%] h-[80%] bg-primary/15 dark:bg-primary/10 rounded-full filter blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[-5%] w-[45%] h-[45%] bg-indigo-400/15 dark:bg-indigo-600/10 rounded-full filter blur-[100px] animate-pulse-slow" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-[15%] left-[5%] w-[50%] h-[50%] bg-violet-400/15 dark:bg-violet-600/10 rounded-full filter blur-[110px] animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Botón de Modo Oscuro Superior Derecho */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 animate-in fade-in zoom-in duration-1000">
          <ThemeToggle />
        </div>

        <main className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center p-6">
          
          {/* Header Institucional */}
          <header className="w-full text-center space-y-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center justify-center p-4 bg-card rounded-3xl mb-4 shadow-sm border border-slate-100 dark:border-white/5 animate-float backdrop-blur-md">
              <Church className="h-10 w-10 text-primary dark:text-blue-400" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-foreground">
                Himnario <span className="text-primary dark:text-blue-400">EECH</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground font-bold tracking-[0.3em] uppercase opacity-80">
                Cancionero Digital
              </p>
            </div>
          </header>

          {/* Buscador Global Moderno */}
          <div className="w-full max-w-lg mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            <GlobalSearch />
          </div>
          
          {/* Cuadrícula 2x2 Oficial */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            {navigationItems.map((item) => (
              <div key={item.title} className="animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: item.delay }}>
                <Link href={item.href} className="group block h-full">
                  <Card className="h-full border-slate-200/60 dark:border-white/5 bg-card/60 dark:bg-white/[0.03] backdrop-blur-xl hover:bg-card transition-all duration-500 hover:shadow-xl dark:hover:shadow-blue-500/10 hover:-translate-y-1 active:scale-95 overflow-hidden relative shadow-sm border-2">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[140px]">
                      <div className={`p-4 rounded-2xl ${item.color} mb-4 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                        <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-[10px] md:text-xs uppercase tracking-wider font-body text-foreground group-hover:text-primary dark:group-hover:text-blue-400 transition-colors leading-tight px-2">
                        {item.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Footer Institucional */}
          <footer className="w-full text-center mt-12 pb-10 space-y-6 animate-in fade-in duration-1000 delay-500">
            <div className="h-px w-16 bg-slate-300/50 dark:bg-white/10 mx-auto" />
            
            <div className="flex flex-col items-center gap-4">
              <SettingsDialog />
              
              <div className="space-y-3 px-4">
                <div className="space-y-1">
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] leading-relaxed">
                    Iglesia Ejército Evangélico de Chile
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[9px] text-muted-foreground/80 font-medium uppercase tracking-widest">
                    © 2026 Todos los derechos reservados
                  </p>
                  <p className="text-[11px] text-primary/60 dark:text-blue-400/60 italic font-bold">
                    "Alabaré a Jehová en mi vida"
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}