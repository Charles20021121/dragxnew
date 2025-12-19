'use client'

import Image from 'next/image'
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
              src="/contidecoder/pc/conti-decoder-main.webp"
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
              src="/contidecoder/pc/CONTI DECODER PAGE 2-02.webp"
              alt="Conti Decoder Features"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
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



      {/* SEO Content - Hidden from visual display but readable by search engines */}
      <div className="sr-only">
        <h1>Conti Decoder - Advanced Car Decoding System by DRAGX</h1>
        <h2>Professional Car Decoder Solution for Modern Vehicles</h2>

        <section>
          <h3>Conti Decoder Smart System</h3>
          <p>Upgrade your vehicle with Conti Decoder, the advanced car decoding system designed for professional diagnostics and vehicle customization. Our system provides comprehensive decoding capabilities for modern vehicles, enabling enhanced features and functionality.</p>

          <div>
            <h4>Key Features:</h4>
            <ul>
              <li>Advanced Vehicle Diagnostics</li>
              <li>Professional Decoding Capabilities</li>
              <li>Compatible with Multiple Vehicle Brands</li>
              <li>Easy Integration with Existing Systems</li>
              <li>Real-time Data Processing</li>
              <li>User-Friendly Interface</li>
              <li>Secure and Reliable Operation</li>
            </ul>
          </div>
        </section>

        <section>
          <h3>Professional Solution</h3>
          <p>Conti Decoder provides professional-grade decoding capabilities for automotive specialists and enthusiasts. Access advanced vehicle features and customize your car's functionality with our comprehensive system.</p>
        </section>

        <section>
          <h3>Wide Compatibility</h3>
          <p>Our Conti Decoder system is compatible with a wide range of vehicle brands and models. Professional installation ensures optimal performance and seamless integration with your vehicle's systems.</p>
        </section>
      </div>
    </>
  )
}
