"use client"
import { useParams } from 'next/navigation'
import GalleryCategoryPage from '@/components/GalleryCategoryPage'
import HeroSection from '@/components/HeroSection'
import { useEffect, useState } from 'react'

export default function GalleryCategory() {
  const params = useParams()
  const category = params.category
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/gallery?category=${category}`)
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
  }, [category])

  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'ViewGallery', {
        content_category: category,
        content_name: `${category.toUpperCase()} Gallery`
      });
    }
  }, [category]);

  if (loading) {
    return null // 或者顯示載入動畫
  }

  return (
    <div className="min-h-screen">
      <GalleryCategoryPage 
        title={category.toUpperCase()}
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
      />
    </div>
  )
} 