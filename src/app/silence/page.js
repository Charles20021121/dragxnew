"use client"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CldImage } from 'next-cloudinary'
import HeroSection from "@/components/HeroSection"
import { useProduct } from '@/contexts/ProductContext'

const categories = ['HATCHBACK', 'SEDAN', 'SUV', 'MPV']

export default function SilencePage() {
  const { setCurrentProduct } = useProduct()
  const [activeCategory, setActiveCategory] = useState('HATCHBACK')
  const [products, setProducts] = useState({
    HATCHBACK: [],
    SEDAN: [],
    SUV: [],
    MPV: []
  })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobileDevice = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    }
    checkMobileDevice()
    window.addEventListener('resize', checkMobileDevice)
    return () => window.removeEventListener('resize', checkMobileDevice)
  }, [])

  const [pageUrl, setPageUrl] = useState('')

  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  const getWhatsAppUrl = (productName) => {
    const phoneNumber = '60192776056'
    const message = `${pageUrl}\n\nHi Dragx, I'm interested in Soundproof: ${productName}`

    if (isMobile) {
      return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    } else {
      return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?category=soundproof')
        if (!response.ok) throw new Error('Failed to fetch products')
        const data = await response.json()

        // 將產品按 filter1 分類
        const categorizedProducts = {
          HATCHBACK: data.filter(p => p.filter1?.toLowerCase() === 'hatchback'),
          SEDAN: data.filter(p => p.filter1?.toLowerCase() === 'sedan'),
          SUV: data.filter(p => p.filter1?.toLowerCase() === 'suv'),
          MPV: data.filter(p => p.filter1?.toLowerCase() === 'mpv')
        }

        setProducts(categorizedProducts)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  // 设置 Soundproof 产品信息给 WhatsApp 按钮使用
  useEffect(() => {
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
  }, [activeCategory, setCurrentProduct])

  return (
    <main>
      <HeroSection
        image="https://res.cloudinary.com/dmkxx68km/image/upload/v1739513529/vezb74clm89wdwzadtud.webp"
        aspectRatio="3334/1042"
      />
      <div className="bg-black bg-no-repeat bg-cover bg-center" style={{
        backgroundImage: `url('https://res.cloudinary.com/dmkxx68km/image/upload/v1739514134/q45ew1xcvjtd43klbcql.webp')`
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
                  {activeCategory === category && (
                    <motion.div
                      layoutId="activeIndicator"
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
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 產品展示區域 */}
        <div className="container mx-auto px-4 md:px-20 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {products[activeCategory]?.map((product, index) => (
                <motion.div
                  key={`${activeCategory}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative"
                >
                  <CldImage
                    src={product.image}
                    alt="Product Image"
                    width={400}
                    height={400}
                    className="w-full"
                  />
                  <div className="flex justify-center">
                    <button className="px-4 py-2 mt-4 bg-[#64acac] hover:bg-[#4d8484] text-white font-bold rounded-full transition-colors">
                      <a target="_blank" href={getWhatsAppUrl(product.name || product.Name)}>SHOP NOW</a>
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <HeroSection
        image="https://res.cloudinary.com/dmkxx68km/image/upload/v1739526265/t2nairvmqzh3465yf0ry.webp"
        mobileImage="https://res.cloudinary.com/dmkxx68km/image/upload/v1739527999/joo4pf3evml9vtfs6ads.webp"
        aspectRatio="3334/1277"
        mobileAspectRatio="3334/2479"
      />
      <HeroSection
        image="https://res.cloudinary.com/dmkxx68km/image/upload/v1739526656/l9vs63elicroo5p9eocz.webp"
        mobileImage="https://res.cloudinary.com/dmkxx68km/image/upload/v1739527999/teuxfnrwq7awfns0lsob.webp"
        aspectRatio="3334/1277"
        mobileAspectRatio="3334/1680"
      />
      <HeroSection
        image="https://res.cloudinary.com/dmkxx68km/image/upload/v1739526656/uav09ng6ndhuv84w7aoa.webp"
        mobileImage="https://res.cloudinary.com/dmkxx68km/image/upload/v1739527999/g5uclbikf5kzfzhnhdde.webp"
        aspectRatio="3334/1277"
        mobileAspectRatio="3334/2154"
      />
      <HeroSection
        image="https://res.cloudinary.com/dmkxx68km/image/upload/v1739526656/to2qmvww2hjs1aeualfc.webp"
        mobileImage="https://res.cloudinary.com/dmkxx68km/image/upload/v1739527999/tgxoqvacn6rmdm95phit.webp"
        aspectRatio="3334/1541"
        mobileAspectRatio="3334/2154"
      />
      <HeroSection
        image="https://res.cloudinary.com/dmkxx68km/image/upload/v1739526696/r0yi1kfx04qf8ji279pz.webp"
        mobileImage="https://res.cloudinary.com/dmkxx68km/image/upload/v1739527998/rbb6tvepk4zqpf48b7tk.webp"
        aspectRatio="3334/877"
        mobileAspectRatio="3334/1154"
      />

    </main>
  )
}