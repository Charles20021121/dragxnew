"use client"
import Image from 'next/image'

const images = {
  desktop: [
    {
      src: '/aboutus/PC.webp',
      aspect: '3333/1248'
    },
    {
      src: '/locations/PCmap.webp',
      aspect: '3334/1562'
    }
  ],
  mobile: [
    {
      src: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/iz0vkwimr8lwag91gxsf.webp',
      aspect: '3333/3034'
    },
    {
      src: '/locations/PHONEmap.webp',
      aspect: '3334/2929'
    }
  ]
}

export default function SpecialistImages() {
  return (
    <div className="mt-6">

      {/* Desktop Images */}
      {images.desktop.map((image, index) => (
        <div
          key={`desktop-${index}`}
          className="hidden md:block relative w-full overflow-hidden"
          style={{ aspectRatio: image.aspect }}
        >
          {image.src.startsWith('/') ? (
            <Image
              src={image.src}
              alt="Specialist Car"
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
            />
          ) : (
            <Image
              src={image.src}
              alt="Specialist Car"
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
            />
          )}

          {/* Text Overlay for the First Desktop Image */}
          {index === 0 && (
            <div className="absolute inset-0 flex flex-col justify-center items-start w-[65%] lg:w-[60%] pl-[8%]">
              <div className="relative w-[32vw] h-[8vw] mb-[3vw]">
                <Image src="/aboutus/DRAGX LOGO-01.png" alt="DragX Logo" fill className="object-contain object-left" />
              </div>
              <p className="text-gray-200 text-justify mb-[1.5vw] pr-[5%]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.05vw', lineHeight: '1.6' }}>
                Welcome to DragX! We're passionate about car customization, offering a wide range of high-quality accessories including interior upgrades, exterior enhancements, performance boosters, electronics, and entertainment systems. Our mission is to empower you to personalize your vehicle, elevating its aesthetics, comfort, and performance.
              </p>
              <p className="text-gray-200 text-justify mb-[1.5vw] pr-[5%]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.05vw', lineHeight: '1.6' }}>
                At DragX, we prioritize excellence in both products and services. Whether you're looking to enhance your car's sleekness, upgrade its interior for comfort, or boost its performance, we have the expertise and selection to meet your needs. Join us on a journey to transform your car into a true reflection of your style and personality.
              </p>
              <p className="text-gray-200 text-justify pr-[5%]" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.05vw', lineHeight: '1.6' }}>
                With DragX by your side, the possibilities are endless. Let's make your automotive dreams a reality!
              </p>
            </div>
          )}
        </div>
      ))}

      {/* Mobile Images */}
      {images.mobile.map((image, index) => (
        <div
          key={`mobile-${index}`}
          className="block md:hidden relative w-full overflow-hidden"
          style={{ aspectRatio: image.aspect }}
        >
          {image.src.startsWith('/') ? (
            <Image
              src={image.src}
              alt="Specialist Car"
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
            />
          ) : (
            <Image
              src={image.src}
              alt="Specialist Car"
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
            />
          )}
        </div>
      ))}
    </div>
  )
}