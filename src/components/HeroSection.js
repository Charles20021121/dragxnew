"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";

// 添加自定義樣式
const swiperStyles = {
  '.swiper-pagination-bullet': {
    backgroundColor: 'white',
  },
  '.swiper-pagination-bullet-active': {
    backgroundColor: '#88bc04',
  }
};

export default function HeroSection({ image, aspectRatio = "3333/1458" }) {
  return (
    <section className="relative z-0">
      <style jsx global>{`
        .swiper {
          width: 100%;
          height: 100%;
        }
        .swiper-pagination-bullet {
          background: white;
        }
        .swiper-pagination-bullet-active {
          background: #88bc04;
        }
      `}</style>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 1.2,
            ease: "easeOut"
          }}
        >
          <Swiper
            speed={800}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
            pagination={{
              dynamicBullets: true,
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <motion.div 
                className="relative w-full"
                style={{ aspectRatio }}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 1.5,
                  ease: "easeOut"
                }}
              >
                <Image
                  src={image || 'https://res.cloudinary.com/dmkxx68km/image/upload/v1725450335/epz5butosofn5h6jxvqu.webp'}
                  alt='Hero Image'
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </SwiperSlide>
          </Swiper>
        </motion.div>
      </AnimatePresence>
    </section>
  );
} 