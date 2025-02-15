"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";
import CldImage from 'next/image';

// 添加自定義樣式
const swiperStyles = {
  '.swiper-pagination-bullet': {
    backgroundColor: 'white',
  },
  '.swiper-pagination-bullet-active': {
    backgroundColor: '#88bc04',
  }
};

export default function HeroSection({ image, mobileImage, aspectRatio, mobileAspectRatio }) {
  return (
    <div className="w-full">
      {/* 桌面版圖片 */}
      <div 
        className="hidden md:block relative w-full"
        style={{ aspectRatio }}
      >
        <CldImage
          src={image}
          alt="Hero Image"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* 手機版圖片 */}
      <div 
        className="block md:hidden relative w-full"
        style={{ aspectRatio: mobileAspectRatio || aspectRatio }}
      >
        <CldImage
          src={mobileImage || image}
          alt="Hero Image"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
} 