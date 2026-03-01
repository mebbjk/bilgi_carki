import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calculator,
  Settings,
  Package,
  Plus,
  Trash2,
  Edit,
  ShoppingCart,
  TrendingUp,
  Minus,
  Search,
  Users,
  Eye,
  Check,
  Info,
  FileQuestion,
  X,
  Save,
  Palette,
  BarChart2,
  PieChart,
  DollarSign,
  Menu,
  ChevronDown,
  ChevronUp,
  Network,
  Download,
  Upload,
  RefreshCw,
  List,
  TableProperties,
  MessageSquare,
  HeartPulse
} from 'lucide-react';
import { INITIAL_MEMBERSHIPS, INITIAL_PRODUCTS, INITIAL_TREE, INITIAL_DISEASE_CATEGORIES } from '../constants';
import { Membership, Product, CartItem, CalculationResult, NetworkNode, Experience, DiseaseCategory } from '../types';
import ProductForm from '../components/ProductForm';
import ComparisonChart from '../components/ComparisonChart';
import BulkPriceEditor from '../components/BulkPriceEditor';
import NetworkTree from '../components/NetworkTree';
import Experiences from '../components/Experiences';
import rawExperiencesData from '../data/telegram_experiences_full.json';

const ExperienceAccordion = ({ exp, index }: { exp: Experience, index: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white border text-sm border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div
        className="p-4 cursor-pointer hover:bg-slate-50 transition flex items-start justify-between gap-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-md">Deneyim #{index + 1}</span>
          </div>
          <div className="font-bold text-slate-800 flex items-center gap-2 mb-1">
            <HeartPulse size={16} className="text-rose-500 flex-shrink-0" />
            <span>Hastalık / Sorun:</span>
          </div>
          <p className={`text-slate-600 pl-6 ${!isOpen ? "line-clamp-2" : ""}`}>
            {exp.originalProblem}
          </p>
        </div>
        <div className="mt-6 text-slate-400">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Info size={16} className="text-purple-500 flex-shrink-0" /> Nasıl Kullanılmış / Süreç:
          </div>
          <p className="text-slate-600 whitespace-pre-wrap leading-relaxed pl-6">
            {exp.originalProduct}
          </p>
        </div>
      )}
    </div>
  );
};

function AdminView() {
  // State Initialization with LocalStorage Persistence
  const [activeTab, setActiveTab] = useState<'products' | 'compare' | 'memberships' | 'tree' | 'experiences'>('products');

  const [memberships, setMemberships] = useState<Membership[]>(() => {
    const saved = localStorage.getItem('tiens_memberships');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERSHIPS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tiens_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((p: Product) => {
        const initial = INITIAL_PRODUCTS.find(i => i.id === p.id);
        return initial ? { ...p, name: initial.name, image: initial.image, category: initial.category } : p;
      });
    }
    return INITIAL_PRODUCTS;
  });

  const [rootNode, setRootNode] = useState<NetworkNode>(() => {
    const saved = localStorage.getItem('tiens_tree');
    return saved ? JSON.parse(saved) : INITIAL_TREE;
  });

  const [diseaseCategories, setDiseaseCategories] = useState<DiseaseCategory[]>(() => {
    const saved = localStorage.getItem('tiens_disease_categories');
    return saved ? JSON.parse(saved) : INITIAL_DISEASE_CATEGORIES;
  });

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    const saved = localStorage.getItem('tiens_experiences');
    if (saved) return JSON.parse(saved);

    // İlk defa çalıştırıldığında JSON verisini çek ve Experience[] yapısına dönüştür
    return rawExperiencesData.map((exp: any) => ({
      id: exp.id || Math.random().toString(36).substr(2, 9),
      originalProblem: exp.problem || '',
      originalProduct: exp.product || '',
      categoryIds: [],
      productIds: [],
      status: 'uncategorized'
    }));
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');

  // Persistence Effects - Core Data
  useEffect(() => {
    localStorage.setItem('tiens_memberships', JSON.stringify(memberships));
  }, [memberships]);

  // Force sync old localstorage products with new images and names on load
  useEffect(() => {
    setProducts(prev => {
      let changed = false;
      const next = prev.map(p => {
        const initial = INITIAL_PRODUCTS.find(i => i.id === p.id);
        if (initial && (p.name !== initial.name || p.image !== initial.image)) {
          changed = true;
          return { ...p, name: initial.name, image: initial.image, category: initial.category };
        }
        return p;
      });
      return changed ? next : prev;
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('tiens_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tiens_tree', JSON.stringify(rootNode));
  }, [rootNode]);

  useEffect(() => {
    localStorage.setItem('tiens_disease_categories', JSON.stringify(diseaseCategories));
  }, [diseaseCategories]);

  useEffect(() => {
    localStorage.setItem('tiens_experiences', JSON.stringify(experiences));
  }, [experiences]);

  // Visibility State (Products Tab) - 'retail' included by default
  // Now persists to localStorage
  const [visibleMembershipIds, setVisibleMembershipIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tiens_visible_memberships');
    return saved ? JSON.parse(saved) : ['retail', 'platin'];
  });

  const [isVisibilityMenuOpen, setIsVisibilityMenuOpen] = useState(false);
  const [adminPhone, setAdminPhone] = useState(() => localStorage.getItem('tiens_admin_phone') || '905000000000');

  // Persist admin phone
  useEffect(() => {
    localStorage.setItem('tiens_admin_phone', adminPhone);
  }, [adminPhone]);
  const visibilityMenuRef = useRef<HTMLDivElement>(null);

  // Visibility State (Compare Tab)
  // Now persists to localStorage
  const [compareVisibleIds, setCompareVisibleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tiens_compare_visible');
    return saved ? JSON.parse(saved) : ['platin', 'altin', 'gumus', 'bronz'];
  });

  const [isCompareMenuOpen, setIsCompareMenuOpen] = useState(false);
  const compareMenuRef = useRef<HTMLDivElement>(null);

  // Chart Visibility
  // Now persists to localStorage
  const [visibleCharts, setVisibleCharts] = useState<string[]>(() => {
    const saved = localStorage.getItem('tiens_visible_charts');
    return saved ? JSON.parse(saved) : ['price', 'pv', 'bv'];
  });

  const [isCartExpandedMobile, setIsCartExpandedMobile] = useState(false);

  // Persistence Effects - UI Settings
  useEffect(() => {
    localStorage.setItem('tiens_visible_memberships', JSON.stringify(visibleMembershipIds));
  }, [visibleMembershipIds]);

  useEffect(() => {
    localStorage.setItem('tiens_compare_visible', JSON.stringify(compareVisibleIds));
  }, [compareVisibleIds]);

  useEffect(() => {
    localStorage.setItem('tiens_visible_charts', JSON.stringify(visibleCharts));
  }, [visibleCharts]);

  // Modals & UI Toggles
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [showBulkEditor, setShowBulkEditor] = useState(false);
  const [isAddingMembership, setIsAddingMembership] = useState(false);
  const [viewingProductExperiences, setViewingProductExperiences] = useState<string | null>(null);

  // Membership Editing State
  const [editingMembership, setEditingMembership] = useState<Membership | null>(null);
  const [newMembershipName, setNewMembershipName] = useState('');
  const [newMembershipColor, setNewMembershipColor] = useState('bg-slate-200 text-slate-800 border-slate-300');

  // Hidden File Input for Import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close visibility menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (visibilityMenuRef.current && !visibilityMenuRef.current.contains(event.target as Node)) {
        setIsVisibilityMenuOpen(false);
      }
      if (compareMenuRef.current && !compareMenuRef.current.contains(event.target as Node)) {
        setIsCompareMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['Tümü', ...Array.from(cats)];
  }, [products]);

  // Separate unique categories without 'Tümü' for the form
  const rawCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats);
  }, [products]);

  // --- Actions ---

  const addToCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId, quantity: 1 }];
    });
    // Auto expand cart on mobile when adding first item
    if (cart.length === 0) setIsCartExpandedMobile(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [...prev, product]);
    }
    setIsProductFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleBulkUpdate = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
  };

  const deleteProduct = (id: string) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      setCart(prev => prev.filter(item => item.productId !== id));
    }
  };

  const addMembership = () => {
    if (!newMembershipName.trim()) return;
    const id = newMembershipName.toLowerCase().replace(/\s+/g, '-');
    setMemberships(prev => [
      ...prev,
      {
        id,
        name: newMembershipName,
        color: newMembershipColor
      }
    ]);
    setNewMembershipName('');
    setIsAddingMembership(false);
    // Auto add to compare visibility
    setCompareVisibleIds(prev => [...prev, id]);
  };

  const updateMembership = () => {
    if (!editingMembership || !newMembershipName.trim()) return;

    setMemberships(prev => prev.map(m =>
      m.id === editingMembership.id
        ? { ...m, name: newMembershipName, color: newMembershipColor }
        : m
    ));
    setEditingMembership(null);
    setNewMembershipName('');
    setNewMembershipColor('bg-slate-100 text-slate-800 border-slate-300');
  };

  const removeMembership = (id: string) => {
    if (confirm('Bu üyeliği silmek istediğinize emin misiniz?')) {
      setMemberships(prev => prev.filter(m => m.id !== id));
      setVisibleMembershipIds(prev => prev.filter(vid => vid !== id));
      setCompareVisibleIds(prev => prev.filter(vid => vid !== id));
    }
  };

  const startEditMembership = (m: Membership) => {
    setEditingMembership(m);
    setNewMembershipName(m.name);
    setNewMembershipColor(m.color);
    setIsAddingMembership(true); // Open the form container
  };

  const toggleVisibility = (id: string) => {
    setVisibleMembershipIds(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const toggleCompareVisibility = (id: string) => {
    setCompareVisibleIds(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const toggleChartVisibility = (chartType: string) => {
    setVisibleCharts(prev =>
      prev.includes(chartType) ? prev.filter(c => c !== chartType) : [...prev, chartType]
    );
  };

  // --- Global Backup Functions ---

  const handleGlobalExport = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      data: {
        products,
        memberships,
        rootNode,
        experiences,
        diseaseCategories
      }
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tiens-tam-yedek-${new Date().toLocaleDateString('tr-TR').replace(/\./g, '-')}.json`;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("Yedekleme dosyası indirildi!\n\nTarayıcınızın 'İndirilenler' (Downloads) klasöründe 'tiens-tam-yedek-' ile başlayan dosyayı arayın.");
  };

  const handleGlobalImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.data) {
          if (json.data.products) setProducts(json.data.products);
          if (json.data.memberships) setMemberships(json.data.memberships);
          if (json.data.rootNode) setRootNode(json.data.rootNode);
          if (json.data.experiences) setExperiences(json.data.experiences);
          if (json.data.diseaseCategories) setDiseaseCategories(json.data.diseaseCategories);
          alert("Yedek başarıyla yüklendi!");
        } else {
          alert("Geçersiz yedek dosyası formatı.");
        }
      } catch (err) {
        alert("Dosya okunamadı.");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  const handleFactoryReset = () => {
    if (confirm('DİKKAT! Tüm ürünler, üyelik ayarları ve ağaç verisi silinip varsayılan ayarlara dönülecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?')) {
      setProducts(INITIAL_PRODUCTS);
      setMemberships(INITIAL_MEMBERSHIPS);
      setRootNode(INITIAL_TREE);
      setDiseaseCategories(INITIAL_DISEASE_CATEGORIES);
      // Clear core data
      localStorage.removeItem('tiens_products');
      localStorage.removeItem('tiens_memberships');
      localStorage.removeItem('tiens_tree');
      localStorage.removeItem('tiens_disease_categories');
      // Clear UI settings too
      localStorage.removeItem('tiens_visible_memberships');
      localStorage.removeItem('tiens_compare_visible');
      localStorage.removeItem('tiens_visible_charts');
      // Reset state
      setVisibleMembershipIds(['retail', 'platin']);
      setCompareVisibleIds(['platin', 'altin', 'gumus', 'bronz']);
      setVisibleCharts(['price', 'pv', 'bv']);
    }
  }

  // --- Calculations ---

  const comparisonResults = useMemo(() => {
    return memberships
      .filter(m => compareVisibleIds.includes(m.id))
      .map(membership => {
        let totalPrice = 0;
        let totalPV = 0;
        let totalBV = 0;
        let retailTotal = 0;

        cart.forEach(item => {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            // Safety check for tiers being undefined
            const tier = product.tiers?.[membership.id] || { price: 0, pv: 0, bv: 0 };
            totalPrice += tier.price * item.quantity;
            totalPV += tier.pv * item.quantity;
            totalBV += tier.bv * item.quantity;
            retailTotal += product.retailPrice * item.quantity;
          }
        });

        return {
          membershipId: membership.id,
          totalPrice,
          totalPV,
          totalBV,
          retailTotal,
          savings: retailTotal - totalPrice
        } as CalculationResult;
      });
  }, [cart, memberships, products, compareVisibleIds]);

  const cartTotalRetailPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      const product = products.find(p => p.id === item.productId);
      return acc + (product ? product.retailPrice * item.quantity : 0);
    }, 0);
  }, [cart, products]);

  // --- Render Helpers ---

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return price > 0 ? `₺${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Bilgi Yok';
  };

  const colorOptions = [
    { class: 'bg-slate-200 text-slate-800 border-slate-300', name: 'Gri' },
    { class: 'bg-yellow-100 text-yellow-800 border-yellow-300', name: 'Sarı' },
    { class: 'bg-orange-100 text-orange-800 border-orange-300', name: 'Turuncu' },
    { class: 'bg-blue-100 text-blue-800 border-blue-300', name: 'Mavi' },
    { class: 'bg-green-100 text-green-800 border-green-300', name: 'Yeşil' },
    { class: 'bg-purple-100 text-purple-800 border-purple-300', name: 'Mor' },
    { class: 'bg-pink-100 text-pink-800 border-pink-300', name: 'Pembe' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-inter text-slate-900">

      {/* Hidden Global File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleGlobalImport}
        accept=".json"
        className="hidden"
      />

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-shrink-0 flex-col transition-all duration-300 fixed h-full z-20">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50">
            <Calculator size={24} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">TiensCalc</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Package size={20} />
            <span className="font-medium">Ürünler</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'compare' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <TrendingUp size={20} />
            <span className="font-medium">Sepet</span>
            {cart.length > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tree')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'tree' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Network size={20} />
            <span className="font-medium">Ağaç</span>
          </button>

          <button
            onClick={() => setActiveTab('experiences')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'experiences' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <MessageSquare size={20} />
            <span className="font-medium">Deneyimler</span>
          </button>

          <button
            onClick={() => setActiveTab('memberships')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'memberships' ? 'bg-blue-600 shadow-lg shadow-blue-900/50 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Settings size={20} />
            <span className="font-medium">Ayarlar</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 text-slate-500 text-xs">
          v1.3.0 Pro
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 w-full flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-4 lg:px-8 py-4 flex items-center justify-between shadow-sm z-30 flex-shrink-0">
          <h1 className="text-xl lg:text-2xl font-bold text-slate-800 truncate mr-2">
            {activeTab === 'products' && 'Ürün Kataloğu'}
            {activeTab === 'compare' && 'Sepet'}
            {activeTab === 'tree' && 'Üyelik Ağacı'}
            {activeTab === 'experiences' && 'Ürün Deneyimleri'}
            {activeTab === 'memberships' && 'Uygulama Ayarları'}
          </h1>

          {activeTab === 'products' && (
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Ürün ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-48 lg:w-64 text-sm"
                />
              </div>
              <button
                onClick={() => { setEditingProduct(undefined); setIsProductFormOpen(true); }}
                className="bg-slate-900 text-white px-3 lg:px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition shadow-sm whitespace-nowrap text-sm lg:text-base"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Yeni Ürün</span>
                <span className="sm:hidden">Ekle</span>
              </button>
            </div>
          )}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-8 pb-24 lg:pb-8">

          {/* PRODUCT VIEW */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Mobile Search Bar */}
              <div className="md:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Ürün adı veya kategori ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-base"
                  />
                </div>
              </div>

              {/* Toolbar: Category Filters + View Settings */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

                {/* Desktop: Button List */}
                <div className="hidden md:flex gap-2 overflow-x-auto pb-2 scrollbar-hide max-w-full w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${selectedCategory === cat
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Mobile: Dropdown List (Replaces Scrollbar) */}
                <div className="md:hidden w-full relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <List size={18} />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <ChevronDown size={18} />
                  </div>
                </div>

                {/* View Visibility Toggle */}
                <div className="relative self-end sm:self-auto" ref={visibilityMenuRef}>
                  <button
                    onClick={() => setIsVisibilityMenuOpen(!isVisibilityMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm shadow-sm"
                  >
                    <Eye size={16} />
                    <span className="hidden sm:inline">Görünüm</span>
                    <span className="sm:hidden">Görünüm</span>
                  </button>

                  {isVisibilityMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 p-2 transform origin-top-right">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider p-2">Görünen Fiyatlar</h4>

                      {/* Retail Price Option */}
                      <button
                        onClick={() => toggleVisibility('retail')}
                        className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700 border-b border-slate-50 mb-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-slate-800"></span>
                          Liste Fiyatı
                        </div>
                        {visibleMembershipIds.includes('retail') && <Check size={14} className="text-blue-600" />}
                      </button>

                      {/* Memberships */}
                      {memberships.map(m => (
                        <button
                          key={m.id}
                          onClick={() => toggleVisibility(m.id)}
                          className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700"
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full ${m.color.split(' ')[0]}`}></span>
                            {m.name}
                          </div>
                          {visibleMembershipIds.includes(m.id) && <Check size={14} className="text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {filteredProducts.map(product => {
                  const inCart = cart.find(c => c.productId === product.id);
                  const productExps = experiences.filter(e => e.status === 'approved' && e.productIds.includes(product.id));
                  return (
                    <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
                      <div className="p-3 md:p-5 flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                            {product.category}
                          </span>
                          <div className="flex gap-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingProduct(product); setIsProductFormOpen(true); }} className="p-1.5 lg:p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => deleteProduct(product.id)} className="p-1.5 lg:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <h3 className="font-bold text-sm lg:text-lg text-slate-800 mb-4">{product.name}</h3>

                        <div className="space-y-2 lg:space-y-3">
                          {/* Retail Price - Conditional Visibility */}
                          {visibleMembershipIds.includes('retail') && (
                            <div className="flex justify-between text-xs lg:text-sm py-1 border-b border-slate-50">
                              <span className="text-slate-500 font-medium">Liste</span>
                              <span className="font-bold text-slate-800">{formatPrice(product.retailPrice)}</span>
                            </div>
                          )}

                          {/* Dynamic Memberships View */}
                          {visibleMembershipIds.filter(id => id !== 'retail').length > 0 ? (
                            visibleMembershipIds.map(memId => {
                              if (memId === 'retail') return null;
                              const mem = memberships.find(m => m.id === memId);
                              if (!mem) return null;
                              const tier = product.tiers[memId];
                              const hasData = tier && tier.price > 0;

                              return (
                                <div key={memId} className="bg-slate-50 rounded-lg p-2 text-[10px] lg:text-xs border border-slate-100/50">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-slate-700 flex items-center gap-1">
                                      <span className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${mem.color.split(' ')[0]}`}></span>
                                      {mem.name}
                                    </span>
                                    <span className={`font-bold ${hasData ? 'text-green-600' : 'text-slate-400'}`}>
                                      {formatPrice(tier?.price || 0)}
                                    </span>
                                  </div>
                                  <div className="flex gap-2 text-slate-500 justify-end">
                                    <span>PV: <strong className="text-slate-700">{tier?.pv || 0}</strong></span>
                                    <span>BV: <strong className="text-slate-700">{tier?.bv || 0}</strong></span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            !visibleMembershipIds.includes('retail') && (
                              <div className="text-center py-2 lg:py-4 text-xs lg:text-sm text-slate-400 italic bg-slate-50 rounded-lg border border-dashed border-slate-200">
                                Seçim yok
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      <div className="p-3 lg:p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                        {productExps.length > 0 && (
                          <button
                            onClick={() => {
                              // Modal'da göster
                              setViewingProductExperiences(product.id);
                            }}
                            className="w-full bg-blue-50 text-blue-700 font-medium py-2 rounded-lg lg:rounded-xl hover:bg-blue-100 transition flex items-center justify-center gap-2 shadow-sm active:scale-95 text-xs lg:text-sm border border-blue-200"
                          >
                            <HeartPulse size={16} />
                            Deneyim Oku ({productExps.length})
                          </button>
                        )}

                        {inCart ? (
                          <div className="flex items-center gap-2 w-full">
                            <button
                              onClick={() => updateQuantity(product.id, -1)}
                              className="h-9 w-9 lg:h-12 lg:w-12 flex items-center justify-center bg-white border border-slate-300 rounded-lg lg:rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="flex-1 text-center font-bold text-sm lg:text-lg text-slate-800 bg-white border border-slate-200 h-9 lg:h-12 flex items-center justify-center rounded-lg lg:rounded-xl shadow-sm">
                              {inCart.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, 1)}
                              className="h-9 w-9 lg:h-12 lg:w-12 flex items-center justify-center bg-white border border-slate-300 rounded-lg lg:rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product.id)}
                            className="w-full bg-slate-900 text-white font-medium py-2 lg:py-3 rounded-lg lg:rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2 shadow-sm active:scale-95 text-xs lg:text-sm"
                          >
                            <ShoppingCart size={16} />
                            Sepete Ekle
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* COMPARE VIEW */}
          {activeTab === 'compare' && (
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Cart Section - Collapsible on Mobile */}
              <div className="w-full lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                  {/* Cart Header (Clickable on mobile to toggle) */}
                  <div
                    className="p-4 lg:p-6 bg-white border-b border-slate-100 flex items-center justify-between cursor-pointer lg:cursor-default sticky top-0 z-10"
                    onClick={() => window.innerWidth < 1024 && setIsCartExpandedMobile(!isCartExpandedMobile)}
                  >
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <ShoppingCart size={20} className="text-blue-600" />
                      Sepet ({cart.reduce((a, b) => a + b.quantity, 0)})
                    </h3>
                    <div className="lg:hidden text-slate-400">
                      {isCartExpandedMobile ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>

                  {/* Cart Items Content */}
                  <div className={`${isCartExpandedMobile ? 'block' : 'hidden'} lg:block transition-all`}>
                    <div className="p-4 lg:p-6 pt-0">
                      {cart.length === 0 ? (
                        <div className="text-center py-8 lg:py-12 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200 mt-4">
                          Sepetiniz boş.
                        </div>
                      ) : (
                        <div className="max-h-full lg:max-h-[calc(100vh-280px)] overflow-y-auto pr-0 lg:pr-2 space-y-3 mt-4">
                          {cart.map(item => {
                            const product = products.find(p => p.id === item.productId);
                            if (!product) return null;
                            return (
                              <div key={item.productId} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex-1 min-w-0 pr-2">
                                  <div className="font-medium text-slate-800 truncate">{product.name}</div>
                                  <div className="text-xs text-slate-500">Liste: {formatPrice(product.retailPrice)}</div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.productId, -1) }} className="h-9 w-9 flex items-center justify-center bg-white border border-slate-300 rounded-lg hover:bg-slate-50 active:scale-95"><Minus size={16} /></button>
                                  <span className="w-8 text-center font-bold text-slate-800 text-base">{item.quantity}</span>
                                  <button onClick={(e) => { e.stopPropagation(); updateQuantity(item.productId, 1) }} className="h-9 w-9 flex items-center justify-center bg-white border border-slate-300 rounded-lg hover:bg-slate-50 active:scale-95"><Plus size={16} /></button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {cart.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                          <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                            <span>Toplam Liste Fiyatı</span>
                            <span className="text-slate-900 font-bold text-lg">{formatPrice(cartTotalRetailPrice)}</span>
                          </div>
                          <button
                            onClick={() => setCart([])}
                            className="w-full py-3 text-center text-red-500 text-sm hover:bg-red-50 rounded-xl transition flex items-center justify-center gap-1 font-medium bg-red-50/50"
                          >
                            <Trash2 size={18} /> Sepeti Temizle
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Section */}
              <div className="w-full lg:w-2/3 space-y-6 order-1 lg:order-2">

                {/* Control Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">

                  {/* Toggle Charts */}
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-full sm:w-auto">
                    <button
                      onClick={() => toggleChartVisibility('price')}
                      className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition ${visibleCharts.includes('price') ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <DollarSign size={16} /> <span className="hidden sm:inline">Fiyat</span>
                    </button>
                    <button
                      onClick={() => toggleChartVisibility('pv')}
                      className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition ${visibleCharts.includes('pv') ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <BarChart2 size={16} /> <span className="hidden sm:inline">PV</span>
                    </button>
                    <button
                      onClick={() => toggleChartVisibility('bv')}
                      className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition ${visibleCharts.includes('bv') ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <PieChart size={16} /> <span className="hidden sm:inline">BV</span>
                    </button>
                  </div>

                  {/* Toggle Memberships */}
                  <div className="relative w-full sm:w-auto" ref={compareMenuRef}>
                    <button
                      onClick={() => setIsCompareMenuOpen(!isCompareMenuOpen)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm shadow-sm"
                    >
                      <Eye size={18} />
                      Filtrele
                      <ChevronDown size={16} />
                    </button>

                    {isCompareMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-full sm:w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 p-2">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider p-2">Görünen Üyelikler</h4>
                        {memberships.map(m => (
                          <button
                            key={m.id}
                            onClick={() => toggleCompareVisibility(m.id)}
                            className="w-full flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg text-sm text-slate-700"
                          >
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${m.color.split(' ')[0]}`}></span>
                              {m.name}
                            </div>
                            {compareVisibleIds.includes(m.id) && <Check size={14} className="text-blue-600" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Charts Area */}
                {cart.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    {visibleCharts.includes('price') && (
                      <div className={`${visibleCharts.length === 1 ? 'md:col-span-3' : visibleCharts.length === 2 ? 'md:col-span-1' : ''}`}>
                        <ComparisonChart
                          results={comparisonResults}
                          memberships={memberships}
                          dataKey="totalPrice"
                          title="Fiyat Karşılaştırması"
                          color="#3b82f6"
                        />
                      </div>
                    )}
                    {visibleCharts.includes('pv') && (
                      <div className={`${visibleCharts.length === 1 ? 'md:col-span-3' : visibleCharts.length === 2 ? 'md:col-span-1' : ''}`}>
                        <ComparisonChart
                          results={comparisonResults}
                          memberships={memberships}
                          dataKey="totalPV"
                          title="PV Karşılaştırması"
                          color="#10b981"
                        />
                      </div>
                    )}
                    {visibleCharts.includes('bv') && (
                      <div className={`${visibleCharts.length === 1 ? 'md:col-span-3' : visibleCharts.length === 2 ? 'md:col-span-1' : ''}`}>
                        <ComparisonChart
                          results={comparisonResults}
                          memberships={memberships}
                          dataKey="totalBV"
                          title="BV Karşılaştırması"
                          color="#f59e0b"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Cards Grid */}
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                  {comparisonResults.map(res => {
                    const membership = memberships.find(m => m.id === res.membershipId);
                    if (!membership) return null;
                    return (
                      <div key={res.membershipId} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative group">
                        <div className={`h-1.5 w-full ${membership.color.split(' ')[0].replace('bg-', 'bg-')}`}></div>
                        <div className="p-3 lg:p-6">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-base lg:text-xl font-bold text-slate-800 truncate">{membership.name}</h3>
                            <span className={`text-[9px] lg:text-xs px-2 py-0.5 rounded border ${membership.color} font-medium`}>Üyelik</span>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-end">
                              <span className="text-slate-500 text-xs lg:text-sm">Toplam Tutar</span>
                              <span className="text-lg lg:text-2xl font-bold text-slate-800">{formatPrice(res.totalPrice)}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 lg:gap-3 pt-3 lg:pt-4 border-t border-slate-100">
                              <div className="bg-emerald-50 p-2 lg:p-3 rounded-lg border border-emerald-100 text-center">
                                <div className="text-[9px] lg:text-[10px] text-emerald-600 font-bold uppercase mb-1">Toplam PV</div>
                                <div className="text-sm lg:text-lg font-bold text-emerald-800">{res.totalPV.toFixed(2)}</div>
                              </div>
                              <div className="bg-amber-50 p-2 lg:p-3 rounded-lg border border-amber-100 text-center">
                                <div className="text-[9px] lg:text-[10px] text-amber-600 font-bold uppercase mb-1">Toplam BV</div>
                                <div className="text-sm lg:text-lg font-bold text-amber-800">{res.totalBV.toFixed(2)}</div>
                              </div>
                            </div>

                            <div className="pt-2 text-center text-[10px] lg:text-sm text-slate-500">
                              Liste fiyatına göre kazanç: <div className="text-green-600 font-bold">{formatPrice(res.savings)}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TREE VIEW */}
          {activeTab === 'tree' && (
            <NetworkTree
              memberships={memberships}
              rootNode={rootNode}
              setRootNode={setRootNode}
            />
          )}

          {/* MEMBERSHIPS / SETTINGS VIEW */}
          {activeTab === 'memberships' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Settings size={20} className="text-slate-500" />
                  Üyelik Yönetimi
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {memberships.map(m => (
                    <div key={m.id} className={`p-4 rounded-xl border-2 ${m.color.replace('bg-', 'bg-opacity-20 border-')}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`w-3 h-3 rounded-full ${m.color.split(' ')[0]}`}></span>
                        <div className="flex gap-1">
                          <button onClick={() => startEditMembership(m)} className="p-1.5 hover:bg-white/50 rounded-lg text-slate-500 hover:text-blue-600 transition"><Edit size={16} /></button>
                          <button onClick={() => removeMembership(m.id)} className="p-1.5 hover:bg-white/50 rounded-lg text-slate-500 hover:text-red-600 transition"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      <div className="font-bold text-slate-800 truncate">{m.name}</div>
                      <div className="text-xs text-slate-500 mt-1 uppercase tracking-wide truncate">ID: {m.id}</div>
                    </div>
                  ))}

                  {/* Add New Membership Card */}
                  <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 transition cursor-pointer min-h-[120px]" onClick={() => { setIsAddingMembership(true); setEditingMembership(null); setNewMembershipName(''); }}>
                    <Plus size={24} className="mb-2" />
                    <span className="font-medium text-center text-sm">Yeni Ekle</span>
                  </div>
                </div>

                {/* Add/Edit Membership Form (Inline or Modal logic) */}
                {isAddingMembership && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-800">{editingMembership ? 'Üyeliği Düzenle' : 'Yeni Üyelik Oluştur'}</h4>
                      <button onClick={() => setIsAddingMembership(false)}><X size={20} className="text-slate-400 hover:text-slate-600" /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">Üyelik Adı</label>
                        <input
                          type="text"
                          value={newMembershipName}
                          onChange={(e) => setNewMembershipName(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900 placeholder-slate-400"
                          placeholder="Örn: Elmas"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">Renk Teması</label>
                        <div className="flex flex-wrap gap-3">
                          {colorOptions.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => setNewMembershipColor(opt.class)}
                              className={`w-10 h-10 rounded-full border shadow-sm transition-all flex items-center justify-center ${opt.class} ${newMembershipColor === opt.class
                                ? 'ring-2 ring-offset-2 ring-blue-500 scale-110'
                                : 'opacity-60 hover:opacity-100 hover:scale-105'
                                }`}
                              title={opt.name}
                            >
                              {newMembershipColor === opt.class && <Check size={16} className="opacity-75" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button onClick={() => setIsAddingMembership(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg transition">İptal</button>
                      <button onClick={editingMembership ? updateMembership : addMembership} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
                        <Save size={18} /> Kaydet
                      </button>
                    </div>
                  </div>
                )}

                {/* Admin Contact Settings */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <h4 className="font-bold text-slate-800 mb-2 whitespace-nowrap">Müşteri Siparişleri İçin WhatsApp Numarası</h4>
                  <p className="text-xs text-slate-500 mb-3">Müşterilerinizin vitrin sayfanızdan oluşturduğu siparişler bu numaraya gönderilecektir.</p>
                  <div className="flex items-center">
                    <span className="px-4 py-2 bg-slate-100 border border-slate-300 border-r-0 rounded-l-lg text-slate-600 font-mono font-bold">+90 5</span>
                    <input
                      type="text"
                      value={adminPhone.startsWith('905') ? adminPhone.slice(3) : adminPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                        setAdminPhone('905' + val);
                      }}
                      className="w-full max-w-[200px] px-4 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-900 placeholder-slate-400 font-mono tracking-widest font-bold"
                      placeholder="XX XXX XX XX"
                    />
                  </div>
                </div>
              </div>

              {/* Data Management Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Save size={20} className="text-slate-500" />
                  Veri Yönetimi
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium">
                    <Upload size={18} /> Yedek Yükle
                  </button>
                  <button onClick={handleGlobalExport} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium">
                    <Download size={18} /> Yedek İndir
                  </button>
                  <button onClick={() => setShowBulkEditor(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition font-medium border border-blue-200">
                    <TableProperties size={18} /> Toplu Fiyat Düzenleyici
                  </button>
                  <button onClick={() => {
                    if (window.confirm('Tüm Deneyimleri sıfırlayıp Telegram dosyasındaki en son güncel listeyi (1000+ tam metin) yeniden yüklemek istediğinize emin misiniz? (Onaylılar da siliir!)')) {
                      localStorage.removeItem('tiens_experiences');
                      window.location.reload();
                    }
                  }} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition font-medium border border-purple-200">
                    <RefreshCw size={18} /> Deneyim Kütüphanesini Sıfırla
                  </button>
                  <button onClick={handleFactoryReset} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium border border-red-200 ml-auto">
                    <RefreshCw size={18} /> Fabrika Ayarlarına Dön
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experiences' && (
            <Experiences
              experiences={experiences}
              setExperiences={setExperiences}
              products={products}
              diseaseCategories={diseaseCategories}
              setDiseaseCategories={setDiseaseCategories}
            />
          )}
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-40 lg:hidden safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg w-16 transition-colors ${activeTab === 'products' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Package size={20} />
          <span className="text-[10px] mt-1 font-medium">Ürünler</span>
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`relative flex flex-col items-center justify-center p-2 rounded-lg w-16 transition-colors ${activeTab === 'compare' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <TrendingUp size={20} />
          <span className="text-[10px] mt-1 font-medium">Sepet</span>
          {cart.length > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('tree')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg w-16 transition-colors ${activeTab === 'tree' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Network size={20} />
          <span className="text-[10px] mt-1 font-medium">Ağaç</span>
        </button>
        <button
          onClick={() => setActiveTab('experiences')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg w-16 transition-colors ${activeTab === 'experiences' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <MessageSquare size={20} />
          <span className="text-[10px] mt-1 font-medium">Deneyim</span>
        </button>
        <button
          onClick={() => setActiveTab('memberships')}
          className={`flex flex-col items-center justify-center p-2 rounded-lg w-16 transition-colors ${activeTab === 'memberships' ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Settings size={20} />
          <span className="text-[10px] mt-1 font-medium">Ayarlar</span>
        </button>
      </nav>

      {/* Modals */}
      {isProductFormOpen && (
        <ProductForm
          product={editingProduct}
          memberships={memberships}
          existingCategories={rawCategories}
          onSave={handleSaveProduct}
          onCancel={() => { setIsProductFormOpen(false); setEditingProduct(undefined); }}
        />
      )}

      {showBulkEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-6xl max-h-[90vh] flex flex-col relative">
            <button onClick={() => setShowBulkEditor(false)} className="absolute -top-10 right-0 text-white hover:text-slate-200 transition">
              <X size={24} />
            </button>
            <BulkPriceEditor
              products={products}
              memberships={memberships}
              onSave={(updated) => { handleBulkUpdate(updated); setShowBulkEditor(false); }}
            />
          </div>
        </div>
      )}

      {viewingProductExperiences && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HeartPulse size={20} className="text-rose-500" />
                {products.find(p => p.id === viewingProductExperiences)?.name}
              </h3>
              <button
                onClick={() => setViewingProductExperiences(null)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 p-1.5 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-4 classic-scrollbar bg-slate-50 flex-1">
              {experiences.filter(e => e.status === 'approved' && e.productIds.includes(viewingProductExperiences)).map((exp, idx) => (
                <ExperienceAccordion key={exp.id} exp={exp} index={idx} />
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminView;