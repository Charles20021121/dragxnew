"use client"
import { useParams } from 'next/navigation'
import GalleryCategoryPage from '@/components/GalleryCategoryPage'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    date: new Date().toISOString().split('T')[0],
    publicId: '',
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploadProgress(0)
    
    try {
      let imageData = {
        Url: '',
        publicId: ''
      }

      // 上傳圖片到 Cloudinary
      if (selectedFile) {
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('upload_preset', 'newdragx')
        
        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        )

        if (!uploadResponse.ok) throw new Error('Image upload failed')
        
        const uploadData = await uploadResponse.json()
        imageData = {
          Url: uploadData.secure_url,
          publicId: uploadData.public_id
        }
      }

      // 創建產品，使用最新的圖片數據
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

      // 成功通知
      setNotification({
        show: true,
        type: 'success',
        message: 'Product created successfully!'
      })

      // 重置表單
      setFormData({
        Name: '',
        categories: category,
        Url: '',
        description: '',
        specifications: '',
        buy: '',
        date: new Date().toISOString().split('T')[0],
        publicId: '',
      })
      setSelectedFile(null)
      setShowOffcanvas(false)

      // 重新獲取產品列表
      fetchProducts()

    } catch (error) {
      console.error('Error:', error)
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to create product'
      })
    }

    // 3秒後隱藏通知
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  const handleDelete = async (productId, same, publicId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    
    setIsDeleting(true)
    try {
      const data = { id: productId, same, publicId }
      const url = `/api/admin/gallery/${category}`
      console.log('Delete request URL:', url)
      console.log('Delete request data:', data)

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      // 检查响应状态和类型
      console.log('Response status:', response.status)
      console.log('Response type:', response.headers.get('content-type'))

      // 如果响应不是 JSON，记录原始响应
      if (!response.headers.get('content-type')?.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        throw new Error('Server returned non-JSON response')
      }

      const result = await response.json()
      console.log('Delete response:', result)

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete product')
      }

      setNotification({
        show: true,
        type: 'success',
        message: 'Product deleted successfully!'
      })

      fetchProducts()
    } catch (error) {
      console.error('Delete error:', error)
      setNotification({
        show: true,
        type: 'error',
        message: error.message || 'Failed to delete product'
      })
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
              <form onSubmit={handleSubmit} className="p-6">
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

                {/* Description & Specifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Description & Specifications</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specifications
                      </label>
                      <textarea
                        value={formData.specifications}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          specifications: e.target.value 
                        }))}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1c5434] focus:border-transparent"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          description: e.target.value 
                        }))}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1c5434] focus:border-transparent"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buy Link
                      </label>
                      <input
                        type="url"
                        value={formData.buy}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          buy: e.target.value 
                        }))}
                        placeholder="https://example.com"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1c5434] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-white border-t p-4 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowOffcanvas(false)}
                className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#1c5434] text-white rounded hover:bg-[#143a25] transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
    </div>
  )
} 