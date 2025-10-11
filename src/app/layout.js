import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import "./lyno/fonts.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MetaPixel from "@/components/MetaPixel";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"] });

export const metadata = {
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
        <MetaPixel />
        <Navbar />
        <main>
          {children}
        </main>
        <WhatsAppButton />
        <Footer />
      </body>
    </html>
  );
}
