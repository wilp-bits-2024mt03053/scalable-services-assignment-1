'use client';

import { useEffect, useState } from 'react';

import FlipWordsDemo from '@/components/FlipWords';
import { Boxes } from '@/components/ui/boxes';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { SkeletonHome } from '@/components/ui/skeleton-home';
import { useAppTracker } from '@/context/useAppTracker';
import { cn } from '@/lib/utils';
import {
  SiApple,
  SiFacebook,
  SiGithub,
  SiGoogle,
  SiInstagram,
  SiX,
  SiYoutube,
} from '@icons-pack/react-simple-icons';

const logos = [
  {
    name: 'GitHub',
    icon: SiGithub,
    url: 'https://github.com',
  },
  {
    name: 'Facebook',
    icon: SiFacebook,
    url: 'https://facebook.com',
  },
  {
    name: 'Google',
    icon: SiGoogle,
    url: 'https://google.com',
  },
  {
    name: 'X',
    icon: SiX,
    url: 'https://x.com',
  },
  {
    name: 'Apple',
    icon: SiApple,
    url: 'https://apple.com',
  },
  {
    name: 'Instagram',
    icon: SiInstagram,
    url: 'https://instagram.com',
  },
  {
    name: 'YouTube',
    icon: SiYoutube,
    url: 'https://youtube.com',
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const tracker = useAppTracker({ componentName: 'Home' });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout title="Home">
      <ErrorBoundary>
        {loading ? (
          <SkeletonHome />
        ) : (
          <div
            onClick={tracker.onClick}
            onMouseEnter={tracker.onMouseEnter}
            onMouseLeave={tracker.onMouseLeave}
            className="h-206 relative w-full overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg"
          >
            <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
            <Boxes />
            <h1 className={cn('md:text-4xl text-xl text-white relative z-20')}>
              Streaming Data Analytics for Web Application
            </h1>
            <p className="text-center mt-2 text-neutral-300 relative z-20">
              Interactive real-time user tracking powered by Kafka and flume.
            </p>
            <div className="flex gap-4 mt-6 z-20 relative">
              <Button
                onClick={() => tracker.trackEvent?.({ event_type: 'NAV_TO_DOCS' })}
                asChild
                variant="default"
              >
                <a href="/docs">Docs</a>
              </Button>
              <Button
                onClick={() => tracker.trackEvent?.({ event_type: 'GET_STARTED' })}
                asChild
                variant="secondary"
              >
                <a href="#get-started">Get Started</a>
              </Button>
            </div>
            <FlipWordsDemo />
          </div>
        )}
      </ErrorBoundary>
    </DashboardLayout>
  );
}
