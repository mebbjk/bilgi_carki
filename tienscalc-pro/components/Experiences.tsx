import React, { useState } from 'react';
import { Search, HeartPulse, Pill, Info, Edit, Check, X, FileQuestion, ChevronRight, Save, Trash2, Tag, Plus } from 'lucide-react';
import { Experience, Product, DiseaseCategory } from '../types';

interface ExperiencesProps {
    experiences: Experience[];
    setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
    products: Product[];
    diseaseCategories: DiseaseCategory[];
    setDiseaseCategories: React.Dispatch<React.SetStateAction<DiseaseCategory[]>>;
}

// Basic cleanup for presentation
const cleanText = (text: string) => {
    return text.trim().replace(/^[:\-\s]+/, '').replace(/[:\-\s]+$/, '');
};

const Experiences: React.FC<ExperiencesProps> = ({ experiences, setExperiences, products, diseaseCategories, setDiseaseCategories }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'categories' | 'uncategorized'>('categories');

    // Yöneticinin o an seçtiği kategori
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(diseaseCategories[0]?.id || '');

    // Edit Modal State
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [editCategories, setEditCategories] = useState<string[]>([]);
    const [editProducts, setEditProducts] = useState<string[]>([]);

    const approvedExperiences = experiences.filter((e: Experience) => e.status === 'approved');
    const uncategorizedExperiences = experiences.filter((e: Experience) => e.status === 'uncategorized');

    // Kategoride Gösterilecekler
    const displayedExperiences = approvedExperiences.filter((exp: Experience) => {
        const matchesCategory = exp.categoryIds.includes(selectedCategoryId);
        if (!searchTerm) return matchesCategory;

        const search = searchTerm.toLowerCase();
        return matchesCategory && (
            (exp.originalProblem || '').toLowerCase().includes(search) ||
            (exp.originalProduct || '').toLowerCase().includes(search)
        );
    });

    const openEditModal = (exp: Experience) => {
        setEditingExp(exp);
        setEditCategories([...exp.categoryIds]);
        setEditProducts([...exp.productIds]);
    };

    const closeEditModal = () => {
        setEditingExp(null);
        setEditCategories([]);
        setEditProducts([]);
    };

    const toggleCategory = (id: string) => {
        if (editCategories.includes(id)) {
            setEditCategories(editCategories.filter(c => c !== id));
        } else {
            setEditCategories([...editCategories, id]);
        }
    };

    const toggleProduct = (id: string) => {
        if (editProducts.includes(id)) {
            setEditProducts(editProducts.filter(p => p !== id));
        } else {
            setEditProducts([...editProducts, id]);
        }
    };

    const saveExperience = () => {
        if (!editingExp) return;

        const updatedExp: Experience = {
            ...editingExp,
            categoryIds: editCategories,
            productIds: editProducts,
            status: 'approved'
        };

        setExperiences(prev => prev.map((e: Experience) => e.id === updatedExp.id ? updatedExp : e));
        closeEditModal();
    };

    const deleteExperience = (id: string) => {
        setExperiences(prev => prev.filter((e: Experience) => e.id !== id));
    };

    const addNewCategory = () => {
        const name = window.prompt("Yeni eklenecek hastalık genel başlığını yazın (Örn: Göz, Sinir Sistemi):");
        if (name && name.trim()) {
            const newCat: DiseaseCategory = {
                id: name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 4),
                name: name.trim()
            };
            setDiseaseCategories(prev => [...prev, newCat]);
            setSelectedCategoryId(newCat.id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <HeartPulse className="text-red-500" />
                            Tiens Kullanıcı Deneyim Kütüphanesi
                        </h2>
                        <p className="text-slate-500 text-sm">
                            Kategorize edilmiş, düzenlenmiş ve filtrelenebilir kullanıcı tecrübeleri.
                        </p>
                    </div>

                    {/* Yönetici Menüsü */}
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 whitespace-nowrap overflow-x-auto w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'categories' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Kütüphane
                        </button>
                        <button
                            onClick={() => setActiveTab('uncategorized')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition flex items-center gap-2 ${activeTab === 'uncategorized' ? 'bg-white shadow-sm text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <FileQuestion size={16} />
                            Düzenlenecekler
                            <span className="bg-orange-100 text-orange-600 text-xs py-0.5 px-2 rounded-full font-bold ml-1">{uncategorizedExperiences.length}</span>
                        </button>
                    </div>
                </div>

                {activeTab === 'categories' && (
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sol Menü: Kategoriler */}
                        <div className="w-full lg:w-1/4 space-y-2 flex-shrink-0">
                            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-3 px-2">Hastalık Kategorileri</h3>
                            <div className="flex flex-col gap-1 overflow-y-auto max-h-[60vh] lg:pr-2">
                                {diseaseCategories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            setSelectedCategoryId(cat.id);
                                            setSearchTerm('');
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center justify-between group border ${selectedCategoryId === cat.id ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50 hover:border-blue-200'}`}
                                    >
                                        <span className="font-medium text-sm truncate pr-2">{cat.name}</span>
                                        <ChevronRight size={16} className={`transition-opacity flex-shrink-0 ${selectedCategoryId === cat.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 text-blue-400'}`} />
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => addNewCategory()}
                                type="button"
                                className="w-full mt-2 text-left px-4 py-3 rounded-xl transition flex items-center justify-center gap-2 border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-medium active:scale-95"
                            >
                                <Plus size={16} /> <span>Yeni Kategori Ekle</span>
                            </button>
                        </div>

                        {/* Sağ Kısım: Deneyim Kartları */}
                        <div className="w-full lg:w-3/4 flex flex-col min-h-[50vh]">
                            <div className="relative mb-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder={`${diseaseCategories.find(c => c.id === selectedCategoryId)?.name || 'Kategori'} içinde ara...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 shadow-sm"
                                />
                            </div>

                            {displayedExperiences.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                    <HeartPulse size={48} className="text-slate-300 mb-4" />
                                    <h4 className="text-lg font-bold text-slate-700 mb-2">Bu Kategori Boş</h4>
                                    <p className="text-slate-500 max-w-sm">Bu kategoriye ait herhangi bir onaylanmış deneyim bulunmuyor veya arama kriterinize uygun sonuç yok.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
                                    {displayedExperiences.map((exp: Experience) => (
                                        <div key={exp.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition bg-gradient-to-b from-white to-slate-50 relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>

                                            <button
                                                onClick={() => openEditModal(exp)}
                                                className="absolute top-3 right-3 p-1.5 bg-white text-slate-400 hover:text-blue-600 rounded-lg border border-slate-200 shadow-sm opacity-0 group-hover:opacity-100 transition"
                                                title="Düzenle"
                                            >
                                                <Edit size={14} />
                                            </button>

                                            <h3 className="font-semibold text-slate-800 mb-4 text-base leading-snug">
                                                {cleanText(exp.originalProblem)}
                                            </h3>

                                            <div className="space-y-3">
                                                <div className="flex items-start gap-2 bg-slate-100 text-slate-700 p-3 rounded-lg border border-slate-200 text-sm">
                                                    <Info size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                                                    <p className="leading-relaxed whitespace-pre-wrap">
                                                        {cleanText(exp.originalProduct)}
                                                    </p>
                                                </div>

                                                {exp.productIds.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                                                        {exp.productIds.map((pid: string) => {
                                                            const p = products.find(x => x.id === pid);
                                                            return p ? (
                                                                <span key={pid} className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-1 rounded-md font-medium">
                                                                    <Pill size={12} /> {p.name}
                                                                </span>
                                                            ) : null;
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'uncategorized' && (
                    <div className="space-y-4">
                        <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl text-orange-800 flex items-start gap-3">
                            <Info size={20} className="flex-shrink-0 text-orange-500 mt-0.5" />
                            <p className="text-sm leading-relaxed">
                                Bu kısımı sadece yönetici görür. Telegram'dan otomatik olarak çekilen ham veriler burada listelenir. Oku, düzenle ve "Hastalık Kategorisi" ile "İlgili Ürünler"i bağlayarak kütüphaneye gönder veya sil.
                            </p>
                        </div>

                        {uncategorizedExperiences.length === 0 ? (
                            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                Tüm deneyimler düzenlenmiş ve kütüphaneye eklenmiş. Harika iş!
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {uncategorizedExperiences.map((exp: Experience) => (
                                    <div key={exp.id} className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm flex flex-col">
                                        <div className="flex-1 mb-4 space-y-3">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ham Sorun Metni</span>
                                                <p className="text-sm font-medium text-slate-800 line-clamp-2 mt-1">{cleanText(exp.originalProblem)}</p>
                                            </div>
                                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Ham Çözüm Metni</span>
                                                <p className="text-xs text-slate-600 line-clamp-3">{cleanText(exp.originalProduct)}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-auto pt-3 border-t border-slate-100">
                                            <button
                                                onClick={() => openEditModal(exp)}
                                                className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2"
                                            >
                                                <Edit size={16} /> Düzenle & Onayla
                                            </button>
                                            <button
                                                onClick={() => deleteExperience(exp.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition"
                                                title="Çöp olarak işaretle"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Edit / Categorize Modal */}
            {editingExp && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-[95vw] xl:max-w-7xl rounded-2xl shadow-xl flex flex-col max-h-[95vh] overflow-hidden">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Tag size={20} className="text-blue-500" />
                                Deneyim Yönetimi
                            </h3>
                            <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6 lg:gap-8 bg-slate-50">

                            {/* Sol Kolon: Ürünler (Üst) ve Deneyim Detayı (Alt) */}
                            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                                {/* Ürünler */}
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[280px]">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Pill size={16} className="text-emerald-500" />
                                            İlişkilendirilecek Ürün(ler)
                                        </label>
                                        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{editProducts.length} seçili</span>
                                    </div>
                                    <div className="overflow-y-auto p-1 flex-1 classic-scrollbar pr-2 space-y-4">
                                        {Array.from(new Set(products.map((p: Product) => p.category))).map(categoryGroup => (
                                            <div key={categoryGroup}>
                                                <h5 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider sticky top-0 bg-white py-1 z-10">{categoryGroup}</h5>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                                                    {products.filter((p: Product) => p.category === categoryGroup).map((p: Product) => (
                                                        <button
                                                            key={p.id}
                                                            onClick={() => toggleProduct(p.id)}
                                                            className={`flex items-start gap-2 p-2.5 rounded-lg border text-left text-sm transition-all ${editProducts.includes(p.id) ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-medium shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50'}`}
                                                        >
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${editProducts.includes(p.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                                                                {editProducts.includes(p.id) && <Check size={12} />}
                                                            </div>
                                                            <span className="whitespace-normal break-words leading-tight">{p.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Deneyim Çözüm / İyileşme Detayı */}
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-[250px]">
                                    <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                        <Info size={16} className="text-purple-500" />
                                        Deneyim Detayları & Süreç
                                    </label>
                                    <textarea
                                        value={editingExp.originalProduct}
                                        onChange={(e) => {
                                            setEditingExp({ ...editingExp, originalProduct: e.target.value });
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                        placeholder="Nasıl kullanmış, iyileşme süreci..."
                                        className="w-full flex-1 min-h-[150px] p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none resize-y text-sm text-slate-700 bg-slate-50"
                                    />
                                </div>
                            </div>

                            {/* Sağ Kolon: Hastalıklar (Üst) ve Hastalık Metni (Alt) */}
                            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                                {/* Hastalık Kategorileri */}
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[280px]">
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <HeartPulse size={16} className="text-blue-500" />
                                            İlgili Hastalık(lar)
                                        </label>
                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{editCategories.length} seçili</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 overflow-y-auto p-1 flex-1 classic-scrollbar pr-2 content-start">
                                        {diseaseCategories.map(cat => (
                                            <button
                                                key={cat.id}
                                                onClick={() => toggleCategory(cat.id)}
                                                className={`flex items-start gap-2 p-2.5 rounded-lg border text-left text-sm transition-all ${editCategories.includes(cat.id) ? 'bg-blue-50 border-blue-500 text-blue-800 font-medium shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50'}`}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${editCategories.includes(cat.id) ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300 bg-white'}`}>
                                                    {editCategories.includes(cat.id) && <Check size={12} />}
                                                </div>
                                                <span className="whitespace-normal break-words leading-tight">{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Ham Sorun / Hastalık Metni */}
                                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-[250px]">
                                    <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                        <FileQuestion size={16} className="text-rose-500" />
                                        Hastalık / Sorun Metni (Ham Veri)
                                    </label>
                                    <textarea
                                        value={editingExp.originalProblem}
                                        onChange={(e) => {
                                            setEditingExp({ ...editingExp, originalProblem: e.target.value });
                                            e.target.style.height = 'auto';
                                            e.target.style.height = e.target.scrollHeight + 'px';
                                        }}
                                        className="w-full flex-1 min-h-[150px] p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none resize-y text-sm text-slate-700 bg-slate-50"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 lg:p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50">
                            {editingExp.status === 'approved' && (
                                <button onClick={() => deleteExperience(editingExp.id)} className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition text-sm font-medium">
                                    Deneyimi Sil
                                </button>
                            )}
                            <div className="flex gap-3 ml-auto">
                                <button onClick={closeEditModal} className="px-5 py-2.5 text-slate-600 hover:bg-slate-200 rounded-xl transition font-medium">İptal</button>
                                <button
                                    onClick={saveExperience}
                                    disabled={editCategories.length === 0}
                                    className={`px-5 py-2.5 rounded-xl transition flex items-center gap-2 font-bold ${editCategories.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'}`}
                                >
                                    <Save size={18} /> Sistemi Güncelle
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Experiences;
