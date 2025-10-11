"use client"
import { CldImage } from 'next-cloudinary'
import Image from 'next/image'
import Link from 'next/link'
import styles from '@/css/Product.module.css'
import { motion } from "framer-motion";

const products = [
  {
    Name: "SOUNDPROOF",
    ImgUrl: "https://res.cloudinary.com/dmkxx68km/image/upload/v1739512778/i3nqmuukuo4nvq5puo6u.jpg",
    domainUrl: "/silence"
  },
  {
    Name: "ANDROID PLAYER",
    ImgUrl: "https://res.cloudinary.com/dmkxx68km/image/upload/c_limit,w_1920/f_auto/q_auto/v1720977941/lz4oh3mzwlmq7aiquwmf_f5e6ze?_a=BAVFB+DW0",
    domainUrl: "/products/androidplayer"
  },
  {
    Name: "AMBIENTLIGHT",
    ImgUrl: "https://res.cloudinary.com/dmkxx68km/image/upload/c_limit,w_1920/f_auto/q_auto/v1720977943/m75j3e1uy8kqdc0iiyzy_dnk0kb?_a=BAVFB+DW0",
    domainUrl: "/products/ambientlight"
  },
  {
    Name: "CONTI DECODER",
    ImgUrl: "https://res.cloudinary.com/dmkxx68km/image/upload/c_limit,w_1920/f_auto/q_auto/v1729013791/gcpdyz9k7cs9pgdcggen?_a=BAVFB+DW0",
    domainUrl: "/products/contidecoder"
  },
  {
    Name: "360CAMERA",
    ImgUrl: "/dx360/logo/dx360.jpg",
    domainUrl: "/dx360"
  },
  {
    Name: "POWER BOOT",
    ImgUrl: "https://res.cloudinary.com/dmkxx68km/image/upload/c_limit,w_1920/f_auto/q_auto/v1720977940/hhtep5dkd3wdixyn8fsv_rdiujs?_a=BAVFB+DW0",
    domainUrl: "/powerboot"
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ProductSection() {
  return (
    <section className="pb-5 pt-1 bg-[#fff4ec]">
      <div className="px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          variants={fadeInUp}
          className="bg-white rounded-[40px] border border-gray-200 shadow-sm p-6"
        >
          {/* Title with lines */}
          <div className="flex items-center justify-center mb-4">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
            <div className="mx-[2%]">

              <h2 className="text-[#1c5434] font-[900] text-center m-0 text-[clamp(12px,2vw,32px)] relative">
                Products
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#1c5434] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </h2>

            </div>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#023f1b] to-transparent w-[15%]" />
          </div>


          {/* Products Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-x-8 md:gap-y-12">
            {products.map((product, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                <Link href={product.domainUrl} className="w-full">
                  <div className="relative aspect-square rounded-lg md:rounded-2xl overflow-hidden group">
                    {product.ImgUrl.startsWith('/') ? (
                      <Image
                        width={600}
                        height={600}
                        src={product.ImgUrl}
                        sizes="100vw"
                        alt={product.Name}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <CldImage
                        width="600"
                        height="600"
                        src={product.ImgUrl}
                        sizes="100vw"
                        alt={product.Name}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                </Link>
                <h3 className="text-[#1c5434] text-[clamp(8px,1.5vw,18px)] md:text-[clamp(10px,2vw,18px)] font-black mt-2 md:mt-5 mb-0 text-center">
                  {product.Name}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 