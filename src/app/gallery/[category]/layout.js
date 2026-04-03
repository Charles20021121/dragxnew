export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const category = resolvedParams?.category || 'gallery';
  const categoryTitles = {
    alphard: 'Alphard',
    vellfire: 'Vellfire',
    bmw: 'BMW',
    mercedes: 'Mercedes-Benz',
    audi: 'Audi',
    honda: 'Honda',
    toyota: 'Toyota'
  };

  const categoryName = categoryTitles[category] || category.toUpperCase();

  return {
    title: `${categoryName} Gallery - DRAGX`,
    description: `View our ${categoryTitles[category] || category} installations and customizations. Professional car accessories and modifications by DRAGX.`,
    keywords: `${category} modifications, car accessories, installations, DRAGX, Malaysia`,
    openGraph: {
      title: `${categoryName} Gallery - DRAGX`,
      description: `${categoryTitles[category] || category} installations and customizations`,
      images: ['https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/lyeylq4n5vfrh5n39izv.webp'],
    }
  };
}

export default function CategoryLayout({ children }) {
  return children;
} 