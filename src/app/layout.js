import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import "./lyno/fonts.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MetaPixel from "@/components/MetaPixel";
import { ProductProvider } from "@/contexts/ProductContext";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

// 根據環境自動選擇 base URL
const getBaseUrl = () => {
  // 如果有設置 NEXT_PUBLIC_BASE_URL 環境變量（用於 ngrok 測試）
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  // 生產環境
  return 'https://www.dragx.asia';
};

export const metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "DRAGX",
  description: "Car Accessories",
};

// 添加 Cloudinary 配置到 metadata
export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  uploadPreset: "newdragx"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GKHQ6L6YMD"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GKHQ6L6YMD');
          `
        }} />
        {/* JSON-LD for WebSite, Organization, and LocalBusiness */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://www.dragx.asia/#website",
                  "url": "https://www.dragx.asia/",
                  "name": "DRAGX",
                  "description": "Malaysia's #1 Car Accessories & Automotive Solutions",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.dragx.asia/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://www.dragx.asia/#organization",
                  "name": "DRAGX",
                  "url": "https://www.dragx.asia/",
                  "logo": "https://www.dragx.asia/logo.png",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+60192776056",
                    "contactType": "customer service",
                    "areaServed": "MY",
                    "availableLanguage": ["English", "Malay", "Chinese"]
                  },
                  "sameAs": [
                    "https://www.facebook.com/dragx.asia",
                    "https://www.instagram.com/dragx.asia"
                  ]
                },
                {
                  "@type": "AutoPartsStore",
                  "@id": "https://www.dragx.asia/#store",
                  "name": "DRAGX - Malaysia's #1 Car Accessories",
                  "url": "https://www.dragx.asia/",
                  "telephone": "+60192776056",
                  "logo": "https://www.dragx.asia/logo.png",
                  "image": "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/epz5butosofn5h6jxvqu.webp",
                  "description": "Malaysia's leading car accessories and automotive solutions provider. Specializing in Android players, ambient lights, power boots, 360 cameras, and soundproofing.",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "28, Jalan Jejaka 9, Maluri",
                    "addressLocality": "Cheras",
                    "addressRegion": "Kuala Lumpur",
                    "postalCode": "55100",
                    "addressCountry": "MY"
                  },
                  "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 3.1278,
                    "longitude": 101.7289
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                      "opens": "10:00",
                      "closes": "19:00"
                    }
                  ],
                  "areaServed": {
                    "@type": "Country",
                    "name": "Malaysia"
                  },
                  "priceRange": "$$",
                  "sameAs": [
                    "https://www.facebook.com/dragx.asia",
                    "https://www.instagram.com/dragx.asia"
                  ]
                }
              ]
            })
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ProductProvider>
          <MetaPixel />
          <Navbar />
          <main>
            {children}
          </main>
          <WhatsAppButton />
          <Footer />
        </ProductProvider>
      </body>
    </html>
  );
}
