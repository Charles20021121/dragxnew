"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const CAR_TYPES = ['HATCHBACK', 'SEDAN', 'SUV', 'MPV']
const TOP_PACKAGES = ['BASIC', 'STANDARD', 'PRO']
const CURATED_TIERS = ['COMFORT', 'COMFORT MAX', 'ACOUSTIC PROMAX']
const AUDIO_BRANDS = ['ALPINE', 'RAINBOW', 'ADAMDIGITAL', 'CROSSFIRE']

const DEFAULT_BANNERS = {
  BASIC: {
    desktop: '/silence/basic/DX Silence PAGE FA 2.webp',
    mobile: '/silence/basic/PHONE SIZE-BASIC 1.webp'
  },
  STANDARD: {
    desktop: '/silence/basic/DX Silence PC 2-12.webp',
    mobile: '/silence/basic/PHONE SIZE-STANDARD 3.webp'
  },
  PRO: {
    desktop: '/silence/basic/DX Silence PC 2-13.webp',
    mobile: '/silence/basic/PHONE SIZE-PRO 2.webp'
  }
}

export default function SilenceAdminManager({ 
  initialProducts = [], 
  initialSilencePrices = [],
  onRefresh
}) {
  // Main Navigation: 'soundproof' | 'audio'
  const [mainTab, setMainTab] = useState('soundproof')

  // Soundproofing Sub-Tabs: 'packages' | 'tailored' | 'curated'
  const [soundproofSubTab, setSoundproofSubTab] = useState('packages')

  // Sub-tier selections
  const [curatedTier, setCuratedTier] = useState('COMFORT')
  const [tailoredTier, setTailoredTier] = useState('COMFORT')
  const [activeAudioBrand, setActiveAudioBrand] = useState('ALPINE')

  // State
  const [prices, setPrices] = useState(initialSilencePrices)
  const [products, setProducts] = useState(initialProducts)
  const [uploadingKey, setUploadingKey] = useState(null)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })

  // Modal State
  const [showProductModal, setShowProductModal] = useState(false)
  const [modalMode, setModalMode] = useState('create') // 'create' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null)
  const [modalTab, setModalTab] = useState('basic') // 'basic' | 'gallery'
  const [modalForm, setModalForm] = useState({
    Name: '',
    price: '',
    filter1: 'silence',
    custom_filter: 'COMFORT',
    filter: 'hatchback',
    description: '',
    Specifications: '',
    Url: ''
  })
  const [modalFile, setModalFile] = useState(null)
  const [existingExtraImages, setExistingExtraImages] = useState([])
  const [newExtraFiles, setNewExtraFiles] = useState([])
  const [isModalSaving, setIsModalSaving] = useState(false)

  useEffect(() => {
    setPrices(initialSilencePrices)
  }, [initialSilencePrices])

  useEffect(() => {
    setProducts(initialProducts)
  }, [initialProducts])

  const showToast = (type, message) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' })
    }, 3500)
  }

  const formatDisplayPrice = (priceVal) => {
    if (!priceVal || priceVal === 'XXX' || priceVal.toString().trim() === '') return '--'
    const num = parseFloat(String(priceVal).replace(/[^0-9.]/g, ''))
    if (isNaN(num)) return priceVal
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const getMatrixItem = (category, carType) => {
    return prices.find(p => p.category === category && p.car_type === carType) || {
      category,
      car_type: carType,
      price: '',
      image_url: '',
      mobile_image_url: ''
    }
  }

  const updateMatrixField = (category, carType, field, value) => {
    setPrices(prev => {
      const exists = prev.find(p => p.category === category && p.car_type === carType)
      if (exists) {
        return prev.map(p => p.category === category && p.car_type === carType ? { ...p, [field]: value } : p)
      } else {
        return [...prev, { category, car_type: carType, [field]: value }]
      }
    })
  }

  // Auto-save single matrix price on blur
  const handleAutoSaveMatrixPrice = async (category, carType, value) => {
    updateMatrixField(category, carType, 'price', value)
    try {
      await fetch('/api/admin/silence-prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: [{ category, car_type: carType, price: value }]
        })
      })
      showToast('success', 'Price auto-saved to live website!')
      if (onRefresh) onRefresh()
    } catch (err) {
      showToast('error', err.message)
    }
  }

  // Upload image to Cloudflare R2 and auto-save
  const handleMatrixImageUpload = async (category, carType, field, file) => {
    if (!file) return
    const key = `${category}-${carType}-${field}`
    setUploadingKey(key)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      const uploadedUrl = data.url || data.secure_url

      if (data.success && uploadedUrl) {
        updateMatrixField(category, carType, field, uploadedUrl)

        // Directly sync to database
        await fetch('/api/admin/silence-prices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            updates: [{ category, car_type: carType, [field]: uploadedUrl }]
          })
        })

        showToast('success', 'Banner updated & saved live!')
        if (onRefresh) onRefresh()
      } else {
        showToast('error', data.error || 'Failed to upload image')
      }
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setUploadingKey(null)
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        showToast('success', 'Product deleted!')
        setProducts(prev => prev.filter(p => p.id !== id && p.Id !== id))
        if (onRefresh) onRefresh()
      } else {
        showToast('error', data.error || 'Delete failed')
      }
    } catch (err) {
      showToast('error', err.message)
    }
  }

  const handleDeleteExistingExtraImage = async (imgId) => {
    if (!confirm('Delete this additional photo?')) return
    try {
      const res = await fetch(`/api/admin/products/${imgId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setExistingExtraImages(prev => prev.filter(img => img.Id !== imgId))
        showToast('success', 'Photo removed!')
      }
    } catch (err) {
      showToast('error', err.message)
    }
  }

  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItemId, setDragOverItemId] = useState(null)

  // Drag and drop handlers with instant auto-save
  const handleDragStart = (e, item, listType) => {
    setDraggedItem({ item, listType })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(item.id || item.Id))
  }

  const handleDragOver = (e, item) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    const itemId = item.id || item.Id
    if (draggedItem && (draggedItem.item.id || draggedItem.item.Id) !== itemId) {
      setDragOverItemId(itemId)
    }
  }

  const handleDragLeave = () => {
    setDragOverItemId(null)
  }

  const handleDrop = async (e, targetItem, list, listType) => {
    e.preventDefault()
    setDragOverItemId(null)

    if (!draggedItem || draggedItem.listType !== listType) {
      setDraggedItem(null)
      return
    }
    const sourceId = draggedItem.item.id || draggedItem.item.Id
    const targetId = targetItem.id || targetItem.Id
    if (sourceId === targetId) {
      setDraggedItem(null)
      return
    }

    const sourceIndex = list.findIndex(p => (p.id || p.Id) === sourceId)
    const targetIndex = list.findIndex(p => (p.id || p.Id) === targetId)
    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedItem(null)
      return
    }

    const newList = [...list]
    const [moved] = newList.splice(sourceIndex, 1)
    newList.splice(targetIndex, 0, moved)

    const reorderPayload = newList.map((it, idx) => ({
      id: it.id || it.Id,
      sort_order: (idx + 1) * 10
    }))

    // Instant local state update
    setProducts(prev => {
      return prev.map(p => {
        const pId = p.id || p.Id
        const found = reorderPayload.find(r => r.id === pId)
        return found ? { ...p, sort_order: found.sort_order } : p
      })
    })
    setDraggedItem(null)

    try {
      const res = await fetch('/api/admin/featured-reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: reorderPayload })
      })
      const data = await res.json()
      if (data && data.message) {
        showToast('success', 'Order updated & saved live!')
        if (onRefresh) onRefresh()
      }
    } catch (err) {
      showToast('error', 'Failed to save order: ' + err.message)
    }
  }

  const handleOpenProductModal = async (mode, product = null, preset = {}) => {
    setModalMode(mode)
    setModalFile(null)
    setNewExtraFiles([])
    setExistingExtraImages([])
    setModalTab('basic')

    if (mode === 'edit' && product) {
      setEditingProduct(product)
      setModalForm({
        Name: product.name || product.Name || '',
        price: product.price || '',
        filter1: product.filter1 || preset.filter1 || 'silence',
        custom_filter: product.custom_filter || preset.custom_filter || 'COMFORT',
        filter: product.filter || preset.filter || 'hatchback',
        description: product.description || '',
        Specifications: product.Specifications || product.specifications || '',
        Url: product.image || product.Url || ''
      })

      // Fetch extra gallery images linked to this product (same = Id)
      const mainId = product.id || product.Id
      if (mainId) {
        try {
          const res = await fetch(`/api/products?id=${mainId}`)
          const data = await res.json()
          const list = data?.additional_images || data?.additionalImages || []
          if (Array.isArray(list)) {
            setExistingExtraImages(list)
          }
        } catch (e) {
          console.error('Failed to fetch additional images:', e)
        }
      }
    } else {
      setEditingProduct(null)
      setModalForm({
        Name: '',
        price: '',
        filter1: preset.filter1 || 'silence',
        custom_filter: preset.custom_filter || 'COMFORT',
        filter: preset.filter || 'hatchback',
        description: '',
        Specifications: '',
        Url: ''
      })
    }
    setShowProductModal(true)
  }

  const handleSaveProductModal = async (e) => {
    e.preventDefault()
    if (!modalForm.Name.trim()) {
      showToast('error', 'Please enter a product name')
      return
    }

    setIsModalSaving(true)
    try {
      let mainImageUrl = modalForm.Url
      let mainPublicId = editingProduct?.publicId || ''

      // 1. Upload new main image if selected
      if (modalFile) {
        const formData = new FormData()
        formData.append('file', modalFile)
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        })
        const uploadData = await uploadRes.json()
        if (uploadData.success && (uploadData.url || uploadData.secure_url)) {
          mainImageUrl = uploadData.url || uploadData.secure_url
          mainPublicId = uploadData.public_id || ''
        } else {
          showToast('error', 'Failed to upload main image')
          setIsModalSaving(false)
          return
        }
      }

      if (!mainImageUrl && modalMode === 'create') {
        showToast('error', 'Please select a main product image')
        setIsModalSaving(false)
        return
      }

      const payload = {
        categories: 'silence',
        Name: modalForm.Name.trim(),
        price: modalForm.price,
        filter: modalForm.filter,
        filter1: modalForm.filter1,
        custom_filter: modalForm.custom_filter,
        description: modalForm.description,
        Specifications: modalForm.Specifications,
        Url: mainImageUrl,
        publicId: mainPublicId,
        date: editingProduct?.date || new Date().toISOString().replace('T', ' ').split('.')[0]
      }

      let res
      let mainId = editingProduct?.id || editingProduct?.Id

      if (modalMode === 'edit' && mainId) {
        res = await fetch(`/api/admin/products/${mainId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }

      const resData = await res.json()
      if (resData.success) {
        if (!mainId) mainId = resData.id

        // 2. Upload any additional gallery images
        if (newExtraFiles.length > 0 && mainId) {
          for (const file of newExtraFiles) {
            const extraFormData = new FormData()
            extraFormData.append('file', file)
            const upRes = await fetch('/api/admin/upload', {
              method: 'POST',
              body: extraFormData
            })
            const upData = await upRes.json()
            if (upData.success && (upData.url || upData.secure_url)) {
              await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  categories: 'silence',
                  Name: modalForm.Name.trim(),
                  price: modalForm.price,
                  filter: modalForm.filter,
                  filter1: modalForm.filter1,
                  custom_filter: modalForm.custom_filter,
                  Url: upData.url || upData.secure_url,
                  publicId: upData.public_id || '',
                  same: mainId,
                  date: new Date().toISOString().replace('T', ' ').split('.')[0]
                })
              })
            }
          }
        }

        showToast('success', modalMode === 'edit' ? 'Product updated successfully!' : 'Product added successfully!')
        const newProductObj = {
          id: mainId,
          Id: mainId,
          name: payload.Name,
          Name: payload.Name,
          price: payload.price,
          filter1: payload.filter1,
          custom_filter: payload.custom_filter,
          filter: payload.filter,
          description: payload.description,
          Specifications: payload.Specifications,
          image: payload.Url,
          Url: payload.Url,
          categories: payload.categories,
          date: payload.date
        }
        if (modalMode === 'edit' && editingProduct) {
          setProducts(prev => prev.map(p => (p.id === editingProduct.id || p.Id === editingProduct.Id) ? { ...p, ...newProductObj } : p))
        } else {
          setProducts(prev => [...prev, newProductObj])
        }
        setShowProductModal(false)
        if (onRefresh) onRefresh()
      } else {
        showToast('error', resData.error || 'Failed to save product')
      }
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setIsModalSaving(false)
    }
  }

  // Get curated items list for column
  const getCuratedListForColumn = (tier, carType) => {
    const tierUpper = tier.toUpperCase()
    const carLower = carType.toLowerCase()

    const matchedProducts = products.filter(p => {
      const pName = (p.name || p.Name || '').toUpperCase()
      const pCat = (p.custom_filter || '').toUpperCase()
      const filterVal = (p.filter || '').toLowerCase()
      const filter1Val = (p.filter1 || '').toLowerCase()

      // Must be main product row
      const isMainProduct = !p.same || p.same === '' || String(p.id || p.Id) === String(p.same)
      if (!isMainProduct) return false

      if (filter1Val === 'tailored' || pCat.startsWith('TAILORED')) return false
      if (filter1Val === 'audio' || ['ALPINE', 'RAINBOW', 'ADAMDIGITAL', 'CROSSFIRE'].includes(pCat)) return false

      const isCurated = filter1Val === 'curated' || pCat.startsWith('CURATED') || filter1Val === 'silence' || filter1Val === 'soundproof' || !p.filter1

      let tierMatch = false
      if (tierUpper === 'COMFORT') {
        tierMatch = (pCat.includes('COMFORT') || pName.includes('COMFORT')) && !pName.includes('MAX') && !pCat.includes('MAX')
      } else if (tierUpper === 'COMFORT MAX') {
        tierMatch = pCat.includes('COMFORT MAX') || pName.includes('COMFORT MAX')
      } else if (tierUpper === 'ACOUSTIC PROMAX') {
        tierMatch = pCat.includes('PROMAX') || pName.includes('PROMAX') || pName.includes('ACOUSTIC')
      }

      const carMatch = 
        filterVal === carLower || 
        filterVal.includes(carLower) || 
        filter1Val === carLower || 
        filter1Val.includes(carLower) || 
        pName.toLowerCase().includes(carLower)

      return isCurated && tierMatch && carMatch
    })

    // Sorted by sort_order first, then date / id
    return [...matchedProducts].sort((a, b) => {
      const orderA = (a.sort_order !== undefined && a.sort_order !== null && a.sort_order !== '') ? Number(a.sort_order) : 999999
      const orderB = (b.sort_order !== undefined && b.sort_order !== null && b.sort_order !== '') ? Number(b.sort_order) : 999999
      if (orderA !== orderB) return orderA - orderB
      const dateA = new Date(a.date || 0).getTime()
      const dateB = new Date(b.date || 0).getTime()
      if (dateA !== dateB) return dateA - dateB
      return (a.id || a.Id || 0) - (b.id || b.Id || 0)
    })
  }

  // Count totals for summary badges
  const totalSoundproofItems = products.filter(p => {
    const isMainProduct = !p.same || p.same === '' || String(p.id || p.Id) === String(p.same)
    const isAudio = (p.filter1 || '').toLowerCase() === 'audio' || ['ALPINE', 'RAINBOW', 'ADAMDIGITAL', 'CROSSFIRE'].includes((p.custom_filter || '').toUpperCase())
    return isMainProduct && !isAudio
  }).length

  const totalAudioItems = products.filter(p => {
    const isMainProduct = !p.same || p.same === '' || String(p.id || p.Id) === String(p.same)
    const isAudio = (p.filter1 || '').toLowerCase() === 'audio' || ['ALPINE', 'RAINBOW', 'ADAMDIGITAL', 'CROSSFIRE'].includes((p.custom_filter || '').toUpperCase())
    return isMainProduct && isAudio
  }).length

  return (
    <div className="min-h-screen bg-[#f8f6f0] text-gray-800 pb-28">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-5 right-5 z-50 px-5 py-3.5 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2.5 border ${
              notification.type === 'success'
                ? 'bg-[#1c5434] text-white border-green-700'
                : 'bg-red-600 text-white border-red-700'
            }`}
          >
            <span>{notification.type === 'success' ? '✓' : '✕'}</span>
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-[#1c5434]/15 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-0.5">
              <Link href="/admin" className="hover:text-[#1c5434] hover:underline">Admin Dashboard</Link>
              <span>/</span>
              <span className="text-[#1c5434] font-bold">Silence & Audio Visual</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#1c5434] tracking-tight">
              Silence Management
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-2">
        {/* Centered SOUNDPROOFING / AUDIO SYSTEMS Switcher */}
        <div className="flex justify-center my-6">
          <div className="inline-flex p-1.5 bg-white rounded-2xl border border-gray-200 shadow-xs gap-1.5">
            <button
              onClick={() => setMainTab('soundproof')}
              className={`px-8 sm:px-12 py-3 rounded-xl font-extrabold text-sm sm:text-base tracking-wider uppercase transition-all cursor-pointer ${
                mainTab === 'soundproof'
                  ? 'bg-[#1c5434] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1c5434] hover:bg-gray-50'
              }`}
            >
              SOUNDPROOFING
            </button>
            <button
              onClick={() => setMainTab('audio')}
              className={`px-8 sm:px-12 py-3 rounded-xl font-extrabold text-sm sm:text-base tracking-wider uppercase transition-all cursor-pointer ${
                mainTab === 'audio'
                  ? 'bg-[#1c5434] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1c5434] hover:bg-gray-50'
              }`}
            >
              AUDIO SYSTEMS
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* SECTION 1: SOUNDPROOFING MANAGEMENT                           */}
        {/* ============================================================ */}
        {mainTab === 'soundproof' && (
          <div className="space-y-6">
            {/* Soundproofing 3 Sub-Tabs Switcher (Pricing Matrix, Tailored, Curated) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 bg-white rounded-2xl shadow-xs border border-gray-200 mb-6">
              {[
                { id: 'packages', title: 'Pricing Matrix & Banners', desc: 'BASIC / STANDARD / PRO 12-Box Packages' },
                { id: 'tailored', title: 'Tailored Solutions', desc: 'Work Scope Products & Parts' },
                { id: 'curated', title: 'Curated Solutions', desc: '1:1 Car Diagram Posters & Prices' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSoundproofSubTab(sub.id)}
                  className={`p-4 rounded-xl text-left transition-all cursor-pointer ${
                    soundproofSubTab === sub.id
                      ? 'bg-[#1c5434] text-white shadow-md'
                      : 'bg-transparent text-gray-700 hover:bg-[#f8f6f0]'
                  }`}
                >
                  <div className="font-extrabold text-sm sm:text-base">
                    {sub.title}
                  </div>
                  <div className={`text-xs mt-1 ${soundproofSubTab === sub.id ? 'text-green-100' : 'text-gray-400'}`}>
                    {sub.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Sub-Tab 1: Curated Solutions (1:1 Square Posters) */}
            {soundproofSubTab === 'curated' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-100 gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#1c5434] flex items-center gap-2">
                      <span>CURATED SOLUTIONS</span>
                      <span className="text-xs bg-[#1c5434]/10 text-[#1c5434] px-2.5 py-0.5 rounded-full font-bold">
                        1:1 Car Posters
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Manage 1:1 square car diagram posters and set package prices for each vehicle type.
                    </p>
                  </div>

                  {/* Tier Selector Pills */}
                  <div className="inline-flex p-1 bg-[#f0eee6] rounded-xl border border-gray-200">
                    {CURATED_TIERS.map(tier => (
                      <button
                        key={tier}
                        onClick={() => setCuratedTier(tier)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                          curatedTier === tier
                            ? 'bg-[#1c5434] text-white shadow-xs'
                            : 'text-gray-600 hover:text-[#1c5434]'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 Car Type Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {CAR_TYPES.map(car => {
                    const carLower = car.toLowerCase()
                    const carProducts = getCuratedListForColumn(curatedTier, car)

                    return (
                      <div key={car} className="bg-[#fcfaf7] p-4 sm:p-5 rounded-2xl border-2 border-gray-200/80 shadow-2xs flex flex-col justify-between hover:border-[#1c5434]/30 transition-colors">
                        <div>
                          {/* Column Header */}
                          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                            <span className="text-sm font-black text-[#1c5434] uppercase tracking-wider">
                              {car}
                            </span>
                            <button
                              onClick={() => handleOpenProductModal('create', null, {
                                filter1: 'curated',
                                custom_filter: `CURATED - ${curatedTier}`,
                                filter: carLower
                              })}
                              className="text-xs font-bold bg-[#1c5434] hover:bg-[#143e26] text-white px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>+ Add Poster</span>
                            </button>
                          </div>

                          {/* Product Cards */}
                          <div className="space-y-3.5">
                            {carProducts.length > 0 ? (
                              <>
                                {carProducts.map((prod, idx) => {
                                  const isDragging = (draggedItem?.item?.id || draggedItem?.item?.Id) === (prod.id || prod.Id)
                                  const isOver = dragOverItemId === (prod.id || prod.Id)
                                  const listKey = `curated-${curatedTier}-${car}`

                                  return (
                                    <div
                                      key={`curated-${curatedTier}-${car}-${prod.id || prod.Id || idx}-${idx}`}
                                      draggable={true}
                                      onDragStart={(e) => handleDragStart(e, prod, listKey)}
                                      onDragOver={(e) => handleDragOver(e, prod)}
                                      onDragLeave={handleDragLeave}
                                      onDrop={(e) => handleDrop(e, prod, carProducts, listKey)}
                                      className={`bg-white p-3 rounded-xl border shadow-2xs group relative transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                                        isDragging
                                          ? 'opacity-35 scale-95 border-dashed border-[#1c5434] bg-green-50/20'
                                          : isOver
                                          ? 'border-2 border-[#1c5434] ring-2 ring-[#1c5434]/20 bg-green-50/50 -translate-y-1 shadow-md'
                                          : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                    >
                                      {/* Drag Handle 6-dots Icon */}
                                      <div className="absolute top-2 left-2 z-10 p-1 rounded bg-black/5 hover:bg-black/10 text-gray-500 hover:text-black transition-colors" title="Drag to reorder">
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                          <circle cx="9" cy="6" r="2" />
                                          <circle cx="15" cy="6" r="2" />
                                          <circle cx="9" cy="12" r="2" />
                                          <circle cx="15" cy="12" r="2" />
                                          <circle cx="9" cy="18" r="2" />
                                          <circle cx="15" cy="18" r="2" />
                                        </svg>
                                      </div>

                                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-white p-1 mb-2 relative flex items-center justify-center border border-gray-100">
                                        {prod.image || prod.Url ? (
                                          <img src={prod.image || prod.Url} alt={prod.name || prod.Name} className="w-full h-full object-contain pointer-events-none" />
                                        ) : (
                                          <span className="text-xs text-gray-400">No Image</span>
                                        )}
                                      </div>
                                      <div className="text-center">
                                        <h4 className="text-xs font-bold text-[#1c5434] uppercase truncate">{prod.name || prod.Name}</h4>
                                        <p className="text-xs font-extrabold text-gray-800 mt-0.5">RM {formatDisplayPrice(prod.price)}</p>
                                      </div>
                                    <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-gray-100">
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          disabled={idx === 0}
                                          onClick={() => handleMoveProduct(carProducts, idx, 'up')}
                                          title="Move Up"
                                          className="w-6 h-6 rounded-md bg-gray-100 hover:bg-[#1c5434] hover:text-white disabled:opacity-25 disabled:hover:bg-gray-100 disabled:hover:text-gray-400 text-gray-700 font-bold text-[10px] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                                        >
                                          ▲
                                        </button>
                                        <button
                                          type="button"
                                          disabled={idx === carProducts.length - 1}
                                          onClick={() => handleMoveProduct(carProducts, idx, 'down')}
                                          title="Move Down"
                                          className="w-6 h-6 rounded-md bg-gray-100 hover:bg-[#1c5434] hover:text-white disabled:opacity-25 disabled:hover:bg-gray-100 disabled:hover:text-gray-400 text-gray-700 font-bold text-[10px] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                                        >
                                          ▼
                                        </button>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => handleOpenProductModal('edit', prod, {
                                            filter1: 'curated',
                                            custom_filter: `CURATED - ${curatedTier}`,
                                            filter: carLower
                                          })}
                                          className="text-[11px] font-bold text-[#1c5434] hover:underline cursor-pointer"
                                        >
                                          Edit
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                          onClick={() => handleDeleteProduct(prod.id || prod.Id)}
                                          className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}

                                <button
                                  onClick={() => handleOpenProductModal('create', null, {
                                    filter1: 'curated',
                                    custom_filter: `CURATED - ${curatedTier}`,
                                    filter: carLower
                                  })}
                                  className="w-full py-2.5 px-3 border-2 border-dashed border-[#1c5434]/40 hover:border-[#1c5434] bg-white/80 hover:bg-[#1c5434]/5 text-[#1c5434] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                  <span>+ Add Another Poster</span>
                                </button>
                              </>
                            ) : (
                              <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white/60">
                                <p className="text-xs text-gray-400 font-semibold">No posters added</p>
                                <button
                                  onClick={() => handleOpenProductModal('create', null, {
                                    filter1: 'curated',
                                    custom_filter: `CURATED - ${curatedTier}`,
                                    filter: carLower
                                  })}
                                  className="mt-2 text-xs font-bold text-[#1c5434] hover:underline cursor-pointer"
                                >
                                  + Click to Add Poster
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Tailored Solutions */}
            {soundproofSubTab === 'tailored' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-100 gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#1c5434] flex items-center gap-2">
                      <span>TAILORED SOLUTIONS</span>
                      <span className="text-xs bg-[#1c5434]/10 text-[#1c5434] px-2.5 py-0.5 rounded-full font-bold">
                        Work Scope Parts
                      </span>
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Manage individual soundproofing parts (doors, roof, hood, undercarriage) per vehicle type.
                    </p>
                  </div>

                  {/* Tier Selector Pills */}
                  <div className="inline-flex p-1 bg-[#f0eee6] rounded-xl border border-gray-200">
                    {CURATED_TIERS.map(tier => (
                      <button
                        key={tier}
                        onClick={() => setTailoredTier(tier)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                          tailoredTier === tier
                            ? 'bg-[#1c5434] text-white shadow-xs'
                            : 'text-gray-600 hover:text-[#1c5434]'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 Car Type Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {CAR_TYPES.map(car => {
                    const carLower = car.toLowerCase()
                    const matched = products.filter(p => {
                      const filterVal = (p.filter || '').toLowerCase()
                      const filter1Val = (p.filter1 || '').toLowerCase()
                      const pCat = (p.custom_filter || '').toUpperCase()
                      const pName = (p.name || p.Name || '').toUpperCase()
                      const tierUpper = tailoredTier.toUpperCase()

                      const isMainProduct = !p.same || p.same === '' || String(p.id || p.Id) === String(p.same)
                      if (!isMainProduct) return false

                      if (filter1Val === 'curated' || pCat.startsWith('CURATED')) return false
                      if (filter1Val === 'audio' || ['ALPINE', 'RAINBOW', 'ADAMDIGITAL', 'CROSSFIRE'].includes(pCat)) return false

                      const isTailored = filter1Val === 'tailored' || pCat.startsWith('TAILORED') || filter1Val === 'silence' || !p.filter1
                      if (!isTailored) return false

                      // 严格隔离 3 大套餐等级，彻底杜绝混淆
                      let matchesTier = false
                      if (tierUpper === 'COMFORT') {
                        const hasComfort = pCat.includes('COMFORT') || pName.includes('COMFORT')
                        const hasMaxOrPro = pCat.includes('MAX') || pName.includes('MAX') || pCat.includes('PROMAX') || pName.includes('PROMAX')
                        matchesTier = hasComfort && !hasMaxOrPro
                      } else if (tierUpper === 'COMFORT MAX') {
                        const hasComfortMax = pCat.includes('COMFORT MAX') || pName.includes('COMFORT MAX') || (pCat.includes('COMFORT') && pCat.includes('MAX'))
                        const hasPro = pCat.includes('PROMAX') || pName.includes('PROMAX') || pCat.includes('ACOUSTIC') || pName.includes('ACOUSTIC')
                        matchesTier = hasComfortMax && !hasPro
                      } else if (tierUpper === 'ACOUSTIC PROMAX') {
                        matchesTier = pCat.includes('PROMAX') || pName.includes('PROMAX') || pCat.includes('ACOUSTIC') || pName.includes('ACOUSTIC')
                      }

                      const matchesCar = filterVal === carLower || filterVal.includes(carLower) || filter1Val === carLower || filter1Val.includes(carLower) || filterVal === 'all'
                      return matchesTier && matchesCar
                    })

                    const carProducts = [...matched].sort((a, b) => {
                      const orderA = (a.sort_order !== undefined && a.sort_order !== null && a.sort_order !== '') ? Number(a.sort_order) : 999999
                      const orderB = (b.sort_order !== undefined && b.sort_order !== null && b.sort_order !== '') ? Number(b.sort_order) : 999999
                      if (orderA !== orderB) return orderA - orderB
                      const dateA = new Date(a.date || 0).getTime()
                      const dateB = new Date(b.date || 0).getTime()
                      if (dateA !== dateB) return dateA - dateB
                      return (a.id || a.Id || 0) - (b.id || b.Id || 0)
                    })

                    return (
                      <div key={car} className="bg-[#fcfaf7] p-4 sm:p-5 rounded-2xl border-2 border-gray-200/80 shadow-2xs flex flex-col justify-between hover:border-[#1c5434]/30 transition-colors">
                        <div>
                          <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
                            <span className="text-sm font-black text-[#1c5434] uppercase tracking-wider">
                              {car}
                            </span>
                            <button
                              onClick={() => handleOpenProductModal('create', null, {
                                filter1: 'tailored',
                                custom_filter: `TAILORED - ${tailoredTier}`,
                                filter: carLower
                              })}
                              className="text-xs font-bold bg-[#1c5434] hover:bg-[#143e26] text-white px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <span>+ Add Part</span>
                            </button>
                          </div>

                          {/* Product Cards */}
                          <div className="space-y-3.5">
                            {carProducts.length > 0 ? (
                              <>
                                {carProducts.map((prod, idx) => {
                                  const isDragging = (draggedItem?.item?.id || draggedItem?.item?.Id) === (prod.id || prod.Id)
                                  const isOver = dragOverItemId === (prod.id || prod.Id)
                                  const listKey = `tailored-${tailoredTier}-${car}`

                                  return (
                                    <div
                                      key={`tailored-${tailoredTier}-${car}-${prod.id || prod.Id || idx}-${idx}`}
                                      draggable={true}
                                      onDragStart={(e) => handleDragStart(e, prod, listKey)}
                                      onDragOver={(e) => handleDragOver(e, prod)}
                                      onDragLeave={handleDragLeave}
                                      onDrop={(e) => handleDrop(e, prod, carProducts, listKey)}
                                      className={`bg-white p-3 rounded-xl border shadow-2xs group relative transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                                        isDragging
                                          ? 'opacity-35 scale-95 border-dashed border-[#1c5434] bg-green-50/20'
                                          : isOver
                                          ? 'border-2 border-[#1c5434] ring-2 ring-[#1c5434]/20 bg-green-50/50 -translate-y-1 shadow-md'
                                          : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                    >
                                      {/* Drag Handle 6-dots Icon */}
                                      <div className="absolute top-2 left-2 z-10 p-1 rounded bg-black/5 hover:bg-black/10 text-gray-500 hover:text-black transition-colors" title="Drag to reorder">
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                          <circle cx="9" cy="6" r="2" />
                                          <circle cx="15" cy="6" r="2" />
                                          <circle cx="9" cy="12" r="2" />
                                          <circle cx="15" cy="12" r="2" />
                                          <circle cx="9" cy="18" r="2" />
                                          <circle cx="15" cy="18" r="2" />
                                        </svg>
                                      </div>

                                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-gray-100 mb-2">
                                        <img src={prod.image || prod.Url} alt={prod.name || prod.Name} className="w-full h-full object-contain p-2 pointer-events-none" />
                                      </div>
                                      <div className="text-center">
                                        <h4 className="text-xs font-bold text-[#1c5434] uppercase truncate">{prod.name || prod.Name}</h4>
                                        <p className="text-xs font-extrabold text-gray-800 mt-0.5">RM {formatDisplayPrice(prod.price)}</p>
                                      </div>
                                    <div className="flex items-center justify-between gap-1 mt-2 pt-2 border-t border-gray-100">
                                      <div className="flex items-center gap-1">
                                        <button
                                          type="button"
                                          disabled={idx === 0}
                                          onClick={() => handleMoveProduct(carProducts, idx, 'up')}
                                          title="Move Up"
                                          className="w-6 h-6 rounded-md bg-gray-100 hover:bg-[#1c5434] hover:text-white disabled:opacity-25 disabled:hover:bg-gray-100 disabled:hover:text-gray-400 text-gray-700 font-bold text-[10px] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                                        >
                                          ▲
                                        </button>
                                        <button
                                          type="button"
                                          disabled={idx === carProducts.length - 1}
                                          onClick={() => handleMoveProduct(carProducts, idx, 'down')}
                                          title="Move Down"
                                          className="w-6 h-6 rounded-md bg-gray-100 hover:bg-[#1c5434] hover:text-white disabled:opacity-25 disabled:hover:bg-gray-100 disabled:hover:text-gray-400 text-gray-700 font-bold text-[10px] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                                        >
                                          ▼
                                        </button>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => handleOpenProductModal('edit', prod, {
                                            filter1: 'tailored',
                                            custom_filter: `TAILORED - ${tailoredTier}`,
                                            filter: carLower
                                          })}
                                          className="text-[11px] font-bold text-[#1c5434] hover:underline cursor-pointer"
                                        >
                                          Edit
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button
                                          onClick={() => handleDeleteProduct(prod.id || prod.Id)}
                                          className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}

                                <button
                                  onClick={() => handleOpenProductModal('create', null, {
                                    filter1: 'tailored',
                                    custom_filter: `TAILORED - ${tailoredTier}`,
                                    filter: carLower
                                  })}
                                  className="w-full py-2.5 px-3 border-2 border-dashed border-[#1c5434]/40 hover:border-[#1c5434] bg-white/80 hover:bg-[#1c5434]/5 text-[#1c5434] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                                >
                                  <span>+ Add Another Part</span>
                                </button>
                              </>
                            ) : (
                              <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white/60">
                                <p className="text-xs text-gray-400 font-semibold">No parts added</p>
                                <button
                                  onClick={() => handleOpenProductModal('create', null, {
                                    filter1: 'tailored',
                                    custom_filter: `TAILORED - ${tailoredTier}`,
                                    filter: carLower
                                  })}
                                  className="mt-2 text-xs font-bold text-[#1c5434] hover:underline cursor-pointer"
                                >
                                  + Click to Add Part
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sub-Tab 3: BASIC / STANDARD / PRO Packages */}
            {soundproofSubTab === 'packages' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200">
                <div className="pb-4 mb-6 border-b border-gray-100">
                  <h2 className="text-lg sm:text-xl font-black text-[#1c5434]">
                    Top Pricing Packages (BASIC / STANDARD / PRO)
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Directly change package prices (auto-saves on input) and upload/replace banners.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {TOP_PACKAGES.map(pkg => {
                    const bannerItem = getMatrixItem(pkg, 'BANNER')
                    const currentDesktop = bannerItem.image_url || DEFAULT_BANNERS[pkg]?.desktop
                    const currentMobile = bannerItem.mobile_image_url || DEFAULT_BANNERS[pkg]?.mobile

                    return (
                      <div key={pkg} className="bg-[#fcfaf7] border-2 border-gray-200/80 rounded-2xl p-5 flex flex-col justify-between hover:border-[#1c5434]/40 transition-colors">
                        <div>
                          <div className="bg-[#1c5434] text-white py-2.5 px-4 rounded-xl font-black text-center uppercase tracking-widest text-base shadow-xs mb-5">
                            {pkg}
                          </div>

                          {/* 4 Car Type Prices */}
                          <div className="space-y-2.5 mb-6">
                            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
                              Car Type Prices (RM)
                            </label>
                            {CAR_TYPES.map(car => {
                              const item = getMatrixItem(pkg, car)
                              return (
                                <div key={car} className="flex items-center justify-between bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-2xs">
                                  <span className="text-xs font-bold text-gray-700 uppercase">{car}</span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-gray-400">RM</span>
                                    <input
                                      type="text"
                                      defaultValue={item.price}
                                      key={`${pkg}-${car}-${item.price}`}
                                      onBlur={(e) => handleAutoSaveMatrixPrice(pkg, car, e.target.value)}
                                      placeholder="0"
                                      className="w-24 text-right font-extrabold text-xs text-[#1c5434] bg-transparent focus:outline-none border-b border-dashed border-gray-300 focus:border-[#1c5434]"
                                    />
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          {/* Banner Images Upload (Display Complete Photos) */}
                          <div className="space-y-4 pt-4 border-t border-gray-200">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-gray-700">Desktop Banner (16:9)</label>
                                <span className="text-[10px] text-gray-400">Auto-saved</span>
                              </div>
                              <div className="w-full rounded-xl overflow-hidden bg-white p-1.5 mb-2 relative group border border-gray-200 min-h-[120px] flex items-center justify-center">
                                {currentDesktop ? (
                                  <img src={currentDesktop} alt="Desktop banner" className="w-full h-auto max-h-[160px] object-contain rounded-lg" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 py-6">No Image</div>
                                )}
                                {uploadingKey === `${pkg}-BANNER-image_url` && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                                    Uploading...
                                  </div>
                                )}
                              </div>
                              <label className="block w-full py-2 px-3 bg-white border border-gray-300 hover:border-[#1c5434] text-gray-700 text-xs font-bold rounded-xl text-center cursor-pointer transition-colors shadow-2xs">
                                <span>Replace Desktop Banner</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleMatrixImageUpload(pkg, 'BANNER', 'image_url', e.target.files[0])}
                                />
                              </label>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-gray-700">Mobile Banner (Vertical)</label>
                                <span className="text-[10px] text-gray-400">Auto-saved</span>
                              </div>
                              <div className="w-full rounded-xl overflow-hidden bg-white p-1.5 mb-2 relative group border border-gray-200 min-h-[140px] flex items-center justify-center">
                                {currentMobile ? (
                                  <img src={currentMobile} alt="Mobile banner" className="w-auto h-auto max-h-[220px] object-contain rounded-lg mx-auto" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 py-6">No Image</div>
                                )}
                                {uploadingKey === `${pkg}-BANNER-mobile_image_url` && (
                                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                                    Uploading...
                                  </div>
                                )}
                              </div>
                              <label className="block w-full py-2 px-3 bg-white border border-gray-300 hover:border-[#1c5434] text-gray-700 text-xs font-bold rounded-xl text-center cursor-pointer transition-colors shadow-2xs">
                                <span>Replace Mobile Banner</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleMatrixImageUpload(pkg, 'BANNER', 'mobile_image_url', e.target.files[0])}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* SECTION 2: AUDIO SYSTEMS MANAGEMENT                          */}
        {/* ============================================================ */}
        {mainTab === 'audio' && (
          <div className="space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-100 gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-[#1c5434] flex items-center gap-2">
                    <span>AUDIO SYSTEMS</span>
                    <span className="text-xs bg-[#1c5434]/10 text-[#1c5434] px-2.5 py-0.5 rounded-full font-bold">
                      Brands & Products
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Manage speakers, DSPs, amplifiers, and accessories under ALPINE, RAINBOW, ADAMDIGITAL, and CROSSFIRE.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenProductModal('create', null, {
                    filter1: 'audio',
                    custom_filter: activeAudioBrand,
                    filter: 'all'
                  })}
                  className="px-5 py-2.5 bg-[#1c5434] hover:bg-[#143e26] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <span>+ Add Audio Product</span>
                </button>
              </div>

              {/* Brand Selector Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-8">
                {AUDIO_BRANDS.map(brand => {
                  const count = products.filter(p => {
                    const isMainProduct = !p.same || p.same === '' || String(p.id || p.Id) === String(p.same)
                    const isAudio = (p.filter1 || '').toLowerCase() === 'audio' || (p.custom_filter || '').toUpperCase() === brand
                    return isMainProduct && isAudio && (p.custom_filter || '').toUpperCase() === brand
                  }).length

                  return (
                    <button
                      key={brand}
                      onClick={() => setActiveAudioBrand(brand)}
                      className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                        activeAudioBrand === brand
                          ? 'bg-[#1c5434] text-white border-[#1c5434] shadow-sm font-black'
                          : 'bg-[#fcfaf7] text-gray-700 border-gray-200 hover:border-[#1c5434]/40 font-bold'
                      }`}
                    >
                      <div className="text-sm uppercase tracking-wider">{brand}</div>
                      <div className={`text-[11px] mt-0.5 ${activeAudioBrand === brand ? 'text-green-200' : 'text-gray-400'}`}>
                        {count} Products
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Product Grid */}
              {(() => {
                const brandProducts = products.filter(p => {
                  const isMainProduct = !p.same || p.same === '' || String(p.id || p.Id) === String(p.same)
                  const isAudio = (p.filter1 || '').toLowerCase() === 'audio' || (p.custom_filter || '').toUpperCase() === activeAudioBrand
                  return isMainProduct && isAudio && (p.custom_filter || '').toUpperCase() === activeAudioBrand
                }).sort((a, b) => {
                  const orderA = (a.sort_order !== undefined && a.sort_order !== null && a.sort_order !== '') ? Number(a.sort_order) : 999999
                  const orderB = (b.sort_order !== undefined && b.sort_order !== null && b.sort_order !== '') ? Number(b.sort_order) : 999999
                  if (orderA !== orderB) return orderA - orderB
                  const dateA = new Date(a.date || 0).getTime()
                  const dateB = new Date(b.date || 0).getTime()
                  if (dateA !== dateB) return dateA - dateB
                  return (a.id || a.Id || 0) - (b.id || b.Id || 0)
                })

                if (brandProducts.length > 0) {
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                      {brandProducts.map((prod, idx) => {
                        const isDragging = (draggedItem?.item?.id || draggedItem?.item?.Id) === (prod.id || prod.Id)
                        const isOver = dragOverItemId === (prod.id || prod.Id)
                        const listKey = `audio-${activeAudioBrand}`

                        return (
                          <div
                            key={`audio-${activeAudioBrand}-${prod.id || prod.Id || idx}-${idx}`}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, prod, listKey)}
                            onDragOver={(e) => handleDragOver(e, prod)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, prod, brandProducts, listKey)}
                            className={`bg-[#fcfaf7] p-4 rounded-2xl border shadow-2xs group relative flex flex-col justify-between transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                              isDragging
                                ? 'opacity-35 scale-95 border-dashed border-[#1c5434] bg-green-50/20'
                                : isOver
                                ? 'border-2 border-[#1c5434] ring-2 ring-[#1c5434]/20 bg-green-50/50 -translate-y-1 shadow-md'
                                : 'border-gray-200 hover:border-[#1c5434]/40'
                            }`}
                          >
                            {/* Drag Handle 6-dots Icon */}
                            <div className="absolute top-2 left-2 z-10 p-1 rounded bg-black/5 hover:bg-black/10 text-gray-500 hover:text-black transition-colors" title="Drag to reorder">
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="9" cy="6" r="2" />
                                <circle cx="15" cy="6" r="2" />
                                <circle cx="9" cy="12" r="2" />
                                <circle cx="15" cy="12" r="2" />
                                <circle cx="9" cy="18" r="2" />
                                <circle cx="15" cy="18" r="2" />
                              </svg>
                            </div>

                            <div>
                              <div className="aspect-square w-full rounded-xl overflow-hidden bg-white p-3 border border-gray-100 mb-3 flex items-center justify-center">
                                <img src={prod.image || prod.Url} alt={prod.name || prod.Name} className="w-full h-full object-contain pointer-events-none" />
                              </div>
                              <h4 className="text-sm font-extrabold text-[#1c5434] uppercase tracking-wide line-clamp-1">{prod.name || prod.Name}</h4>
                              <p className="text-xs font-extrabold text-gray-700 mt-1">RM {formatDisplayPrice(prod.price)}</p>
                            </div>

                          <div className="flex items-center justify-between gap-1 mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveProduct(brandProducts, idx, 'up')}
                                title="Move Up"
                                className="w-6 h-6 rounded-md bg-gray-100 hover:bg-[#1c5434] hover:text-white disabled:opacity-25 disabled:hover:bg-gray-100 disabled:hover:text-gray-400 text-gray-700 font-bold text-[10px] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={idx === brandProducts.length - 1}
                                onClick={() => handleMoveProduct(brandProducts, idx, 'down')}
                                title="Move Down"
                                className="w-6 h-6 rounded-md bg-gray-100 hover:bg-[#1c5434] hover:text-white disabled:opacity-25 disabled:hover:bg-gray-100 disabled:hover:text-gray-400 text-gray-700 font-bold text-[10px] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                              >
                                ▼
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenProductModal('edit', prod, {
                                  filter1: 'audio',
                                  custom_filter: activeAudioBrand,
                                  filter: 'all'
                                })}
                                className="text-xs font-bold text-[#1c5434] hover:underline cursor-pointer"
                              >
                                Edit
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() => handleDeleteProduct(prod.id || prod.Id)}
                                className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                      {/* Add Another Card */}
                      <button
                        onClick={() => handleOpenProductModal('create', null, {
                          filter1: 'audio',
                          custom_filter: activeAudioBrand,
                          filter: 'all'
                        })}
                        className="min-h-[220px] rounded-2xl border-2 border-dashed border-[#1c5434]/30 hover:border-[#1c5434] bg-white/60 hover:bg-[#1c5434]/5 flex flex-col items-center justify-center p-6 text-center transition-all cursor-pointer group"
                      >
                        <span className="text-3xl text-[#1c5434] font-black group-hover:scale-125 transition-transform mb-1">+</span>
                        <span className="text-xs font-bold text-[#1c5434]">Add Another Product for {activeAudioBrand}</span>
                      </button>
                    </div>
                  )
                }

                return (
                  <div className="py-16 text-center border-2 border-dashed border-[#1c5434]/20 rounded-3xl bg-[#fcfaf7] max-w-lg mx-auto p-8">
                    <p className="text-base font-black text-gray-700">No products under {activeAudioBrand}</p>
                    <p className="text-xs text-gray-400 mt-1 mb-5">Click below to add the first product for this brand.</p>
                    <button
                      onClick={() => handleOpenProductModal('create', null, {
                        filter1: 'audio',
                        custom_filter: activeAudioBrand,
                        filter: 'all'
                      })}
                      className="px-6 py-2.5 bg-[#1c5434] hover:bg-[#143e26] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>+ Add First {activeAudioBrand} Product</span>
                    </button>
                  </div>
                )
              })()}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* ADD / EDIT PRODUCT MODAL                                      */}
      {/* ============================================================ */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#fcfaf7]">
              <div>
                <h3 className="text-base font-black text-[#1c5434]">
                  {modalMode === 'create' ? 'Add New Product / Solution' : 'Edit Product / Solution'}
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {modalForm.filter1 === 'audio' ? `Brand: ${modalForm.custom_filter}` : `Tier: ${modalForm.custom_filter} | Car: ${modalForm.filter.toUpperCase()}`}
                </p>
              </div>

              <button
                onClick={() => setShowProductModal(false)}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Sub-Tab Selector */}
            <div className="flex border-b border-gray-100 bg-[#f8f6f0] px-6 pt-2">
              <button
                type="button"
                onClick={() => setModalTab('basic')}
                className={`pb-2.5 px-4 font-bold text-xs border-b-2 transition-colors cursor-pointer ${
                  modalTab === 'basic'
                    ? 'border-[#1c5434] text-[#1c5434]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                1. Basic Info & Main Photo
              </button>
              <button
                type="button"
                onClick={() => setModalTab('gallery')}
                className={`pb-2.5 px-4 font-bold text-xs border-b-2 transition-colors cursor-pointer ${
                  modalTab === 'gallery'
                    ? 'border-[#1c5434] text-[#1c5434]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                2. Extra Gallery & Specs (Optional)
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProductModal}>
              <div className="p-6 space-y-4 max-h-[68vh] overflow-y-auto">
                {modalTab === 'basic' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Product / Solution Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={modalForm.Name}
                        onChange={(e) => setModalForm(prev => ({ ...prev, Name: e.target.value }))}
                        placeholder="e.g. Full Door Soundproofing Package"
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#1c5434] focus:bg-white"
                      />
                    </div>

                    {modalForm.filter1 === 'audio' ? (
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                          Price (RM)
                        </label>
                        <input
                          type="text"
                          value={modalForm.price}
                          onChange={(e) => setModalForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="e.g. 580"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#1c5434] focus:bg-white"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Price (RM)
                          </label>
                          <input
                            type="text"
                            value={modalForm.price}
                            onChange={(e) => setModalForm(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="e.g. 580"
                            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#1c5434] focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1.5">
                            Vehicle / Scope Type
                          </label>
                          <select
                            value={modalForm.filter}
                            onChange={(e) => setModalForm(prev => ({ ...prev, filter: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#1c5434] focus:bg-white"
                          >
                            <option value="all">Universal / All</option>
                            <option value="hatchback">Hatchback</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="mpv">MPV</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Main Image Upload */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Main Image (1:1 Square) *
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                          {modalFile ? (
                            <img src={URL.createObjectURL(modalFile)} alt="Preview" className="w-full h-full object-cover" />
                          ) : modalForm.Url ? (
                            <img src={modalForm.Url} alt="Current" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-gray-400 text-center px-1">No Image</span>
                          )}
                        </div>

                        <label className="flex-1 py-3 px-4 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 hover:border-[#1c5434] rounded-xl text-center cursor-pointer transition-colors">
                          <span className="text-xs font-bold text-[#1c5434]">
                            {modalFile ? 'Change Selected Photo' : 'Select Main Image (1:1)'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setModalFile(e.target.files[0])
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {modalTab === 'gallery' && (
                  <>
                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Product Description
                      </label>
                      <textarea
                        rows={3}
                        value={modalForm.description}
                        onChange={(e) => setModalForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed product introduction..."
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1c5434] focus:bg-white resize-none"
                      />
                    </div>

                    {/* Specifications */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Specifications (Tech Specs)
                      </label>
                      <textarea
                        rows={2}
                        value={modalForm.Specifications}
                        onChange={(e) => setModalForm(prev => ({ ...prev, Specifications: e.target.value }))}
                        placeholder="Key technical specifications..."
                        className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#1c5434] focus:bg-white resize-none"
                      />
                    </div>

                    {/* Additional Gallery Photos */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Additional Gallery Photos (Product Detail Gallery)
                      </label>

                      {/* Existing extra images */}
                      {existingExtraImages.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
                          {existingExtraImages.map((img) => (
                            <div key={img.Id} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-300 bg-white group">
                              <img src={img.Url} alt="Extra" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleDeleteExistingExtraImage(img.Id)}
                                className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold cursor-pointer opacity-80 hover:opacity-100"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* New extra files selected */}
                      {newExtraFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-green-50 rounded-xl border border-green-200">
                          {newExtraFiles.map((file, idx) => (
                            <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-green-300 bg-white group">
                              <img src={URL.createObjectURL(file)} alt="New extra" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setNewExtraFiles(prev => prev.filter((_, i) => i !== idx))}
                                className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <label className="block w-full py-2.5 px-3 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 hover:border-[#1c5434] text-[#1c5434] text-xs font-bold rounded-xl text-center cursor-pointer transition-colors">
                        <span>+ Select Multiple Additional Photos</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files) {
                              setNewExtraFiles(prev => [...prev, ...Array.from(e.target.files)])
                            }
                          }}
                        />
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-[#fcfaf7]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isModalSaving}
                  className="px-6 py-2.5 bg-[#1c5434] hover:bg-[#143e26] text-white font-bold text-xs rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isModalSaving ? (
                    <span>Saving...</span>
                  ) : (
                    <span>{modalMode === 'create' ? 'Save & Create' : 'Save Changes'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
