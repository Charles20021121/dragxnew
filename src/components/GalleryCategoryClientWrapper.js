"use client"
import { useState, useEffect } from 'react'
import GalleryCategoryPage from '@/components/GalleryCategoryPage'

export default function GalleryCategoryClientWrapper({ category, products, isCombined }) {
  const [activeTab, setActiveTab] = useState('alphard')

  // Filter products based on active tab for combined category
  const filteredProducts = isCombined
    ? products.filter(p => p.rawCategory === activeTab)
    : products;

  const tabs = isCombined ? [
    { label: 'Alphard', value: 'alphard' },
    { label: 'Vellfire', value: 'vellfire' }
  ] : []

  useEffect(() => {
    if (window.fbq) {
      window.fbq('track', 'ViewGallery', {
        content_category: category,
        content_name: `${category.toUpperCase()} Gallery`
      });
    }
  }, [category]);

  return (
    <GalleryCategoryPage
      title={isCombined ? 'ALPHARD & VELLFIRE' : category.toUpperCase()}
      products={filteredProducts}
      categoryPath={category}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  )
}
