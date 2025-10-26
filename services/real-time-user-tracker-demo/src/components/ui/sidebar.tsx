import React from 'react';

import { cn } from '@/lib/utils';

export function Sidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        'w-64 h-screen fixed left-0 top-0 bg-gray-50 border-r border-gray-200 p-6 flex flex-col gap-4 z-30',
        className
      )}
    >
      {children}
    </aside>
  );
}
