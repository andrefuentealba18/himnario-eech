
"use client";

import { useParams } from 'next/navigation';
import { SpecialOccasionDetailClient } from '@/components/special-occasion-detail-client';

export default function SpecialOccasionDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return <SpecialOccasionDetailClient specialId={id} />;
}
