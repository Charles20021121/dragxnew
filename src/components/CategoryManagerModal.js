import { useState } from 'react';

export default function CategoryManagerModal({ 
  isOpen, 
  onClose, 
  categories, 
  categoryContext, 
  onUpdate 
}) {
  const [editingFilter, setEditingFilter] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleEdit = (filter) => {
    setEditingFilter(filter);
    setEditValue(filter);
  };

  const handleSave = async (oldFilter) => {
    if (!editValue || editValue === oldFilter) {
      setEditingFilter(null);
      return;
    }
    
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/products/custom-filter', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: categoryContext,
          oldFilter,
          newFilter: editValue
        })
      });
      if (res.ok) {
        await onUpdate();
        setEditingFilter(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (filter) => {
    if (!window.confirm(`Are you sure you want to delete the category "${filter}"? This will remove this category from all associated products.`)) {
      return;
    }
    
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/products/custom-filter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: categoryContext,
          filter
        })
      });
      if (res.ok) {
        await onUpdate();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Categories</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-2 max-h-60 overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No categories found.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {categories.map((filter) => (
                    <li key={filter} className="py-3 flex justify-between items-center">
                      {editingFilter === filter ? (
                        <div className="flex flex-1 items-center gap-2 mr-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="block w-full border border-gray-300 rounded-md shadow-sm p-1.5 text-sm focus:ring-[#1c5434] focus:border-[#1c5434]"
                          />
                          <button
                            type="button"
                            onClick={() => handleSave(filter)}
                            disabled={isProcessing}
                            className="text-green-600 hover:text-green-900 text-sm font-medium disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingFilter(null)}
                            disabled={isProcessing}
                            className="text-gray-500 hover:text-gray-700 text-sm font-medium disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-sm text-gray-900">{filter}</span>
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(filter)}
                              disabled={isProcessing}
                              className="text-[#1c5434] hover:text-[#143a25] text-sm font-medium disabled:opacity-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(filter)}
                              disabled={isProcessing}
                              className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
