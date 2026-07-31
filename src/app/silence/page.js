import HeroSection from "@/components/HeroSection"
import pool from '@/lib/db'
import SilenceClientWrapper from '@/components/SilenceClientWrapper'
import SilenceLuxurySection from '@/components/SilenceLuxurySection'
import SilenceProtectionSection from '@/components/SilenceProtectionSection'
import SilenceNVHSection from '@/components/SilenceNVHSection'
import SilenceReductionMethodsSection from '@/components/SilenceReductionMethodsSection'
import SilenceFeaturesGridSection from '@/components/SilenceFeaturesGridSection'

export const revalidate = 3600;

export default async function SilencePage() {
  let products = [];

  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(`
        SELECT *
        FROM products
        WHERE categories = 'soundproof'
      `);
      products = rows;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching silence products:', error);
  }

  // 將產品按 filter1 分類
  const sortSilenceProducts = (a, b) => {
    const nameA = (a.name || a.Name || '').toLowerCase();
    const nameB = (b.name || b.Name || '').toLowerCase();
    
    const getRank = (name) => {
      if (name.includes('comfort max')) return 2;
      if (name.includes('comfort')) return 1;
      return 3;
    };
    
    return getRank(nameA) - getRank(nameB);
  };

  const safeProducts = products.map(p => ({...p}));

  const categorizedProducts = {
    HATCHBACK: safeProducts.filter(p => p.filter1?.toLowerCase() === 'hatchback').sort(sortSilenceProducts),
    SEDAN: safeProducts.filter(p => p.filter1?.toLowerCase() === 'sedan').sort(sortSilenceProducts),
    SUV: safeProducts.filter(p => p.filter1?.toLowerCase() === 'suv').sort(sortSilenceProducts),
    MPV: safeProducts.filter(p => p.filter1?.toLowerCase() === 'mpv').sort(sortSilenceProducts)
  }

  return (
    <main>
      <HeroSection
        image="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/vezb74clm89wdwzadtud.webp"
        aspectRatio="3334/1042"
      />
      
      <SilenceClientWrapper categorizedProducts={categorizedProducts} />

      <SilenceLuxurySection />
      
      <SilenceProtectionSection />
      
      <SilenceNVHSection />
      
      <SilenceReductionMethodsSection />
      
      <SilenceFeaturesGridSection />

    </main>
  )
}