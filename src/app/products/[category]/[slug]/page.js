"use client"
import { useEffect, useState, use } from "react";
import ProductDetail from "@/components/ProductDetail";
import { Suspense } from "react";
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { category, slug } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products?category=${category}`);
        const products = await res.json();

        const matchingProducts = products.filter(p =>
          p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug
        );

        // Prioritize the entry that has price and description
        const foundProduct = matchingProducts.sort((a, b) => {
          // Give points for having price and description
          let scoreA = (a.price ? 2 : 0) + (a.description ? 1 : 0);
          let scoreB = (b.price ? 2 : 0) + (b.description ? 1 : 0);
          return scoreB - scoreA;
        })[0];

        setProduct(foundProduct);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    }

    fetchProduct();
  }, [category, slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1c5434] mb-4">Product not found</h1>
          <p>Category: {category}</p>
          <p>Slug: {slug}</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductDetail product={product} />
    </Suspense>
  );
}