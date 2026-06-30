import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServiceSection";
import ProductSection from "@/components/ProductSection";
import ProductShowcaseSection from "@/components/ProductShowcaseSection";
import FeaturesSection from "@/components/FeaturesSection";
import SpecialistImages from "@/components/SpecialistImages";
import pool from '@/lib/db';

export const revalidate = 3600;

// 添加 metadata
export const metadata = {
  title: 'DRAGX - Malaysia\'s #1 Car Accessories & Automotive Solutions',
  description: 'Malaysia\'s leading car accessories and automotive solutions provider. Specializing in Android players, ambient lights, power boots, and more. Experience the best in automotive upgrades.',
  keywords: 'No.1 car accessories Malaysia, best android player, premium ambient light, power boot, automotive solutions, DRAGX Malaysia, leading brand',
  alternates: {
    canonical: 'https://www.dragx.asia',
  },
  openGraph: {
    title: 'DRAGX - Malaysia\'s #1 Car Accessories & Automotive Solutions',
    description: 'Malaysia\'s leading car accessories and automotive solutions provider',
    images: ['https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/epz5butosofn5h6jxvqu.webp'],
  }
};

export default async function Home() {
  let products = [];
  try {
    const connection = await pool.getConnection();
    try {
      // Same logic as /api/products?list=true
      const [rows] = await connection.execute(`
        SELECT Id, Name, categories, Url, date, same, filter1, android_series, sort_order
        FROM products
        WHERE same IS NOT NULL AND same != '' AND Id = same
        ORDER BY sort_order DESC, date DESC
      `);
      products = rows;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching showcase products:', error);
  }

  // Ensure plain objects and generate slug
  const safeProducts = products.map(p => ({
    id: p.Id,
    name: p.Name,
    categories: p.categories,
    image: p.Url,
    date: p.date,
    sort_order: p.sort_order,
    same: p.same,
    filter1: p.filter1,
    android_series: p.android_series,
    slug: (p.Name || p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }));

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection
        images={[
          "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/epz5butosofn5h6jxvqu.webp",
          "/home/lynobanner.webp",
          "/home/gallerybanner.webp",

          "/home/specialist/bmw.webp",
          "/home/specialist/alphardvellfire.webp",
          "/home/specialist/mercedes.webp"
        ]}
        aspectRatio="3333/1458"
      />
      <ServiceSection />
      <ProductSection />
      <ProductShowcaseSection initialProducts={safeProducts} />
      <SpecialistImages />
      <FeaturesSection />
    </main>
  );
}
