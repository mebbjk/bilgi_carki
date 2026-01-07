
import { Subject } from '../types';

export interface SortingCategory {
  subject: string;
  category1: string; // Left Box Label
  category2: string; // Right Box Label
  items1: string[]; // Items belonging to Category 1
  items2: string[]; // Items belonging to Category 2
  itemTranslations?: Record<string, string>; // Optional translations for English words
}

// ============================================================================
// 1. SINIF HAVUZU
// ============================================================================
export const G1_SORTING: SortingCategory[] = [
  // --- MATEMATİK ---
  {
    subject: Subject.MATH,
    category1: "10'dan Küçük",
    category2: "10'dan Büyük",
    items1: ["2", "5", "8", "1", "9", "4", "0", "7", "3", "6"],
    items2: ["12", "15", "20", "11", "18", "13", "19", "14", "17", "16"]
  },
  {
    subject: Subject.MATH,
    category1: "Tek Sayı",
    category2: "Çift Sayı",
    items1: ["1", "3", "5", "7", "9", "11", "13", "15"],
    items2: ["2", "4", "6", "8", "10", "12", "14", "16"]
  },
  {
    subject: Subject.MATH,
    category1: "Toplama (+)",
    category2: "Çıkarma (-)",
    items1: ["3 + 2", "5 + 1", "10 + 5", "8 + 2", "6 + 6", "1 + 9", "7 + 7"],
    items2: ["5 - 2", "10 - 5", "8 - 3", "20 - 10", "6 - 1", "7 - 4", "9 - 0"]
  },
  {
    subject: Subject.MATH,
    category1: "Para",
    category2: "Zaman",
    items1: ["1 Lira", "50 Kuruş", "10 Kuruş", "5 Lira", "20 Lira", "25 Kuruş"],
    items2: ["Saat", "Dakika", "Gün", "Hafta", "Yıl", "Takvim", "Sabah"]
  },
  {
    subject: Subject.MATH,
    category1: "Geometrik Şekil",
    category2: "Cisim",
    items1: ["Kare", "Üçgen", "Daire", "Dikdörtgen"],
    items2: ["Top (Küre)", "Kutu (Küp)", "Silindir", "Külah (Koni)"]
  },
  
  // --- TÜRKÇE ---
  {
    subject: Subject.TURKISH,
    category1: "3 Harfli",
    category2: "4 Harfli",
    items1: ["Top", "Kuş", "Göz", "Yaz", "Bal", "Süt", "Çay", "Kış", "Saç", "Kaş"],
    items2: ["Masa", "Kedi", "Okul", "Sıra", "Kapı", "Elma", "Kutu", "Örtü", "Çivi", "Koru"]
  },
  {
    subject: Subject.TURKISH,
    category1: "Meyve Adı",
    category2: "Hayvan Adı",
    items1: ["Elma", "Armut", "Muz", "Çilek", "Kiraz", "Karpuz", "Erik"],
    items2: ["Kedi", "Köpek", "Kuş", "Aslan", "Balık", "Maymun", "Fil"]
  },
  {
    subject: Subject.TURKISH,
    category1: "Hece Sayısı: 1",
    category2: "Hece Sayısı: 2",
    items1: ["Top", "Baş", "Göz", "El", "Kol", "Süt", "Yol", "Kır", "Dut"],
    items2: ["Ka-lem", "Si-lgi", "Ki-tap", "O-kul", "A-nne", "Ba-ba", "Çan-ta", "Gi-bi"]
  },
  {
    subject: Subject.TURKISH,
    category1: "Özel İsim (Büyük Harf)",
    category2: "Cins İsim (Küçük Harf)",
    items1: ["Ahmet", "Türkiye", "Ankara", "Tekir", "Ayşe", "Mehmet"],
    items2: ["masa", "kalem", "defter", "su", "ekmek", "silgi"]
  },
  {
    subject: Subject.TURKISH,
    category1: "Zıt Anlam: Var",
    category2: "Zıt Anlam: Yok (Eşya)",
    items1: ["Siyah (Beyaz)", "Büyük (Küçük)", "Ağır (Hafif)", "Gel (Git)", "Açık (Kapalı)"],
    items2: ["Masa", "Sandalye", "Telefon", "Bilgisayar", "Kalemlik"]
  },

  // --- HAYAT BİLGİSİ ---
  {
    subject: Subject.LIFE,
    category1: "Canlı",
    category2: "Cansız",
    items1: ["Kedi", "Ağaç", "Çiçek", "Bebek", "Kuş", "Arı", "Köpek", "İnsan"],
    items2: ["Taş", "Masa", "Kalem", "Toprak", "Su", "Araba", "Bilgisayar", "Kitap"]
  },
  {
    subject: Subject.LIFE,
    category1: "Okul Eşyası",
    category2: "Mutfak Eşyası",
    items1: ["Kalem", "Silgi", "Defter", "Çanta", "Tebeşir", "Cetvel", "Tahta"],
    items2: ["Tencere", "Tabak", "Kaşık", "Çatal", "Bardak", "Tava", "Bıçak"]
  },
  {
    subject: Subject.LIFE,
    category1: "Sağlıklı",
    category2: "Sağlıksız",
    items1: ["Süt", "Yumurta", "Elma", "Sebze", "Su", "Balık", "Yoğurt"],
    items2: ["Kola", "Cips", "Şeker", "Gazoz", "Sosis", "Hamburger", "Jelibon"]
  },
  {
    subject: Subject.LIFE,
    category1: "Kişisel Bakım",
    category2: "Oyun",
    items1: ["Diş Fırçalamak", "Banyo Yapmak", "El Yıkamak", "Tırnak Kesmek"],
    items2: ["Saklambaç", "Körebe", "İp Atlamak", "Top Oynamak"]
  },
  {
    subject: Subject.LIFE,
    category1: "Yaz Mevsimi",
    category2: "Kış Mevsimi",
    items1: ["Deniz", "Karpuz", "Güneş", "Dondurma", "Tişört"],
    items2: ["Kar", "Mont", "Eldiven", "Portakal", "Atkı", "Soba"]
  },

  // --- İNGİLİZCE ---
  {
    subject: Subject.ENGLISH,
    category1: "Colors (Renkler)",
    category2: "Numbers (Sayılar)",
    items1: ["Red", "Blue", "Green", "Yellow", "Pink", "Black", "White", "Orange", "Purple"],
    items2: ["One", "Two", "Five", "Ten", "Six", "Three", "Four", "Eight", "Nine"],
    itemTranslations: {
      "Red": "Kırmızı", "Blue": "Mavi", "Green": "Yeşil", "Yellow": "Sarı", 
      "Pink": "Pembe", "Black": "Siyah", "White": "Beyaz", "Orange": "Turuncu", "Purple": "Mor",
      "One": "Bir", "Two": "İki", "Five": "Beş", "Ten": "On", 
      "Six": "Altı", "Three": "Üç", "Four": "Dört", "Eight": "Sekiz", "Nine": "Dokuz"
    }
  },
  {
    subject: Subject.ENGLISH,
    category1: "Animals (Hayvanlar)",
    category2: "Fruits (Meyveler)",
    items1: ["Cat", "Dog", "Bird", "Fish", "Lion", "Monkey", "Duck"],
    items2: ["Apple", "Banana", "Lemon", "Melon", "Orange", "Grape", "Strawberry"],
    itemTranslations: {
      "Cat": "Kedi", "Dog": "Köpek", "Bird": "Kuş", "Fish": "Balık", "Lion": "Aslan", "Monkey": "Maymun", "Duck": "Ördek",
      "Apple": "Elma", "Banana": "Muz", "Lemon": "Limon", "Melon": "Kavun", "Orange": "Portakal", "Grape": "Üzüm", "Strawberry": "Çilek"
    }
  },
  {
    subject: Subject.ENGLISH,
    category1: "School (Okul)",
    category2: "Body (Vücut)",
    items1: ["Pencil", "Book", "Bag", "Desk", "Teacher", "Eraser"],
    items2: ["Eye", "Nose", "Hand", "Ear", "Mouth", "Leg", "Head"],
    itemTranslations: {
      "Pencil": "Kalem", "Book": "Kitap", "Bag": "Çanta", "Desk": "Sıra", "Teacher": "Öğretmen", "Eraser": "Silgi",
      "Eye": "Göz", "Nose": "Burun", "Hand": "El", "Ear": "Kulak", "Mouth": "Ağız", "Leg": "Bacak", "Head": "Kafa"
    }
  }
];

// ============================================================================
// 2. SINIF HAVUZU
// ============================================================================
export const G2_SORTING: SortingCategory[] = [
  // --- MATEMATİK ---
  {
    subject: Subject.MATH,
    category1: "Deste (10)",
    category2: "Düzine (12)",
    items1: ["10 Tane", "1 Deste", "2 Deste (20)", "10 Kalem", "On Birlik"],
    items2: ["12 Tane", "1 Düzine", "2 Düzine (24)", "12 Yumurta", "On İki Birlik"]
  },
  {
    subject: Subject.MATH,
    category1: "Yuvarlama: 20",
    category2: "Yuvarlama: 30",
    items1: ["21", "22", "23", "24", "19", "18", "17", "16", "15"],
    items2: ["25", "26", "27", "28", "29", "31", "32", "33", "34"]
  },
  {
    subject: Subject.MATH,
    category1: "Toplama İşlemi",
    category2: "Çarpma İşlemi",
    items1: ["5 + 5", "2 + 2 + 2", "4 + 4", "10 + 10", "3 + 3", "1 + 1 + 1"],
    items2: ["2 x 5", "3 x 2", "2 x 4", "2 x 10", "2 x 3", "3 x 1"]
  },
  {
    subject: Subject.MATH,
    category1: "Standart Olmayan Ölçü",
    category2: "Standart Ölçü",
    items1: ["Kulaç", "Karış", "Parmak", "Adım", "Ayak"],
    items2: ["Metre", "Santimetre", "Cetvel", "Mezura", "Şerit Metre"]
  },
  {
    subject: Subject.MATH,
    category1: "Kesir: Bütün",
    category2: "Kesir: Yarım/Çeyrek",
    items1: ["Tam Ekmek", "1 Elma", "Bütün Pasta", "1 Karpuz"],
    items2: ["Yarım Elma", "Çeyrek Ekmek", "Yarım", "Çeyrek Pasta"]
  },

  // --- TÜRKÇE ---
  {
    subject: Subject.TURKISH,
    category1: "Özel İsim",
    category2: "Tür (Cins) İsmi",
    items1: ["Ankara", "Ahmet", "Boncuk", "Türkiye", "Atatürk", "İzmir", "Kızılırmak"],
    items2: ["Şehir", "Çocuk", "Kedi", "Ülke", "Komutan", "Nehir", "Okul", "Masa"]
  },
  {
    subject: Subject.TURKISH,
    category1: "Eş Anlamlısı Var",
    category2: "Zıt Anlamlısı Var",
    items1: ["Okul (Mektep)", "Öğrenci (Talebe)", "Doktor (Hekim)", "Kırmızı (Al)", "Baş (Kafa)", "Yıl (Sene)"],
    items2: ["Uzun (Kısa)", "Büyük (Küçük)", "Siyah (Beyaz)", "Gel (Git)", "Sıcak (Soğuk)", "Açık (Kapalı)"]
  },
  {
    subject: Subject.TURKISH,
    category1: "Soru Cümlesi",
    category2: "Ünlem Cümlesi",
    items1: ["Geldin mi?", "Adın ne?", "Nasılsın?", "Okul nerede?", "Kaç yaşındasın?", "Ödev bitti mi?"],
    items2: ["Eyvah!", "Yaşasın!", "İmdat!", "Of canım sıkıldı!", "Dikkat et!", "Ah elim yandı!"]
  },
  {
    subject: Subject.TURKISH,
    category1: "Tekil",
    category2: "Çoğul",
    items1: ["Ağaç", "Kuş", "Ev", "Masa", "Kalem", "Çiçek"],
    items2: ["Ağaçlar", "Kuşlar", "Evler", "Masalar", "Kalemler", "Çiçekler"]
  },
  {
    subject: Subject.TURKISH,
    category1: "Hece",
    category2: "Kelime",
    items1: ["ba", "ka", "lem", "kit", "ap", "o", "kul"],
    items2: ["baba", "kalem", "kitap", "okul", "masa", "silgi"]
  },

  // --- HAYAT BİLGİSİ ---
  {
    subject: Subject.LIFE,
    category1: "Yaz Meyvesi",
    category2: "Kış Meyvesi",
    items1: ["Karpuz", "Kavun", "Kiraz", "Çilek", "Şeftali", "Erik", "Üzüm"],
    items2: ["Portakal", "Mandalina", "Nar", "Greyfurt", "Ayva", "Kivi"]
  },
  {
    subject: Subject.LIFE,
    category1: "Kişisel Bakım",
    category2: "Ev Temizliği",
    items1: ["Diş Fırçalamak", "Banyo Yapmak", "Tırnak Kesmek", "El Yıkamak", "Saç Taramak"],
    items2: ["Bulaşık Yıkamak", "Evi Süpürmek", "Toz Almak", "Cam Silmek", "Yatak Toplamak"]
  },
  {
    subject: Subject.LIFE,
    category1: "Dini Bayram",
    category2: "Milli Bayram",
    items1: ["Ramazan Bayramı", "Kurban Bayramı"],
    items2: ["23 Nisan", "19 Mayıs", "29 Ekim", "30 Ağustos", "15 Temmuz"]
  },
  {
    subject: Subject.LIFE,
    category1: "Ulaşım Aracı",
    category2: "İletişim Aracı",
    items1: ["Otobüs", "Tren", "Uçak", "Gemi", "Araba", "Bisiklet"],
    items2: ["Telefon", "Televizyon", "Radyo", "Bilgisayar", "Gazete", "Mektup"]
  },
  {
    subject: Subject.LIFE,
    category1: "Akraba",
    category2: "Komşu",
    items1: ["Dayı", "Teyze", "Hala", "Amca", "Dede", "Kuzen"],
    items2: ["Yan Daire", "Üst Kat", "Mahalleli", "Apartman Sakini"]
  },

  // --- İNGİLİZCE ---
  {
    subject: Subject.ENGLISH,
    category1: "Body Parts (Vücut)",
    category2: "School (Okul)",
    items1: ["Eye", "Nose", "Hand", "Leg", "Head", "Ear", "Mouth", "Finger", "Arm"],
    items2: ["Pencil", "Book", "Eraser", "Bag", "Desk", "Teacher", "Student", "Ruler"],
    itemTranslations: {
      "Eye": "Göz", "Nose": "Burun", "Hand": "El", "Leg": "Bacak", "Head": "Kafa", "Ear": "Kulak", "Mouth": "Ağız", "Finger": "Parmak", "Arm": "Kol",
      "Pencil": "Kalem", "Book": "Kitap", "Eraser": "Silgi", "Bag": "Çanta", "Desk": "Sıra", "Teacher": "Öğretmen", "Student": "Öğrenci", "Ruler": "Cetvel"
    }
  },
  {
    subject: Subject.ENGLISH,
    category1: "Family (Aile)",
    category2: "Rooms (Odalar)",
    items1: ["Mother", "Father", "Sister", "Brother", "Baby", "Grandfather", "Grandmother"],
    items2: ["Kitchen", "Bedroom", "Bathroom", "Living Room", "Garden", "Garage"],
    itemTranslations: {
      "Mother": "Anne", "Father": "Baba", "Sister": "Kız Kardeş", "Brother": "Erkek Kardeş", "Baby": "Bebek", "Grandfather": "Dede", "Grandmother": "Büyükanne",
      "Kitchen": "Mutfak", "Bedroom": "Yatak Odası", "Bathroom": "Banyo", "Living Room": "Oturma Odası", "Garden": "Bahçe", "Garage": "Garaj"
    }
  },
  {
    subject: Subject.ENGLISH,
    category1: "Colors (Renkler)",
    category2: "Shapes (Şekiller)",
    items1: ["Blue", "Red", "Green", "Yellow", "Pink", "Purple"],
    items2: ["Circle", "Square", "Triangle", "Rectangle", "Star"],
    itemTranslations: {
      "Blue": "Mavi", "Red": "Kırmızı", "Green": "Yeşil", "Yellow": "Sarı", "Pink": "Pembe", "Purple": "Mor",
      "Circle": "Daire", "Square": "Kare", "Triangle": "Üçgen", "Rectangle": "Dikdörtgen", "Star": "Yıldız"
    }
  }
];

// ============================================================================
// 3. SINIF HAVUZU
// ============================================================================
export const G3_SORTING: SortingCategory[] = [
  // --- MATEMATİK ---
  {
    subject: Subject.MATH,
    category1: "3 Basamaklı",
    category2: "2 Basamaklı",
    items1: ["100", "999", "120", "505", "360", "212", "800"],
    items2: ["10", "99", "50", "25", "88", "12", "75"]
  },
  {
    subject: Subject.MATH,
    category1: "Romen Rakamı",
    category2: "Doğal Sayı",
    items1: ["I", "V", "X", "XX", "III", "IV", "XII", "IX"],
    items2: ["1", "5", "10", "20", "3", "4", "12", "9"]
  },
  {
    subject: Subject.MATH,
    category1: "Tek Sayı",
    category2: "Çift Sayı",
    items1: ["101", "253", "999", "77", "11", "405", "113"],
    items2: ["100", "252", "998", "76", "12", "406", "550"]
  },
  {
    subject: Subject.MATH,
    category1: "Toplama (+)",
    category2: "Çarpma (x)",
    items1: ["Artı", "Eklemek", "Fazlası", "Toplam", "Daha"],
    items2: ["Kere", "Katı", "Çarpı", "Tane", "Defa"]
  },
  {
    subject: Subject.MATH,
    category1: "Geometrik Cisim",
    category2: "Geometrik Şekil",
    items1: ["Küp", "Küre", "Prizma", "Silindir", "Koni"],
    items2: ["Kare", "Daire", "Üçgen", "Dikdörtgen", "Çember"]
  },

  // --- FEN BİLİMLERİ ---
  {
    subject: Subject.SCIENCE,
    category1: "Doğal Işık",
    category2: "Yapay Işık",
    items1: ["Güneş", "Yıldız", "Ateş Böceği", "Şimşek", "Yıldırım", "Fener Balığı"],
    items2: ["Ampul", "El Feneri", "Mum", "Trafik Işığı", "Meşale", "Gaz Lambası"]
  },
  {
    subject: Subject.SCIENCE,
    category1: "Katı Madde",
    category2: "Sıvı Madde",
    items1: ["Taş", "Buz", "Tahta", "Demir", "Kalem", "Silgi", "Masa"],
    items2: ["Su", "Süt", "Zeytinyağı", "Meyve Suyu", "Ayran", "Çay", "Sirke"]
  },
  {
    subject: Subject.SCIENCE,
    category1: "Canlı Varlık",
    category2: "Cansız Varlık",
    items1: ["İnsan", "Papatya", "Kedi", "Ağaç", "Mantar", "Balık", "Mikrop"],
    items2: ["Hava", "Su", "Toprak", "Kaya", "Güneş", "Araba", "Bulut"]
  },
  {
    subject: Subject.SCIENCE,
    category1: "İtme Kuvveti",
    category2: "Çekme Kuvveti",
    items1: ["Topa Vurmak", "Kapıyı Kapatmak (İterek)", "Düğmeye Basmak", "Arabayı İtmek", "Çivi Çakmak"],
    items2: ["Çekmeceyi Açmak", "Halat Çekmek", "Ok Atmak (Yayı germek)", "Prizden Fişi Çekmek", "Çorap Giymek"]
  },
  {
    subject: Subject.SCIENCE,
    category1: "Duyu Organı",
    category2: "Hissedilen",
    items1: ["Göz", "Kulak", "Burun", "Dil", "Deri"],
    items2: ["Renk", "Ses", "Koku", "Tat", "Sıcaklık"]
  },

  // --- HAYAT BİLGİSİ ---
  {
    subject: Subject.LIFE,
    category1: "Doğal Unsur",
    category2: "Yapay (Beşeri) Unsur",
    items1: ["Dağ", "Göl", "Orman", "Deniz", "Mağara", "Şelale", "Peri Bacaları", "Ova"],
    items2: ["Köprü", "Bina", "Yol", "Baraj", "Park", "Tünel", "Ev", "Okul"]
  },
  {
    subject: Subject.LIFE,
    category1: "İstek",
    category2: "İhtiyaç",
    items1: ["Yeni Oyuncak", "Çikolata", "Bisiklet", "Tablet", "Dondurma", "Top"],
    items2: ["Ekmek", "Su", "Barınma (Ev)", "Mont (Kışın)", "İlaç (Hastayken)", "Ayakkabı"]
  },
  {
    subject: Subject.LIFE,
    category1: "Kroki",
    category2: "Harita",
    items1: ["Kuş Bakışı", "Ölçüsüz", "Kabataslak", "Sokak/Cadde Adı", "Kare/Dikdörtgen Şekiller"],
    items2: ["Ölçekli", "Küçültme Oranı", "Ülke Sınırları", "Dağ Yükseklikleri", "Profesyonel Çizim"]
  },
  {
    subject: Subject.LIFE,
    category1: "Yönetim: İl",
    category2: "Yönetim: İlçe",
    items1: ["Vali", "Valilik", "İl Emniyet Müdürü", "İl Milli Eğitim Müdürü"],
    items2: ["Kaymakam", "Kaymakamlık", "İlçe Emniyet Müdürü", "İlçe Milli Eğitim Müdürü"]
  },
  {
    subject: Subject.LIFE,
    category1: "Trafik İşareti",
    category2: "Trafik Kuralı",
    items1: ["Dur Levhası", "Yaya Geçidi Levhası", "Okul Geçidi Levhası", "Işıklar"],
    items2: ["Kemer Takmak", "Hız Yapmamak", "Kırmızıda Durmak", "Yayaya Yol Vermek"]
  },

  // --- İNGİLİZCE ---
  {
    subject: Subject.ENGLISH,
    category1: "Big (Büyük)",
    category2: "Small (Küçük)",
    items1: ["Elephant", "Bus", "Mountain", "House", "Tree", "Truck", "Whale"],
    items2: ["Ant", "Mouse", "Pencil", "Eraser", "Coin", "Fly", "Bee"],
    itemTranslations: {
      "Elephant": "Fil", "Bus": "Otobüs", "Mountain": "Dağ", "House": "Ev", "Tree": "Ağaç", "Truck": "Kamyon", "Whale": "Balina",
      "Ant": "Karınca", "Mouse": "Fare", "Pencil": "Kalem", "Eraser": "Silgi", "Coin": "Bozuk Para", "Fly": "Sinek", "Bee": "Arı"
    }
  },
  {
    subject: Subject.ENGLISH,
    category1: "Hot (Sıcak)",
    category2: "Cold (Soğuk)",
    items1: ["Sun", "Fire", "Tea", "Coffee", "Summer", "Desert", "Soup"],
    items2: ["Ice", "Snow", "Ice Cream", "Winter", "Fridge", "Snowman", "Frozen"],
    itemTranslations: {
      "Sun": "Güneş", "Fire": "Ateş", "Tea": "Çay", "Coffee": "Kahve", "Summer": "Yaz", "Desert": "Çöl", "Soup": "Çorba",
      "Ice": "Buz", "Snow": "Kar", "Ice Cream": "Dondurma", "Winter": "Kış", "Fridge": "Buzdolabı", "Snowman": "Kardan Adam", "Frozen": "Donmuş"
    }
  },
  {
    subject: Subject.ENGLISH,
    category1: "Greeting (Selamlaşma)",
    category2: "Family (Aile)",
    items1: ["Hello", "Hi", "Good Morning", "Good Night", "Goodbye", "See you"],
    items2: ["Mother", "Father", "Sister", "Brother", "Grandmother", "Uncle"],
    itemTranslations: {
      "Hello": "Merhaba", "Hi": "Selam", "Good Morning": "Günaydın", "Good Night": "İyi Geceler", "Goodbye": "Güle Güle", "See you": "Görüşürüz",
      "Mother": "Anne", "Father": "Baba", "Sister": "Kız Kardeş", "Brother": "Erkek Kardeş", "Grandmother": "Büyükanne", "Uncle": "Amca/Dayı"
    }
  },
  {
    subject: Subject.ENGLISH,
    category1: "Feelings (Duygular)",
    category2: "Toys (Oyuncaklar)",
    items1: ["Happy", "Sad", "Angry", "Tired", "Hungry", "Surprised"],
    items2: ["Ball", "Doll", "Kite", "Car", "Teddy Bear", "Block"],
    itemTranslations: {
      "Happy": "Mutlu", "Sad": "Üzgün", "Angry": "Kızgın", "Tired": "Yorgun", "Hungry": "Aç", "Surprised": "Şaşkın",
      "Ball": "Top", "Doll": "Bebek", "Kite": "Uçurtma", "Car": "Araba", "Teddy Bear": "Oyuncak Ayı", "Block": "Blok"
    }
  }
];

// ============================================================================
// 4. SINIF HAVUZU
// ============================================================================
export const G4_SORTING: SortingCategory[] = [
  // --- MATEMATİK ---
  {
    subject: Subject.MATH,
    category1: "Basit Kesir",
    category2: "Bileşik Kesir",
    items1: ["1/2", "3/5", "2/9", "4/7", "8/10", "99/100", "5/8"],
    items2: ["5/3", "9/2", "10/4", "8/8 (Tam)", "12/5", "100/99", "7/6"]
  },
  {
    subject: Subject.MATH,
    category1: "Dar Açı (<90)",
    category2: "Geniş Açı (>90)",
    items1: ["10 Derece", "45 Derece", "89 Derece", "60 Derece", "30 Derece", "75 Derece"],
    items2: ["91 Derece", "120 Derece", "179 Derece", "100 Derece", "150 Derece", "135 Derece"]
  },
  {
    subject: Subject.MATH,
    category1: "Katı Ölçüsü (cm/m)",
    category2: "Sıvı Ölçüsü (L/mL)",
    items1: ["Kumaş", "Yol", "Masa Boyu", "Kalem", "Boyumuz", "Halat"],
    items2: ["Su", "Süt", "Benzin", "Kolonya", "Şurup", "Meyve Suyu"]
  },
  {
    subject: Subject.MATH,
    category1: "Çift Sayı",
    category2: "Tek Sayı",
    items1: ["2024", "100", "88", "10", "36", "998"],
    items2: ["2023", "101", "77", "9", "35", "999"]
  },
  {
    subject: Subject.MATH,
    category1: "Zaman Birimi",
    category2: "Uzunluk Birimi",
    items1: ["Saat", "Dakika", "Saniye", "Gün", "Hafta", "Yıl"],
    items2: ["Metre", "Santimetre", "Milimetre", "Kilometre", "Kulaç", "Adım"]
  },

  // --- FEN BİLİMLERİ ---
  {
    subject: Subject.SCIENCE,
    category1: "Saf Madde",
    category2: "Karışım",
    items1: ["Altın", "Su (Saf)", "Demir", "Tuz", "Oksijen", "Bakır", "Şeker"],
    items2: ["Salata", "Ayran", "Çorba", "Toprak", "Limonata", "Hava", "Reçel"]
  },
  {
    subject: Subject.SCIENCE,
    category1: "Mıknatıs Çeker",
    category2: "Mıknatıs Çekmez",
    items1: ["Demir", "Nikel", "Kobalt", "Çivi", "Toplu İğne", "Rabiye", "Ataş"],
    items2: ["Tahta", "Plastik", "Cam", "Kağıt", "Altın", "Gümüş", "Alüminyum"]
  },
  {
    subject: Subject.SCIENCE,
    category1: "Dönme Hareketi",
    category2: "Dolanma Hareketi",
    items1: ["Topaç", "Dünya (Kendi Ekseni)", "Vantilatör", "Tekerlek", "Helikopter Pervanesi"],
    items2: ["Dünya (Güneş Etrafı)", "Ay (Dünya Etrafı)", "Lunapark Treni (Rayda)"]
  },
  {
    subject: Subject.SCIENCE,
    category1: "Katı",
    category2: "Sıvı",
    items1: ["Buz", "Taş", "Demir", "Tahta", "Kalem"],
    items2: ["Su", "Zeytinyağı", "Süt", "Sirke", "Benzin"]
  },
  {
    subject: Subject.SCIENCE,
    category1: "Fosil Yakıt",
    category2: "Yenilenebilir Enerji",
    items1: ["Kömür", "Petrol", "Doğalgaz", "Benzin"],
    items2: ["Güneş", "Rüzgar", "Su (Hidroelektrik)", "Jeotermal"]
  },

  // --- SOSYAL BİLGİLER ---
  {
    subject: Subject.SOCIAL,
    category1: "Doğal Afet",
    category2: "Teknolojik Ürün",
    items1: ["Deprem", "Sel", "Çığ", "Heyelan", "Erozyon", "Fırtına"],
    items2: ["Telefon", "Bilgisayar", "Tablet", "Ütü", "Araba", "Uçak"]
  },
  {
    subject: Subject.SOCIAL,
    category1: "Milli Kültür",
    category2: "Evrensel Kültür",
    items1: ["Nasreddin Hoca", "Keloğlan", "Türk Kahvesi", "Lokum", "Baklava", "Zeybek", "Hacivat"],
    items2: ["Pizza", "Noel Baba", "Hamburger", "Sushi", "Cadılar Bayramı", "Vals"]
  },
  {
    subject: Subject.SOCIAL,
    category1: "Doğal Unsur",
    category2: "Beşeri Unsur",
    items1: ["Peri Bacaları", "Pamukkale Travertenleri", "Manavgat Şelalesi", "Ağrı Dağı", "Van Gölü"],
    items2: ["Anıtkabir", "Selimiye Camii", "Boğaziçi Köprüsü", "Atatürk Barajı", "Sümela Manastırı"]
  },
  {
    subject: Subject.SOCIAL,
    category1: "Kroki",
    category2: "Harita",
    items1: ["Ölçüsüz", "Kabataslak", "Sokaklar", "Binalar", "Kare/Dikdörtgen"],
    items2: ["Ölçekli", "Kuş Bakışı (Tam)", "Dağlar", "Ovalar", "Sınırlar"]
  },
  {
    subject: Subject.SOCIAL,
    category1: "İhtiyaç",
    category2: "İstek",
    items1: ["Beslenme", "Barınma", "Giyim", "Eğitim", "Sağlık"],
    items2: ["Oyun Konsolu", "Marka Ayakkabı", "Lüks Araba", "Tatil", "Fazla Kıyafet"]
  },

  // --- İNGİLİZCE ---
  {
    subject: Subject.ENGLISH,
    category1: "Jobs (Meslekler)",
    category2: "Countries (Ülkeler)",
    items1: ["Doctor", "Teacher", "Pilot", "Chef", "Vet", "Farmer", "Nurse", "Singer", "Driver"],
    items2: ["Turkey", "Germany", "France", "Italy", "Japan", "England", "USA", "Spain", "Russia"],
    itemTranslations: {
      "Doctor": "Doktor", "Teacher": "Öğretmen", "Pilot": "Pilot", "Chef": "Aşçı", 
      "Vet": "Veteriner", "Farmer": "Çiftçi", "Nurse": "Hemşire", "Singer": "Şarkıcı", "Driver": "Şoför",
      "Turkey": "Türkiye", "Germany": "Almanya", "France": "Fransa", "Italy": "İtalya",
      "Japan": "Japonya", "England": "İngiltere", "USA": "Amerika", "Spain": "İspanya", "Russia": "Rusya"
    }
  },
  {
    subject: Subject.ENGLISH,
    category1: "Clothes (Kıyafet)",
    category2: "Drinks (İçecek)",
    items1: ["T-shirt", "Dress", "Hat", "Shoes", "Jacket", "Skirt", "Jeans", "Socks"],
    items2: ["Water", "Milk", "Tea", "Coffee", "Lemonade", "Juice", "Coke", "Ayran"],
    itemTranslations: {
      "T-shirt": "Tişört", "Dress": "Elbise", "Hat": "Şapka", "Shoes": "Ayakkabı", "Jacket": "Ceket", "Skirt": "Etek", "Jeans": "Kot", "Socks": "Çorap",
      "Water": "Su", "Milk": "Süt", "Tea": "Çay", "Coffee": "Kahve", "Lemonade": "Limonata", "Juice": "Meyve Suyu", "Coke": "Kola", "Ayran": "Ayran"
    }
  },
  {
    subject: Subject.ENGLISH,
    category1: "Action (Eylem)",
    category2: "Place (Yer)",
    items1: ["Run", "Swim", "Sleep", "Read", "Write", "Jump", "Dance"],
    items2: ["School", "Hospital", "Park", "Cinema", "Museum", "Zoo", "Library"],
    itemTranslations: {
      "Run": "Koşmak", "Swim": "Yüzmek", "Sleep": "Uyumak", "Read": "Okumak", "Write": "Yazmak", "Jump": "Zıplamak", "Dance": "Dans Etmek",
      "School": "Okul", "Hospital": "Hastane", "Park": "Park", "Cinema": "Sinema", "Museum": "Müze", "Zoo": "Hayvanat Bahçesi", "Library": "Kütüphane"
    }
  },
  {
    subject: Subject.ENGLISH,
    category1: "Weather (Hava)",
    category2: "Season (Mevsim)",
    items1: ["Sunny", "Rainy", "Cloudy", "Snowy", "Windy", "Hot", "Cold"],
    items2: ["Summer", "Winter", "Spring", "Autumn"],
    itemTranslations: {
      "Sunny": "Güneşli", "Rainy": "Yağmurlu", "Cloudy": "Bulutlu", "Snowy": "Karlı", "Windy": "Rüzgarlı", "Hot": "Sıcak", "Cold": "Soğuk",
      "Summer": "Yaz", "Winter": "Kış", "Spring": "İlkbahar", "Autumn": "Sonbahar"
    }
  }
];

export const SORTING_POOLS: Record<number, SortingCategory[]> = {
  1: G1_SORTING,
  2: G2_SORTING,
  3: G3_SORTING,
  4: G4_SORTING
};
