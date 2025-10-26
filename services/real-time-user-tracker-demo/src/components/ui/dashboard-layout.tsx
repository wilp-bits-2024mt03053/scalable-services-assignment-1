import { BarChart, Book, Home, Shield, ShoppingCart } from 'lucide-react';

import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Header } from '@/components/ui/header';
import { Cursor, CursorFollow, CursorProvider } from '@/components/ui/shadcn-io/animated-cursor';
import { Sidebar } from '@/components/ui/sidebar';
import { useVisitor, VisitorProvider } from '@/context/VisitorContext';

const sidebarItems = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Docs', href: '/docs', icon: Book },
  { title: 'Shop', href: '/shop', icon: ShoppingCart },
  { title: 'Authors', href: '/author', icon: Book },
  { title: 'Admin', href: '/admin', icon: Shield },
  { title: 'Analytics', href: '/analytics', icon: BarChart },
];

function InnerLayout({ title, children }: { title: string; children: React.ReactNode }) {
  const { follow, visitor } = useVisitor();

  const cursorUI = follow ? (
    <CursorProvider>
      <Cursor>
        <svg
          className="size-6 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 40 40"
        >
          <path
            fill="currentColor"
            d="M1.8 4.4 7 36.2c.3 1.8 2.6 2.3 3.6.8l3.9-5.7c1.7-2.5 4.5-4.1 7.5-4.3l6.9-.5c1.8-.1 2.5-2.4 1.1-3.5L5 2.5c-1.4-1.1-3.5 0-3.3 1.9Z"
          />
        </svg>
      </Cursor>
      <CursorFollow>
        <div className="bg-blue-500 text-white px-2 py-1 rounded-lg text-sm shadow-lg">
          {visitor?.name || 'Visitor'}
        </div>
      </CursorFollow>
    </CursorProvider>
  ) : null;

  const sidebarNav = (
    <Sidebar className="fixed left-0 top-0 h-screen w-64 z-30">
      <nav className="flex flex-col gap-2 mt-8">
        {sidebarItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded transition font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.title}</span>
          </a>
        ))}
      </nav>
    </Sidebar>
  );

  const mainContent = (
    <div className="flex-1 flex flex-col ml-64">
      <Header title={title} />
      <main className="p-8 w-full h-full">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );

  return (
    <div
      className="flex min-h-screen bg-gray-100"
      style={{ cursor: follow ? 'pointer' : undefined }}
    >
      {cursorUI}
      {sidebarNav}
      {mainContent}
    </div>
  );
}

export function DashboardLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VisitorProvider>
      <InnerLayout title={title}>{children}</InnerLayout>
    </VisitorProvider>
  );
}
