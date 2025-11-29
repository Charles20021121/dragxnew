"use client"
import { useEffect, useState, use } from "react";
import ProductCategoryPage from "@/components/ProductCategoryPage";
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CategoryProducts({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { category } = params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    Name: '',
    categories: category,
    Url: '',
    description: '',
    date: new Date().toISOString().replace('T', ' ').split('.')[0],
    buy: '',
    publicId: '',
    filter: '',
    filter1: '',
    Specifications: '',
    android_series: '',
    price: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`/api/products?category=${category}`);
      const data = await res.json();

      // 處理產品數據，添加 slug
      const processedProducts = data.map(product => ({
        ...product,
        slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }));

      setProducts(processedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  }

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsUploading(true); // 開始上傳時顯示 loading
      let updatedFormData = { ...formData };

      // 如果有選擇文件，先上傳圖片
      if (selectedFile) {
        setUploadProgress(1);
        const imageFormData = new FormData();
        imageFormData.append('file', selectedFile);
        imageFormData.append('upload_preset', 'newdragx');

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: imageFormData
          }
        );

        if (!uploadRes.ok) throw new Error('Upload failed');

        const uploadData = await uploadRes.json();
        setUploadProgress(100);

        // 更新表單數據中的圖片相關字段
        updatedFormData = {
          ...updatedFormData,
          Url: uploadData.secure_url,
          publicId: uploadData.public_id
        };
      }

      // 創建產品
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });

      if (res.ok) {
        setShowOffcanvas(false);
        showNotification('success', 'Product created successfully!');
        // 重置表單和文件選擇
        setFormData({
          Name: '',
          categories: category,
          Url: '',
          description: '',
          date: new Date().toISOString().replace('T', ' ').split('.')[0],
          buy: '',
          publicId: '',
          filter: '',
          filter1: '',
          Specifications: '',
          android_series: '',
          price: ''
        });
        setSelectedFile(null);
        setUploadProgress(0);

        // 重新加載頁面以顯示最新數據
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showNotification('error', 'Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      showNotification('error', 'Error creating product');
      setUploadProgress(0);
    }
    finally {
      setIsUploading(false); // 結束上傳時隱藏 loading
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // 處理刪除產品
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product and all related images?')) {
      setIsDeleting(true);
      try {
        // 先獲取產品信息
        const res = await fetch(`/api/admin/products/${productId}`);
        const product = await res.json();

        if (!res.ok) throw new Error('Failed to fetch product');

        // 刪除產品及相關圖片
        const deleteRes = await fetch(`/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            same: product.same,  // 傳遞 same 值以刪除相關產品
            publicId: product.publicId // 傳遞 publicId 以刪除 Cloudinary 圖片
          })
        });

        if (deleteRes.ok) {
          showNotification('success', 'Product and related images deleted successfully');
          // 重新加載產品列表
          fetchProducts();
        } else {
          showNotification('error', 'Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('error', 'Error deleting product');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // 處理編輯產品
  const handleEdit = (productId) => {
    router.push(`/admin/products/${params.category}/${productId}/edit`)
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative">
      {/* 提示消息 - 添加動畫效果 */}
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
            {/* 添加關閉按鈕 */}
            <button
              onClick={() => setNotification({ show: false, type: '', message: '' })}
              className="ml-4 hover:text-gray-200 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
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

      {/* 產品列表 */}
      <ProductCategoryPage
        title={category.toUpperCase()}
        products={products}
        categoryPath={category}
        isAdmin={true}
        heroImage="https://res.cloudinary.com/dmkxx68km/image/upload/v1725611928/ukzmrw5nzcsovbnb31nd.webp"
        onDelete={handleDelete}
        onEdit={handleEdit}
        loading={loading}
      />

      {/* 新增按鈕 */}
      <button
        onClick={() => setShowOffcanvas(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[#1c5434] text-white rounded-full shadow-lg hover:bg-[#143a25] transition-colors duration-300 group"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* 美化後的 Offcanvas */}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create New Product
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
                <form onSubmit={handleSubmit} className="h-full">
                  <div className="space-y-6 p-6 overflow-y-auto pb-20">
                    {/* 圖片上傳區域 */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <h3 className="font-medium text-gray-900">Product Image</h3>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setSelectedFile(e.target.files[0])}
                          required
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-[#1c5434] file:text-white
                            hover:file:bg-[#143a25]
                            file:cursor-pointer"
                        />

                        {/* 上傳進度條 */}
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
                        )}

                        {/* 預覽已選擇的圖片 */}
                        {selectedFile && (
                          <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(selectedFile)}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                      <h3 className="font-medium text-gray-900">Basic Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Product Name</label>
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
                      <div className="grid grid-cols-1  gap-4">
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
                        {(category.toLowerCase() === 'androidplayer' || category.toLowerCase() === 'contidecoder' || category.toLowerCase() === 'soundproof') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">System Type</label>
                            <select
                              name="filter1"
                              value={formData.filter1}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434]"
                              required
                            >
                              <option value="">Select System Type</option>
                              {category.toLowerCase() === 'contidecoder' ? (
                                <>
                                  <option value="appleCarplay">Apple Carplay</option>
                                  <option value="androidSystem">Android System</option>
                                </>
                              ) : category.toLowerCase() === 'androidplayer' ? (
                                <>
                                  <option value="contiAndroid">Android Screen</option>
                                  <option value="androidPlayer">Android Player</option>
                                </>
                              ) : category.toLowerCase() === 'soundproof' ? (
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
                        {category.toLowerCase() === 'contidecoder' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Car Brand</label>
                            <select
                              name="filter"
                              value={formData.filter}
                              onChange={handleChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#1c5434] focus:border-[#1c5434]"
                              required
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
                        {category.toLowerCase() === 'androidplayer' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Android Series</label>
                            <select
                              name="android_series"
                              value={formData.android_series}
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
                              <option value="TRONMMEXT_EI_series">TRONMMEXT EI series</option>
                              <option value="TRONMMEXT_ES_series">TRONMMEXT ES series</option>
                              <option value="Ultra_series">Ultra series</option>
                              <option value="Others">Others</option>
                            </select>
                          </div>
                        )}
                      </div>
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
                      Create Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}