'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useProduct } from '@/contexts/ProductContext'

export default function AmbientLightPage() {
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
      ? `${pageUrl}\n\nHi Dragx, I'm interested in Ambient Light for ${modelName}`
      : `${pageUrl}\n\nHi Dragx, I'm interested in Ambient Light for [Type Your Car Model Here]`

    if (isMobile) {
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    } else {
      return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    }
  }

  useEffect(() => {
    setCurrentProduct({
      name: 'Ambient Light - Premium Car Interior Lighting System',
      category: 'ambientlight',
      url: window.location.href,
      isListPage: false,
      isAmbientLight: true
    })

    return () => {
      setCurrentProduct(null)
    }
  }, [setCurrentProduct])

  const pcImages = [
    '/ambientlight/pc/ambient-light-car-interior-hero.webp',
    '/ambientlight/pc/ambient-light-aesthetics-luxury-design.webp',
    '/ambientlight/pc/ambient-light-personalization-color-control.webp',
    '/ambientlight/pc/ambient-light-visibility-safety-features.webp',
    '/ambientlight/pc/ambient-light-oem-integration-background.webp',
    '/ambientlight/pc/ambient-light-universal-installation-background.webp',
    '/ambientlight/pc/ambient-light-customized-car-model-background.webp',
  ]

  const mobileImages = [
    '/ambientlight/pc/phone/ambient-light-car-interior-hero-mobile.webp',
    '/ambientlight/pc/phone/ambient-light-aesthetics-luxury-design-mobile.webp',
    '/ambientlight/pc/phone/ambient-light-personalization-color-control-mobile.webp',
    '/ambientlight/pc/phone/ambient-light-visibility-safety-features-mobile.webp',
    '/ambientlight/pc/phone/ambient-light-oem-integration-background-mobile.webp',
    '/ambientlight/pc/phone/ambient-light-universal-installation-background-mobile.webp',
    '/ambientlight/pc/phone/ambient-light-customized-car-model-background-mobile.webp',
  ]


  return (
    <div className="w-full bg-black min-h-screen">
      <div className="w-full flex flex-col">
        {pcImages.map((src, index) => (
          <div key={`pc-${index}`} className="relative w-full">
            {/* Desktop Background */}
            <Image
              unoptimized
              src={src}
              alt={src.split('/').pop().replace(/-/g, ' ').replace('.webp', '')}
              width={1920}
              height={1080}
              className="hidden md:block w-full h-auto"
              priority={index === 0}
            />
            {/* Mobile Background */}
            <Image
              unoptimized
              src={mobileImages[index]}
              alt={mobileImages[index].split('/').pop().replace(/-/g, ' ').replace('.webp', '')}
              width={1080}
              height={1920}
              className="block md:hidden w-full h-auto"
              priority={index === 0}
            />
            <div className="absolute inset-0 flex flex-col">
              {index === 0 && (
                <>
                  <div className="absolute top-[4%] lg:top-[6%] left-[10%] w-[15vw] md:w-[18vw] lg:w-[15vw] z-10">
                    <Image
                      unoptimized
                      src="/ambientlight/pc/All logo PNG-01.png"
                      alt="DX Ambient Light Logo"
                      width={400}
                      height={120}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-center items-start px-[10%] w-[45%]">
                  <h1
                    className="font-bold text-white mb-2 lg:mb-4 tracking-wide whitespace-nowrap"
                    style={{ fontFamily: 'Geometos, sans-serif', fontSize: '2.4vw', lineHeight: '1.1' }}
                  >
                    CAR AMBIENT LIGHT
                  </h1>
                  <h2
                    className="text-white mb-4 lg:mb-6"
                    style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.25vw', lineHeight: '1.4' }}
                  >
                    Illuminate Your Drive. Redefine Your Style.
                  </h2>
                  <p
                    className="text-gray-200 text-justify"
                    style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.25vw', lineHeight: '1.5' }}
                  >
                    Car ambient lighting brings elegance, comfort, and personality into your vehicle interior. Designed with subtle, low-intensity illumination, it transforms ordinary cabins into premium, mood-enhancing spaces.
                  </p>
                </div>
                </>
              )}

              {index === 1 && (
                <div className="absolute inset-0 flex flex-col justify-start md:justify-center items-start md:items-end pt-[15%] md:pt-0 px-[8%] md:px-[10%]">
                  <div className="w-[90%] md:w-[45%] flex flex-col items-start">
                    <h1
                      className="font-bold text-white mb-2 lg:mb-4 tracking-wide whitespace-nowrap text-[6vw] md:text-[2.4vw]"
                      style={{ fontFamily: 'Geometos, sans-serif', lineHeight: '1.1' }}
                    >
                      AESTHETICS & LUXURY
                    </h1>
                    <p
                      className="text-gray-200 text-left md:text-justify text-[3.5vw] md:text-[1.25vw]"
                      style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.5' }}
                    >
                      Enhance your car's interior with soft, modern illumination that reflects the feel of a premium vehicle.
                    </p>
                  </div>
                </div>
              )}

              {index === 2 && (
                <div className="absolute inset-0 flex flex-col md:flex-row justify-start md:justify-center items-center pt-[5%] md:pt-0 px-[4%] md:px-[10%]">
                  {/* Left (Top on Mobile) */}
                  <div className="flex flex-col items-center text-center w-full md:w-[55%] mb-2 md:mb-0">
                    <h1
                      className="font-bold text-white mb-1 md:mb-4 tracking-wide whitespace-nowrap text-[5vw] md:text-[2.4vw]"
                      style={{ fontFamily: 'Geometos, sans-serif', lineHeight: '1.1' }}
                    >
                      PERSONALIZATION
                    </h1>
                    <p
                      className="text-gray-200 mb-3 md:mb-10 text-[2.5vw] md:text-[1.15vw]"
                      style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.5' }}
                    >
                      Customize colors, brightness, and lighting effects<br className="block md:hidden" /> through your infotainment system or mobile app<br /> — match your mood, music, or style
                    </p>

                    <div className="flex flex-col items-center gap-2 md:gap-4 w-full">
                      <div className="flex justify-center gap-2 md:gap-6 w-full px-4 md:px-0">
                        <div className="rounded-[40px] p-[1.5px] bg-gradient-to-r from-yellow-400 via-orange-500 to-purple-600 w-[46%] md:w-[45%]">
                          <div className="bg-black/60 rounded-[40px] h-full px-2 md:px-4 py-1.5 md:py-2 flex items-center justify-center">
                            <span className="text-white text-center text-[2vw] md:text-[1vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.3' }}>
                              Flowing Or<br />Breathing Transitions
                            </span>
                          </div>
                        </div>
                        <div className="rounded-[40px] p-[1.5px] bg-gradient-to-r from-orange-400 to-purple-600 w-[46%] md:w-[45%]">
                          <div className="bg-black/60 rounded-[40px] h-full px-2 md:px-4 py-1.5 md:py-2 flex items-center justify-center">
                            <span className="text-white text-center text-[2vw] md:text-[1vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.3' }}>
                              Music-Synchronized<br />Color Changes
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-[40px] p-[1.5px] bg-gradient-to-r from-yellow-500 to-purple-600 w-[55%] md:w-[45%] mt-0 md:mt-2">
                        <div className="bg-black/60 rounded-[40px] h-full px-2 md:px-4 py-1.5 md:py-2 flex items-center justify-center">
                          <span className="text-white text-center text-[2vw] md:text-[1vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.3' }}>
                            Adjustable Brightness<br />And Animation Speed
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right (Bottom on Mobile) */}
                  <div className="w-full md:w-[45%] flex flex-col justify-center items-center mt-2 md:mt-0">
                    <div className="relative w-[90%] md:w-full mb-2 md:mb-6">

                      <Image
                        unoptimized
                        src="/ambientlight/pc/ambient-light-smartphone-app-control-interface.webp"
                        alt="Ambient Light Smartphone Bluetooth App Control Interface"
                        width={800}
                        height={600}
                        className="w-full h-auto object-contain drop-shadow-2xl"
                      />
                    </div>
                    <h3
                      className="font-bold text-white tracking-wide text-center w-full whitespace-nowrap text-[3.2vw] md:text-[4vw] lg:text-[1.2vw]"
                      style={{ fontFamily: 'Geometos, sans-serif' }}
                    >
                      Bluetooth Connection Of Your Phone APP Control
                    </h3>
                  </div>
                </div>
              )}

              {index === 3 && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <h1
                    className="absolute top-[8%] lg:top-[5%] font-bold text-white tracking-wide text-center text-[6vw] md:text-[2.4vw]"
                    style={{ fontFamily: 'Geometos, sans-serif', lineHeight: '1.2' }}
                  >
                    ENHANCED VISIBILITY<br className="block md:hidden" /> AND SAFETY
                  </h1>
                  <p
                    className="absolute bottom-[8%] lg:bottom-[5%] text-gray-200 text-left md:text-center italic w-full px-[8%] md:px-[10%] text-[3.5vw] md:text-[1.25vw]"
                    style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.5' }}
                  >
                    Provides soft illumination to help occupants find controls and items in the dark<br className="hidden md:block" />without distraction, reducing eye strain and keeping the driver focused.
                  </p>
                </div>
              )}

              {index === 4 && (
                <div className="absolute inset-0 flex flex-col items-center justify-between py-[8%] md:py-[6%] lg:py-[5%] px-[5%] lg:px-[10%]">
                  {/* Top Header */}
                  <div className="flex flex-col items-center text-center w-full">
                    <h1
                      className="font-bold text-white mb-1 md:mb-2 tracking-wide whitespace-nowrap text-[6vw] md:text-[2.4vw]"
                      style={{ fontFamily: 'Geometos, sans-serif', lineHeight: '1.1' }}
                    >
                      OEM AMBIENT LIGHT
                    </h1>
                    <p
                      className="text-gray-200 text-[2.8vw] md:text-[1.25vw] px-[4%] md:px-0"
                      style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.5' }}
                    >
                      OEM (Original Equipment Manufacturer) ambient light is designed of the car's original interior.
                    </p>
                  </div>

                  {/* 3 Cards */}
                  <div className="flex flex-wrap md:flex-nowrap justify-between md:justify-center items-start w-full gap-y-4 md:gap-[4%] mt-[2%] mb-[2%]">
                    {/* Card 1 */}
                    <div className="flex flex-col w-[48%] md:w-1/3">
                      <Image
                        unoptimized
                        src="/ambientlight/pc/oem/oem-ambient-light-dashboard-seamless-integration.webp"
                        alt="OEM Ambient Light Dashboard Seamless Integration"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-[10px] md:rounded-[20px] drop-shadow-xl mb-2 md:mb-4"
                      />
                      <h3 className="font-bold text-white mb-1 md:mb-2 text-center text-[3.2vw] md:text-[1.4vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                        Seamless Integration
                      </h3>
                      <p className="text-gray-300 text-left md:text-justify text-[2.2vw] md:text-[0.95vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.4' }}>
                        Perfectly blended into the vehicle's design, wiring, and trim for a factory look.
                      </p>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col w-[48%] md:w-1/3">
                      <Image
                        unoptimized
                        src="/ambientlight/pc/oem/oem-ambient-light-infotainment-smart-control.webp"
                        alt="OEM Ambient Light Infotainment Smart Control"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-[10px] md:rounded-[20px] drop-shadow-xl mb-2 md:mb-4"
                      />
                      <h3 className="font-bold text-white mb-1 md:mb-2 text-center text-[3.2vw] md:text-[1.4vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                        Smart Control
                      </h3>
                      <p className="text-gray-300 text-left md:text-justify text-[2.2vw] md:text-[0.95vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.4' }}>
                        Operated through the car's native infotainment or dashboard controls, synchronized with car functions like door open, climate, or safety alerts.
                      </p>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col w-[55%] md:w-1/3 mx-auto mt-2 md:mt-0">
                      <Image
                        unoptimized
                        src="/ambientlight/pc/oem/oem-ambient-light-door-trim-premium-quality.webp"
                        alt="OEM Ambient Light Door Trim Premium Quality"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-[10px] md:rounded-[20px] drop-shadow-xl mb-2 md:mb-4"
                      />
                      <h3 className="font-bold text-white mb-1 md:mb-2 text-center text-[3.2vw] md:text-[1.4vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                        Premium Quality
                      </h3>
                      <p className="text-gray-300 text-center md:text-justify text-[2.2vw] md:text-[0.95vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.4' }}>
                        Uses automotive-grade fiber optics for smooth, uniform illumination with no visible LEDs.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Footer */}
                  <p
                    className="text-gray-200 text-center text-[2.8vw] md:text-[1.25vw] w-full px-[5%] md:px-0"
                    style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.5' }}
                  >
                    Drivers Who Prioritize Factory-Level Design, Quality, And Seamless Integration.
                  </p>
                </div>
              )}

              {index === 5 && (
                <div className="absolute inset-0 flex flex-col items-center justify-between py-[8%] md:py-[6%] lg:py-[5%] px-[5%] lg:px-[10%]">
                  {/* Top Header */}
                  <div className="flex flex-col items-center text-center w-full">
                    <h1
                      className="font-bold text-white mb-1 md:mb-2 tracking-wide whitespace-nowrap text-[6vw] md:text-[2.4vw]"
                      style={{ fontFamily: 'Geometos, sans-serif', lineHeight: '1.1' }}
                    >
                      UNIVERSAL AMBIENT LIGHT
                    </h1>
                    <p
                      className="text-gray-200 text-[2.8vw] md:text-[1.25vw] px-[4%] md:px-0"
                      style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.5' }}
                    >
                      Universal (aftermarket) ambient light systems can be installed in almost any vehicle<br className="hidden md:block" />offering flexibility, creativity, and affordability.
                    </p>
                  </div>

                  {/* 3 Cards */}
                  <div className="flex flex-wrap md:flex-nowrap justify-between md:justify-center items-start w-full gap-y-4 md:gap-[4%] mt-[2%] mb-[2%]">
                    {/* Card 1 */}
                    <div className="flex flex-col w-[48%] md:w-1/3">
                      <Image
                        unoptimized
                        src="/ambientlight/pc/universal/universal-ambient-light-bluetooth-app-control.webp"
                        alt="Universal Ambient Light Bluetooth App Control"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-[10px] md:rounded-[20px] drop-shadow-xl mb-2 md:mb-4"
                      />
                      <h3 className="font-bold text-white mb-1 md:mb-2 text-center text-[3.2vw] md:text-[1.4vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                        Flexible Control
                      </h3>
                      <p className="text-gray-300 text-left md:text-justify text-[2.2vw] md:text-[0.95vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.4' }}>
                        Operated via remote Bluetooth app
                      </p>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col w-[48%] md:w-1/3">
                      <Image
                        unoptimized
                        src="/ambientlight/pc/universal/universal-ambient-light-installation-prying-tool.webp"
                        alt="Universal Ambient Light Installation Prying Tool"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-[10px] md:rounded-[20px] drop-shadow-xl mb-2 md:mb-4"
                      />
                      <h3 className="font-bold text-white mb-1 md:mb-2 text-center text-[3.2vw] md:text-[1.4vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                        Wide Range of Styles
                      </h3>
                      <p className="text-gray-300 text-left md:text-justify text-[2.2vw] md:text-[0.95vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.4' }}>
                        From simple LED strips to high-end fiber-optic kits that mimic OEM quality.
                      </p>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col w-[55%] md:w-1/3 mx-auto mt-2 md:mt-0">
                      <Image
                        unoptimized
                        src="/ambientlight/pc/universal/universal-ambient-light-wiring-plug-and-play.webp"
                        alt="Universal Ambient Light Wiring Plug and Play"
                        width={600}
                        height={400}
                        className="w-full h-auto rounded-[10px] md:rounded-[20px] drop-shadow-xl mb-2 md:mb-4"
                      />
                      <h3 className="font-bold text-white mb-1 md:mb-2 text-center text-[3.2vw] md:text-[1.4vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                        DIY or Professional Install
                      </h3>
                      <p className="text-gray-300 text-center md:text-justify text-[2.2vw] md:text-[0.95vw]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.4' }}>
                        Plug-and-play setup; more advanced systems can be neatly wired behind panels.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Footer */}
                  <p
                    className="text-gray-200 text-center text-[2.8vw] md:text-[1.25vw] w-full px-[5%] md:px-0"
                    style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', lineHeight: '1.5' }}
                  >
                    Drivers Who Want Maximum Customization, Creative Lighting Effects, And Easy Installation At A Lower Cost.
                  </p>
                </div>
              )}

              {index === 6 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center py-[8%] md:py-[6%] lg:py-8 px-[5%] lg:px-[10%]">
                  {/* Title */}
                  <h1
                    className="font-bold text-white tracking-wide text-center whitespace-nowrap mb-6 lg:mb-12 text-[4.5vw] md:text-[3vw] lg:text-[2.4vw]"
                    style={{ fontFamily: 'Geometos, sans-serif', lineHeight: '1.2' }}
                  >
                    CUSTOMIZED BASED ON<br className="block md:hidden" /> YOUR CAR MODEL
                  </h1>

                  {/* Logo Grid */}
                  <div className="grid grid-cols-4 lg:grid-cols-8 gap-y-4 md:gap-y-6 lg:gap-y-10 gap-x-2 lg:gap-x-[1vw] w-full lg:w-[95%] items-center justify-items-center mb-8 lg:mb-14">
                    {[
                      'perodua-ambient-light-upgrade', 'proton-ambient-light-upgrade', 'toyota-ambient-light-upgrade', 'honda-ambient-light-upgrade',
                      'vellfire-ambient-light-upgrade', 'alphard-ambient-light-upgrade', 'bmw-ambient-light-upgrade', 'mercedes-benz-ambient-light-upgrade',
                      'audi-ambient-light-upgrade', 'lexus-ambient-light-upgrade', 'mini-cooper-ambient-light-upgrade', 'volvo-ambient-light-upgrade',
                      'jaguar-ambient-light-upgrade', 'land-rover-ambient-light-upgrade', 'ford-ambient-light-upgrade', 'porsche-ambient-light-upgrade'
                    ].map((name, i) => (
                      <div key={i} className="flex justify-center items-center w-full h-[6vh] lg:h-[9vh] px-1">
                        <Image
                          unoptimized
                          src={`/ambientlight/pc/brand/${name}.webp`}
                          alt={`${name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
                          width={200}
                          height={120}
                          className="w-full h-full object-contain hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => window.open(getWhatsAppUrl('Hi, I want to inquire about ambient lighting for my car.'), '_blank')}
                    className="bg-white hover:bg-gray-200 transition-colors text-black font-bold py-2 md:py-3 lg:py-4 px-4 md:px-8 lg:px-12 rounded-lg lg:rounded-xl tracking-wider shadow-xl text-[2.8vw] md:text-[1.8vw] lg:text-[1.2vw] whitespace-nowrap mb-[5%] md:mb-0"
                    style={{ fontFamily: 'Geometos, sans-serif' }}
                  >
                    CONTACT US WITH YOUR CAR MODEL
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* SEO Content - Hidden from visual display but readable by search engines */}
      <div className="sr-only">
        <h1>Ambient Light - Premium Car Interior Lighting System by DRAGX</h1>
        <h2>Transform Your Car Interior with Advanced Ambient Lighting</h2>
        <section>
          <h3>Ambient Light Premium System</h3>
          <p>Upgrade your vehicle's interior with Ambient Light, the premium car lighting system designed to create the perfect atmosphere. Our advanced RGB ambient lighting system offers customizable colors, effects, and brightness levels to match your mood and style.</p>
        </section>
      </div>
    </div>
  )
}

