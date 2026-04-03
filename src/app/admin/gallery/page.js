"use client"
import { motion } from "framer-motion"
import Image from 'next/image'
import Link from 'next/link'


const categories = [
  { Name: 'Alphard', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/lyeylq4n5vfrh5n39izv.webp', domainUrl: '/admin/gallery/alphard', alt: 'Alphard Gallery Image' },
  { Name: 'Vellfire', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/eeldtvtiwd3a8nmh50gk.webp', domainUrl: '/admin/gallery/vellfire', alt: 'Vellfire Gallery Image' },
  { Name: 'Audi', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/r9bx7381jafl517oyo23.webp', domainUrl: '/admin/gallery/audi', alt: 'Audi Gallery Image' },
  { Name: 'Mercedes-Benz', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ltvgxtgdnfvpu6e5lifw.webp', domainUrl: '/admin/gallery/mercedes-benz', alt: 'Mercedes-Benz Gallery Image' },
  { Name: 'BMW', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/pjeo4wxziqxdxsjcfpbb.webp', domainUrl: '/admin/gallery/bmw', alt: 'BMW Gallery Image' },
  { Name: 'Ford', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/fi4zd6q7tys4z37rmtcn.webp', domainUrl: '/admin/gallery/ford', alt: 'Ford Gallery Image' },
  { Name: 'Honda', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/z38nzrmqjjm52uyfupuq.webp', domainUrl: '/admin/gallery/honda', alt: 'Honda Gallery Image' },
  { Name: 'Jaguar', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/urtqbjjenhfbemtjuoev.webp', domainUrl: '/admin/gallery/jaguar', alt: 'Jaguar Gallery Image' },
  { Name: 'LandRover', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/txytobry5qodcuaymata.webp', domainUrl: '/admin/gallery/landrover', alt: 'LandRover Gallery Image' },
  { Name: 'Lexus', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/z3ezkntpfrnyx5dcbwok.webp', domainUrl: '/admin/gallery/lexus', alt: 'Lexus Gallery Image' },
  { Name: 'Mini', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/flcw9sygebadae2tqmnr.webp', domainUrl: '/admin/gallery/mini', alt: 'Mini Gallery Image' },
  { Name: 'Perodua', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/pl7tjz6r3jabunajmlp8.webp', domainUrl: '/admin/gallery/perodua', alt: 'Perodua Gallery Image' },
  { Name: 'Porsche', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/wjhsc9vxhvtgm4xz9xbp.webp', domainUrl: '/admin/gallery/porsche', alt: 'Porsche Gallery Image' },
  { Name: 'Proton', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/hxpd5tkmctlyazsp9ewn.webp', domainUrl: '/admin/gallery/proton', alt: 'Proton Gallery Image' },
  { Name: 'Toyota', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/cvq1aoaa7hjrpj2gplly.webp', domainUrl: '/admin/gallery/toyota', alt: 'Toyota Gallery Image' },
  { Name: 'Volvo', ImgUrl: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/fsyzl1gxnzrwldyuwbhz.webp', domainUrl: '/admin/gallery/volvo', alt: 'Volvo Gallery Image' },
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
                    <Image
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