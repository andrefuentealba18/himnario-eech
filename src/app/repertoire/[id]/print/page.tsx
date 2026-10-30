"use client";

import { useParams } from 'next/navigation';
import { RepertoirePrintClient } from '@/components/repertoire-print-client';
import { Suspense } from 'react';

function PrintContent() {
  const params = useParams();
  const id = params?.id as string;
  if (!id) return null;
  return <RepertoirePrintClient repertoireId={id} />;
}

export default function RepertoirePrintPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-slate-500">Cargando PDF...</p></div>}>
      <PrintContent />
    </Suspense>
  );
}
