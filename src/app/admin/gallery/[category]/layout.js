export async function generateMetadata({ params }) {
  const category = params.category;
  const categoryTitles = {
    alphard: 'Alphard',
    vellfire: 'Vellfire',
    bmw: 'BMW',
    mercedes: 'Mercedes-Benz',
    audi: 'Audi',
    honda: 'Honda',
    toyota: 'Toyota'
  };

  return {
    title: `${categoryTitles[category] || category.toUpperCase()} Gallery - DRAGX`,
    description: `View our ${categoryTitles[category] || category} installations and customizations. Professional car accessories and modifications by DRAGX.`,
    keywords: `${category} modifications, car accessories, installations, DRAGX, Malaysia`,
    openGraph: {
      title: `${categoryTitles[category] || category.toUpperCase()} Gallery - DRAGX`,
      description: `${categoryTitles[category] || category} installations and customizations`,
      images: ['https://res.cloudinary.com/dmkxx68km/image/upload/v1729680828/lyeylq4n5vfrh5n39izv.webp'],
    }
  };
}

export default function CategoryLayout({ children }) {
  return children;
} 