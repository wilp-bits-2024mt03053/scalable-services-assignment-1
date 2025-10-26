'use client';
import { useEffect, useMemo, useState } from 'react';

import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppTracker } from '@/context/useAppTracker';
import { generateAnalytics } from '@/mock/analytics';

import type { CellContext } from '@tanstack/react-table';
type Analytics = {
  userId: string;
  name: string;
  email: string;
  visits: number;
  purchases: number;
  revenue: string;
  lastActive: Date;
  location: string;
  device: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  conversionRate: number;
  avgOrderValue: string;
  cartAbandonRate: number;
  feedback: string;
  joined: Date;
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics[]>([]);
  const tracker = useAppTracker({ componentName: 'AnalyticsPage' });

  useEffect(() => {
    setAnalytics(generateAnalytics(30));
    setLoading(false);
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'User',
        cell: (info: CellContext<Analytics, unknown>) => info.getValue(),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info: CellContext<Analytics, unknown>) => info.getValue(),
      },
      {
        accessorKey: 'visits',
        header: 'Visits',
        cell: (info: CellContext<Analytics, unknown>) => info.getValue(),
      },
      {
        accessorKey: 'purchases',
        header: 'Purchases',
        cell: (info: CellContext<Analytics, unknown>) => info.getValue(),
      },
      {
        accessorKey: 'revenue',
        header: 'Revenue',
        cell: (info: CellContext<Analytics, unknown>) => `${info.getValue()}`,
      },
      {
        accessorKey: 'lastActive',
        header: 'Last Active',
        cell: (info: CellContext<Analytics, unknown>) => {
          const value = info.getValue();
          return value instanceof Date ? value.toLocaleDateString() : value;
        },
      },
      {
        accessorKey: 'device',
        header: 'Device',
        cell: (info: CellContext<Analytics, unknown>) => info.getValue(),
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: (info: CellContext<Analytics, unknown>) => info.getValue(),
      },
    ],
    []
  );

  return (
    <DashboardLayout title="Analytics">
      {loading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <DataTable
          columns={columns}
          data={analytics}
          onRowClick={(row) => {
            tracker.onClick({ event_type: 'VIEW_ANALYTICS_DETAILS', user_metadata: row });
          }}
        />
      )}
    </DashboardLayout>
  );
}

// ...existing code...
