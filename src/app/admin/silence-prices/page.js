"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function SilencePricesAdminPage() {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingKey, setUploadingKey] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const categoriesTop = ['BASIC', 'STANDARD', 'PRO']
  const categoriesBottom = ['COMFORT', 'COMFORT MAX', 'ACOUSTIC PROMAX']
  const carTypes = ['HATCHBACK', 'SEDAN', 'SUV', 'MPV']

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      const res = await fetch('/api/admin/silence-prices')
      const data = await res.json()
      if (data.success) {
        setPrices(data.prices || [])
      } else {
        setError(data.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getItem = (category, carType) => {
    return prices.find(p => p.category === category && p.car_type === carType) || {
      category,
      car_type: carType,
      price: '',
      image_url: '',
      mobile_image_url: ''
    }
  }

  const updateItemField = (category, carType, field, value) => {
    setPrices(prev => {
      const exists = prev.find(p => p.category === category && p.car_type === carType)
      if (exists) {
        return prev.map(p => p.category === category && p.car_type === carType ? { ...p, [field]: value } : p)
      } else {
        return [...prev, { category, car_type: carType, [field]: value }]
      }
    })
  }

  // 上传图片处理函数 (上传到 R2 存储)
  const handleImageUpload = async (category, carType, field, file) => {
    if (!file) return

    const uploadKey = `${category}-${carType}-${field}`
    setUploadingKey(uploadKey)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (data.success && data.url) {
        updateItemField(category, carType, field, data.url)
      } else {
        setError(data.error || 'Image upload failed')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setUploadingKey(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await fetch('/api/admin/silence-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: prices })
      })
      const data = await res.json()
      if (data.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.error || 'Failed to save prices')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f4ec] flex items-center justify-center">
        <div className="text-lg font-bold text-[#1c5434]">Loading Silence Management...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f4ec] p-4 sm:p-6 md:p-10">
      <div className="max-w-7xl mx-auto pb-24">
        {/* 顶部导航与保存按钮 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <Link href="/admin/products/silence" className="text-sm font-semibold text-[#1c5434] hover:underline flex items-center gap-1.5 mb-1">
              &larr; Back to Silence Products
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c5434]">
              Silence Pricing & Solutions Management
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage banner images, matrix prices, and curated solution posters.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || uploadingKey !== null}
            className="bg-[#1c5434] hover:bg-[#143e26] text-white font-bold px-8 py-3 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save All Changes'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded mb-6 text-sm font-medium">
            All prices and images saved successfully!
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 1: BASIC / STANDARD / PRO 价格与横幅 (Top Section)   */}
        {/* ============================================================ */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 mb-12">
          <div className="border-b pb-4 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c5434]">
              1. Top Section (BASIC / STANDARD / PRO)
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Set car type prices and upload full-width banners for Desktop & Mobile.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {categoriesTop.map(cat => {
              const bannerItem = getItem(cat, 'BANNER')

              return (
                <div key={cat} className="border border-gray-200 rounded-xl p-5 bg-[#fbf9f5] flex flex-col justify-between">
                  <div>
                    {/* 套餐标题 */}
                    <div className="bg-[#1c5434] text-white py-2 px-4 rounded-lg font-bold text-center uppercase tracking-widest text-base mb-5">
                      {cat}
                    </div>

                    {/* 4 种车型价格输入 */}
                    <div className="space-y-3 mb-6">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Car Type Prices (RM)</h4>
                      {carTypes.map(car => {
                        const item = getItem(cat, car)
                        return (
                          <div key={car} className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-md border">
                            <span className="text-xs font-bold text-[#1c5434]">{car}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-400">RM</span>
                              <input
                                type="text"
                                value={item.price || ''}
                                onChange={(e) => updateItemField(cat, car, 'price', e.target.value)}
                                placeholder="e.g. 1380"
                                className="w-24 text-right px-2 py-1 text-xs border rounded font-semibold text-[#1c5434] focus:ring-1 focus:ring-[#1c5434] outline-none"
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Banner 图片上传区 */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Banner Images</h4>
                      
                      {/* 桌面端 Banner */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-600">Desktop Banner (16:5 ~ 3:1)</label>
                        {bannerItem.image_url ? (
                          <div className="relative w-full h-24 bg-gray-100 rounded border overflow-hidden group">
                            <img src={bannerItem.image_url} alt={`${cat} Desktop`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => updateItemField(cat, 'BANNER', 'image_url', '')}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(cat, 'BANNER', 'image_url', e.target.files[0])}
                            className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#1c5434] file:text-white hover:file:bg-[#143e26]"
                          />
                        )}
                        {uploadingKey === `${cat}-BANNER-image_url` && (
                          <p className="text-[10px] text-[#1c5434] animate-pulse">Uploading desktop banner...</p>
                        )}
                      </div>

                      {/* 手机端 Banner */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-gray-600">Mobile Banner (Vertical / 9:16)</label>
                        {bannerItem.mobile_image_url ? (
                          <div className="relative w-full h-24 bg-gray-100 rounded border overflow-hidden group">
                            <img src={bannerItem.mobile_image_url} alt={`${cat} Mobile`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => updateItemField(cat, 'BANNER', 'mobile_image_url', '')}
                              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(cat, 'BANNER', 'mobile_image_url', e.target.files[0])}
                            className="block w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#1c5434] file:text-white hover:file:bg-[#143e26]"
                          />
                        )}
                        {uploadingKey === `${cat}-BANNER-mobile_image_url` && (
                          <p className="text-[10px] text-[#1c5434] animate-pulse">Uploading mobile banner...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 2: CURATED SOLUTIONS (COMFORT / MAX / PROMAX) 照片与价格 */}
        {/* ============================================================ */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="border-b pb-4 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#1c5434]">
              2. CURATED SOLUTIONS (COMFORT / COMFORT MAX / ACOUSTIC PROMAX)
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Upload 1:1 car diagram photos and set prices for each car type across all 3 tiers.
            </p>
          </div>

          <div className="space-y-12">
            {categoriesBottom.map(cat => (
              <div key={cat} className="border border-gray-200 rounded-xl p-6 bg-[#fbf9f5]">
                {/* 分类标题 */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-3 h-3 rounded-full bg-[#1c5434]" />
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#1c5434] uppercase tracking-wider">
                    {cat}
                  </h3>
                </div>

                {/* 4 种车型的 1:1 照片与价格上传卡片 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {carTypes.map(car => {
                    const item = getItem(cat, car)
                    const uploadKey = `${cat}-${car}-image_url`

                    return (
                      <div key={car} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                        {/* 车型名称 */}
                        <div className="text-center pb-2 border-b mb-3">
                          <span className="text-xs font-bold text-[#1c5434] uppercase tracking-wider">
                            {car}
                          </span>
                        </div>

                        {/* 1:1 照片上传与预览 */}
                        <div className="space-y-2 mb-4">
                          <label className="text-[11px] font-semibold text-gray-600 block text-center">1:1 Square Photo</label>
                          {item.image_url ? (
                            <div className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden group">
                              <img
                                src={item.image_url}
                                alt={`${cat} ${car}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => updateItemField(cat, car, 'image_url', '')}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <div className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-3 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                              <input
                                type="file"
                                accept="image/*"
                                id={`file-${cat}-${car}`}
                                onChange={(e) => handleImageUpload(cat, car, 'image_url', e.target.files[0])}
                                className="hidden"
                              />
                              <label
                                htmlFor={`file-${cat}-${car}`}
                                className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-xs font-semibold text-[#1c5434]"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1c5434]/50 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Upload Photo
                              </label>
                            </div>
                          )}
                          {uploadingKey === uploadKey && (
                            <p className="text-[10px] text-center text-[#1c5434] animate-pulse">Uploading photo...</p>
                          )}
                        </div>

                        {/* 价格输入 */}
                        <div className="pt-2 border-t border-gray-100">
                          <label className="text-[11px] font-semibold text-gray-600 block mb-1">Price (RM)</label>
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded border border-gray-200">
                            <span className="text-xs font-bold text-gray-500">RM</span>
                            <input
                              type="text"
                              value={item.price || ''}
                              onChange={(e) => updateItemField(cat, car, 'price', e.target.value)}
                              placeholder="e.g. 2888"
                              className="w-full bg-transparent text-sm font-bold text-[#1c5434] outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
