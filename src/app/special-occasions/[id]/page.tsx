"use client";

import { useParams } from 'next/navigation';
import { SpecialOccasionDetailClient } from '@/components/special-occasion-detail-client';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function SpecialPageFallback() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="h-20 border-b flex items-center px-4">
        <Skeleton className="h-10 w-10 rounded-full" />
      </header>
      <main className="p-8">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </main>
    </div>
  );
}

export default function SpecialOccasionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  if (!id) return <SpecialPageFallback />;

  return (
    <Suspense fallback={<SpecialPageFallback />}>
      <SpecialOccasionDetailClient specialId={id} />
    </Suspense>
  );
}
