'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useProduct } from '@/contexts/ProductContext'

export default function AndroidPlayerPage() {
    const { setCurrentProduct } = useProduct()
    const [isDesktop, setIsDesktop] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [pageUrl, setPageUrl] = useState('')

    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 768)
        }
        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)
        return () => window.removeEventListener('resize', checkScreenSize)
    }, [])

    useEffect(() => {
        const checkMobileDevice = () => {
            setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        }
        checkMobileDevice()
    }, [])

    useEffect(() => {
        setPageUrl(window.location.href)
    }, [])

    const getWhatsAppUrl = (modelName) => {
        const phoneNumber = '60192776056'
        const message = modelName
            ? `${pageUrl}\n\nHi Dragx, I'm interested in Android Player for ${modelName}`
            : `${pageUrl}\n\nHi Dragx, I'm interested in Android Player for [Type Your Car Model Here]`

        if (isMobile) {
            return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
        } else {
            return `https://web.whatsapp.com/send?phone=${phoneNumber}?text=${encodeURIComponent(message)}`
        }
    }

    // 设置 Android Player 产品信息给 WhatsApp 按钮使用
    useEffect(() => {
        setCurrentProduct({
            name: 'Android Player - Premium Car Media System',
            category: 'androidplayer',
            url: window.location.href,
            isListPage: false,
            isAndroidPlayer: true
        })

        return () => {
            setCurrentProduct(null)
        }
    }, [setCurrentProduct])

    const pcImages = [
        '/androidplayer/PC/Android player PC-01.jpg',
        '/androidplayer/PC/Android player PC-02.jpg',
        '/androidplayer/PC/Android player PC-03.jpg',
        '/androidplayer/PC/Android player PC-04.jpg',
        '/androidplayer/PC/Android player PC-05.jpg',
        '/androidplayer/PC/Android player PC-06.jpg',
        '/androidplayer/Android player link/Android player-08.webp',
        '/androidplayer/Android player link/Android player-09.webp',
        '/androidplayer/Android player link/Android player-10.webp',
        '/androidplayer/Android player link/Android player-11.webp',
        '/androidplayer/Android player link/Android player-12.webp',
        '/androidplayer/Android player link/Android player-13.webp',
        '/androidplayer/Android player link/Android player-14.webp',
        '/androidplayer/Android player link/Android player-15.webp',
        '/androidplayer/Android player link/Android player-16.webp',
        '/androidplayer/Android player link/Android player-17.webp',
    ]

    const phoneImages = [
        '/androidplayer/phone/Android player Phone-01.webp',
        '/androidplayer/phone/Android player Phone-02.webp',
        '/androidplayer/phone/Android player Phone-03.webp',
        '/androidplayer/phone/Android player Phone-04.webp',
        '/androidplayer/phone/Android player Phone-05.webp',
        '/androidplayer/phone/Android player Phone-06.webp',
        '/androidplayer/Android player link/Android player-08.webp',
        '/androidplayer/Android player link/Android player-09.webp',
        '/androidplayer/Android player link/Android player-10.webp',
        '/androidplayer/Android player link/Android player-11.webp',
        '/androidplayer/Android player link/Android player-12.webp',
        '/androidplayer/Android player link/Android player-13.webp',
        '/androidplayer/Android player link/Android player-14.webp',
        '/androidplayer/Android player link/Android player-15.webp',
        '/androidplayer/Android player link/Android player-16.webp',
        '/androidplayer/Android player link/Android player-17.webp',
    ]

    return (
        <>
            <div className="min-h-screen" style={{ backgroundColor: '#00605b' }}>
                {/* 第一部分：大图展示 (01-06) */}
                <div className="w-full">
                    {(isDesktop ? pcImages.slice(0, 6) : phoneImages.slice(0, 6)).map((src, index) => (
                        <figure key={`hero-${index}`} className="relative">
                            <Image
                                unoptimized
                                src={src}
                                alt={`Android Player - ${index + 1}`}
                                width={1200}
                                height={800}
                                className="w-full h-auto"
                                priority={index === 0}
                            />
                        </figure>
                    ))}
                </div>

                {/* 第二部分：系列选择网格 (09-17) */}
                <div className="container mx-auto px-4 py-12">
                    <h2 className="text-white text-3xl md:text-5xl font-bold text-center mb-12 tracking-wider">
                        CHOOSE YOUR SERIES
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                        {(isDesktop ? pcImages.slice(6) : phoneImages.slice(6)).map((src, index) => {
                            // 定义每个图片对应的系列 hash 和名称
                            const seriesData = [
                                { hash: 'TRONMMEXT_EI_series', name: 'EI SERIES' },
                                { hash: 'TRONMMEXT_ES_series', name: 'ES SERIES' },
                                { hash: 'Advance_series', name: 'ADVANCE SERIES' },
                                { hash: 'Cyber_series', name: 'CYBER SERIES' },
                                { hash: 'Performance_series', name: 'PERFORMANCE SERIES' },
                                { hash: 'Luxury_series', name: 'LUXURY SERIES' },
                                { hash: 'Diamond_series', name: 'DIAMOND SERIES' },
                                { hash: 'Exclusive_series', name: 'EXCLUSIVE SERIES' },
                                { hash: 'Signature_40', name: 'SIGNATURE 40' },
                                { hash: 'Ultra_series', name: 'ULTRA SERIES' }
                            ];

                            return (
                                <div key={`series-${index}`} className="flex flex-col">
                                    <Link
                                        href={`/products/androidplayer#${seriesData[index].hash}`}
                                        className="relative group cursor-pointer block"
                                    >
                                        <Image
                                            unoptimized
                                            src={src}
                                            alt={seriesData[index].name}
                                            width={400}
                                            height={400}
                                            className="w-full h-auto rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </Link>
                                    <div className="mt-3 text-center">
                                        <h3 className="text-white font-bold text-sm md:text-base tracking-wider">
                                            {seriesData[index].name}
                                        </h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SEO Content - Hidden from visual display but readable by search engines */}
                <div className="sr-only">
                    <h1>Android Player - Premium Car Media System by DRAGX</h1>
                    <h2>Advanced Entertainment and Control System for Your Vehicle</h2>

                    <section>
                        <h3>Android Player High-Performance System</h3>
                        <p>Upgrade your car with our premium Android Player system. Experience high-speed performance, crystal-clear display, and seamless integration with your vehicle's features. Perfect for navigation, music, and apps on the go.</p>

                        <div>
                            <h4>Key Features:</h4>
                            <ul>
                                <li>High-Resolution Display</li>
                                <li>Responsive Touch Surface</li>
                                <li>Bluetooth and Wi-Fi Connectivity</li>
                                <li>Multiple App Support</li>
                                <li>Seamless Car Integration</li>
                                <li>Smooth Performance</li>
                                <li>Professional Installation</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}
