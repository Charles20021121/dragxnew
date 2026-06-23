"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const CATEGORY_ORDER = {
  'androidplayer': 1,
  'ambientlight': 2,
  'contidecoder': 3,
  'alphardvellfire': 4,
  'bmw': 5,
  'mercedes': 6,
  'powerboot': 7,
  'soundproof': 8,
  '360camera': 9,
};

const formatCategoryName = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName === 'androidplayer') return 'ANDROID PLAYER';
  if (lowerName === 'alphardvellfire') return 'ALPHARD/VELLFIRE';
  if (lowerName === 'ambientlight') return 'AMBIENT LIGHT';
  if (lowerName === '360camera') return 'DX360';
  if (lowerName === 'powerboot') return 'POWER BOOT';
  if (lowerName === 'contidecoder') return 'CONTI DECODER';
  if (lowerName === 'mercedes') return 'MERCEDES-BENZ';
  if (lowerName === 'bmw') return 'BMW';
  if (lowerName === 'soundproof') return 'SOUNDPROOF';
  return name.toUpperCase();
};

const getCategoryLink = (categoryKey, product = null) => {
  const key = categoryKey.toLowerCase();

  if (key === 'androidplayer') {
    if (product) {
      if (product.filter1 === 'contiAndroid') {
        return '/products/androidplayer?filter1=contiAndroid';
      }
      if (product.android_series) {
        return `/products/androidplayer#${product.android_series}`;
      }
    }
    return '/products/androidplayer';
  }

  if (key === 'contidecoder') {
    if (product && product.filter1) {
      return `/products/contidecoder?filter1=${product.filter1}`;
    }
    return '/products/contidecoder';
  }

  if (key === 'soundproof' || key === 'silence') {
    return '/products/soundproof';
  }

  if (key === '360camera') {
    return '/products/360camera';
  }

  return `/products/${categoryKey}`;
};

export default function ProductShowcaseSection({ initialProducts = [] }) {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (initialProducts.length > 0) {
      const uniqueCats = [...new Set(initialProducts.map(p => p.categories))].filter(Boolean);
      const sortedCats = uniqueCats.sort((a, b) => {
        const orderA = CATEGORY_ORDER[a.toLowerCase()] || 999;
        const orderB = CATEGORY_ORDER[b.toLowerCase()] || 999;
        return orderA - orderB;
      });

      setCategories(sortedCats);
      if (sortedCats.length > 0) {
        setActiveTab(sortedCats[0]);
      }
    }
  }, [initialProducts]);

  const activeProducts = initialProducts.filter(p => p.categories === activeTab).sort((a, b) => {
    const orderA = a.sort_order || 0;
    const orderB = b.sort_order || 0;
    if (orderA !== orderB) {
      return orderB - orderA;
    }
    const nameA = a.name || a.Name || '';
    const nameB = b.name || b.Name || '';
    return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <section className="pb-5 pt-1 bg-[#fff4ec]">
      <div className="px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[40px] border border-gray-200 shadow-sm p-4 sm:p-6"
        >
          {/* Title with lines */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
            <div className="mx-[2%]">
              <h2 className="text-[#1c5434] font-[900] text-center m-0 text-[clamp(20px,3vw,36px)] relative drop-shadow-sm">
                Featured Product
              </h2>
            </div>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
          </div>

          {/* Categories */}
          {!isMounted ? (
            <div className="flex justify-center pb-4 px-2">
              <div className="h-10 w-full sm:w-[80%] bg-gray-100 rounded-xl animate-pulse" />
            </div>
          ) : (
            <div className="mb-4 sm:mb-8 px-0 sm:px-4">
              {/* Desktop Tabs */}
              <div className="hidden sm:flex flex-wrap justify-center gap-2">
                {categories.map((cat) => {
                  const isActive = activeTab === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveTab(cat)}
                      className={`relative px-6 py-2.5 rounded-full text-sm font-bold transition-colors duration-300 whitespace-nowrap ${
                        isActive ? 'text-white border border-transparent' : 'text-gray-600 hover:text-[#1c5434] bg-white border border-gray-200 shadow-sm'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="absolute inset-0 bg-gradient-to-r from-[#1c5434] to-[#0a4020] rounded-full shadow-md"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10">{formatCategoryName(cat)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Scrollable Tabs */}
              <div className="sm:hidden relative w-full">
                <div className="flex gap-2 overflow-x-auto scrollbar-none px-2 py-2 snap-x scroll-smooth -mx-2">
                  {categories.map((cat) => {
                    const isActive = activeTab === cat;
                    return (
                      <button
                        key={cat}
                        onClick={(e) => {
                          setActiveTab(cat);
                          e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                        }}
                        className={`relative px-4 py-2 rounded-full text-[12px] font-bold transition-colors duration-300 whitespace-nowrap shrink-0 snap-center ${
                          isActive ? 'text-white border border-transparent' : 'text-gray-600 hover:text-[#1c5434] bg-white border border-gray-200 shadow-sm'
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTabIndicatorMobile"
                            className="absolute inset-0 bg-gradient-to-r from-[#1c5434] to-[#0a4020] rounded-full shadow-md"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{formatCategoryName(cat)}</span>
                      </button>
                    );
                  })}
                  {/* Back to First Button */}
                  {categories.length > 3 && (
                    <button
                      onClick={(e) => {
                        if (categories.length > 0) {
                          setActiveTab(categories[0]);
                          e.currentTarget.parentNode.scrollTo({ left: 0, behavior: 'smooth' });
                        }
                      }}
                      className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#1c5434] to-[#0a4020] shadow-md shrink-0 snap-center hover:scale-105 active:scale-95 transition-all duration-300 ml-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                      </svg>
                    </button>
                  )}
                  {/* Padding block so last item doesn't stick to the edge */}
                  <div className="shrink-0 w-4" />
                </div>
              </div>
            </div>
          )}

          {/* Products Slider / Showcase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="min-h-[250px]"
            >
              {!isMounted ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-full aspect-square bg-gray-100 rounded-2xl animate-pulse" />
                      <div className="mt-3 h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : activeProducts.length === 0 ? (
                <div className="flex items-center justify-center h-[250px] text-gray-400 font-medium">
                  No products found in this category.
                </div>
              ) : (
                <div className="relative px-0 sm:px-10">
                  {/* Mobile Grid View (2 cols, 2 rows max) */}
                  <div className="grid grid-cols-2 gap-3 sm:hidden px-2">
                    {activeProducts.slice(0, 4).map((product, index) => {
                      const imgUrl = product.image || product.Url || '';
                      const productLink =
                        product.categories === 'soundproof'
                          ? '/silence'
                          : `/products/${product.categories}/${product.slug}`;

                      return (
                        <Link href={productLink} key={product.id || index} className="group flex flex-col h-full bg-white border border-gray-100 shadow-sm overflow-hidden pb-2">
                          <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center">
                            {imgUrl && (
                                <Image
                                  src={imgUrl}
                                  alt={product.name || ''}
                                  fill
                                  className="object-cover"
                                  priority={index < 4}
                                  loading={index < 4 ? undefined : "lazy"}
                                />
                            )}
                          </div>
                          <h3 className="text-[#1c5434] font-bold text-center mt-2 text-[11px] leading-snug line-clamp-2 min-h-[32px] px-1">
                            {product.name || product.Name}
                          </h3>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Desktop Swiper View */}
                  <div className="hidden sm:block">
                    <Swiper
                      modules={[Autoplay, Navigation]}
                      speed={800}
                      spaceBetween={20}
                      slidesPerView={3}
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }}
                      navigation={{
                        prevEl: '.swiper-btn-prev-showcase',
                        nextEl: '.swiper-btn-next-showcase',
                      }}
                      breakpoints={{
                        640: {
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 4,
                          spaceBetween: 24,
                        },
                        1024: {
                          slidesPerView: 5,
                          spaceBetween: 30,
                        },
                      }}
                      className="!py-4 !px-2"
                    >
                      {activeProducts.map((product, index) => {
                        const imgUrl = product.image || product.Url || '';
                        const productLink =
                          product.categories === 'soundproof'
                            ? '/silence'
                            : `/products/${product.categories}/${product.slug}`;

                        return (
                          <SwiperSlide key={product.id || index} className="h-auto">
                            <div
                              className="group flex flex-col h-full"
                            >
                              <Link href={productLink} className="block w-full flex-grow">
                                <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm flex items-center justify-center transition-all duration-500 group-hover:shadow-[0_8px_30px_rgb(28,84,52,0.15)] group-hover:border-[#1c5434]/30">
                                  {imgUrl && (
                                    <Image
                                      src={imgUrl}
                                      alt={product.name || ''}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                                      priority={index < 5}
                                      loading={index < 5 ? undefined : "lazy"}
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-[#1c5434]/80 via-[#1c5434]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl flex flex-col justify-end items-center pb-6">
                                    <div className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                      <span className="text-xs font-bold uppercase tracking-wider">Discover</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>

                                <h3 className="text-[#1c5434] font-bold text-center mt-3 text-sm sm:text-base group-hover:text-[#023f1b] transition-colors duration-300 line-clamp-2 min-h-[48px] px-1 leading-snug">
                                  {product.name || product.Name}
                               </h3>
                              </Link>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>

                    {/* Custom Navigation Arrows (Desktop Only) */}
                    {activeProducts.length > 5 && (
                      <div className="hidden sm:block">
                        <button className="swiper-btn-prev-showcase absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#1c5434] hover:bg-[#1c5434] hover:text-white transition-all duration-300 disabled:opacity-0 pointer-events-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                          </svg>
                        </button>
                        <button className="swiper-btn-next-showcase absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#1c5434] hover:bg-[#1c5434] hover:text-white transition-all duration-300 disabled:opacity-0 pointer-events-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* View All Redirection Button */}
          {isMounted && activeTab && (
            <div className="flex justify-center mt-4 sm:mt-10">
              <Link
                href={getCategoryLink(activeTab)}
                className="group flex items-center justify-center gap-2 px-6 py-2.5 bg-transparent border-2 border-[#1c5434] text-[#1c5434] font-bold text-xs sm:text-base rounded-full hover:bg-[#1c5434] hover:text-white transition-all duration-300 active:scale-95"
              >
                <span>View All {formatCategoryName(activeTab)}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Hide Scrollbar styling */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
