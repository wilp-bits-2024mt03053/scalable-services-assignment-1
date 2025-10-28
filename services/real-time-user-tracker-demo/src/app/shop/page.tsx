'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DashboardLayout } from '@/components/ui/dashboard-layout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppTracker } from '@/context/useAppTracker';
import { generateProducts } from '@/mock/products';

type Product = ReturnType<typeof generateProducts>[number];

// Cart component with tracking
const CartNav = ({
  cartCount,
  products,
  cartItems,
  tracker,
}: {
  cartCount: number;
  products: Product[];
  cartItems: string[];
  tracker: ReturnType<typeof useAppTracker>;
}) => (
  <div
    onClick={tracker.onClick}
    onMouseEnter={tracker.onMouseEnter}
    onMouseLeave={tracker.onMouseLeave}
    className="fixed top-0 right-0 z-40 bg-white shadow flex items-center gap-4 px-6 py-3 rounded-bl-xl border-b border-l w-auto min-w-[220px] h-16"
  >
    <span className="font-semibold text-lg">🛒 Cart</span>
    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-medium">Items: {cartCount}</span>
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            tracker.onClick(e);
          }}
        >
          View Cart
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Cart Items</DialogTitle>
        <DialogDescription>
          {cartItems.length === 0 ? (
            'Your cart is empty.'
          ) : (
            <ul className="list-disc pl-4">
              {cartItems.map((id) => {
                const product = products.find((p) => p.id === id);
                return (
                  <li key={id} className="mb-1">
                    {product ? `${product.name} (${product.price})` : id}
                  </li>
                );
              })}
            </ul>
          )}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  </div>
);

// Product card component with tracking
const ProductCard = ({
  product,
  onAddToCart,
  isLoading,
  priority = false,
  productIndex,
}: {
  product: Product;
  onAddToCart: (id: string) => void;
  isLoading: boolean;
  priority?: boolean;
  productIndex: number;
}) => {
  const tracker = useAppTracker({
    componentName: `ProductCard_${productIndex}`,
    extraMetadata: { productIndex },
  });
  return (
    <Card
      className="flex flex-col p-4"
      onClick={tracker.onClick}
      onMouseEnter={tracker.onMouseEnter}
      onMouseLeave={tracker.onMouseLeave}
    >
      <div className="relative w-full h-40 mb-2">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="rounded object-contain"
        />
      </div>
      <h2 className="font-bold text-lg mb-1">{product.name}</h2>
      <p className="text-sm text-muted-foreground mb-2">
        {product.category} • {product.brand}
      </p>
      <p className="text-md font-semibold mb-2">${product.price}</p>
      <div className="flex gap-2 mt-auto">
        <Button
          variant="secondary"
          onClick={(e) => {
            e.stopPropagation();
            tracker.onClick(e);
            onAddToCart(product.id);
          }}
          disabled={isLoading}
          className={`relative ${isLoading ? 'bg-green-100 text-green-700' : ''} transition-colors`}
        >
          {isLoading ? (
            <>
              <span className="opacity-0">Add to Cart</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              </div>
            </>
          ) : (
            'Add to Cart'
          )}
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                tracker.onClick(e);
              }}
            >
              Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{product.name}</DialogTitle>
            <div className="space-y-4 mb-6">
              <div className="relative w-full h-40">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="rounded object-contain"
                />
              </div>
              <DialogDescription>{`${product.category} • ${product.brand}`}</DialogDescription>
              <DialogDescription>{product.description}</DialogDescription>
              <DialogDescription>${product.price}</DialogDescription>
            </div>
            <Button
              variant="secondary"
              onClick={(e) => {
                tracker.onClick(e);
                onAddToCart(product.id);
              }}
              disabled={isLoading}
              className={`relative ${isLoading ? 'bg-green-100 text-green-700' : ''} transition-colors`}
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">Add to Cart</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                </>
              ) : (
                'Add to Cart'
              )}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
};

// Loading skeleton component
const ProductSkeleton = () => (
  <Card className="flex flex-col p-4">
    <Skeleton className="w-full h-40 mb-2" />
    <Skeleton className="h-6 w-2/3 mb-1" />
    <Skeleton className="h-4 w-1/2 mb-2" />
    <Skeleton className="h-5 w-1/3 mb-2" />
    <div className="flex gap-2 mt-auto">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </Card>
);

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Create trackers at the top level
  // Removed unused pageTracker
  const cartTracker = useAppTracker({ componentName: 'CartNav' });

  // Create product trackers at the top level
  // Removed productTrackers array to fix hook usage violation

  // Generate products only on client to avoid hydration mismatch
  useEffect(() => {
    setProducts(generateProducts(20));
  }, []);

  const handleAddToCart = async (id: string) => {
    setAddingToCart(id);
    // Simulate a delay to show the loading state
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCart((prev) => [...prev, id]);
    setAddingToCart(null);
  };

  return (
    <DashboardLayout title="Shop">
      <CartNav cartCount={cart.length} products={products} cartItems={cart} tracker={cartTracker} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-20">
        {products.length === 0
          ? Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
          : products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isLoading={addingToCart === product.id}
                priority={index < 6}
                productIndex={index}
              />
            ))}
      </div>
    </DashboardLayout>
  );
}
