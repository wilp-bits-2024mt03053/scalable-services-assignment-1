import { Card } from './card';
import { Skeleton } from './skeleton';

export function SkeletonShop() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-20">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="flex flex-col p-4">
          <Skeleton className="w-full h-40 mb-2" />
          <Skeleton className="h-6 w-2/3 mb-1" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-5 w-1/3 mb-2" />
          <div className="flex gap-2 mt-auto">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </Card>
      ))}
    </div>
  );
}
