"use client"
import { CldImage } from 'next-cloudinary'
import Image from 'next/image'

const images = {
  desktop: [
    {
      src: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1725297683/yjdovrjq42rrvby6mghn.webp',
      aspect: '3333/1248'
    },
    {
      src: '/locations/PCmap.webp',
      aspect: '3334/1562'
    }
  ],
  mobile: [
    {
      src: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1725539850/iz0vkwimr8lwag91gxsf.webp',
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
            <CldImage
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
            <CldImage
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