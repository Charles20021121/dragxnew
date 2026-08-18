'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useProduct } from '@/contexts/ProductContext'

export default function ContiDecoderPage() {
  const { setCurrentProduct } = useProduct()
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [pageUrl, setPageUrl] = useState('')

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    const checkMobileDevice = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobileDevice()
  }, [])

  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  const getWhatsAppUrl = (modelName) => {
    const phoneNumber = '60192776056'
    const message = modelName
      ? `${pageUrl}\n\nHi Dragx, I'm interested in Conti Decoder for ${modelName}`
      : `${pageUrl}\n\nHi Dragx, I'm interested in Conti Decoder for [Type Your Car Model Here]`

    if (isMobile) {
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    } else {
      return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    }
  }

  // 设置 Conti Decoder 产品信息给 WhatsApp 按钮使用
  useEffect(() => {
    setCurrentProduct({
      name: 'Conti Decoder - Advanced Car Decoding System',
      category: 'contidecoder',
      url: window.location.href,
      isListPage: false,
      isContiDecoder: true
    })

    return () => {
      setCurrentProduct(null)
    }
  }, [setCurrentProduct])

  return (
    <>
      {isDesktop ? (
        <>
          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/pc/CONTI DECODER PAGE 2-01.webp"
              alt="Conti Decoder - Advanced Car Decoding System"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />

            {/* Logo and Main Content */}
            <div className="absolute inset-0 flex flex-col z-10 pointer-events-none">
              <div className="hidden md:block absolute top-[4%] lg:top-[6%] left-[10%] w-[15vw] md:w-[18vw] lg:w-[15vw] z-10 pointer-events-auto">
                <Image
                  unoptimized
                  src="/contidecoder/logo.png"
                  alt="DX Conti Decoder Logo"
                  width={400}
                  height={120}
                  className="w-full h-auto object-contain"
                />
              </div>

              <div className="hidden md:flex absolute inset-0 flex-col justify-center items-start px-[8%] md:px-[10%] w-[90%] md:w-[55%] lg:w-[48%] pointer-events-auto">
                <h1
                  className="font-bold text-white mb-2 lg:mb-4 tracking-wide whitespace-nowrap"
                  style={{ fontFamily: 'Geometos, sans-serif', fontSize: '2.5vw', lineHeight: '1.2' }}
                >
                  CONTI DECODER &<br />360° INTERFACE
                </h1>
                <h2
                  className="text-white mb-3 lg:mb-5"
                  style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.25vw', lineHeight: '1.4' }}
                >
                  OEM-Grade image decoding and surround-view integration for modern automotive systems.
                </h2>
                <p
                  className="text-gray-200 text-justify"
                  style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.15vw', lineHeight: '1.6' }}
                >
                  Decoder Box is a retrofit CarPlay and Android Auto kit that adds CarPlay and Android Auto functionality to your factory vehicle. The kit provides an OEM look and experience, as it retains the original dashboard display and supports your existing SMEG/MRN controls, including the rotary controller and steering wheel buttons.
                </p>
              </div>
            </div>
            <figcaption className="sr-only">
              Conti Decoder presents the ultimate car decoding solution for modern vehicles.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/pc/CONTI DECODER PAGE 2-02.webp"
              alt="Conti Decoder Features"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <div className="hidden md:flex absolute inset-0 flex-col justify-center items-start left-[50%] w-[45%] pr-[5%]">
              <h2
                className="font-bold text-white mb-2 lg:mb-4 tracking-wide whitespace-nowrap"
                style={{ fontFamily: 'Geometos, sans-serif', fontSize: '2.5vw', lineHeight: '1.2' }}
              >
                ANDROID DECODER
              </h2>
              <p
                className="text-gray-200 text-justify"
                style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.15vw', lineHeight: '1.6' }}
              >
                Native-style Android Auto support using your factory display and controls. Works wired or wireless with automatic connection. Access maps, calls, messages and music through Google voice assistant—clean, safe, OEM feel.
              </p>
              <div className="flex flex-row gap-[1.5vw] mt-[2vw]">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="relative w-[3vw] h-[3vw]">
                    <Image
                      unoptimized
                      src={`/contidecoder/pc/5. Android Decoder Apps icon/1-0${num}.webp`}
                      alt={`Android Decoder App Icon ${num}`}
                      fill
                      className="object-contain drop-shadow-md hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-[2vw]">
                <Link
                  href="/products/contidecoder"
                  className="inline-flex items-center justify-center px-6 lg:px-8 py-2.5 lg:py-3.5 border border-white/50 bg-white/10 hover:bg-white hover:text-black text-white font-bold text-[1.2vw] lg:text-[0.9vw] uppercase tracking-wider rounded-md transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                >
                  View Products
                </Link>
              </div>
            </div>
            <figcaption className="sr-only">
              Conti Decoder comprehensive features and capabilities.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/pc/CONTI DECODER PAGE 2-03.webp"
              alt="Conti Decoder Functionality"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <div className="hidden md:flex absolute inset-0 flex-col justify-center items-start px-[8%] md:px-[10%] w-[90%] md:w-[60%] lg:w-[55%]">
              <h2
                className="font-bold text-white mb-2 lg:mb-4 tracking-wide whitespace-nowrap"
                style={{ fontFamily: 'Geometos, sans-serif', fontSize: '2.5vw', lineHeight: '1.2' }}
              >
                CARPLAY DECODER
              </h2>
              <p
                className="text-gray-200 text-justify w-full"
                style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.15vw', lineHeight: '1.6' }}
              >
                Seamless Apple CarPlay integration with your original screen and controls. Supports wired and wireless connection. Auto-connect every drive and control calls, messages, navigation and music with  Siri—just like OEM.

              </p>
              <div className="flex flex-row justify-end w-full gap-[1.5vw] mt-[2vw]">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={num} className="relative w-[3vw] h-[3vw]">
                    <Image
                      unoptimized
                      src={`/contidecoder/pc/6. Carplay Decoder Apps icon/${num}.webp`}
                      alt={`Carplay Decoder App Icon ${num}`}
                      fill
                      className="object-contain drop-shadow-md hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end w-full mt-[2vw]">
                <Link
                  href="/products/contidecoder"
                  className="inline-flex items-center justify-center px-6 lg:px-8 py-2.5 lg:py-3.5 border border-white/50 bg-white/10 hover:bg-white hover:text-black text-white font-bold text-[1.2vw] lg:text-[0.9vw] uppercase tracking-wider rounded-md transition-all duration-300 hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]"
                >
                  View Products
                </Link>
              </div>
            </div>
            <figcaption className="sr-only">
              Advanced functionality of Conti Decoder system.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/pc/CONTI DECODER PAGE 2-04.webp"
              alt="Conti Decoder Integration"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <div className="hidden md:flex absolute inset-0 flex-col justify-start items-start left-[52%] w-[45%] pr-[5%] pt-[2%]">
              <h2
                className="font-bold text-white mb-2 lg:mb-4 tracking-wide whitespace-nowrap"
                style={{ fontFamily: 'Geometos, sans-serif', fontSize: '2.5vw', lineHeight: '1.2' }}
              >
                360° CAM DECODER
              </h2>
              <p
                className="text-gray-200 text-justify w-full"
                style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.15vw', lineHeight: '1.6' }}
              >
                The 360 Interface processes four camera inputs to generate a complete surround-view image, providing drivers with enhanced parking and safety visibility.
              </p>
            </div>
            <figcaption className="sr-only">
              Conti Decoder integration with vehicle systems.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/pc/CONTI DECODER PAGE 2-05.webp"
              alt="Conti Decoder Benefits"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Benefits and advantages of using Conti Decoder.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/pc/CONTI DECODER PAGE 2-06.webp"
              alt="Conti Decoder Compatibility"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Conti Decoder compatibility with various vehicle models.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/pc/CONTI DECODER PAGE 7.webp"
              alt="Conti Decoder Additional Information"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-full text-center">
              <a
                href={getWhatsAppUrl('')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-[#1a1a1a]/90 backdrop-blur-sm text-white px-6 md:px-10 py-2 md:py-4 rounded-xl font-bold text-xs md:text-lg hover:bg-black transition-all duration-300 uppercase tracking-widest border-2 border-white/30 shadow-2xl hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95">
                  CONTACT US WITH YOUR CAR MODEL
                </button>
              </a>
            </div>
            <figcaption className="sr-only">
              Additional information about Conti Decoder system.
            </figcaption>
          </figure>
        </>
      ) : (
        <>
          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/phone/CONTI DECODER PAGE phone size-01.webp"
              alt="Conti Decoder - Advanced Car Decoding System"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
            <figcaption className="sr-only">
              Conti Decoder presents the ultimate car decoding solution for modern vehicles.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/phone/CONTI DECODER PAGE phone size-02.webp"
              alt="Conti Decoder Features"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <div className="absolute bottom-[7%] right-[8%] z-10">
              <Link
                href="/products/contidecoder"
                className="inline-block px-4 py-1.5 border border-white/40 bg-black/40 backdrop-blur-md hover:bg-white hover:text-black text-white font-bold text-[10px] uppercase tracking-wider rounded-md transition-all duration-300 active:scale-95 shadow-lg"
              >
                View Products
              </Link>
            </div>
            <figcaption className="sr-only">
              Conti Decoder comprehensive features and capabilities.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/phone/CONTI DECODER PAGE phone size-03.webp"
              alt="Conti Decoder Functionality"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <div className="absolute bottom-[10%] left-[8%] z-10">
              <Link
                href="/products/contidecoder"
                className="inline-block px-4 py-1.5 border border-white/40 bg-black/40 backdrop-blur-md hover:bg-white hover:text-black text-white font-bold text-[10px] uppercase tracking-wider rounded-md transition-all duration-300 active:scale-95 shadow-lg"
              >
                View Products
              </Link>
            </div>
            <figcaption className="sr-only">
              Advanced functionality of Conti Decoder system.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/phone/CONTI DECODER PAGE phone size-04.webp"
              alt="Conti Decoder Integration"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Conti Decoder integration with vehicle systems.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/phone/CONTI DECODER PAGE phone size-05.webp"
              alt="Conti Decoder Benefits"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Benefits and advantages of using Conti Decoder.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/phone/CONTI DECODER PAGE phone size-06.webp"
              alt="Conti Decoder Compatibility"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Conti Decoder compatibility with various vehicle models.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/contidecoder/phone/CONTI DECODER PAGE phone size-07.webp"
              alt="Conti Decoder Additional Information"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-full text-center">
              <a
                href={getWhatsAppUrl('')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-[#1a1a1a]/90 backdrop-blur-sm text-white px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold text-[10px] md:text-base hover:bg-black transition-all duration-300 uppercase tracking-widest border-2 border-white/30 shadow-2xl hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-95">
                  CONTACT US WITH YOUR CAR MODEL
                </button>
              </a>
            </div>
            <figcaption className="sr-only">
              Additional information about Conti Decoder system.
            </figcaption>
          </figure>
        </>
      )}

      {/* Schema.org Service JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "DX Conti Decoder - OEM CarPlay & Android Auto Retrofit",
            "provider": {
              "@type": "Organization",
              "name": "DRAGX"
            },
            "serviceType": "Car Multimedia & Decoder Retrofit",
            "description": "Retrofit Wireless Apple CarPlay, Android Auto, and 360 Camera interface into OEM factory vehicle screens for Mercedes, BMW, Audi, Porsche in Malaysia.",
            "areaServed": {
              "@type": "Country",
              "name": "Malaysia"
            }
          })
        }}
      />
    </>
  )
}
