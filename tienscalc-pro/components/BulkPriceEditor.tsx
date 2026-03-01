import React, { useState, useEffect } from 'react';
import { Membership, Product } from '../types';
import { Save, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface BulkPriceEditorProps {
  products: Product[];
  memberships: Membership[];
  onSave: (updatedProducts: Product[]) => void;
}

const BulkPriceEditor: React.FC<BulkPriceEditorProps> = ({ products, memberships, onSave }) => {
  // Default to 'retail' or first membership
  const [selectedMembershipId, setSelectedMembershipId] = useState<string>('retail');
  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [hasChanges, setHasChanges] = useState(false);

  // Sync local state when props change
  useEffect(() => {
    setLocalProducts(products);
    setHasChanges(false);
  }, [products]);

  // Handle Membership Tier Changes
  const handleTierChange = (productId: string, field: 'price' | 'pv' | 'bv', value: string) => {
    const numValue = parseFloat(value) >= 0 ? parseFloat(value) : 0;
    
    setLocalProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;

      const currentTiers = p.tiers || {};
      const currentTier = currentTiers[selectedMembershipId] || { price: 0, pv: 0, bv: 0 };

      return {
        ...p,
        tiers: {
          ...currentTiers,
          [selectedMembershipId]: {
            ...currentTier,
            [field]: numValue
          }
        }
      };
    }));
    setHasChanges(true);
  };

  // Handle Retail Price Change
  const handleRetailChange = (productId: string, value: string) => {
    const numValue = parseFloat(value) >= 0 ? parseFloat(value) : 0;

    setLocalProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return { ...p, retailPrice: numValue };
    }));
    setHasChanges(true);
  };

  // Handle Product Reordering
  const moveProduct = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === localProducts.length - 1)) {
      return;
    }

    const newProducts = [...localProducts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap elements
    [newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]];
    
    setLocalProducts(newProducts);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(localProducts);
    setHasChanges(false);
    alert('Ürünler ve sıralama başarıyla güncellendi.');
  };

  const isRetail = selectedMembershipId === 'retail';
  const selectedMembership = memberships.find(m => m.id === selectedMembershipId);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-[75vh] w-full">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 rounded-t-xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-700 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm lg:text-base">Toplu Fiyat Düzenleyici</h3>
            <p className="text-xs text-slate-500">Fiyatları düzenleyin veya okları kullanarak ürün sırasını değiştirin.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedMembershipId}
            onChange={(e) => setSelectedMembershipId(e.target.value)}
            className="flex-1 sm:flex-none px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900 font-medium"
          >
            <option value="retail">Üye Olmayanlar (Liste Fiyatı)</option>
            {memberships.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition text-sm whitespace-nowrap ${
              hasChanges 
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save size={16} />
            <span className="hidden sm:inline">Kaydet</span>
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto bg-white rounded-b-xl relative w-full">
        {/* Reduced min-width to allow shrinking on smaller modals */}
        <div className="min-w-[600px] lg:min-w-0 w-full"> 
            <table className="w-full text-left">
              <thead className="text-xs lg:text-sm text-slate-500 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  {/* Sorting Column */}
                  <th className="px-2 py-3 border-b border-slate-200 w-16 font-semibold text-center bg-slate-100">Sıra</th>
                  
                  {/* Compact columns */}
                  <th className="px-2 py-3 border-b border-slate-200 w-32 font-semibold">Kategori</th>
                  <th className="px-2 py-3 border-b border-slate-200 flex-1 min-w-[120px] font-semibold">Ürün Adı</th>
                  
                  {/* Dynamic Price Header - Tighter width */}
                  <th className={`px-2 py-3 border-b border-slate-200 ${isRetail ? 'w-40' : 'w-32'} bg-slate-100/50 font-semibold`}>
                    <div className="flex items-center gap-1 justify-end">
                        {!isRetail && <span className={`w-2 h-2 rounded-full ${selectedMembership?.color.split(' ')[0]}`}></span>}
                        {isRetail ? 'Liste (₺)' : 'Fiyat (₺)'}
                    </div>
                  </th>

                  {/* PV/BV Headers - Compact widths */}
                  {!isRetail && (
                    <>
                      <th className="px-2 py-3 border-b border-slate-200 w-20 bg-emerald-50/50 font-semibold text-center">PV</th>
                      <th className="px-2 py-3 border-b border-slate-200 w-20 bg-amber-50/50 font-semibold text-center">BV</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {localProducts.map((product, index) => {
                  const tier = product.tiers[selectedMembershipId] || { price: 0, pv: 0, bv: 0 };
                  
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                      {/* Sorting Buttons */}
                      <td className="px-2 py-2 text-center bg-slate-50/30">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-1">
                          <button 
                            onClick={() => moveProduct(index, 'up')}
                            disabled={index === 0}
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Yukarı Taşı"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button 
                            onClick={() => moveProduct(index, 'down')}
                            disabled={index === localProducts.length - 1}
                            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Aşağı Taşı"
                          >
                            <ArrowDown size={14} />
                          </button>
                        </div>
                      </td>

                      <td className="px-2 py-2 text-xs text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[8rem]">
                        {product.category}
                      </td>
                      <td className="px-2 py-2 font-medium text-slate-800 text-sm">
                        {product.name}
                      </td>
                      
                      {/* Price Input */}
                      <td className="px-2 py-1.5 bg-slate-100/30">
                        <input
                          type="number"
                          step="0.01"
                          value={isRetail ? product.retailPrice : tier.price}
                          onChange={(e) => isRetail 
                            ? handleRetailChange(product.id, e.target.value)
                            : handleTierChange(product.id, 'price', e.target.value)
                          }
                          className="w-full px-2 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none text-right font-bold bg-white text-sm shadow-sm"
                          placeholder="0.00"
                        />
                      </td>

                      {/* PV/BV Inputs - Hidden if Retail */}
                      {!isRetail && (
                        <>
                          <td className="px-2 py-1.5 bg-emerald-50/30">
                            <input
                              type="number"
                              step="0.01"
                              value={tier.pv}
                              onChange={(e) => handleTierChange(product.id, 'pv', e.target.value)}
                              className="w-full px-1 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none text-center bg-white text-xs font-medium shadow-sm"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-2 py-1.5 bg-amber-50/30">
                            <input
                              type="number"
                              step="0.01"
                              value={tier.bv}
                              onChange={(e) => handleTierChange(product.id, 'bv', e.target.value)}
                              className="w-full px-1 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none text-center bg-white text-xs font-medium shadow-sm"
                              placeholder="0"
                            />
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center rounded-b-xl">
        <div className="flex items-center gap-2">
           <AlertCircle size={14} />
           <span>Değişiklikleri kaydetmeyi unutmayın.</span>
        </div>
        <div className="font-medium">Toplam: {localProducts.length}</div>
      </div>
    </div>
  );
};

export default BulkPriceEditor;