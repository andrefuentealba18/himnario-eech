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
      {/* Fondo Artístico Ultra-Creativo */}
      <div className="fixed inset-0 -z-20 overflow-hidden bg-white dark:bg-background">
        
        {/* Capa 1: Patrón de Micro-Puntos Elegante (Textura de Papel Fino) */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:opacity-10" />
        
        {/* Capa 2: Malla de Colores "Amanecer Celestial" (Mesh Gradient mejorado) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Azul Cielo - Esquina Superior Izquierda */}
          <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-sky-200/40 dark:bg-blue-900/30 blur-[120px] rounded-full animate-pulse-slow" />
          
          {/* Oro Suave / Ámbar - Centro Derecha */}
          <div className="absolute top-[20%] -right-[5%] w-[50%] h-[50%] bg-amber-100/30 dark:bg-amber-600/10 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
          
          {/* Rosa Etéreo - Parte Inferior */}
          <div className="absolute -bottom-[10%] left-[20%] w-[70%] h-[50%] bg-rose-100/30 dark:bg-purple-900/20 blur-[130px] rounded-full animate-pulse-slow" style={{ animationDelay: '4s' }} />
          
          {/* Verde Menta / Turquesa - Esquina Superior Derecha */}
          <div className="absolute -top-[5%] right-[15%] w-[40%] h-[40%] bg-emerald-50/40 dark:bg-teal-900/10 blur-[90px] rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        {/* Capa 3: Destellos de Luz (Partículas mágicas) */}
        <div className="absolute inset-0 opacity-100">
          {/* Partícula 1 */}
          <div className="absolute top-1/4 left-[15%] w-2 h-2 bg-blue-400/20 dark:bg-white rounded-full blur-[1px] animate-float" style={{ animationDuration: '7s' }} />
          {/* Partícula 2 */}
          <div className="absolute top-1/3 right-[10%] w-1.5 h-1.5 bg-amber-400/20 dark:bg-white rounded-full blur-[1px] animate-float" style={{ animationDuration: '9s', animationDelay: '1s' }} />
          {/* Partícula 3 */}
          <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-rose-400/10 dark:bg-white rounded-full blur-[2px] animate-float" style={{ animationDuration: '11s', animationDelay: '2s' }} />
          {/* Partícula 4 */}
          <div className="absolute top-[10%] left-[45%] w-1 h-1 bg-sky-400/30 dark:bg-white rounded-full blur-[0.5px] animate-float" style={{ animationDuration: '6s', animationDelay: '0.5s' }} />
        </div>

        {/* Capa 4: Viñeta Radial para Enfoque Central */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.4)_70%,white_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,hsl(var(--background))_95%)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Botón de Modo Oscuro Superior Derecho */}
        <div className="absolute top-4 right-4 md:top-6 md:right-6 animate-in fade-in zoom-in duration-1000">
          <ThemeToggle />
        </div>

        <main className="container max-w-2xl mx-auto flex-1 flex flex-col items-center justify-center p-6">
          
          {/* Header Institucional con Efecto de Vidrio */}
          <header className="w-full text-center space-y-2 mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center justify-center p-5 bg-white/40 dark:bg-card/60 backdrop-blur-xl rounded-[2.5rem] mb-6 shadow-xl shadow-blue-500/5 border border-white/60 dark:border-white/5 animate-float transition-all duration-1000">
              <Church className="h-12 w-12 text-primary dark:text-blue-400 drop-shadow-sm" />
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-slate-900 dark:text-foreground">
                Himnario <span className="text-primary dark:text-blue-400 bg-clip-text">EECH</span>
              </h1>
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-slate-300 dark:bg-white/20" />
                <p className="text-[10px] md:text-xs text-slate-500 dark:text-muted-foreground font-black tracking-[0.4em] uppercase">
                  Cancionero Digital
                </p>
                <div className="h-px w-8 bg-slate-300 dark:bg-white/20" />
              </div>
            </div>
          </header>

          {/* Buscador Global Moderno con Sombra Suave */}
          <div className="w-full max-w-lg mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            <GlobalSearch />
          </div>
          
          {/* Cuadrícula 2x2 Oficial con Hover Premium */}
          <div className="grid grid-cols-2 gap-5 w-full max-w-lg">
            {navigationItems.map((item) => (
              <div key={item.title} className="animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: item.delay }}>
                <Link href={item.href} className="group block h-full">
                  <Card className="h-full border-white/80 dark:border-white/5 bg-white/50 dark:bg-white/[0.03] backdrop-blur-2xl hover:bg-white/80 dark:hover:bg-card transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 active:scale-95 overflow-hidden relative shadow-md border-2">
                    <CardContent className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[160px]">
                      <div className={`p-5 rounded-[1.5rem] ${item.color} mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner`}>
                        <item.icon className={`h-8 w-8 ${item.iconColor}`} />
                      </div>
                      <h3 className="font-black text-[11px] md:text-xs uppercase tracking-widest font-body text-slate-700 dark:text-foreground group-hover:text-primary dark:group-hover:text-blue-400 transition-colors leading-tight px-2">
                        {item.title}
                      </h3>
                    </CardContent>
                    {/* Brillo decorativo en hover */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </Card>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Footer Institucional Refinado */}
          <footer className="w-full text-center mt-16 pb-10 space-y-8 animate-in fade-in duration-1000 delay-500">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent mx-auto" />
            
            <div className="flex flex-col items-center gap-6">
              <SettingsDialog />
              
              <div className="space-y-4 px-4">
                <div className="space-y-1">
                  <p className="text-[10px] md:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] leading-relaxed">
                    Iglesia Ejército Evangélico de Chile
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-[9px] text-slate-400/60 dark:text-muted-foreground/40 font-bold uppercase tracking-widest">
                    © 2026 • Servir con Alegría
                  </p>
                  <p className="text-sm font-headline italic font-bold text-primary/40 dark:text-blue-400/30">
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
