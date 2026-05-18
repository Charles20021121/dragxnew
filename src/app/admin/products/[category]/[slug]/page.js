"use client"
import { useEffect, useState, use } from "react";
import ProductDetail from "@/components/ProductDetail";
import { Suspense } from "react";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function ProductPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise);
  const { category, slug } = params;
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    Name: '',
    categories: category,
    Url: '',
    description: '',
    Specifications: '',
    buy: '',
    publicId: '',
    filter: '',
    filter1: '',
    android_series: '',
    custom_filter: '',
    price: '',
    date: new Date().toISOString().replace('T', ' ').split('.')[0]
  });
  const [existingFilters, setExistingFilters] = useState([]);
  const [showImageOffcanvas, setShowImageOffcanvas] = useState(false);
  const [newImageData, setNewImageData] = useState({
    Name: '',
    categories: category,
    Url: '',
    same: '',  // 會自動填充當前產品的 ID
    date: new Date().toISOString().replace('T', ' ').split('.')[0],
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [category, slug]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products?category=${category}`, { cache: 'no-store' });
      const products = await res.json();

      console.log('Fetched products:', products.length);

      const matchingProducts = products.filter(p =>
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug.toLowerCase()
      );

      console.log('Matching products:', matchingProducts.length);

      const foundProduct = matchingProducts.sort((a, b) => {
        let scoreA = (a.price ? 2 : 0) + (a.description ? 1 : 0);
        let scoreB = (b.price ? 2 : 0) + (b.description ? 1 : 0);
        return scoreB - scoreA;
      })[0];

      if (foundProduct) {
        console.log('Found product:', {
          id: foundProduct.id,
          same: foundProduct.same,
          additionalImages: foundProduct.additionalImages?.length || 0
        });

        // 確保每個圖片對象都有必要的字段
        const relatedImages = [
          {
            id: foundProduct.id,
            src: foundProduct.image,
            alt: foundProduct.name,
            publicId: foundProduct.publicId,
            same: foundProduct.same
          },
          ...(foundProduct.additionalImages || []).map(img => ({
            id: img.Id,
            src: img.Url,
            alt: img.Name,
            publicId: img.publicId,
            same: foundProduct.same
          }))
        ];

        console.log('Related images count:', relatedImages.length);

        setProduct({
          ...foundProduct,
          relatedImages
        });

        // Extract unique custom filter values from all products in this category
        const filters = [...new Set(products
          .filter(p => p.custom_filter)
          .map(p => p.custom_filter)
        )].sort((a, b) => {
          const numA = a.match(/\d+/) ? parseInt(a.match(/\d+/)[0], 10) : null;
          const numB = b.match(/\d+/) ? parseInt(b.match(/\d+/)[0], 10) : null;
          if (numA !== null && numB !== null) {
            if (numA !== numB) return numA - numB;
            return a.localeCompare(b, undefined, { numeric: true });
          }
          if (numA !== null) return -1;
          if (numB !== null) return 1;
          return a.localeCompare(b, undefined, { numeric: true });
        });
        setExistingFilters(filters);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product) {
      setFormData({
        Name: product.name || '',
        categories: product.categories || category,
        Url: product.image || '',
        description: product.description || '',
        Specifications: product.specifications || '',
        buy: product.buy || '',
        publicId: product.publicId || '',
        filter: product.filter || '',
        filter1: product.filter1 || '',
        android_series: product.android_series || '',
        custom_filter: product.custom_filter || '',
        price: product.price || '',
        date: product.date || new Date().toISOString().replace('T', ' ').split('.')[0]
      });
    }
  }, [product, category]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowOffcanvas(false);
        showNotification('success', 'Product updated successfully!');

        // 計算新的 slug
        const newSlug = formData.Name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // 如果名稱改變了，重定向到新的 URL
        if (newSlug !== slug) {
          setTimeout(() => {
            router.push(`/admin/products/${category}/${newSlug}`);
          }, 1000); // 等待 1 秒讓用戶看到成功消息
        } else {
          // 如果名稱沒有改變，只重新獲取產品數據
          fetchProduct();
        }
      } else {
        showNotification('error', 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showNotification('error', 'Error updating product');
    }
  };

  // 處理文件選擇
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // 移除選擇的文件
  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // 拖拽状态
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  // 移动图片顺序的函数
  const moveImage = (fromIndex, toIndex) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      const [movedItem] = newFiles.splice(fromIndex, 1);
      newFiles.splice(toIndex, 0, movedItem);
      return newFiles;
    });
  };

  // 向前移动图片
  const moveImageUp = (index) => {
    if (index > 0) {
      moveImage(index, index - 1);
    }
  };

  // 向后移动图片
  const moveImageDown = (index) => {
    if (index < selectedFiles.length - 1) {
      moveImage(index, index + 1);
    }
  };

  // 拖拽事件处理
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
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

  // 批量添加圖片的處理函數
  const handleAddImages = async (e) => {
    e.preventDefault();

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = selectedFiles.length;
      let completedFiles = 0;
      const uploadedImages = [];

      // 順序上傳到 Cloudinary，實時更新進度
      for (const file of selectedFiles) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadFormData
        });

        if (!res.ok) throw new Error('Upload to R2 failed');
        const data = await res.json();

        uploadedImages.push({
          Url: data.secure_url,
          publicId: data.public_id
        });

        completedFiles++;
        setUploadProgress((completedFiles / totalFiles) * 100);
      }

      // 如果是新產品（沒有 product.id），先創建主圖片
      if (!product.id) {
        const mainImageRes = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Name: product.name,
            categories: product.categories,
            Url: uploadedImages[0].Url,
            publicId: uploadedImages[0].publicId,
            date: new Date().toISOString().replace('T', ' ').split('.')[0],
            Specifications: '',
            description: '',
            buy: '',
            filter: '',
            filter1: '',
            android_series: '',
            custom_filter: ''
          }),
        });

        if (!mainImageRes.ok) throw new Error('Failed to create main product');
        const mainProduct = await mainImageRes.json();

        // 使用新創建的產品 ID 作為 same
        const remainingImages = uploadedImages.slice(1);
        const savePromises = remainingImages.map((image, index) => {
          // 每張圖片延遲 1 秒，確保時間戳不同
          const imageDate = new Date(Date.now() + (index + 1) * 1000);
          return fetch('/api/admin/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Name: product.name,
              categories: product.categories,
              Url: image.Url,
              publicId: image.publicId,
              same: mainProduct.id,
              date: imageDate.toISOString().replace('T', ' ').split('.')[0],
              Specifications: '',
              description: '',
              buy: '',
              filter: '',
              filter1: '',
              android_series: '',
              custom_filter: ''
            }),
          });
        });

        const results = await Promise.all(savePromises);
        const allSuccessful = results.every(res => res.ok);

        if (allSuccessful) {
          setShowImageOffcanvas(false);
          setSelectedFiles([]);
          showNotification('success', 'All images added successfully!');
          await fetchProduct();
        }
      } else {
        // 如果是已存在的產品，使用 product.same（主產品 ID）
        const mainProductId = product.same || product.id;
        console.log('Adding images to existing product:', {
          productId: product.id,
          productSame: product.same,
          mainProductId,
          imageCount: uploadedImages.length
        });

        const savePromises = uploadedImages.map((image, index) => {
          // 每張圖片延遲 1 秒，確保時間戳不同
          const imageDate = new Date(Date.now() + index * 1000);
          return fetch('/api/admin/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Name: '',
              categories: product.categories,
              Url: image.Url,
              publicId: image.publicId,
              same: mainProductId,
              date: imageDate.toISOString().replace('T', ' ').split('.')[0],
              Specifications: '',
              description: '',
              buy: '',
              filter: '',
              filter1: '',
              android_series: '',
              custom_filter: ''
            }),
          });
        });

        const results = await Promise.all(savePromises);
        const allSuccessful = results.every(res => res.ok);

        console.log('Upload results:', { allSuccessful, results: results.length });

        if (allSuccessful) {
          setShowImageOffcanvas(false);
          setSelectedFiles([]);
          showNotification('success', 'All images added successfully!');
          console.log('Fetching updated product data...');
          await fetchProduct();
        }
      }
    } catch (error) {
      console.error('Error adding images:', error);
      showNotification('error', 'Error adding images');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteImage = async (id, same, publicId) => {
    try {
      // 顯示加載狀態
      setLoading(true);

      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ publicId })
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      // 刪除成功後重新獲取產品數據
      await fetchProduct();

      // 顯示成功通知
      showNotification('success', 'Image deleted successfully');

    } catch (error) {
      console.error('Error deleting image:', error);
      showNotification('error', 'Failed to delete image');
    } finally {
      setLoading(false);
    }
  };

  const handleReorderImages = async (newImages) => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/products/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images: newImages }),
      });

      if (res.ok) {
        showNotification('success', 'Order updated successfully');
        await fetchProduct();
      } else {
        showNotification('error', 'Failed to update order');
      }
    } catch (error) {
      console.error('Error reordering images:', error);
      showNotification('error', 'Error reordering images');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1c5434] mb-4">Product not found</h1>
          <p>Category: {category}</p>
          <p>Slug: {slug}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 提示消息 */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white transition-all duration-500 transform translate-y-0 animate-slide-in`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetail
          product={product}
          isAdmin={true}
          onEdit={() => setShowOffcanvas(true)}
          onDeleteImage={handleDeleteImage}
          onReorderImages={handleReorderImages}
        />
      </Suspense>

      {/* Edit Offcanvas */}
      {showOffcanvas && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowOffcanvas(false)} />

          <div className="absolute inset-y-0 right-0 max-w-2xl w-full transform transition-transform duration-500 ease-in-out">
            <div className="h-full bg-white shadow-xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 bg-[#1c5434] text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Product
                  </h2>
                  <button
                    onClick={() => setShowOffcanvas(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Basic Information */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-medium text-gray-900">Basic Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                        <input
                          type="text"
                          name="Name"
                          value={formData.Name}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                          type="text"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434]"
                          placeholder="e.g. RM 1299.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description and Specifications */}
                  {category.toLowerCase() !== "soundproof" && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <h3 className="font-medium text-gray-900">Description & Specifications</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Specifications</label>
                          <textarea
                            name="Specifications"
                            value={formData.Specifications}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Description</label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434]"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-medium text-gray-900">Additional Information</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Buy Link</label>
                        <input
                          type="url"
                          name="buy"
                          value={formData.buy}
                          onChange={handleChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434]"
                        />
                      </div>

                      {/* 只在特定類別顯示 filter1 選項 */}
                      {(formData.categories.toLowerCase() === 'androidplayer' || formData.categories.toLowerCase() === 'contidecoder' || formData.categories.toLowerCase() === 'soundproof') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">System Type</label>
                          <select
                            name="filter1"
                            value={formData.filter1}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434]"
                          >
                            <option value="">Select System Type</option>
                            {formData.categories.toLowerCase() === 'contidecoder' ? (
                              <>
                                <option value="appleCarplay">Apple Carplay</option>
                                <option value="androidSystem">Android System</option>
                              </>
                            ) : formData.categories.toLowerCase() === 'androidplayer' ? (
                              <>
                                <option value="contiAndroid">Android Screen</option>
                                <option value="androidPlayer">Android Player</option>
                              </>
                            ) : formData.categories.toLowerCase() === 'soundproof' ? (
                              <>
                                <option value="hatchback">Hatchback</option>
                                <option value="sedan">Sedan</option>
                                <option value="suv">SUV</option>
                                <option value="mpv">MPV</option>
                              </>
                            ) : null}
                          </select>
                        </div>
                      )}

                      {/* 只在 contidecoder 類別顯示 car brand 選項 */}
                      {formData.categories.toLowerCase() === 'contidecoder' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Car Brand</label>
                          <select
                            name="filter"
                            value={formData.filter}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434]"
                          >
                            <option value="">Select Car Brand</option>
                            <option value="audi">Audi</option>
                            <option value="mercedes">Mercedes</option>
                            <option value="bmw">BMW</option>
                            <option value="ford">Ford</option>
                            <option value="honda">Honda</option>
                            <option value="jaguar">Jaguar</option>
                            <option value="landrover">Land Rover</option>
                            <option value="lexus">Lexus</option>
                            <option value="mini">MINI</option>
                            <option value="perodua">Perodua</option>
                            <option value="porsche">Porsche</option>
                            <option value="proton">Proton</option>
                            <option value="toyota">Toyota</option>
                            <option value="volvo">Volvo</option>
                            <option value="alphard">Alphard</option>
                            <option value="vellfire">Vellfire</option>
                          </select>
                        </div>
                      )}

                      {/* 只在 androidplayer 類別顯示 android series 選項 */}
                      {formData.categories.toLowerCase() === 'androidplayer' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Android Series</label>
                          <select
                            name="android_series"
                            value={formData.android_series || ""}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434]"
                          >
                            <option value="">Select Android Series</option>
                            <option value="Advance_series">Advance series</option>
                            <option value="Android_Ai_Box">Android Ai Box</option>
                            <option value="Cyber_series">Cyber series</option>
                            <option value="Diamond_series">Diamond series</option>
                            <option value="Exclusive_series">Exclusive series</option>
                            <option value="Luxury_series">Luxury series</option>
                            <option value="Performance_series">Performance series</option>
                            <option value="Signature_40">40 Series</option>
                            <option value="TRONMMEXT_EI_series">TRONMMEXT EI series</option>
                            <option value="TRONMMEXT_ES_series">TRONMMEXT ES series</option>
                            <option value="Ultra_series">Ultra series</option>
                            <option value="Others">Others</option>
                          </select>
                        </div>
                      )}

                      {['ambientlight', 'alphardvellfire', 'bmw', 'mercedes', 'powerboot', '360camera', 'others'].includes(formData.categories.toLowerCase()) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Custom Filter Category</label>
                          <div className="mt-1 space-y-2">
                            <select
                              className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434]"
                              value={existingFilters.includes(formData.custom_filter) ? formData.custom_filter : (formData.custom_filter ? "new" : "")}
                              onChange={(e) => {
                                if (e.target.value === "new") {
                                  setFormData(prev => ({ ...prev, custom_filter: "" }));
                                } else {
                                  setFormData(prev => ({ ...prev, custom_filter: e.target.value }));
                                }
                              }}
                            >
                              <option value="">No Filter (All)</option>
                              {existingFilters.map(filter => (
                                <option key={filter} value={filter}>{filter}</option>
                              ))}
                              <option value="new" className="font-bold text-[#1c5434]">+ Add New Category...</option>
                            </select>

                            {(!existingFilters.includes(formData.custom_filter) || formData.custom_filter === "") && (
                              <div className="relative">
                                <input
                                  type="text"
                                  name="custom_filter"
                                  value={formData.custom_filter}
                                  onChange={handleChange}
                                  className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434] animate-in slide-in-from-top-2 duration-300"
                                  placeholder="Type new category name here..."
                                />
                                <p className="mt-1 text-xs text-gray-500 italic">Enter a new name to create a new filter tag.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="sticky bottom-0 bg-white border-t px-6 py-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowOffcanvas(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c5434]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#1c5434] text-white rounded-md hover:bg-[#143a25] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c5434] flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 浮動按鈕 */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
        {/* 編輯按鈕 */}
        <button
          onClick={() => setShowOffcanvas(true)}
          className="bg-[#1c5434] hover:bg-[#143a25] text-white p-4 rounded-full shadow-lg flex items-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        {/* 添加圖片按鈕 */}
        {category.toLowerCase() !== "soundproof" && (
          <button
            onClick={() => setShowImageOffcanvas(true)}
            className="bg-[#1c5434] hover:bg-[#143a25] text-white p-4 rounded-full shadow-lg flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
        )}
      </div>

      {/* 添加圖片的 Offcanvas */}
      {showImageOffcanvas && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowImageOffcanvas(false)} />

          <div className="absolute inset-y-0 right-0 max-w-2xl w-full transform transition-transform duration-500 ease-in-out">
            <div className="h-full bg-white shadow-xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 bg-[#1c5434] text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Add New Images
                  </h2>
                  <button
                    onClick={() => setShowImageOffcanvas(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleAddImages} className="p-6 space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h3 className="font-medium text-gray-900">Select Images</h3>

                    {/* 文件選擇器 */}
                    <label className="block w-full">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#1c5434] transition-colors cursor-pointer">
                        <div className="flex flex-col items-center space-y-2 py-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-500">Click to select images</span>
                        </div>
                      </div>
                    </label>

                    {/* 預覽選擇的文件 */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-700">
                            Selected Images ({selectedFiles.length})
                          </h4>
                          <p className="text-xs text-gray-500">
                            Drag & drop to reorder images
                          </p>
                        </div>
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
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
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                </div>

                                {/* 文件名和大小 */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>

                                {/* 删除按钮 */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(index)}
                                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 上傳進度條 */}
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

                    {/* 操作按鈕 */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <button
                        type="button"
                        onClick={() => setShowImageOffcanvas(false)}
                        disabled={isUploading}
                        className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={selectedFiles.length === 0 || isUploading}
                        className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${selectedFiles.length === 0 || isUploading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#1c5434] hover:bg-[#143a25]'
                          }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}