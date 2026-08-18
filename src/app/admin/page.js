"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AdminPage() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f4ec] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#1c5434]">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-300"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/admin/products">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold text-[#1c5434] mb-2">
                Products Management
              </h2>
              <p className="text-gray-600">
                Manage your product catalog, add new products, edit existing ones, or remove products.
              </p>
            </motion.div>
          </Link>

          <Link href="/admin/gallery">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold text-[#1c5434] mb-2">
                Gallery Management
              </h2>
              <p className="text-gray-600">
                Manage your gallery images, upload new images, organize categories, or remove images.
              </p>
            </motion.div>
          </Link>

          <Link href="/admin/products/lyno">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-xl font-bold text-[#1c5434] mb-2">
                LYNO Management
              </h2>
              <p className="text-gray-600">
                Manage LYNO screen sizes (inches), model tiers, RAM/ROM specs, product showcase photos, and technical specifications.
              </p>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
} 