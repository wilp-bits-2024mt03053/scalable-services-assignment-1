import { Card } from './card';
import { Skeleton } from './skeleton';

export function SkeletonAdmin() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-10 w-1/3" />
        </Card>
      ))}
    </div>
  );
}
