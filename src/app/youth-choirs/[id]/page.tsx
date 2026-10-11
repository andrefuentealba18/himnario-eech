import { Suspense } from 'react';
import { YouthChoirDetailClient } from '@/components/youth-choir-detail-client';
import { initialYouthChoirs } from '@/lib/youth-choirs-initial';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export const dynamicParams = true;

export function generateStaticParams() {
  return initialYouthChoirs.map((item) => ({
    id: slugify(`${item.group}-${item.title}`),
  }));
}

export default async function YouthChoirPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense>
      <YouthChoirDetailClient youthChoirId={id} />
    </Suspense>
  );
}
