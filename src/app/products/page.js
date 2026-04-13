"use client"
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import ProductCategory from "@/components/ProductCategory";
import { motion } from "framer-motion";

// Skeleton that matches the /products layout:
// Hero banner + N category cards (title + product strip)
function ProductsPageSkeleton() {
  return (
    <main className="min-h-screen">
      {/* Hero banner skeleton */}
      <div className="w-full bg-gray-200 animate-pulse" style={{ aspectRatio: '1601/501' }} />

      <div className="py-4 bg-[#f8f4ec]">
        <div className="max-w-[1400px] mx-auto px-2 space-y-4">
          {/* 8 category card skeletons */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="mx-1 md:mx-2 bg-white rounded-[25px] px-4 py-6 shadow-lg">
              {/* Category title row */}
              <div className="flex items-center justify-center mb-4 gap-3">
                <div className="h-[2px] bg-gray-200 w-[15%]" />
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-[2px] bg-gray-200 w-[15%]" />
              </div>
              {/* Single row — mirrors Swiper: 3 mobile / 4 tablet / 5 desktop */}
              <div className="flex gap-2 overflow-hidden">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="w-1/3 md:w-1/4 lg:w-1/5 shrink-0">
                    <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
                    <div className="mt-2 h-3 bg-gray-200 rounded mx-auto w-3/4 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

// 定義類別順序
const categoryOrder = {
  'androidplayer': 1,
  'ambientlight': 2,
  'contidecoder': 3,
  'alphardvellfire': 4,
  'bmw': 5,
  'mercedes': 6,
  'powerboot': 7,
  'soundproof': 8,
  'silence': 8,
  '360camera': 9,
  'other': 999
}

// 排除的類別
const excludedCategories = [];

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?list=true');
        const products = await res.json();

        if (Array.isArray(products)) {
          const categorizedProducts = products.reduce((acc, product) => {
            const category = product.categories;

            // 排除指定的類別
            if (excludedCategories.includes(category)) {
              return acc;
            }

            if (!acc[category]) {
              let displayName = category.toUpperCase();
              if (category === '360camera') {
                displayName = '360';
              }

              acc[category] = {
                name: displayName,
                categoryKey: category,
                link: `/products/${category}`,
                products: []
              };
            }
            acc[category].products.push({
              Id: product.id.toString(),
              same: product.same,
              Name: product.name,
              categories: product.categories,
              Url: product.image,
              date: product.date,
              slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            });
            return acc;
          }, {});

          // 對類別進行排序
          const sortedCategories = Object.values(categorizedProducts).sort((a, b) => {
            const orderA = categoryOrder[a.categoryKey] || 999;
            const orderB = categoryOrder[b.categoryKey] || 999;
            return orderA - orderB;
          });

          setCategories(sortedCategories);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <ProductsPageSkeleton />;
  }

  return (
    <main className="min-h-screen">
      <HeroSection
        image="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ukzmrw5nzcsovbnb31nd.webp"
        aspectRatio="1601/501"
      />
      <motion.div
        className="py-1 bg-[#f8f4ec]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-[1400px] mx-auto px-2">
          <motion.h1
            className="text-[#1c5434] font-bold text-center mb-10 text-[clamp(24px,3vw,40px)]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />
          <div>
            {categories.map((category, index) => (
              <ProductCategory
                key={category.name}
                name={category.name}
                link={category.link}
                products={category.products}
                index={index}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
}