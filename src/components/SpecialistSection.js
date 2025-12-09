"use client"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import SpecialistImages from './SpecialistImages'
import Link from 'next/link'

const specialists = [
  {
    imgUrl: "/home/specialist/bmw.webp",
    alt: "BMW Specialist",
    url: "/products/bmw"
  },
  {
    imgUrl: "/home/specialist/alphardvellfire.webp",
    alt: "ALPHARDVELLFIRE Specialist",
    url: "/products/alphardvellfire"
  },
  {
    imgUrl: "/home/specialist/mercedes.webp",
    alt: "MERCEDES BENZ Specialist",
    url: "/products/mercedes"
  },



  // 可以添加更多輪播圖片
];

export default function SpecialistSection() {
  return (
    <section>
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
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={true}
          autoplay={{
            delay: 10000,
            disableOnInteraction: false,
          }}
          grabCursor={true}
          className="specialist-swiper"
        >
          {specialists.map((specialist, index) => (
            <SwiperSlide key={index}>
              <Link href={specialist.url}>
                <img
                  src={specialist.imgUrl}
                  alt={specialist.alt}
                  className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[400px] object-contain sm:object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Specialist Images */}
      <SpecialistImages />

      <style>{`
        .specialist-swiper {
          width: 100%;
          margin: 0;
          line-height: 0;
        }
        .specialist-swiper .swiper-slide {
          line-height: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .specialist-swiper .swiper-slide img {
          width: 100%;
          height: 100%;
          display: block;
        }
        .specialist-swiper .swiper-pagination {
          position: absolute;
          bottom: 20px !important;
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
  );
} 