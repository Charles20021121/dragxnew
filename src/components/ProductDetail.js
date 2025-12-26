"use client"
import { CldImage } from 'next-cloudinary';
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

export default function ProductDetail({ product, isAdmin, onEdit, onDeleteImage }) {
  const { setCurrentProduct } = useProduct();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [relatedImages, setRelatedImages] = useState([
    { src: product.image, alt: product.name }
  ]);

  console.log(relatedImages)
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // 添加拖拽相關的 state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 在文件頂部添加 useState
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        const res = await fetch(`/api/products?category=${product.categories}`);
        const products = await res.json();

        // 找到所有相同 same 值的產品圖片
        const sameProducts = products.filter(p =>
          p.same === product.same
        );

        // 主圖永遠排在第一位，副圖按日期排序
        const sortedProducts = sameProducts.sort((a, b) => {
          // 如果 a 是主圖，排在前面
          if (a.id == a.same && b.id != b.same) return -1;
          // 如果 b 是主圖，排在前面
          if (b.id == b.same && a.id != a.same) return 1;
          // 如果都是主圖或都是副圖，按日期排序
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });

        console.log(sortedProducts)

        // 設置所有圖片
        const allImages = sortedProducts.map(p => ({
          src: p.image,
          alt: p.name || `Product image ${p.id}`,
          publicId: p.publicId,
          id: p.id,
          same: p.same
        }));
        console.log('all', allImages)
        console.log('related', relatedImages)

        setRelatedImages(allImages);
        // 設置第一張圖片（主圖）為默認顯示
        if (allImages.length > 0) {
          setSelectedImage(allImages[0].src);
          setCurrentImageIndex(0);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching related images:', error);
        setLoading(false);
      }
    }

    fetchRelatedImages();
  }, [product]);

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
        'Signature_40': 'Signature 40',
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
                    <CldImage
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
                        <CldImage
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
                    <CldImage
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
                        <CldImage
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
            {/* Divider Line */}
            {relatedImages.length > 4 && <div className="w-full h-[1px] bg-gray-200 my-8" />}

            {/* Bottom Extra Images */}
            {relatedImages.length > 4 && (
              <div className="mt-8 w-full">
                {/* Mobile View - Single Column */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {relatedImages.slice(4).map((image, index) => (
                    <div key={index} className="relative aspect-square w-full">
                      <CldImage
                        src={image.src}
                        alt={image.alt || "Related product image"}
                        fill
                        className="object-contain bg-white rounded-lg"
                        sizes="100vw"
                      />
                    </div>
                  ))}
                </div>

                {/* Desktop View - 2 Columns Grid */}
                <div className="hidden md:grid grid-cols-2 gap-4">
                  {relatedImages.slice(4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index + 4);
                        setSelectedImage(image.src);
                      }}
                      className="relative aspect-square hover:opacity-90 transition-opacity"
                    >
                      <CldImage
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

      {/* 管理員懸浮刪除按鈕 */}
      {isAdmin && (
        <button
          onClick={() => setShowDeleteModal(true)}
          className="fixed fixed  right-8 p-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300 z-50"
          title="Delete Images"
          style={{ bottom: '180px' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
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

            <div className="p-6 overflow-y-auto max-h-[70vh]"> {/* 限制高度并启用滚动 */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {relatedImages.slice(1).map((image, index) => (
                  <div key={index} className="relative group">
                    {image.Id}
                    <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                      <CldImage
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
                            onDeleteImage(
                              image.id,          // 数据库中的 ID
                              image.same,        // same 值（如果需要）
                              image.publicId     // Cloudinary 的 public ID
                            );
                            if (relatedImages.length <= 2) {
                              setShowDeleteModal(false);
                            }
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

    </div>
  );
}