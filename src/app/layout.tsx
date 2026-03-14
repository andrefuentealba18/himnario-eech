import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from '@/context/app-provider';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Himnario EECH Móvil',
  description: 'Tu cancionero digital del Ejercito Evangélico de Chile',
  manifest: '/manifest.json',
  icons: {
    icon: 'https://i.postimg.cc/FsY3twc6/images.png',
    apple: 'https://i.postimg.cc/FsY3twc6/images.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Himnario EECH',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3b82f6',
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
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-body antialiased">
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
