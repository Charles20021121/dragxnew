"use client"
import ProductCategoryPage from "@/components/ProductCategoryPage";
import { ambientProducts } from "@/data/products";

export default function AmbientProducts() {
  return (
    <ProductCategoryPage 
      title="Ambient Light"
      products={ambientProducts}
      categoryPath="ambient"
      heroImage="https://res.cloudinary.com/dmkxx68km/image/upload/v1725611928/ukzmrw5nzcsovbnb31nd.webp"
    />
  );
} 