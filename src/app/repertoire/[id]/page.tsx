"use client";

import { useParams } from 'next/navigation';
import { RepertoireDetailClient } from '@/components/repertoire-detail-client';

export default function RepertoireDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <RepertoireDetailClient repertoireId={id} />;
}
    