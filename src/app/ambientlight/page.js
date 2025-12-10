'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useProduct } from '@/contexts/ProductContext'

export default function AmbientLightPage() {
  const { setCurrentProduct } = useProduct()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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
              src="/ambientlight/pc/Ambient light PC-01.webp"
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
              src="/ambientlight/pc/Ambient light PC-07.webp"
              alt="Ambient Light Benefits"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
            <figcaption className="sr-only">
              Benefits and advantages of ambient light system.
            </figcaption>
          </figure>
        </>
      ) : (
        <>
          <figure className="relative">
            <Image
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
              src="/ambientlight/Phone/Ambient light Phone-07.webp"
              alt="Ambient Light Benefits"
              width={1200}
              height={800}
              className="w-full h-auto"
            />
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
