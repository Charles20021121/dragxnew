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

export default function SilencePricingSection({ silencePrices = [] }) {
  const [activeTab, setActiveTab] = useState('BASIC')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 根據 tab 來設定價格 (從数据库读取)
  const getPrice = (tab, carType) => {
    const item = silencePrices.find(p => p.category === tab && p.car_type === carType)
    const priceStr = (item && item.price) ? item.price : 'XXX'
    
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

  // 根據 tab 來設定 Banner 圖片 (桌面版)
  const getBannerImage = (tab) => {
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

  // 根據 tab 來設定 Banner 圖片 (手機版)
  const getMobileBannerImage = (tab) => {
    switch (tab) {
      case 'BASIC':
        return '/silence/basic/phone/PHONE SIZE-BASIC.webp'
      case 'STANDARD':
        return '/silence/basic/phone/PHONE SIZE-STANDARD.webp'
      case 'PRO':
        return '/silence/basic/phone/PHONE SIZE-PRO.webp'
      default:
        return '/silence/basic/phone/PHONE SIZE-BASIC.webp'
    }
  }

  return (
    <div className="w-full relative text-white pt-2 md:pt-10">
      {/* Tab 切換區域 */}
      <div className="relative px-4 md:px-20 py-2 md:py-6">
        {/* 底部的細線 (統一用 Tailwind 控制左右間距) */}
        <div className="absolute h-[2px] bg-[#64acac]/30 left-4 right-4 md:left-20 md:right-20 bottom-[17px]" />

        <div className="max-w-3xl mx-auto flex justify-between relative z-10 w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative w-28 md:w-36 flex justify-center"
            >
              <div className="relative px-1 md:px-6 py-2">
                <span className={`text-[10px] sm:text-xs md:text-base tracking-wider md:tracking-widest whitespace-nowrap ${activeTab === tab
                  ? 'text-[#64acac] font-bold'
                  : 'text-gray-400 font-normal'
                  }`}>
                  {tab}
                </span>

                {/* 綠色下劃線 (動態滑動) */}
                {activeTab === tab && mounted && (
                  <motion.div
                    layoutId="pricingTabIndicator"
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
                {/* 伺服器端渲染的靜態下劃線，避免水合不匹配 */}
                {activeTab === tab && !mounted && (
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

      {/* 價格與車型展示區域 */}
      <div className="max-w-3xl mx-auto mt-2 md:mt-4 mb-8 px-4 md:px-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex justify-between items-center w-full"
          >
            {carTypes.map((carType) => (
              <div key={carType} className="flex flex-col items-center justify-center w-28 md:w-36 space-y-2 md:space-y-4">
                <div className="text-white flex items-center justify-center h-12 md:h-16">
                  <CarIcon type={carType} />
                </div>
                <span className="text-xs md:text-xl font-semibold tracking-widest text-white" style={{ fontFamily: 'Geometos, sans-serif' }}>
                  {getPrice(activeTab, carType)}
                </span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Banner 區域 */}
      <div className="w-full mt-10 md:mt-16 pb-0 md:pb-10">
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
