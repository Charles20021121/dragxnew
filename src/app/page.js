import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServiceSection";
import ProductSection from "@/components/ProductSection";
import SpecialistSection from "@/components/SpecialistSection";
import FeaturesSection from "@/components/FeaturesSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection 
        images={[
          "https://res.cloudinary.com/dmkxx68km/image/upload/v1725450335/epz5butosofn5h6jxvqu.webp",
          "另一張圖片的URL",
          "第三張圖片的URL"
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
