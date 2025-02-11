"use client"
import { motion, AnimatePresence } from "framer-motion";
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import { useState, useEffect } from 'react';
import { FaFilter } from "react-icons/fa";

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

// 定義車款選項
const carModels = [
  'all', 'audi', 'mercedes', 'bmw', 'ford', 'honda', 'jaguar',
  'landrover', 'lexus', 'mini', 'perodua', 'porsche', 'proton',
  'toyota', 'volvo', 'alphard', 'vellfire'
];

export default function ProductCategoryPage({ 
  title, 
  products,
  categoryPath 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const [androidFilter, setAndroidFilter] = useState('androidPlayer');
  const [contiFilter, setContiFilter] = useState('appleCarplay');
  const [carFilter, setCarFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 根據類別和過濾條件處理產品列表
  const displayProducts = 
    categoryPath === "androidplayer" 
      ? products
          .filter(product => product.filter1 === androidFilter)
          .sort((a, b) => a.name.localeCompare(b.name))
    : categoryPath === "contidecoder"
      ? products
          .filter(product => {
            const typeMatch = contiFilter === 'appleCarplay' 
              ? (product.filter1 === 'appleCarplay' || !product.filter1)
              : product.filter1 === contiFilter;
            const carMatch = carFilter === 'all' || product.filter === carFilter;
            return typeMatch && carMatch;
          })
          .sort((a, b) => a.name.localeCompare(b.name))
    : products
        .filter(product => product.id == product.same)
        .sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(displayProducts.length / ITEMS_PER_PAGE);
  
  // 分頁處理
  const currentProducts = displayProducts.slice(
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

  // 處理頁面變化
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    router.push(`?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#f8f4ec] ">
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
            <Link href="/products" className="text-black hover:text-[#1c5434]">
              Products
            </Link>
          </li>
          <span>/</span>
          <li className="text-black capitalize">
            {categoryPath}
          </li>
        </ol>
      </nav>
      <div className="px-5">
        {/* androidplayer 的分類切換按鈕 */}
        {categoryPath === "androidplayer" && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md bg-white p-1 shadow-sm">
              <button
                onClick={() => setAndroidFilter('androidPlayer')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  androidFilter === 'androidPlayer'
                    ? 'bg-[#1c5434] text-white'
                    : 'text-gray-500 hover:text-[#1c5434]'
                }`}
              >
                ANDROID PLAYER
              </button>
              <button
                onClick={() => setAndroidFilter('contiAndroid')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  androidFilter === 'contiAndroid'
                    ? 'bg-[#1c5434] text-white'
                    : 'text-gray-500 hover:text-[#1c5434]'
                }`}
              >
                CONTI ANDROID
              </button>
            </div>
          </div>
        )}

        {/* contidecoder 的分類切換按鈕 */}
        {categoryPath === "contidecoder" && (
          <>
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center">
                <div className="inline-flex rounded-md bg-white p-1 shadow-sm">
                  <button
                    onClick={() => setContiFilter('appleCarplay')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      contiFilter === 'appleCarplay'
                        ? 'bg-[#1c5434] text-white'
                        : 'text-gray-500 hover:text-[#1c5434]'
                    }`}
                  >
                    APPLE CARPLAY
                  </button>
                  <button
                    onClick={() => setContiFilter('androidSystem')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      contiFilter === 'androidSystem'
                        ? 'bg-[#1c5434] text-white'
                        : 'text-gray-500 hover:text-[#1c5434]'
                    }`}
                  >
                    ANDROID SYSTEM
                  </button>
                </div>
              </div>
            </div>

            {/* 側邊欄 */}
            <AnimatePresence>
              {isFilterOpen && (
                <>
                  {/* 遮罩層 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsFilterOpen(false)}
                    className="fixed inset-0 bg-black z-40"
                  />

                  {/* 側邊欄 */}
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 overflow-y-auto"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-[#1c5434]">Car Models</h3>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {carModels.map(model => (
                          <button
                            key={model}
                            onClick={() => {
                              setCarFilter(model);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left rounded-md transition-colors capitalize ${
                              carFilter === model
                                ? 'bg-[#1c5434] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {model === 'all' ? 'All Models' : model}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Title Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-5">
            <motion.h2 
              className="text-[#023f1b] font-bold text-[clamp(18px,2vw,24px)] uppercase"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {categoryPath === "androidplayer" 
                ? (androidFilter === 'androidPlayer' ? 'ANDROID PLAYER' : 'CONTI ANDROID')
                : categoryPath === "contidecoder"
                  ? `${contiFilter === 'appleCarplay' ? 'APPLE CARPLAY' : 'ANDROID SYSTEM'}`
                  : title
              }
            </motion.h2>

            {/* 漏斗按鈕 - 只在 contidecoder 頁面顯示 */}
            {categoryPath === "contidecoder" && (
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                <FaFilter className="text-[#1c5434]" />
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {carFilter === 'all' ? 'All Models' : carFilter}
                </span>
              </button>
            )}
          </div>

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
                href={`/products/${categoryPath}/${product.slug}`}
                className="group"
              >
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-square bg-white">
                    <CldImage
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
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