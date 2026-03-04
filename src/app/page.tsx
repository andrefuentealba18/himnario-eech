import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Book, Mic, Church, Library } from 'lucide-react';
import { SettingsDialog } from '@/components/settings-dialog';
import { GlobalSearch } from '@/components/global-search';

const navigationItems = [
  {
    title: "Himnos",
    href: "/hymns",
    icon: Book,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
    delay: "0.2s"
  },
  {
    title: "Alabanzas",
    href: "/praises",
    icon: Music,
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
    delay: "0.3s"
  },
  {
    title: "Coros",
    href: "/choirs",
    icon: Mic,
    color: "bg-rose-50",
    iconColor: "text-rose-600",
    delay: "0.4s"
  },
  {
    title: "Alabanzas de Agrupaciones",
    href: "/youth-choirs",
    icon: Library,
    color: "bg-orange-50",
    iconColor: "text-orange-600",
    delay: "0.5s"
  }
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-slate-50/50 text-foreground overflow-x-hidden font-body">
      {/* Fondo Animado Muy Sutil */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <div className="absolute top-[-10%] -left-[10%] w-[70%] h-[70%] bg-primary/5 rounded-full filter blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] -right-[10%] w-[80%] h-[80%] bg-blue-500/5 rounded-full filter blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <main className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center p-6">
          
          {/* Header Institucional */}
          <header className="w-full text-center space-y-2 mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl mb-4 shadow-sm border border-slate-100 animate-float">
              <Church className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-slate-900">
                Himnario <span className="text-primary">EECH</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground font-bold tracking-[0.3em] uppercase">
                Cancionero Digital
              </p>
            </div>
          </header>

          {/* Buscador Global Moderno */}
          <div className="w-full max-w-lg mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <GlobalSearch />
          </div>
          
          {/* Cuadrícula 2x2 Oficial */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
            {navigationItems.map((item) => (
              <div key={item.title} className="animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: item.delay }}>
                <Link href={item.href} className="group block h-full">
                  <Card className="h-full border-slate-200/60 bg-white hover:bg-slate-50 transition-all duration-300 hover:shadow-md hover:-translate-y-1 active:scale-95 overflow-hidden relative shadow-sm border-2">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full min-h-[150px]">
                      <div className={`p-4 rounded-2xl ${item.color} mb-4 group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                        <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                      </div>
                      <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider font-body text-slate-800 group-hover:text-primary transition-colors leading-tight px-2">
                        {item.title}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Footer Institucional y Elegante */}
          <footer className="w-full text-center mt-12 pb-10 space-y-6 animate-in fade-in duration-1000 delay-500">
            <div className="h-px w-16 bg-slate-300/50 mx-auto" />
            
            <div className="flex flex-col items-center gap-4">
              <SettingsDialog />
              
              <div className="space-y-3 px-4">
                <div className="space-y-1">
                  <p className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.25em] leading-relaxed">
                    Iglesia Ejército Evangélico de Chile
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[9px] text-muted-foreground/80 font-medium uppercase tracking-widest">
                    © 2026 Todos los derechos reservados
                  </p>
                  <p className="text-[11px] text-primary/60 italic font-bold">
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
