"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useProduct } from '@/contexts/ProductContext'

const categories = ['HATCHBACK', 'SEDAN', 'SUV', 'MPV']

export default function SilenceClientWrapper({ categorizedProducts }) {
  const { setCurrentProduct } = useProduct()
  const [activeCategory, setActiveCategory] = useState('HATCHBACK')
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkMobileDevice = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobileDevice()
    window.addEventListener('resize', checkMobileDevice)
    return () => window.removeEventListener('resize', checkMobileDevice)
  }, [])

  const getWhatsAppUrl = (productName) => {
    if (!mounted) {
      // Default to web url before hydration to avoid mismatch
      const phoneNumber = '60192776056'
      const message = `Hi Dragx, I'm interested in Soundproof: ${productName}`
      return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    }

    const phoneNumber = '60192776056'
    const pageUrl = window.location.href
    const message = `${pageUrl}\n\nHi Dragx, I'm interested in Soundproof: ${productName}`

    if (isMobile) {
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    } else {
      return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    }
  }

  // 设置 Soundproof 产品信息给 WhatsApp 按钮使用
  useEffect(() => {
    if (!mounted) return;
    
    setCurrentProduct({
      name: `DX Silence - ${activeCategory}`,
      category: 'soundproof',
      filter1: activeCategory.toLowerCase(),
      url: window.location.href,
      isListPage: true,
      isSoundproof: true
    })

    return () => {
      setCurrentProduct(null)
    }
  }, [activeCategory, setCurrentProduct, mounted])

  return (
    <>
      <div className="bg-black bg-no-repeat bg-cover bg-center" style={{
        backgroundImage: `url('https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/q45ew1xcvjtd43klbcql.webp')`
      }}>

        {/* 分類切換區域 */}
        <div className="relative px-4 md:px-20">
          <div className="flex justify-between md:justify-center md:space-x-20 py-6">
            {/* 底部的細線 */}
            <div
              className="absolute h-[2px] bg-[#64acac]/30 hidden md:block"
              style={{
                width: 'calc(100% - 160px)',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '17px'
              }}
            />

            {/* 手機版的細線 */}
            <div
              className="absolute h-[2px] bg-[#64acac]/30 md:hidden"
              style={{
                width: 'calc(100% - 32px)',
                left: '50%',
                transform: 'translateX(-50%)',
                bottom: '17px'
              }}
            />

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="relative"
              >
                <div className="relative px-2 md:px-4">
                  <span className={`text-sm md:text-base ${activeCategory === category
                    ? 'text-[#64acac] font-bold'
                    : 'text-gray-400 font-normal'
                    }`}>
                    {category}
                  </span>
                  {activeCategory === category && mounted && (
                    <motion.div
                      layoutId="activeIndicatorSilence"
                      className="absolute h-[4px] bg-[#64acac]"
                      style={{
                        width: '100%',
                        left: '0',
                        bottom: '-8px'
                      }}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  {activeCategory === category && !mounted && (
                    <div
                      className="absolute h-[4px] bg-[#64acac]"
                      style={{
                        width: '100%',
                        left: '0',
                        bottom: '-8px'
                      }}
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 產品展示區域 */}
        <div className="container mx-auto px-4 md:px-20 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[400px]">
            <AnimatePresence mode="wait">
              {categorizedProducts[activeCategory]?.map((product, index) => (
                <motion.div
                  key={`${activeCategory}-${product.Id || index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative"
                >
                  <Image
                    unoptimized
                    src={product.image || product.Url}
                    alt={product.name || product.Name || "Product Image"}
                    width={400}
                    height={400}
                    className="w-full"
                  />
                  <div className="flex justify-center">
                    <button className="px-4 py-2 mt-4 bg-[#64acac] hover:bg-[#4d8484] text-white font-bold rounded-full transition-colors">
                      <a target="_blank" href={getWhatsAppUrl(product.name || product.Name)} rel="noopener noreferrer">SHOP NOW</a>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}
