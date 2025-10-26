/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { DataTable } from '@/components/ui/data-table';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppTracker } from '@/context/useAppTracker';

import type { ColumnDef } from '@tanstack/react-table';

type UserEvent = {
  event_id: string;
  event_type: string;
  location_type: string;
  component_name: string;
  page_path: string;
  page_title: string;
  timestamp: string;
  user_metadata: Record<string, any>;
  full_event_data: Record<string, any>;
  received_at: string;
};

const columns: ColumnDef<UserEvent>[] = [
  {
    accessorKey: 'event_type',
    header: 'Event Type',
  },
  {
    accessorKey: 'page_path',
    header: 'Page Path',
  },
  {
    accessorKey: 'component_name',
    header: 'Component',
  },
  {
    accessorKey: 'user_metadata',
    header: 'User',
    cell: ({ row }) => JSON.stringify(row.original.user_metadata),
  },
  { accessorKey: 'received_at', header: 'Received At' },
];
export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [clicks, setClicks] = useState<UserEvent[]>([]);
  const [hovers, setHovers] = useState<UserEvent[]>([]);
  const [componentInteractions, setComponentInteractions] = useState<UserEvent[]>([]);
  const [pageViews, setPageViews] = useState<UserEvent[]>([]);
  const tracker = useAppTracker({ componentName: 'AnalyticsPage' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE_URL = 'http://localhost:8001/events';
        const [eventsRes, clicksRes, hoversRes, componentRes, pageRes] = await Promise.all([
          fetch(`${API_BASE_URL}?limit=10`),
          fetch(`${API_BASE_URL}?event_type=CLICK&limit=5`),
          fetch(`${API_BASE_URL}?event_type=HOVER&limit=5`),
          fetch(`${API_BASE_URL}?location_type=COMPONENT&limit=5`),
          fetch(`${API_BASE_URL}?location_type=PAGE&limit=5`),
        ]);

        setEvents(await eventsRes.json());
        setClicks(await clicksRes.json());
        setHovers(await hoversRes.json());
        setComponentInteractions(await componentRes.json());
        setPageViews(await pageRes.json());
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const AnalyticsTable = ({
    title,
    data,
    isLoading,
  }: {
    title: string;
    data: UserEvent[];
    isLoading: boolean;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <DataTable columns={columns} data={data} />
        )}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout title="Analytics">
      <div className="flex flex-col gap-4">
        <AnalyticsTable title="Recent Events" data={events} isLoading={loading} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AnalyticsTable title="Recent Clicks" data={clicks} isLoading={loading} />
          <AnalyticsTable title="Recent Hovers" data={hovers} isLoading={loading} />
          <AnalyticsTable
            title="Component Interactions"
            data={componentInteractions}
            isLoading={loading}
          />
          <AnalyticsTable title="Page Views" data={pageViews} isLoading={loading} />
        </div>
      </div>
    </DashboardLayout>
  );
}
