import { Suspense } from 'react';
import { ChoirDetailClient } from '@/components/choir-detail-client';
import { initialChoirs } from '@/lib/choirs-initial';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export const dynamicParams = true;

export function generateStaticParams() {
  return initialChoirs.map((choir) => ({
    id: slugify(choir.title),
  }));
}

export default async function ChoirPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense>
      <ChoirDetailClient choirId={id} />
    </Suspense>
  );
}
