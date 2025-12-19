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
              src="/powerboot/Power boot page-01.webp"
              alt="DX Power Boot - Smart Electric Tailgate System with hands-free operation and advanced safety features"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
            <figcaption className="sr-only">
              DX Power Boot presents the ultimate smart electric tailgate solution. Experience the tagline 'Smart Boot, Smart Choice' with our innovative electric tailgate wake lift system that makes trunk operation effortless and intelligent.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/powerboot/Power boot page-02.webp"
              alt="Power Boot Smart Upgrade - Intelligent electric tailgate with 9 key features including anti-pinch protection"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Power Boot Smart Upgrade for Your Car: Comprehensive overview showing intelligent anti-pinch protection, wireless remote control, hand-to-one touch operation, mind control technology, optional outfit customization, voluntary easy warning system, abnormal easy warning, high memory storage, and simple operation interface.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/powerboot/Power boot page-03.webp"
              alt="Power Boot Convenience & Comfort - One-touch operation perfect for busy lifestyles and family use"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Convenience & Comfort: Demonstrates one-touch open/close functionality with remote control or car button operation. Perfect for users carrying shopping bags, luggage, or holding children, eliminating the need to manually lift heavy tailgates.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/powerboot/Power boot page-04.webp"
              alt="Power Boot Smart Integration - Advanced integration with car's central lock and foot-sensor activation"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Smart Integration: Shows how Power Boot integrates with your car's central lock and remote system. Features foot-sensor kick activation for hands-free operation, seamlessly connecting with existing vehicle systems for enhanced functionality.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/powerboot/Power boot page-05.webp"
              alt="Power Boot Safety & Protection - Anti-pinch technology preventing damage and ensuring user safety"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Safety & Protection: Highlights intelligent anti-pinch function that stops and reverses when obstacles are detected. Reduces risk of car damage during forceful closing and prevents accidental injuries to children or pets with advanced safety features.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/powerboot/Power boot page-06.webp"
              alt="Power Boot Adjustable Height - User-friendly customization for different users and garage clearances"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Adjustable Height & User-Friendly: Demonstrates customizable tailgate opening height to accommodate different users, prevent hitting low garage ceilings, and provide easy operation for elderly or shorter users with personalized settings.
            </figcaption>
          </figure>
        </>
      ) : (
        <>
          <figure className="relative">
            <Image
              unoptimized
              src="/powerboot/Power boot page-01.webp"
              alt="DX Power Boot - Smart Electric Tailgate System with hands-free operation and advanced safety features"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
            <figcaption className="sr-only">
              DX Power Boot presents the ultimate smart electric tailgate solution. Experience the tagline 'Smart Boot, Smart Choice' with our innovative electric tailgate wake lift system that makes trunk operation effortless and intelligent.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/powerboot/PHONE SIZE-02.webp"
              alt="Power Boot Smart Upgrade - Intelligent electric tailgate with 9 key features including anti-pinch protection"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Power Boot Smart Upgrade for Your Car: Comprehensive overview showing intelligent anti-pinch protection, wireless remote control, hand-to-one touch operation, mind control technology, optional outfit customization, voluntary easy warning system, abnormal easy warning, high memory storage, and simple operation interface.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/powerboot/PHONE SIZE-03.webp"
              alt="Power Boot Convenience & Comfort - One-touch operation perfect for busy lifestyles and family use"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Convenience & Comfort: Demonstrates one-touch open/close functionality with remote control or car button operation. Perfect for users carrying shopping bags, luggage, or holding children, eliminating the need to manually lift heavy tailgates.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/powerboot/PHONE SIZE-04.webp"
              alt="Power Boot Smart Integration - Advanced integration with car's central lock and foot-sensor activation"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Smart Integration: Shows how Power Boot integrates with your car's central lock and remote system. Features foot-sensor kick activation for hands-free operation, seamlessly connecting with existing vehicle systems for enhanced functionality.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/powerboot/PHONE SIZE-05.webp"
              alt="Power Boot Safety & Protection - Anti-pinch technology preventing damage and ensuring user safety"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Safety & Protection: Highlights intelligent anti-pinch function that stops and reverses when obstacles are detected. Reduces risk of car damage during forceful closing and prevents accidental injuries to children or pets with advanced safety features.
            </figcaption>
          </figure>
        </>
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