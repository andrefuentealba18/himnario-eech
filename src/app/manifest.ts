import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Himnario EECH Móvil',
    short_name: 'Himnario EECH',
    description: 'Cancionero Digital Oficial del Ejercito Evangélico de Chile. Alabanzas, Coros e Himnos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait',
    scope: '/',
    icons: [
      {
        src: 'https://i.postimg.cc/FsY3twc6/images.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: 'https://i.postimg.cc/FsY3twc6/images.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
    ],
    categories: ['education', 'lifestyle', 'music', 'books'],
    screenshots: [
      {
        src: 'https://i.postimg.cc/FsY3twc6/images.png',
        sizes: '512x512',
        type: 'image/png',
        label: 'Pantalla de Inicio'
      }
    ]
  };
}
