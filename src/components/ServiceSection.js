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
  const services = [
    {
      id: 'entertainment',
      title: 'ENTERTAINMENT',
      description: 'These features enhance the driving experience, catering to the preferences and needs of both drivers and passengers.',
      icon: '/our service/ENTERTAINMENT.webp'
    },
    {
      id: 'safety',
      title: 'SAFETY',
      description: 'Choose safe car accessories, ensure proper installation and maintenance, and prioritize quality and compatibility for enhanced vehicle safety.',
      icon: '/our service/SAFETY.webp'
    },
    {
      id: 'comfort',
      title: 'COMFORT',
      description: 'The beauty of car comfort is in the seamless blend of design, comfort, and technology, enhancing both the look and feel of the driving experience.',
      icon: '/our service/COMFORT.webp'
    }
  ];

  return (
    <section className="relative -mt-5 md:-mt-20 pt-5 pb-10 bg-[#fff4ec] z-10 rounded-t-[20px]">
      {/* Title with lines */}
      <div className="flex items-center justify-center mb-6 md:mb-10 mt-2 md:mt-6">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
        <div className="mx-[3%]">
          <h2 className="text-[#1c5434] font-[900] text-center m-0 text-[clamp(24px,3vw,40px)] relative group cursor-default">
            Our Service
            <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#1c5434] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </h2>
        </div>
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-[1600px] mx-auto px-2 sm:px-6 lg:px-16"
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-20 lg:gap-32">
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={item}
              className="flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-44 md:h-44 lg:w-[195px] lg:h-[195px] mb-2 md:mb-5 drop-shadow-sm">
                <Image
                  src={service.icon}
                  alt={service.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-[#023f1b] font-[900] text-[10px] sm:text-sm md:text-2xl lg:text-3xl mb-1 md:mb-4 tracking-tight md:tracking-wide">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-[#3b5847] text-[8px] sm:text-[11px] md:text-base lg:text-lg leading-snug md:leading-relaxed font-medium px-1 md:px-4 lg:px-8 text-justify">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
} 