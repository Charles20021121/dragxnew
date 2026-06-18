"use client"
import { useEffect, useState } from "react";
import ProductCategory from "@/components/ProductCategory";
import { motion } from "framer-motion";
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from "next/link";

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
  '360camera': 3,
  'powerboot': 4,
  'contidecoder': 5,
  'alphardvellfire': 6,
  'bmw': 7,
  'mercedes': 8,
  'other': 9
};

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const products = await res.json();

        if (Array.isArray(products)) {
          const categorizedProducts = products.reduce((acc, product) => {
            const category = product.categories;
            if (!acc[category]) {
              acc[category] = {
                name: category.toUpperCase(),
                link: `/admin/products/${category}`,
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
            const orderA = categoryOrder[a.name.toLowerCase()] || 999;
            const orderB = categoryOrder[b.name.toLowerCase()] || 999;
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
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen">

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
                  <nav className="py-2 px-5">
          <ol className="flex items-center gap-2 text-xs whitespace-nowrap overflow-hidden">
            <li>
              <Link href="/admin/products" className="text-black hover:text-[#1c5434]">
                Admin Product
              </Link>
            </li>
            <span>|</span>
            <li>
              <Link href="/admin/products/reorder" className="text-black hover:text-[#1c5434] font-bold">
                Reorder Featured Products
              </Link>
            </li>
            <span>|</span>
            <li>
              <Link href="/admin/gallery" className="text-black hover:text-[#1c5434]">
                Admin Gallery
              </Link>
            </li>
          </ol>
        </nav>
          <div>
            {categories.map((category, index) => (
              <ProductCategory
                key={category.name}
                name={category.name}
                link={category.link}
                products={category.products}
                index={index}
                isAdmin={true}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
} 