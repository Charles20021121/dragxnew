"use client"
import { motion } from "framer-motion"
import { FaWhatsapp } from "react-icons/fa"
import { usePathname } from 'next/navigation'
import { useProduct } from '@/contexts/ProductContext'

export default function WhatsAppButton() {
  const pathname = usePathname()
  const { currentProduct } = useProduct()
  
  // 检测是否为移动设备
  const isMobileDevice = () => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  const handleWhatsAppClick = () => {
    // 追蹤 WhatsApp 聯繫事件
    if (window.fbq) {
      window.fbq('track', 'Contact', {
        content_category: 'WhatsApp',
        content_name: 'WhatsApp Inquiry'
      });
    }
  }

  // 如果路徑包含 'admin' 或 'login'，不顯示按鈕
  if (pathname.includes('/admin') || pathname.includes('/login')) {
    return null
  }

  // 获取产品分类显示名称
  const getProductCategory = () => {
    if (!currentProduct) return ''
    
    // 如果是 LYNO 页面
    if (currentProduct.isLyno || pathname.includes('/lyno')) {
      return 'LYNO'
    }
    
    // 如果是 DX360 页面
    if (currentProduct.isDX360 || pathname.includes('/dx360')) {
      return 'DX360'
    }
    
    // 如果是 Power Boot 页面
    if (currentProduct.isPowerBoot || pathname.includes('/powerboot')) {
      return 'POWER BOOT'
    }
    
    // 如果是 Soundproof 页面
    if (currentProduct.isSoundproof || pathname.includes('/silence')) {
      const soundproofMap = {
        'hatchback': 'SOUNDPROOF - HATCHBACK',
        'sedan': 'SOUNDPROOF - SEDAN',
        'suv': 'SOUNDPROOF - SUV',
        'mpv': 'SOUNDPROOF - MPV'
      }
      return soundproofMap[currentProduct.filter1] || 'SOUNDPROOF'
    }
    
    // 根据 filter1 判断分类
    if (currentProduct.filter1 === 'androidPlayer') {
      return 'ANDROID PLAYER'
    } else if (currentProduct.filter1 === 'contiAndroid') {
      return 'ANDROID SCREEN'
    }
    
    return ''
  }

  // 获取 Android Series 显示名称
  const getAndroidSeries = () => {
    if (!currentProduct || !currentProduct.android_series) return ''
    
    const seriesMap = {
      'Advance_series': 'Advance Series',
      'Android_Ai_Box': 'Android Ai Box',
      'Cyber_series': 'Cyber Series',
      'Diamond_series': 'Diamond Series',
      'Exclusive_series': 'Exclusive Series',
      'Luxury_series': 'Luxury Series',
      'Performance_series': 'Performance Series',
      'Signature_40': 'Signature 40',
      'TRONMMEXT_EI_series': 'TRONMMEXT EI Series',
      'TRONMMEXT_ES_series': 'TRONMMEXT ES Series',
      'Ultra_series': 'Ultra Series',
      'Others': 'Others'
    }
    
    return seriesMap[currentProduct.android_series] || currentProduct.android_series
  }

  // 生成 WhatsApp 消息
  const getWhatsAppMessage = () => {
    if (currentProduct) {
      // 构建完整的产品 URL
      const productUrl = `${window.location.origin}${pathname}`
      
      // 如果是列表页面
      if (currentProduct.isListPage) {
        let message = `Hi Dragx, I'm browsing your products:%0A%0A`
        
        // 添加分类信息
        const category = getProductCategory()
        if (category) {
          message += `Category: *${encodeURIComponent(category)}*%0A`
        } else {
          message += `Category: *${encodeURIComponent(currentProduct.name)}*%0A`
        }
        
        message += `%0APage Link: ${encodeURIComponent(productUrl)}%0A%0ACan you help me choose a suitable product?`
        
        return message
      }
      
      // 如果是产品详情页面
      let message = `Hi Dragx, I'm interested in this product:%0A%0A*${encodeURIComponent(currentProduct.name)}*`
      
      // 添加分类信息（如果是 Android Player 相关）
      const category = getProductCategory()
      if (category) {
        message += `%0A%0ACategory: ${encodeURIComponent(category)}`
      }
      
      // 添加 Android Series 信息（如果有）
      const series = getAndroidSeries()
      if (series) {
        message += `%0ASeries: ${encodeURIComponent(series)}`
      }
      
      message += `%0A%0AProduct Link: ${encodeURIComponent(productUrl)}%0A%0ACan you provide more information?`
      
      return message
    }
    // 默认消息
    return "Hi Dragx, Can you recommend a product that suits my needs?"
  }

  // 生成 WhatsApp URL（根据设备类型）
  const getWhatsAppUrl = () => {
    const phoneNumber = '60192776056'
    const message = getWhatsAppMessage()
    
    if (isMobileDevice()) {
      // 移动设备：使用 wa.me（打开 WhatsApp App）
      return `https://wa.me/${phoneNumber}?text=${message}`
    } else {
      // 电脑：使用 web.whatsapp.com
      return `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`
    }
  }

  return (
    <motion.div
      className="fixed bottom-16 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1
      }}
    >
      {/* Pulse Effect - 放在下層 */}
      <div className="absolute inset-0 rounded-full">
        <div className="absolute inset-0 animate-ping bg-[#25D366] rounded-full opacity-25"></div>
      </div>

      {/* Button - 放在上層 */}
      <motion.a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg  transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsAppClick}
      >
        <FaWhatsapp className="text-white text-3xl" />
      </motion.a>
    </motion.div>
  )
} 