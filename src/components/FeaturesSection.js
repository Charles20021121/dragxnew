"use client"
import { CldImage } from 'next-cloudinary'

const features = [
  {
    src: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1720977970/ribv7ti1fp88lemo3kqg_yc5ttq.webp',
    alt: 'XTRAORDINARY'
  },
  {
    src: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1720977969/ihmfp6kd5pz24oqupuum_thcxb6.webp',
    alt: 'XPAND'
  },
  {
    src: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1720977968/ffj443gnct01sy9rm2lz_lic1fg.webp',
    alt: 'XCLUSIVE'
  }
]

export default function FeaturesSection() {
  return (
    <section className="py-10">

      {/* Title with lines */}
      <div className="flex items-center justify-center mb-4">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
        <div className="mx-[2%]">

          <h2 className="text-[#1c5434] font-[900] text-center m-0 text-[clamp(12px,2vw,32px)] relative">
            We Are Ready To Serve You!
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#1c5434] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </h2>

        </div>
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
      </div>

      <div className="max-w-[1800px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-white rounded-lg p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="flex justify-center items-center">
                <CldImage
                  src={feature.src}
                  alt={feature.alt}
                  width={800}
                  height={800}
                  className="w-full h-auto max-w-[600px] transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .feature-card {
          position: relative;
          overflow: hidden;
        }
        
        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #9FE870, #023f1b);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .feature-card:hover::before {
          transform: scaleX(1);
        }
      `}</style>
    </section>
  )
} 