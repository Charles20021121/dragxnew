'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import './fonts.css'

const screenSizes = [
  { id: '12.3', name: '12.3 INCH', image: '/lyno/screen/12.3 INCH.jpg' },
  { id: '11.5', name: '11.5 INCH', image: '/lyno/screen/11.5 INCH.jpg' },
  { id: '10.36', name: '10.36 INCH', image: '/lyno/screen/10.36 INCH.jpg' },
  { id: '9.5', name: '9.5 INCH', image: '/lyno/screen/9.5 INCH.jpg' }
]

// 产品详细规格数据
const productDetails = {
  'pro-max-12': {
    name: 'LYNO Pro Max 12',
    specs: '12GB+256GB',
    image: '/lyno/screen/12.3 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '12GB+256GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA5.1 + Optical + USB DAC',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '13 (API=33)',
      'Screen': '12.3" → 1920*1200/2400*896',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n- 6+64 requires 360IC + camera\n- Higher versions only require 360° camera',
      'Voice Control': 'Built-in support'
    }
  },
  'max-12': {
    name: 'LYNO Max 12',
    specs: '8GB+128GB',
    image: '/lyno/screen/12.3 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '8GB+128GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA5.1 + Optical + USB DAC',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '13 (API=33)',
      'Screen': '12.3" → 1920*1200/2400*896',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n- 6+64 requires 360IC + camera\n- Higher versions only require 360° camera',
      'Voice Control': 'Built-in support'
    }
  },
  'max-lite-12': {
    name: 'LYNO Max Lite 12',
    specs: '6GB+64GB',
    image: '/lyno/screen/12.3 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7862S A55 2.0GHz (12nm)',
      'RAM+ROM': '6GB+64GB',
      'Storage': 'EMMC',
      'GPS': '3 mode (L1 E1 G1)',
      'MIC': 'Condenser MIC',
      'USB': 'USB 2.0 ×3',
      'Audio Chip': 'AKM7738 (DSP)',
      'Power Amplifier': 'TDA7850',
      'Amplifier Output': '2582 ×3',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA5.1 + Optical + USB DAC',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '10 (API=29)',
      'Screen': '12.3" → 1920×720 / 2400×896',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Not Supported',
      '360° Panorama': 'Supported (requires 360IC + camera)',
      'Voice Control': 'Built-in support'
    }
  },
  // 11.5英寸产品详细规格
  'vision-pro-11': {
    name: 'LYNO Vision Pro 11',
    specs: '12GB+256GB',
    image: '/lyno/screen/11.5 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '12GB+256GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA5.1 + Optical + USB DAC',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '13 (API=33)',
      'Screen': '11.5" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n- 6+64 requires 360IC + camera\n- Higher versions only require 360° camera',
      'Voice Control': 'Built-in support'
    }
  },
  'vision-11': {
    name: 'LYNO Vision 11',
    specs: '8GB+128GB',
    image: '/lyno/screen/11.5 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '8GB+128GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA5.1 + Optical + USB DAC',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '13 (API=33)',
      'Screen': '11.5" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n- 6+64 requires 360IC + camera\n- Higher versions only require 360° camera',
      'Voice Control': 'Built-in support'
    }
  },
  'vision-lite-11': {
    name: 'LYNO Vision Lite 11',
    specs: '6GB+64GB',
    image: '/lyno/screen/11.5 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7862S A55 2.0GHz (12nm)',
      'RAM+ROM': '6GB+64GB',
      'Storage': 'EMMC',
      'GPS': '3 mode (L1 E1 G1)',
      'MIC': 'Condenser MIC',
      'USB': 'USB 2.0 ×3',
      'Audio Chip': 'AKM7738 (DSP)',
      'Power Amplifier': 'TDA7850',
      'Amplifier Output': '2582 ×3',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA5.1 + Optical + USB DAC',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '10 (API=29)',
      'Screen': '11.5" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Not Supported',
      '360° Panorama': 'Supported (requires 360IC + camera)',
      'Voice Control': 'Built-in support'
    }
  },
  // 10.36英寸产品详细规格
  'air-max-10': {
    name: 'LYNO Air Max 10',
    specs: '12GB+256GB',
    image: '/lyno/screen/10.36 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '12GB+256GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA5.1 + Optical + USB DAC',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '13 (API=33)',
      'Screen': '10.36" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n- 6+64 requires 360IC + camera\n- Higher versions only require 360° camera',
      'Voice Control': 'Built-in support'
    }
  },
  'air-10': {
    name: 'LYNO Air 10',
    specs: '8GB+128GB',
    image: '/lyno/screen/10.36 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7862',
      'RAM+ROM': '8GB+128GB',
      'Storage': 'EMMC',
      'GPS': '3 mode (L1 E1 G1)',
      'MIC': 'Condenser MIC',
      'USB': 'USB 2.0 ×3',
      'Audio Chip': 'ROHM32107 (DSP)',
      'Power Amplifier': 'TDA7851',
      'Amplifier Output': 'None',
      'Filter Capacitance': '6800μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA2.1 + Optical + USB DAC',
      'Bluetooth': 'Realtek 8761',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '10 (API=29)',
      'Screen': '10.36" → 1280*720',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Not Supported',
      '360° Panorama': 'Supported (requires 360IC + camera)',
      'Voice Control': 'Requires extra software'
    }
  },
  'core-10': {
    name: 'LYNO Core 10',
    specs: '4GB+64GB',
    image: '/lyno/screen/10.36 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7862',
      'RAM+ROM': '4GB+64GB',
      'Storage': 'EMMC',
      'GPS': '3 mode (L1 E1 G1)',
      'MIC': 'Condenser MIC',
      'USB': 'USB 2.0 ×3',
      'Audio Chip': 'ROHM32107 (DSP)',
      'Power Amplifier': 'TDA7851',
      'Amplifier Output': 'None',
      'Filter Capacitance': '6800μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA2.1 + Optical + USB DAC',
      'Bluetooth': 'Realtek 8761',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '10 (API=29)',
      'Screen': '10.36" → 1280*720',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Not Supported',
      '360° Panorama': 'Supported (requires 360IC + camera)',
      'Voice Control': 'Requires extra software'
    }
  },
  // 9.5英寸产品详细规格
  'air-max-9': {
    name: 'LYNO Air Max 9',
    specs: '12GB+256GB',
    image: '/lyno/screen/9.5 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7870 A76 2.7GHz (6nm)',
      'RAM+ROM': '12GB+256GB',
      'Storage': 'UFS (Up to 1700MB/s R, 128GB+)',
      'GPS': 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)',
      'MIC': 'Digital Noise Cancelling MIC',
      'USB': 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3',
      'Audio Chip': 'AKM7739 (DSP, VELVET Audio Technology)',
      'Power Amplifier': 'TDA7808 Digital Enhanced Class AB Power Amplifier',
      'Amplifier Output': '5532 ×3 (Enhanced Audio Signal)',
      'Filter Capacitance': '10000μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA5.1 + Optical + USB DAC',
      'Bluetooth': 'Qualcomm 3031 (BT 5.0, aptX HD)',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '13 (API=33)',
      'Screen': '9.5" → 2000*1200',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Supported',
      '360° Panorama': 'Supported\n- 6+64 requires 360IC + camera\n- Higher versions only require 360° camera',
      'Voice Control': 'Built-in support'
    }
  },
  'air-9': {
    name: 'LYNO Air 9',
    specs: '8GB+128GB',
    image: '/lyno/screen/9.5 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7862',
      'RAM+ROM': '8GB+128GB',
      'Storage': 'EMMC',
      'GPS': '3 mode (L1 E1 G1)',
      'MIC': 'Condenser MIC',
      'USB': 'USB 2.0 ×3',
      'Audio Chip': 'ROHM32107 (DSP)',
      'Power Amplifier': 'TDA7851',
      'Amplifier Output': 'None',
      'Filter Capacitance': '6800μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA2.1 + Optical + USB DAC',
      'Bluetooth': 'Realtek 8761',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '10 (API=29)',
      'Screen': '9.5" → 1280*720',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Not Supported',
      '360° Panorama': 'Supported (requires 360IC + camera)',
      'Voice Control': 'Requires extra software'
    }
  },
  'core-9': {
    name: 'LYNO Core 9',
    specs: '4GB+64GB',
    image: '/lyno/screen/9.5 INCH 2.jpg',
    details: {
      'CPU': '8-Core UIS7862',
      'RAM+ROM': '4GB+64GB',
      'Storage': 'EMMC',
      'GPS': '3 mode (L1 E1 G1)',
      'MIC': 'Condenser MIC',
      'USB': 'USB 2.0 ×3',
      'Audio Chip': 'ROHM32107 (DSP)',
      'Power Amplifier': 'TDA7851',
      'Amplifier Output': 'None',
      'Filter Capacitance': '6800μF',
      'Radio': 'TDA7708 FM/AM',
      'Audio Output': 'RCA2.1 + Optical + USB DAC',
      'Bluetooth': 'Realtek 8761',
      'System Mode': 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)',
      'Android Version': '10 (API=29)',
      'Screen': '9.5" → 1280*720',
      'CarPlay/Android Auto': 'Wired + Wireless',
      'Network': '4G LTE external card slot + Wi-Fi',
      'Front & Rear Recording': 'Not Supported',
      '360° Panorama': 'Supported (requires 360IC + camera)',
      'Voice Control': 'Requires extra software'
    }
  }
}

// 所有屏幕尺寸的产品选项
const productOptions = {
  '12.3': [
    {
      id: 'pro-max-12',
      name: 'LYNO Pro Max 12',
      specs: '12GB+256GB',
      image: '/lyno/screen/12.3 INCH.jpg'
    },
    {
      id: 'max-12',
      name: 'LYNO Max 12',
      specs: '8GB+128GB',
      image: '/lyno/screen/12.3 INCH.jpg'
    },
    {
      id: 'max-lite-12',
      name: 'LYNO Max Lite 12',
      specs: '6GB+64GB',
      image: '/lyno/screen/12.3 INCH.jpg'
    }
  ],
  '11.5': [
    {
      id: 'vision-pro-11',
      name: 'LYNO Vision Pro 11',
      specs: '12GB+256GB',
      image: '/lyno/screen/11.5 INCH.jpg'
    },
    {
      id: 'vision-11',
      name: 'LYNO Vision 11',
      specs: '8GB+128GB',
      image: '/lyno/screen/11.5 INCH.jpg'
    },
    {
      id: 'vision-lite-11',
      name: 'LYNO Vision Lite 11',
      specs: '6GB+64GB',
      image: '/lyno/screen/11.5 INCH.jpg'
    }
  ],
  '10.36': [
    {
      id: 'air-max-10',
      name: 'LYNO Air Max 10',
      specs: '12GB+256GB',
      image: '/lyno/screen/10.36 INCH.jpg'
    },
    {
      id: 'air-10',
      name: 'LYNO Air 10',
      specs: '8GB+128GB',
      image: '/lyno/screen/10.36 INCH.jpg'
    },
    {
      id: 'core-10',
      name: 'LYNO Core 10',
      specs: '4GB+64GB',
      image: '/lyno/screen/10.36 INCH.jpg'
    }
  ],
  '9.5': [
    {
      id: 'air-max-9',
      name: 'LYNO Air Max 9',
      specs: '12GB+256GB',
      image: '/lyno/screen/9.5 INCH.jpg'
    },
    {
      id: 'air-9',
      name: 'LYNO Air 9',
      specs: '8GB+128GB',
      image: '/lyno/screen/9.5 INCH.jpg'
    },
    {
      id: 'core-9',
      name: 'LYNO Core 9',
      specs: '4GB+64GB',
      image: '/lyno/screen/9.5 INCH.jpg'
    }
  ]
}

export default function LynoPage() {
  const [selectedScreen, setSelectedScreen] = useState('12.3')
  const [isDesktop, setIsDesktop] = useState(false)
  const [showProductOptions, setShowProductOptions] = useState(true) // 默认显示产品选项
  const [selectedProduct, setSelectedProduct] = useState(productOptions['12.3'][0].id) // 默认选中12.3英寸的第一个产品
  const [indicatorPosition, setIndicatorPosition] = useState({ left: 0, width: 0 })
  const screenRefs = useRef({})

  // 计算指示器位置
  const updateIndicatorPosition = () => {
    const selectedElement = screenRefs.current[selectedScreen]
    if (selectedElement) {
      const containerElement = selectedElement.parentElement.parentElement // 获取容器元素
      const containerRect = containerElement.getBoundingClientRect()
      const elementRect = selectedElement.getBoundingClientRect()
      
      const left = elementRect.left - containerRect.left + (elementRect.width / 2)
      const width = isDesktop ? 80 : 32
      
      setIndicatorPosition({
        left: left - (width / 2),
        width: width
      })
    }
  }

  useEffect(() => {
    // 只在客户端设置实际的屏幕宽度状态
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    // 初始检查
    checkScreenSize()

    // 监听窗口大小变化
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // 更新指示器位置当选中屏幕或窗口大小改变时
  useEffect(() => {
    // 延迟一点时间确保DOM已经更新
    const timer = setTimeout(() => {
      updateIndicatorPosition()
    }, 100)
    
    return () => clearTimeout(timer)
  }, [selectedScreen, isDesktop])

  // 监听窗口resize事件来更新指示器位置
  useEffect(() => {
    const handleResize = () => {
      updateIndicatorPosition()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [selectedScreen, isDesktop])

  // 处理屏幕尺寸点击
  const handleScreenClick = (screenId) => {
    setSelectedScreen(screenId)
    
    // 如果点击的屏幕有产品选项，显示产品选项并默认选中第一个
    if (productOptions[screenId]) {
      setShowProductOptions(true)
      setSelectedProduct(productOptions[screenId][0].id) // 默认选中第一个产品
    } else {
      setShowProductOptions(false)
      setSelectedProduct(null)
    }
  }
  return (
    <>
      <div className="relative">
        {/* 背景图片 */}
        <Image
          src="/lyno/LYNO PAGE-01.webp"
          alt="LYNO - Light Your New Omni-System - Smart entertainment and control system for your digital life"
          width={1200}
          height={800}
          className="w-full h-auto"
          priority
        />
        {/* SEO文字覆盖 - 对用户不可见但搜索引擎可读 */}
        <div className="sr-only">
          <h1>LYNO</h1>
          <h2>Light Your New Omni-System</h2>
          <p>
            Unlocking a new level of smart entertainment and control — fast, intelligent, and made just for you. 
            It's not just a player; it's a complete system that powers your digital life.
          </p>
        </div>
      </div>



      {/* Screen Sizes Section */}
      <div className="bg-white py-16">
       <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
         {/* Screen Grid with Separators */}
         <div className="flex flex-row items-center justify-center divide-x divide-gray-300 gap-1 md:gap-8 relative">
            {screenSizes.map((screen) => (
              <div 
                key={screen.id}
                className="flex flex-col items-center py-0 px-2 md:px-12 space-y-4 cursor-pointer transition-all duration-300"
                onClick={() => handleScreenClick(screen.id)}
              >
                <div 
                  ref={(el) => screenRefs.current[screen.id] = el}
                  className="relative w-16 h-10 md:w-40 md:h-24"
                >
                  <Image
                    src={screen.image}
                    alt={`LYNO ${screen.name} Android Car Display - Premium In-Car Entertainment System`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 64px, 160px"
                  />
                </div>
                <div className="text-center relative">
                  <h3 className="font-bold text-sm" style={{ 
                    fontFamily: 'Nasalization, Orbitron, sans-serif', 
                    color: selectedScreen === screen.id ? '#000000' : '#4a5568'
                  }}>
                    {screen.name}
                  </h3>
                </div>
              </div>
            ))}
            
            {/* Base line - 底部长线 */}
            <div className="absolute -bottom-4 left-0 right-0 h-[2px] bg-gray-300"></div>
            
            {/* Active indicator - 选中的粗线 */}
            <motion.div
              layoutId="screenIndicator"
              className="absolute -bottom-4 h-[4px] bg-black"
              style={{
                width: indicatorPosition.width,
                left: indicatorPosition.left
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
            />
         </div>
       </div>
      </div>

      {/* Product Options Section */}
      {showProductOptions && productOptions[selectedScreen] && (
        <div className="bg-gray-50 sm:py-16 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 gap-2 md:gap-8">
              {productOptions[selectedScreen].map((product) => (
                <motion.div
                  key={product.id}
                  className={`${
                    selectedProduct === product.id ? 'bg-gray-300' : 'bg-white'
                  } rounded-lg p-2 md:p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}
                  onClick={() => setSelectedProduct(product.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2" style={{ 
                      fontFamily: 'Nasalization, Orbitron, sans-serif',
                      color: '#000000'
                    }}>
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-lg text-gray-600 font-semibold">
                      {product.specs}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Details Section - 左边照片，右边规格表 */}
      {selectedProduct && productDetails[selectedProduct] && (
        <div className="bg-white py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* 左侧：产品图片 */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md">
                  <Image
                    src={productDetails[selectedProduct].image}
                    alt={productDetails[selectedProduct].name}
                    width={500}
                    height={350}
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="mt-6">
                  <button className="bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-500 transition-colors duration-300">
                    SHOP NOW
                  </button>
                </div>
              </div>
              
              {/* 右侧：产品详细规格 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(productDetails[selectedProduct].details).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-semibold text-gray-700 text-sm">{key}:</span>
                      <span className="text-gray-600 text-right text-sm max-w-xs whitespace-pre-line">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Images Below Screen Section */}
      <figure className="relative">
        <Image
          src={isDesktop ? "/lyno/LYNO PAGE-02.webp" : "/lyno/PHONE SIZE-02.webp"}
          alt="UIS 7870 - The Smart Heart of Performance - 2.7Ghz 8 core 6nm Process with 204% CPU Boost and 240% GPU Boost"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <figcaption className="sr-only">
          UIS 7870 processor featuring 2.7Ghz clock speed, 8 core architecture, 6nm manufacturing process, delivering 204% CPU Boost and 240% GPU Boost performance
        </figcaption>
      </figure>
      
      <figure className="relative">
        <Image
          src={isDesktop ? "/lyno/LYNO PAGE-03.webp" : "/lyno/PHONE SIZE-03.webp"}
          alt="Creative Mode - Customize themes, backgrounds and personalize your dashboard experience"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <figcaption className="sr-only">
          Creative Mode lets you customize themes, backgrounds, and personalize your dashboard and multimedia experience to match your style and mood
        </figcaption>
      </figure>
      
      <figure className="relative">
        <Image
          src={isDesktop ? "/lyno/LYNO PAGE-04.webp" : "/lyno/PHONE SIZE-04.webp"}
          alt="Premium Audio System - AKM7739 DSP Experience Studio-Grade Audio, TDA7808 Hear the Road Feel the Power, OpAmp 5532*3 Built for Clarity"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <figcaption className="sr-only">
          Crystal-Clear Voice with Digital Noise Blocking featuring AKM7739 DSP for Studio-Grade Audio, TDA7808 amplifier to Hear the Road and Feel the Power, OpAmp 5532*3 Built for Clarity and Tuned for Passion
        </figcaption>
      </figure>
      
      <figure className="relative">
        <Image
          src={isDesktop ? "/lyno/LYNO PAGE-05.webp" : "/lyno/PHONE SIZE-05.webp"}
          alt="Flexible UI Layout Mode - Customize arrangement, size, and position of widgets, media panels, and system controls"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <figcaption className="sr-only">
          Flexible UI Layout Mode allows users to freely customize the arrangement, size, and position of on-screen elements such as widgets, media panels, navigation shortcuts, and system controls. This mode provides a personalized, modular dashboard that adapts to individual preferences and usage habits.
        </figcaption>
      </figure>
      
      <figure className="relative">
        <Image
          src="/lyno/LYNO PAGE-06.webp"
          alt="360° Vision, Zero Blind Spots - Complete real-time panoramic view for safety and control"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <figcaption className="sr-only">
          Delivers a complete, real-time panoramic view of the surroundings, ensuring no area is left unseen. Perfect for safety, awareness, and total control.
        </figcaption>
      </figure>
      
      <figure className="relative">
        <Image
          src={isDesktop ? "/lyno/LYNO PAGE-07.webp" : "/lyno/PHONE SIZE-07.webp"}
          alt="More Plugins - Comprehensive dashboard with weather, trip info, TPMS, music, navigation and system controls"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <figcaption className="sr-only">
          Advanced plugin system featuring weather updates, trip information, TPMS monitoring, music control, map navigation, energy flow monitoring, compass, and comprehensive vehicle data display
        </figcaption>
      </figure>
      
      <figure className="relative">
        <Image
          src={isDesktop ? "/lyno/LYNO PAGE-08.webp" : "/lyno/PHONE SIZE-08.webp"}
          alt="Stay Connected, Stay Focused - Seamless Android Auto and Apple CarPlay integration"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <figcaption className="sr-only">
          Enjoy seamless access to your favorite apps, maps, calls, and music — all directly from your dashboard with Android Auto and Apple CarPlay
        </figcaption>
      </figure>

      <figure className="relative">
        <Image
          src={isDesktop ? "/lyno/LYNO PAGE-09.webp" : "/lyno/PHONE SIZE-09.webp"}
          alt="LYNO Advanced Features - Enhanced multimedia and connectivity capabilities"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <figcaption className="sr-only">
          Experience advanced multimedia features and seamless connectivity with LYNO's enhanced capabilities
        </figcaption>
      </figure>

      <figure className="relative">
        <Image
          src={isDesktop ? "/lyno/LYNO PAGE-10.webp" : "/lyno/PHONE SIZE-10.webp"}
          alt="LYNO Complete Solution - Comprehensive entertainment and control system"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
        <figcaption className="sr-only">
          A complete entertainment and control solution that transforms your driving experience
        </figcaption>
      </figure>
    </>
  )
}
