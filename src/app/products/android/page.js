"use client"
import ProductCategoryPage from "@/components/ProductCategoryPage";
import { androidProducts } from "@/data/products";

export default function AndroidProducts() {
  return (
    <ProductCategoryPage 
      title="Android Player"
      products={androidProducts}
      categoryPath="android"
      heroImage="https://res.cloudinary.com/dmkxx68km/image/upload/v1725611928/ukzmrw5nzcsovbnb31nd.webp"
    />
  );
} 