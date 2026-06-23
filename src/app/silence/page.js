import HeroSection from "@/components/HeroSection"
import pool from '@/lib/db'
import SilenceClientWrapper from '@/components/SilenceClientWrapper'

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

      <HeroSection
        image="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/t2nairvmqzh3465yf0ry.webp"
        mobileImage="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/joo4pf3evml9vtfs6ads.webp"
        aspectRatio="3334/1277"
        mobileAspectRatio="3334/2479"
      />
      <HeroSection
        image="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/l9vs63elicroo5p9eocz.webp"
        mobileImage="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/teuxfnrwq7awfns0lsob.webp"
        aspectRatio="3334/1277"
        mobileAspectRatio="3334/1680"
      />
      <HeroSection
        image="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/uav09ng6ndhuv84w7aoa.webp"
        mobileImage="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/g5uclbikf5kzfzhnhdde.webp"
        aspectRatio="3334/1277"
        mobileAspectRatio="3334/2154"
      />
      <HeroSection
        image="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/to2qmvww2hjs1aeualfc.webp"
        mobileImage="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/tgxoqvacn6rmdm95phit.webp"
        aspectRatio="3334/1541"
        mobileAspectRatio="3334/2154"
      />
      <HeroSection
        image="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/r0yi1kfx04qf8ji279pz.webp"
        mobileImage="https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/rbb6tvepk4zqpf48b7tk.webp"
        aspectRatio="3334/877"
        mobileAspectRatio="3334/1154"
      />

    </main>
  )
}