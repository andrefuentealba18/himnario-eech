import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/context/app-provider';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: {
    default: 'Himnario EECH Móvil',
    template: '%s | Himnario EECH'
  },
  description: 'Tu cancionero digital del Ejército Evangélico de Chile. Encuentra himnos, alabanzas, coros de la juventud y más.',
  keywords: [
    'himnario eech',
    'ejercito evangelico de chile',
    'himnos eech',
    'alabanzas eech',
    'coros eech',
    'himnario eech online',
    'cancionero eech',
    'coros ciclistas',
    'coro dorcas'
  ],
  metadataBase: new URL('https://himnarioeech.vercel.app'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'vsQGEtn6hor4k7rtT45pp8FFzt1u3po9_JXG4kVQTsc',
  },
  icons: {
    icon: 'https://i.postimg.cc/FsY3twc6/images.png',
    apple: 'https://i.postimg.cc/FsY3twc6/images.png',
  },
  openGraph: {
    title: 'Himnario EECH Móvil',
    description: 'Tu cancionero digital del Ejército Evangélico de Chile. Himnos, alabanzas y coros en tu dispositivo.',
    url: 'https://himnarioeech.vercel.app',
    siteName: 'Himnario EECH',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: 'https://i.postimg.cc/FsY3twc6/images.png',
        width: 512,
        height: 512,
        alt: 'Himnario EECH',
      }
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Himnario EECH',
    startupImage: 'https://i.postimg.cc/FsY3twc6/images.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'application-name': 'Himnario EECH',
    'apple-mobile-web-app-title': 'Himnario EECH',
    'theme-color': '#3b82f6',
    'msapplication-navbutton-color': '#3b82f6',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-starturl': '/',
    'format-detection': 'telephone=no',
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-body antialiased min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-[#020617] dark:via-[#0a0f1c] dark:to-[#0f172a] selection:bg-primary/20 selection:text-primary transition-colors duration-500 print:bg-white print:bg-none">
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-slate-50 dark:bg-[#020617] print:hidden">
          {/* Mesh gradient orbs - animated */}
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-500/20 dark:bg-blue-600/20 rounded-full animate-aura-giant blur-[100px]" />
          <div className="absolute top-[20%] right-[-20%] w-[50vw] h-[50vw] bg-purple-500/15 dark:bg-purple-600/20 rounded-full animate-aura-giant blur-[100px]" style={{ animationDelay: '5s' }} />
          <div className="absolute bottom-[-10%] left-[10%] w-[60vw] h-[60vw] bg-amber-400/15 dark:bg-amber-500/15 rounded-full animate-aura-giant blur-[120px]" style={{ animationDelay: '10s' }} />
          
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
          
          {/* Patrón de diseño sutil por encima del ruido */}
          <div className="absolute inset-0 design-grid opacity-[0.03] dark:opacity-[0.04] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_30%,transparent_100%)]" />
        </div>
        <FirebaseClientProvider>
          <AppProvider>
            <div className="relative flex min-h-screen w-full flex-col">
              {children}
            </div>
            <Toaster />
          </AppProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
