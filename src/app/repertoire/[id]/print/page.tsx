"use client";

import { useParams } from 'next/navigation';
import { RepertoirePrintClient } from '@/components/repertoire-print-client';

export default function RepertoirePrintPage() {
  const params = useParams();
  const id = params.id as string;

  return <RepertoirePrintClient repertoireId={id} />;
}
