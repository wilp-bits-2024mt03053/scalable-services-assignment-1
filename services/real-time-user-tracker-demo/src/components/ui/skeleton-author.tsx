import { Card } from './card';
import { Skeleton } from './skeleton';

export function SkeletonAuthor() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <Card className="p-6 mb-4">
        <Skeleton className="h-8 w-2/3 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <div className="grid grid-cols-2 gap-4 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col bg-gray-50 rounded p-4">
              <Skeleton className="h-5 w-2/3 mb-1" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-20 w-full" />
      </Card>
    </div>
  );
}
