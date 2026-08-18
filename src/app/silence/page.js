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
        {/* Banner 1 */}
        <img src="/silence/New folder/DX Silence PC 2-02.webp" alt="Silence Intro 1" className="w-full h-auto hidden md:block" />
        <img src="/silence/Phone/car audio.webp" alt="Silence Intro 1 Mobile" className="w-full h-auto block md:hidden" />
        
        {/* Banner 2 */}
        <img src="/silence/New folder/DX Silence PC 2-03.webp" alt="Silence Intro 2" className="w-full h-auto hidden md:block" />
        <img src="/silence/Phone/premium.webp" alt="Silence Intro 2 Mobile" className="w-full h-auto block md:hidden" />

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