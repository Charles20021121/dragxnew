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
      <div className="relative w-full bg-[#011512] overflow-hidden">
        {/* Background Image (作为真实流内容撑开高度，保证按比例缩放不被裁剪) */}
        <img
          src={isDesktop ? "/dx360/360 PAGE-01.webp" : "/dx360/PHONE SIZE-01.webp"}
          alt="DX360 Hero Banner"
          className="w-full h-auto block"
        />

        {/* Foreground Content (Hidden on mobile, scales perfectly on desktop) */}
        <div className="hidden md:flex absolute inset-0 flex-col z-10 pointer-events-none">

          {/* Logo (Top Left) */}
          <div className="absolute top-[6%] left-[10%] w-[13vw] z-20 pointer-events-auto">
            <Image
              unoptimized
              src="/dx360/hero banner/Element-01.webp"
              alt="DX360 Logo"
              width={300}
              height={100}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Main Content Area */}
          <div className="absolute inset-0 flex flex-col justify-center items-start pl-[10%] w-[65%] pointer-events-auto mt-[4%]">
            {/* Text */}
            <h1
              className="text-white font-normal leading-[1.2] mb-[3vw] tracking-widest font-sans drop-shadow-md"
              style={{ fontSize: '2.5vw' }}
            >
              360° VISION & SAFETY<br />
              UPGRADES FOR EVERY CAR
            </h1>

            {/* Features Row */}
            <div className="flex flex-row items-center gap-[3vw]">
              {/* Feature 1 (360 Cam) */}
              <div className="flex flex-col items-center">
                <Image unoptimized src="/dx360/hero banner/Element-02.webp" alt="360 Cam" width={200} height={200} className="w-[4.5vw] h-auto" />
              </div>
              {/* Feature 2 (Dash Cam) */}
              <div className="flex flex-col items-center">
                <Image unoptimized src="/dx360/hero banner/Element-03.webp" alt="Dash Cam" width={200} height={200} className="w-[6.5vw] h-auto" />
              </div>
              {/* Feature 3 (BSM) */}
              <div className="flex flex-col items-center">
                <Image unoptimized src="/dx360/hero banner/Element-04.webp" alt="Blind Spot Monitor" width={200} height={200} className="w-[9vw] h-auto" />
              </div>
              {/* Feature 4 (Radar Sensor) */}
              <div className="flex flex-col items-center">
                <Image unoptimized src="/dx360/hero banner/Element-05.webp" alt="Radar Sensor" width={200} height={200} className="w-[6.5vw] h-auto" />
              </div>
            </div>
          </div>
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

      {/* 3rd Banner: 360° Surrounding View */}
      <div className="relative w-full bg-[#00050b] overflow-hidden">
        {/* Mobile View with SEO Text */}
        <div className="md:hidden">
          <img
            src="/dx360/PHONE SIZE-03.webp"
            alt="DX360 360° Surrounding View System. Eliminates blind spots, prevents scratches & collisions, and offers safer parking with bird's-eye view cameras."
            className="w-full h-auto block"
          />
          <div className="sr-only">
            <h2>360° SURROUNDING VIEW</h2>
            <h3>Eliminates Blind Spots</h3>
            <p>Provides a bird's-eye view around the vehicle.</p>
            <h3>Prevents Scratches & Collisions</h3>
            <p>Helps maneuver safely in tight spaces and near obstacles.</p>
            <h3>Safer Parking</h3>
            <p>Offers a complete view, reducing the risk of reversing accidents.</p>
          </div>
        </div>

        {/* Desktop Custom Component */}
        <div className="hidden md:flex w-full min-h-[45vh] flex-row items-stretch justify-between gap-[4vw] pl-[12%] pr-[8%] pt-[3%] pb-0">
          {/* Left Side (Text & 4 Pictures) */}
          <div className="w-[40%] flex flex-col justify-center pb-[4%]">
            <div className="relative inline-block mb-[2vw] flex items-end">
              <h2 className="text-white font-bold text-[2vw] leading-none whitespace-nowrap tracking-widest drop-shadow-lg z-10 relative" style={{ fontFamily: 'Geometos, sans-serif' }}>
                360° SURROUNDING VIEW
              </h2>
              {/* Fog/Mist shadow effect rising from the bottom line */}
              <div
                className="absolute bottom-0 right-0 h-[70%] z-0"
                style={{
                  width: '150vw',
                  background: 'linear-gradient(to top, #002449 0%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 100%)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 100%)'
                }}
              ></div>
              {/* Solid line fading to the left */}
              <div
                className="absolute bottom-0 right-0 h-[2px] z-0"
                style={{
                  width: '150vw',
                  background: 'linear-gradient(to right, transparent 0%, #002449 100%)'
                }}
              ></div>
            </div>

            <div className="flex flex-col space-y-[1.5vw] mb-[2vw]">
              <div>
                <h3 className="text-white font-bold text-[1.2vw] leading-tight mb-0 tracking-wide" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>Eliminates Blind Spots</h3>
                <p className="text-gray-300 text-[1vw] leading-tight tracking-wider font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>Provides a bird's-eye view around the vehicle.</p>
              </div>
              <div>
                <h3 className="text-white font-bold text-[1.2vw] leading-tight mb-0 tracking-wide" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>Prevents Scratches & Collisions</h3>
                <p className="text-gray-300 text-[1vw] leading-tight tracking-wider font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>Helps maneuver safely in tight spaces and near obstacles.</p>
              </div>
              <div>
                <h3 className="text-white font-bold text-[1.2vw] leading-tight mb-0 tracking-wide" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>Safer Parking</h3>
                <p className="text-gray-300 text-[1vw] leading-tight tracking-wider font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>Offers a complete view, reducing the risk of reversing accidents.</p>
              </div>
            </div>

            <a
              href="/products/360camera?filter=DX%20360"
              className="inline-block bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em] mb-[2vw]"
              style={{
                fontSize: '0.7vw',
                padding: '0.5em 1.2em',
                width: 'fit-content'
              }}
            >
              LEARN MORE
            </a>

            {/* 2x2 Grid for 4 pictures */}
            <div className="grid grid-cols-2 gap-[0.2vw] w-full max-w-[90%]">
              <img src="/dx360/3. 360° SURROUNDING VIEW/link-32.webp" alt="Camera View 1" className="w-full h-auto block" />
              <img src="/dx360/3. 360° SURROUNDING VIEW/link-33.webp" alt="Camera View 2" className="w-full h-auto block" />
              <img src="/dx360/3. 360° SURROUNDING VIEW/link-34.webp" alt="Camera View 3" className="w-full h-auto block" />
              <img src="/dx360/3. 360° SURROUNDING VIEW/link-35.webp" alt="Camera View 4" className="w-full h-auto block" />
            </div>
          </div>

          {/* Right Side (Graphics) */}
          <div className="w-[55%] flex flex-col justify-end items-center relative">
            {/* Top Cameras */}
            <img src="/dx360/3. 360° SURROUNDING VIEW/Element-06.webp" alt="4 Cameras" className="w-[45%] lg:w-[50%] h-auto mb-[0.5vw] z-10" />

            {/* Main Graphic (Removed crop since clean PNG is provided) */}
            <img src="/dx360/3. 360° SURROUNDING VIEW/link-36.png" alt="360 View Graphic" className="w-full h-auto z-0 block" />
          </div>
        </div>

        {/* Original Mobile Button (Overlaying mobile image) */}
        <div className="absolute left-1/2 bottom-[3%] -translate-x-1/2 w-fit md:hidden">
          <a
            href="/products/360camera?filter=DX%20360"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em] whitespace-nowrap"
            style={{
              fontSize: '15px',
              padding: '0.45em 1.3em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>

      {/* 4th Banner: Radar Sensor */}
      <div className="relative w-full bg-[#000e1c] overflow-hidden">
        {/* Mobile View with SEO Text */}
        <div className="md:hidden">
          <img
            src="/dx360/PHONE SIZE-04.webp"
            alt="DX360 Radar Sensor System. Collision prevention, parking assistance, and enhanced awareness in low-visibility conditions."
            className="w-full h-auto block"
          />
          <div className="sr-only">
            <h2>RADAR SENSOR</h2>
            <h3>Collision Prevention</h3>
            <p>Detects obstacles in front or behind the car to avoid impact.</p>
            <h3>Parking Assistance</h3>
            <p>Beeps or alerts as you get close to walls or other vehicles.</p>
            <h3>Enhanced Awareness</h3>
            <p>Improves safety in low-visibility conditions where cameras alone may not be enough.</p>
            <p>Features: Microwave Radar, Central Control, Microporous Installation, Distance Reminder, Upgraded Radar, Host Sound, Waterproof.</p>
          </div>
        </div>

        {/* Desktop Custom Component */}
        <div className="hidden md:flex flex-col w-full px-[8%] py-[4%]">
          {/* TITLE ROW */}
          <div className="w-full flex justify-center mb-[2vw]">
            <div className="relative inline-block flex items-end">
              <h2 className="text-white font-bold text-[2vw] leading-none whitespace-nowrap tracking-widest drop-shadow-lg z-10 relative" style={{ fontFamily: 'Geometos, sans-serif' }}>
                RADAR SENSOR
              </h2>
              {/* Fog/Mist shadow effect centered */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[70%] z-0"
                style={{
                  width: '30vw',
                  background: 'linear-gradient(to top, #002449 0%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%, transparent 100%)',
                  maskImage: 'linear-gradient(to right, transparent 0%, black 50%, transparent 100%)'
                }}
              ></div>
              {/* Solid line fading left and right */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] z-0"
                style={{
                  width: '30vw',
                  background: 'linear-gradient(to right, transparent 0%, #002449 50%, transparent 100%)'
                }}
              ></div>
            </div>
          </div>

          {/* MAIN CONTENT ROW */}
          <div className="flex flex-row justify-between items-stretch w-full gap-[4vw]">
            {/* Left Side (Graphics) */}
            <div className="w-[55%] flex flex-col items-center">
              <img src="/dx360/4. RADAR SENSOR/Element-12.webp" alt="Radar Interface" className="w-full h-auto block" />
            </div>

            {/* Right Side (Features & Radar Modules) */}
            <div className="w-[45%] flex flex-col justify-between pt-[0.5vw]">
              <div className="flex flex-col space-y-[1.5vw]">
                <div>
                  <h4 className="text-white font-bold text-[1.2vw] leading-tight mb-0 tracking-wide" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>Collision Prevention</h4>
                  <p className="text-gray-300 text-[1vw] leading-tight tracking-wider font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>Detects obstacles in front or behind the car to avoid impact.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold text-[1.2vw] leading-tight mb-0 tracking-wide" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>Parking Assistance</h4>
                  <p className="text-gray-300 text-[1vw] leading-tight tracking-wider font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>Beeps or alerts as you get close to walls or other vehicles.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold text-[1.2vw] leading-tight mb-0 tracking-wide" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>Enhanced Awareness</h4>
                  <p className="text-gray-300 text-[1vw] leading-tight tracking-wider font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>Improves safety in low-visibility conditions where cameras alone may not be enough.</p>
                </div>
              </div>

              <a
                href="/products/360camera?filter=RADAR%20SENSOR"
                className="inline-block bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em] my-[1vw]"
                style={{
                  fontSize: '0.7vw',
                  padding: '0.5em 1.2em',
                  width: 'fit-content'
                }}
              >
                LEARN MORE
              </a>

              <img src="/dx360/4. RADAR SENSOR/Element-13.webp" alt="Radar Sensors" className="w-[85%] h-auto ml-[-2vw] block mt-auto" />
            </div>
          </div>

          {/* BOTTOM ICONS ROW */}
          <div className="w-full flex flex-row justify-center items-end mt-[0.5vw] gap-[4vw]">
            <div className="flex flex-col items-center justify-end">
              <img src="/dx360/4. RADAR SENSOR/Element-14.webp" alt="Microwave Radar" className="h-[4vw] w-auto object-contain block" />
            </div>
            <div className="flex flex-col items-center justify-end">
              <img src="/dx360/4. RADAR SENSOR/Element-15.webp" alt="Central Control" className="h-[4vw] w-auto object-contain block" />
            </div>
            <div className="flex flex-col items-center justify-end">
              <img src="/dx360/4. RADAR SENSOR/Element-16.webp" alt="Microporous Installation" className="h-[4vw] w-auto object-contain block" />
            </div>
            <div className="flex flex-col items-center justify-end">
              <img src="/dx360/4. RADAR SENSOR/Element-17.webp" alt="Distance Reminder" className="h-[4vw] w-auto object-contain block" />
            </div>
            <div className="flex flex-col items-center justify-end">
              <img src="/dx360/4. RADAR SENSOR/Element-18.webp" alt="Upgraded Radar" className="h-[4vw] w-auto object-contain block" />
            </div>
            <div className="flex flex-col items-center justify-end">
              <img src="/dx360/4. RADAR SENSOR/Element-19.webp" alt="Host Sound" className="h-[4vw] w-auto object-contain block" />
            </div>
            <div className="flex flex-col items-center justify-end">
              <img src="/dx360/4. RADAR SENSOR/Element-20.webp" alt="Waterproof" className="h-[4vw] w-auto object-contain block" />
            </div>
          </div>
        </div>

        {/* Original Mobile Button (Overlaying mobile image) */}
        <div className="absolute left-1/2 bottom-[3%] -translate-x-1/2 w-fit md:hidden">
          <a
            href="/products/360camera?filter=RADAR%20SENSOR"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em] whitespace-nowrap"
            style={{
              fontSize: '15px',
              padding: '0.45em 1.3em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>

      {/* 5th Banner: Blind Spot Monitor (BSM) */}
      <div className="relative w-full bg-[#001f40] overflow-hidden">
        {/* Mobile View with SEO Text */}
        <div className="md:hidden">
          <img
            src="/dx360/PHONE SIZE-05.webp"
            alt="DX360 Blind Spot Monitor (BSM). Safer lane changes, enhanced highway safety, and all-weather support."
            className="w-full h-auto block"
          />
          <div className="sr-only">
            <h2>BLIND SPOT MONITOR (BSM)</h2>
            <h3>Safer Lane Changes</h3>
            <p>Alerts when vehicles are in your blind spot.</p>
            <h3>Enhanced Highway Safety</h3>
            <p>Warns about fast-approaching cars during lane switching.</p>
            <h3>All-Weather Support</h3>
            <p>Works even in low visibility conditions such as night or rain.</p>
          </div>
        </div>

        {/* Desktop Custom Component */}
        <div className="hidden md:flex flex-row w-full items-stretch justify-between pl-[10%] pr-[5%] py-[4%] gap-[4vw]">
          {/* Left Side (Top Down Graphic) */}
          <div className="w-[45%] flex flex-col justify-center items-center">
            <img src="/dx360/5. BLIND SPOT MONITOR (BSM)/Element-21.webp" alt="Blind Spot Radar Coverage" className="w-[60%] h-auto object-contain block" />
          </div>

          {/* Right Side (Text & Mirror Graphic) */}
          <div className="w-[50%] flex flex-col justify-between pt-[2vw]">
            <div>
              {/* Title */}
              <div className="relative inline-block mb-[3vw] flex items-end">
                <h2 className="text-white font-bold text-[2vw] leading-none whitespace-nowrap tracking-widest drop-shadow-lg z-10 relative" style={{ fontFamily: 'Geometos, sans-serif' }}>
                  BLIND SPOT MONITOR (BSM)
                </h2>
                {/* Solid line fading to the right */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] z-0"
                  style={{
                    width: '120%',
                    background: 'linear-gradient(to right, #003366 0%, transparent 100%)'
                  }}
                ></div>
                {/* Mist shadow effect fading to the right */}
                <div
                  className="absolute bottom-0 left-0 h-[70%] z-0"
                  style={{
                    width: '120%',
                    background: 'linear-gradient(to top, #003366 0%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, black 0%, transparent 100%)'
                  }}
                ></div>
              </div>

              {/* Features Text */}
              <div className="flex flex-col space-y-[1.5vw] mb-[3vw]">
                <div>
                  <h4 className="text-white font-bold text-[1.2vw] leading-tight mb-0 tracking-wide" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>Safer Lane Changes</h4>
                  <p className="text-gray-300 text-[1vw] leading-tight tracking-wider font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>Alerts when vehicles are in your blind spot.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold text-[1.2vw] leading-tight mb-0 tracking-wide" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>Enhanced Highway Safety</h4>
                  <p className="text-gray-300 text-[1vw] leading-tight tracking-wider font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>Warns about fast-approaching cars during lane switching.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold text-[1.2vw] leading-tight mb-0 tracking-wide" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>All-Weather Support</h4>
                  <p className="text-gray-300 text-[1vw] leading-tight tracking-wider font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>Works even in low visibility conditions such as night or rain.</p>
                </div>
              </div>

              {/* Button */}
              <a
                href="/products/360camera?filter=BLIND%20SPOT%20DETECTION%20(BSD)"
                className="inline-block bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em]"
                style={{
                  fontSize: '0.7vw',
                  padding: '0.5em 1.2em',
                  width: 'fit-content'
                }}
              >
                LEARN MORE
              </a>
            </div>

            {/* Mirror Graphic */}
            <img src="/dx360/5. BLIND SPOT MONITOR (BSM)/Element-22.png" alt="Blind Spot Mirror View" className="w-[120%] max-w-none h-auto block mt-auto ml-0" />
          </div>
        </div>

        {/* Mobile Button Overlay */}
        <div className="absolute left-[8%] bottom-[34%] w-fit md:hidden">
          <a
            href="/products/360camera?filter=BLIND%20SPOT%20DETECTION%20(BSD)"
            className="inline-block w-full bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em] whitespace-nowrap"
            style={{
              fontSize: '15px',
              padding: '0.45em 1.3em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>


      {/* 6th Banner: DIGITAL INNER RECORDER DIM - Mobile */}
      <div className="md:hidden w-full bg-[#002d59] flex flex-col">
        <img 
          src="/dx360/PHONE SIZE-06.png" 
          alt="DX360 Digital Inner Recorder DIM. Digital rearview mirror with built-in GPS and Wi-Fi, automatic brightness adjustment, and wide unobstructed live view." 
          className="w-full h-auto block" 
        />
        {/* Mobile Button Below Banner */}
        <div className="w-full flex justify-center py-6">
          <a
            href="/products/360camera?filter=DRIVING%20RECORDING%20%26%20SAFETY"
            className="inline-block bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em] whitespace-nowrap"
            style={{
              fontSize: '15px',
              padding: '0.45em 1.3em'
            }}
          >
            LEARN MORE
          </a>
        </div>
      </div>

      {/* 6th Banner: DIGITAL INNER RECORDER DIM - Desktop */}
      <div className="relative hidden md:flex w-full bg-[#002447] flex-col pt-[4vw] pb-[6vw] px-[8%] overflow-hidden">
          <div className="sr-only">
            <h2>DIGITAL INNER RECORDER DIM</h2>
            <p>Features: High Frame Rate, Starlight Night Vision, Ai ADS, Ultra-High Resolution Display, Automotive Grade Display.</p>
            <p>Enjoy a clearer and safer rear view with a digital rearview mirror. Unlike traditional mirrors that can be blocked by passengers or luggage, the built-in rear camera provides a wide, unobstructed live view, reducing blind spots and improving driving safety in all weather conditions.</p>
            <h3>AUTOMATIC BRIGHTNESS ADJUSTMENT</h3>
            <p>The advanced ambient light sensor automatically detects surrounding lighting conditions and adjusts the screen brightness for optimal visibility and a more comfortable driving experience.</p>
            <h3>BUILT-IN GPS</h3>
            <p>Records route, speed, and location data in real time.</p>
            <h3>BUILT-IN WI-FI</h3>
            <p>Preview, download, and share recordings via the mobile app.</p>
          </div>

        {/* Desktop View container */}
        <div className="hidden md:flex flex-col w-full">
          
          {/* Sub-section 1: Main Hero */}
          <div className="w-full flex flex-col items-center relative mb-[2vw]">
            {/* Title */}
            <div className="w-full flex justify-start mb-0">
              <div className="relative inline-block flex items-end">
                <h2 className="text-white font-bold text-[2.8vw] leading-none whitespace-nowrap tracking-widest drop-shadow-lg z-10 relative" style={{ fontFamily: 'Geometos, sans-serif' }}>
                  DIGITAL INNER RECORDER DIM
                </h2>
                {/* Glowing line */}
                <div className="absolute bottom-0 left-0 h-[2px] z-0" style={{ width: '120%', background: 'linear-gradient(to right, #004488 0%, transparent 100%)' }}></div>
                <div className="absolute bottom-0 left-0 h-[70%] z-0" style={{ width: '120%', background: 'linear-gradient(to top, rgba(0,68,136,0.6) 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 100%)' }}></div>
              </div>
            </div>

            {/* Main Graphic & Overlay Text */}
            <div className="relative w-[90%] flex justify-center mt-0">
              <img src="/dx360/6. DIGITAL INNER RECORDER DIM/DIGITAL INNER RECORDER DIM.webp" alt="Inner Recorder View" className="w-full h-auto object-contain block" />
            </div>

            {/* 5 Icons Row */}
            <div className="w-[85%] flex justify-between items-center mt-[-2vw]">
              <div className="flex flex-col items-center justify-center w-[18%]">
                <img src="/dx360/6. DIGITAL INNER RECORDER DIM/Element-23.webp" alt="High Frame Rate" className="h-[5vw] w-auto" />
              </div>
              <div className="w-[1px] h-[3vw] bg-gray-500 opacity-50"></div>
              
              <div className="flex flex-col items-center justify-center w-[18%]">
                <img src="/dx360/6. DIGITAL INNER RECORDER DIM/Element-24.webp" alt="Starlight Night Vision" className="h-[5vw] w-auto" />
              </div>
              <div className="w-[1px] h-[3vw] bg-gray-500 opacity-50"></div>
              
              <div className="flex flex-col items-center justify-center w-[18%]">
                <img src="/dx360/6. DIGITAL INNER RECORDER DIM/Element-25.webp" alt="Ai ADS" className="h-[5vw] w-auto" />
              </div>
              <div className="w-[1px] h-[3vw] bg-gray-500 opacity-50"></div>
              
              <div className="flex flex-col items-center justify-center w-[18%]">
                <img src="/dx360/6. DIGITAL INNER RECORDER DIM/Element-26.webp" alt="Ultra-High Resolution Display" className="h-[5vw] w-auto" />
              </div>
              <div className="w-[1px] h-[3vw] bg-gray-500 opacity-50"></div>
              
              <div className="flex flex-col items-center justify-center w-[18%]">
                <img src="/dx360/6. DIGITAL INNER RECORDER DIM/Element-27.webp" alt="Automotive Grade Display" className="h-[5vw] w-auto" />
              </div>
            </div>
          </div>

          {/* Sub-section 2: Split Features */}
          <div className="w-[90%] mx-auto flex flex-col items-center mt-[6vw] mb-[1.5vw]">
            <div className="w-full flex flex-row justify-center items-center gap-[2vw]">
              <div className="relative rounded-[1vw] overflow-hidden">
                <img src="/dx360/6. DIGITAL INNER RECORDER DIM/Element-28.webp" alt="Hardware" className="h-[24vw] w-auto block" />
              </div>
              <div className="relative rounded-[1vw] overflow-hidden">
                <img src="/dx360/6. DIGITAL INNER RECORDER DIM/Element-29.webp" alt="Coverage" className="h-[24vw] w-auto block" />
              </div>
            </div>
            {/* Paragraph below */}
            <div className="w-full mt-[4vw] text-left">
              <p className="text-gray-100 text-[1.1vw] leading-relaxed tracking-wider font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                Enjoy a clearer and safer rear view with a digital rearview mirror. Unlike traditional mirrors that can be blocked by passengers or luggage, the built-in rear camera provides a wide, unobstructed live view, reducing blind spots and improving driving safety in all weather conditions.
              </p>
            </div>
          </div>

          {/* Sub-section 3: Brightness Adjustment */}
          <div className="w-[90%] mx-auto flex flex-col items-center mt-[3vw] mb-[1.5vw]">
            <h3 className="text-white font-bold text-[1.8vw] mb-[1.5vw] tracking-widest text-center uppercase" style={{ fontFamily: 'Geometos, sans-serif' }}>
              AUTOMATIC BRIGHTNESS ADJUSTMENT
            </h3>
            <img src="/dx360/6. DIGITAL INNER RECORDER DIM/Element-30.webp" alt="Automatic Brightness" className="w-[85%] h-auto block mb-[1.5vw]" />
            <p className="w-[80%] text-center text-gray-100 text-[1.1vw] leading-relaxed tracking-wider font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
              The advanced ambient light sensor automatically detects surrounding lighting conditions and adjusts the screen brightness for optimal visibility and a more comfortable driving experience.
            </p>
          </div>

          {/* Sub-section 4: GPS & Wi-Fi */}
          <div className="w-full flex flex-row items-stretch justify-center mt-[3vw] mb-[4vw]">
            {/* Left side Phone graphic */}
            <div className="w-[50%] relative overflow-hidden z-10 shadow-2xl flex">
              <img src="/dx360/6. DIGITAL INNER RECORDER DIM/Element-31.webp" alt="App Connectivity" className="w-full h-auto block" />
            </div>
            
            {/* Right side Text */}
            <div className="w-[50%] flex flex-col justify-center gap-[4vw] bg-gradient-to-br from-black to-[#011e3d] py-[3vw] pr-[4vw] pl-[6vw] my-[3vw] -ml-[2vw] z-0 shadow-xl">
              <div>
                <h3 className="text-white font-bold text-[2.5vw] mb-[1vw] tracking-widest" style={{ fontFamily: 'Geometos, sans-serif' }}>BUILT-IN GPS</h3>
                <p className="text-gray-300 text-[1.2vw] leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>Records route, speed, and location data in real time.</p>
              </div>
              <div>
                <h3 className="text-white font-bold text-[2.5vw] mb-[1vw] tracking-widest" style={{ fontFamily: 'Geometos, sans-serif' }}>BUILT-IN WI-FI</h3>
                <p className="text-gray-300 text-[1.2vw] leading-relaxed font-light tracking-wide" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>Preview, download, and share recordings via the mobile app.</p>
              </div>
            </div>
          </div>
          
          {/* Learn More Button */}
          <div className="w-full flex justify-center mt-[2vw]">
            <a
              href="/products/360camera?filter=DRIVING%20RECORDING%20%26%20SAFETY"
              className="inline-block bg-[#4b4c53] hover:bg-[#5b5c63] text-white font-bold rounded-[0.6em] transition-all duration-300 transform hover:scale-105 text-center tracking-[0.2em]"
              style={{
                fontSize: '1vw',
                padding: '0.8em 2em'
              }}
            >
              LEARN MORE
            </a>
          </div>

        </div>
      </div>
    </>
  )
}