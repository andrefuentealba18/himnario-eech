"use client";

import { useParams } from 'next/navigation';
import { PraiseDetailClient } from '@/components/praise-detail-client';

export default function PraisePage() {
  const params = useParams();
  const id = params.id as string;

  return <PraiseDetailClient praiseId={id} />;
}
