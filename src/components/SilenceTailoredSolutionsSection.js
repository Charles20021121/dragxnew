"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const categories = ['COMFORT', 'COMFORT MAX', 'ACOUSTIC PROMAX']
const carTypes = ['HATCHBACK', 'SEDAN', 'SUV', 'MPV']

const CarIcon = ({ type }) => {
  const imageUrl = `/silence/car type/${type.toLowerCase()}.webp`
  return (
    <img
      src={imageUrl}
      alt={`${type} icon`}
      className="w-14 h-auto md:w-16 object-contain"
    />
  )
}

export default function SilenceTailoredSolutionsSection({ products = [], silencePrices = [] }) {
  const [activeCategory, setActiveCategory] = useState('COMFORT')
  const [mobileCarType, setMobileCarType] = useState('HATCHBACK')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatPrice = (priceStr) => {
    if (!priceStr || priceStr === 'XXX' || priceStr.toString().trim() === '') {
      return 'RM --'
    }

    const num = parseFloat(String(priceStr).replace(/[^0-9.]/g, ''))
    if (isNaN(num)) return `RM ${priceStr}`

    return `RM ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // 取得真實產品中屬於當前分類與車型的所有定制部位方案（嚴格隔離 COMFORT / COMFORT MAX / ACOUSTIC PROMAX）
  const getProductsForCarType = (category, carType) => {
    const catUpper = category.toUpperCase()
    const carLower = carType.toLowerCase()

    const matched = products.filter(p => {
      const pCat = (p.custom_filter || '').toUpperCase()
      const pName = (p.name || p.Name || '').toUpperCase()
      const filterVal = (p.filter || '').toLowerCase()
      const filter1Val = (p.filter1 || '').toLowerCase()

      // 必须是主产品（不能是附加副图）
      const isMainProduct = !p.same || p.same === '' || String(p.id || p.Id) === String(p.same)
      if (!isMainProduct) return false

      // 排除 Curated 和 Audio
      if (filter1Val === 'curated' || pCat.startsWith('CURATED')) return false
      if (filter1Val === 'audio' || ['ALPINE', 'RAINBOW', 'ADAMDIGITAL', 'CROSSFIRE'].includes(pCat)) return false

      const isTailored = filter1Val === 'tailored' || pCat.startsWith('TAILORED') || filter1Val === 'silence' || !p.filter1
      if (!isTailored) return false

      // 嚴格隔離 3 大套餐等級，杜絕子字串包含混淆
      let matchesTier = false
      if (catUpper === 'COMFORT') {
        const hasComfort = pCat.includes('COMFORT') || pName.includes('COMFORT')
        const hasMaxOrPro = pCat.includes('MAX') || pName.includes('MAX') || pCat.includes('PROMAX') || pName.includes('PROMAX')
        matchesTier = hasComfort && !hasMaxOrPro
      } else if (catUpper === 'COMFORT MAX') {
        const hasComfortMax = pCat.includes('COMFORT MAX') || pName.includes('COMFORT MAX') || (pCat.includes('COMFORT') && pCat.includes('MAX'))
        const hasPro = pCat.includes('PROMAX') || pName.includes('PROMAX') || pCat.includes('ACOUSTIC') || pName.includes('ACOUSTIC')
        matchesTier = hasComfortMax && !hasPro
      } else if (catUpper === 'ACOUSTIC PROMAX') {
        matchesTier = pCat.includes('PROMAX') || pName.includes('PROMAX') || pCat.includes('ACOUSTIC') || pName.includes('ACOUSTIC')
      }

      const matchesCar = filterVal === carLower || filterVal.includes(carLower) || filter1Val === carLower || filter1Val.includes(carLower) || filterVal === 'all'
      
      return matchesTier && matchesCar
    })

    // 优先按照后台自定义顺序 (sort_order) 排列，无排序时按自然顺序
    return [...matched].sort((a, b) => {
      const orderA = (a.sort_order !== undefined && a.sort_order !== null && a.sort_order !== '') ? Number(a.sort_order) : 999999
      const orderB = (b.sort_order !== undefined && b.sort_order !== null && b.sort_order !== '') ? Number(b.sort_order) : 999999
      if (orderA !== orderB) return orderA - orderB
      const dateA = new Date(a.date || 0).getTime()
      const dateB = new Date(b.date || 0).getTime()
      if (dateA !== dateB) return dateA - dateB
      return (a.id || a.Id || 0) - (b.id || b.Id || 0)
    })
  }

  const mobileItems = getProductsForCarType(activeCategory, mobileCarType)

  return (
    <section className="w-full py-6 md:py-10 text-[#1c5434]">
      {/* 标题 */}
      <div className="max-w-[1400px] mx-auto mb-3 md:mb-5 px-6 sm:px-8 md:px-12 lg:px-16">
        <h2 
          className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-wide uppercase text-[#1c5434]"
          style={{ fontFamily: 'Geometos, sans-serif' }}
        >
          TAILORED SOLUTIONS
        </h2>
      </div>

      {/* Tabs 分类栏 */}
      <div className="relative px-4 md:px-20 my-2 md:my-4 mb-4 md:mb-8">
        {/* 贯穿全宽的基准线容器 */}
        <div className="relative w-full">
          {/* 细线 (2px 高度) */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#1c5434]/20" />

          {/* 按钮行 */}
          <div className="max-w-3xl mx-auto flex justify-between relative z-10 w-full">
            {categories.map((category) => {
              const isActive = activeCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className="relative w-28 md:w-44 flex flex-col items-center group cursor-pointer"
                >
                  <span className={`pb-2 text-[10px] sm:text-xs md:text-base tracking-wider md:tracking-widest whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? 'text-[#1c5434] font-bold'
                      : 'text-gray-500 font-normal hover:text-[#1c5434]'
                  }`}>
                    {category}
                  </span>

                  {/* 处于细线正中间的指示条 (4px 高，垂直居中覆盖 2px 细线) */}
                  <div className="relative w-full flex justify-center h-0">
                    {isActive && mounted && (
                      <motion.div
                        layoutId="tailoredSolutionsTabIndicator"
                        className="absolute h-[4px] -top-[3px] w-full bg-[#1c5434]"
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
                        className="absolute h-[4px] -top-[3px] w-full bg-[#1c5434]"
                      />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 📱 手机端专用：车型胶囊切换器 (Mobile Car Type Selector) */}
      <div className="block md:hidden px-4 mb-5">
        <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-1.5 rounded-2xl border border-[#1c5434]/15 shadow-sm">
          {carTypes.map((carType) => {
            const isSelected = mobileCarType === carType
            return (
              <button
                key={carType}
                type="button"
                onClick={() => setMobileCarType(carType)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1c5434] text-white shadow-md font-bold'
                    : 'text-[#1c5434]/70 hover:text-[#1c5434] hover:bg-white/50'
                }`}
              >
                <div className={`h-7 flex items-center justify-center mb-0.5 ${isSelected ? 'brightness-0 invert' : ''}`}>
                  <img
                    src={`/silence/car type/${carType.toLowerCase()}.webp`}
                    alt={carType}
                    className="h-6 w-auto object-contain"
                  />
                </div>
                <span className="text-[10px] tracking-wider uppercase font-semibold">
                  {carType}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 📱 手机端：单车型精选网格 (Mobile 2-Column Grid) */}
      <div className="block md:hidden px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={`mobile-${activeCategory}-${mobileCarType}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-2 gap-3.5"
          >
            {mobileItems.length > 0 ? (
              mobileItems.map((item, idx) => {
                const itemSlug = item.slug || (item.name || item.Name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                return (
                  <div 
                    key={`mobile-tailored-${activeCategory}-${mobileCarType}-${item.id || item.Id || idx}-${idx}`} 
                    className="flex flex-col items-center w-full group bg-white/40 p-2 rounded-2xl border border-[#1c5434]/10 shadow-sm"
                  >
                    <Link 
                      href={`/products/silence/${itemSlug}`}
                      className="w-full aspect-square relative rounded-xl overflow-hidden flex items-center justify-center block bg-white"
                    >
                      <img
                        src={item.image || item.Url}
                        alt={`${mobileCarType} ${item.name || item.Name}`}
                        className="w-full h-full object-contain rounded-xl active:scale-95 transition-transform duration-200"
                      />
                    </Link>
                    <div className="mt-2 text-center w-full px-1">
                      <h4 
                        className="text-xs font-bold text-[#1c5434] tracking-wide uppercase line-clamp-2 leading-tight"
                        style={{ fontFamily: 'Geometos, sans-serif' }}
                      >
                        {item.name || item.Name}
                      </h4>
                      <p 
                        className="text-xs font-semibold text-[#1c5434] mt-1 tracking-widest"
                        style={{ fontFamily: 'Geometos, sans-serif' }}
                      >
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-2 aspect-[2/1] border-2 border-dashed border-[#1c5434]/20 rounded-2xl flex flex-col items-center justify-center p-4 text-center bg-white/40">
                <span className="text-xs font-semibold text-[#1c5434]/60 uppercase tracking-wider">No Products Available</span>
                <span className="text-[10px] text-[#1c5434]/40 mt-1">Please select another car type or tier</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 💻 桌面端：经典 4 列并排展示 (Desktop 4-Column Layout) */}
      <div className="hidden md:block max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`desktop-${activeCategory}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-4 gap-6 items-start"
          >
            {carTypes.map((carType) => {
              const items = getProductsForCarType(activeCategory, carType)

              return (
                <div key={carType} className="flex flex-col items-center w-full space-y-4">
                  {/* 列头：车型名称与图标 */}
                  <div className="flex flex-col items-center space-y-0.5 pb-1">
                    <span className="text-xs font-semibold tracking-wider text-[#1c5434] uppercase">
                      {carType}
                    </span>
                    <div className="flex items-center justify-center h-12">
                      <CarIcon type={carType} />
                    </div>
                  </div>

                  {/* 该车型下的真实方案卡片 */}
                  <div className="w-full space-y-6">
                    {items.length > 0 ? (
                      items.map((item, idx) => {
                        const itemSlug = item.slug || (item.name || item.Name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                        return (
                          <div 
                            key={`tailored-${activeCategory}-${carType}-${item.id || item.Id || idx}-${idx}`} 
                            className="flex flex-col items-center w-full group"
                          >
                            <Link 
                              href={`/products/silence/${itemSlug}`}
                              className="w-full aspect-square relative rounded-xl overflow-hidden flex items-center justify-center block"
                            >
                              <img
                                src={item.image || item.Url}
                                alt={`${carType} ${item.name || item.Name}`}
                                className="w-full h-full object-contain rounded-xl hover:scale-105 transition-transform duration-300"
                              />
                            </Link>

                            <div className="mt-2.5 text-center">
                              <h4 
                                className="text-sm md:text-base lg:text-lg font-bold text-[#1c5434] tracking-wider uppercase"
                                style={{ fontFamily: 'Geometos, sans-serif' }}
                              >
                                {item.name || item.Name}
                              </h4>
                              <p 
                                className="text-xs md:text-sm lg:text-base font-semibold text-[#1c5434] mt-0.5 tracking-widest"
                                style={{ fontFamily: 'Geometos, sans-serif' }}
                              >
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="w-full aspect-square border-2 border-dashed border-[#1c5434]/20 rounded-lg flex flex-col items-center justify-center p-4 text-center bg-white/40">
                        <span className="text-xs font-semibold text-[#1c5434]/60 uppercase tracking-wider">No Products</span>
                        <span className="text-[10px] text-[#1c5434]/40 mt-1">Upload in Admin</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
