export const metadata = {
  title: 'DX360 - 360° Vision & Safety System',
  description: 'DX360 - All is Perfectly Clear to Your Vision. Complete 360° surrounding view camera system with advanced safety features.',
  keywords: '360 camera, car camera, parking camera, 360 view, DRAGX, Malaysia',
  openGraph: {
    title: 'DX360 - 360° Vision & Safety System',
    description: 'All is Perfectly Clear to Your Vision',
    images: [{
      url: 'https://dragx.asia/dx360/logo/dx360.jpg',
      width: 1200,
      height: 630,
      alt: 'DX360 - 360° Camera System',
    }],
  }
}

export default function DX360Layout({ children }) {
  return <>{children}</>
}
