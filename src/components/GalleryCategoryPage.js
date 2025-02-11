"use client"
import { motion } from "framer-motion";
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import { useState, useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const ITEMS_PER_PAGE = 30;

export default function GalleryCategoryPage({ 
  title, 
  products,
  categoryPath 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  // 過濾出主圖（Id 和 same 相同的產品）
  const mainProducts = products.filter(product => 
    product.id == product.same
  );

  // 按照日期排序（最新的在前面）
  const sortedProducts = [...mainProducts].sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA;
  });

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    router.push(`?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#f8f4ec]">
      {/* 添加 Breadcrumb */}
      <nav className="py-4 px-5">
        <ol className="flex items-center gap-2 text-xs whitespace-nowrap overflow-hidden">
          <li>
            <Link href="/" className="text-black hover:text-[#1c5434]">
              Home
            </Link>
          </li>
          <span>/</span>
          <li>
            <Link href="/gallery" className="text-black hover:text-[#1c5434]">
              Gallery
            </Link>
          </li>
          <span>/</span>
          <li className="text-black capitalize">
            {categoryPath}
          </li>
        </ol>
      </nav>

      <div className="px-5">
        {/* Title Section */}
        <div className="mb-8">
          <motion.h2 
            className="text-[#023f1b] font-bold text-[clamp(18px,2vw,24px)] uppercase mb-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
          <motion.div 
            className="h-[1px] bg-[#023f1b] w-full opacity-50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transformOrigin: 'left' }}
          />
        </div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {currentProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="flex flex-col"
            >
              <Link 
                href={`/gallery/${categoryPath}/${encodeURIComponent((product.name || '').toLowerCase().replace(/\s+/g, '-'))}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <div className="relative aspect-[4/3]">
                    <CldImage
                      src={product.image}
                      alt={`${product.name} - DragX Gallery Image`}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {/* 懸停時的遮罩 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <h3 className="text-[#1c5434] font-bold text-[clamp(14px,1.5vw,16px)] group-hover:text-[#023f1b] transition-colors duration-300">
                    {product.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 pb-8">
            <button
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <span className="text-lg font-medium">
              {currentPage}/{totalPages}
            </span>

            <button
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}