"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { CldImage } from 'next-cloudinary'

export default function ImageModal({ images, currentIndex, onClose }) {
  const [index, setIndex] = useState(currentIndex)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  // 監聽鍵盤事件
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") handlePrevious()
      if (e.key === "ArrowRight") handleNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [index])

  // 處理觸摸滑動
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNext()
    }
    if (isRightSwipe) {
      handlePrevious()
    }
  }

  const handlePrevious = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex items-center justify-center"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* 關閉按鈕 */}
        <button
          className="absolute top-4 right-4 text-white z-50 p-2"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 上一張按鈕 */}
        <button
          className="absolute left-4 text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block"
          onClick={(e) => {
            e.stopPropagation()
            handlePrevious()
          }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* 圖片 */}
        <div className="relative w-full h-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <div className="relative w-full h-full max-w-7xl mx-auto">
                <CldImage
                  src={images[index].Url}
                  alt={images[index].Name || "Gallery image"}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 下一張按鈕 */}
        <button
          className="absolute right-4 text-white z-50 p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block"
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* 圖片計數器 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full z-50">
          {index + 1} / {images.length}
        </div>

        {/* MORE INFO Button Overlay */}
        {images[index].link && images[index].link.trim() !== '' && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50">
            <a
              href={images[index].link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#88bc04] text-white text-center py-2.5 px-8 rounded-lg text-sm font-bold hover:bg-[#6a9603] transition-colors uppercase tracking-wider shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:scale-105 transform duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              MORE INFO
            </a>
          </div>
        )}

        {/* Preloader for next image */}
        <div className="hidden">
          <CldImage
            src={images[(index + 1) % images.length].Url}
            alt="preload"
            width={1}
            height={1}
            priority
          />
          <CldImage
            src={images[(index - 1 + images.length) % images.length].Url}
            alt="preload-prev"
            width={1}
            height={1}
            priority
          />
        </div>
      </div>
    </motion.div >
  )
} 