export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams?.category || 'products';
  const categoryTitles = {
    androidplayer: 'Android Players',
    ambientlight: 'Ambient Lights',
    '360camera': 'DX360',
    powerboot: 'Power Boots',
    contidecoder: 'Conti Decoders',
    alphardvellfire: 'ALPHARD/VELLFIRE',
    mercedes: 'MERCEDES-BENZ',
    bmw: 'BMW',


  };

  const categoryName = categoryTitles[category] || category.toUpperCase();

  return {
    title: `${categoryName} - DRAGX Car Accessories`,
    description: `Explore our range of ${categoryTitles[category] || category} for your vehicle. Quality automotive solutions from DRAGX.`,
    keywords: `${category}, car accessories, automotive, DRAGX, Malaysia`,
    openGraph: {
      title: `${categoryName} - DRAGX Car Accessories`,
      description: `Explore our range of ${categoryTitles[category] || category} for your vehicle`,
      images: ['https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/ukzmrw5nzcsovbnb31nd.webp'],
    }
  };
}

export default function CategoryLayout({ children }) {
  return children;
} 