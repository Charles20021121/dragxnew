"use client";
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { CldImage } from 'next-cloudinary';

export default function HeroSection({ image, images, mobileImage, aspectRatio, mobileAspectRatio }) {
  // 如果传入了images数组，使用轮播；否则使用单张图片
  const heroImages = images || [image];
  const shouldShowSwiper = heroImages.length > 1;

  if (!shouldShowSwiper) {
    // 单张图片的原有逻辑
    const isLynoBanner = heroImages[0].includes('lynobanner');
    const isGalleryBanner = heroImages[0].includes('gallerybanner');

    const bannerLink = isLynoBanner ? '/lyno' : (isGalleryBanner ? '/gallery' : null);

    return (
      <div className="w-full relative">
        {/* 桌面版圖片 */}
        <div
          className="hidden md:block relative w-full"
          style={{ aspectRatio }}
        >
          {bannerLink ? (
            <Link href={bannerLink} className="block w-full h-full cursor-pointer">
              {heroImages[0].startsWith('http') || heroImages[0].startsWith('/') ? (
                <Image
                  src={heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              ) : (
                <CldImage
                  src={heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              )}
            </Link>
          ) : (
            <>
              {heroImages[0].startsWith('http') || heroImages[0].startsWith('/') ? (
                <Image
                  src={heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              ) : (
                <CldImage
                  src={heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              )}
            </>
          )}
        </div>

        {/* 手機版圖片 */}
        <div
          className="block md:hidden relative w-full"
          style={{ aspectRatio: mobileAspectRatio || aspectRatio }}
        >
          {bannerLink ? (
            <Link href={bannerLink} className="block w-full h-full cursor-pointer">
              {(mobileImage || heroImages[0]).startsWith('http') || (mobileImage || heroImages[0]).startsWith('/') ? (
                <Image
                  src={mobileImage || heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              ) : (
                <CldImage
                  src={mobileImage || heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              )}
            </Link>
          ) : (
            <>
              {(mobileImage || heroImages[0]).startsWith('http') || (mobileImage || heroImages[0]).startsWith('/') ? (
                <Image
                  src={mobileImage || heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              ) : (
                <CldImage
                  src={mobileImage || heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // 多张图片的轮播逻辑
  return (
    <div className="w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="hero-swiper"
      >
        {heroImages.map((imageUrl, index) => {
          const isLynoBanner = imageUrl.includes('lynobanner');
          const isGalleryBanner = imageUrl.includes('gallerybanner');
          const bannerLink = isLynoBanner ? '/lyno' : (isGalleryBanner ? '/gallery' : null);

          return (
            <SwiperSlide key={index}>
              <div className="relative">
                {/* 桌面版圖片 */}
                <div
                  className="hidden md:block relative w-full"
                  style={{ aspectRatio }}
                >
                  {bannerLink ? (
                    <Link href={bannerLink} className="block w-full h-full cursor-pointer">
                      {imageUrl.startsWith('http') || imageUrl.startsWith('/') ? (
                        <Image
                          src={imageUrl}
                          alt={`Hero Image ${index + 1}`}
                          fill
                          className="object-contain"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      ) : (
                        <CldImage
                          src={imageUrl}
                          alt={`Hero Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      )}
                    </Link>
                  ) : (
                    <>
                      {imageUrl.startsWith('http') || imageUrl.startsWith('/') ? (
                        <Image
                          src={imageUrl}
                          alt={`Hero Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      ) : (
                        <CldImage
                          src={imageUrl}
                          alt={`Hero Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* 手機版圖片 */}
                <div
                  className="block md:hidden relative w-full"
                  style={{ aspectRatio: mobileAspectRatio || aspectRatio }}
                >
                  {bannerLink ? (
                    <Link href={bannerLink} className="block w-full h-full cursor-pointer">
                      {imageUrl.startsWith('http') || imageUrl.startsWith('/') ? (
                        <Image
                          src={mobileImage || imageUrl}
                          alt={`Hero Image ${index + 1}`}
                          fill
                          className="object-contain"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      ) : (
                        <CldImage
                          src={mobileImage || imageUrl}
                          alt={`Hero Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      )}
                    </Link>
                  ) : (
                    <>
                      {imageUrl.startsWith('http') || imageUrl.startsWith('/') ? (
                        <Image
                          src={mobileImage || imageUrl}
                          alt={`Hero Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      ) : (
                        <CldImage
                          src={mobileImage || imageUrl}
                          alt={`Hero Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style jsx global>{`
        .hero-swiper .swiper-pagination {
          bottom: 16% !important;
        }
      `}</style>
    </div>
  );
}