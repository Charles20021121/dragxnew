"use client"
import { useEffect, useState, use } from "react";
import ProductDetail from "@/components/ProductDetail";
import { Suspense } from "react";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';

export default function ProductPage({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise);
  const { category, slug } = params;
  const [product, setProduct] = useState(null);
  console.log('product',product)
  const [loading, setLoading] = useState(true);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    Name: '',
    categories: category,
    Url: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    buy: '',
    publicId: '',
    filter: '',
    filter1: '',
    Specifications: ''
  });
  const [showImageOffcanvas, setShowImageOffcanvas] = useState(false);
  const [newImageData, setNewImageData] = useState({
    Name: '',
    categories: category,
    Url: '',
    same: '',  // 會自動填充當前產品的 ID
    date: new Date().toISOString().split('T')[0],
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);



  useEffect(() => {
    fetchProduct();
  }, [category, slug]);

  const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products?category=${category}`);
        const products = await res.json();
        console.log(products)
        console.log(slug)
        
        const foundProduct = products.find(p => 
          p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug
        );

        setProduct(foundProduct);
      if (foundProduct) {
        setFormData({
          Name: foundProduct.name,
          categories: foundProduct.categories,
          Url: foundProduct.image,
          description: foundProduct.description,
          date: foundProduct.date,
          buy: foundProduct.buy,
          publicId: foundProduct.publicId,
          filter: foundProduct.filter,
          filter1: foundProduct.filter1,
          Specifications: foundProduct.specifications
        });
      }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
  };

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

  // 批量添加圖片的處理函數
  const handleAddImages = async (e) => {
    e.preventDefault();
    
    try {
      showNotification('info', 'Uploading images...');

      // 先上傳到 Cloudinary
      const uploadPromises = selectedFiles.map(async file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'newdragx');

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        return {
          Url: data.secure_url,
          publicId: data.public_id
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);

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
            date: new Date().toISOString().split('T')[0],
            Specifications: '',
            description: '',
            buy: '',
            filter: '',
            filter1: ''
          }),
        });

        if (!mainImageRes.ok) throw new Error('Failed to create main product');
        const mainProduct = await mainImageRes.json();
        
        // 使用新創建的產品 ID 作為 same
        const remainingImages = uploadedImages.slice(1);
        const savePromises = remainingImages.map(image => 
          fetch('/api/admin/products', {
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
              date: new Date().toISOString().split('T')[0],
              Specifications: '',
              description: '',
              buy: '',
              filter: '',
              filter1: ''
            }),
          })
        );

        const results = await Promise.all(savePromises);
        const allSuccessful = results.every(res => res.ok);

        if (allSuccessful) {
          setShowImageOffcanvas(false);
          setSelectedFiles([]);
          showNotification('success', 'All images added successfully!');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        // 如果是已存在的產品，直接使用 product.id 作為 same
        const savePromises = uploadedImages.map(image => 
          fetch('/api/admin/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Name: '',
              categories: product.categories,
              Url: image.Url,
              publicId: image.publicId,
              same: product.id,
              date: new Date().toISOString().split('T')[0],
              Specifications: '',
              description: '',
              buy: '',
              filter: '',
              filter1: ''
            }),
          })
        );

        const results = await Promise.all(savePromises);
        const allSuccessful = results.every(res => res.ok);

        if (allSuccessful) {
          setShowImageOffcanvas(false);
          setSelectedFiles([]);
          showNotification('success', 'All images added successfully!');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error adding images:', error);
      showNotification('error', 'Error adding images');
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
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
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
        <ProductDetail product={product} isAdmin={true} onEdit={() => setShowOffcanvas(true)} />
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

                    </div>
                  </div>

                


                  {/* Description and Specifications */}
                  {category.toLowerCase() !== "silence" && (
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
                      {(formData.categories.toLowerCase() === 'androidplayer' || formData.categories.toLowerCase() === 'contidecoder' || formData.categories.toLowerCase() === 'silence') && (
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
                                <option value="contiAndroid">Conti Android</option>
                                <option value="androidPlayer">Android Player</option>
                              </>
                            ) : formData.categories.toLowerCase() === 'silence' ? (
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
        {category.toLowerCase() !== "silence" && (
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="rounded-lg object-cover w-full aspect-square"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="sticky bottom-0 bg-white border-t px-6 py-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowImageOffcanvas(false);
                        setSelectedFiles([]);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c5434]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={selectedFiles.length === 0}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1c5434] ${
                        selectedFiles.length > 0
                          ? 'bg-[#1c5434] hover:bg-[#143a25] text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'Image' : 'Images'}
                    </button>
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