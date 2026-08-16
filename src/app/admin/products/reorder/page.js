"use client"
import { useEffect, useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORY_ORDER = {
  'androidplayer': 1,
  'ambientlight': 2,
  'contidecoder': 3,
  'alphardvellfire': 4,
  'bmw': 5,
  'mercedes': 6,
  'powerboot': 7,
  'silence': 8,
  '360camera': 9,
};

const formatCategoryName = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName === 'androidplayer') return 'ANDROID PLAYER';
  if (lowerName === 'alphardvellfire') return 'ALPHARD/VELLFIRE';
  if (lowerName === 'ambientlight') return 'AMBIENT LIGHT';
  if (lowerName === '360camera') return 'DX360';
  if (lowerName === 'powerboot') return 'POWER BOOT';
  if (lowerName === 'contidecoder') return 'CONTI DECODER';
  if (lowerName === 'mercedes') return 'MERCEDES-BENZ';
  if (lowerName === 'bmw') return 'BMW';
  if (lowerName === 'silence') return 'SILENCE';
  return name.toUpperCase();
};

const PositionInput = ({ position, total, onPositionChange }) => {
  const [value, setValue] = useState(position);

  useEffect(() => {
    setValue(position);
  }, [position]);

  const handleBlurOrEnter = () => {
    let newPos = parseInt(value, 10);
    if (isNaN(newPos) || newPos < 1) newPos = 1;
    if (newPos > total) newPos = total;
    setValue(newPos);
    if (newPos !== position) {
      onPositionChange(newPos);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <label className="text-[10px] text-gray-500 mb-0.5 font-semibold">Rank</label>
      <input
        type="number"
        min="1"
        max={total}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlurOrEnter}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.target.blur();
          }
        }}
        className="w-12 h-8 text-center border border-gray-300 rounded text-sm font-bold text-[#1c5434] focus:outline-none focus:border-[#1c5434] focus:ring-1 focus:ring-[#1c5434] transition-all bg-gray-50 hover:bg-white"
        title="Type a number and press Enter to move"
      />
    </div>
  );
};

export default function ReorderProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Track products by category locally for drag-and-drop
  const [categoryItems, setCategoryItems] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`/api/products?list=true&_t=${Date.now()}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const filteredData = data.filter(p => p.categories && p.categories.toLowerCase() !== 'soundproof');
          setProducts(filteredData);
          
          // Organize by categories
          const uniqueCats = [...new Set(filteredData.map(p => p.categories))].filter(Boolean);
          const sortedCats = uniqueCats.sort((a, b) => {
            const orderA = CATEGORY_ORDER[a.toLowerCase()] || 999;
            const orderB = CATEGORY_ORDER[b.toLowerCase()] || 999;
            return orderA - orderB;
          });
          
          setCategories(sortedCats);
          if (sortedCats.length > 0) {
            setActiveTab(sortedCats[0]);
          }

          const grouped = {};
          sortedCats.forEach(cat => {
            grouped[cat] = data.filter(p => p.categories === cat).sort((a, b) => {
              const orderA = a.sort_order || 0;
              const orderB = b.sort_order || 0;
              if (orderA !== orderB) {
                return orderB - orderA;
              }
              const nameA = a.name || a.Name || '';
              const nameB = b.name || b.Name || '';
              return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
            });
          });
          setCategoryItems(grouped);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleReorder = (newOrder) => {
    setCategoryItems(prev => ({
      ...prev,
      [activeTab]: newOrder
    }));
  };

  const handleMoveToTop = (product) => {
    const currentItems = categoryItems[activeTab] || [];
    const newItems = currentItems.filter(item => item.id !== product.id);
    newItems.unshift(product);
    setCategoryItems(prev => ({ ...prev, [activeTab]: newItems }));
  };

  const handleMoveToBottom = (product) => {
    const currentItems = categoryItems[activeTab] || [];
    const newItems = currentItems.filter(item => item.id !== product.id);
    newItems.push(product);
    setCategoryItems(prev => ({ ...prev, [activeTab]: newItems }));
  };

  const handlePositionChange = (product, newPosition) => {
    const currentItems = categoryItems[activeTab] || [];
    const newItems = currentItems.filter(item => item.id !== product.id);
    newItems.splice(newPosition - 1, 0, product);
    setCategoryItems(prev => ({ ...prev, [activeTab]: newItems }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Calculate new sort orders. 
      // We will assign a high number to the top items so they sort first.
      // E.g., length = 10 -> sort_order = 1000, 990, 980, etc.
      // This leaves room in the middle if needed later, but backend just rewrites them anyway.
      const itemsToUpdate = categoryItems[activeTab].map((item, index) => {
        return {
          id: item.id,
          sort_order: (categoryItems[activeTab].length - index) * 10
        };
      });

      const res = await fetch('/api/admin/featured-reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToUpdate })
      });

      if (res.ok) {
        showToast('Order saved successfully!');
      } else {
        showToast('Failed to save order.', 'error');
      }
    } catch (error) {
      console.error('Save error:', error);
      showToast('An error occurred while saving.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  const activeItems = categoryItems[activeTab] || [];

  return (
    <main className="min-h-screen bg-[#f8f4ec] py-8">
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ${toast.type === 'success' ? 'bg-[#1c5434]' : 'bg-red-500'}`}>
          <div className="flex items-center gap-2 font-medium">
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            )}
            {toast.message}
          </div>
        </div>
      )}
      
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Navigation */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm whitespace-nowrap overflow-hidden">
            <li>
              <Link href="/admin/products" className="text-gray-600 hover:text-[#1c5434]">
                &larr; Back to Admin Products
              </Link>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#1c5434]">Reorder Featured Products</h1>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#1c5434] text-white font-bold rounded hover:bg-[#143a25] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Order'}
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            Drag and drop products to arrange their display order on the homepage. Click "Save Order" to apply your changes. 
            Items at the top will be shown first.
          </p>

          {/* Categories Tabs */}
          <div 
            className="flex gap-2 overflow-x-auto pb-4 mb-4 scroll-smooth" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style dangerouslySetInnerHTML={{__html: `
              div::-webkit-scrollbar { display: none; }
            `}} />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveTab(cat);
                  setSearchTerm(''); // Reset search on tab change
                }}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === cat 
                    ? 'bg-[#1c5434] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {formatCategoryName(cat)}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search products by name to quickly locate and rank them..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1c5434]/50 focus:border-[#1c5434] transition-shadow"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                </button>
              )}
            </div>
            {searchTerm && <p className="text-xs text-amber-600 mt-2 font-medium">Drag-and-drop is disabled while searching. Use the Rank input box or Move buttons.</p>}
          </div>

          {/* Drag and Drop List */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[400px]">
            {activeItems.length === 0 ? (
              <div className="text-center text-gray-400 py-12">No products in this category.</div>
            ) : searchTerm ? (
              <div className="space-y-3">
                {activeItems
                  .map((item, index) => ({ ...item, originalIndex: index }))
                  .filter(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center gap-3 md:gap-4 bg-white p-2 md:p-3 rounded-lg border border-gray-200 shadow-sm hover:border-[#1c5434]/50 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-[28px] flex justify-center text-gray-200 px-1">
                        {/* Empty placeholder for alignment where grip icon used to be */}
                      </div>
                      <PositionInput 
                        position={product.originalIndex + 1} 
                        total={activeItems.length} 
                        onPositionChange={(newPos) => handlePositionChange(product, newPos)} 
                      />
                    </div>
                    
                    <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded overflow-hidden shrink-0 border border-gray-100 ml-2">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name || ''}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-[#1c5434] text-sm md:text-base line-clamp-1">{product.name}</h3>
                      {product.filter1 && (
                        <span className="text-[10px] md:text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block border border-gray-200">
                          {product.filter1}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => handleMoveToTop(product)}
                        title="Move to Top"
                        className="p-1.5 md:p-2 text-gray-400 hover:text-[#1c5434] hover:bg-[#1c5434]/10 rounded-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/><path d="M5 5h14" opacity="0.4" /></svg>
                      </button>
                      <button
                        onClick={() => handleMoveToBottom(product)}
                        title="Move to Bottom"
                        className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/><path d="M5 19h14" opacity="0.4" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Reorder.Group 
                axis="y" 
                values={activeItems} 
                onReorder={handleReorder}
                className="space-y-3"
              >
                {activeItems.map((product, index) => (
                  <Reorder.Item 
                    key={product.id} 
                    value={product}
                    className="flex items-center gap-3 md:gap-4 bg-white p-2 md:p-3 rounded-lg border border-gray-200 shadow-sm cursor-grab active:cursor-grabbing hover:border-[#1c5434]/50 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-gray-300 group-hover:text-[#1c5434] transition-colors cursor-grab px-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                      </div>
                      <PositionInput 
                        position={index + 1} 
                        total={activeItems.length} 
                        onPositionChange={(newPos) => handlePositionChange(product, newPos)} 
                      />
                    </div>
                    
                    <div className="relative w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded overflow-hidden shrink-0 border border-gray-100 ml-2">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name || ''}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-[#1c5434] text-sm md:text-base line-clamp-1">{product.name}</h3>
                      {product.filter1 && (
                        <span className="text-[10px] md:text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block border border-gray-200">
                          {product.filter1}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={() => handleMoveToTop(product)}
                        title="Move to Top"
                        className="p-1.5 md:p-2 text-gray-400 hover:text-[#1c5434] hover:bg-[#1c5434]/10 rounded-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/><path d="M5 5h14" opacity="0.4" /></svg>
                      </button>
                      <button
                        onClick={() => handleMoveToBottom(product)}
                        title="Move to Bottom"
                        className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/><path d="M5 19h14" opacity="0.4" /></svg>
                      </button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
