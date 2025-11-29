"use client"
import { motion, AnimatePresence } from "framer-motion";
import { CldImage } from 'next-cloudinary';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';
import { useState, useEffect } from 'react';
import { FaFilter } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useProduct } from '@/contexts/ProductContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// 添加 Swiper 自定义样式
if (typeof window !== 'undefined') {
  const swiperStyle = document.createElement('style');
  swiperStyle.textContent = `
    .swiper-button-next, .swiper-button-prev {
      display: none !important;
    }
    .swiper-slide {
      transition: transform 0.3s ease;
    }
    .swiper-slide:hover {
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(swiperStyle);
}


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

// 定義 Android Series 選項
const androidSeries = [
  { value: 'all', label: 'All Series' },
  { value: 'uncategorized', label: 'Uncategorized' },
  { value: 'Advance_series', label: 'Advance series' },
  { value: 'Android_Ai_Box', label: 'Android Ai Box' },
  { value: 'Cyber_series', label: 'Cyber series' },
  { value: 'Diamond_series', label: 'Diamond series' },
  { value: 'Exclusive_series', label: 'Exclusive series' },
  { value: 'Luxury_series', label: 'Luxury series' },
  { value: 'Performance_series', label: 'Performance series' },
  { value: 'TRONMMEXT_EI_series', label: 'TRONMMEXT EI series' },
  { value: 'TRONMMEXT_ES_series', label: 'TRONMMEXT ES series' },
  { value: 'Ultra_series', label: 'Ultra series' },
  { value: 'Others', label: 'Others' }
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
  const { setCurrentProduct } = useProduct();
  const currentPage = Number(searchParams.get('page')) || 1;
  const [androidFilter, setAndroidFilter] = useState('androidPlayer');
  const [silenceFilter, setSilenceFilter] = useState('hatchback');
  const [contiFilter, setContiFilter] = useState('appleCarplay');
  const [carFilter, setCarFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 设置当前分类信息给 WhatsApp 按钮使用
  useEffect(() => {
    if (categoryPath === 'androidplayer') {
      setCurrentProduct({
        name: `${androidFilter === 'androidPlayer' ? 'Android Player' : 'Android Screen'} Products`,
        category: 'androidplayer',
        filter1: androidFilter,
        url: window.location.href,
        isListPage: true
      });
    } else if (categoryPath === 'contidecoder') {
      setCurrentProduct({
        name: `${contiFilter === 'appleCarplay' ? 'Apple Carplay' : 'Android System'} Products`,
        category: 'contidecoder',
        filter1: contiFilter,
        url: window.location.href,
        isListPage: true
      });
    } else if (categoryPath === 'soundproof') {
      setCurrentProduct({
        name: `Soundproof ${silenceFilter.toUpperCase()} Products`,
        category: 'soundproof',
        filter1: silenceFilter,
        url: window.location.href,
        isListPage: true
      });
    } else {
      setCurrentProduct({
        name: `${title} Products`,
        category: categoryPath,
        url: window.location.href,
        isListPage: true
      });
    }

    // 清理函数：离开页面时清除产品信息
    return () => {
      setCurrentProduct(null);
    };
  }, [categoryPath, androidFilter, contiFilter, silenceFilter, title, setCurrentProduct]);

  // 根據類別和過濾條件處理產品列表
  const displayProducts =
    categoryPath === "soundproof"
      ? products
        .filter(product => product.filter1 === silenceFilter)
        .sort((a, b) => a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base'
        }))
      : categoryPath === "contidecoder"
        ? products
          .filter(product => {
            const typeMatch = contiFilter === 'appleCarplay'
              ? (product.filter1 === 'appleCarplay')
              : product.filter1 === contiFilter;
            const carMatch = carFilter === 'all' || product.filter === carFilter;
            return typeMatch && carMatch;
          })
          .sort((a, b) => a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base'
          }))
        : products
          .filter(product => product.id == product.same)
          .sort((a, b) => a.name.localeCompare(b.name, undefined, {
            numeric: true,
            sensitivity: 'base'
          }));

  // Android Player 专用：按系列分组产品
  const getAndroidProductsBySeries = () => {
    if (categoryPath !== "androidplayer") return {};

    // 确保 products 是数组
    if (!Array.isArray(products)) {
      console.error('Products is not an array:', products);
      return {};
    }

    const filteredProducts = products
      .filter(product => product && product.filter1 === androidFilter)
      .sort((a, b) => {
        const nameA = (a.name || '');
        const nameB = (b.name || '');

        // 智能排序：正确处理包含数字的字符串
        return nameA.localeCompare(nameB, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });

    const productsBySeries = {};

    // 为每个系列创建分组
    androidSeries.forEach(series => {
      if (series.value === 'all') return; // 跳过 "All Series"

      if (series.value === 'uncategorized') {
        productsBySeries[series.value] = {
          label: series.label,
          products: filteredProducts.filter(product =>
            !product.android_series || product.android_series === '' || product.android_series === null
          )
        };
      } else {
        productsBySeries[series.value] = {
          label: series.label,
          products: filteredProducts.filter(product => product.android_series === series.value)
        };
      }
    });

    // 只返回有产品的系列
    return Object.fromEntries(
      Object.entries(productsBySeries).filter(([key, value]) => value.products.length > 0)
    );
  };

  const androidProductsBySeries = getAndroidProductsBySeries();

  // 调试信息
  console.log('Products in ProductCategoryPage:', products);
  console.log('Android products by series:', androidProductsBySeries);

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
          <div className="flex justify-center mb-8 px-2">
            <div className="inline-flex rounded-md bg-white p-1 shadow-sm w-full max-w-2xl">
              <Link
                href="/lyno"
                className="flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors text-gray-500 hover:text-[#1c5434] text-center whitespace-nowrap"
              >
                LYNO
              </Link>
              <button
                onClick={() => setAndroidFilter('androidPlayer')}
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${androidFilter === 'androidPlayer'
                  ? 'bg-[#1c5434] text-white'
                  : 'text-gray-500 hover:text-[#1c5434]'
                  }`}
              >
                ANDROID PLAYER
              </button>
              <button
                onClick={() => setAndroidFilter('contiAndroid')}
                className={`flex-1 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${androidFilter === 'contiAndroid'
                  ? 'bg-[#1c5434] text-white'
                  : 'text-gray-500 hover:text-[#1c5434]'
                  }`}
              >
                ANDROID SCREEN
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
                ? (androidFilter === 'androidPlayer' ? 'ANDROID PLAYER' : 'ANDROID SCREEN')
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

        {/* Products Display - Android Player 使用分层显示，其他使用网格 */}
        {categoryPath === "androidplayer" ? (
          /* Android Player 分层显示 */
          <div>
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-lg text-gray-600">Loading products...</div>
              </div>
            ) : Object.entries(androidProductsBySeries || {}).length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-lg text-gray-600">No products found</div>
              </div>
            ) : (
              Object.entries(androidProductsBySeries || {}).map(([seriesKey, seriesData], index) => (
                <motion.div
                  key={seriesKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="mb-12"
                >
                  {/* 系列标题 - 移除装饰线 */}
                  <div className="mb-6">
                    <div className="mb-4">
                      <h3 className="text-[#1c5434] font-[900] text-center m-0 text-[clamp(20px,2.5vw,28px)]">
                        {seriesData.label.toUpperCase()}
                      </h3>
                    </div>
                  </div>

                  {/* 根据产品数量选择布局方式 */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className={seriesData.products.length <= 5 ? "" : "swiper-container"}
                  >
                    {seriesData.products.length <= 5 ? (
                      /* 产品少时使用网格布局 */
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {(seriesData.products || []).map((product) => (
                          <motion.div
                            key={product.id}
                            variants={itemVariants}
                            className="flex flex-col"
                          >
                            <div className="group relative">
                              <Link
                                href={isAdmin ? `/admin/products/${categoryPath}/${product.slug}` : `/products/${categoryPath}/${product.slug}`}
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
                                  {product.price && (
                                    <p className="text-[#1c5434] font-medium text-sm mt-1">
                                      {product.price}
                                    </p>
                                  )}
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
                      </div>
                    ) : (
                      /* 产品多时使用滑动布局 */
                      <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        navigation={{
                          nextEl: `.swiper-button-next-${seriesKey}`,
                          prevEl: `.swiper-button-prev-${seriesKey}`,
                        }}
                        breakpoints={{
                          320: {
                            slidesPerView: Math.min(seriesData.products.length, 2),
                            spaceBetween: 12,
                          },
                          640: {
                            slidesPerView: Math.min(seriesData.products.length, 3),
                            spaceBetween: 16,
                          },
                          768: {
                            slidesPerView: Math.min(seriesData.products.length, 4),
                            spaceBetween: 16,
                          },
                          1024: {
                            slidesPerView: Math.min(seriesData.products.length, 5),
                            spaceBetween: 16,
                          },
                        }}

                      >
                        {(seriesData.products || []).map((product) => (
                          <SwiperSlide key={product.id}>
                            <motion.div
                              variants={itemVariants}
                            >
                              <div className="group relative">
                                <Link
                                  href={isAdmin ? `/admin/products/${categoryPath}/${product.slug}` : `/products/${categoryPath}/${product.slug}`}
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
                                    {product.price && (
                                      <p className="text-[#1c5434] font-medium text-sm mt-1">
                                        {product.price}
                                      </p>
                                    )}
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
                          </SwiperSlide>
                        ))}

                        {/* 自定义导航按钮 */}
                        <div className={`swiper-button-prev-${seriesKey} absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#1c5434] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </div>
                        <div className={`swiper-button-next-${seriesKey} absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#1c5434] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Swiper>
                    )}
                  </motion.div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          /* 其他类别使用原来的网格显示 */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {(currentProducts || []).map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="flex flex-col"
              >
                <div className="group relative">
                  <Link
                    href={isAdmin ? `/admin/products/${categoryPath}/${product.slug}` : `/products/${categoryPath}/${product.slug}`}
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
                      {product.price && (
                        <p className="text-[#1c5434] font-medium text-sm mt-1">
                          {product.price}
                        </p>
                      )}
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
        )}

        {/* Pagination - 只在非 Android Player 页面显示 */}
        {categoryPath !== "androidplayer" && totalPages > 1 && (
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
        )
        }
      </div >
    </main >
  );
}