"use client"
import Image from 'next/image';
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ServiceSection() {
  const services = {
    desktop: [
      'https://res.cloudinary.com/dmkxx68km/image/upload/v1725422080/slfrg9tkismliphc6brl.png',
      'https://res.cloudinary.com/dmkxx68km/image/upload/v1725422081/bgw9ezkplypkpl13ytk3.png',
      'https://res.cloudinary.com/dmkxx68km/image/upload/v1725422080/yn4yehu7iamawkuvap98.png'
    ],
    mobile: [
      'https://res.cloudinary.com/dmkxx68km/image/upload/v1725541231/f6a8kk25tzfinll2vjtt.png',
      'https://res.cloudinary.com/dmkxx68km/image/upload/v1725541443/f6t7tqkagzblbgtxa9nz.png',
      'https://res.cloudinary.com/dmkxx68km/image/upload/v1725541594/zlytxnv5nrai5qxptqvu.png'
    ]
  };

  return (
    <section className="relative -mt-5 md:-mt-20 pt-5 bg-[#fff4ec] z-10 rounded-t-[20px]">
      {/* Title with lines */}
      <div className="flex items-center justify-center mb-4">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
        <div className="mx-[2%]">

          <h2 className="text-[#1c5434] font-[900] text-center m-0 text-[clamp(12px,2vw,32px)] relative">
            Our Service
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#1c5434] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </h2>

        </div>
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
      </div>

      {/* Desktop Images */}
      <div className="hidden md:block">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 md:gap-8 px-3"
        >
          {services.desktop.map((src, index) => (
            <motion.div
              key={`desktop-${index}`}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="relative pb-[68%]"
            >
              <Image
                src={src}
                alt={`Service ${index + 1}`}
                fill
                className="object-contain"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mobile Images */}
      <div className="block md:hidden px-3">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-2"
        >
          {services.mobile.map((src, index) => (
            <motion.div
              key={`mobile-${index}`}
              variants={item}
              className="relative"
            >
              <div className="relative w-full aspect-[457/537] overflow-hidden">
                <Image
                  src={src}
                  alt={`Service ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 