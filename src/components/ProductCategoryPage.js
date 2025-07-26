"use client"
import { motion, AnimatePresence } from "framer-motion";
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import { useState } from 'react';
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
  categoryPath,
  isAdmin,
  onDelete,
  loading
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const [androidFilter, setAndroidFilter] = useState('androidPlayer');
  const [silenceFilter, setSilenceFilter] = useState('hatchback');
  const [contiFilter, setContiFilter] = useState('appleCarplay');
  const [carFilter, setCarFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 根據類別和過濾條件處理產品列表
  const displayProducts =
    categoryPath === "soundproof"
      ? products
        .filter(product => product.filter1 === silenceFilter)
        .sort((a, b) => a.name.localeCompare(b.name))
    : categoryPath === "androidplayer"
      ? products
        .filter(product => product.filter1 === androidFilter)
        .sort((a, b) => a.name.localeCompare(b.name))
      : categoryPath === "contidecoder"
        ? products
          .filter(product => {
            const typeMatch = contiFilter === 'appleCarplay' 
              ? (product.filter1 === 'appleCarplay'  )
              : product.filter1 === contiFilter;
            const carMatch = carFilter === 'all' || product.filter === carFilter ;
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

  if (loading) {
    return <LoadingSpinner />;
  }

  // 處理頁面變化
  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    router.push(`?${params.toString()}`);
  };

  // 添加格式化類別名稱的函數
  const formatCategoryName = (name) => {
    if (name.toLowerCase() === 'alphardvellfire') {
      return 'ALPHARD/VELLFIRE';
    }
    if (name.toLowerCase() === 'ambientlight') {
      return 'AMBIENT LIGHT';
    }
    if (name.toLowerCase() === '360camera') {
      return '360 CAMERA';
    }
    if (name.toLowerCase() === 'powerboot') {
      return 'POWER BOOT';
    }
    if (name.toLowerCase() === 'mercedes') {
      return 'MERCEDES-BENZ';
    }
    if (name.toLowerCase() === 'bmw') {
      return 'BMW';
    }

    return name.toUpperCase();
  };

  return (
    <main className="min-h-screen bg-[#f8f4ec] ">
      
      {/* 添加 Breadcrumb */}
      <nav className="py-4 px-5">
        <ol className="flex items-center gap-2 text-xs whitespace-nowrap overflow-hidden">
          <li>
            <Link href={isAdmin ? "/admin" : "/"} className="text-black hover:text-[#1c5434]">
              {isAdmin ? "Admin" : "Home"}
            </Link>
          </li>
          <span>/</span>
          <li>
            <Link href={isAdmin ? "/admin/products" : "/products"} className="text-black hover:text-[#1c5434]">
              Products
            </Link>
          </li>
          <span>/</span>
          <li className="text-black capitalize">
            {categoryPath}
          </li>
        </ol>
      </nav>
      <div className="px-5 pb-5">
        {/* androidplayer 的分類切換按鈕 */}
        {categoryPath === "androidplayer" && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md bg-white p-1 shadow-sm">
              <button
                onClick={() => setAndroidFilter('androidPlayer')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${androidFilter === 'androidPlayer'
                    ? 'bg-[#1c5434] text-white'
                    : 'text-gray-500 hover:text-[#1c5434]'
                  }`}
              >
                ANDROID PLAYER
              </button>
              <button
                onClick={() => setAndroidFilter('contiAndroid')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${androidFilter === 'contiAndroid'
                    ? 'bg-[#1c5434] text-white'
                    : 'text-gray-500 hover:text-[#1c5434]'
                  }`}
              >
                CONTI ANDROID
              </button>
            </div>
          </div>
        )}

        {categoryPath === "soundproof" && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md bg-white p-1 shadow-sm">
              <button
                onClick={() => setSilenceFilter('hatchback')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${silenceFilter === 'hatchback'
                    ? 'bg-[#1c5434] text-white'
                    : 'text-gray-500 hover:text-[#1c5434]'
                  }`}
              >
                HATCHBACK
              </button>
              <button
                onClick={() => setSilenceFilter('sedan')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${silenceFilter === 'sedan'
                    ? 'bg-[#1c5434] text-white'
                    : 'text-gray-500 hover:text-[#1c5434]'
                  }`}
              >
                    SEDAN
              </button>
              <button
                onClick={() => setSilenceFilter('suv')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${silenceFilter === 'suv'
                    ? 'bg-[#1c5434] text-white'
                    : 'text-gray-500 hover:text-[#1c5434]'
                  }`}
              >
                SUV
              </button>
              <button
                onClick={() => setSilenceFilter('mpv')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${silenceFilter === 'mpv'
                    ? 'bg-[#1c5434] text-white'
                    : 'text-gray-500 hover:text-[#1c5434]'
                  }`}
              >
                MPV
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
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${contiFilter === 'appleCarplay'
                        ? 'bg-[#1c5434] text-white'
                        : 'text-gray-500 hover:text-[#1c5434]'
                      }`}
                  >
                    APPLE CARPLAY
                  </button>
                  <button
                    onClick={() => setContiFilter('androidSystem')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${contiFilter === 'androidSystem'
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
                            className={`w-full px-4 py-2 text-left rounded-md transition-colors capitalize ${carFilter === model
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
                  : formatCategoryName(title)
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
              <div className="group relative">
                
                <Link
                  href={
                   
                    isAdmin ? `/admin/products/${categoryPath}/${product.slug}` : `/products/${categoryPath}/${product.slug}`}
                  className="block"
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

                {/* Admin Controls */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        onDelete(product.id)
                      }}
                      className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8 ">
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