import HeroSection from "@/components/HeroSection"
import pool from '@/lib/db'
import SilenceClientWrapper from '@/components/SilenceClientWrapper'
import SilenceLuxurySection from '@/components/SilenceLuxurySection'
import SilenceProtectionSection from '@/components/SilenceProtectionSection'
import SilenceNVHSection from '@/components/SilenceNVHSection'
import SilenceReductionMethodsSection from '@/components/SilenceReductionMethodsSection'
import SilenceFeaturesGridSection from '@/components/SilenceFeaturesGridSection'
import SilencePricingSection from '@/components/SilencePricingSection'

export const revalidate = 3600;

export default async function SilencePage() {
  let products = [];
  let silencePrices = [];

  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(`
        SELECT *
        FROM products
        WHERE categories = 'soundproof'
      `);
      products = rows;
      
      const [priceRows] = await connection.execute(`
        SELECT * FROM silence_prices
      `);
      silencePrices = priceRows;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching silence products/prices:', error);
  }

  // 將產品按車型分類排序
  const sortSilenceByCarType = (a, b) => {
    const filterA = (a.filter1 || '').toLowerCase();
    const filterB = (b.filter1 || '').toLowerCase();
    
    const getRank = (type) => {
      if (type === 'hatchback') return 1;
      if (type === 'sedan') return 2;
      if (type === 'suv') return 3;
      if (type === 'mpv') return 4;
      return 5;
    };
    
    return getRank(filterA) - getRank(filterB);
  };

  const safeProducts = products.map(p => ({...p}));

  // 將產品按舒適度分類
  const categorizedProducts = {
    'COMFORT': safeProducts.filter(p => {
      const name = (p.name || p.Name || '').toLowerCase();
      return name.includes('comfort') && !name.includes('max');
    }).sort(sortSilenceByCarType),
    
    'COMFORT MAX': safeProducts.filter(p => {
      const name = (p.name || p.Name || '').toLowerCase();
      return name.includes('comfort max');
    }).sort(sortSilenceByCarType),
    
    'ACOUSTIC PROMAX': safeProducts.filter(p => {
      const name = (p.name || p.Name || '').toLowerCase();
      return name.includes('acoustic promax') || name.includes('promax');
    }).sort(sortSilenceByCarType)
  };

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
      </div>

      <div className="bg-black bg-no-repeat bg-cover bg-center w-full" style={{
        backgroundImage: `url('https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/q45ew1xcvjtd43klbcql.webp')`
      }}>
        <SilencePricingSection silencePrices={silencePrices} />
        <SilenceClientWrapper categorizedProducts={categorizedProducts} silencePrices={silencePrices} />
      </div>

      <SilenceReductionMethodsSection />

      <SilenceLuxurySection />
      
      <SilenceProtectionSection />
      
      <SilenceNVHSection />
      
      <SilenceFeaturesGridSection />

    </main>
  )
}