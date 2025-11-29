'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useProduct } from '@/contexts/ProductContext'

export default function DX360Page() {
  const { setCurrentProduct } = useProduct()
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
  const getWhatsAppUrl = () => {
    const phoneNumber = '60192776056'
    const message = "Hi%20Dragx,%20I'm%20interested%20in%20DX360."

    if (isMobile) {
      // 移动设备：使用 wa.me（打开 WhatsApp App）
      return `https://wa.me/${phoneNumber}?text=${message}`
    } else {
      // 电脑：使用 web.whatsapp.com
      return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`
    }
  }

  return (
    <>
      <div className="relative">
        <Image
          src="/dx360/360 PAGE-01.webp"
          alt="DX360 - 360° Vision & Safety Upgrades for Every Car - Complete car safety system with 360 camera, dash cam, blind spot monitor and radar sensor"
          width={1200}
          height={800}
          className="w-full h-auto"
          priority
        />
      </div>

      <Image
        src={isDesktop ? "/dx360/360 PAGE-02.webp" : "/dx360/PHONE SIZE-02.webp"}
        alt="DX360 System Overview - Comprehensive vehicle safety features including 360° surrounding view cameras, radar sensors, blind spot monitoring, and dash cam integration"
        width={1200}
        height={800}
        className="w-full h-auto"
      />

      <div className="relative">
        <Image
          src={isDesktop ? "/dx360/360 PAGE-03.webp" : "/dx360/PHONE SIZE-03.webp"}
          alt="DX360 360° Surrounding View - Eliminates blind spots, prevents scratches and collisions, enables safer parking with complete vehicle coverage"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <div
          className={`absolute ${isDesktop ? 'left-[14.5%] bottom-[52%] w-[10%]' : 'left-[5.7%] bottom-[51.5%] w-[18%]'}`}
        >
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em]"
            style={{
              fontSize: isDesktop ? 'min(1vw, 12px)' : 'min(1.5vw, 16px)',
              padding: '0.4em 1.2em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>

      <div className="relative">
        <Image
          src={isDesktop ? "/dx360/360 PAGE-04.webp" : "/dx360/PHONE SIZE-04.webp"}
          alt="DX360 Radar Sensor System - Advanced collision prevention, parking assistance, and enhanced awareness with microwave radar technology"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <div
          className={`absolute ${isDesktop ? 'left-[57%] bottom-[50%] w-[10%]' : 'left-[60%] bottom-[48%] w-[18%]'}`}
        >
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em]"
            style={{
              fontSize: isDesktop ? 'min(1vw, 12px)' : 'min(1.5vw, 16px)',
              padding: '0.4em 1.2em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>

      <div className="relative">
        <Image
          src={isDesktop ? "/dx360/360 PAGE-05.webp" : "/dx360/PHONE SIZE-05.webp"}
          alt="DX360 Blind Spot Monitor (BSM) - Safer lane changes, enhanced highway safety, and all-weather support for optimal driving safety"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <div
          className={`absolute ${isDesktop ? 'left-[40.4%] bottom-[50%] w-[10%]' : 'left-[40%] bottom-[49%] w-[18%]'}`}
        >
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em]"
            style={{
              fontSize: isDesktop ? 'min(1vw, 12px)' : 'min(1.5vw, 16px)',
              padding: '0.4em 1.2em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>

      <div className="relative">
        <Image
          src={isDesktop ? "/dx360/360 PAGE-06.webp" : "/dx360/PHONE SIZE-06.webp"}
          alt="DX360 Dash Cam - Advanced accident evidence recording, reckless driving deterrent, and 24/7 parking surveillance system"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <div
          className={`absolute ${isDesktop ? 'left-[19.4%] bottom-[15%] w-[10%]' : 'left-[10%] bottom-[11%] w-[18%]'}`}
        >
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em]"
            style={{
              fontSize: isDesktop ? 'min(1vw, 12px)' : 'min(1.5vw, 16px)',
              padding: '0.4em 1.2em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>
    </>
  )
}