"use client"
import { motion } from "framer-motion"
import { FaWhatsapp } from "react-icons/fa"
import { usePathname } from 'next/navigation'

export default function WhatsAppButton() {
  const pathname = usePathname()
  
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
        href="https://wa.me/60192776056?text=Hi Dragx, Can you recommend a product that suits my needs?"
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