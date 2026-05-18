import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServiceSection";
import ProductSection from "@/components/ProductSection";
import FeaturesSection from "@/components/FeaturesSection";
import SpecialistImages from "@/components/SpecialistImages";

// 添加 metadata
export const metadata = {
  title: 'DRAGX - Malaysia\'s #1 Car Accessories & Automotive Solutions',
  description: 'Malaysia\'s leading car accessories and automotive solutions provider. Specializing in Android players, ambient lights, power boots, and more. Experience the best in automotive upgrades.',
  keywords: 'No.1 car accessories Malaysia, best android player, premium ambient light, power boot, automotive solutions, DRAGX Malaysia, leading brand',
  openGraph: {
    title: 'DRAGX - Malaysia\'s #1 Car Accessories & Automotive Solutions',
    description: 'Malaysia\'s leading car accessories and automotive solutions provider',
    images: ['https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/epz5butosofn5h6jxvqu.webp'],
  }
};

export default function Home() {
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
      <SpecialistImages />
      <FeaturesSection />
    </main>
  );
}
