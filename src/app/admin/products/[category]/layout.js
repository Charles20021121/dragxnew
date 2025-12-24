export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams?.category || 'products';
  const categoryTitles = {
    androidplayer: 'Android Players',
    ambientlight: 'Ambient Lights',
    '360camera': '360 Cameras',
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
      images: ['https://res.cloudinary.com/dmkxx68km/image/upload/v1725611928/ukzmrw5nzcsovbnb31nd.webp'],
    }
  };
}

export default function CategoryLayout({ children }) {
  return children;
} 