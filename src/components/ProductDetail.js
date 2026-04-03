"use client"
import Image from 'next/image';
import Link from 'next/link';
import { Suspense, useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import LoadingSpinner from './LoadingSpinner';
import { PIXEL_IDS } from '@/components/MetaPixel';
import { useProduct } from '@/contexts/ProductContext';
import ProductCard from './ProductCard';
import { motion, Reorder } from 'framer-motion';

export default function ProductDetail({ product, isAdmin, onEdit, onDeleteImage, onReorderImages }) {
  const { setCurrentProduct } = useProduct();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [relatedImages, setRelatedImages] = useState([
    { src: product.image, alt: product.name }
  ]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  console.log(relatedImages)
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // 添加拖拽相關的 state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 在文件頂部添加 useState
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [tempImages, setTempImages] = useState([]);

  // 设置当前产品信息给 WhatsApp 按钮使用
  useEffect(() => {
    if (product) {
      setCurrentProduct({
        name: product.name,
        image: product.image,
        url: window.location.href,
        category: product.categories,
        filter1: product.filter1,  // 添加 filter1 字段
        android_series: product.android_series  // 添加 android_series 字段
      });
    }

    // 清理函数：离开页面时清除产品信息
    return () => {
      setCurrentProduct(null);
    };
  }, [product, setCurrentProduct]);

  useEffect(() => {
    async function fetchRelatedImages() {
      try {
        // 獲取所有產品以支持跨類別推薦
        const res = await fetch(`/api/products`);
        const products = await res.json();

        // 1. 獲取本產品的相關圖片（同一 same 組）
        const sameProducts = products.filter(p =>
          p.same === product.same
        );

        // 主圖永遠排在第一位，副圖按日期排序
        const sortedProducts = sameProducts.sort((a, b) => {
          if (a.id == a.same && b.id != b.same) return -1;
          if (b.id == b.same && a.id != a.same) return 1;
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });

        const allImages = sortedProducts.map(p => ({
          src: p.image,
          alt: p.name || `Product image ${p.id}`,
          publicId: p.publicId,
          id: p.id,
          same: p.same
        }));

        setRelatedImages(allImages);
        if (allImages.length > 0) {
          setSelectedImage(allImages[0].src);
          setCurrentImageIndex(0);
        }

        // 2. 獲取推薦產品：主圖（id == same）、不包含目前產品所在的 same 組
        const allPotentialRecs = products
          .filter(p => p.id == p.same && p.same !== product.same)
          .map(p => ({
            ...p,
            slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          }));

        let recommendations = [];

        if (product.categories === 'androidplayer') {
          // Android Player 的智能推薦邏輯
          const sameSeries = allPotentialRecs.filter(p =>
            p.categories === 'androidplayer' &&
            p.filter1 === product.filter1 &&
            p.android_series === product.android_series
          );

          const sameType = allPotentialRecs.filter(p =>
            p.categories === 'androidplayer' &&
            p.filter1 === product.filter1 &&
            p.android_series !== product.android_series
          );

          const sameCategory = allPotentialRecs.filter(p =>
            p.categories === 'androidplayer' &&
            p.filter1 !== product.filter1
          );

          const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());
          recommendations = [
            ...shuffle(sameSeries),
            ...shuffle(sameType),
            ...shuffle(sameCategory),
            ...shuffle(allPotentialRecs.filter(p => p.categories !== 'androidplayer')) // 最後用其他分類補充
          ];
        } else if (product.categories === 'contidecoder') {
          // Conti Decoder 的智能推薦邏輯
          const sameType = allPotentialRecs.filter(p => 
            p.categories === 'contidecoder' && 
            p.filter1 === product.filter1
          );

          const sameCategory = allPotentialRecs.filter(p => 
            p.categories === 'contidecoder' && 
            p.filter1 !== product.filter1
          );

          const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());
          recommendations = [
            ...shuffle(sameType),
            ...shuffle(sameCategory),
            ...shuffle(allPotentialRecs.filter(p => p.categories !== 'contidecoder')) // 最後用其他分類補充
          ];
        } else {
          // 其他產品：優先推薦同分類產品，不足時用全站隨機產品補充
          const sameCategory = allPotentialRecs.filter(p => p.categories === product.categories);
          const others = allPotentialRecs.filter(p => p.categories !== product.categories);
          
          const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());
          recommendations = [
            ...shuffle(sameCategory),
            ...shuffle(others)
          ];
        }

        setRecommendedProducts(recommendations.slice(0, 5));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching images and recommendations:', error);
        setLoading(false);
      }
    }

    fetchRelatedImages();
  }, [product]);

  const handleSaveReorder = () => {
    if (onReorderImages) {
      onReorderImages(tempImages);
      setShowReorderModal(false);
    }
  };

  // 添加購買事件追蹤函數
  const handleShopNowClick = (e) => {
    e.preventDefault();
    const shopUrl = product.buy;

    if (window.fbq) {
      try {
        // 對每個 Pixel ID 發送事件
        PIXEL_IDS.forEach(pixelId => {
          window.fbq('trackSingle', pixelId, 'InitiateCheckout', {
            content_type: 'product',
            content_name: product.name,
            content_category: product.categories,
            content_ids: [product.Id],
            value: product.price || 0,
            currency: 'MYR'
          });
        });
        console.log('Purchase event tracked successfully');
      } catch (error) {
        console.error('Error tracking purchase event:', error);
      }
    }

    // 延遲跳轉確保事件被發送
    setTimeout(() => {
      window.open(shopUrl, '_blank');
    }, 300);
  };

  // 使用与右下角 WhatsApp 按钮相同的消息与 URL 生成逻辑
  const getWhatsAppUrlForProduct = () => {
    const isMobileDevice = () => {
      if (typeof window === 'undefined') return false;
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    const getProductCategory = () => {
      if (!product) return '';

      if (product.isLyno) return 'LYNO';
      if (product.isDX360) return 'DX360';
      if (product.isPowerBoot) return 'POWER BOOT';
      if (product.isSoundproof) {
        const soundproofMap = {
          'hatchback': 'SOUNDPROOF - HATCHBACK',
          'sedan': 'SOUNDPROOF - SEDAN',
          'suv': 'SOUNDPROOF - SUV',
          'mpv': 'SOUNDPROOF - MPV'
        };
        return soundproofMap[product.filter1] || 'SOUNDPROOF';
      }

      if (product.filter1 === 'androidPlayer') {
        return 'ANDROID PLAYER';
      } else if (product.filter1 === 'contiAndroid') {
        return 'ANDROID SCREEN';
      }

      return '';
    };

    const getAndroidSeries = () => {
      if (!product || !product.android_series) return '';
      const seriesMap = {
        'Advance_series': 'Advance Series',
        'Android_Ai_Box': 'Android Ai Box',
        'Cyber_series': 'Cyber Series',
        'Diamond_series': 'Diamond Series',
        'Exclusive_series': 'Exclusive Series',
        'Luxury_series': 'Luxury Series',
        'Performance_series': 'Performance Series',
        'Signature_40': '40 Series',
        'TRONMMEXT_EI_series': 'TRONMMEXT EI Series',
        'TRONMMEXT_ES_series': 'TRONMMEXT ES Series',
        'Ultra_series': 'Ultra Series',
        'Others': 'Others'
      };
      return seriesMap[product.android_series] || product.android_series;
    };

    try {
      const phoneNumber = '60192776056';
      const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
      const productUrl = typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : '';

      // 构建消息（与 WhatsAppButton 中一致）
      let message = `Hi Dragx, I'm interested in this product:%0A%0A*${encodeURIComponent(product.name)}*`;

      const category = getProductCategory();
      if (category) {
        message += `%0A%0ACategory: ${encodeURIComponent(category)}`;
      }

      const series = getAndroidSeries();
      if (series) {
        message += `%0ASeries: ${encodeURIComponent(series)}`;
      }

      message += `%0A%0AProduct Link: ${encodeURIComponent(productUrl)}%0A%0ACan you provide more information?`;

      if (isMobileDevice()) {
        return `https://wa.me/${phoneNumber}?text=${message}`;
      } else {
        return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
      }
    } catch (err) {
      return 'https://wa.me/60192776056';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-[#f8f4ec] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 添加編輯按鈕 */}
        {isAdmin && (
          <div className="fixed bottom-8 right-8 z-50">
            <button
              onClick={onEdit}
              className="bg-[#1c5434] hover:bg-[#143a25] text-white p-4 rounded-full shadow-lg flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="py-4">
          <ol className="flex items-center gap-2 text-xs">
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
            <li>
              <Link
                href={isAdmin ? `/admin/products/${product.categories}` : `/products/${product.categories}`}
                className="text-black hover:text-[#1c5434] capitalize"
              >
                {product.categories}
              </Link>
            </li>
            <span>/</span>
            <li className="text-black capitalize truncate">
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Product Title & Shop Now Button - Desktop */}
        <div className="hidden md:flex justify-between items-center py-4">
          <h1 className="text-[clamp(12.5px,2vw,25px)] font-bold capitalize w-4/5">
            {product.name}
            {product.price && (
              <span className="block text-black text-lg mt-1">
                RM {product.price}
              </span>
            )}
          </h1>
          <a
            href={getWhatsAppUrlForProduct()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#88bc04] text-white font-bold px-20 py-2 rounded-full hover:bg-[#7aa703] transition-colors duration-300 whitespace-nowrap"
          >
            LEARN MORE
          </a>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-t-3xl">
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Product Images */}
              <div className="space-y-4">
                {/* Desktop Layout */}
                <div className="hidden md:flex gap-4">
                  {/* Main Image */}
                  <div className="relative aspect-square w-4/5">
                    <Image
                      src={selectedImage}
                      alt={relatedImages[currentImageIndex]?.alt || "Product image"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>

                  {/* Side Thumbnail Images */}
                  <div className="w-1/5 flex flex-col gap-2">
                    {relatedImages.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setSelectedImage(image.src);
                        }}
                        className={`relative aspect-square transition-all duration-300 ${currentImageIndex === index
                          ? 'border-2 border-[#1c5434]'
                          : 'border border-gray-200 hover:border-[#1c5434]'
                          }`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt || `Product thumbnail ${index + 1}`}
                          fill
                          className="object-contain p-1"
                          sizes="(max-width: 768px) 25vw, 10vw"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden">
                  {/* Main Image */}
                  <div className="relative aspect-square w-full">
                    <Image
                      src={selectedImage}
                      alt={relatedImages[currentImageIndex]?.alt || "Product image"}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </div>

                  {/* Bottom Thumbnails */}
                  <div className="grid grid-cols-4 gap-1 mt-4 w-full">
                    {relatedImages.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setSelectedImage(image.src);
                        }}
                        className={`relative w-full aspect-square ${currentImageIndex === index
                          ? 'border-2 border-[#1c5434]'
                          : 'border border-gray-200'
                          }`}
                      >
                        <Image
                          src={image.src}
                          alt={image.alt || `Product thumbnail ${index + 1}`}
                          fill
                          className="object-cover p-1"
                          sizes="25vw"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Product Info - Mobile */}
                  <div className="mt-6 space-y-4">
                    <h1 className="text-[clamp(16px,5vw,24px)] font-bold">
                      {product.name}
                    </h1>
                    {product.price && (
                      <p className="text-black font-bold text-lg">
                        RM {product.price}
                      </p>
                    )}

                    {/* Description */}
                    <div className="space-y-2">
                      <div className="prose max-w-none text-[clamp(12px,3.5vw,16px)] whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Product Info */}
              <div className="space-y-8 hidden md:block">
                {/* Description Section */}
                <div>
                  <div className="prose max-w-none whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              </div>
            </div>
            {/* Bottom Extra Images */}
            {relatedImages.length > 0 && (
              <div className="mt-8 w-full">
                {/* Mobile View - Single Column */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {relatedImages.map((image, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={image.src}
                        alt={image.alt || "Product image"}
                        fill
                        className="object-cover rounded"
                        sizes="160px"
                      />
                    </div>
                  ))}
                </div>

                {/* Desktop View - 2 Columns Grid */}
                <div className="hidden md:grid grid-cols-2 gap-4">
                  {relatedImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setSelectedImage(image.src);
                      }}
                      className="relative aspect-square hover:opacity-90 transition-opacity"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt || "Related product image"}
                        fill
                        className="object-contain bg-white rounded-lg p-1"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#f8f4ec] shadow-[0_5px_15px_rgba(0,0,0,1)] px-[5%] py-3 z-10">
        <div className="flex justify-between items-center">
          <div className="w-3/5">
            <h2 className="text-[clamp(10px,2vw,20px)] font-bold capitalize">
              {product.name}
            </h2>
            <p className="text-xs">{product.specifications}</p>
            {product.price && (
              <p className="text-black font-bold text-sm mt-1">
                RM {product.price}
              </p>
            )}
          </div>
          <div className="w-2/5">
            <a
              href={getWhatsAppUrlForProduct()}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#88bc04] text-white text-sm font-bold px-5 py-1.5 rounded-full text-center hover:bg-[#7aa703] transition-colors duration-300"
            >
              LEARN MORE
            </a>
          </div>
        </div>
      </div>

      {/* 產品詳情 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ... 其他詳情保持不變 ... */}

        {/* 只在特定類別顯示 filter 和 filter1 */}

      </div>

      {/* 管理員懸浮按鈕組 */}
      {isAdmin && (
        <div className="fixed right-8 flex flex-col gap-4 z-50" style={{ bottom: '180px' }}>
          {/* 刪除按鈕 */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300"
            title="Delete Images"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* 排序按鈕 */}
          <button
            onClick={() => {
              setTempImages(relatedImages);
              setShowReorderModal(true);
            }}
            className="p-4 bg-[#1c5434] text-white rounded-full shadow-lg hover:bg-[#143a25] transition-colors duration-300"
            title="Reorder Images"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>
      )}

      {/* 刪除圖片模態框 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 bg-[#1c5434] text-white flex justify-between items-center">
              <h3 className="text-lg font-semibold">Delete Images</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {relatedImages.slice(1).map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                      <Image
                        src={image.src}
                        alt={image.alt || `Product image ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                    {relatedImages.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this image?')) {
                            onDeleteImage(image.id, image.same, image.publicId);
                            if (relatedImages.length <= 2) setShowDeleteModal(false);
                          }
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 排序圖片模態框 */}
      {showReorderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 bg-[#1c5434] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <h3 className="text-lg font-semibold">Change Image Order</h3>
              </div>
              <button onClick={() => setShowReorderModal(false)} className="hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-sm text-gray-500 mb-4">
                Drag and drop images to change their order. The first image will be the <strong>Main Image</strong>.
              </p>
              
              <Reorder.Group axis="y" values={tempImages} onReorder={setTempImages} className="space-y-3">
                {tempImages.map((image) => (
                  <Reorder.Item 
                    key={image.id} 
                    value={image}
                    className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-[#1c5434] transition-colors"
                  >
                    <div className="flex-shrink-0 cursor-move text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </div>
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-100">
                      <Image
                        src={image.src}
                        alt="Thumbnail"
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 truncate">
                      <span className="text-sm font-medium text-gray-700">
                        {image.id === image.same ? "Main Product Image" : `Additional Image (ID: ${image.id})`}
                      </span>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowReorderModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveReorder()}
                className="px-8 py-2 bg-[#1c5434] text-white rounded-full hover:bg-[#143a25] transition-colors shadow-md flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save New Order
              </button>
            </div>
          </div>
        </div>
      )}

      <script dangerouslySetInnerHTML={{
        __html: `
          window.handleSaveReorder = function() {
            // This is a helper for the component
          }
        `
      }} />


      {/* Recommendations Section */}
      {recommendedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[#1c5434] text-xl md:text-2xl font-bold tracking-wider uppercase">
              YOU MAY ALSO LIKE
            </h2>
            <div className="flex-1 h-[1px] bg-gray-300 ml-6"></div>
          </div>
          
          <div className="relative group">
            <Swiper
              modules={[Navigation]}
              spaceBetween={16}
              navigation={{
                nextEl: '.swiper-button-next-recommendations',
                prevEl: '.swiper-button-prev-recommendations',
              }}
              breakpoints={{
                320: {
                  slidesPerView: 2.2,
                  spaceBetween: 12,
                },
                640: {
                  slidesPerView: 3.5,
                  spaceBetween: 16,
                },
                1024: {
                  slidesPerView: 5,
                  spaceBetween: 20,
                },
              }}
            >
              {recommendedProducts.map((rec) => (
                <SwiperSlide key={rec.id}>
                  <ProductCard 
                    product={rec} 
                    categoryPath={rec.categories} 
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Navigation Buttons */}
            <div className="swiper-button-prev-recommendations absolute left-[-20px] md:left-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#1c5434] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer hidden sm:flex border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="swiper-button-next-recommendations absolute right-[-20px] md:right-[-40px] top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-[#1c5434] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 cursor-pointer hidden sm:flex border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}