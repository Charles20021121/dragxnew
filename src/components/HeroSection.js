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
import { Button } from "@/components/ui/button";

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
                  unoptimized
                  src={heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              ) : (
                <Image
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
                  unoptimized
                  src={heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              ) : (
                <Image
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
                  unoptimized
                  src={mobileImage || heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              ) : (
                <Image
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
                  unoptimized
                  src={mobileImage || heroImages[0]}
                  alt="Hero Image"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              ) : (
                <Image
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
          delay: 3000,
          disableOnInteraction: false,
        }}
        className="hero-swiper"
      >
        {heroImages.map((imageUrl, index) => {
          const isFirstBanner = imageUrl.includes('1.webp');
          const isLynoBanner = imageUrl.includes('lynobanner') || imageUrl.includes('2.jpg');
          const isGalleryBanner = imageUrl.includes('gallerybanner') || imageUrl.includes('3.webp');
          const isSpecialistBanner = imageUrl.includes('/specialist/') || imageUrl.includes('/hero banner/');

          // Determine banner link based on image type
          let bannerLink = null;
          if (isLynoBanner) {
            bannerLink = '/lyno';
          } else if (isGalleryBanner) {
            bannerLink = '/gallery';
          } else if (isSpecialistBanner) {
            if (imageUrl.includes('bmw')) {
              bannerLink = '/gallery/bmw';
            } else if (imageUrl.includes('alphard')) {
              bannerLink = '/gallery/alphard-vellfire';
            } else if (imageUrl.includes('merc')) {
              bannerLink = '/gallery/mercedes-benz';
            }
          }

          let logoUrl = null;
          let specialistSubtitle = '';
          if (isSpecialistBanner) {
            if (imageUrl.includes('bmw')) {
              logoUrl = '/hero banner/5. DX BMW logo/All logo PNG-07.png';
            } else if (imageUrl.includes('alphard')) {
              logoUrl = '/hero banner/4. DX Alphard Vellfire logo/All logo PNG-03.png';
            } else if (imageUrl.includes('merc')) {
              logoUrl = '/hero banner/6. DX Mercedes logo/All logo PNG-08.png';
            }
          }

          return (
            <SwiperSlide key={index}>
              <div className="relative">
                {/* 桌面版圖片 */}
                <div
                  className="hidden md:block relative w-full"
                  style={{ aspectRatio }}
                >
                  {bannerLink || isSpecialistBanner ? (
                    bannerLink && !isLynoBanner && !isGalleryBanner && !isSpecialistBanner ? (
                      <Link href={bannerLink} className="block w-full h-full cursor-pointer">
                        {imageUrl.startsWith('http') || imageUrl.startsWith('/') ? (
                          <Image
                            unoptimized
                            src={imageUrl}
                            alt={`Hero Image ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority={index === 0}
                          />
                        ) : (
                          <Image
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
                            unoptimized
                            src={imageUrl}
                            alt={`Hero Image ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority={index === 0}
                          />
                        ) : (
                          <Image
                            src={imageUrl}
                            alt={`Hero Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority={index === 0}
                          />
                        )}
                      </>
                    )
                  ) : (
                    <>
                      {imageUrl.startsWith('http') || imageUrl.startsWith('/') ? (
                        <Image
                          unoptimized
                          src={imageUrl}
                          alt={`Hero Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      ) : (
                        <Image
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

                  {/* First Banner Text Overlay (Desktop) */}
                  {isFirstBanner && (
                    <div className="absolute inset-0 flex items-center justify-end pr-[5%] lg:pr-[8%] z-20 pointer-events-none">
                      <div className="w-[50%] lg:w-[45%] flex flex-col items-center text-center">
                        <h1
                          className="text-white font-black uppercase mb-2 lg:mb-3 whitespace-nowrap"
                          style={{
                            fontFamily: 'Geometos, sans-serif',
                            fontSize: '2.45vw',
                            lineHeight: '1.2',
                            transform: 'skewX(-6deg)',
                            textShadow: '1px 1px 0px #000, 2px 2px 0px #000, 3px 3px 0px #000, 4px 4px 0px #000, 5px 5px 0px #000, 6px 6px 0px #000, 8px 8px 15px rgba(0,0,0,0.6)'
                          }}
                        >
                          FINEST <span className="text-[#80bc03]">MASTERPIECE</span> CUSTOMIZER
                        </h1>
                        <p
                          className="text-white font-medium"
                          style={{
                            fontFamily: 'Gotham-Book, Gotham, sans-serif',
                            fontSize: '1.85vw',
                            lineHeight: '1.4',
                            textShadow: '1px 1px 0px #000, 2px 2px 0px #000, 3px 3px 0px #000, 4px 4px 0px #000, 6px 6px 12px rgba(0,0,0,0.6)'
                          }}
                        >
                          A car is already a masterpiece and we are the<br />
                          customizer that customizes the car to its<br />
                          owner's needs. With the finest touch from our<br />
                          team, we link the soul of the car with the owner.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* LYNO Banner Text Overlay (Desktop) */}
                  {isLynoBanner && (
                    <div className="absolute inset-0 flex items-center justify-start pl-[5%] lg:pl-[8%] z-20 pointer-events-none">
                      <div className="w-[50%] lg:w-[45%] flex flex-col items-start text-left">
                        <h1
                          className="font-bold uppercase mb-0"
                          style={{
                            fontFamily: 'Geometos, sans-serif',
                            fontSize: '7vw',
                            lineHeight: '1.1',
                            transform: 'scaleX(1.7) skewX(-15deg)',
                            transformOrigin: 'left center',
                            background: 'linear-gradient(135deg, #7b7b7b 0%, #d4d4d4 40%, #888 65%, #5a5a5a 100%)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                          }}
                        >
                          LYNO
                        </h1>
                        <p
                          className="font-medium text-[#444] mb-6 lg:mb-8 drop-shadow-sm"
                          style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.8vw', letterSpacing: '0.05em' }}
                        >
                          Light Your New Omni-System
                        </p>
                        <Link
                          href={bannerLink || '#'}
                          className="px-6 py-2 lg:px-8 lg:py-3 rounded text-white shadow-lg font-medium tracking-wide inline-block pointer-events-auto cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ background: 'linear-gradient(to right, #888, #aaa)', fontSize: '1.2vw' }}
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* GALLERY Banner Text Overlay (Desktop) */}
                  {isGalleryBanner && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <div className="flex flex-col items-center text-center">
                        <h1
                          className="text-white font-black uppercase mb-4"
                          style={{
                            fontFamily: 'Geometos, sans-serif',
                            fontSize: '3.4vw',
                            lineHeight: '1.2',
                            transform: 'skewX(-10deg)',
                            textShadow: '1px 1px 0px #000, 2px 2px 0px #000, 3px 3px 0px #000, 4px 4px 0px #000, 5px 5px 0px #000, 6px 6px 0px #000, 8px 8px 15px rgba(0,0,0,0.6)'
                          }}
                        >
                          UPGRADE YOUR RIDE<br />ELEVATE YOUR JOURNEY!
                        </h1>
                        <Link
                          href={bannerLink || '#'}
                          className="px-8 py-3 bg-white text-black rounded-xl shadow-lg font-medium tracking-wide inline-block pointer-events-auto cursor-pointer hover:bg-gray-100 transition-colors"
                          style={{ fontSize: '1.2vw' }}
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* SPECIALIST Banner Text Overlay (Desktop) */}
                  {isSpecialistBanner && logoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                      <div className="flex flex-col items-center justify-center text-center mt-[2%]">
                        <div className="relative w-[40vw] h-[9.5vw] mb-4">
                          <Image src={logoUrl} alt="Specialist Logo" fill className="object-contain" />
                        </div>
                        {specialistSubtitle && (
                          <p
                            className="text-white font-medium mb-8 uppercase tracking-widest drop-shadow-md"
                            style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.1vw' }}
                          >
                            {specialistSubtitle}
                          </p>
                        )}
                        <Link
                          href={bannerLink || '#'}
                          className="px-10 py-2 bg-white text-black rounded-xl shadow-lg font-medium tracking-wide inline-block pointer-events-auto cursor-pointer hover:bg-gray-100 transition-colors"
                          style={{ fontSize: '1.4vw' }}
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* 手機版圖片 */}
                <div
                  className="block md:hidden relative w-full"
                  style={{ aspectRatio: mobileAspectRatio || aspectRatio }}
                >
                  {bannerLink || isSpecialistBanner ? (
                    bannerLink && !isLynoBanner && !isGalleryBanner && !isSpecialistBanner ? (
                      <Link href={bannerLink} className="block w-full h-full cursor-pointer">
                        {imageUrl.startsWith('http') || imageUrl.startsWith('/') ? (
                          <Image
                            unoptimized
                            src={mobileImage || imageUrl}
                            alt={`Hero Image ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority={index === 0}
                          />
                        ) : (
                          <Image
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
                            unoptimized
                            src={mobileImage || imageUrl}
                            alt={`Hero Image ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority={index === 0}
                          />
                        ) : (
                          <Image
                            src={mobileImage || imageUrl}
                            alt={`Hero Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="100vw"
                            priority={index === 0}
                          />
                        )}
                      </>
                    )
                  ) : (
                    <>
                      {imageUrl.startsWith('http') || imageUrl.startsWith('/') ? (
                        <Image
                          unoptimized
                          src={mobileImage || imageUrl}
                          alt={`Hero Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      ) : (
                        <Image
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

                  {/* First Banner Text Overlay (Mobile) */}
                  {isFirstBanner && (
                    <div className="absolute inset-0 flex items-center justify-end pr-[5%] z-20 pointer-events-none">
                      <div className="w-[50%] flex flex-col items-center text-center">
                        <h1
                          className="text-white font-black uppercase mb-1 whitespace-nowrap"
                          style={{
                            fontFamily: 'Geometos, sans-serif',
                            fontSize: '2.45vw',
                            transform: 'skewX(-6deg)',
                            textShadow: '0.5px 0.5px 0px #000, 1px 1px 0px #000, 1.5px 1.5px 0px #000, 2px 2px 5px rgba(0,0,0,0.6)'
                          }}
                        >
                          FINEST <span className="text-[#80bc03]">MASTERPIECE</span> CUSTOMIZER
                        </h1>
                        <p
                          className="text-white text-center font-medium"
                          style={{
                            fontFamily: 'Gotham-Book, Gotham, sans-serif',
                            fontSize: '2vw',
                            lineHeight: '1.3',
                            textShadow: '0.5px 0.5px 0px #000, 1px 1px 3px rgba(0,0,0,0.6)'
                          }}
                        >
                          A car is already a masterpiece and we are the customizer that customizes the car to its owner's needs. With the finest touch from our team, we link the soul of the car with the owner.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* LYNO Banner Text Overlay (Mobile) */}
                  {isLynoBanner && (
                    <div className="absolute inset-0 flex items-center justify-start pl-[5%] z-20 pointer-events-none">
                      <div className="w-[50%] flex flex-col items-start text-left">
                        <h1
                          className="font-bold uppercase mb-0"
                          style={{
                            fontFamily: 'Geometos, sans-serif',
                            fontSize: '7vw',
                            lineHeight: '1.1',
                            transform: 'scaleX(1.7) skewX(-15deg)',
                            transformOrigin: 'left center',
                            background: 'linear-gradient(135deg, #7b7b7b 0%, #d4d4d4 40%, #888 65%, #5a5a5a 100%)',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent'
                          }}
                        >
                          LYNO
                        </h1>
                        <p
                          className="font-medium text-[#444] mb-6 drop-shadow-sm"
                          style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.8vw', letterSpacing: '0.05em' }}
                        >
                          Light Your New Omni-System
                        </p>
                        <Link
                          href={bannerLink || '#'}
                          className="px-4 py-1 rounded text-white shadow-lg font-medium tracking-wide inline-block pointer-events-auto cursor-pointer active:opacity-90 transition-opacity"
                          style={{ background: 'linear-gradient(to right, #888, #aaa)', fontSize: '2.5vw' }}
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* GALLERY Banner Text Overlay (Mobile) */}
                  {isGalleryBanner && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-black/10">
                      <div className="flex flex-col items-center text-center">
                        <h1
                          className="text-white font-black uppercase mb-4"
                          style={{
                            fontFamily: 'Geometos, sans-serif',
                            fontSize: '3.4vw',
                            lineHeight: '1.2',
                            transform: 'skewX(-10deg)',
                            textShadow: '0.5px 0.5px 0px #000, 1px 1px 0px #000, 1.5px 1.5px 0px #000, 2px 2px 5px rgba(0,0,0,0.6)'
                          }}
                        >
                          UPGRADE YOUR RIDE<br />ELEVATE YOUR JOURNEY!
                        </h1>
                        <Link
                          href={bannerLink || '#'}
                          className="px-5 py-1.5 bg-white text-black rounded shadow-lg font-medium tracking-wide inline-block pointer-events-auto cursor-pointer active:bg-gray-100 transition-colors"
                          style={{ fontSize: '2.5vw' }}
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* SPECIALIST Banner Text Overlay (Mobile) */}
                  {isSpecialistBanner && logoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none bg-black/20">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative w-[40vw] h-[9.5vw] mb-1">
                          <Image src={logoUrl} alt="Specialist Logo" fill className="object-contain" />
                        </div>
                        {specialistSubtitle && (
                          <p
                            className="text-white font-medium mb-1 uppercase tracking-widest drop-shadow-md"
                            style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '2vw' }}
                          >
                            {specialistSubtitle}
                          </p>
                        )}
                        <Link
                          href={bannerLink || '#'}
                          className="px-4 py-1 bg-white text-black rounded shadow-lg font-medium tracking-wide inline-block pointer-events-auto cursor-pointer active:bg-gray-100 transition-colors"
                          style={{ fontSize: '1.8vw' }}
                        >
                          Learn More
                        </Link>
                      </div>
                    </div>
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
