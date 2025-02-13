"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CldImage } from 'next-cloudinary'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function GalleryProductPage() {
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [relatedImages, setRelatedImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 獲取主產品數據
        const productRes = await fetch(`/api/gallery/${params.category}/${params.product}`)
        if (!productRes.ok) throw new Error('Network response was not ok')
        const productData = await productRes.json()
        setProduct(productData)

        // 獲取相同 same 值的所有產品
        const imagesRes = await fetch(`/api/gallery/related?same=${productData.same}`)
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

  // 確保主圖有有效的 URL
  const mainImage = product

  // 所有相關圖片按日期排序
  const allImages = relatedImages
    .filter(img => img.Id !== product.Id)
    .sort((a, b) => {
      const dateA = new Date(a.date || 0)
      const dateB = new Date(b.date || 0)
      return dateA - dateB
    })

  // 圖片模態框組件
  const ImageModal = ({ image, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
        className="relative w-[90vw] h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <CldImage
          src={image.Url}
          alt={image.Name || 'Gallery Image'}
          fill
          className="object-contain"
          sizes="90vw"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )

  return (
    <div className=" bg-[#f8f4ec]">
      <div style={{ backgroundColor: '#f8f4ec', padding: '0 5% 0 5%' }}>
        {/* Breadcrumb */}
        <nav className="py-2 px-5">
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

        {/* Product Title & Shop Now Button - Desktop */}
        <div className="hidden md:flex justify-between items-center py-4 px-5">
          <h1 className="text-[clamp(12.5px,2vw,25px)] font-bold capitalize w-4/5">
            {product.Name}
          </h1>

          <div className="rounded-full flex overflow-hidden">
            <a
              href={product.buy}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#88bc04] text-white text-xs font-bold px-6 py-1.5 hover:bg-[#7aa703] transition-colors duration-300 relative"
            >
              Shop Now
              <span className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-[1px] bg-white"></span>
            </a>
            <a
              href="https://wa.me/60192776056?text=Hi Dragx, Can you recommend a product that suits my needs?"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#709c44] text-white text-xs font-bold px-6 py-1.5 hover:bg-[#648c3d] transition-colors duration-300 relative"
            >
              Chat Now
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[1px] bg-white"></span>
            </a>
          </div>
        </div>


        {/* Main Content */}
        <div className="pb-5">
          <div className="bg-white rounded-t-3xl p-5">
            {/* Desktop Layout */}
            <div className="hidden md:block">


              <div className="grid grid-cols-2 gap-4 mb-8">
                {/* Main Image - Left Side */}
                <motion.div 
                  className="relative aspect-square cursor-pointer"
                  onClick={() => setSelectedImage(mainImage)}
                >
                  <CldImage
                    src={mainImage.Url}
                    alt={mainImage.Name || 'Product Image'}
                    fill
                    className="object-cover rounded-lg"
                    sizes="50vw"
                  />
                </motion.div>

                {/* First Four Images - Right Side */}
                {allImages.length > 0 && (
                  <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
                    {allImages.slice(0, 4).map((image, index) => (
                      <motion.div
                        key={`${image.Id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative aspect-square cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      >
                        <CldImage
                          src={image.Url}
                          alt={image.Name || 'Product View'}
                          fill
                          className="object-cover rounded-lg"
                          sizes="25vw"
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remaining Images for Desktop */}
              {allImages.length > 4 && (
                <div className="mt-8">
                  <div className="grid grid-cols-3 gap-4">
                    {allImages.slice(4).map((image, index) => (
                      <motion.div
                        key={`${image.Id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative aspect-square w-full cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      >
                        <CldImage
                          src={image.Url}
                          alt={image.Name || 'Product View'}
                          fill
                          className="object-cover rounded-lg"
                          sizes="400px"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">


              <div className="grid grid-cols-2 gap-4">
                {/* Main Image First */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative aspect-square cursor-pointer"
                  onClick={() => setSelectedImage(mainImage)}
                >
                  <CldImage
                    src={mainImage.Url}
                    alt={mainImage.Name || 'Product Image'}
                    fill
                    className="object-cover rounded-lg"
                    sizes="33vw"
                  />
                </motion.div>

                {/* All Other Images */}
                {allImages.map((image, index) => (
                  <motion.div
                    key={`${image.Id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-square cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <CldImage
                      src={image.Url}
                      alt={image.Name || 'Product View'}
                      fill
                      className="object-cover rounded-lg"
                      sizes="33vw"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal 
            image={selectedImage} 
            onClose={() => setSelectedImage(null)} 
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#f8f4ec] shadow-[0_5px_15px_rgba(0,0,0,1)] px-[5%] py-3 z-10">
        <div className="flex justify-between items-center">
          <div className="w-3/5">
            <h2 className="text-[clamp(10px,2vw,20px)] font-bold capitalize truncate">
              {product.Name}
            </h2>
          </div>
          <div className="w-2/5">
            <div className="rounded-full flex overflow-hidden">
              <a
                href={product.buy}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#88bc04] text-white text-xs font-bold py-1.5 text-center hover:bg-[#7aa703] transition-colors duration-300 relative"
              >
                Shop Now
                <span className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-[1px] bg-white"></span>
              </a>
              <a
                href="https://wa.me/60192776056?text=Hi Dragx, Can you recommend a product that suits my needs?"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#709c44] text-white text-xs font-bold py-1.5 text-center hover:bg-[#648c3d] transition-colors duration-300 relative"
              >
                Chat Now
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[1px] bg-white"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}