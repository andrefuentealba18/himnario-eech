"use client";

import { useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { useHymns } from '@/context/hymns-context';
import { HymnDetailClient } from '@/components/hymn-detail-client';
import { Skeleton } from '@/components/ui/skeleton';


export default function HymnPage() {
  const params = useParams();
  const { getHymnById, isLoaded } = useHymns();
  
  const hymnId = parseInt(params.id as string, 10);
  const hymn = getHymnById(hymnId);

  useEffect(() => {
    if (isLoaded && !hymn) {
      notFound();
    }
  }, [isLoaded, hymn]);

  if (!isLoaded || !hymn) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-20 flex items-center justify-between bg-background/80 backdrop-blur-sm p-2 border-b h-16">
                <Skeleton className="h-10 w-10 rounded-full" />
                 <div className="flex-1 px-4">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                 </div>
                <Skeleton className="h-10 w-10 rounded-full" />
            </header>
            <main className="flex-1 py-8 container max-w-sm">
                <div className="space-y-4 text-center">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-5/6 mx-auto" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-4/6 mx-auto" />
                </div>
            </main>
        </div>
    );
  }

  return <HymnDetailClient hymn={hymn} />;
}
