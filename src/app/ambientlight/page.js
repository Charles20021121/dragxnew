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

  // 设置 Ambient Light 产品信息给 WhatsApp 按钮使用
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

  return (
    <>
      {isDesktop ? (
        <>
          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/pc/ambient-light-main.webp"
              alt="Ambient Light - Premium Car Interior Lighting System"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
            <figcaption className="sr-only">
              Ambient Light presents the ultimate car interior lighting solution for modern vehicles.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/pc/Ambient light PC-02.webp"
              alt="Ambient Light Features"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Ambient Light comprehensive features and customization options.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/pc/Ambient light PC-03.webp"
              alt="Ambient Light Color Options"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Wide range of color options for ambient lighting system.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/pc/Ambient light PC-04.webp"
              alt="Ambient Light Installation"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Professional installation of ambient light system.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/pc/Ambient light PC-05.webp"
              alt="Ambient Light Control"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Easy control and customization of ambient lighting.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/pc/Ambient light PC-06.webp"
              alt="Ambient Light Effects"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Stunning visual effects with ambient light system.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/pc/Ambient light PC-07.webp"
              alt="Ambient Light Benefits"
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
                <button className="bg-white/90 backdrop-blur-sm text-black px-6 md:px-10 py-2 md:py-4 rounded-xl font-bold text-xs md:text-lg hover:bg-gray-100 transition-all duration-300 uppercase tracking-widest border-2 border-black/10 shadow-2xl hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-95">
                  Contact Us With Your Car Model
                </button>
              </a>
            </div>
            <figcaption className="sr-only">
              Benefits and advantages of ambient light system.
            </figcaption>
          </figure>
        </>
      ) : (
        <>
          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/Phone/Ambient light Phone-01.webp"
              alt="Ambient Light - Premium Car Interior Lighting System"
              width={1200}
              height={800}
              className="w-full h-auto"
              priority
            />
            <figcaption className="sr-only">
              Ambient Light presents the ultimate car interior lighting solution for modern vehicles.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/Phone/Ambient light Phone-02.webp"
              alt="Ambient Light Features"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Ambient Light comprehensive features and customization options.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/Phone/Ambient light Phone-03.webp"
              alt="Ambient Light Color Options"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Wide range of color options for ambient lighting system.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/Phone/Ambient light Phone-04.webp"
              alt="Ambient Light Installation"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Professional installation of ambient light system.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/Phone/Ambient light Phone-05.webp"
              alt="Ambient Light Control"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Easy control and customization of ambient lighting.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/Phone/Ambient light Phone-06.webp"
              alt="Ambient Light Effects"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Stunning visual effects with ambient light system.
            </figcaption>
          </figure>

          <figure className="relative">
            <Image
              unoptimized
              src="/ambientlight/Phone/Ambient light Phone-07.webp"
              alt="Ambient Light Benefits"
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
                <button className="bg-white/90 backdrop-blur-sm text-black px-4 md:px-8 py-2 md:py-3 rounded-xl font-bold text-[10px] md:text-base hover:bg-gray-100 transition-all duration-300 uppercase tracking-widest border-2 border-black/10 shadow-2xl hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95">
                  Contact Us With Your Car Model
                </button>
              </a>
            </div>
            <figcaption className="sr-only">
              Benefits and advantages of ambient light system.
            </figcaption>
          </figure>
        </>
      )}

      {/* SEO Content - Hidden from visual display but readable by search engines */}
      <div className="sr-only">
        <h1>Ambient Light - Premium Car Interior Lighting System by DRAGX</h1>
        <h2>Transform Your Car Interior with Advanced Ambient Lighting</h2>

        <section>
          <h3>Ambient Light Premium System</h3>
          <p>Upgrade your vehicle's interior with Ambient Light, the premium car lighting system designed to create the perfect atmosphere. Our advanced RGB ambient lighting system offers customizable colors, effects, and brightness levels to match your mood and style.</p>

          <div>
            <h4>Key Features:</h4>
            <ul>
              <li>Full RGB Color Spectrum</li>
              <li>Multiple Lighting Effects</li>
              <li>Adjustable Brightness Levels</li>
              <li>Easy Control Interface</li>
              <li>Professional Installation</li>
              <li>Universal Compatibility</li>
              <li>Energy Efficient LED Technology</li>
              <li>Long-lasting Durability</li>
            </ul>
          </div>
        </section>

        <section>
          <h3>Customizable Lighting Experience</h3>
          <p>Create the perfect ambiance in your car with our wide range of colors and effects. From calming blue tones to vibrant rainbow effects, customize your car's interior lighting to match your personality and preferences.</p>
        </section>

        <section>
          <h3>Professional Installation</h3>
          <p>Our expert technicians ensure perfect installation of your ambient light system. We carefully install lighting strips in optimal locations throughout your vehicle's interior for maximum visual impact and aesthetic appeal.</p>
        </section>

        <section>
          <h3>Wide Vehicle Compatibility</h3>
          <p>Our Ambient Light system is compatible with most vehicle makes and models. Professional installation by DRAGX Malaysia ensures seamless integration with your vehicle's interior design.</p>
        </section>
      </div>
    </>
  )
}
