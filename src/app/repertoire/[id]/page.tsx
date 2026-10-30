"use client";

import { useParams } from 'next/navigation';
import { RepertoireDetailClient } from '@/components/repertoire-detail-client';
import { Suspense } from 'react';

function RepertoirePageContent() {
  const params = useParams();
  const id = params?.id as string;
  if (!id) return null;
  return <RepertoireDetailClient repertoireId={id} />;
}

export default function RepertoireDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center"><p className="text-slate-400 font-medium animate-pulse">Cargando...</p></div>}>
      <RepertoirePageContent />
    </Suspense>
  );
}