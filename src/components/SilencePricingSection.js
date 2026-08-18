"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const tabs = ['BASIC', 'STANDARD', 'PRO']
const carTypes = ['HATCHBACK', 'SEDAN', 'SUV', 'MPV']

const CarIcon = ({ type }) => {
  const imageUrl = `/silence/car type/${type.toLowerCase()}.webp`
  return (
    <img
      src={imageUrl}
      alt={`${type} icon`}
      className="w-16 h-auto md:w-20 object-contain mb-2"
    />
  )
}

export default function SilencePricingSection({ silencePrices = [], theme = 'dark' }) {
  const [activeTab, setActiveTab] = useState('BASIC')
  const [mounted, setMounted] = useState(false)
  const isLight = theme === 'light'

  useEffect(() => {
    setMounted(true)
  }, [])

  // 根據 tab 來設定價格 (從数据库读取，千分位格式化)
  const getPrice = (tab, carType) => {
    const item = silencePrices.find(p => p.category === tab && p.car_type === carType)
    const priceStr = (item && item.price) ? item.price : ''
    
    if (!priceStr || priceStr.toString().trim() === '' || priceStr === 'XXX') {
      return (
        <>
          <span className="mr-1">RM</span>
          --
        </>
      )
    }
    
    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''))
    const displayPrice = isNaN(num) 
      ? priceStr 
      : num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
      <>
        <span className="mr-1">RM</span>
        {displayPrice}
      </>
    )
  }

  // 根據 tab 來設定 Banner 圖片 (桌面版，優先從資料庫讀取上傳的圖片)
  const getBannerImage = (tab) => {
    const bannerItem = silencePrices.find(p => p.category === tab && p.car_type === 'BANNER')
    if (bannerItem && bannerItem.image_url && bannerItem.image_url.trim() !== '') {
      return bannerItem.image_url
    }

    switch (tab) {
      case 'BASIC':
        return '/silence/basic/DX Silence PAGE FA 2.webp'
      case 'STANDARD':
        return '/silence/basic/DX Silence PC 2-12.webp'
      case 'PRO':
        return '/silence/basic/DX Silence PC 2-13.webp'
      default:
        return '/silence/basic/DX Silence PAGE FA 2.webp'
    }
  }

  // 根據 tab 來設定 Banner 圖片 (手機版，優先從資料庫讀取上傳的圖片)
  const getMobileBannerImage = (tab) => {
    const bannerItem = silencePrices.find(p => p.category === tab && p.car_type === 'BANNER')
    if (bannerItem && bannerItem.mobile_image_url && bannerItem.mobile_image_url.trim() !== '') {
      return bannerItem.mobile_image_url
    }

    switch (tab) {
      case 'BASIC':
        return '/silence/basic/PHONE SIZE-BASIC 1.webp'
      case 'STANDARD':
        return '/silence/basic/PHONE SIZE-STANDARD 3.webp'
      case 'PRO':
        return '/silence/basic/PHONE SIZE-PRO 2.webp'
      default:
        return '/silence/basic/PHONE SIZE-BASIC 1.webp'
    }
  }

  return (
    <div className={`w-full relative pt-1 md:pt-3 ${isLight ? 'text-[#1c5434]' : 'text-white'}`}>
      {/* Tab 切換區域 */}
      <div className="relative px-4 md:px-20 my-2 md:my-4">
        {/* 贯穿全宽的基准线容器 */}
        <div className="relative w-full">
          {/* 细线 (2px 高度) */}
          <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${
            isLight ? 'bg-[#1c5434]/20' : 'bg-[#64acac]/30'
          }`} />

          {/* 按钮行 */}
          <div className="max-w-3xl mx-auto flex justify-between relative z-10 w-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative w-28 md:w-36 flex flex-col items-center group cursor-pointer"
                >
                  <span className={`pb-2 text-[10px] sm:text-xs md:text-base tracking-wider md:tracking-widest whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? (isLight ? 'text-[#1c5434] font-bold' : 'text-[#64acac] font-bold')
                      : (isLight ? 'text-gray-500 font-normal hover:text-[#1c5434]' : 'text-gray-400 font-normal hover:text-white')
                  }`}>
                    {tab}
                  </span>

                  {/* 处于细线正中间的指示条 (4px 高，垂直居中覆盖 2px 细线) */}
                  <div className="relative w-full flex justify-center h-0">
                    {isActive && mounted && (
                      <motion.div
                        layoutId="pricingTabIndicator"
                        className={`absolute h-[4px] -top-[3px] w-full ${isLight ? 'bg-[#1c5434]' : 'bg-[#64acac]'}`}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                    {isActive && !mounted && (
                      <div
                        className={`absolute h-[4px] -top-[3px] w-full ${isLight ? 'bg-[#1c5434]' : 'bg-[#64acac]'}`}
                      />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 價格與車型展示區域 */}
      <div className="max-w-3xl mx-auto mt-1 md:mt-2 mb-3 md:mb-6 px-2 md:px-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center w-full gap-1 sm:gap-2"
          >
            {carTypes.map((carType) => (
              <div key={carType} className="flex-1 flex flex-col items-center justify-center min-w-0 py-1 space-y-0.5 sm:space-y-1 md:space-y-2">
                {/* 车名 */}
                <span className={`text-[9px] sm:text-xs tracking-wider font-semibold uppercase truncate max-w-full ${
                  isLight ? 'text-[#1c5434]' : 'text-[#64acac]'
                }`}>
                  {carType}
                </span>
                
                {/* 车辆图标 */}
                <div className="flex items-center justify-center h-8 sm:h-10 md:h-14">
                  <CarIcon type={carType} />
                </div>
                
                {/* 价格 */}
                <span 
                  className={`text-[10px] sm:text-sm md:text-xl font-bold tracking-tight sm:tracking-wider whitespace-nowrap ${
                    isLight ? 'text-[#1c5434]' : 'text-white'
                  }`} 
                  style={{ fontFamily: 'Geometos, sans-serif' }}
                >
                  {getPrice(activeTab, carType)}
                </span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Banner 區域 */}
      <div className="w-full mt-3 md:mt-6 pb-0 md:pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {/* 桌面版 Banner */}
            <img
              src={getBannerImage(activeTab)}
              alt={`Silence ${activeTab} Banner`}
              className="w-full h-auto hidden md:block"
            />
            {/* 手機版 Banner */}
            <img
              src={getMobileBannerImage(activeTab)}
              alt={`Silence ${activeTab} Mobile Banner`}
              className="w-full h-auto block md:hidden"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
