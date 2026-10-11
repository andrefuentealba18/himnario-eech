import { Suspense } from 'react';
import { PraiseDetailClient } from '@/components/praise-detail-client';
import { initialPraises } from '@/lib/praises-initial';

const slugify = (text: string): string =>
  text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

export const dynamicParams = true;

export function generateStaticParams() {
  return initialPraises.map((praise) => ({
    id: slugify(praise.title),
  }));
}

export default async function PraisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense>
      <PraiseDetailClient praiseId={id} />
    </Suspense>
  );
}
