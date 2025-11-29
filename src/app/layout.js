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
  return 'https://dragx.asia';
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
      </head>
      <body className={inter.className}>
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
