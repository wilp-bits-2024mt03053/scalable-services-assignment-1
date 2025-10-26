'use client';
import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SkeletonDocs } from '@/components/ui/skeleton-docs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppTracker } from '@/context/useAppTracker';

const sections = [
  {
    title: 'Introduction',
    content: (
      <>
        <h2 className="text-xl font-bold mb-2">react-user-tracker</h2>
        <p>
          A highly scalable, modular, and performant user event tracking package for React, written
          in TypeScript. Decouples tracking logic from React using an asynchronous, batched queue
          system.
        </p>
      </>
    ),
  },
  {
    title: 'Features',
    content: (
      <>
        <h3 className="text-lg font-semibold mb-2">Features</h3>
        <ul className="list-disc ml-6 mb-2">
          <li>Batched, async event tracking for React apps</li>
          <li>Decoupled core logic for easy integration</li>
          <li>Singleton tracker instance</li>
          <li>Configurable batching, endpoint, and debug mode</li>
          <li>React Context and hook for easy usage</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Installation',
    content: (
      <>
        <h3 className="text-lg font-semibold mb-2">Installation</h3>
        <pre className="bg-slate-100 p-2 rounded text-sm mb-2">npm install react-user-tracker</pre>
      </>
    ),
  },
  {
    title: 'Usage',
    content: (
      <>
        <h3 className="text-lg font-semibold mb-2">Usage</h3>
        <p className="mb-2">1. Setup Provider</p>
        <pre className="bg-slate-100 p-2 rounded text-xs mb-2">{`const trackerConfig = {
  endpointUrl: 'https://your-backend/api/events',
  batchSize: 50,
  flushInterval: 5000,
  appName: 'MyApp',
  appVersion: '1.0.0',
  debug: false,
};

<TrackerProvider config={trackerConfig}>
  <App />
</TrackerProvider>;`}</pre>
      </>
    ),
  },
  {
    title: 'Track Component Events',
    content: (
      <>
        <h3 className="text-lg font-semibold mb-2">Track Component Events</h3>
        <pre className="bg-slate-100 p-2 rounded text-xs mb-2">{`const MyButton = () => {
  const tracker = useTracker('MyButton');
  return <button {...tracker}>Click Me</button>;
};`}</pre>
      </>
    ),
  },
  {
    title: 'API Reference & Examples',
    content: (
      <>
        <h3 className="text-lg font-semibold mb-2">API Reference & Examples</h3>
        <pre className="bg-slate-100 p-2 rounded text-xs mb-2">{`const config: TrackerConfig = {
  endpointUrl: 'https://api.example.com/events',
  batchSize: 50,
  flushInterval: 5000,
  appName: 'MyApp',
  appVersion: '1.0.0',
  debug: false,
};`}</pre>
      </>
    ),
  },
];

const TabSection = ({ section }: { section: (typeof sections)[0] }) => {
  const tracker = useAppTracker({
    componentName: `DocsSection_${section.title}`,
    extraMetadata: { section_title: section.title },
  });
  return (
    <TabsTrigger
      key={section.title}
      value={section.title}
      className="capitalize"
      onClick={tracker.onClick}
      onMouseEnter={tracker.onMouseEnter}
      onMouseLeave={tracker.onMouseLeave}
    >
      {section.title}
    </TabsTrigger>
  );
};

const ContentSection = ({ section }: { section: (typeof sections)[0] }) => {
  const tracker = useAppTracker({
    componentName: `DocsContent_${section.title}`,
    extraMetadata: { section_title: section.title },
  });
  return (
    <TabsContent key={section.title} value={section.title}>
      <Card
        className="p-6 mb-4"
        onClick={tracker.onClick}
        onMouseEnter={tracker.onMouseEnter}
        onMouseLeave={tracker.onMouseLeave}
      >
        {section.content}
      </Card>
    </TabsContent>
  );
};

export default function DocsPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(sections[0].title);
  const tracker = useAppTracker({ componentName: 'DocsPage' });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout title="Docs">
      <ErrorBoundary>
        {loading ? (
          <SkeletonDocs />
        ) : (
          <Tabs
            defaultValue={activeTab}
            value={activeTab}
            onValueChange={setActiveTab}
            className="max-w-4xl mx-auto p-8"
          >
            <TabsList
              onClick={tracker.onClick}
              onMouseEnter={tracker.onMouseEnter}
              onMouseLeave={tracker.onMouseLeave}
              className="mb-6 flex flex-wrap gap-2"
            >
              {sections.map((section) => (
                <TabSection key={section.title} section={section} />
              ))}
            </TabsList>
            {sections.map((section) => (
              <ContentSection key={section.title} section={section} />
            ))}
          </Tabs>
        )}
      </ErrorBoundary>
    </DashboardLayout>
  );
}
