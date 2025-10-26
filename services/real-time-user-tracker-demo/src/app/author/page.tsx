'use client';
import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { SkeletonAuthor } from '@/components/ui/skeleton-author';
import { useAppTracker } from '@/context/useAppTracker';

const authorsData = [
  { name: 'Balaji O M', bitsId: '2024mt03025' },
  { name: 'Balasubramaniyan', bitsId: '2024mt03053' },
  { name: 'Deep Pokala', bitsId: '2024mt03042' },
  { name: 'Jagriti Sharma', bitsId: '2024mt03116' },
];

export default function AuthorPage() {
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<typeof authorsData>([]);
  const tracker = useAppTracker({ componentName: 'AuthorPage' });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthors(authorsData);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout title="Authors">
      {loading ? (
        <SkeletonAuthor />
      ) : (
        <div
          onClick={tracker.onClick}
          onMouseEnter={tracker.onMouseEnter}
          onMouseLeave={tracker.onMouseLeave}
          className="flex flex-col gap-8 w-full"
        >
          <Card className="p-6 mb-4">
            <h1 className="text-2xl font-bold mb-2">
              Scalable Streaming data analytics for web application
            </h1>
            <h2 className="text-lg font-semibold mb-2">Group Information</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {authors.map((author) => (
                <div key={author.bitsId} className="flex flex-col bg-gray-50 rounded p-4">
                  <span className="font-medium">{author.name}</span>
                  <span className="text-sm text-muted-foreground">Bits ID: {author.bitsId}</span>
                </div>
              ))}
            </div>
            <h2 className="text-lg font-semibold mb-2">Abstract</h2>
            <p className="text-base text-gray-700">
              This project implements a comprehensive real-time data streaming pipeline using Apache Kafka, and Python-based producer and consumer applications. The system
              demonstrates end-to-end event processing capabilities where a Python producer
              generates synthetic JSON events, writes them to a log file, which is then tailed by
              Apache Flume and forwarded to Apache Kafka. A Python consumer subscribes to the Kafka
              topic and performs real-time analytics on the streaming data.
              <br />
              <br />
              The architecture showcases modern streaming data processing patterns, containerization
              with Docker, and resilient service integration with proper error handling and retry
              mechanisms. The implementation serves as a foundation for understanding distributed
              streaming systems and can be extended for production-scale data processing scenarios.
            </p>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
