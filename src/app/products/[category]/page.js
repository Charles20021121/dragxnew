"use client"
import { useEffect, useState, use } from "react";
import ProductCategoryPage from "@/components/ProductCategoryPage";

// Skeleton that mirrors the /products/[category] layout:
// Breadcrumb + title bar + product grid
function CategoryPageSkeleton({ category }) {
  return (
    <main className="min-h-screen bg-[#f8f4ec]">
      {/* Breadcrumb skeleton */}
      <nav className="py-4 px-2 md:px-5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 w-2 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </nav>

      <div className="px-2 md:px-5 pb-5">
        {/* Title + divider skeleton */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-[1px] bg-gray-200 w-full" />
        </div>

        {/* Single row — mirrors Swiper: 3 mobile / 4 tablet / 5 desktop */}
        <div className="flex gap-2 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1/3 md:w-1/4 lg:w-1/5 shrink-0">
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              <div className="mt-3 h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function CategoryProducts({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { category } = params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/products?category=${category}`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        // 确保 data 是数组
        if (!Array.isArray(data)) {
          console.error('API did not return an array:', data);
          setProducts([]);
          setLoading(false);
          return;
        }

        // 處理產品數據，添加 slug
        const processedProducts = data.map(product => ({
          ...product,
          slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }));

        setProducts(processedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'ViewCategory', {
        content_category: category,
        content_name: `${category.toUpperCase()} Products`
      });
    }
  }, [category]);

  // Show skeleton immediately while data loads
  if (loading) {
    return <CategoryPageSkeleton category={category} />;
  }

  return (
    <ProductCategoryPage
      title={category.toUpperCase()}
      products={products}
      categoryPath={category}
      loading={false}
      heroImage="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ukzmrw5nzcsovbnb31nd.webp"
    />
  );
}