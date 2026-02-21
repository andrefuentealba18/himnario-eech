import { getHymnById, hymns } from '@/lib/hymns';
import { HymnDetailClient } from '@/components/hymn-detail-client';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const hymnId = parseInt(params.id, 10);
  const hymn = getHymnById(hymnId);

  if (!hymn) {
    return {
      title: 'Himno no encontrado',
    };
  }

  return {
    title: `${hymn.number}. ${hymn.title} | Himnario EECH`,
    description: `Letra del himno "${hymn.title}"`,
  };
}

export function generateStaticParams() {
  return hymns.map((hymn) => ({
    id: hymn.number.toString(),
  }));
}

export default function HymnPage({ params }: Props) {
  const hymnId = parseInt(params.id, 10);
  const hymn = getHymnById(hymnId);

  if (!hymn) {
    notFound();
  }

  return <HymnDetailClient hymn={hymn} />;
}
