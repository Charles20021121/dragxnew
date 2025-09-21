'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function DX360Page() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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
            href="/shop/dx360"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em]"
            style={{ 
              fontSize: isDesktop ? 'min(1vw, 12px)' : 'min(1.5vw, 16px)',
              padding: '0.4em 1.2em'
            }}
          >
            SHOP NOW
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
            href="/shop/dx360"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em]"
            style={{ 
              fontSize: isDesktop ? 'min(1vw, 12px)' : 'min(1.5vw, 16px)',
              padding: '0.4em 1.2em'
            }}
          >
            SHOP NOW
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
            href="/shop/dx360"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em]"
            style={{ 
              fontSize: isDesktop ? 'min(1vw, 12px)' : 'min(1.5vw, 16px)',
              padding: '0.4em 1.2em'
            }}
          >
            SHOP NOW
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
            href="/shop/dx360"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em]"
            style={{ 
              fontSize: isDesktop ? 'min(1vw, 12px)' : 'min(1.5vw, 16px)',
              padding: '0.4em 1.2em'
            }}
          >
            SHOP NOW
          </a>
        </div>
      </div>
    </>
  )
}