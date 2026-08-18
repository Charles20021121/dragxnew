"use client"
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const brands = [
  {
    id: 'ALPINE',
    name: 'ALPINE',
    logo: (
      <svg viewBox="0 0 160 32" className="h-6 sm:h-7 md:h-9 w-auto">
        {/* 5 Alpine Stripes */}
        <path d="M4 24 L11 7 L15 7 L8 24 Z" fill="#0055b8" />
        <path d="M14 24 L21 7 L25 7 L18 24 Z" fill="#0055b8" />
        <path d="M24 24 L31 7 L35 7 L28 24 Z" fill="#0055b8" />
        <path d="M34 24 L41 7 L45 7 L38 24 Z" fill="#0055b8" />
        <path d="M44 24 L51 7 L55 7 L48 24 Z" fill="#0055b8" />
        {/* ALPINE Text */}
        <text x="60" y="22" fill="#0055b8" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="21" letterSpacing="1.5">ALPINE.</text>
      </svg>
    )
  },
  {
    id: 'RAINBOW',
    name: 'RAINBOW',
    logo: (
      <svg viewBox="0 0 150 32" className="h-6 sm:h-7 md:h-9 w-auto">
        {/* Rainbow Waves Icon */}
        <circle cx="16" cy="16" r="12" stroke="#b8860b" strokeWidth="2.5" fill="none" strokeDasharray="20 20" transform="rotate(-45 16 16)" />
        <circle cx="16" cy="16" r="7.5" stroke="#b8860b" strokeWidth="2.5" fill="none" strokeDasharray="12 12" transform="rotate(-45 16 16)" />
        {/* Rainbow Text */}
        <text x="36" y="23" fill="#b8860b" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="22" letterSpacing="0.5">rainbow</text>
      </svg>
    )
  },
  {
    id: 'ADAMDIGITAL',
    name: 'ADAMDIGITAL',
    logo: (
      <svg viewBox="0 0 170 32" className="h-6 sm:h-7 md:h-9 w-auto">
        {/* Adams Digital Crest Shield */}
        <path d="M16 2 L28 7 L28 17 Q28 27 16 30 Q4 27 4 17 L4 7 Z" fill="#222" stroke="#d4af37" strokeWidth="1.5" />
        <path d="M10 8 L22 23 M22 8 L10 23" stroke="#d90429" strokeWidth="2.5" strokeLinecap="round" />
        {/* Adams Digital Text */}
        <text x="34" y="21" fill="#1c5434" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="15" letterSpacing="0.8">ADAMS DIGITAL</text>
      </svg>
    )
  },
  {
    id: 'CROSSFIRE',
    name: 'CROSSFIRE',
    logo: (
      <svg viewBox="0 0 160 32" className="h-6 sm:h-7 md:h-9 w-auto">
        {/* Crossfire Emblem X */}
        <path d="M6 5 L24 27 M24 5 L6 27" stroke="#00a843" strokeWidth="4" strokeLinecap="round" />
        {/* Crossfire Text */}
        <text x="32" y="22" fill="#00a843" fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize="18" letterSpacing="1.5">CROSSFIRE</text>
      </svg>
    )
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
                  {/* 品牌 Logo 图标 (精致适配，防止碰撞挤压) */}
                  <div className="flex items-center justify-center mb-1.5 h-4 sm:h-6 md:h-8 transition-transform group-hover:scale-105 max-w-[72px] sm:max-w-[110px] md:max-w-[140px] w-full">
                    {brand.logo}
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
