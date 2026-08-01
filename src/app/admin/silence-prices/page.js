"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SilencePricesAdminPage() {
  const router = useRouter()
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
        setPrices(data.prices)
      } else {
        setError(data.error || 'Failed to fetch prices')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePriceChange = (category, carType, value) => {
    setPrices(prev => {
      const exists = prev.find(p => p.category === category && p.car_type === carType)
      if (exists) {
        return prev.map(p => p.category === category && p.car_type === carType ? { ...p, price: value } : p)
      } else {
        return [...prev, { category, car_type: carType, price: value }]
      }
    })
  }

  const getPriceValue = (category, carType) => {
    const item = prices.find(p => p.category === category && p.car_type === carType)
    return item ? item.price : ''
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

  if (loading) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-[#f8f4ec] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-[#1c5434] hover:underline font-semibold">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-[#1c5434]">
              Silence Prices Management
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1c5434] hover:bg-[#143e26] text-white px-6 py-2 rounded transition-colors duration-300 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save All Prices'}
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-4 rounded mb-6">Prices saved successfully!</div>}

        <div className="space-y-12">
          {/* Top Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b">Pricing Section (BASIC / STANDARD / PRO)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categoriesTop.map(cat => (
                <div key={cat} className="space-y-4">
                  <h3 className="font-bold text-lg text-center bg-gray-100 py-2 rounded">{cat}</h3>
                  {carTypes.map(car => (
                    <div key={`${cat}-${car}`} className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-600 mb-1">{car}</label>
                      <input
                        type="text"
                        value={getPriceValue(cat, car)}
                        onChange={(e) => handlePriceChange(cat, car, e.target.value)}
                        placeholder="e.g. 1999"
                        className="border p-2 rounded focus:ring-2 focus:ring-[#1c5434] outline-none"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b">Comfort Section (COMFORT / COMFORT MAX / ACOUSTIC PROMAX)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categoriesBottom.map(cat => (
                <div key={cat} className="space-y-4">
                  <h3 className="font-bold text-lg text-center bg-gray-100 py-2 rounded">{cat}</h3>
                  {carTypes.map(car => (
                    <div key={`${cat}-${car}`} className="flex flex-col">
                      <label className="text-sm font-semibold text-gray-600 mb-1">{car}</label>
                      <input
                        type="text"
                        value={getPriceValue(cat, car)}
                        onChange={(e) => handlePriceChange(cat, car, e.target.value)}
                        placeholder="e.g. 2999"
                        className="border p-2 rounded focus:ring-2 focus:ring-[#1c5434] outline-none"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
