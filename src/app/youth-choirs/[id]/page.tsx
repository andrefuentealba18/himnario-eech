"use client";

import { useParams } from 'next/navigation';
import { YouthChoirDetailClient } from '@/components/youth-choir-detail-client';

export default function YouthChoirPage() {
  const params = useParams();
  const id = params.id as string;

  return <YouthChoirDetailClient youthChoirId={id} />;
}

    