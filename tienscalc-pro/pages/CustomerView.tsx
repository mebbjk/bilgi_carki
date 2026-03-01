import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Minus, Info, HeartPulse, ChevronDown, ChevronUp, FileQuestion, Star, MoveRight, LogIn, LogOut } from 'lucide-react';
import { auth, loginWithGoogle, logout } from '../firebase';
import { Product, CartItem, Experience, Membership, CalculationResult } from '../types';
import { INITIAL_PRODUCTS, INITIAL_MEMBERSHIPS, INITIAL_DISEASE_CATEGORIES } from '../constants';

const CustomerView = () => {
    // Load data from LocalStorage to sync with what Admin updates
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

    const [memberships, setMemberships] = useState<Membership[]>(() => {
        const saved = localStorage.getItem('tiens_memberships');
        return saved ? JSON.parse(saved) : INITIAL_MEMBERSHIPS;
    });

    const [experiences, setExperiences] = useState<Experience[]>(() => {
        const saved = localStorage.getItem('tiens_experiences');
        return saved ? JSON.parse(saved) : [];
    });

    // Since admin whatsapp isn't set yet (future feature), we will use a demo one or allow setting it later.
    // For now, let's assume we read admin whatsapp from local storage or default
    const adminPhone = localStorage.getItem('tiens_admin_phone') || "905000000000";

    const [user, setUser] = useState<any>(auth ? auth.currentUser : null);
    const [authLoading, setAuthLoading] = useState(!!auth);

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
        if (!auth) {
            setAuthLoading(false);
            return;
        }
        return auth.onAuthStateChanged((u) => {
            setUser(u);
            setAuthLoading(false);
        });
    }, []);

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
            window.location.href = '/admin';
        } catch (e: any) {
            alert(e.message);
        }
    };

    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
    const [activeTab, setActiveTab] = useState<'katalog' | 'deneyim' | 'sertifika'>('katalog');
    const [isCartExpandedMobile, setIsCartExpandedMobile] = useState(false);
    const [viewingProductExperiences, setViewingProductExperiences] = useState<string | null>(null);

    const categories = useMemo(() => {
        const cats = new Set(products.map(p => p.category));
        return ['Tümü', ...Array.from(cats)];
    }, [products]);

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'Tümü' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const formatPrice = (price: number) => {
        return price > 0 ? `₺${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Bilgi Yok';
    };

    const addToCart = (productId: string) => {
        setCart(prev => {
            const existing = prev.find(item => item.productId === productId);
            if (existing) {
                return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { productId, quantity: 1 }];
        });
        if (cart.length === 0) setIsCartExpandedMobile(true);
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity: Math.max(0, item.quantity + delta) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    // --- Calculations ---

    const calculateCartForMembership = (membershipId: string | 'retail') => {
        let totalPrice = 0;
        let totalBV = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                if (membershipId === 'retail') {
                    totalPrice += product.retailPrice * item.quantity;
                } else {
                    const tier = product.tiers?.[membershipId] || { price: 0, pv: 0, bv: 0 };
                    totalPrice += tier.price * item.quantity;
                    totalBV += tier.bv * item.quantity;
                }
            }
        });

        return { totalPrice, totalBV };
    };

    const retailCartResult = calculateCartForMembership('retail');
    const bronzCartResult = calculateCartForMembership('bronz');
    const gumusCartResult = calculateCartForMembership('gumus');
    const altinCartResult = calculateCartForMembership('altin');
    const platinCartResult = calculateCartForMembership('platin');

    const savingsWithBronz = retailCartResult.totalPrice - bronzCartResult.totalPrice;
    const savingsWithGumus = retailCartResult.totalPrice - gumusCartResult.totalPrice;
    const savingsWithAltin = retailCartResult.totalPrice - altinCartResult.totalPrice;

    // --- Whatsapp Logic ---
    const sendOrderViaWhatsapp = (isMember: boolean) => {
        const cartSummary = cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            return product ? `- ${product.name} (x${item.quantity})` : '';
        }).join('\n');

        let membershipText = isMember
            ? "\n\nSiparişi İndirimli Liste (Bronz Avantajı) ile almak ve sisteme kaydolmak istiyorum. Kayıt için dönüşünüzü bekliyorum."
            : "\n\nSiparişi Liste Fiyatından perakende olarak almak istiyorum. \n\nAdres/İletişim Bilgileri: [Lütfen adresinizi ve ödeme tercihinizi (Havale/Kredi Kartı vb.) buraya yazınız]";

        // Kargo/Distribütör Uyarısı (BV = Puan)
        const under50Memberships = [];
        if (bronzCartResult.totalBV < 50) under50Memberships.push('Bronz');
        if (gumusCartResult.totalBV < 50) under50Memberships.push('Gümüş');
        if (altinCartResult.totalBV < 50) under50Memberships.push('Altın');
        if (platinCartResult.totalBV < 50) under50Memberships.push('Platin');

        let distributorWarning = "\n\n------------------\n[🤖 Distribütör Notu (TiensCalc Pro)]:\n";
        if (under50Memberships.length > 0) {
            if (under50Memberships.length === 4) {
                distributorWarning += "⚠️ Dikkat! Bu sepet tüm üyelik paketlerinden girilirse 50 Puan (BV) altında kaldığı için kargo ücreti çıkacaktır!";
            } else {
                distributorWarning += `⚠️ Dikkat! Bu sipariş panelden ${under50Memberships.join(', ')} seviyesi üzerinden girilirse, 50 Puan (BV) altında kaldığı için kargo ücreti çıkacaktır. Panele girerken siparişteki puan toplamlarına dikkat ediniz.`;
            }
        } else {
            distributorWarning += "✅ Bu sipariş tüm üyelik paketlerinde 50 Puanı geçmektedir, kargo bedavadır.";
        }

        const message = `Merhaba, aşağıdaki ürünlerden sipariş oluşturmak istiyorum:\n\n${cartSummary}\n\nToplam Liste Fiyatı: ${formatPrice(retailCartResult.totalPrice)}${membershipText}${distributorWarning}`;

        // Yönlendirme
        const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const ExperienceAccordionCustomer = ({ exp, index }: { exp: Experience, index: number }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="bg-white border text-sm border-slate-200 rounded-xl shadow-sm overflow-hidden mb-3">
                <div
                    className="p-4 cursor-pointer hover:bg-slate-50 transition flex items-start justify-between gap-4"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex-1">
                        <div className="font-bold text-slate-800 flex items-center gap-2 mb-1">
                            <HeartPulse size={16} className="text-rose-500 flex-shrink-0" />
                            <span>Hastalık / Sorun:</span>
                        </div>
                        <p className={`text-slate-600 pl-6 ${!isOpen ? "line-clamp-2" : ""}`}>
                            {exp.originalProblem ? exp.originalProblem.trim() : "Belirtilmemiş"}
                        </p>
                    </div>
                    <div className="mt-1 text-slate-400">
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

    return (
        <div className="min-h-screen bg-slate-50 font-inter text-slate-900 pb-24 lg:pb-8 flex flex-col">
            {/* Müşteri Header */}
            <header className="bg-white border-b border-slate-200 px-4 py-4 shadow-sm sticky top-0 z-30">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
                            <Star size={20} className="text-white fill-current" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-slate-800">Doğal Sağlık Dükkanı</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('katalog')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${activeTab === 'katalog' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <span className="hidden sm:inline">Ürünler</span>
                            <span className="sm:hidden">Katalog</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('deneyim')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${activeTab === 'deneyim' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <span className="hidden sm:inline">Deneyimler</span>
                            <span className="sm:hidden">Deneyim</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('sertifika')}
                            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${activeTab === 'sertifika' ? 'bg-amber-50 text-amber-700' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <span className="hidden sm:inline">Sertifikalar</span>
                            <span className="sm:hidden">Sertifika</span>
                        </button>

                        <div className="w-px bg-slate-200 mx-1 self-stretch hidden sm:block"></div>

                        {user ? (
                            <button onClick={() => window.location.href = '/admin'} className="hidden sm:flex px-3 py-2 rounded-lg font-medium text-sm text-white bg-slate-900 border border-slate-900 hover:bg-slate-800 shadow-sm items-center gap-2 transition active:scale-95">
                                Panelim <MoveRight size={14} />
                            </button>
                        ) : (
                            <button onClick={handleLogin} disabled={authLoading} className="hidden sm:flex px-3 py-2 rounded-lg font-medium text-sm text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm items-center gap-2 transition active:scale-95">
                                <LogIn size={16} /> Giriş
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8">

                {activeTab === 'deneyim' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-2xl shadow-sm text-white text-center">
                            <HeartPulse size={40} className="mx-auto mb-4 opacity-80" />
                            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Kullanıcı Deneyim Kütüphanesi</h2>
                            <p className="text-purple-100">Gerçek kullanıcıların Tiens ürünleriyle şifa bulduğu onaylı süreçleri inceleyin.</p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {experiences.filter(e => e.status === 'approved').map((exp, idx) => (
                                <ExperienceAccordionCustomer key={exp.id} exp={exp} index={idx} />
                            ))}
                            {experiences.filter(e => e.status === 'approved').length === 0 && (
                                <div className="col-span-full py-12 text-center text-slate-400">Henüz onaylanmış bir deneyim bulunmuyor.</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'sertifika' && (
                    <div className="space-y-6 animate-in fade-in">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 rounded-2xl shadow-sm text-white text-center">
                            <Star size={40} className="mx-auto mb-4 opacity-80" />
                            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Tiens Sertifikaları</h2>
                            <p className="text-amber-100">Uluslararası standartlara uygun, güvenilir sağlık, üretim ve helal sertifikalarımız.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-center text-slate-800 mb-4">Helal Sertifikası (2024)</h3>
                                <iframe src="https://tiens.com.tr/uploads/2024/08/helal-sertifikasi-2024.pdf" className="w-full h-[600px] border-none rounded-lg" title="Helal Sertifikası" />
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                                <h3 className="font-bold text-center text-slate-800 mb-4">Helal Sertifikası (İspanya)</h3>
                                <iframe src="https://tiens.com.tr/uploads/2024/10/tiens-helal-sertifikasi-2-ispanya.pdf" className="w-full h-[600px] border-none rounded-lg" title="Helal Sertifikası İspanya" />
                            </div>
                        </div>
                    </div>
                )}

                {/* KATALOG VE SEPET (Checkout) */}
                {activeTab === 'katalog' && (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* SOL KISIM: Katalog */}
                        <div className="w-full lg:w-2/3 space-y-4">
                            {/* ÜST KISIM: Kategoriler Solda */}
                            <div className="flex bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="flex gap-2 flex-wrap max-w-full flex-1">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border flex-shrink-0 ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {filteredProducts.map(product => {
                                    const inCart = cart.find(c => c.productId === product.id);
                                    const productExps = experiences.filter(e => e.status === 'approved' && e.productIds.includes(product.id));

                                    return (
                                        <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">

                                            <div className="aspect-square bg-white border-b border-slate-100 flex items-center justify-center p-4 relative">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-contain drop-shadow-sm mix-blend-multiply" />
                                                ) : (
                                                    <div className="text-slate-300 flex flex-col items-center">
                                                        <FileQuestion size={48} />
                                                        <span className="text-xs font-medium mt-2">Görsel Yok</span>
                                                    </div>
                                                )}
                                                <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                                    {product.category}
                                                </span>
                                            </div>

                                            <div className="p-4 flex-1">
                                                <h3 className="font-bold text-sm lg:text-base text-slate-800 mb-2 mt-1">{product.name}</h3>
                                                <div className="text-xl font-extrabold text-blue-600 mt-2">
                                                    {formatPrice(product.retailPrice)}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                                                {productExps.length > 0 && (
                                                    <button
                                                        onClick={() => {
                                                            setViewingProductExperiences(product.id);
                                                        }}
                                                        className="w-full bg-white text-purple-700 font-medium py-1.5 rounded-lg border border-purple-200 hover:bg-purple-50 transition flex items-center justify-center gap-1.5 shadow-sm text-[11px] uppercase tracking-wide"
                                                    >
                                                        <HeartPulse size={14} /> Deneyim Oku ({productExps.length})
                                                    </button>
                                                )}
                                                {inCart ? (
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => updateQuantity(product.id, -1)} className="h-10 w-10 flex items-center justify-center bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100"><Minus size={16} /></button>
                                                        <span className="flex-1 text-center font-bold text-lg text-slate-800 bg-white border border-slate-200 h-10 flex items-center justify-center rounded-lg">{inCart.quantity}</span>
                                                        <button onClick={() => updateQuantity(product.id, 1)} className="h-10 w-10 flex items-center justify-center bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100"><Plus size={16} /></button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => addToCart(product.id)} className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 shadow-sm flex items-center justify-center gap-2 text-sm">
                                                        <ShoppingCart size={16} /> Sepete Ekle
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* SAĞ KISIM: Arama ve Akıllı Checkout Modülü */}
                        <div className="w-full lg:w-1/3 order-first lg:order-last sticky top-[80px] self-start z-10 transition-all space-y-4">

                            {/* Arama Bölümü */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Ürün veya kategori ara..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm"
                                    />
                                </div>
                            </div>

                            {/* Akıllı Checkout Modülü */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                                <div
                                    className="p-4 bg-slate-900 text-white flex justify-between items-center cursor-pointer lg:cursor-default"
                                    onClick={() => window.innerWidth < 1024 && setIsCartExpandedMobile(!isCartExpandedMobile)}
                                >
                                    <h2 className="font-bold flex items-center gap-2 text-lg"><ShoppingCart /> Sepetiniz Özeti</h2>
                                    <div className="lg:hidden">
                                        {isCartExpandedMobile ? <ChevronUp /> : <ChevronDown />}
                                    </div>
                                </div>

                                <div className={`${isCartExpandedMobile ? 'block' : 'hidden'} lg:block bg-slate-50 transition-all`}>
                                    {cart.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400">
                                            Sepetiniz henüz boş.
                                        </div>
                                    ) : (
                                        <div className="p-4 flex flex-col h-full">

                                            {/* Sepet Kalemleri */}
                                            <div className="space-y-2 mb-4 max-h-[30vh] overflow-y-auto pr-1 classic-scrollbar">
                                                {cart.map(item => {
                                                    const product = products.find(p => p.id === item.productId);
                                                    if (!product) return null;
                                                    return (
                                                        <div key={item.productId} className="flex justify-between items-center text-sm border-b border-slate-200 pb-2">
                                                            <div className="flex-1 min-w-0 pr-2">
                                                                <div className="font-medium text-slate-800">{product.name}</div>
                                                                <div className="text-slate-500 font-mono text-xs">{item.quantity} Adet</div>
                                                            </div>
                                                            <div className="font-bold text-slate-800">{formatPrice(product.retailPrice * item.quantity)}</div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Temel Toplam */}
                                            <div className="flex justify-between items-center py-2 text-lg font-bold text-slate-800 mb-4">
                                                <span>Liste Toplamı:</span>
                                                <span>{formatPrice(retailCartResult.totalPrice)}</span>
                                            </div>

                                            {/* FIRSAT KARTLARI (Smart Basket Logic) */}
                                            <div className="space-y-4 mb-6">

                                                {/* 1. Ömür Boyu Bronz (Her Zaman Görünür) */}
                                                {savingsWithBronz > 0 && (
                                                    <div className="bg-amber-100/50 border border-amber-300 rounded-xl p-4 relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                                            <Star size={64} />
                                                        </div>
                                                        <h4 className="font-bold text-amber-900 text-sm mb-1">🔥 HARİKA FIRSAT</h4>
                                                        <p className="text-amber-800 text-xs sm:text-sm leading-relaxed relative z-10">
                                                            Sisteme <strong>Ücretsiz İndirimli Üye</strong> olarak katıldığınız anda bu ürünleri anında Bronz Fiyatıyla alabilirsiniz. Sadece üye olarak şu an tam <strong className="text-lg bg-amber-200 px-1 rounded mx-1">{formatPrice(savingsWithBronz)} Cebinizde Kalacak!</strong>
                                                        </p>
                                                    </div>
                                                )}

                                                {/* 2. Gümüş Hedefi (BV 50 ile 200 arası) */}
                                                {bronzCartResult.totalBV >= 50 && bronzCartResult.totalBV < 200 && (
                                                    <div className="bg-slate-100 border border-slate-300 rounded-xl p-3">
                                                        <p className="text-slate-600 text-xs leading-relaxed">
                                                            💡 <strong>Seviye Hedefi:</strong> Sadece <strong>{(200 - bronzCartResult.totalBV).toFixed(1)} Puan (BV)</strong> değerinde daha ürün eklerseniz, Gümüş seviyesine yükselecek ve bundan sonraki siparişlerinizi çok daha ucuza alacaksınız.
                                                        </p>
                                                        <div className="mt-2 bg-slate-200 h-2 rounded-full overflow-hidden">
                                                            <div className="bg-slate-500 h-full" style={{ width: `${(bronzCartResult.totalBV / 200) * 100}%` }}></div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 3. Altın Hedefi (BV 200 ile 350 arası) */}
                                                {bronzCartResult.totalBV >= 200 && bronzCartResult.totalBV < 350 && (
                                                    <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3">
                                                        <p className="text-yellow-800 text-xs leading-relaxed">
                                                            🌟 <strong>Kampanya Fırsatı:</strong> Sepetiniz 200 Puanı geçti. Altın seviyeye ulaşmanın (350 Puan Kampanyası) ortasındasınız! Altın olduğunuzda kalıcı maksimum indirimlere ulaşırsınız.
                                                        </p>
                                                        <div className="mt-2 bg-yellow-200 h-2 rounded-full overflow-hidden">
                                                            <div className="bg-yellow-500 h-full" style={{ width: `${(bronzCartResult.totalBV / 350) * 100}%` }}></div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Tasarruf Bilgilendirme Vizyonu (Gümüş ve Altın fiyat kıyası) */}
                                                {savingsWithGumus > 0 && (
                                                    <div className="text-[11px] text-slate-500 italic bg-white p-3 rounded-lg border border-dashed border-slate-200 mt-2">
                                                        <span className="font-semibold block mb-1">Gelecekteki İndirim Vizyonu:</span>
                                                        Eğer bu ürünleri Gümüş üye seviyesine geldikten sonra almış olsaydınız <strong>{formatPrice(gumusCartResult.totalPrice)}</strong>, Altın seviyesinde almış olsaydınız <strong>{formatPrice(altinCartResult.totalPrice)}</strong> ödeyecektiniz. Seviyeniz yükseldikçe indiriminiz de artar!
                                                    </div>
                                                )}
                                            </div>

                                            {/* CHECKOUT BUTONLARI */}
                                            <div className="mt-auto space-y-3 pt-4 border-t border-slate-200">

                                                <button
                                                    onClick={() => sendOrderViaWhatsapp(true)}
                                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-600 transition-all flex flex-col items-center justify-center gap-1 active:scale-95"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Star size={18} className="fill-current" />
                                                        {formatPrice(savingsWithBronz)} Tasarruf ile Üye Ol
                                                    </div>
                                                    <span className="text-[10px] font-normal opacity-90 tracking-wide uppercase">Ön Siparişi Whatsapp'a Gönder</span>
                                                </button>

                                                <button
                                                    onClick={() => sendOrderViaWhatsapp(false)}
                                                    className="w-full bg-white text-slate-700 font-medium py-3.5 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                                                >
                                                    Liste Fiyatından Hemen Al
                                                    <MoveRight size={16} className="text-slate-400" />
                                                </button>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Product Experiences Modal */}
            {viewingProductExperiences && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white flex justify-between items-center shadow-md z-10">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <HeartPulse size={20} className="fill-current text-white/50" />
                                {products.find(p => p.id === viewingProductExperiences)?.name}
                            </h3>
                            <button
                                onClick={() => setViewingProductExperiences(null)}
                                className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition"
                            >
                                Kapat
                            </button>
                        </div>
                        <div className="overflow-y-auto p-4 space-y-2 classic-scrollbar bg-slate-100 flex-1">
                            {experiences.filter(e => e.status === 'approved' && e.productIds.includes(viewingProductExperiences)).map((exp, idx) => (
                                <ExperienceAccordionCustomer key={exp.id} exp={exp} index={idx} />
                            ))}
                            {experiences.filter(e => e.status === 'approved' && e.productIds.includes(viewingProductExperiences)).length === 0 && (
                                <div className="text-center py-10 text-slate-500">Bu ürüne ait bir deneyim bulunamadı.</div>
                            )}
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
};

export default CustomerView;
