import React, { useState, useEffect } from 'react';
import { Membership, Product, TierValues } from '../types';
import { X, Save, ArrowLeft } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  memberships: Membership[];
  existingCategories: string[]; // Yeni prop: Mevcut kategoriler
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const DEFAULT_CATEGORIES = ['Gıda Takviyeleri', 'Cilt Bakım', 'Sağlık & Yaşam', 'Ev Bakım'];

const ProductForm: React.FC<ProductFormProps> = ({ product, memberships, existingCategories, onSave, onCancel }) => {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || 'Gıda Takviyeleri');
  const [retailPrice, setRetailPrice] = useState(product?.retailPrice || 0);
  
  // Custom category logic
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  
  // Merge default categories with existing ones from products
  const availableCategories = Array.from(new Set([...DEFAULT_CATEGORIES, ...existingCategories]));

  useEffect(() => {
    // If editing a product with a category not in the list, switch to custom mode
    if (product && !availableCategories.includes(product.category)) {
      setIsCustomCategory(true);
    }
  }, [product, availableCategories]);

  // Flatten tier data for form handling
  const [tierData, setTierData] = useState<Record<string, TierValues>>(
    product?.tiers || {}
  );

  useEffect(() => {
    // Ensure all memberships have an entry
    const newTierData = { ...tierData };
    memberships.forEach(m => {
      if (!newTierData[m.id]) {
        newTierData[m.id] = { price: 0, pv: 0, bv: 0 };
      }
    });
    setTierData(newTierData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memberships]);

  const handleTierChange = (membershipId: string, field: keyof TierValues, value: string) => {
    setTierData(prev => ({
      ...prev,
      [membershipId]: {
        ...prev[membershipId],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim()) {
      alert("Lütfen bir kategori belirleyin.");
      return;
    }
    onSave({
      id: product?.id || crypto.randomUUID(),
      name,
      category,
      retailPrice,
      tiers: tierData
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {product ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Ürün Adı</label>
              <input
                required
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
                placeholder="Örn: C Vitamini"
              />
            </div>
            
            {/* Improved Category Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Kategori</label>
              {isCustomCategory ? (
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900"
                    placeholder="Yeni kategori adı..."
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => { setIsCustomCategory(false); setCategory(availableCategories[0] || 'Gıda Takviyeleri'); }}
                    className="px-3 py-2 text-slate-500 hover:bg-slate-100 rounded-lg border border-slate-200"
                    title="Listeye Dön"
                  >
                    <ArrowLeft size={20} />
                  </button>
                </div>
              ) : (
                <select
                  required
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === 'custom_new_entry') {
                      setIsCustomCategory(true);
                      setCategory('');
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 cursor-pointer"
                >
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option disabled>──────────</option>
                  <option value="custom_new_entry" className="font-bold text-blue-600">+ Yeni Kategori Ekle</option>
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Satış Fiyatı (Liste)</label>
              <input
                required
                type="number"
                step="0.01"
                value={retailPrice}
                onChange={e => setRetailPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-900"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Üyelik Fiyatlandırması</h3>
            <div className="space-y-6">
              {memberships.map(m => (
                <div key={m.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-3 h-3 rounded-full ${m.id === 'platin' ? 'bg-slate-400' : m.id === 'altin' ? 'bg-yellow-400' : m.id === 'bronz' ? 'bg-orange-400' : 'bg-gray-400'}`}></span>
                    <h4 className="font-medium text-slate-700">{m.name}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Fiyat (₺)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={tierData[m.id]?.price || 0}
                        onChange={e => handleTierChange(m.id, 'price', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">PV</label>
                      <input
                        type="number"
                        step="0.01"
                        value={tierData[m.id]?.pv || 0}
                        onChange={e => handleTierChange(m.id, 'pv', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">BV</label>
                      <input
                        type="number"
                        step="0.01"
                        value={tierData[m.id]?.bv || 0}
                        onChange={e => handleTierChange(m.id, 'bv', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-900 font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 shadow-sm shadow-blue-200"
            >
              <Save size={18} />
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;