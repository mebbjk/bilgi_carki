import { Membership, Product, NetworkNode, DiseaseCategory } from './types';

export const INITIAL_MEMBERSHIPS: Membership[] = [
  { id: 'platin', name: 'Platin', color: 'bg-slate-200 text-slate-800 border-slate-300' },
  { id: 'altin', name: 'Altın', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { id: 'gumus', name: 'Gümüş', color: 'bg-gray-100 text-gray-600 border-gray-300' },
  { id: 'bronz', name: 'Bronz', color: 'bg-orange-100 text-orange-800 border-orange-300' },
];

export const INITIAL_DISEASE_CATEGORIES: DiseaseCategory[] = [
  { id: 'sindirim-ve-bagirsak', name: 'Sindirim & Bağırsak Sistemi' },
  { id: 'kas-kemik-eklem', name: 'Kas, Kemik & Eklem' },
  { id: 'agiz-ve-dis', name: 'Ağız & Diş Sağlığı' },
  { id: 'cilt-sac-tirnak', name: 'Cilt, Saç & Tırnak' },
  { id: 'kalp-ve-damar', name: 'Kalp & Damar Sistemi' },
  { id: 'solunum-yolu', name: 'Solunum Yolu & Akciğer' },
  { id: 'bagisiklik-genel', name: 'Bağışıklık, Enerji & Genel Sağlık' },
  { id: 'kadin-hastaliklari', name: 'Kadın Hastalıkları & Üreme' },
];

export const INITIAL_TREE: NetworkNode = {
  id: 'root',
  name: 'Ana Bayi',
  membershipId: 'platin',
  memberId: '',
  personalPV: 0,
  personalBV: 0,
  note: '',
  children: []
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    category: 'Gıda Takviyeleri',
    name: 'TIENS C Vitamini İçeren Takviye Edici Gıda',
    image: 'https://tiens.com.tr/uploads/cache/2025/01/c-vitamini-photo-product.png',
    retailPrice: 495.00,
    tiers: {
      'platin': { price: 336.60, pv: 5.10, bv: 3.40 },
      'altin': { price: 364.32, pv: 5.52, bv: 3.68 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 396.00, pv: 6.00, bv: 4.00 },
    }
  },
  {
    id: '2',
    category: 'Gıda Takviyeleri',
    name: 'TIENS Spirulina Kapsül Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1320044626345394176.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 1343.00,
    tiers: {
      'platin': { price: 912.90, pv: 19.13, bv: 17.00 },
      'altin': { price: 988.08, pv: 20.70, bv: 18.40 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 1074.00, pv: 22.50, bv: 20.00 },
    }
  },
  {
    id: '3',
    category: 'Gıda Takviyeleri',
    name: 'TIENS Propolis İçeren Pastil Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202501/3178470653120430085.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 286.00,
    tiers: {
      'platin': { price: 194.65, pv: 1.70, bv: 1.70 },
      'altin': { price: 210.68, pv: 1.84, bv: 1.84 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 229.00, pv: 2.00, bv: 2.00 },
    }
  },
  {
    id: '4',
    category: 'Gıda Takviyeleri',
    name: 'TIENS Probiyotik Mikroorganizma İçeren Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1320044626345394176.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 1339.00,
    tiers: {
      'platin': { price: 910.35, pv: 12.33, bv: 9.78 },
      'altin': { price: 985.32, pv: 13.34, bv: 10.58 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 1071.00, pv: 14.50, bv: 11.50 },
    }
  },
  {
    id: '5',
    category: 'Gıda Takviyeleri',
    name: 'TIENS Kitosan İçeren Kapsül Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1319990612830814208.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 1881.00,
    tiers: {
      'platin': { price: 1279.25, pv: 26.78, bv: 23.80 },
      'altin': { price: 1384.60, pv: 28.98, bv: 25.76 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 1505.00, pv: 31.50, bv: 28.00 },
    }
  },
  {
    id: '6',
    category: 'Gıda Takviyeleri',
    name: 'TIENS Çinko ve Yumurta Beyazı İçeren Kapsül Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1319990612830814208.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 583.00,
    tiers: {
      'platin': { price: 396.10, pv: 7.65, bv: 7.65 },
      'altin': { price: 428.72, pv: 8.28, bv: 8.28 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 466.00, pv: 9.00, bv: 9.00 },
    }
  },
  {
    id: '7',
    category: 'Gıda Takviyeleri',
    name: 'TIENS Vitamin D3 İçeren Damla Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202306/2332771354657423377.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 409.00,
    tiers: {
      'platin': { price: 277.95, pv: 2.55, bv: 2.55 },
      'altin': { price: 300.84, pv: 2.76, bv: 2.76 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 327.00, pv: 3.00, bv: 3.00 },
    }
  },
  {
    id: '8',
    category: 'Gıda Takviyeleri',
    name: 'TIENS Kalsiyum ve Lesitin İçeren Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202306/2332771354657423377.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 583.00,
    tiers: {
      'platin': { price: 396.10, pv: 8.42, bv: 7.48 },
      'altin': { price: 428.72, pv: 9.11, bv: 8.10 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 466.00, pv: 9.90, bv: 8.80 },
    }
  },
  {
    id: '9',
    category: 'Gıda Takviyeleri',
    name: 'TIENS Nutrient Kalsiyum İçeren Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202306/2332771354657423377.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 1228.00,
    tiers: {
      'platin': { price: 834.70, pv: 17.60, bv: 15.64 },
      'altin': { price: 903.44, pv: 19.04, bv: 16.93 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 982.00, pv: 20.70, bv: 18.40 },
    }
  },
  {
    id: '10',
    category: 'Gıda Takviyeleri',
    name: 'TIENS Vision Lutein ve Vitamin A İçeren Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202410/3069991822324375553.png?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 1855.00,
    tiers: {
      'platin': { price: 1261.40, pv: 26.35, bv: 22.95 },
      'altin': { price: 1365.28, pv: 28.52, bv: 24.84 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 1484.00, pv: 31.00, bv: 27.00 },
    }
  },
  {
    id: '11',
    category: 'Gıda Takviyeleri',
    name: 'TIENS Kordiseps Mantarı İçeren Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202510/3598821370127745026.png?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 2348.00,
    tiers: {
      'platin': { price: 1596.30, pv: 33.66, bv: 29.92 },
      'altin': { price: 1727.76, pv: 34.43, bv: 32.38 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 1878.00, pv: 39.60, bv: 35.20 },
    }
  },
  {
    id: '12',
    category: 'Gıda Takviyeleri',
    name: 'TIENS İnülin İçeren Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1318756015891644417.png?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 2671.00,
    tiers: {
      'platin': { price: 1816.45, pv: 34.00, bv: 25.50 },
      'altin': { price: 1966.04, pv: 36.80, bv: 27.60 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 2137.00, pv: 40.00, bv: 30.00 },
    }
  },
  {
    id: '13',
    category: 'Gıda Takviyeleri',
    name: 'TIENS XTR Nutrient Kalsiyum İçeren Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202111/1449252395245101056.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 1343.00,
    tiers: {
      'platin': { price: 912.90, pv: 19.13, bv: 17.00 },
      'altin': { price: 988.08, pv: 20.70, bv: 18.40 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 1074.00, pv: 22.50, bv: 20.00 },
    }
  },
  {
    id: '14',
    category: 'Gıda Takviyeleri',
    name: 'TIENS Koenzim Q10 ve Kuersetin İçeren Takviye Edici Gıda',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202601/3714567268416249859.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 1060.00,
    tiers: {
      'platin': { price: 720.80, pv: 13.60, bv: 10.20 },
      'altin': { price: 780.16, pv: 14.72, bv: 11.04 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 848.00, pv: 16.00, bv: 12.00 },
    }
  },
  {
    id: '15',
    category: 'Cilt Bakım',
    name: 'Aprotie Multi-Functional Spray Serum',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202512/3702822800604422147.png?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 901.00,
    tiers: {
      'platin': { price: 612.85, pv: 8.50, bv: 5.95 },
      'altin': { price: 663.32, pv: 9.20, bv: 6.44 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 721.00, pv: 10.00, bv: 7.00 },
    }
  },
  {
    id: '16',
    category: 'Cilt Bakım',
    name: 'AİRİZ Hijyenik Bölge Temizleme Jeli',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1318909964705267712.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 446.00,
    tiers: {
      'platin': { price: 303.45, pv: 1.70, bv: 1.70 },
      'altin': { price: 328.44, pv: 1.84, bv: 1.84 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 357.00, pv: 2.00, bv: 2.00 },
    }
  },
  {
    id: '17',
    category: 'Cilt Bakım',
    name: 'APROTIE Bebek Saç ve Vücut Yıkama Jeli',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202503/3279847274468818948.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 444.00,
    tiers: {
      'platin': { price: 301.75, pv: 2.55, bv: 2.55 },
      'altin': { price: 326.60, pv: 2.76, bv: 2.76 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 355.00, pv: 3.00, bv: 3.00 },
    }
  },
  {
    id: '18',
    category: 'Cilt Bakım',
    name: 'VIEWTALE Aydınlatıcı Maske',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202311/2572892290298150912.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 1346.00,
    tiers: {
      'platin': { price: 915.45, pv: 14.45, bv: 11.05 },
      'altin': { price: 990.84, pv: 15.64, bv: 11.96 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 1077.00, pv: 17.00, bv: 13.00 },
    }
  },
  {
    id: '19',
    category: 'Cilt Bakım',
    name: 'APROTIE Sunscreen Cream Spf 30',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202504/3313495972416094212.png?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 850.00,
    tiers: {
      'platin': { price: 578.00, pv: 6.80, bv: 2.98 },
      'altin': { price: 625.60, pv: 7.36, bv: 3.22 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 680.00, pv: 8.00, bv: 3.50 },
    }
  },
  {
    id: '20',
    category: 'Cilt Bakım',
    name: 'APROTIE Roll-On Fresh',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202309/2448066573443620865.png?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 444.00,
    tiers: {
      'platin': { price: 301.75, pv: 2.38, bv: 2.38 },
      'altin': { price: 326.60, pv: 2.58, bv: 2.58 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 355.00, pv: 2.80, bv: 2.80 },
    }
  },
  {
    id: '21',
    category: 'Cilt Bakım',
    name: 'VIEWTALE Green Bubble Cleanser',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202501/3175837855352995850.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 690.00,
    tiers: {
      'platin': { price: 469.20, pv: 5.95, bv: 4.25 },
      'altin': { price: 507.84, pv: 6.44, bv: 4.60 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 552.00, pv: 7.00, bv: 5.00 },
    }
  },
  {
    id: '22',
    category: 'Cilt Bakım',
    name: 'VIEWTALE Fresh Water Gel Cleanser',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202501/3175837855347851269.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 583.00,
    tiers: {
      'platin': { price: 396.10, pv: 5.10, bv: 3.40 },
      'altin': { price: 428.72, pv: 5.52, bv: 3.68 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 466.00, pv: 6.00, bv: 4.00 },
    }
  },
  {
    id: '23',
    category: 'Cilt Bakım',
    name: 'ORECARE Bitkisel Diş Macunu',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1318857497384779776.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 629.00,
    tiers: {
      'platin': { price: 427.55, pv: 8.42, bv: 7.65 },
      'altin': { price: 462.76, pv: 9.11, bv: 8.28 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 503.00, pv: 9.90, bv: 9.00 },
    }
  },
  {
    id: '24',
    category: 'Cilt Bakım',
    name: 'AIRIZ Hijyenik Ped Seti',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1318909964705267712.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 1748.00,
    tiers: {
      'platin': { price: 1188.30, pv: 22.95, bv: 17.85 },
      'altin': { price: 1286.16, pv: 24.84, bv: 19.32 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 1398.00, pv: 27.00, bv: 21.00 },
    }
  },
  {
    id: '25',
    category: 'Cilt Bakım',
    name: 'REVITIZE Bitkisel Şampuan',
    image: 'https://tiens.com.tr/uploads/cache/2025/04/sampuan-product.png',
    retailPrice: 431.00,
    tiers: {
      'platin': { price: 293.25, pv: 1.70, bv: 1.70 },
      'altin': { price: 317.40, pv: 1.84, bv: 1.84 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 345.00, pv: 2.00, bv: 2.00 },
    }
  },
  {
    id: '26',
    category: 'Cilt Bakım',
    name: 'Aprotie Multi-Balm',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202512/3702822817789411331.png?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 795.00,
    tiers: {
      'platin': { price: 540.60, pv: 7.65, bv: 5.95 },
      'altin': { price: 585.12, pv: 8.28, bv: 6.44 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 636.00, pv: 9.00, bv: 7.00 },
    }
  },
  {
    id: '27',
    category: 'Cilt Bakım',
    name: 'TIENS Aprotie Hepsi Bir Arada Bakım Seti -İndirim-20%',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202601/3708290654749483014.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 1696.00,
    tiers: {
      'platin': { price: 922.25, pv: 12.75, bv: 9.35 },
      'altin': { price: 998.20, pv: 13.80, bv: 10.12 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 1085.00, pv: 15.00, bv: 11.00 },
    }
  },
  {
    id: '28',
    category: 'Sağlık & Yaşam',
    name: 'Kadın Bileklik - Büyülü Beyaz',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1320080360467431424.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 6368.00,
    tiers: {
      'platin': { price: 4329.90, pv: 76.50, bv: 59.50 },
      'altin': { price: 4686.48, pv: 82.80, bv: 64.40 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 5094.00, pv: 90.00, bv: 70.00 },
    }
  },
  {
    id: '29',
    category: 'Sağlık & Yaşam',
    name: 'Erkek Bileklik - Kristal Siyah',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1320067939427876865.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 5081.00,
    tiers: {
      'platin': { price: 3455.25, pv: 61.20, bv: 47.60 },
      'altin': { price: 3789.80, pv: 66.24, bv: 51.52 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 4065.00, pv: 72.00, bv: 56.00 },
    }
  },
  {
    id: '30',
    category: 'Ev Bakım',
    name: 'DICHO Sıvı Çamaşır Deterjanı',
    image: 'https://tiens.com.tr/uploads/cache/2022/12/dicho-camasir-product.jpg',
    retailPrice: 966.00,
    tiers: {
      'platin': { price: 657.05, pv: 9.35, bv: 5.10 },
      'altin': { price: 711.16, pv: 10.12, bv: 5.52 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 773.00, pv: 11.00, bv: 6.00 },
    }
  },
  {
    id: '31',
    category: 'Paketler & Promosyonlar',
    name: 'TIENS Vision SEVGİLİLER GÜNÜ PAKETİ -İndirim-20%',
    image: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202601/3748619332507033603.png?template=2&shape=2&w=270&h=270&q=80&format=webp',
    retailPrice: 3710.00,
    tiers: {
      'platin': { price: 2522.80, pv: 52.70, bv: 45.90 },
      'altin': { price: 2730.56, pv: 57.04, bv: 49.68 },
      'gumus': { price: 0, pv: 0, bv: 0 },
      'bronz': { price: 2968.00, pv: 62.00, bv: 54.00 },
    }
  }
];