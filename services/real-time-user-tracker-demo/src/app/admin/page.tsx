'use client';
import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import { SkeletonAdmin } from '@/components/ui/skeleton-admin';
import { useAppTracker } from '@/context/useAppTracker';
import { generateOrders } from '@/mock/orders';
import { generateProducts } from '@/mock/products';
import { generateUsers } from '@/mock/users';

const usersData = generateUsers(10);
const ordersData = generateOrders(10);
const productsData = generateProducts(10);

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [users] = useState(usersData);
  const [orders] = useState(ordersData);
  const [products] = useState(productsData);
  const pageTracker = useAppTracker({ componentName: 'AdminPage' });
  const totalUsersTracker = useAppTracker({
    componentName: 'TotalUsersCard',
    extraMetadata: { event_type: 'VIEW_TOTAL_USERS' },
  });
  const totalOrdersTracker = useAppTracker({
    componentName: 'TotalOrdersCard',
    extraMetadata: { event_type: 'VIEW_TOTAL_ORDERS' },
  });
  const totalProductsTracker = useAppTracker({
    componentName: 'TotalProductsCard',
    extraMetadata: { event_type: 'VIEW_TOTAL_PRODUCTS' },
  });
  const revenueTracker = useAppTracker({
    componentName: 'RevenueCard',
    extraMetadata: { event_type: 'VIEW_REVENUE' },
  });
  const recentUsersTracker = useAppTracker({
    componentName: 'RecentUsersCard',
    extraMetadata: { event_type: 'VIEW_RECENT_USERS' },
  });
  const recentOrdersTracker = useAppTracker({
    componentName: 'RecentOrdersCard',
    extraMetadata: { event_type: 'VIEW_RECENT_ORDERS' },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout title="Admin">
      {loading ? (
        <SkeletonAdmin />
      ) : (
        <div
          onClick={pageTracker.onClick}
          onMouseEnter={pageTracker.onMouseEnter}
          onMouseLeave={pageTracker.onMouseLeave}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card
            onClick={totalUsersTracker.onClick}
            onMouseEnter={totalUsersTracker.onMouseEnter}
            onMouseLeave={totalUsersTracker.onMouseLeave}
            className="p-6"
          >
            <h2 className="font-bold text-lg mb-2">Total Users</h2>
            <p className="text-3xl font-bold">{users.length}</p>
          </Card>
          <Card
            onClick={totalOrdersTracker.onClick}
            onMouseEnter={totalOrdersTracker.onMouseEnter}
            onMouseLeave={totalOrdersTracker.onMouseLeave}
            className="p-6"
          >
            <h2 className="font-bold text-lg mb-2">Total Orders</h2>
            <p className="text-3xl font-bold">{orders.length}</p>
          </Card>
          <Card
            onClick={totalProductsTracker.onClick}
            onMouseEnter={totalProductsTracker.onMouseEnter}
            onMouseLeave={totalProductsTracker.onMouseLeave}
            className="p-6"
          >
            <h2 className="font-bold text-lg mb-2">Total Products</h2>
            <p className="text-3xl font-bold">{products.length}</p>
          </Card>
          <Card
            onClick={revenueTracker.onClick}
            onMouseEnter={revenueTracker.onMouseEnter}
            onMouseLeave={revenueTracker.onMouseLeave}
            className="p-6"
          >
            <h2 className="font-bold text-lg mb-2">Revenue</h2>
            <p className="text-3xl font-bold">
              ${orders.reduce((sum, o) => sum + parseFloat(o.total), 0).toFixed(2)}
            </p>
          </Card>
          <Card
            onClick={recentUsersTracker.onClick}
            onMouseEnter={recentUsersTracker.onMouseEnter}
            onMouseLeave={recentUsersTracker.onMouseLeave}
            className="p-6"
          >
            <h2 className="font-bold text-lg mb-2">Recent Users</h2>
            <ul className="text-sm">
              {users.slice(0, 5).map((u) => (
                <li key={u.id}>
                  {u.name} ({u.email})
                </li>
              ))}
            </ul>
          </Card>
          <Card
            onClick={recentOrdersTracker.onClick}
            onMouseEnter={recentOrdersTracker.onMouseEnter}
            onMouseLeave={recentOrdersTracker.onMouseLeave}
            className="p-6"
          >
            <h2 className="font-bold text-lg mb-2">Recent Orders</h2>
            <ul className="text-sm">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id}>
                  Order #{o.id.slice(0, 6)} - {o.status}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
