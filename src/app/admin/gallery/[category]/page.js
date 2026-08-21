"use client"
import { useParams } from 'next/navigation'
import GalleryCategoryPage from '@/components/GalleryCategoryPage'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { uploadAdminImage } from '@/lib/imageCompressor'

export default function GalleryCategory() {
  const params = useParams()
  const category = params.category
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })
  const [formData, setFormData] = useState({
    Name: '',
    categories: category,
    Url: '',
    description: '',
    specifications: '',
    buy: '',
    date: new Date().toISOString().replace('T', ' ').split('.')[0],
    publicId: '',
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [category])

    const fetchProducts = async () => {
      try {
      const response = await fetch(`/api/admin/gallery?category=${category}`)
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        setProducts(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching gallery:', error)
        setLoading(false)
      }
    }

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 檢查是否選擇了文件
    if (!selectedFile) {
      showNotification('error', 'Please select an image file')
      return
    }

    // 檢查產品名稱
    if (!formData.Name.trim()) {
      showNotification('error', 'Please enter a product name')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      let imageData = {
        Url: '',
        publicId: ''
      }

      // 上傳圖片到 R2
      if (selectedFile) {
        const uploadData = await uploadAdminImage(selectedFile)
        imageData = {
          Url: uploadData.secure_url || uploadData.url,
          publicId: uploadData.public_id
        }
      }

      // 創建產品
      const createResponse = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          Url: imageData.Url,
          publicId: imageData.publicId
        })
      })

      if (!createResponse.ok) throw new Error('Failed to create product')

      showNotification('success', 'Product created successfully!')

      // 重置表單
      setFormData({
        Name: '',
        categories: category,
        Url: '',
        description: '',
        specifications: '',
        buy: '',
        date: new Date().toISOString().replace('T', ' ').split('.')[0],
        publicId: '',
      })
      setSelectedFile(null)
      setShowOffcanvas(false)

      fetchProducts()

    } catch (error) {
      console.error('Error:', error)
      showNotification('error', 'Failed to create product')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (productId, same, publicId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/gallery/${category}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: productId, same, publicId })
      })

      if (!response.ok) throw new Error('Failed to delete product')

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete product')
      }

      showNotification('success', 'Product deleted successfully!')

      fetchProducts()
    } catch (error) {
      console.error('Delete error:', error)
      showNotification('error', error.message || 'Failed to delete product')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Gallery Category Page */}
      <GalleryCategoryPage 
        title={category.toUpperCase()}
        products={products.map(item => ({
          id: item.Id,
          name: item.Name || `Product ${item.Id}`,
          image: item.Url,
          same: item.same,
          description: item.description,
          date: item.date,
          publicId: item.publicId,
          slug: (item.Name || `Product ${item.Id}`).toLowerCase().replace(/\s+/g, '-')
        }))}
        categoryPath={category}
        isAdmin={true}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        onAdd={() => setShowOffcanvas(true)}
      />

      {/* Add Product Offcanvas */}
      {showOffcanvas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white flex flex-col">
            {/* Header */}
            <div className="bg-[#1c5434] text-white px-6 py-4 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <h2 className="text-xl font-semibold">Create New Product</h2>
              </div>
              <button
                onClick={() => setShowOffcanvas(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 h-full flex flex-col">
                {/* Product Image */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Product Image</h3>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => document.getElementById('imageInput').click()}
                      className="bg-[#1c5434] text-white px-4 py-2 rounded hover:bg-[#143a25] transition-colors"
                    >
                      Choose File
                    </button>
                    <span className="text-gray-500">
                      {selectedFile ? selectedFile.name : 'No file chosen'}
                    </span>
                  </div>
                  <input
                    id="imageInput"
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    accept="image/*"
                    className="hidden"
                    required
                  />
                </div>

                {/* Basic Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={formData.Name}
                        onChange={(e) => setFormData(prev => ({ ...prev, Name: e.target.value }))}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1c5434] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto bg-white border-t p-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowOffcanvas(false)}
                    className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#1c5434] text-white rounded hover:bg-[#143a25] transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upload Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="relative">
              {/* 主要加載圈 */}
              <div className="w-16 h-16 rounded-full border-4 border-[#1c5434]/20">
                <div className="w-full h-full rounded-full border-4 border-[#88bc04] border-t-transparent animate-[spin_0.8s_linear_infinite]">
                </div>
              </div>
              {/* 脈衝效果 */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="w-16 h-16 rounded-full border-4 border-[#88bc04] opacity-0 animate-[ping_1.5s_ease-out_infinite]">
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Uploading product...</p>
          </div>
        </div>
      )}

      {/* Delete Loading Overlay */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="relative">
              {/* 主要加載圈 */}
              <div className="w-16 h-16 rounded-full border-4 border-[#1c5434]/20">
                <div className="w-full h-full rounded-full border-4 border-[#88bc04] border-t-transparent animate-[spin_0.8s_linear_infinite]">
                </div>
              </div>
              {/* 脈衝效果 */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="w-16 h-16 rounded-full border-4 border-[#88bc04] opacity-0 animate-[ping_1.5s_ease-out_infinite]">
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Deleting product...</p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
    </div>
  )
} 