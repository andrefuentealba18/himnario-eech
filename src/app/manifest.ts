import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Himnario EECH Móvil',
    short_name: 'Himnario EECH',
    description: 'Cancionero Digital del Ejercito Evangélico de Chile',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    orientation: 'portrait',
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
  };
}
