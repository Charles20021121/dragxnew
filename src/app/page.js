import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServiceSection";
import ProductSection from "@/components/ProductSection";
import SpecialistSection from "@/components/SpecialistSection";
import FeaturesSection from "@/components/FeaturesSection";

// 添加 metadata
export const metadata = {
  title: 'DRAGX - Malaysia\'s #1 Car Accessories & Automotive Solutions',
  description: 'Malaysia\'s leading car accessories and automotive solutions provider. Specializing in Android players, ambient lights, power boots, and more. Experience the best in automotive upgrades.',
  keywords: 'No.1 car accessories Malaysia, best android player, premium ambient light, power boot, automotive solutions, DRAGX Malaysia, leading brand',
  openGraph: {
    title: 'DRAGX - Malaysia\'s #1 Car Accessories & Automotive Solutions',
    description: 'Malaysia\'s leading car accessories and automotive solutions provider',
    images: ['https://res.cloudinary.com/dmkxx68km/image/upload/v1725450335/epz5butosofn5h6jxvqu.webp'],
  }
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection 
        images={[
          "/home/lynobanner.webp",
          "https://res.cloudinary.com/dmkxx68km/image/upload/v1725450335/epz5butosofn5h6jxvqu.webp"
          
        ]}
        aspectRatio="3333/1458"
        
      />
      <ServiceSection />
      <ProductSection />
      <SpecialistSection />
      <FeaturesSection />
      </main>
  );
}
