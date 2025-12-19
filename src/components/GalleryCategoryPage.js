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
  categoryPath,
  isAdmin,
  onDelete,
  isDeleting,
  onAdd,
  tabs,
  activeTab,
  onTabChange
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

  // 如果沒有產品，顯示空狀態
  if (!products || products.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8f4ec]">
        {/* Add Button - Fixed to bottom right */}
        {isAdmin && onAdd && (
          <button
            onClick={onAdd}
            className="fixed bottom-6 right-6 z-50 p-4 bg-[#1c5434] text-white rounded-full shadow-lg hover:bg-[#143a25] transition-colors duration-300 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}
        {/* Breadcrumb */}
        <nav className="py-4 px-5">
          <ol className="flex items-center gap-2 text-xs whitespace-nowrap overflow-hidden">
            <li>
              <Link href={isAdmin ? "/admin" : "/"} className="text-black hover:text-[#1c5434]">
                {isAdmin ? "Admin" : "Home"}
              </Link>
            </li>
            <span>/</span>
            <li>
              <Link href={isAdmin ? "/admin/gallery" : "/gallery"} className="text-black hover:text-[#1c5434]">
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

          {/* Tabs */}
          {tabs && tabs.length > 0 && (
            <div className="flex justify-center gap-4 mb-8">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => onTabChange(tab.value)}
                  className={`px-6 py-2 rounded-full border transition-all duration-300 ${activeTab === tab.value
                    ? 'bg-[#1c5434] text-white border-[#1c5434]'
                    : 'bg-transparent text-[#1c5434] border-[#1c5434] hover:bg-[#1c5434] hover:text-white'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Empty State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 mb-6 text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Images Yet
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              There are currently no images in this gallery. Please check back later for updates.
            </p>
          </motion.div>
        </div>
      </main>
    );
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    router.push(`?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#f8f4ec] relative pb-20">
      {/* Breadcrumb */}
      <nav className="py-4 px-5">
        <ol className="flex items-center gap-2 text-xs whitespace-nowrap overflow-hidden">
          <li>
            <Link href={isAdmin ? "/admin" : "/"} className="text-black hover:text-[#1c5434]">
              {isAdmin ? "Admin" : "Home"}
            </Link>
          </li>
          <span>/</span>
          <li>
            <Link href={isAdmin ? "/admin/gallery" : "/gallery"} className="text-black hover:text-[#1c5434]">
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

        {/* Tabs */}
        {tabs && tabs.length > 0 && (
          <div className="flex justify-center gap-4 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => onTabChange(tab.value)}
                className={`px-6 py-2 rounded-full border transition-all duration-300 ${activeTab === tab.value
                  ? 'bg-[#1c5434] text-white border-[#1c5434]'
                  : 'bg-transparent text-[#1c5434] border-[#1c5434] hover:bg-[#1c5434] hover:text-white'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {currentProducts.map((product) => (
            <motion.div
              key={product.id}
              className="flex flex-col relative group"
            >
              {isAdmin && onDelete && (
                <button
                  onClick={() => {
                    console.log('Product data:', {
                      id: product.id,
                      same: product.same,
                      publicId: product.publicId
                    })

                    if (!product.id || !product.same) {
                      console.error('Missing required data:', product)
                      return
                    }

                    try {
                      onDelete(product.id, product.same, product.publicId)
                    } catch (error) {
                      console.error('Error in delete handler:', error)
                    }
                  }}
                  disabled={isDeleting}
                  className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              )}

              <Link
                href={isAdmin ? `/admin/gallery/${categoryPath}/${encodeURIComponent((product.name || '').toLowerCase().replace(/\s+/g, '-'))}` : `/gallery/${categoryPath}/${encodeURIComponent((product.name || '').toLowerCase().replace(/\s+/g, '-'))}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <div className="relative aspect-[1/1]">
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

        {/* Add Button - Fixed to bottom right */}
        {isAdmin && onAdd && (
          <button
            onClick={onAdd}
            className="fixed bottom-6 right-6 z-50 p-4 bg-[#1c5434] text-white rounded-full shadow-lg hover:bg-[#143a25] transition-colors duration-300 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        )}

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