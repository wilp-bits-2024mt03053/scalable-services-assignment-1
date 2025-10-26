'use client';

import { TrackerProvider } from 'react-user-tracker';

import { VisitorProvider } from '@/context/VisitorContext';

const trackerConfig = {
  endpointUrl: 'http://localhost:8000/track',
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
