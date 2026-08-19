"use client"
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const brands = [
  {
    id: 'ALPINE',
    name: 'ALPINE',
    logoSrc: '/silence/audio logo/ALPINE.webp',
    scaleClass: 'scale-95 sm:scale-100'
  },
  {
    id: 'RAINBOW',
    name: 'RAINBOW',
    logoSrc: '/silence/audio logo/RAINBOW.webp',
    scaleClass: 'scale-100 sm:scale-105'
  },
  {
    id: 'ADAMDIGITAL',
    name: 'ADAMDIGITAL',
    logoSrc: '/silence/audio logo/ADAMS DIGITAL.webp',
    scaleClass: 'scale-130 sm:scale-140 md:scale-145'
  },
  {
    id: 'CROSSFIRE',
    name: 'CROSSFIRE',
    logoSrc: '/silence/audio logo/CROSSFIRE.webp',
    scaleClass: 'scale-130 sm:scale-140 md:scale-145'
  }
]

export default function SilenceAudioSystemsSection({ products = [] }) {
  const [activeBrand, setActiveBrand] = useState('ALPINE')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 筛选属于当前品牌的真实产品（无假数据）
  const displayedProducts = useMemo(() => {
    const brandLower = activeBrand.toLowerCase()
    
    // 从传入的真实产品列表中匹配（排除相册副图）
    const realMatches = products.filter(p => {
      const isMainProduct = !p.same || p.same === '' || String(p.id || p.Id) === String(p.same)
      if (!isMainProduct) return false

      const name = (p.name || p.Name || '').toLowerCase()
      const filter1 = (p.filter1 || '').toLowerCase()
      const customFilter = (p.custom_filter || '').toLowerCase()
      const filter = (p.filter || '').toLowerCase()
      
      const isAudio = filter1 === 'audio' || name.includes('audio') || name.includes('speaker') || name.includes('dsp') || customFilter.includes('alpine') || customFilter.includes('rainbow') || customFilter.includes('adam') || customFilter.includes('crossfire')
      const matchesBrand = name.includes(brandLower) || customFilter.includes(brandLower) || filter.includes(brandLower)

      return isAudio && matchesBrand
    })

    // 过滤价格区间并按最新发布优先排序 (Newest First)
    return realMatches
      .filter(item => {
        const numericPrice = parseFloat(item.price)
        if (isNaN(numericPrice)) return true

        if (minPrice !== '' && numericPrice < parseFloat(minPrice)) return false
        if (maxPrice !== '' && numericPrice > parseFloat(maxPrice)) return false
        return true
      })
      .sort((a, b) => {
        const orderA = (a.sort_order !== undefined && a.sort_order !== null && a.sort_order !== '') ? Number(a.sort_order) : 999999
        const orderB = (b.sort_order !== undefined && b.sort_order !== null && b.sort_order !== '') ? Number(b.sort_order) : 999999
        if (orderA !== orderB) return orderA - orderB
        const dateA = new Date(a.date || 0).getTime()
        const dateB = new Date(b.date || 0).getTime()
        if (dateA !== dateB) return dateA - dateB
        return (a.id || a.Id || 0) - (b.id || b.Id || 0)
      })
  }, [products, activeBrand, minPrice, maxPrice])

  const formatPrice = (price) => {
    if (!price || price === 'XXX' || price.toString().trim() === '') {
      return 'RM --'
    }

    const num = parseFloat(String(price).replace(/[^0-9.]/g, ''))
    if (isNaN(num)) return `RM ${price}`

    return `RM ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <section className="w-full py-4 md:py-8 text-[#1c5434]">
      {/* 顶部标题与价格筛选输入框 (紧凑自然连接，彻底消除中间多余空隙) */}
      <div className="max-w-[1400px] mx-auto mb-3 md:mb-6 px-3 sm:px-8 md:px-12 lg:px-16 flex flex-row items-center justify-between gap-3 sm:gap-6 w-full">
        {/* 左侧：大标题 (增加字间距与长度，视觉更舒展大气) */}
        <h2 
          className="text-[13px] sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-[0.12em] sm:tracking-[0.2em] uppercase text-[#1c5434] whitespace-nowrap shrink-0"
          style={{ fontFamily: 'Geometos, sans-serif' }}
        >
          SPECIFIC LINE BRAND
        </h2>

        {/* 右侧：价格筛选输入框 (自动适配向右对齐，填补中间空白) */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 flex-1 max-w-[260px] sm:max-w-[320px] md:max-w-[380px] ml-auto">
          <input
            type="number"
            placeholder="Min Price (RM)"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full min-w-0 flex-1 px-1.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs md:text-sm bg-white border border-[#1c5434]/40 rounded-lg text-[#1c5434] placeholder-[#1c5434]/50 focus:outline-none focus:border-[#1c5434] focus:ring-1 focus:ring-[#1c5434] text-center shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="w-1.5 sm:w-3 h-[1px] bg-[#1c5434]/40 shrink-0" />
          <input
            type="number"
            placeholder="Max Price (RM)"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full min-w-0 flex-1 px-1.5 sm:px-3 py-1 sm:py-1.5 text-[9px] sm:text-xs md:text-sm bg-white border border-[#1c5434]/40 rounded-lg text-[#1c5434] placeholder-[#1c5434]/50 focus:outline-none focus:border-[#1c5434] focus:ring-1 focus:ring-[#1c5434] text-center shadow-2xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* 品牌 Tabs 栏 (比例平衡，互不拥挤) */}
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 md:px-8 my-2 md:my-4 mb-6 md:mb-10">
        {/* 贯穿全宽的基准线容器 */}
        <div className="relative w-full">
          {/* 细线 (2px 高度) */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1c5434]/20" />

          {/* 品牌按钮行 (4 列网格，每个品牌 100% 居中于对应的产品列正上方) */}
          <div className="grid grid-cols-4 relative z-10 w-full">
            {brands.map((brand) => {
              const isActive = activeBrand === brand.id
              return (
                <button
                  key={brand.id}
                  onClick={() => setActiveBrand(brand.id)}
                  className="relative flex flex-col items-center justify-center w-full group cursor-pointer px-1 pt-1 pb-2.5"
                >
                  {/* 品牌 Logo 图标 (使用官方原版 WebP Logo，按比例平衡放大) */}
                  <div className="flex items-center justify-center mb-1.5 h-6 sm:h-8 md:h-10 max-w-[90px] sm:max-w-[130px] md:max-w-[160px] w-full">
                    <img
                      src={brand.logoSrc}
                      alt={brand.name}
                      className={`max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-110 ${brand.scaleClass || ''}`}
                    />
                  </div>

                  {/* 品牌名称 */}
                  <span className={`text-[10px] sm:text-xs md:text-sm tracking-wider md:tracking-widest whitespace-nowrap uppercase transition-colors duration-200 ${
                    isActive
                      ? 'text-[#1c5434] font-extrabold'
                      : 'text-gray-500 font-medium hover:text-[#1c5434]'
                  }`}>
                    {brand.name}
                  </span>

                  {/* 处于细线正上方的指示条 (精准覆盖灰线，100% 对齐居中) */}
                  {isActive && mounted && (
                    <motion.div
                      layoutId="audioSystemsTabIndicator"
                      className="absolute bottom-0 left-1 right-1 sm:left-3 sm:right-3 h-[3px] bg-[#1c5434] z-10 rounded-full"
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
                      className="absolute bottom-0 left-1 right-1 sm:left-3 sm:right-3 h-[3px] bg-[#1c5434] z-10 rounded-full"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 音响产品展示 4 列网格 (移动端双列，桌面端四列) */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-8">
        {displayedProducts.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBrand}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8 items-start"
            >
              {displayedProducts.map((item, idx) => {
                const itemSlug = item.slug || (item.name || item.Name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

                return (
                  <div 
                    key={item.id || item.Id || idx} 
                    className="flex flex-col items-center w-full group"
                  >
                    {/* 1:1 正方形产品图片 (纯净无边框) */}
                    <Link
                      href={`/products/silence/${itemSlug}`}
                      className="w-full aspect-square relative rounded-xl overflow-hidden flex items-center justify-center block"
                    >
                      <img
                        src={item.image || item.Url}
                        alt={item.name || item.Name}
                        className="w-full h-full object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    {/* 型号名称与价格 (直接置于下方，无外层大卡片包裹) */}
                    <div className="mt-2.5 text-center w-full px-1">
                      <Link href={`/products/silence/${itemSlug}`} className="block">
                        <h4 
                          className="text-xs sm:text-sm md:text-base font-bold text-[#1c5434] tracking-wide uppercase truncate group-hover:underline"
                          style={{ fontFamily: 'Geometos, sans-serif' }}
                        >
                          {item.name || item.Name}
                        </h4>
                      </Link>
                      <p 
                        className="text-xs sm:text-sm md:text-base font-extrabold text-[#1c5434] mt-0.5 tracking-wider"
                        style={{ fontFamily: 'Geometos, sans-serif' }}
                      >
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-16 px-4 bg-white/40 rounded-3xl border-2 border-dashed border-[#1c5434]/20 max-w-lg mx-auto">
            <p className="text-sm md:text-base font-bold text-[#1c5434]/70">No products found under {activeBrand}</p>
            <p className="text-xs text-[#1c5434]/40 mt-1">Try adjusting the price filters or check other brands.</p>
          </div>
        )}
      </div>
    </section>
  )
}
