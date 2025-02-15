import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServiceSection";
import ProductSection from "@/components/ProductSection";
import SpecialistSection from "@/components/SpecialistSection";
import FeaturesSection from "@/components/FeaturesSection";

// 添加 metadata
export const metadata = {
  title: 'DRAGX - Car Accessories & Automotive Solutions',
  description: 'Professional car accessories and automotive solutions provider in Malaysia. Specializing in Android players, ambient lights, power boots, and more.',
  keywords: 'car accessories, android player, ambient light, power boot, automotive, Malaysia',
  openGraph: {
    title: 'DRAGX - Car Accessories & Automotive Solutions',
    description: 'Professional car accessories and automotive solutions provider in Malaysia',
    images: ['https://res.cloudinary.com/dmkxx68km/image/upload/v1725450335/epz5butosofn5h6jxvqu.webp'],
  }
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection 
        image="https://res.cloudinary.com/dmkxx68km/image/upload/v1725450335/epz5butosofn5h6jxvqu.webp"
        aspectRatio="3333/1458"
        
      />
      <ServiceSection />
      <ProductSection />
      <SpecialistSection />
      <FeaturesSection />
      </main>
  );
}
