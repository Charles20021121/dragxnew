export async function generateMetadata({ params }) {
  const category = params.category;
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

  return {
    title: `${categoryTitles[category] || category.toUpperCase()} - DRAGX Car Accessories`,
    description: `Explore our range of ${categoryTitles[category] || category} for your vehicle. Quality automotive solutions from DRAGX.`,
    keywords: `${category}, car accessories, automotive, DRAGX, Malaysia`,
    openGraph: {
      title: `${categoryTitles[category] || category.toUpperCase()} - DRAGX Car Accessories`,
      description: `Explore our range of ${categoryTitles[category] || category} for your vehicle`,
      images: ['https://res.cloudinary.com/dmkxx68km/image/upload/v1725611928/ukzmrw5nzcsovbnb31nd.webp'],
    }
  };
}

export default function CategoryLayout({ children }) {
  return children;
} 