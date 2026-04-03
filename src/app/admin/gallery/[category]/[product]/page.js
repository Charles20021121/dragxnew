"use client"
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function GalleryProductPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState(null)
  const [relatedImages, setRelatedImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showEditOffcanvas, setShowEditOffcanvas] = useState(false)
  const [showAddImageOffcanvas, setShowAddImageOffcanvas] = useState(false)
  const [editFormData, setEditFormData] = useState({
    Name: '',
    buy: '',
    Specifications: '',
    description: ''
  })
  const [selectedNewImages, setSelectedNewImages] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [notification, setNotification] = useState({ show: false, type: '', message: '' })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  const fetchData = async () => {
    try {
      // 獲取主產品數據
      const productRes = await fetch(`/api/admin/gallery/${params.category}/${params.product}`, { cache: 'no-store' })
      if (!productRes.ok) throw new Error('Network response was not ok')
      const productData = await productRes.json()
      setProduct(productData)

      // 獲取相同 same 值的所有產品
      const imagesRes = await fetch(`/api/admin/gallery/related?same=${productData.same}`, { cache: 'no-store' })
      if (!imagesRes.ok) throw new Error('Network response was not ok')
      const imagesData = await imagesRes.json()
      const validImages = imagesData.filter(img => img.Url && img.Url.trim() !== '')
      setRelatedImages(validImages)

      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  // 确保 allImages 中的图片是唯一的（因为 product 往往也包含在 relatedImages 中）
  // 确保 allImages 中的图片是唯一的（因为 product 往往也包含在 relatedImages 中）
  // 並且區分主圖（Locked）和可排序圖
  const { mainImageItem, reorderableItems } = useMemo(() => {
    const map = new Map();
    // 强制转换为字符串 ID 以防止类型不匹配（string vs number）
    if (product) map.set(String(product.Id), product);
    relatedImages.forEach(img => {
      if (img && img.Id) {
        if (!map.has(String(img.Id))) map.set(String(img.Id), img);
      }
    });

    // 即使在排序列表中，我们也要把“原始主图”（Id == same）找出来锁定
    const masterRecordId = String(product?.same || product?.Id);
    let masterItem = null;
    let otherItems = [];

    // 分离 Master Record 和其他图片
    Array.from(map.values()).forEach(item => {
      // Check strict equality for Master Record using string comparison
      if (String(item.Id) === masterRecordId) {
        masterItem = item;
      } else {
        otherItems.push(item);
      }
    });

    // 如果没找到 Master Item (异常情况)，退回到取最新一张作为 Main
    if (!masterItem && otherItems.length > 0) {
      // 先按日期排序
      otherItems.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      masterItem = otherItems[0];
      otherItems = otherItems.slice(1);
    }

    // 对剩下的图片按日期排序 (Oldest First)
    otherItems.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateA - dateB; // Oldest First (ASC)
    });

    return {
      mainImageItem: masterItem,
      reorderableItems: otherItems
    };
  }, [product, relatedImages]);

  // Re-construct allImages for compatibility with existing code
  const allImages = useMemo(() => {
    if (!mainImageItem) return [];
    return [mainImageItem, ...reorderableItems];
  }, [mainImageItem, reorderableItems]);

  const [reorderedImages, setReorderedImages] = useState([]);
  const [tempMainImageLink, setTempMainImageLink] = useState('');

  useEffect(() => {
    if (showEditOffcanvas) {
      setReorderedImages(reorderableItems);
      setTempMainImageLink(mainImageItem?.link || '');
    }
  }, [showEditOffcanvas, reorderableItems, mainImageItem]);

  const handleReorder = (newOrder) => {
    setReorderedImages(newOrder);
  };

  useEffect(() => {
    if (params.category && params.product) {
      fetchData()
    }
  }, [params.category, params.product])

  useEffect(() => {
    if (product) {
      setEditFormData({
        Name: product.Name || '',
        buy: product.buy || '',
        Specifications: product.Specifications || '',
        description: product.description || ''
      })
    }
  }, [product])

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files)
    // Convert to object structure to hold link
    const newImages = files.map(file => ({
      file,
      link: ''
    }));
    setSelectedNewImages(newImages)
  }

  const handleNewImageLinkChange = (index, value) => {
    setSelectedNewImages(prev => {
      const newImages = [...prev];
      newImages[index] = { ...newImages[index], link: value };
      return newImages;
    });
  }

  // 拖拽处理函数
  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...selectedNewImages];
    const [draggedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, draggedImage);
    setSelectedNewImages(newImages);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = (e) => {
    // 只有当鼠标真正离开元素时才清除拖拽状态
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      moveImage(draggedIndex, dropIndex);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    try {
      // 1. Update Product Basic Info
      const response = await fetch(`/api/admin/gallery/${params.category}/${params.product}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update')
      }

      // 2. Batch Update Image Links & Order (Dates)
      const galleryUpdates = [];
      const now = new Date();

      // Main Image Update (Link + Latest Date)
      if (mainImageItem) {
        galleryUpdates.push({
          id: mainImageItem.Id,
          link: tempMainImageLink,
          date: now.toISOString().slice(0, 19).replace('T', ' ')
        });
      }

      // Reordered Images Update (Link + Sequential Dates)
      // ASC Sort: Top = Oldest, Bottom = Newest
      // We start from `now` and Increment for each item down the list
      // Or better: Preserve relative order by giving them timestamps sequence
      reorderedImages.forEach((img, index) => {
        // Date: now + (index * 1000) ms
        // This makes Index 0 the "Oldest" relative to Index 1
        const date = new Date(now.getTime() + (index + 1) * 1000);
        galleryUpdates.push({
          id: img.Id,
          link: img.link, // Use link from local state reorderedImages
          date: date.toISOString().slice(0, 19).replace('T', ' ')
        });
      });

      if (galleryUpdates.length > 0) {
        const patchRes = await fetch(`/api/admin/gallery/${params.category}/${params.product}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(galleryUpdates)
        });

        if (!patchRes.ok) {
          throw new Error('Failed to update image order/links');
        }
      }

      const newSlug = editFormData.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setShowEditOffcanvas(false)
      showNotification('success', 'Changes saved successfully!')

      // Refresh everything
      await fetchData();

      // 如果產品名稱改變了，才需要重新導向
      if (product.Name !== editFormData.Name) {
        router.push(`/admin/gallery/${params.category}/${newSlug}`)
      }

    } catch (error) {
      console.error('Error updating product:', error)
      showNotification('error', error.message || 'Failed to save changes')
    } finally {
      setIsUploading(false)
    }
  }

  const handleAddImages = async () => {
    if (!selectedNewImages.length) return;
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const totalFiles = selectedNewImages.length
      let completedFiles = 0

      // 设置统一的基准时间
      const baseTime = Date.now();

      // 顺序上传所有图片，确保时间戳正确
      for (let index = 0; index < selectedNewImages.length; index++) {
        const item = selectedNewImages[index];
        const file = item.file; // Access .file property

        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData
        });

        if (!uploadRes.ok) throw new Error('Failed to upload image to R2');
        const uploadData = await uploadRes.json();

        // Default logic: New uploads get current time.
        // Since we sort ASC (Oldest First), new uploads (Now) will be > Old uploads.
        // So they naturally go to the BOTTOM.
        // Within the batch, we want the First Selected to be Top of the Batch.
        // So First Selected needs Smaller Time than Second Selected.
        // Index 0 -> Base + 1000
        // Index 1 -> Base + 2000
        const imageDate = new Date(baseTime + (index + 1) * 1000);
        console.log(`Upload image ${index + 1}: ${file.name}, timestamp: ${imageDate.toISOString()}`);

        const createResponse = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categories: params.category,
            Url: uploadData.secure_url,
            publicId: uploadData.public_id,
            same: product.same,
            date: imageDate.toISOString().replace('T', ' ').split('.')[0],
            link: item.link || '' // Send the link
          })
        });

        if (!createResponse.ok) throw new Error('Failed to create image');

        completedFiles++;
        setUploadProgress((completedFiles / totalFiles) * 100);
      }

      // 重新獲取圖片列表
      await fetchData();
      setShowAddImageOffcanvas(false);
      setSelectedNewImages([]);
      showNotification('success', 'Images uploaded successfully!');
    } catch (error) {
      console.error('Error adding images:', error);
      showNotification('error', error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  // Local update handler for Main Image link
  const handleMainLinkChange = (e) => {
    setTempMainImageLink(e.target.value);
  };

  // Local update handler for Reorderable List links
  const handleItemLinkChange = (id, newLink) => {
    setReorderedImages(prev => prev.map(img =>
      img.Id === id ? { ...img, link: newLink } : img
    ));
  };

  const handleReplaceMainImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!mainImageItem) return;

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (!uploadRes.ok) throw new Error('Failed to upload new image to R2');
      const uploadData = await uploadRes.json();

      // 2. Call PATCH API to replace image and delete old one
      const response = await fetch(`/api/admin/gallery/${params.category}/${params.product}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: mainImageItem.Id,
          newUrl: uploadData.secure_url,
          newPublicId: uploadData.public_id,
          deleteOldUrl: mainImageItem.Url // Tell backend to delete old R2 image
        })
      });

      if (!response.ok) throw new Error('Failed to update image record');

      await fetchData(); // Refresh data
      showNotification('success', 'Main image replaced successfully');

    } catch (error) {
      console.error('Replace failed:', error);
      showNotification('error', error.message || 'Failed to replace image');
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDeleteImage = async (id, same, publicId) => {
    try {
      setIsUploading(true);

      // 修改 API 路徑，使用 category 參數
      const response = await fetch(`/api/admin/gallery/${params.category}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,        // 將 id 移到請求體中
          publicId,
          same
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete image');
      }

      // 重新獲取數據
      await fetchData();
      showNotification('success', 'Image deleted successfully');

    } catch (error) {
      console.error('Error deleting image:', error);
      showNotification('error', error.message || 'Failed to delete image');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <LoadingSpinner />
  if (!product || !product.Url) return null

  // 确保主图始终是排序后的第一张
  const mainImage = mainImageItem || product

  // 移除重複定義的 allImages (已移至組件頂部)

  // 圖片模態框組件
  const ImageModal = ({ image, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.5 }}
        className="relative w-[90vw] h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={image.Url}
          alt={image.Name || 'Gallery Image'}
          fill
          className="object-contain"
          sizes="90vw"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  )

  // 在主圖片網格部分添加刪除按鈕
  const ImageGrid = ({ images }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.slice(5).map((image, index) => (
        <div key={index} className="relative group">
          <div
            className="aspect-square relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.Url}
              alt={image.Name || 'Gallery Image'}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 33vw"
            />

            {/* Hover Delete Button */}
            {image.Id !== product.Id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this image?')) {
                    handleDeleteImage(image.Id, image.same, image.publicId);
                  }
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full 
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                           hover:bg-red-600 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // 添加刪除模態框組件
  const DeleteImagesModal = ({ isOpen, onClose, images }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white flex flex-col">
          {/* Header */}
          <div className="bg-[#1c5434] text-white px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <h2 className="text-xl font-semibold">Delete Images</h2>
            </div>
            <button onClick={onClose} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={image.Url}
                      alt={image.Name || 'Gallery Image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    {image.Id !== product.Id && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this image?')) {
                            handleDeleteImage(image.Id, image.same, image.publicId);
                          }
                        }}
                        className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 
                                 transition-all duration-300 flex items-center justify-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f8f4ec]">
      <div style={{ backgroundColor: '#f8f4ec', padding: '0 5% 0 5%' }}>
        {/* Breadcrumb */}
        <nav className="py-2 px-5">
          <ol className="flex items-center gap-2 text-xs whitespace-nowrap overflow-hidden">
            <li>
              <Link href="/admin" className="text-black hover:text-[#1c5434]">
                Admin
              </Link>
            </li>
            <span>/</span>
            <li>
              <Link href="/admin/gallery" className="text-black hover:text-[#1c5434]">
                Gallery
              </Link>
            </li>
            <span>/</span>
            <li>
              <Link
                href={`/admin/gallery/${params.category}`}
                className="text-black hover:text-[#1c5434] capitalize"
              >
                {params.category}
              </Link>
            </li>
            <span>/</span>
            <li className="text-black capitalize truncate">
              {product.Name}
            </li>
          </ol>
        </nav>

        {/* Product Title - Desktop */}
        <div className="hidden md:flex justify-between items-center py-4 px-5">
          <h1 className="text-[clamp(12.5px,2vw,25px)] font-bold capitalize w-4/5">
            {product.Name}
          </h1>
        </div>

        {/* Main Content */}
        <div className="pb-5">
          <div className="bg-white rounded-t-3xl p-5">
            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((image, index) => (
                  <div key={`${image.Id}-${index}`} className="relative group">
                    <div
                      className="aspect-square relative rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Image
                        src={image.Url}
                        alt={image.Name || 'Product Image'}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="25vw"
                      />

                      {/* Hover Delete Button */}
                      {image.Id !== product.Id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Are you sure you want to delete this image?')) {
                              handleDeleteImage(image.Id, image.same, image.publicId);
                            }
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full 
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                                   hover:bg-red-600 flex items-center justify-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="grid grid-cols-2 gap-4">
                {/* Main Image First */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative aspect-square cursor-pointer"
                  onClick={() => setSelectedImage(mainImage)}
                >
                  <Image
                    src={mainImage.Url}
                    alt={mainImage.Name || 'Product Image'}
                    fill
                    className="object-cover rounded-lg"
                    sizes="33vw"
                  />
                </motion.div>

                {/* All Other Images */}
                {allImages.slice(1).map((image, index) => (
                  <motion.div
                    key={`${image.Id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-square cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image.Url}
                      alt={image.Name || 'Product View'}
                      fill
                      className="object-cover rounded-lg"
                      sizes="33vw"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
        {/* Delete Images Button */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-4 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        {/* Edit Button */}
        <button
          onClick={() => setShowEditOffcanvas(true)}
          className="p-4 bg-[#1c5434] text-white rounded-full shadow-lg hover:bg-[#143a25] transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>



        {/* Add Image Button */}
        <button
          onClick={() => setShowAddImageOffcanvas(true)}
          className="p-4 bg-[#1c5434] text-white rounded-full shadow-lg hover:bg-[#143a25] transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#f8f4ec] shadow-[0_5px_15px_rgba(0,0,0,1)] px-[5%] py-3 z-10">
        <div className="flex justify-between items-center">
          <div className="w-full">
            <h2 className="text-[clamp(10px,2vw,20px)] font-bold capitalize truncate">
              {product.Name}
            </h2>
          </div>
        </div>
      </div>


      {/* Edit Offcanvas */}
      {showEditOffcanvas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white flex flex-col">
            {/* Header */}
            <div className="bg-[#1c5434] text-white px-6 py-4 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h2 className="text-xl font-semibold">Edit Product & Reorder</h2>
              </div>
              <button
                onClick={() => setShowEditOffcanvas(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <form className="p-6">
                {/* Basic Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-[#1c5434]">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                      </label>
                      <input
                        type="text"
                        name="Name"
                        value={editFormData.Name}
                        onChange={handleEditInputChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-[#1c5434] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery Image Links & Reordering */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2 text-[#1c5434]">Gallery Image Links & Order</h3>
                  <p className="text-xs text-gray-500 mb-4 italic">Drag images to change their display order.</p>

                  {/* LOCKED Main Image (Index 0) */}
                  {mainImageItem && (
                    <div className="mb-4">

                      <div className="flex flex-col gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm relative">
                        <div className="absolute top-2 right-2 flex items-center gap-2">
                          <span className="text-[10px] font-bold text-yellow-700 bg-yellow-200 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Locked Main Image
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Image Thumbnail */}
                          <div className="w-20 h-20 relative flex-shrink-0 mt-6">
                            <Image
                              src={mainImageItem.Url}
                              alt="Main Image"
                              fill
                              className="object-cover rounded"
                            />
                            <div className="absolute -top-2 -left-2 bg-[#1c5434] text-white text-[10px] px-1.5 rounded-full font-bold">
                              #1
                            </div>
                          </div>

                          {/* Link Input & Replace Button */}
                          <div className="flex-1 space-y-3 mt-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Redirection Link
                              </label>
                              <input
                                type="url"
                                value={tempMainImageLink}
                                onChange={handleMainLinkChange}
                                placeholder="https://example.com"
                                className="w-full text-sm p-1.5 border rounded focus:ring-1 focus:ring-[#1c5434]"
                              />
                            </div>

                            {/* Replace Button */}
                            <div className="flex items-center gap-2">
                              <label className="cursor-pointer bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-2 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Replace Image
                                <input
                                  type="file"
                                  hidden
                                  accept="image/*"
                                  onChange={handleReplaceMainImage}
                                  disabled={isUploading}
                                />
                              </label>
                              {isUploading && <span className="text-xs text-gray-500 animate-pulse">Uploading...</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Reorder.Group
                    axis="y"
                    values={reorderedImages}
                    onReorder={handleReorder}
                    className="space-y-4"
                  >
                    {reorderedImages.map((image, index) => (
                      <Reorder.Item
                        key={image.Id}
                        value={image}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex-shrink-0 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        </div>

                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image
                            src={image.Url}
                            alt={`Image ${index + 2}`}
                            fill
                            className="object-cover rounded"
                          />
                          <div className="absolute -top-2 -left-2 bg-[#1c5434] text-white text-[10px] px-1.5 rounded-full font-bold">
                            #{index + 2}
                          </div>
                        </div>

                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-500 mb-1">
                            Redirection Link
                          </label>
                          <input
                            type="url"
                            placeholder="https://..."
                            className="w-full p-2 text-sm border rounded focus:ring-1 focus:ring-[#1c5434]"
                            value={image.link || ''}
                            onChange={(e) => handleItemLinkChange(image.Id, e.target.value)}
                            onClick={(e) => e.stopPropagation()} // Prevent drag when clicking input
                          />
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-white border-t p-4 flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowEditOffcanvas(false)}
                className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditSubmit}
                className="px-6 py-2 bg-[#1c5434] text-white rounded hover:bg-[#143a25] transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div >
      )
      }

      {/* Add Image Offcanvas */}
      {
        showAddImageOffcanvas && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white flex flex-col">
              {/* Header */}
              <div className="bg-[#1c5434] text-white px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h2 className="text-xl font-semibold">Add New Images</h2>
                </div>
                <button onClick={() => setShowAddImageOffcanvas(false)} className="text-white hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleNewImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">Click to select images</span>
                    </label>
                  </div>

                  {selectedNewImages.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">Selected Images ({selectedNewImages.length})</h3>
                        <p className="text-xs text-gray-500">
                          Drag & drop to reorder images
                        </p>
                      </div>
                      <div className="space-y-2">
                        {selectedNewImages.map((file, index) => (
                          <div
                            key={`${file.file.name}-${index}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`relative border rounded-lg p-3 transition-all duration-200 cursor-move ${draggedIndex === index
                              ? 'bg-blue-50 border-blue-300 opacity-50 scale-95'
                              : dragOverIndex === index
                                ? 'bg-green-50 border-green-300 border-2'
                                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              {/* 拖拽图标 */}
                              <div className="flex-shrink-0 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                </svg>
                              </div>

                              {/* 序号 */}
                              <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                                {index + 1}
                              </div>

                              {/* 图片预览 */}
                              <div className="flex-shrink-0">
                                <img
                                  src={URL.createObjectURL(file.file)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                              </div>

                              {/* 文件名 & Link Input */}
                              <div className="flex-1 min-w-0 flex flex-col gap-2">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {isUploading ? 'Uploading...' : file.file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Link (optional)..."
                                  className="text-xs p-1.5 border rounded w-full focus:ring-1 focus:ring-[#1c5434]"
                                  value={file.link}
                                  onChange={(e) => handleNewImageLinkChange(index, e.target.value)}
                                  onClick={(e) => e.stopPropagation()} // Prevent drag
                                />
                              </div>

                              {/* 拖拽提示 */}
                              {dragOverIndex === index && draggedIndex !== index && (
                                <div className="absolute inset-0 bg-green-100 border-2 border-green-300 rounded-lg flex items-center justify-center">
                                  <span className="text-green-600 font-medium text-sm">Drop here</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isUploading && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-[#1c5434] h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 text-center">
                        Uploading... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t p-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowAddImageOffcanvas(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddImages}
                  disabled={!selectedNewImages.length || isUploading}
                  className={`px-4 py-2 bg-[#1c5434] text-white rounded hover:bg-[#143a25] flex items-center gap-2 ${(!selectedNewImages.length || isUploading) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upload Images
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Upload Loading Overlay */}
      {
        isUploading && (
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
              {uploadProgress > 0 && (
                <div className="w-full mt-4 max-w-[200px]">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#88bc04] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* Notification */}
      {
        notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white transition-all duration-500 transform translate-y-0 animate-slide-in`}>
            {notification.message}
          </div>
        )
      }

      {/* Delete Images Modal */}
      <DeleteImagesModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        images={allImages}
      />
    </div >
  )
}