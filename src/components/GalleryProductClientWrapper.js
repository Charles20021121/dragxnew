"use client"
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import ImageModal from '@/components/ImageModal'

export default function GalleryProductClientWrapper({ category, product, allImagesArray }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)

  return (
    <div className=" bg-[#f8f4ec]">
      <div style={{ backgroundColor: '#f8f4ec', padding: '0 5% 0 5%' }}>
        {/* Breadcrumb */}
        <nav className="py-4 px-5">
          <ol className="flex items-center gap-2 text-xs whitespace-nowrap overflow-hidden">
            <li>
              <Link href="/" className="text-black hover:text-[#1c5434]">
                Home
              </Link>
            </li>
            <span>/</span>
            <li>
              <Link href="/gallery" className="text-black hover:text-[#1c5434]">
                Gallery
              </Link>
            </li>
            <span>/</span>
            <li>
              <Link
                href={`/gallery/${category}`}
                className="text-black hover:text-[#1c5434] capitalize"
              >
                {category}
              </Link>
            </li>
            <span>/</span>
            <li className="text-black capitalize truncate">
              {product.Name}
            </li>
          </ol>
        </nav>

        {/* Product Title - Desktop */}
        <div className="hidden md:flex justify-between items-center py-4 px-5">
          <h1 className="text-[clamp(12.5px,2vw,25px)] font-bold capitalize w-4/5">
            {product.Name}
          </h1>
        </div>

        {/* Main Content */}
        <div className="pb-5">
          <div className="bg-white rounded-t-3xl p-5">
            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="grid grid-cols-4 gap-2">
                {allImagesArray.map((image, index) => (
                  <div key={`${image.Id}-${index}`} className="flex flex-col gap-1">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative aspect-square cursor-pointer"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                         src={image.Url}
                        alt={image.Name || 'Product View'}
                        fill
                        className="object-cover rounded-lg hover:opacity-90 transition-opacity"
                        sizes="25vw"
                      />
                    </motion.div>

                    {image.link && image.link.trim() !== '' && (
                      <a
                        href={image.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#88bc04] text-white text-center py-1 rounded-lg text-[10px] font-bold hover:bg-[#6a9603] transition-colors uppercase tracking-wider"
                      >
                        MORE INFO
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="grid grid-cols-2 gap-2">
                {allImagesArray.map((image, index) => (
                  <div key={`${image.Id}-${index}`} className="flex flex-col gap-1">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative aspect-square cursor-pointer"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={image.Url}
                        alt={image.Name || 'Product View'}
                        fill
                        className="object-cover rounded-lg hover:opacity-90 transition-opacity"
                        sizes="33vw"
                      />
                    </motion.div>

                    {image.link && image.link.trim() !== '' && (
                      <a
                        href={image.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-[#88bc04] text-white text-center py-1 rounded-lg text-[10px] font-bold hover:bg-[#6a9603] transition-colors uppercase tracking-wider"
                      >
                        MORE INFO
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <ImageModal
            images={allImagesArray}
            currentIndex={selectedImageIndex}
            onClose={() => setSelectedImageIndex(null)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#f8f4ec] shadow-[0_5px_15px_rgba(0,0,0,1)] px-[5%] py-3 z-10">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <h2 className="text-[clamp(10px,2vw,20px)] font-bold capitalize truncate">
              {product.Name}
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
