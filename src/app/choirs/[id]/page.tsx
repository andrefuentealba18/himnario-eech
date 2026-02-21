"use client";

import { useParams } from 'next/navigation';
import { ChoirDetailClient } from '@/components/choir-detail-client';

export default function ChoirPage() {
  const params = useParams();
  const id = params.id as string;

  return <ChoirDetailClient choirId={id} />;
}

    