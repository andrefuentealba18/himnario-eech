import { Suspense } from 'react';
import { HymnDetailClient } from '@/components/hymn-detail-client';
import { hymns as initialHymns } from '@/lib/hymns-initial';

export const dynamicParams = true;

export function generateStaticParams() {
  return initialHymns.map((hymn) => ({
    id: hymn.number.toString(),
  }));
}

export default async function HymnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hymnId = parseInt(id, 10);

  return (
    <Suspense>
      <HymnDetailClient hymnId={hymnId} />
    </Suspense>
  );
}
