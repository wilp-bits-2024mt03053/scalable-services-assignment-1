import React from 'react';

import { SkeletonVisitor } from '@/components/ui/skeleton-visitor';
import { useVisitor } from '@/context/VisitorContext';
import { cn } from '@/lib/utils';

export function Header({ title, className }: { title: string; className?: string }) {
  const { visitor, follow, setFollow, resetVisitor } = useVisitor();
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    setLoading(false);
  }, [visitor]);
  return (
    <header
      className={cn(
        'w-full bg-slate-950 text-white px-8 py-4 border-b border-slate-800 flex items-center justify-between',
        className
      )}
    >
      <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      <div className="flex items-center gap-6">
        {loading ? (
          <SkeletonVisitor />
        ) : (
          <div className="flex flex-col text-xs text-right">
            <span className="font-bold">Visitor:</span>
            <span>{visitor?.name}</span>
            <span className="text-slate-400">{visitor?.email}</span>
          </div>
        )}
        <button
          className={`px-3 py-1 rounded text-xs font-medium border ${
            follow ? 'bg-green-600 border-green-700' : 'bg-slate-800 border-slate-700'
          } transition`}
          onClick={() => {
            setFollow(!follow);
            if (!follow) resetVisitor();
          }}
        >
          {follow ? 'Following' : 'No Follow'}
        </button>
      </div>
    </header>
  );
}
