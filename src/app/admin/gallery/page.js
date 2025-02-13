"use client"
import { motion } from "framer-motion"
import { CldImage } from 'next-cloudinary'
import Link from 'next/link'


const categories = [
  { Name: 'Alphard', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680828/lyeylq4n5vfrh5n39izv.webp', domainUrl: '/admin/gallery/alphard', alt: 'Alphard Gallery Image' },
  { Name: 'Vellfire', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680828/eeldtvtiwd3a8nmh50gk.webp', domainUrl: '/admin/gallery/vellfire', alt: 'Vellfire Gallery Image' },
  { Name: 'Audi', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680833/r9bx7381jafl517oyo23.webp', domainUrl: '/admin/gallery/audi', alt: 'Audi Gallery Image' },
  { Name: 'Mercedes-Benz', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680833/ltvgxtgdnfvpu6e5lifw.webp', domainUrl: '/admin/gallery/mercedes-benz', alt: 'Mercedes-Benz Gallery Image' },
  { Name: 'BMW', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680831/pjeo4wxziqxdxsjcfpbb.webp', domainUrl: '/admin/gallery/bmw', alt: 'BMW Gallery Image' },
  { Name: 'Ford', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680831/fi4zd6q7tys4z37rmtcn.webp', domainUrl: '/admin/gallery/ford', alt: 'Ford Gallery Image' },
  { Name: 'Honda', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680827/z38nzrmqjjm52uyfupuq.webp', domainUrl: '/admin/gallery/honda', alt: 'Honda Gallery Image' },
  { Name: 'Jaguar', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680834/urtqbjjenhfbemtjuoev.webp', domainUrl: '/admin/gallery/jaguar', alt: 'Jaguar Gallery Image' },
  { Name: 'LandRover', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680831/txytobry5qodcuaymata.webp', domainUrl: '/admin/gallery/landrover', alt: 'LandRover Gallery Image' },
  { Name: 'Lexus', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680861/z3ezkntpfrnyx5dcbwok.webp', domainUrl: '/admin/gallery/lexus', alt: 'Lexus Gallery Image' },
  { Name: 'Mini', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680827/flcw9sygebadae2tqmnr.webp', domainUrl: '/admin/gallery/mini', alt: 'Mini Gallery Image' },
  { Name: 'Perodua', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680827/pl7tjz6r3jabunajmlp8.webp', domainUrl: '/admin/gallery/perodua', alt: 'Perodua Gallery Image' },
  { Name: 'Porsche', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680827/wjhsc9vxhvtgm4xz9xbp.webp', domainUrl: '/admin/gallery/porsche', alt: 'Porsche Gallery Image' },
  { Name: 'Proton', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680828/hxpd5tkmctlyazsp9ewn.webp', domainUrl: '/admin/gallery/proton', alt: 'Proton Gallery Image' },
  { Name: 'Toyota', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680827/cvq1aoaa7hjrpj2gplly.webp', domainUrl: '/admin/gallery/toyota', alt: 'Toyota Gallery Image' },
  { Name: 'Volvo', ImgUrl: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1729680827/fsyzl1gxnzrwldyuwbhz.webp', domainUrl: '/admin/gallery/volvo', alt: 'Volvo Gallery Image' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function Gallery() {
  return (
    <div className="min-h-screen bg-[#f8f4ec]">


      <motion.div 
        className="py-10 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
                          <nav className="py-2 px-5">
          <ol className="flex items-center gap-2 text-xs whitespace-nowrap overflow-hidden">
            <li>
              <Link href="/admin/products" className="text-black hover:text-[#1c5434]">
                Admin Product
              </Link>
            </li>
            <span>|</span>
            <li>
              <Link href="/admin/gallery" className="text-black hover:text-[#1c5434]">
                Admin Gallery
              </Link>
            </li>
          </ol>
        </nav>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1800px] mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center"
            >
              <Link 
                href={category.domainUrl}
                className="w-full group"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <div className="relative aspect-[16/9]">
                    <CldImage
                      src={category.ImgUrl}
                      alt={category.alt || `${category.Name} Gallery Image`}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {/* 懸停時的遮罩 */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                </div>
              </Link>
              <motion.div 
                className="mt-4 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-[#1c5434] font-black text-[clamp(15px,2vw,18px)]">
                  {category.Name}
                </h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 