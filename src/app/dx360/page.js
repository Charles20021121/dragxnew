'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useProduct } from '@/contexts/ProductContext'

export default function DX360Page() {
  const { setCurrentProduct } = useProduct()
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const [origin, setOrigin] = useState('')

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

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

  // 设置 DX360 产品信息给 WhatsApp 按钮使用
  useEffect(() => {
    setCurrentProduct({
      name: 'DX360 - 360° Vision & Safety System',
      category: 'dx360',
      url: window.location.href,
      isListPage: false,
      isDX360: true
    })

    return () => {
      setCurrentProduct(null)
    }
  }, [setCurrentProduct])

  // 生成 WhatsApp URL（根据设备类型）
  const getWhatsAppUrl = (customMessage, imageName) => {
    const phoneNumber = '60192776056'

    let messageText = customMessage || "Hi Dragx, I'm interested in DX360."
    let finalMessage = messageText

    if (imageName && origin) {
      const imageUrl = `${origin}/dx360/product/${encodeURIComponent(imageName)}`
      // Link first, then message (with empty line)
      finalMessage = `${imageUrl}\n\n${messageText}`
    }

    const encodedMessage = encodeURIComponent(finalMessage)

    if (isMobile) {
      // 移动设备：使用 wa.me（打开 WhatsApp App）
      return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    } else {
      // 电脑：使用 web.whatsapp.com
      return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`
    }
  }

  return (
    <>
      <div className="relative">
        <Image
          unoptimized
          src={isDesktop ? "/dx360/pc banner.webp" : "/dx360/PHONE SIZE-01.webp"}
          alt="DX360 - 360° Vision & Safety Upgrades for Every Car - Complete car safety system with 360 camera, dash cam, blind spot monitor and radar sensor"
          width={1200}
          height={800}
          className="w-full h-auto"
          priority
        />
        <div className="hidden md:flex absolute inset-0 flex-col justify-center items-start px-[8%] md:px-[10%] w-[90%] md:w-[70%] lg:w-[65%]">
          <h1
            className="font-bold text-white tracking-wide"
            style={{ fontFamily: 'Gotham-Bold, Gotham, sans-serif', fontSize: '3vw', lineHeight: '1.2' }}
          >
            360° VISION & SAFETY<br />UPGRADES FOR EVERY CAR
          </h1>
        </div>
      </div>

      <Image
        unoptimized
        src={isDesktop ? "/dx360/360 PAGE-02.webp" : "/dx360/PHONE SIZE-02.webp"}
        alt="DX360 System Overview - Comprehensive vehicle safety features including 360° surrounding view cameras, radar sensors, blind spot monitoring, and dash cam integration"
        width={1200}
        height={800}
        className="w-full h-auto"
      />

      <div className="relative">
        <Image
          unoptimized
          src={isDesktop ? "/dx360/360 PAGE-03.webp" : "/dx360/PHONE SIZE-03.webp"}
          alt="DX360 360° Surrounding View - Eliminates blind spots, prevents scratches and collisions, enables safer parking with complete vehicle coverage"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <div
          className={`absolute ${isDesktop ? 'left-[14.5%] bottom-[52%] w-fit' : 'left-1/2 bottom-[3%] -translate-x-1/2 w-fit'}`}
        >
          <a
            href="/products/360camera"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em] whitespace-nowrap"
            style={{
              fontSize: isDesktop ? 'min(1vw, 12px)' : '15px',
              padding: isDesktop ? '0.4em 1.2em' : '0.45em 1.3em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>

      <div className="relative">
        <Image
          unoptimized
          src={isDesktop ? "/dx360/360 PAGE-04.webp" : "/dx360/PHONE SIZE-04.webp"}
          alt="DX360 Radar Sensor System - Advanced collision prevention, parking assistance, and enhanced awareness with microwave radar technology"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <div
          className={`absolute ${isDesktop ? 'left-[57%] bottom-[50%] w-fit' : 'left-1/2 bottom-[3%] -translate-x-1/2 w-fit'}`}
        >
          <a
            href="/products/360camera"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em] whitespace-nowrap"
            style={{
              fontSize: isDesktop ? 'min(1vw, 12px)' : '15px',
              padding: isDesktop ? '0.4em 1.2em' : '0.45em 1.3em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>

      <div className="relative">
        <Image
          unoptimized
          src={isDesktop ? "/dx360/360 PAGE-05.webp" : "/dx360/PHONE SIZE-05.webp"}
          alt="DX360 Blind Spot Monitor (BSM) - Safer lane changes, enhanced highway safety, and all-weather support for optimal driving safety"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <div
          className={`absolute ${isDesktop ? 'left-[40.4%] bottom-[50%] w-fit' : 'left-[8%] bottom-[34%] w-fit'}`}
        >
          <a
            href="/products/360camera"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em] whitespace-nowrap"
            style={{
              fontSize: isDesktop ? 'min(1vw, 12px)' : '15px',
              padding: isDesktop ? '0.4em 1.2em' : '0.45em 1.3em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>

      <div className="relative">
        <Image
          unoptimized
          src={isDesktop ? "/dx360/360 PAGE-06.webp" : "/dx360/PHONE SIZE-06.webp"}
          alt="DX360 Dash Cam - Advanced accident evidence recording, reckless driving deterrent, and 24/7 parking surveillance system"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <div
          className={`absolute ${isDesktop ? 'left-1/2 -translate-x-1/2 bottom-[10%] w-fit' : 'left-1/2 bottom-[3%] -translate-x-1/2 w-fit'}`}
        >
          <a
            href="/products/360camera"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em] whitespace-nowrap"
            style={{
              fontSize: isDesktop ? 'min(1.5vw, 18px)' : '15px',
              padding: isDesktop ? '0.6em 1.8em' : '0.45em 1.3em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>
    </>
  )
}