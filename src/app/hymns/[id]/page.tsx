"use client";

import { useParams } from 'next/navigation';
import { HymnDetailClient } from '@/components/hymn-detail-client';

export default function HymnPage() {
  const params = useParams();
  const hymnId = parseInt(params.id as string, 10);

  return <HymnDetailClient hymnId={hymnId} />;
}
