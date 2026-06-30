export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  
  const categoryTitles = {
    androidplayer: 'Android Players',
    ambientlight: 'Ambient Lights',
    '360camera': 'DX360',
    powerboot: 'Power Boots',
    contidecoder: 'Conti Decoders',
    soundproof: 'Soundproof',
    alphardvellfire: 'Alphard/Vellfire',
    mercedes: 'Mercedes-Benz',
    bmw: 'BMW',
  };

  // 对应首页 ProductSection 的图片
  const categoryImages = {
    soundproof: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/i3nqmuukuo4nvq5puo6u.webp',
    androidplayer: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/lz4oh3mzwlmq7aiquwmf_f5e6ze.webp',
    ambientlight: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/m75j3e1uy8kqdc0iiyzy_dnk0kb.webp',
    contidecoder: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/gcpdyz9k7cs9pgdcggen.webp',
    powerboot: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/hhtep5dkd3wdixyn8fsv_rdiujs.webp',
    bmw: 'https://www.dragx.asia/bmw/BMW FA.jpg',
    mercedes: 'https://www.dragx.asia/mercedes/categories-08.jpg',
  };

  const defaultImage = 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ukzmrw5nzcsovbnb31nd.webp';

  const categoryImage = categoryImages[category] || defaultImage;

  return {
    title: `${categoryTitles[category] || category.toUpperCase()} - DRAGX Car Accessories`,
    description: `Explore our range of ${categoryTitles[category] || category} for your vehicle. Quality automotive solutions from DRAGX.`,
    keywords: `${category}, car accessories, automotive, DRAGX, Malaysia`,
    alternates: {
      canonical: `https://www.dragx.asia/products/${category}`,
    },
    openGraph: {
      title: `${categoryTitles[category] || category.toUpperCase()} - DRAGX Car Accessories`,
      description: `Explore our range of ${categoryTitles[category] || category} for your vehicle`,
      images: [{
        url: categoryImage,
        width: 1200,
        height: 630,
        alt: `${categoryTitles[category] || category} - DRAGX`,
      }],
    }
  };
}

export default function CategoryLayout({ children }) {
  return children;
} 