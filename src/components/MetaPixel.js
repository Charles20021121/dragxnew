"use client"
import Script from 'next/script'
import { useEffect } from 'react'

// 導出 PIXEL_IDS 以便其他組件使用
export const PIXEL_IDS = [
  '1662602107695733',  // 主要的 Pixel ID
  '1666484577598642',  // Shah Alam
  '594186783300848',   // Balakong
  '203756357966091',   // Dragx FB
  '228164665176426',   // Batu Caves
  '691140855660408',   // Maluri Cheras
  '467298533088129',   // Equine Park
  '899361347431896',   // Alphard/Vellfire
  '624554890067410',   // Additional ID 1
  '567640479579529'    // Additional ID 2
];

export default function MetaPixel() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // 檢測是否被廣告攔截器阻擋
        if (window.fbq) {
          PIXEL_IDS.forEach(id => {
            window.fbq('init', id);
            console.log('Meta Pixel initialized successfully:', id);
          });
          window.fbq('track', 'PageView');
        } else {
          console.error('Facebook Pixel is blocked. Please disable ad blocker');
        }
      } catch (error) {
        console.error('Meta Pixel initialization error:', error);
      }
    }
  }, []);

  // 生成所有 Pixel 的 noscript 標籤
  const generateNoScriptTags = () => {
    return PIXEL_IDS.map(id => (
      <noscript key={id}>
        <img 
          height="1" 
          width="1" 
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    ));
  };

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          `,
        }}
      />
      {generateNoScriptTags()}
    </>
  );
} 