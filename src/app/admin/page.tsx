import { Suspense } from 'react';
import { AdminPanel } from '@/components/admin-panel';
import { Skeleton } from '@/components/ui/skeleton';

function AdminPageFallback() {
  return (
    <div className="p-4">
      <Skeleton className="h-10 w-full mb-4" />
      <Skeleton className="h-96 w-full" />
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminPageFallback />}>
      <AdminPanel />
    </Suspense>
  );
}
