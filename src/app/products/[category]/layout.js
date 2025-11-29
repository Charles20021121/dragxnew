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
    soundproof: 'https://res.cloudinary.com/dmkxx68km/image/upload/v1739512778/i3nqmuukuo4nvq5puo6u.jpg',
    androidplayer: 'https://res.cloudinary.com/dmkxx68km/image/upload/c_limit,w_1920/f_auto/q_auto/v1720977941/lz4oh3mzwlmq7aiquwmf_f5e6ze?_a=BAVFB+DW0',
    ambientlight: 'https://res.cloudinary.com/dmkxx68km/image/upload/c_limit,w_1920/f_auto/q_auto/v1720977943/m75j3e1uy8kqdc0iiyzy_dnk0kb?_a=BAVFB+DW0',
    contidecoder: 'https://res.cloudinary.com/dmkxx68km/image/upload/c_limit,w_1920/f_auto/q_auto/v1729013791/gcpdyz9k7cs9pgdcggen?_a=BAVFB+DW0',
    '360camera': 'https://res.cloudinary.com/dmkxx68km/image/upload/v1720977940/damwcrijnzpulm62k7ce_b31nnw.jpg',
    powerboot: 'https://res.cloudinary.com/dmkxx68km/image/upload/c_limit,w_1920/f_auto/q_auto/v1720977940/hhtep5dkd3wdixyn8fsv_rdiujs?_a=BAVFB+DW0',
    alphardvellfire: 'https://dragx.asia/alphardvellfire/alphardvellfire.jpg',
    bmw: 'https://dragx.asia/bmw/BMW FA.jpg',
    mercedes: 'https://dragx.asia/mercedes/categories-08.jpg',
  };

  const defaultImage = 'https://res.cloudinary.com/dmkxx68km/image/upload/v1725611928/ukzmrw5nzcsovbnb31nd.webp';

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