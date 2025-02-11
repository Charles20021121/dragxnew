"use client"
import { CldImage } from 'next-cloudinary'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import SpecialistImages from './SpecialistImages'
import Link from 'next/link'

const specialists = [
  {
    imgUrl: "https://res.cloudinary.com/dmkxx68km/image/upload/v1725296185/idm52xuh4fqnjoyxywcs.webp",
    alt: "BMW Specialist",
    url: "/products/bmw"
  },
  {
    imgUrl: "https://res.cloudinary.com/dmkxx68km/image/upload/v1725296125/ki49clwmldclh4iulpc3.webp",
    alt: "ALPHARDVELLFIRE Specialist",
    url: "/products/alphardvellfire"
  },
  {
    imgUrl: "https://res.cloudinary.com/dmkxx68km/image/upload/v1725293406/np3uc2vpfjn2bnrbn30c.webp",
    alt: "MERCEDES BENZ Specialist",
    url: "/products/mercedes"
  },



  // 可以添加更多輪播圖片
];

export default function SpecialistSection() {
  return (
    <section >

      {/* Title with lines */}
      <div className="flex items-center justify-center mb-4">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
        <div className="mx-[2%]">

          <h2 className="text-[#1c5434] font-[900] text-center m-0 text-[clamp(12px,2vw,32px)] relative">
            Specialist
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#1c5434] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </h2>

        </div>
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
      </div>

      {/* Specialist Slider */}
      <Swiper
        speed={500}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        pagination={{
          dynamicBullets: true,
          clickable: true
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="specialist-swiper"
      >
        {specialists.map((specialist, index) => (
          <SwiperSlide key={index}>
            <Link href={specialist.url}>
            <CldImage
              width="1920"
              height="600"
              src={specialist.imgUrl}
              sizes="100vw"
              alt={specialist.alt}
              className="w-full h-auto"
              priority={index === 0}
            />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Specialist Images */}
      <SpecialistImages />

      <style jsx global>{`
        .specialist-swiper {
          margin: 0 !important;
          line-height: 0;
        }
        .specialist-swiper .swiper-wrapper {
          line-height: 0;
        }
        .specialist-swiper .swiper-slide {
          line-height: 0;
        }
        .specialist-swiper .swiper-pagination {
          position: absolute;
          bottom: 20px !important;
          line-height: normal;
        }
        .specialist-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.6;
          margin: 0 4px !important;
        }
        .specialist-swiper .swiper-pagination-bullet-active {
          background: white;
          opacity: 1;
        }
      `}</style>
    </section>
  )
} 