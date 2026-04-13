"use client"
import { useParams } from 'next/navigation'
import GalleryCategoryPage from '@/components/GalleryCategoryPage'
import { useEffect, useState } from 'react'

// Skeleton: exact mirror of GalleryCategoryPage real layout
function GalleryCategorySkeleton() {
  return (
    <main className="min-h-screen bg-[#f8f4ec] relative pb-20">
      {/* Breadcrumb — py-4 px-5 */}
      <nav className="py-4 px-5">
        <div className="flex items-center gap-2">
          <div className="h-3 w-10 bg-gray-200 rounded animate-pulse" />
          <span className="text-gray-300">/</span>
          <div className="h-3 w-14 bg-gray-200 rounded animate-pulse" />
          <span className="text-gray-300">/</span>
          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
      </nav>

      <div className="px-5">
        {/* Title + divider — same as mb-8 block */}
        <div className="mb-8">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-5" />
          <div className="h-[1px] bg-gray-200 w-full" />
        </div>

        {/* Product grid — grid-cols-2 / md:grid-cols-3 / lg:grid-cols-4, square images */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i}>
              <div className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
              <div className="mt-3 h-4 w-2/3 bg-gray-200 rounded animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function GalleryCategory() {
  const params = useParams()
  const category = params.category
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Special handling for Alphard & Vellfire
  const isCombined = category === 'alphard-vellfire'
  const [activeTab, setActiveTab] = useState('alphard')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Determine which category to fetch
        const categoryToFetch = isCombined ? activeTab : category

        const response = await fetch(`/api/gallery?category=${categoryToFetch}`)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        setProducts(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching gallery:', error)
        setLoading(false)
      }
    }

    if (category) {
      fetchProducts()
    }
  }, [category, activeTab, isCombined])

  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'ViewGallery', {
        content_category: category,
        content_name: `${category.toUpperCase()} Gallery`
      });
    }
  }, [category]);

  if (loading) {
    return <GalleryCategorySkeleton />;
  }

  const tabs = isCombined ? [
    { label: 'Alphard', value: 'alphard' },
    { label: 'Vellfire', value: 'vellfire' }
  ] : []

  return (
    <div className="min-h-screen">
      <GalleryCategoryPage
        title={isCombined ? 'ALPHARD & VELLFIRE' : category.toUpperCase()}
        products={products.map(item => ({
          id: item.Id,
          name: item.Name || `Product ${item.Id}`,
          image: item.Url,
          same: item.same,
          description: item.description,
          date: item.date,
          slug: (item.Name || `Product ${item.Id}`).toLowerCase().replace(/\s+/g, '-')
        }))}
        categoryPath={category}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  )
}