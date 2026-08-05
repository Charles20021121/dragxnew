"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useProduct } from '@/contexts/ProductContext'

const categories = ['COMFORT', 'COMFORT MAX', 'ACOUSTIC PROMAX']
const carTypes = ['HATCHBACK', 'SEDAN', 'SUV', 'MPV']

const CarIcon = ({ type }) => {
  const imageUrl = `/silence/car type/${type.toLowerCase()}.webp`
  return (
    <img
      src={imageUrl}
      alt={`${type} icon`}
      className="w-16 h-auto md:w-20 object-contain"
    />
  )
}

export default function SilenceClientWrapper({ categorizedProducts, silencePrices = [] }) {
  const { setCurrentProduct } = useProduct()
  const [activeCategory, setActiveCategory] = useState('COMFORT')
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

  const getPrice = (tab, carType, defaultProduct) => {
    let priceStr = 'XXX'
    // 優先從新的 silencePrices 表中讀取價格
    const item = silencePrices.find(p => p.category === tab && p.car_type === carType)
    if (item && item.price) {
      priceStr = item.price
    } else if (defaultProduct && defaultProduct.price) {
      // Fallback 到產品表的價格
      priceStr = defaultProduct.price
    }

    if (priceStr === 'XXX' || priceStr.trim() === '') {
      return null;
    }

    let displayPrice = priceStr.toString();
    if (!displayPrice.includes('.')) {
      displayPrice += '.00';
    }

    return (
      <>
        <span className="mr-1">RM</span>
        {displayPrice}
      </>
    )
  }

  return (
    <>
      <div className="w-full relative text-white pt-2 md:pt-10">

        {/* 分類切換區域 */}
        <div className="relative px-4 md:px-20 py-2 md:py-6">
          {/* 底部的細線 (統一用 Tailwind 控制左右間距) */}
          <div className="absolute h-[2px] bg-[#64acac]/30 left-4 right-4 md:left-20 md:right-20 bottom-[17px]" />

          <div className="max-w-3xl mx-auto flex justify-between relative z-10 w-full mt-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className="relative w-28 md:w-36 flex justify-center"
              >
                <div className="relative px-1 md:px-6 py-2">
                  <span className={`text-[10px] sm:text-xs md:text-base tracking-wider md:tracking-widest uppercase whitespace-nowrap ${activeCategory === category
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

        {/* 組合展示區域：車型Icon、圖片、價格、按鈕 */}
        <div className="max-w-[1500px] mx-auto px-4 md:px-8 pb-20 pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`combined-${activeCategory}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-16 md:gap-8 min-h-[400px]"
            >
              {carTypes.map((carType) => {
                const product = categorizedProducts[activeCategory]?.find(
                  p => p.filter1?.toLowerCase() === carType.toLowerCase()
                );

                return (
                  <div key={carType} className="relative flex flex-col items-center">
                    {/* Car Name & Icon */}
                    <div className="text-white flex flex-col items-center mb-4 space-y-2">
                       <div className="flex items-center justify-center h-12 md:h-16">
                         <CarIcon type={carType} />
                       </div>
                    </div>

                    {/* 大圖與按鈕 */}
                    {product ? (
                      <div className="flex flex-col items-center w-full mt-0">
                        <Image
                          unoptimized
                          src={product.image || product.Url}
                          alt={product.name || product.Name || "Product Image"}
                          width={500}
                          height={500}
                          className="w-full object-contain scale-[1.02] md:scale-[1.05]"
                        />
                        {/* Price */}
                        <div className="mt-4 mb-3 text-lg md:text-xl font-semibold tracking-widest text-white" style={{ fontFamily: 'Geometos, sans-serif' }}>
                          {getPrice(activeCategory, carType, product)}
                        </div>
                        {/* Button */}
                        <button className="px-6 py-2 bg-[#64acac] hover:bg-[#4d8484] text-white font-bold rounded-full transition-colors w-auto min-w-[140px] md:min-w-[160px] relative z-10 shadow-lg text-sm md:text-base uppercase tracking-wider">
                          <a target="_blank" href={getWhatsAppUrl(product.name || product.Name)} rel="noopener noreferrer">LEARN MORE</a>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center w-full mt-0">
                        <div className="w-full aspect-square flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
                          <span className="text-white/50 text-sm">Coming Soon</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}
