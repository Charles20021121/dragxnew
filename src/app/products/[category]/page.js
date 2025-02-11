"use client"
import { useEffect, useState, use } from "react";
import ProductCategoryPage from "@/components/ProductCategoryPage";
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CategoryProducts({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { category } = params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/products?category=${category}`);
        const data = await res.json();
        
        // 處理產品數據，添加 slug
        const processedProducts = data.map(product => ({
          ...product,
          slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }));
        
        setProducts(processedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ProductCategoryPage 
      title={category.toUpperCase()}
      products={products}
      categoryPath={category}
      heroImage="https://res.cloudinary.com/dmkxx68km/image/upload/v1725611928/ukzmrw5nzcsovbnb31nd.webp"
    />
  );
} 