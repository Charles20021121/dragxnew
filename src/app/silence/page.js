import Link from 'next/link'
import HeroSection from "@/components/HeroSection"
import SilenceLuxurySection from '@/components/SilenceLuxurySection'
import SilenceProtectionSection from '@/components/SilenceProtectionSection'
import SilenceNVHSection from '@/components/SilenceNVHSection'
import SilenceReductionMethodsSection from '@/components/SilenceReductionMethodsSection'
import SilenceFeaturesGridSection from '@/components/SilenceFeaturesGridSection'

export const revalidate = 3600;

export default function SilencePage() {
  return (
    <main>
      <HeroSection
        image="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/vezb74clm89wdwzadtud.webp"
        aspectRatio="3334/1042"
      />
      
      {/* New Banners under Hero */}
      <div className="w-full flex flex-col bg-black">
        {/* Banner 1: Premium Soundproofing */}
        <img src="/silence/New folder/DX Silence PC 2-02.webp" alt="Silence Intro 1" className="w-full h-auto hidden md:block" />
        <img src="/silence/Phone/premium.webp" alt="Silence Intro 1 Mobile" className="w-full h-auto block md:hidden" />
        
        {/* Banner 2: Car Audio Enhancement */}
        <div className="relative w-full hidden md:block">
          <img src="/silence/New folder/DX Silence PC 2-03.webp" alt="Silence Intro 2" className="w-full h-auto" />
          <div className="absolute top-[52%] right-[4%] w-[38%] flex justify-center z-10">
            <Link
              href="/products/silence"
              className="inline-flex items-center justify-center gap-2 font-bold tracking-wider uppercase transition-all duration-300 rounded-full border border-[#8ce0e7]/60 text-black bg-[#8ce0e7] hover:bg-[#a6edf3] hover:shadow-[0_0_25px_rgba(140,224,231,0.6)] hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                fontFamily: 'Geometos, sans-serif',
                padding: '0.65vw 1.8vw',
                fontSize: '1vw',
              }}
            >
              <span>Learn More</span>
              <svg className="w-[1vw] h-[1vw]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
        <div className="relative w-full block md:hidden">
          <img src="/silence/Phone/car audio.webp" alt="Silence Intro 2 Mobile" className="w-full h-auto" />
          <div className="absolute top-[62%] right-[4%] w-[48%] flex justify-center z-10">
            <Link
              href="/products/silence"
              className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3.5 rounded-full bg-[#8ce0e7] hover:bg-[#a6edf3] text-black font-bold text-[10px] tracking-wider uppercase shadow-[0_0_15px_rgba(140,224,231,0.5)] active:scale-95 transition-all duration-200"
              style={{ fontFamily: 'Geometos, sans-serif' }}
            >
              <span>Learn More</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Banner 3: Why Upgrade Your Car Audio? */}
        <img src="/silence/New%20folder%20(2)/DX%20Silence%20PAGE%20FA%203-04.webp" alt="Why Upgrade Your Car Audio" className="w-full h-auto hidden md:block" />
        <img src="/silence/New%20folder%20(2)/PHONE%20SIZE-14.webp" alt="Why Upgrade Your Car Audio Mobile" className="w-full h-auto block md:hidden" />

        {/* Banner 4: Audio Work Scope */}
        <img src="/silence/New%20folder%20(2)/DX%20Silence%20PAGE%20FA%203-05.webp" alt="Audio Work Scope" className="w-full h-auto hidden md:block" />
        <img src="/silence/New%20folder%20(2)/PHONE%20SIZE-15.webp" alt="Audio Work Scope Mobile" className="w-full h-auto block md:hidden" />
      </div>

      <SilenceReductionMethodsSection />

      <SilenceLuxurySection />
      
      <SilenceProtectionSection />
      
      <SilenceNVHSection />
      
      <SilenceFeaturesGridSection />

      {/* Schema.org Service JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "DX Silence - Automotive Noise Cancellation & Car Soundproofing",
            "provider": {
              "@type": "Organization",
              "name": "DRAGX"
            },
            "serviceType": "Car Soundproofing & Acoustic Insulation",
            "description": "Professional car soundproofing and NVH noise reduction services in Malaysia. Up to 90% noise cancellation with Lifetime Warranty.",
            "areaServed": {
              "@type": "Country",
              "name": "Malaysia"
            }
          })
        }}
      />
    </main>
  )
}