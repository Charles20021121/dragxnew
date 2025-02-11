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

export default function ProductDetail({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [relatedImages, setRelatedImages] = useState([
    { src: product.image, alt: product.name }
  ]);
  const sliderRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // 添加拖拽相關的 state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    async function fetchRelatedImages() {
      try {
        const res = await fetch(`/api/products?category=${product.categories}`);
        const products = await res.json();
        
        // 找到所有相同 same 值的產品圖片
        const sameProducts = products.filter(p => 
          p.same === product.same && p.id !== product.id
        );

        // 設置所有圖片（主圖 + 相關圖片）
        const allImages = [
          { src: product.image, alt: product.name },
          ...sameProducts.map(p => ({
            src: p.image,
            alt: p.name || `Related product image ${p.id}`
          }))
        ];

        setRelatedImages(allImages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching related images:', error);
        setLoading(false);
      }
    }

    fetchRelatedImages();
  }, [product]);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 300;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // 修改拖拽相關的處理函數
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.type === 'mousedown' ? e.pageX : e.touches[0].pageX);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
    const walk = (x - startX); // 減小滾動速度
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // 滑動處理函數
  const handleDragStart = (e) => {
    setIsDragging(true);
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    setStartX(pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX;
    const x = pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX);
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="">
      <div className="bg-[#f8f4ec] px-[5%]">
        {/* Breadcrumb */}
        <nav className="py-2">
          <ol className="flex items-center gap-2 text-xs">
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
            <li>
              <Link
                href={`/products/${product.categories}`}
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
          </h1>
          <a
            href={product.buy}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#88bc04] text-white font-bold px-20 py-2 rounded-full hover:bg-[#7aa703] transition-colors duration-300"
          >
            Shop Now
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
                        className={`relative aspect-square transition-all duration-300 ${
                          currentImageIndex === index
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
                  <div className="flex gap-2 mt-4">
                    {relatedImages.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setSelectedImage(image.src);
                        }}
                        className={`relative aspect-square w-1/4 ${
                          currentImageIndex === index
                            ? 'border-2 border-[#1c5434]'
                            : 'border border-gray-200'
                        }`}
                      >
                        <CldImage
                          src={image.src}
                          alt={image.alt || `Product thumbnail ${index + 1}`}
                          fill
                          className="object-contain p-1"
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
                    
                    {/* Specifications */}
                    <div className="space-y-2">
                      <div className="prose max-w-none text-[clamp(12px,3.5vw,16px)] whitespace-pre-line" 
                        dangerouslySetInnerHTML={{ __html: product.specifications }} 
                      />
                    </div>

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
                {/* Specifications Section */}
                <div>
                  <div className="prose max-w-none whitespace-pre-line" 
                    dangerouslySetInnerHTML={{ __html: product.specifications }} 
                  />
                </div>

                {/* Description Section */}
                <div>
                  <div className="prose max-w-none whitespace-pre-line" 
                    dangerouslySetInnerHTML={{ __html: product.description }} 
                  />
                </div>
              </div>
            </div>
            {/* Divider Line */}
            <div className="w-full h-[1px] bg-gray-200 my-8" />

            {/* Bottom Extra Images */}
            <div className="mt-8 w-full ">
              {/* Bottom Extra Images - Mobile */}
              <div className="mt-8 block md:hidden">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={8}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  className="mySwiper"
                  centeredSlides={true}
                >
                  {relatedImages.slice(4).map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative aspect-square w-full">
                        <CldImage
                          src={image.src}
                          alt={image.alt || "Related product image"}
                          fill
                          className="object-contain bg-white rounded-lg"
                          sizes="100vw"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
              {/* Desktop View */}
              <div className="hidden md:block">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={8}
                  slidesPerView={3}
                  navigation
                  pagination={{ clickable: true }}
                  className="mySwiper"
                >
                  {relatedImages.slice(4).map((image, index) => (
                    <SwiperSlide key={index}>
                      <button
                        onClick={() => {
                          setCurrentImageIndex(index + 4);
                          setSelectedImage(image.src);
                        }}
                        className="w-full relative aspect-square hover:opacity-90 transition-opacity"
                      >
                        <CldImage
                          src={image.src}
                          alt={image.alt || "Related product image"}
                          fill
                          className="object-contain bg-white rounded-lg p-1"
                          sizes="(max-width: 768px) 100vw, 25vw"
                        />
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>


            </div>
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
          </div>
          <div className="w-2/5">
            <a
              href={product.buy}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#88bc04] text-white text-sm font-bold px-5 py-1.5 rounded-full text-center hover:bg-[#7aa703] transition-colors duration-300"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 