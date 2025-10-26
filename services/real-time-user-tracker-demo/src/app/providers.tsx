'use client';

import { TrackerProvider } from 'react-user-tracker';

import { VisitorProvider } from '@/context/VisitorContext';

const trackerConfig = {
  // Use an environment variable for the endpoint, falling back to localhost for local dev.
  endpointUrl: process.env.NEXT_PUBLIC_TRACKER_ENDPOINT_URL || 'http://localhost:8000/track',
  batchSize: 5,
  flushInterval: 5000,
  appName: 'Next.js App',
  appVersion: '0.1.0',
  debug: false,
  log: true,
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <VisitorProvider>
      <TrackerProvider config={trackerConfig}>{children}</TrackerProvider>
    </VisitorProvider>
  );
}
