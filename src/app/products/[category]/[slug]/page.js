"use client"
import { useEffect, useState, use } from "react";
import ProductDetail from "@/components/ProductDetail";
import { Suspense } from "react";

// Skeleton shown while the product data is fetching
function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f4ec] animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="py-4 flex gap-2">
          <div className="h-3 w-12 bg-gray-200 rounded" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
        {/* Title skeleton */}
        <div className="hidden md:flex justify-between items-center py-4">
          <div className="h-6 w-64 bg-gray-200 rounded" />
          <div className="h-9 w-36 bg-gray-200 rounded-full" />
        </div>
        {/* Main content skeleton */}
        <div className="bg-white rounded-t-3xl p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-3/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { category, slug } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Use the new targeted endpoint: only fetches main-image rows in this
        // category + matches slug server-side → much faster than full category.
        const res = await fetch(
          `/api/products?category=${encodeURIComponent(category)}&slug=${encodeURIComponent(slug)}`
        );

        if (res.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    }

    fetchProduct();
  }, [category, slug]);

  if (loading) {
    return <ProductSkeleton />;
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f4ec]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1c5434] mb-4">Product not found</h1>
          <p className="text-gray-500">Category: {category}</p>
          <p className="text-gray-500">Slug: {slug}</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetail product={product} />
    </Suspense>
  );
}