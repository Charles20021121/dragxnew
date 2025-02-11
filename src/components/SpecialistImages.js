"use client"
import { CldImage } from 'next-cloudinary'

const images = {
  desktop: [
    {
      src: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1725297683/yjdovrjq42rrvby6mghn.webp',
      aspect: '3333/1248'
    },
    {
      src: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1732875214/iqdgpdyiobmuiiu5hgd1.jpg',
      aspect: '3333/1562'
    }
  ],
  mobile: [
    {
      src: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1725539850/iz0vkwimr8lwag91gxsf.webp',
      aspect: '3333/3034'
    },
    {
      src: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1732874577/zigofkatcxkt9cqm4jew.jpg',
      aspect: '3333/2927'
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
          <CldImage
            src={image.src}
            alt="Specialist Car"
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Mobile Images */}
      {images.mobile.map((image, index) => (
        <div
          key={`mobile-${index}`}
          className="block md:hidden relative w-full overflow-hidden"
          style={{ aspectRatio: image.aspect }}
        >
          <CldImage
            src={image.src}
            alt="Specialist Car"
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
        </div>
      ))}
    </div>
  )
} 