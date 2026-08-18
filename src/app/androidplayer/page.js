'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useProduct } from '@/contexts/ProductContext'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

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
        '/androidplayer/Android player link/Android player-10.webp',
        '/androidplayer/Android player link/Android player-11.webp',
        '/androidplayer/Android player link/Android player-12.webp',
        '/androidplayer/Android player link/Android player-13.webp',
        '/androidplayer/Android player link/Android player-14.webp',
        '/androidplayer/Android player link/Android player-16.webp',
        '/androidplayer/Android player link/Android player-17.webp',
        '/androidplayer/Android player link/Android player-18.webp',
        '/androidplayer/Android player link/Android player-19.webp',
    ]

    const phoneImages = [
        '/androidplayer/phone/Android player Phone-01.webp',
        '/androidplayer/phone/Android player Phone-02.webp',
        '/androidplayer/phone/Android player Phone-03.webp',
        '/androidplayer/phone/Android player Phone-04.webp',
        '/androidplayer/phone/Android player Phone-05.webp',
        '/androidplayer/phone/Android player Phone-06.webp',
        '/androidplayer/Android player link/Android player-08.webp',
        '/androidplayer/Android player link/Android player-10.webp',
        '/androidplayer/Android player link/Android player-11.webp',
        '/androidplayer/Android player link/Android player-12.webp',
        '/androidplayer/Android player link/Android player-13.webp',
        '/androidplayer/Android player link/Android player-14.webp',
        '/androidplayer/Android player link/Android player-16.webp',
        '/androidplayer/Android player link/Android player-17.webp',
        '/androidplayer/Android player link/Android player-18.webp',
        '/androidplayer/Android player link/Android player-19.webp',
    ]

    return (
        <>
            <div className="min-h-screen" style={{ backgroundColor: '#00605b' }}>
                {/* 顶部横幅 (背景图模式) */}
                <div className="relative w-full bg-[#011512] overflow-hidden">

                    {/* Background Image (作为真实流内容撑开高度，保证按比例缩放不被裁剪) */}
                    <img
                        src={isDesktop ? "/androidplayer/pc/Android player PC 2-01.webp" : "/androidplayer/phone/Android player Phone-01.webp"}
                        alt="Android Player Hero Banner"
                        className="w-full h-auto block"
                    />

                    {/* Logo and Main Content */}
                    <div className="absolute inset-0 flex flex-col z-10 pointer-events-none">
                        <div className="hidden md:block absolute top-[4%] lg:top-[6%] left-[10%] w-[15vw] md:w-[18vw] lg:w-[15vw] z-10 pointer-events-auto">
                            <Image
                                unoptimized
                                src="/androidplayer/logo.webp"
                                alt="DX Android Player Logo"
                                width={400}
                                height={120}
                                className="w-full h-auto object-contain"
                            />
                        </div>

                        {/* Main Content - 参考 Ambient Light 完美百分比缩放排版 */}
                        <div className="hidden md:flex absolute inset-0 flex-col justify-center items-start px-[8%] lg:px-[12%] w-[45%] pointer-events-auto">
                            {/* 第一行大標題 */}
                            <h1
                                className="font-bold text-white mb-2 lg:mb-4 tracking-wide whitespace-nowrap drop-shadow-lg"
                                style={{ fontFamily: 'Geometos, sans-serif', fontSize: '3vw', lineHeight: '1.1' }}
                            >
                                ANDROID PLAYER
                            </h1>
                            {/* 第二行副标题 */}
                            <p
                                className="text-white mb-2 lg:mb-6 drop-shadow-md whitespace-nowrap"
                                style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.4vw', lineHeight: '1.4' }}
                            >
                                Upgrade to a Smarter Driving Experience
                            </p>
                            {/* 段落文本 */}
                            <p
                                className="text-gray-200 text-justify drop-shadow-md"
                                style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.1vw', lineHeight: '1.5' }}
                            >
                                It replaces or upgrades your factory head unit, giving your vehicle a tablet-like smart interface with advanced apps, navigation, and entertainment features.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 第二部分：更多功能对比 (背景实拍照片) */}
                <div className="relative w-full bg-black overflow-hidden">

                    {/* Background Image */}
                    <img
                        src={isDesktop ? "/androidplayer/pc/Android player PC 2-02.webp" : "/androidplayer/phone/Android player Phone-02.webp"}
                        alt="Android Player in Car"
                        className="w-full h-auto block"
                    />

                    {/* Content Container (参考 Banner 1 使用纯百分比定位和 vw 字体等比例缩放) */}
                    <div className="hidden md:flex absolute inset-0 flex-col justify-center items-start pl-[50%] lg:pl-[52%] pr-[6%] lg:pr-[8%] w-full">
                        <div className="w-full flex flex-col text-left">
                            <h2
                                className="font-bold text-white uppercase tracking-wide drop-shadow-lg mb-2 lg:mb-4 whitespace-nowrap"
                                style={{ fontFamily: 'Geometos, sans-serif', fontSize: '2.5vw', lineHeight: '1.2' }}
                            >
                                MORE FUNCTIONS COMPARED<br className="hidden md:block" /> TO FACTORY HEAD UNITS
                            </h2>
                            <p
                                className="text-gray-200 drop-shadow-md text-justify w-full"
                                style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '0.95vw', lineHeight: '1.5' }}
                            >
                                Factory systems are limited. An Android Player gives you powerful features like smartphone-style apps, online navigation, 360° cameras, entertainment options, and more.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 第三部分：更大更清晰的屏幕 (背景实拍照片) */}
                <div className="relative w-full bg-[#01100e] overflow-hidden">

                    {/* Background Image */}
                    <img
                        src={isDesktop ? "/androidplayer/pc/Android player PC 2-03.webp" : "/androidplayer/phone/Android player Phone-03.webp"}
                        alt="Bigger and Clearer Display"
                        className="w-full h-auto block"
                    />

                    {/* Content Container (参考 Banner 1 使用纯百分比定位和 vw 字体等比例缩放) */}
                    <div className="hidden md:flex absolute inset-0 flex-col justify-center items-end pr-[48%] lg:pr-[50%] pl-[6%] lg:pl-[8%] w-full">
                        <div className="w-fit flex flex-col items-end text-right">
                            <h2
                                className="font-bold text-white uppercase tracking-widest drop-shadow-lg mb-2 lg:mb-4 whitespace-nowrap"
                                style={{ fontFamily: 'Geometos, sans-serif', fontSize: '2.5vw', lineHeight: '1.2' }}
                            >
                                BIGGER & CLEARER DISPLAY
                            </h2>
                            <p
                                className="text-gray-200 drop-shadow-md text-right w-full"
                                style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.0vw', lineHeight: '1.5' }}
                            >
                                Available in 9" / 10" / 12"/OEM screens, making navigation, reverse camera, and<br className="hidden md:block" /> media viewing much clearer and safer.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 第四部分：三大特色功能 (手机版直接显示全图) */}
                <div className="w-full block md:hidden bg-black overflow-hidden">
                    <img
                        src="/androidplayer/phone/Android player Phone-04.webp"
                        alt="Split Screen, Voice Control & Wireless Features"
                        className="w-full h-auto block"
                    />
                </div>

                {/* 第四部分：三大特色功能 (电脑版：真实图片 + 极简无边框设计) */}
                <div className="w-full bg-[#002b2a] py-16 md:py-24 hidden md:block">
                    <div className="container mx-auto px-6 md:px-12 lg:px-16 flex flex-col items-center">

                        {/* Section Title */}
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white uppercase text-center leading-tight tracking-wide mb-12 md:mb-16 drop-shadow-md" style={{ fontFamily: 'Geometos, sans-serif' }}>
                            SUPPORTS SPLIT SCREEN, VOICE CONTROL<br className="hidden md:block" /> & WIRELESS FEATURES
                        </h2>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full max-w-[1400px]">

                            {/* Feature 1: Split Screen */}
                            <div className="flex flex-col items-center">
                                <div className="w-full aspect-[16/10] md:aspect-[4/3] relative rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-lg">
                                    <img src="/androidplayer/5. SS,VC,WF 3张图/link-02.webp" alt="Split Screen" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-2xl md:text-[28px] font-bold text-white tracking-wide mb-4 text-center" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>Split Screen</h3>
                                <p className="text-[#b3c9c6] text-[15px] md:text-[16px] leading-relaxed text-justify px-2 md:px-4" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                                    Run two apps at the same time - for example, use Google Maps + Music, or YouTube + Car menu. This helps you access more functions without switching screens.
                                </p>
                            </div>

                            {/* Feature 2: Voice Control */}
                            <div className="flex flex-col items-center">
                                <div className="w-full aspect-[16/10] md:aspect-[4/3] relative rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-lg">
                                    <img src="/androidplayer/5. SS,VC,WF 3张图/link-03.webp" alt="Voice Control" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-2xl md:text-[28px] font-bold text-white tracking-wide mb-4 text-center" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>Voice Control</h3>
                                <p className="text-[#b3c9c6] text-[15px] md:text-[16px] leading-relaxed text-justify px-2 md:px-4" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                                    Control your app, call, or music using your voice at just what you need, keeping your hands on the wheel and your focus on the road.
                                </p>
                            </div>

                            {/* Feature 3: Wireless Features */}
                            <div className="flex flex-col items-center">
                                <div className="w-full aspect-[16/10] md:aspect-[4/3] relative rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-lg">
                                    <img src="/androidplayer/5. SS,VC,WF 3张图/link-04.webp" alt="Wireless Features" className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-2xl md:text-[28px] font-bold text-white tracking-wide mb-4 text-center" style={{ fontFamily: 'Gotham-Medium, Gotham, sans-serif' }}>Wireless Features</h3>
                                <p className="text-[#b3c9c6] text-[15px] md:text-[16px] leading-relaxed text-justify px-2 md:px-4" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                                    Enjoy wireless Apple CarPlay / Android Auto, Bluetooth music, and wireless updates without messy cables. A cleaner, safer driving experience with fewer distractions.
                                </p>
                            </div>

                        </div>

                        {/* Bottom Italic Tagline */}
                        <p className="text-[#b3c9c6] italic text-sm md:text-[17px] mt-16 text-center font-light tracking-widest drop-shadow-md" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                            A smoother, smarter driving experience with less distraction.
                        </p>

                    </div>
                </div>

                {/* 第五部分：导航功能展示 (背景实拍图) */}
                <div className="relative w-full bg-[#021a18] overflow-hidden">

                    {/* Background Image */}
                    <img
                        src={isDesktop ? "/androidplayer/pc/Android player PC 2-05.webp" : "/androidplayer/phone/Android player Phone-05.webp"}
                        alt="Supports Navigation"
                        className="w-full h-auto block"
                    />

                    {/* Content Overlaid */}
                    <div className="hidden md:block absolute inset-0 w-full h-full z-10">
                        {/* Top Title */}
                        <div className="absolute top-[6%] lg:top-[8%] w-full px-6 flex justify-center">
                            <h2 className="text-[3.5vw] md:text-[2.2vw] font-bold text-white uppercase text-center tracking-widest drop-shadow-2xl" style={{ fontFamily: 'Geometos, sans-serif' }}>
                                SUPPORTS NAVIGATION (ALWAYS UP TO DATE)
                            </h2>
                        </div>

                        {/* Bottom Subtitle */}
                        <div className="absolute bottom-[4%] lg:bottom-[6%] w-full px-6 flex justify-center">
                            <p className="text-gray-200 italic text-[2vw] md:text-[0.9vw] text-center tracking-widest font-light drop-shadow-md" style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif' }}>
                                Use Google Maps or Waze with live traffic updates — no paid map updates like OEM units.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 第六部分：车载娱乐升级 (背景实拍图) */}
                <div className="relative w-full bg-[#04423a] overflow-hidden">

                    {/* Background Image */}
                    <img
                        src={isDesktop ? "/androidplayer/pc/Android player PC 2-06.webp" : "/androidplayer/phone/Android player Phone-06.webp"}
                        alt="Upgraded In-Car Entertainment"
                        className="w-full h-auto block"
                    />

                    <div className="hidden md:flex absolute inset-0 flex-col justify-center items-start pl-[52%] lg:pl-[55%] pr-[5%] lg:pr-[8%] w-full">
                        <h2
                            className="font-bold text-white tracking-wide mb-2 lg:mb-4 whitespace-nowrap"
                            style={{ fontFamily: 'Geometos, sans-serif', fontSize: '2.8vw', lineHeight: '1.2' }}
                        >
                            UPGRADED IN-CAR<br />ENTERTAINMENT
                        </h2>
                        <p
                            className="text-gray-200 text-justify w-full"
                            style={{ fontFamily: 'Gotham-Book, Gotham, sans-serif', fontSize: '1.15vw', lineHeight: '1.6' }}
                        >
                            Perfect for families, long-distance drivers, Grab drivers, or anyone who wants an enjoyable cabin experience.
                        </p>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <h2 className="text-white text-3xl md:text-5xl font-bold text-center mb-12 tracking-wider" style={{ fontFamily: 'Geometos, sans-serif' }}>
                        CHOOSE YOUR SERIES
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                        {(isDesktop ? pcImages.slice(6) : phoneImages.slice(6)).map((src, index) => {
                            // 定义每个图片对应的系列 hash 和名称
                            const seriesData = [
                                { hash: 'TRONMMEXT_EI_series', name: 'EI SERIES' },
                                { hash: 'Advance_series', name: 'ADVANCE SERIES' },
                                { hash: 'Cyber_series', name: 'CYBER SERIES' },
                                { hash: 'Performance_series', name: 'PERFORMANCE SERIES' },
                                { hash: 'Luxury_series', name: 'LUXURY SERIES' },
                                { hash: 'Diamond_series', name: 'DIAMOND SERIES' },
                                { hash: 'Signature_40', name: '40 Series' },
                                { hash: 'Ultra_series', name: 'ULTRA SERIES' },
                                { hash: 'Lyno', name: 'LYNO', href: '/lyno' },
                                { hash: 'Android_Screen', name: 'ANDROID SCREEN', href: '/products/androidplayer?filter1=contiAndroid' }
                            ];

                            return (
                                <div key={`series-${index}`} className="flex flex-col">
                                    <Link
                                        href={seriesData[index].href || `/products/androidplayer#${seriesData[index].hash}`}
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

                {/* Schema.org Service / Product JSON-LD */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Product",
                            "name": "DRAGX Android Player - Smart Car Infotainment System",
                            "image": "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/lz4oh3mzwlmq7aiquwmf_f5e6ze.webp",
                            "description": "Premium car Android player upgrade in Malaysia. Features Wireless CarPlay, Android Auto, HD display, Split Screen, and live GPS navigation with plug-and-play OEM integration.",
                            "brand": {
                                "@type": "Brand",
                                "name": "DRAGX"
                            },
                            "category": "Car Electronics & Infotainment",
                            "offers": {
                                "@type": "AggregateOffer",
                                "priceCurrency": "MYR",
                                "lowPrice": "599",
                                "highPrice": "2999",
                                "offerCount": "10",
                                "availability": "https://schema.org/InStock",
                                "seller": {
                                    "@type": "Organization",
                                    "name": "DRAGX"
                                }
                            }
                        })
                    }}
                />
            </div>
        </>
    )
}
