import { Skeleton } from './skeleton';

export function SkeletonDocs() {
  return (
    <div className="prose max-w-4xl mx-auto p-8">
      <Skeleton className="h-10 w-2/3 mb-4" />
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-32 w-full mb-2" />
      <Skeleton className="h-6 w-1/2 mb-2" />
      <Skeleton className="h-6 w-3/4 mb-2" />
    </div>
  );
}
