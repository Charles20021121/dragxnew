"use client"
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import 'swiper/css';

const categoryVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function ProductCategory({ name, link, products, index ,isAdmin}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // 格式化類別名稱的函數
  const formatCategoryName = (name) => {
    if (name.toLowerCase() === 'androidplayer') {
      return 'ANDROID PLAYER';
    }
    if (name.toLowerCase() === 'alphardvellfire') {
      return 'ALPHARD/VELLFIRE';
    }
    if (name.toLowerCase() === 'ambientlight') {
      return 'AMBIENT LIGHT';
    }
    if (name.toLowerCase() === '360camera') {
      return 'DX360';
    }
    if (name.toLowerCase() === 'powerboot') {
      return 'POWER BOOT';
    }
    if (name.toLowerCase() === 'contidecoder') {
      return 'CONTI DECODER';
    }
    if (name.toLowerCase() === 'mercedes') {
      return 'MERCEDES-BENZ';
    }
    if (name.toLowerCase() === 'bmw') {
      return 'BMW';
    }
    
    return name.toUpperCase();
  };

  // 過濾出主圖（Id 和 same 相同的產品）
  const mainProducts = products.filter(product => 
    product.Id == product.same
  );

  // 數據已經按日期排序，不需要再次排序
  return (
    <motion.div 
      className="pb-4"
      variants={categoryVariants}
      ref={ref}
    >
      <motion.div 
        className="mx-1 md:mx-2 bg-white rounded-[25px] px-4 py-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        {/* Title with lines */}
        <div className="flex items-center justify-center mb-4">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
          <div className="mx-[2%]">
            <Link 
              href={ name.toLowerCase() === "soundproof" && !isAdmin ? `/silence` : link}
              className="no-underline group"
            >
              <h2 className="text-[#1c5434] font-[900] text-center m-0 text-[clamp(12px,2vw,32px)] relative">
                {formatCategoryName(name)}
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#1c5434] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </h2>
            </Link>
          </div>
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
        </div>

        {/* Products Slider */}
        <Swiper
          speed={1000}
          slidesPerView={3}
          spaceBetween={10}
          breakpoints={{
            768: { slidesPerView: 4, spaceBetween: 10 },
            1024: { slidesPerView: 5, spaceBetween: 12 },
          }}
          modules={[Autoplay]}
          className="mySwiper"
        >
          {mainProducts.map((product, index) => (
            <SwiperSlide key={index}>
              <motion.div 
                className="group"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-50">
                  <Link 
                    href={ product.categories === "soundproof" && !isAdmin ? `/silence` : isAdmin ? `/admin/products/${product.categories}/${product.slug}` : `/products/${product.categories}/${product.slug}`}
                    className="block"
                  >
                    {inView && (
                      <Image
                        width="600"
                        height="600"
                        src={product.Url}
                        sizes="100vw"
                        alt={product.Name}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </div>
                <div className="mt-2 text-center">
                  <h3 className="text-[#1c5434] font-bold text-[clamp(10px,1.5vw,16px)] group-hover:text-[#023f1b] transition-colors duration-300 truncate">
                    {product.Name}
                  </h3>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </motion.div>
  );
} 