import { Suspense } from 'react';
import { AdminPanel } from '@/components/admin-panel';
import { Skeleton } from '@/components/ui/skeleton';

function AdminPageFallback() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm p-2 border-b flex items-center justify-between h-14">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-48" />
        <div className="w-10"></div>
      </header>
      <div className="p-4">
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <main className="flex flex-col items-center bg-background min-h-screen">
      <Suspense fallback={<AdminPageFallback />}>
        <AdminPanel />
      </Suspense>
    </main>
  );
}
