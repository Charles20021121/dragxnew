export const metadata = {
  title: "LYNO - Premium Android Car Player",
  description: "LYNO - The Ultimate Android Car Player. Experience premium automotive technology with advanced features and stunning display.",
  keywords: 'LYNO, android player, car player, android screen, DRAGX, Malaysia',
  alternates: {
    canonical: 'https://www.dragx.asia/lyno',
  },
  openGraph: {
    title: "LYNO - Premium Android Car Player",
    description: "The Ultimate Android Car Player",
    images: [{
      url: 'https://www.dragx.asia/home/lynobanner.webp',
      width: 3333,
      height: 1458,
      alt: 'LYNO - Premium Android Car Player',
    }],
  }
}

export default function LynoLayout({ children }) {
  return <>{children}</>
}
