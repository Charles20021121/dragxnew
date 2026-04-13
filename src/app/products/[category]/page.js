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
        console.error('Error details:', error.message);
        setProducts([]); // 确保设置为空数组而不是 undefined
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

  return (
    <ProductCategoryPage 
      title={category.toUpperCase()}
      products={products}
      categoryPath={category}
      loading={loading}
      heroImage="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ukzmrw5nzcsovbnb31nd.webp"
    />
  );
} 