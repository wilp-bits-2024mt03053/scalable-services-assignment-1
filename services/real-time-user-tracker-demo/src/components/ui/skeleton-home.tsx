import { Skeleton } from './skeleton';

export function SkeletonHome() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full p-8">
      <Skeleton className="h-16 w-2/3 mb-4" />
      <Skeleton className="h-10 w-1/2 mb-4" />
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-32 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-12 w-40 mt-8" />
    </div>
  );
}
