'use client'

import { useState, useEffect, useRef } from 'react'
import { uploadAdminImage } from '@/lib/imageCompressor'

export default function LynoAdminManager() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [screenSizes, setScreenSizes] = useState([])
  const [productOptions, setProductOptions] = useState({})
  const [productDetails, setProductDetails] = useState({})
  
  // Selection states
  const [activeScreenId, setActiveScreenId] = useState('12.8')
  const [activeModelId, setActiveModelId] = useState(null)

  // Current editing model form state
  const [editModelName, setEditModelName] = useState('')
  const [editSpecs, setEditSpecs] = useState('')
  const [editProductImage, setEditProductImage] = useState('')
  const [editDetails, setEditDetails] = useState([]) // array of { key, value }
  const [specSearch, setSpecSearch] = useState('')

  // Screen modal states
  const [screenModalOpen, setScreenModalOpen] = useState(false)
  const [screenModalMode, setScreenModalMode] = useState('edit') // 'edit' or 'add'
  const [modalScreenId, setModalScreenId] = useState('')
  const [modalScreenName, setModalScreenName] = useState('')
  const [modalScreenImage, setModalScreenImage] = useState('')
  const [uploadingScreenImg, setUploadingScreenImg] = useState(false)
  const [uploadingProductImg, setUploadingProductImg] = useState(false)

  // Add Model Modal states
  const [addModelModalOpen, setAddModelModalOpen] = useState(false)
  const [newModelName, setNewModelName] = useState('')
  const [newModelSpecs, setNewModelSpecs] = useState('')
  const [newModelImage, setNewModelImage] = useState('')
  const [uploadingNewModelImg, setUploadingNewModelImg] = useState(false)

  // Custom Confirmation Modal states
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: null
  })

  // Toast notification
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' })

  const screenFileInputRef = useRef(null)
  const productFileInputRef = useRef(null)
  const newModelFileInputRef = useRef(null)

  const showToast = (type, message) => {
    setToast({ show: true, type, message })
    setTimeout(() => {
      setToast({ show: false, type: 'success', message: '' })
    }, 3500)
  }

  // Fetch Lyno data from DB
  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/lyno-products')
      const data = await res.json()
      if (data.success) {
        setScreenSizes(data.screenSizes || [])
        setProductOptions(data.productOptions || {})
        setProductDetails(data.productDetails || {})

        const screens = data.screenSizes || []
        const currentScreen = screens.find(s => s.id === activeScreenId) || screens[0]
        if (currentScreen) {
          setActiveScreenId(currentScreen.id)
          const models = (data.productOptions || {})[currentScreen.id] || []
          if (models.length > 0) {
            const activeModel = models.find(m => m.id === activeModelId)
            const targetModelId = activeModel ? activeModelId : models[0].id
            loadModelIntoForm(targetModelId, data.productDetails || {})
          }
        }
      } else {
        showToast('error', data.error || 'Failed to fetch LYNO products')
      }
    } catch (err) {
      console.error('Error fetching LYNO data:', err)
      showToast('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Load a model's details into the editing state
  const loadModelIntoForm = (modelId, detailsMap = productDetails) => {
    setActiveModelId(modelId)
    const item = detailsMap[modelId]
    if (item) {
      setEditModelName(item.name || '')
      setEditSpecs(item.specs || '')
      setEditProductImage(item.image || '')

      const rawDetails = item.details || {}
      const detailsArr = Object.entries(rawDetails).map(([key, value]) => ({
        key,
        value: typeof value === 'string' ? value : JSON.stringify(value)
      }))
      setEditDetails(detailsArr)
    } else {
      setEditModelName('')
      setEditSpecs('')
      setEditProductImage('')
      setEditDetails([])
    }
  }

  // When changing screen size tab
  const handleSelectScreen = (screenId) => {
    setActiveScreenId(screenId)
    const models = productOptions[screenId] || []
    if (models.length > 0) {
      loadModelIntoForm(models[0].id)
    } else {
      setActiveModelId(null)
      setEditModelName('')
      setEditSpecs('')
      setEditProductImage('')
      setEditDetails([])
    }
  }

  // Upload image handler to Cloudflare R2
  const handleUploadImage = async (file, type) => {
    if (!file) return

    try {
      if (type === 'screen') setUploadingScreenImg(true)
      if (type === 'product') setUploadingProductImg(true)
      if (type === 'newModel') setUploadingNewModelImg(true)

      const data = await uploadAdminImage(file)
      if (data.url || data.secure_url) {
        const uploadedUrl = data.url || data.secure_url
        if (type === 'screen') {
          setModalScreenImage(uploadedUrl)
        } else if (type === 'product') {
          setEditProductImage(uploadedUrl)
        } else if (type === 'newModel') {
          setNewModelImage(uploadedUrl)
        }
        showToast('success', 'Image uploaded successfully!')
      } else {
        showToast('error', data.error || 'Failed to upload image')
      }
    } catch (err) {
      showToast('error', err.message)
    } finally {
      if (type === 'screen') setUploadingScreenImg(false)
      if (type === 'product') setUploadingProductImg(false)
      if (type === 'newModel') setUploadingNewModelImg(false)
    }
  }

  // Spec table handlers
  const handleAddSpecRow = () => {
    setEditDetails([...editDetails, { key: '', value: '' }])
  }

  const handleUpdateSpecKey = (index, newKey) => {
    const next = [...editDetails]
    next[index].key = newKey
    setEditDetails(next)
  }

  const handleUpdateSpecValue = (index, newValue) => {
    const next = [...editDetails]
    next[index].value = newValue
    setEditDetails(next)
  }

  const handleDeleteSpecRow = (index) => {
    const next = editDetails.filter((_, i) => i !== index)
    setEditDetails(next)
  }

  // Load 22 standard spec keys as optional helper template
  const handleLoadDefaultTemplate = () => {
    const template = [
      { key: 'CPU', value: '8-Core UIS7870 A76 2.7GHz (6nm)' },
      { key: 'RAM+ROM', value: editSpecs || '8GB+128GB' },
      { key: 'Storage', value: 'UFS (Up to 1700MB/s R, 128GB+)' },
      { key: 'GPS', value: 'Dual Band 7 mode (L1 L5 B1 B2a E1 G1 E5a)' },
      { key: 'MIC', value: 'Digital Noise Cancelling MIC' },
      { key: 'USB', value: 'USB 3.2 Gen1 (Type-C) + USB 2.0 ×3' },
      { key: 'Audio Chip', value: 'AKM7739 (DSP, VELVET Audio Technology)' },
      { key: 'Power Amplifier', value: 'TDA7808 Digital Enhanced Class AB Power Amplifier' },
      { key: 'Amplifier Output', value: '5532 ×3 (Enhanced Audio Signal)' },
      { key: 'Filter Capacitance', value: '10000μF' },
      { key: 'Radio', value: 'TDA7708 FM/AM' },
      { key: 'Audio Output', value: 'Optical + Coaxial + USB DAC + RCA5.1' },
      { key: 'Bluetooth', value: 'Qualcomm 3031 (BT 5.0, aptX HD)' },
      { key: 'System Mode', value: 'Simplified + Enthusiast Mode\n(supports 3D car models, dynamic wallpaper)' },
      { key: 'System', value: 'DXPRO OS' },
      { key: 'Android Version', value: '13 (API=33)' },
      { key: 'Screen', value: `${activeScreenId}" HD Display` },
      { key: 'CarPlay/Android Auto', value: 'Wired + Wireless' },
      { key: 'Network', value: '4G LTE external card slot + Wi-Fi' },
      { key: 'Front & Rear Recording', value: 'Supported' },
      { key: '360° Panorama', value: 'Supported\n(requires 360 camera)' },
      { key: 'Voice Control', value: 'Built-in support' }
    ]
    setEditDetails(template)
    showToast('success', 'Loaded standard 22 specification keys!')
  }

  // Save current model & specs
  const handleSaveModel = async () => {
    if (!activeModelId) return
    try {
      setSaving(true)
      const currentItem = productDetails[activeModelId]
      const currentScreen = screenSizes.find(s => s.id === activeScreenId)

      // Convert details array back to object
      const detailsObj = {}
      editDetails.forEach(row => {
        if (row.key && row.key.trim() !== '') {
          detailsObj[row.key.trim()] = row.value
        }
      })

      const payload = {
        action: 'save_product',
        id: currentItem?.db_id,
        screen_id: activeScreenId,
        screen_name: currentScreen?.name || `${activeScreenId} INCH`,
        screen_image: currentScreen?.image || '',
        model_id: activeModelId,
        model_name: editModelName,
        specs: editSpecs,
        product_image: editProductImage,
        details: detailsObj,
        sort_order: currentItem?.sort_order || 10
      }

      const res = await fetch('/api/admin/lyno-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        showToast('success', 'Model & specifications saved successfully!')
        await fetchData()
      } else {
        showToast('error', data.error || 'Failed to save product')
      }
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  // Open custom Add Model Modal
  const handleOpenAddModelModal = () => {
    setNewModelName('')
    setNewModelSpecs('')
    setNewModelImage('')
    setAddModelModalOpen(true)
  }

  // Submit custom Add Model
  const handleSubmitNewModel = async () => {
    if (!newModelName || !newModelName.trim()) {
      showToast('error', 'Please enter a Model Name')
      return
    }

    const currentScreen = screenSizes.find(s => s.id === activeScreenId)
    const newModelId = `model-${activeScreenId}-${Date.now()}`

    try {
      setSaving(true)
      const payload = {
        action: 'save_product',
        screen_id: activeScreenId,
        screen_name: currentScreen?.name || `${activeScreenId} INCH`,
        screen_image: currentScreen?.image || '',
        model_id: newModelId,
        model_name: newModelName.trim(),
        specs: newModelSpecs.trim(),
        product_image: newModelImage || '',
        details: {}, // 干净空白
        sort_order: ((productOptions[activeScreenId] || []).length + 1) * 10
      }

      const res = await fetch('/api/admin/lyno-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        showToast('success', `Created new model "${newModelName}"!`)
        setAddModelModalOpen(false)
        await fetchData()
        setActiveModelId(newModelId)
      } else {
        showToast('error', data.error || 'Failed to create model')
      }
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  // Delete current model with custom confirm modal
  const handleDeleteModel = () => {
    if (!activeModelId) return
    const currentItem = productDetails[activeModelId]

    setConfirmModal({
      open: true,
      title: 'Delete Product Model',
      message: `Are you sure you want to delete model "${editModelName || activeModelId}"? This will permanently remove its specifications and product photo.`,
      confirmText: 'Delete Model',
      onConfirm: async () => {
        try {
          setSaving(true)
          const res = await fetch('/api/admin/lyno-products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'delete_product',
              id: currentItem?.db_id
            })
          })
          const data = await res.json()
          if (data.success) {
            showToast('success', 'Model deleted successfully!')
            setConfirmModal(prev => ({ ...prev, open: false }))
            await fetchData()
          } else {
            showToast('error', data.error || 'Failed to delete model')
          }
        } catch (err) {
          showToast('error', err.message)
        } finally {
          setSaving(false)
        }
      }
    })
  }

  // Screen modal open for Edit / Add
  const handleOpenScreenModal = (mode, screen = null) => {
    setScreenModalMode(mode)
    if (mode === 'edit' && screen) {
      setModalScreenId(screen.id)
      setModalScreenName(screen.name || `${screen.id} INCH`)
      setModalScreenImage(screen.image || '')
    } else {
      setModalScreenId('')
      setModalScreenName('')
      setModalScreenImage('')
    }
    setScreenModalOpen(true)
  }

  // Save Screen Size modal
  const handleSaveScreenModal = async () => {
    if (!modalScreenName || !modalScreenName.trim()) {
      showToast('error', 'Please enter a Screen Name')
      return
    }

    try {
      setSaving(true)
      let payload = {}
      if (screenModalMode === 'edit') {
        payload = {
          action: 'update_screen',
          screen_id: modalScreenId,
          screen_name: modalScreenName.trim(),
          screen_image: modalScreenImage
        }
      } else {
        const generatedId = modalScreenId.trim() || modalScreenName.replace(/[^0-9.]/g, '') || `screen-${Date.now()}`
        payload = {
          action: 'add_screen',
          screen_id: generatedId,
          screen_name: modalScreenName.trim(),
          screen_image: modalScreenImage
        }
      }

      const res = await fetch('/api/admin/lyno-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        showToast('success', screenModalMode === 'edit' ? 'Screen size updated!' : 'New screen size added!')
        setScreenModalOpen(false)
        await fetchData()
      } else {
        showToast('error', data.error || 'Failed to save screen')
      }
    } catch (err) {
      showToast('error', err.message)
    } finally {
      setSaving(false)
    }
  }

  // Delete Screen Size with custom confirm modal
  const handleDeleteScreen = (screenId, screenName) => {
    setConfirmModal({
      open: true,
      title: 'Delete Screen Size',
      message: `Are you sure you want to delete screen "${screenName}" and all its configured models? All associated photos and specifications will be permanently removed.`,
      confirmText: 'Delete Entire Screen',
      onConfirm: async () => {
        try {
          setSaving(true)
          const res = await fetch('/api/admin/lyno-products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'delete_screen',
              screen_id: screenId
            })
          })
          const data = await res.json()
          if (data.success) {
            showToast('success', `Deleted screen size "${screenName}"!`)
            setConfirmModal(prev => ({ ...prev, open: false }))
            await fetchData()
          } else {
            showToast('error', data.error || 'Failed to delete screen')
          }
        } catch (err) {
          showToast('error', err.message)
        } finally {
          setSaving(false)
        }
      }
    })
  }

  const currentModels = productOptions[activeScreenId] || []
  const activeScreen = screenSizes.find(s => s.id === activeScreenId)

  // Filtered spec rows by search keyword
  const filteredSpecs = editDetails.filter(item => {
    if (!specSearch.trim()) return true
    const term = specSearch.toLowerCase()
    return item.key.toLowerCase().includes(term) || item.value.toLowerCase().includes(term)
  })

  return (
    <div className="min-h-screen bg-[#fcfaf7] p-4 sm:p-8 font-sans pb-36">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 transition-all transform duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-[#1c5434] text-white'
        }`}>
          <span className="font-extrabold text-sm">{toast.type === 'error' ? '✕ Error' : '✓ Success'}</span>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-[#1c5434] uppercase tracking-tight">
                LYNO Product Management
              </span>
              <span className="text-xs bg-[#1c5434]/10 text-[#1c5434] px-3 py-1 rounded-full font-extrabold">
                Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Select a screen size, pick a model, and easily update photos, titles, memory specs, or technical attributes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenScreenModal('add')}
              className="px-4 py-2.5 bg-[#1c5434] hover:bg-[#143e26] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>+ Add Screen Size</span>
            </button>
          </div>
        </div>

        {/* 1. Streamlined Screen Size Tabs */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Screen Sizes ({screenSizes.length})
            </span>
          </div>

          {loading ? (
            <div className="py-6 text-center text-gray-400 font-bold text-sm">Loading screen sizes...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {screenSizes.map((screen) => {
                const isActive = activeScreenId === screen.id
                const modelCount = (productOptions[screen.id] || []).length

                return (
                  <div
                    key={screen.id}
                    onClick={() => handleSelectScreen(screen.id)}
                    className={`relative p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                      isActive
                        ? 'border-[#1c5434] bg-[#1c5434]/5 shadow-sm'
                        : 'border-gray-200/80 bg-[#fcfaf7] hover:border-gray-300'
                    }`}
                  >
                    {/* Screen Thumbnail Image */}
                    <div className="aspect-16/9 w-full rounded-xl overflow-hidden bg-white p-2 border border-gray-100 flex items-center justify-center mb-2">
                      {screen.image ? (
                        <img
                          src={screen.image}
                          alt={screen.name}
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
                    </div>

                    {/* Title & Count */}
                    <div className="text-center">
                      <div className={`text-xs font-black uppercase ${isActive ? 'text-[#1c5434]' : 'text-gray-800'}`}>
                        {screen.name}
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium">
                        {modelCount} Model{modelCount !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {/* Screen Actions */}
                    <div className="flex items-center justify-center gap-3 mt-2 pt-2 border-t border-gray-200/60 text-[11px]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenScreenModal('edit', screen)
                        }}
                        className="font-bold text-[#1c5434] hover:underline cursor-pointer"
                      >
                        Edit
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteScreen(screen.id, screen.name)
                        }}
                        className="font-bold text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 2. Model Selector & Workspace for Active Screen */}
        {activeScreen && (
          <div className="space-y-6">
            {/* Model Pills Switcher */}
            <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-black text-gray-400 uppercase tracking-wider whitespace-nowrap mr-2">
                  Models for {activeScreen.name}:
                </span>
                {currentModels.map((model) => {
                  const isSelected = activeModelId === model.id
                  return (
                    <button
                      key={model.id}
                      onClick={() => loadModelIntoForm(model.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#1c5434] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{model.name || 'Unnamed'}</span>
                      {model.specs && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {model.specs}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={handleOpenAddModelModal}
                className="px-3.5 py-2 border-2 border-dashed border-[#1c5434]/40 hover:border-[#1c5434] text-[#1c5434] font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap self-start sm:self-auto cursor-pointer"
              >
                <span>+ Add Model</span>
              </button>
            </div>

            {/* 3. Main Workspace Grid: Left Model Info & Image | Right Technical Specs */}
            {activeModelId ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (5 Cols): Showcase Photo & Model Identity */}
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
                  <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase">
                      1. Product Showcase Photo
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      The large product screen mockup displayed on the left side.
                    </p>
                  </div>

                  {/* Photo Preview & Replace */}
                  <div className="space-y-3">
                    <div className="aspect-16/10 w-full rounded-2xl overflow-hidden bg-gray-50 border-2 border-gray-200/80 flex items-center justify-center p-3 relative group">
                      {editProductImage ? (
                        <img
                          src={editProductImage}
                          alt={editModelName}
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <span className="text-2xl block mb-1">🖼️</span>
                          <span className="text-xs text-gray-400 font-bold">No Showcase Photo Uploaded</span>
                        </div>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={productFileInputRef}
                      onChange={(e) => handleUploadImage(e.target.files[0], 'product')}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => productFileInputRef.current?.click()}
                      disabled={uploadingProductImg}
                      className="w-full py-2.5 px-4 bg-[#1c5434]/10 hover:bg-[#1c5434]/20 text-[#1c5434] rounded-xl text-xs font-extrabold transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      <span>{uploadingProductImg ? 'Uploading photo...' : '📁 Upload / Replace Product Photo'}</span>
                    </button>
                  </div>

                  {/* Model Name & Specs Subtitle */}
                  <div className="pt-4 border-t border-gray-100 space-y-4">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase">
                        2. Model Identity
                      </h3>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase">Model Title</label>
                      <input
                        type="text"
                        value={editModelName}
                        onChange={(e) => setEditModelName(e.target.value)}
                        placeholder="e.g. LYNO Quantum Pro Max"
                        className="w-full mt-1.5 p-3 text-sm font-extrabold text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1c5434] bg-[#fcfaf7]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-700 uppercase">RAM + ROM Specification Badge</label>
                      <input
                        type="text"
                        value={editSpecs}
                        onChange={(e) => setEditSpecs(e.target.value)}
                        placeholder="e.g. 12GB+256GB"
                        className="w-full mt-1.5 p-3 text-sm font-bold text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1c5434] bg-[#fcfaf7]"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleDeleteModel}
                        disabled={saving}
                        className="w-full py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer border border-red-200"
                      >
                        Delete This Model Tier
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column (7 Cols): Specifications Table Editor */}
                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase">
                        3. Technical Specifications Table
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {editDetails.length} specification attributes configured.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {editDetails.length === 0 && (
                        <button
                          type="button"
                          onClick={handleLoadDefaultTemplate}
                          className="px-3 py-1.5 bg-[#1c5434]/10 hover:bg-[#1c5434]/20 text-[#1c5434] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          <span>📋 Load Standard 22 Keys</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleAddSpecRow}
                        className="px-3.5 py-1.5 bg-[#1c5434] hover:bg-[#143e26] text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>+ Add Row</span>
                      </button>
                    </div>
                  </div>

                  {/* Search Filter for Specs */}
                  {editDetails.length > 5 && (
                    <div>
                      <input
                        type="text"
                        value={specSearch}
                        onChange={(e) => setSpecSearch(e.target.value)}
                        placeholder="🔍 Search specifications (e.g. CPU, Bluetooth, Audio)..."
                        className="w-full p-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#1c5434] bg-[#fcfaf7]"
                      />
                    </div>
                  )}

                  {/* Spec Rows */}
                  <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
                    {filteredSpecs.length > 0 ? (
                      filteredSpecs.map((row, index) => (
                        <div key={index} className="flex items-start gap-2.5 p-2 rounded-xl border border-gray-200/80 bg-[#fcfaf7] hover:border-gray-300 transition-colors">
                          <div className="w-1/3 min-w-[120px]">
                            <input
                              type="text"
                              value={row.key}
                              onChange={(e) => handleUpdateSpecKey(index, e.target.value)}
                              placeholder="Key (e.g. CPU)"
                              className="w-full p-2 text-xs font-black text-gray-800 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1c5434] bg-white"
                            />
                          </div>

                          <div className="flex-1">
                            <textarea
                              rows={1}
                              value={row.value}
                              onChange={(e) => handleUpdateSpecValue(index, e.target.value)}
                              placeholder="Value (e.g. 8-Core UIS7870)"
                              className="w-full p-2 text-xs font-medium text-gray-700 rounded-lg border border-gray-200 focus:outline-none focus:border-[#1c5434] bg-white resize-y min-h-[38px]"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteSpecRow(index)}
                            title="Delete Attribute"
                            className="w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center cursor-pointer font-bold shrink-0 mt-0.5"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : editDetails.length === 0 ? (
                      <div className="py-12 text-center bg-[#fcfaf7] rounded-2xl border-2 border-dashed border-gray-200 p-6 space-y-3">
                        <p className="text-xs sm:text-sm text-gray-500 font-bold">
                          This model has no technical specifications yet.
                        </p>
                        <div className="flex items-center justify-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={handleAddSpecRow}
                            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-2xs"
                          >
                            + Add Custom Row
                          </button>
                          <button
                            type="button"
                            onClick={handleLoadDefaultTemplate}
                            className="px-4 py-2 bg-[#1c5434] hover:bg-[#143e26] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                          >
                            📋 Load 22 Standard Keys
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-gray-400 font-bold">
                        No specifications matching &quot;{specSearch}&quot;
                      </div>
                    )}
                  </div>

                  {editDetails.length > 0 && (
                    <button
                      type="button"
                      onClick={handleAddSpecRow}
                      className="w-full py-2.5 border-2 border-dashed border-[#1c5434]/30 hover:border-[#1c5434] text-[#1c5434] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer bg-white"
                    >
                      <span>+ Add Another Row</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 shadow-xs">
                <p className="text-sm font-bold text-gray-500">No models added for {activeScreen.name}</p>
                <button
                  onClick={handleOpenAddModelModal}
                  className="mt-3 px-5 py-2.5 bg-[#1c5434] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  + Add First Model
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Sticky Action Bar */}
      {activeModelId && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 py-3.5 px-6 shadow-xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-700 hidden sm:inline">
                Editing: <span className="text-[#1c5434] font-black">{activeScreen?.name} — {editModelName || 'Model'}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveModel}
                disabled={saving}
                className="px-8 py-3 bg-[#1c5434] hover:bg-[#143e26] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-all transform active:scale-95 cursor-pointer flex items-center gap-2"
              >
                <span>{saving ? 'Saving...' : '💾 Save Changes to Database'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. Custom Add Product Model Modal */}
      {addModelModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 uppercase">
                Add New Product Model
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Create a new product tier under {activeScreen?.name}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Model Title</label>
                <input
                  type="text"
                  value={newModelName}
                  onChange={(e) => setNewModelName(e.target.value)}
                  placeholder="e.g. LYNO Quantum Ultra"
                  className="w-full mt-1.5 p-3 text-sm font-bold text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1c5434] bg-[#fcfaf7]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">RAM + ROM Specs</label>
                <input
                  type="text"
                  value={newModelSpecs}
                  onChange={(e) => setNewModelSpecs(e.target.value)}
                  placeholder="e.g. 16GB+512GB"
                  className="w-full mt-1.5 p-3 text-sm font-bold text-gray-800 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1c5434] bg-[#fcfaf7]"
                />
              </div>

              {/* Showcase Image Upload */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Product Showcase Photo</label>
                
                <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-gray-50 border-2 border-gray-200 flex items-center justify-center p-2 mt-1.5 mb-2">
                  {newModelImage ? (
                    <img
                      src={newModelImage}
                      alt="New Model Preview"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <span className="text-xs text-gray-400 font-semibold">No Image</span>
                  )}
                </div>

                <input
                  type="file"
                  ref={newModelFileInputRef}
                  onChange={(e) => handleUploadImage(e.target.files[0], 'newModel')}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => newModelFileInputRef.current?.click()}
                  disabled={uploadingNewModelImg}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-center"
                >
                  {uploadingNewModelImg ? 'Uploading photo...' : '📁 Upload Product Photo'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setAddModelModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitNewModel}
                disabled={saving || uploadingNewModelImg}
                className="px-6 py-2.5 bg-[#1c5434] hover:bg-[#143e26] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                {saving ? 'Creating...' : 'Create Model'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Custom Screen Size Add/Edit Modal */}
      {screenModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 uppercase">
                {screenModalMode === 'edit' ? 'Edit Screen Size' : 'Add New Screen Size'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Customize the screen title and thumbnail photo shown in the top navigation grid.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Screen Name (Display Title)</label>
                <input
                  type="text"
                  value={modalScreenName}
                  onChange={(e) => setModalScreenName(e.target.value)}
                  placeholder="e.g. 12.8 INCH or 13.3 INCH"
                  className="w-full mt-1.5 p-3 text-sm font-bold text-gray-900 rounded-xl border border-gray-200 focus:outline-none focus:border-[#1c5434] bg-[#fcfaf7]"
                />
              </div>

              {/* Screen Photo Upload */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Screen Thumbnail Photo</label>
                
                <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-gray-50 border-2 border-gray-200 flex items-center justify-center p-2 mt-1.5 mb-2">
                  {modalScreenImage ? (
                    <img
                      src={modalScreenImage}
                      alt="Screen Preview"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <span className="text-xs text-gray-400 font-semibold">No Image</span>
                  )}
                </div>

                <input
                  type="file"
                  ref={screenFileInputRef}
                  onChange={(e) => handleUploadImage(e.target.files[0], 'screen')}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => screenFileInputRef.current?.click()}
                  disabled={uploadingScreenImg}
                  className="w-full py-2.5 px-3 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-center"
                >
                  {uploadingScreenImg ? 'Uploading photo...' : '📁 Upload New Screen Photo'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setScreenModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveScreenModal}
                disabled={saving || uploadingScreenImg}
                className="px-6 py-2.5 bg-[#1c5434] hover:bg-[#143e26] text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save Screen Size'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Custom Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center font-black text-lg">
                !
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 uppercase">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-gray-500">
                  Please confirm this action.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {confirmModal.message}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, open: false }))}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                disabled={saving}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                {saving ? 'Processing...' : confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
