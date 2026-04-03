export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams.category;
  
  const categoryTitles = {
    androidplayer: 'Android Players',
    ambientlight: 'Ambient Lights',
    '360camera': '360 Cameras',
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
    androidplayer: 'https://res.cloudinary.com/dmkxx68km/image/upload/c_limit,w_1920/f_auto/q_auto/v1720977941/lz4oh3mzwlmq7aiquwmf_f5e6ze?_a=BAVFB+DW0',
    ambientlight: 'https://res.cloudinary.com/dmkxx68km/image/upload/c_limit,w_1920/f_auto/q_auto/v1720977943/m75j3e1uy8kqdc0iiyzy_dnk0kb?_a=BAVFB+DW0',
    contidecoder: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx//res.cloudinary.com/dmkxx68km/image/upload/v1720977940/damwcrijnzpulm62k7ce_b31nnw.webp',
    powerboot: 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx//dragx.asia/alphardvellfire/alphardvellfire.webp',
    bmw: 'https://dragx.asia/bmw/BMW FA.jpg',
    mercedes: 'https://dragx.asia/mercedes/categories-08.jpg',
  };

  const defaultImage = 'https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ukzmrw5nzcsovbnb31nd.webp';

  const categoryImage = categoryImages[category] || defaultImage;

  return {
    title: `${categoryTitles[category] || category.toUpperCase()} - DRAGX Car Accessories`,
    description: `Explore our range of ${categoryTitles[category] || category} for your vehicle. Quality automotive solutions from DRAGX.`,
    keywords: `${category}, car accessories, automotive, DRAGX, Malaysia`,
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