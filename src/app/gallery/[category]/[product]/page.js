"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CldImage } from 'next-cloudinary'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from '@/components/LoadingSpinner'
import ImageModal from '@/components/ImageModal'

export default function GalleryProductPage() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [relatedImages, setRelatedImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 獲取主產品數據
        const productRes = await fetch(`/api/gallery/${params.category}/${params.product}`, { cache: 'no-store' })
        if (!productRes.ok) throw new Error('Network response was not ok')
        const productData = await productRes.json()
        setProduct(productData)

        // 獲取相同 same 值的所有產品
        const imagesRes = await fetch(`/api/gallery/related?same=${productData.same}`, { cache: 'no-store' })
        if (!imagesRes.ok) throw new Error('Network response was not ok')
        const imagesData = await imagesRes.json()
        const validImages = imagesData.filter(img => img.Url && img.Url.trim() !== '')
        setRelatedImages(validImages)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    if (params.category && params.product) {
      fetchData()
    }
  }, [params.category, params.product])

  if (loading) return <LoadingSpinner />
  if (!product || !product.Url) return null

  // Logic to strictly identify Master Record (Id == same)
  const masterId = String(product.same || product.Id);
  const masterImage = relatedImages.find(img => String(img.Id) === masterId);

  // All other images sorted by date DESC (newest first)
  const otherImages = relatedImages
    .filter(img => String(img.Id) !== masterId)
    .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0));

  let allImagesArray = [];

  // Special case: for alphard-vellfire, hide the Main Image (Master Record)
  if (params.category === 'alphard-vellfire') {
    allImagesArray = otherImages;
  } else {
    // For others, Lock Main Image (Master Record) at the top
    if (masterImage) {
      allImagesArray = [masterImage, ...otherImages];
    } else {
      // Fallback if master not found for some reason
      allImagesArray = otherImages;
    }
  }

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
                href={`/gallery/${params.category}`}
                className="text-black hover:text-[#1c5434] capitalize"
              >
                {params.category}
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
              <div className="grid grid-cols-4 gap-4">
                {allImagesArray.map((image, index) => (
                  <div key={`${image.Id}-${index}`} className="flex flex-col gap-2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative aspect-square cursor-pointer"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <CldImage
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
                        className="block w-full bg-[#88bc04] text-white text-center py-2 rounded-lg text-xs font-bold hover:bg-[#6a9603] transition-colors uppercase tracking-wider"
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
              <div className="grid grid-cols-2 gap-4">
                {allImagesArray.map((image, index) => (
                  <div key={`${image.Id}-${index}`} className="flex flex-col gap-2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative aspect-square cursor-pointer"
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <CldImage
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
                        className="block w-full bg-[#88bc04] text-white text-center py-2 rounded-lg text-xs font-bold hover:bg-[#6a9603] transition-colors uppercase tracking-wider"
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