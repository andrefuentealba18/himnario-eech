import { MetadataRoute } from 'next';
import { hymns } from '@/lib/hymns-initial';
import { initialPraises } from '@/lib/praises-initial';
import { initialChoirs } from '@/lib/choirs-initial';
import { initialYouthChoirs } from '@/lib/youth-choirs-initial';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://himnarioeech.vercel.app';
  const currentDate = new Date();

  // 1. Static Pages
  const staticPages = [
    '',
    '/hymns',
    '/praises',
    '/choirs',
    '/youth-choirs',
    '/special-occasions',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Hymns
  const hymnPages = hymns.map((hymn) => ({
    url: `${baseUrl}/hymns/${hymn.number}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // 3. Dynamic Praises
  const praisePages = initialPraises.map((praise) => {
    const id = slugify(praise.title);
    return {
      url: `${baseUrl}/praises/${id}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
  });

  // 4. Dynamic Choirs
  const choirPages = initialChoirs.map((choir) => {
    const id = slugify(choir.title);
    return {
      url: `${baseUrl}/choirs/${id}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    };
  });

  // 5. Dynamic Youth Choirs
  const youthChoirPages = initialYouthChoirs.map((yc) => {
    const id = slugify(`${yc.group}-${yc.title}`);
    return {
      url: `${baseUrl}/youth-choirs/${id}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    };
  });

  return [
    ...staticPages,
    ...hymnPages,
    ...praisePages,
    ...choirPages,
    ...youthChoirPages,
  ];
}
