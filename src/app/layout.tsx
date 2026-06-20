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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-body antialiased min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-[#020617] dark:via-[#0a0f1c] dark:to-[#0f172a] selection:bg-primary/20 selection:text-primary transition-colors duration-500">
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
          {/* Luz superior azul institucional */}
          <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-blue-600/10 dark:bg-blue-600/15 rounded-full animate-aura-slow blur-[120px]" />
          {/* Luz inferior dorada/ámbar majestuosa */}
          <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-amber-500/10 dark:bg-amber-500/15 rounded-full animate-aura-slow blur-[100px]" style={{ animationDelay: '2s' }} />
          {/* Patrón de diseño sutil */}
          <div className="absolute inset-0 design-grid opacity-[0.04] dark:opacity-[0.06] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]" />
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
