'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useProduct } from '@/contexts/ProductContext'

export default function PowerBootPage() {
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

  // 设置 Power Boot 产品信息给 WhatsApp 按钮使用
  useEffect(() => {
    setCurrentProduct({
      name: 'Power Boot - Smart Electric Tailgate System',
      category: 'powerboot',
      url: window.location.href,
      isListPage: false,
      isPowerBoot: true
    })

    return () => {
      setCurrentProduct(null)
    }
  }, [setCurrentProduct])

  const [pageUrl, setPageUrl] = useState('')

  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  const getWhatsAppUrl = (modelName) => {
    const phoneNumber = '60192776056'
    const message = `${pageUrl}\n\nHi Dragx, I'm interested in Power Boot for ${modelName}`

    if (isMobile) {
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    } else {
      return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    }
  }

  return (
    <>
      {isDesktop ? (
        <>
          <figure className="relative">
            <Image
              unoptimized
              src="/powerboot/pc/Power boot page-01.webp"
              alt="DX Power Boot - Smart Electric Tailgate System with hands-free operation and advanced safety features"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
            {/* Logo and Text Overlay */}
            <div className="absolute inset-0 flex flex-col pointer-events-none">
              <div className="absolute top-[6%] lg:top-[8%] left-[8%] lg:left-[10%] w-[25vw] md:w-[15vw] z-10">
                <Image
                  unoptimized
                  src="/powerboot/All logo PNG-05.png"
                  alt="DX Power Boot Logo"
                  width={400}
                  height={120}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="absolute inset-0 flex flex-col justify-center items-start px-[8%] lg:px-[10%] w-[60%]">
                <h1
                  className="font-bold text-white tracking-wide whitespace-nowrap"
                  style={{ fontFamily: 'Geometos, sans-serif', fontSize: '2.5vw', lineHeight: '1.2' }}
                >
                  SMART BOOT, SMART CHOICE
                </h1>
              </div>
            </div>

            <figcaption className="sr-only">
              DX Power Boot presents the ultimate smart electric tailgate solution. Experience the tagline 'Smart Boot, Smart Choice' with our innovative electric tailgate wake lift system that makes trunk operation effortless and intelligent.
            </figcaption>
          </figure>

          {/* Section 2: Smart Upgrade */}
          <section className="w-full bg-gradient-to-br from-[#2f0000] via-[#1a0000] to-black py-20 px-[5%] lg:px-[8%] relative overflow-hidden border-t border-red-900/30">
            <div className="max-w-[1400px] mx-auto flex flex-row items-center justify-between">
              {/* Left Side Product Image */}
              <div className="w-[45%] flex items-center justify-center relative">
                <Image src="/powerboot/product.webp" alt="Power Boot Product" width={800} height={800} className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
              </div>

              {/* Right Side Content */}
              <div className="w-[50%] flex flex-col items-start z-10 text-white">
                <div className="flex justify-start mb-2">
                  <div className="relative inline-block">
                    <div className="absolute top-1/2 left-[-5%] w-[110%] h-[80%] bg-gradient-to-r from-transparent via-red-600/90 to-transparent -translate-y-1/2 blur-[2px] pointer-events-none"></div>
                    <h2 className="relative z-10 inline-block font-bold tracking-wider text-[2.5vw] lg:text-[2vw] text-white drop-shadow-md" style={{ fontFamily: 'Geometos, sans-serif' }}>
                      POWER BOOT
                    </h2>
                  </div>
                </div>
                <h3 className="font-semibold tracking-wide text-[1.5vw] lg:text-[1.2vw] mb-6 text-white drop-shadow-sm">
                  SMART UPGRADE FOR YOUR CAR
                </h3>
                <p className="text-gray-200 text-[1vw] lg:text-[0.9vw] mb-10 text-justify leading-relaxed font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                  Upgrade your driving experience with Power Boot, the intelligent electric tailgate designed for comfort and safety. With just one touch—or even hands-free—you can open and close your tailgate effortlessly. Equipped with anti-pinch protection, adjustable height, and smart controls, Power Boot brings convenience, safety, and a premium feel to your car. Smooth, durable, and stylish, it's the upgrade that makes every journey easier.
                </p>

                {/* Icons Grid */}
                <div className="w-full space-y-8">
                  <div className="flex justify-between w-full">
                    {['02', '03', '04', '05', '06'].map(num => (
                      <div key={num} className="w-[18%] flex flex-col items-center group">
                        <Image unoptimized src={`/powerboot/icons/ICON-1-${num}.webp`} alt="Feature Icon" width={100} height={100} className="w-[50%] h-auto object-contain mb-3 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[0.7vw] lg:text-[0.6vw] text-center text-gray-300 whitespace-pre-line leading-tight font-light">
                          {num === '02' ? 'Intelligent\nAnti Pinch' : num === '03' ? 'Wireless\nRemote Control' : num === '04' ? 'Hand In One' : num === '05' ? 'Mind Control' : 'Optional\nOutfit'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-[8%] w-full">
                    {['07', '08', '09', '10'].map(num => (
                      <div key={num} className="w-[18%] flex flex-col items-center group">
                        <Image unoptimized src={`/powerboot/icons/ICON-1-${num}.webp`} alt="Feature Icon" width={100} height={100} className="w-[50%] h-auto object-contain mb-3 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[0.7vw] lg:text-[0.6vw] text-center text-gray-300 whitespace-pre-line leading-tight font-light">
                          {num === '07' ? 'Voluntary\nAdjustment' : num === '08' ? 'Abnormal\nEarly Warning' : num === '09' ? 'High Memory' : 'Simple Operation'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sections 3 & 4: Convenience & Smart Integration */}
          <section className="w-full bg-[#050000] py-16 relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-[5%] lg:px-[8%] flex flex-col gap-24">

              {/* Convenience & Comfort */}
              <div className="flex flex-row items-center justify-between relative z-10">
                {/* Left Side Content */}
                <div className="w-[45%] flex flex-col items-start text-white relative">
                  <div className="relative inline-block mb-8">
                    <div className="absolute top-1/2 left-[-10%] w-[130%] h-[120%] bg-gradient-to-r from-red-700/40 via-red-800/20 to-transparent -translate-y-1/2 blur-md pointer-events-none"></div>
                    <h2 className="relative z-10 font-bold tracking-wider text-[1.8vw] lg:text-[1.5vw] text-white drop-shadow-md whitespace-nowrap" style={{ fontFamily: 'Geometos, sans-serif' }}>
                      CONVENIENCE & COMFORT
                    </h2>
                  </div>
                  <div className="space-y-6 text-gray-300 text-[1.2vw] lg:text-[1vw] leading-relaxed font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                    <p>One-touch open/close with remote control<br />or car button.</p>
                    <p>No need to manually lift a heavy tailgate.</p>
                    <p>Suitable for users carrying shopping bags,<br />luggage, or holding children.</p>
                  </div>
                </div>

                {/* Right Side Image */}
                <div className="w-[48%] flex items-center justify-center relative">
                  <Image src="/powerboot/back/bag-car-trunk 1.webp" alt="Convenience and Comfort" width={800} height={600} className="w-full h-auto object-cover rounded-[16px] shadow-2xl shadow-black border border-white/5" />
                </div>
              </div>

              {/* Smart Integration */}
              <div className="flex flex-row items-center justify-between relative z-10">
                {/* Left Side Image */}
                <div className="w-[48%] flex items-center justify-center relative">
                  <Image src="/powerboot/back/bag-car-trunk 2.webp" alt="Smart Integration" width={800} height={600} className="w-full h-auto object-cover rounded-[16px] shadow-2xl shadow-black border border-white/5" />
                </div>

                {/* Right Side Content */}
                <div className="w-[45%] flex flex-col items-start text-white relative">
                  <div className="relative inline-block mb-8">
                    <div className="absolute top-1/2 right-[-10%] w-[130%] h-[120%] bg-gradient-to-l from-red-700/40 via-red-800/20 to-transparent -translate-y-1/2 blur-md pointer-events-none"></div>
                    <h2 className="relative z-10 font-bold tracking-wider text-[1.8vw] lg:text-[1.5vw] text-white drop-shadow-md whitespace-nowrap" style={{ fontFamily: 'Geometos, sans-serif' }}>
                      SMART INTEGRATION
                    </h2>
                  </div>
                  <div className="space-y-6 text-gray-300 text-[1.2vw] lg:text-[1vw] leading-relaxed font-light" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                    <p>Can Integrate with car's central<br />lock and remote system.</p>
                    <p>Some models allow foot-sensor kick<br />activation for hands-free operation.</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Sections 5 & 6: Safety & Adjustable Height */}
          <section className="w-full bg-[#1a0000] py-24 px-[5%] lg:px-[8%] relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto flex flex-col items-center">

              {/* Safety & Protection Title */}
              <div className="relative inline-block mb-4 text-center">
                <div className="absolute top-1/2 left-[-5%] w-[110%] h-[80%] bg-gradient-to-r from-transparent via-red-600/90 to-transparent -translate-y-1/2 blur-[2px] pointer-events-none"></div>
                <h2 className="relative z-10 font-bold tracking-wider text-[2vw] lg:text-[1.8vw] text-white drop-shadow-md whitespace-nowrap" style={{ fontFamily: 'Geometos, sans-serif' }}>
                  SAFETY & PROTECTION
                </h2>
              </div>
              <p className="text-gray-300 text-[1.2vw] lg:text-[1vw] mb-12 font-light tracking-wide text-center">
                Reduces risk of damaging the car when closing forcefully.
              </p>

              {/* Safety 1 & 2 Row (Side-by-Side) */}
              <div className="flex flex-row justify-center items-start w-full gap-8 lg:gap-12 mb-20">
                {/* Safety 1 */}
                <div className="flex flex-col items-center w-[45%] max-w-[600px]">
                  <div className="w-full relative rounded-[16px] overflow-hidden shadow-2xl shadow-black border border-white/5 mb-4">
                    <Image src="/powerboot/safty/safety 1.webp" alt="Anti-pinch function" width={800} height={500} className="w-full h-auto object-cover" />
                  </div>
                  <p className="text-gray-300 text-center text-[1.1vw] lg:text-[0.9vw] leading-relaxed font-light">
                    Intelligent anti-pinch function:<br />stops and reverses if an obstacle is detected.
                  </p>
                </div>

                {/* Safety 2 */}
                <div className="flex flex-col items-center w-[45%] max-w-[600px]">
                  <div className="w-full relative rounded-[16px] overflow-hidden shadow-2xl shadow-black border border-white/5 mb-4">
                    <Image src="/powerboot/safty/safety 2.webp" alt="Prevents accidental injuries" width={800} height={500} className="w-full h-auto object-cover" />
                  </div>
                  <p className="text-gray-300 text-center text-[1.1vw] lg:text-[0.9vw] leading-relaxed font-light">
                    Prevents accidental injuries to children or pets.
                  </p>
                </div>
              </div>

              {/* Adjustable Height Title */}
              <div className="relative inline-block mb-8 text-center">
                <div className="absolute top-1/2 left-[-5%] w-[110%] h-[80%] bg-gradient-to-r from-transparent via-red-600/90 to-transparent -translate-y-1/2 blur-[2px] pointer-events-none"></div>
                <h2 className="relative z-10 font-bold tracking-wider text-[2vw] lg:text-[1.8vw] text-white drop-shadow-md whitespace-nowrap" style={{ fontFamily: 'Geometos, sans-serif' }}>
                  ADJUSTABLE HEIGHT & USER-FRIENDLY
                </h2>
              </div>

              {/* Safety 3 */}
              <div className="flex flex-row items-center justify-center w-full gap-12 mb-8">
                {/* Left Side Image */}
                <div className="w-[45%] max-w-[500px] relative rounded-[16px] overflow-hidden shadow-2xl shadow-black border border-white/5">
                  <Image src="/powerboot/safty/safety 3.webp" alt="Adjustable height for users" width={800} height={500} className="w-full h-auto object-cover" />
                </div>

                {/* Right Side Text */}
                <div className="w-[45%] flex flex-col items-start space-y-6 text-left">
                  <p className="text-gray-300 text-[1.1vw] lg:text-[0.9vw] leading-relaxed font-light whitespace-nowrap" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                    Tailgate opening height can be adjusted to fit different users.
                  </p>
                  <p className="text-gray-300 text-[1.1vw] lg:text-[0.9vw] leading-relaxed font-light whitespace-nowrap" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                    Prevents hitting low garage ceilings.
                  </p>
                  <p className="text-gray-300 text-[1.1vw] lg:text-[0.9vw] leading-relaxed font-light whitespace-nowrap" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                    Easy for elderly or shorter users.
                  </p>
                </div>
              </div>

            </div>
          </section>
        </>
      ) : (
        <div className="flex flex-col w-full">
          <img src="/powerboot/phone/PHONE SIZE.webp" alt="Power Boot Hero" className="w-full h-auto block" />
          <img src="/powerboot/phone/PHONE SIZE-01.webp" alt="Smart Upgrade" className="w-full h-auto block" />
          <img src="/powerboot/phone/PHONE SIZE-02.webp" alt="Convenience and Comfort" className="w-full h-auto block" />
          <img src="/powerboot/phone/PHONE SIZE-03.webp" alt="Smart Integration" className="w-full h-auto block" />
          <img src="/powerboot/phone/PHONE SIZE-04.webp" alt="Safety and Adjustable Height" className="w-full h-auto block" />
        </div>
      )}

      <div className="bg-[#640000] text-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl font-bold tracking-[0.1em] mb-8 md:mb-12">SHOP BY CAR MODEL</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-y-12 md:gap-8 text-[0.8rem] tracking-[0.15em]">
            <div className="space-y-4 md:space-y-6 border-b md:border-b-0 pb-12 md:pb-0">
              <a href={getWhatsAppUrl('ANH10')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">ANH10</a>
              <a href={getWhatsAppUrl('ANH20')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">ANH20</a>
              <a href={getWhatsAppUrl('ANH30')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">ANH30</a>
              <a href={getWhatsAppUrl('TOYOTA ALPHARD/VELLFIRE ANH30')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">TOYOTA ALPHARD/VELLFIRE ANH30</a>
              <a href={getWhatsAppUrl('TOYOTA NOAH 2023')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">TOYOTA NOAH 2023</a>
            </div>
            <div className="space-y-4 md:space-y-6 border-b md:border-b-0 pb-12 md:pb-0">
              <a href={getWhatsAppUrl('BMW F10 2011-2017')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">BMW F10 2011-2017</a>
              <a href={getWhatsAppUrl('MERZ W205 2016-2019')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">MERZ W205 2016-2019</a>
              <a href={getWhatsAppUrl('MAZDA CX-5 2013-2016')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">MAZDA CX-5 2013-2016</a>
              <a href={getWhatsAppUrl('NISSAN SERENA C27 2015-2023')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">NISSAN SERENA C27 2015-2023</a>
              <a href={getWhatsAppUrl('NISSAN X-TRAIL 2015-2021')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">NISSAN X-TRAIL 2015-2021</a>
              <a href={getWhatsAppUrl('NISSAN ELGRAND 2017')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">NISSAN ELGRAND 2017</a>
            </div>
            <div className="space-y-4 md:space-y-6 border-b md:border-b-0 pb-12 md:pb-0">
              <a href={getWhatsAppUrl('HONDA CRV 2017')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">HONDA CRV 2017</a>
              <a href={getWhatsAppUrl('HONDA ODYSSEY 2015-2020')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">HONDA ODYSSEY 2015-2020</a>
              <a href={getWhatsAppUrl('HONDA HRV 2015-2021')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">HONDA HRV 2015-2021</a>
            </div>
            <div className="space-y-4 md:space-y-6 border-b md:border-b-0 pb-12 md:pb-0">
              <a href={getWhatsAppUrl('TOYOTA HARRIER 2015-2021')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">TOYOTA HARRIER 2015-2021</a>
              <a href={getWhatsAppUrl('TOYOTA VELOZ')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">TOYOTA VELOZ</a>
              <a href={getWhatsAppUrl('TOYOTA ESTIMA 2008-2020')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">TOYOTA ESTIMA 2008-2020</a>
              <a href={getWhatsAppUrl('TOYOTA VOXY')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">TOYOTA VOXY</a>
            </div>
            <div className="space-y-4 md:space-y-6">
              <a href={getWhatsAppUrl('PERODUA ARUZ')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">PERODUA ARUZ</a>
              <a href={getWhatsAppUrl('PERODUA ATIVA')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">PERODUA ATIVA</a>
              <a href={getWhatsAppUrl('PROTON X-70')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">PROTON X-70</a>
              <a href={getWhatsAppUrl('PROTON X-50')} target="_blank" rel="noopener noreferrer" className="block hover:text-gray-300">PROTON X-50</a>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content - Hidden from visual display but readable by search engines  */}
      <div className="sr-only">
        <h1>Power Boot - Smart Electric Tailgate System by DX Power Boot</h1>
        <h2>Electric Tailgate Wake Lift Easy - Smart Boot, Smart Choice</h2>

        <section>
          <h3>Power Boot Smart Upgrade for Your Car</h3>
          <p>Upgrade your driving experience with Power Boot, the intelligent electric tailgate designed for comfort and safety. With just one touch—or even hands-free—you can open and close your tailgate effortlessly. Equipped with anti-pinch protection, adjustable height, and smart controls, Power Boot brings convenience, safety, and a premium feel to your car. Smooth, durable, and stylish, it's the upgrade that makes every journey easier.</p>

          <div>
            <h4>Key Features:</h4>
            <ul>
              <li>Intelligent Anti-Pinch Protection</li>
              <li>Wireless Remote Control</li>
              <li>Hand to One Touch Operation</li>
              <li>Mind Control Technology</li>
              <li>Optional Outfit Customization</li>
              <li>Voluntary Easy Warning System</li>
              <li>Abnormal Easy Warning</li>
              <li>High Memory Storage</li>
              <li>Simple Operation Interface</li>
            </ul>
          </div>
        </section>

        <section>
          <h3>Convenience & Comfort</h3>
          <p>One-touch open/close with remote control or car button. No need to manually lift a heavy tailgate. Suitable for users carrying shopping bags, luggage, or holding children. Experience ultimate convenience with our smart electric tailgate system.</p>
        </section>

        <section>
          <h3>Smart Integration</h3>
          <p>Can integrate with car's central lock and remote system. Some models allow foot-sensor kick activation for hands-free operation. Seamlessly connects with your vehicle's existing systems for enhanced functionality.</p>
        </section>

        <section>
          <h3>Safety & Protection</h3>
          <p>Reduces risk of damaging the car when closing forcefully. Intelligent anti-pinch function stops and reverses if an obstacle is detected. Prevents accidental injuries to children or pets. Advanced safety features ensure peace of mind during operation.</p>
        </section>

        <section>
          <h3>Adjustable Height & User-Friendly</h3>
          <p>Tailgate opening height can be adjusted to fit different users. Prevents hitting low garage ceilings. Easy for elderly or shorter users. Customizable settings accommodate various needs and environments.</p>
        </section>

        <section>
          <h3>Compatible Vehicle Models</h3>
          <p>Our Power Boot system is available for a wide range of vehicle models including BMW, Mercedes-Benz, Mazda, Nissan, Honda, Toyota, Perodua, and Proton. Professional installation ensures perfect compatibility and optimal performance for your specific vehicle model.</p>
        </section>
      </div>
    </>
  )
}
