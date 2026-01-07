
import { QuestionData, Subject } from '../types';

type CompactQuestion = [string, string[], number, string];

const createQuestions = (category: string, data: CompactQuestion[]): QuestionData[] => {
  return data.map(item => ({
    category,
    questionText: item[0],
    options: item[1],
    correctAnswerIndex: item[2],
    explanation: item[3]
  }));
};

// =================================================================================================
// 2. SINIF MATEMATİK (Doğal Sayılar, Dört İşlem, Geometri, Ölçme, Veri)
// =================================================================================================
const G2_MATH: CompactQuestion[] = [
  // Sayılar ve Basamak Değeri
  ["2 onluk ve 5 birlikten oluşan sayı kaçtır?", ["25", "52", "20", "7"], 0, "20 + 5 = 25."],
  ["83 sayısının onlar basamağındaki rakam kaçtır?", ["3", "8", "11", "5"], 1, "Onlar basamağında 8 vardır (Değeri 80)."],
  ["Hangi sayı 40'tan küçüktür?", ["42", "50", "39", "41"], 2, "39 sayısı 40'tan küçüktür."],
  ["İki basamaklı en küçük sayı kaçtır?", ["1", "10", "11", "99"], 1, "En küçük iki basamaklı sayı 10'dur."],
  ["İki basamaklı en büyük sayı kaçtır?", ["90", "98", "99", "100"], 2, "99 en büyük iki basamaklı sayıdır."],
  ["Bir deste kalem kaç tanedir?", ["10", "12", "20", "5"], 0, "Deste 10 tanedir."],
  ["Bir düzine kalem kaç tanedir?", ["10", "12", "20", "24"], 1, "Düzine 12 tanedir."],
  ["Destesi 10 TL olan kalemin, düzinesi kaç TL olabilir?", ["Daha az", "Daha çok", "Eşit", "Bilmem"], 1, "Düzine (12) desteden (10) çok olduğu için fiyatı daha çoktur."],
  ["30'a yuvarlanan sayı hangisidir?", ["24", "36", "32", "21"], 2, "32 sayısı 30'a yakındır."],
  ["Hangi sayı çifttir?", ["13", "15", "18", "21"], 2, "Sonu 0,2,4,6,8 olan sayılar çifttir. 18 çifttir."],
  ["Hangi sayı tektir?", ["20", "22", "24", "25"], 3, "Sonu 1,3,5,7,9 olan sayılar tektir. 25 tektir."],
  ["23, 26, 29, ... Örüntüde sıradaki sayı kaçtır?", ["30", "31", "32", "33"], 2, "Üçer üçer artıyor. 29 + 3 = 32."],
  ["Onlar basamağı 7 olan en küçük sayı kaçtır?", ["70", "71", "79", "17"], 0, "70 sayısı."],
  
  // Toplama İşlemi
  ["25 + 15 işleminin sonucu kaçtır?", ["30", "40", "50", "35"], 1, "25 + 15 = 40."],
  ["18 + 12 işleminin sonucu kaçtır?", ["20", "30", "40", "28"], 1, "18 + 12 = 30."],
  ["35 sayısının 10 fazlası kaçtır?", ["40", "45", "55", "25"], 1, "35 + 10 = 45."],
  ["Toplananları 20 ve 30 olan işlemin toplamı kaçtır?", ["10", "40", "50", "60"], 2, "20 + 30 = 50."],
  ["Sınıfımızda 12 kız, 13 erkek öğrenci var. Toplam kaç kişiyiz?", ["20", "22", "25", "30"], 2, "12 + 13 = 25."],
  ["Kumbaramda 40 TL vardı, babam 20 TL daha verdi. Kaç liram oldu?", ["50", "60", "70", "80"], 1, "40 + 20 = 60."],
  ["Eldeli toplama: 28 + 14 kaçtır?", ["32", "42", "44", "52"], 1, "8+4=12(elde var 1), 2+1=3, 1 de elde 4. Sonuç 42."],
  ["Hangi toplama işleminin sonucu 50'dir?", ["20+20", "25+25", "30+10", "40+5"], 1, "25 + 25 = 50."],

  // Çıkarma İşlemi
  ["80 sayısından 20 çıkarırsak kaç kalır?", ["50", "60", "70", "100"], 1, "80 - 20 = 60."],
  ["50 - 15 işleminin sonucu kaçtır?", ["25", "30", "35", "40"], 2, "50 - 15 = 35."],
  ["Bir çıkarma işleminde Eksilen 40, Çıkan 10 ise Fark kaçtır?", ["30", "40", "50", "20"], 0, "40 - 10 = 30."],
  ["Otobüste 35 yolcu vardı, 5 kişi indi. Kaç yolcu kaldı?", ["20", "30", "40", "35"], 1, "35 - 5 = 30."],
  ["Hangi işlemin sonucu 10'dur?", ["20 - 5", "15 - 5", "12 - 4", "18 - 9"], 1, "15 - 5 = 10."],
  ["65 sayısının 25 eksiği kaçtır?", ["30", "40", "50", "60"], 1, "65 - 25 = 40."],
  ["Onluk bozarak çıkarma: 32 - 15 kaçtır?", ["17", "18", "27", "23"], 0, "2'den 5 çıkmaz, komşudan onluk alırız. 12-5=7. Sonuç 17."],
  
  // Çarpma İşlemi
  ["Çarpma işlemi neyin kısa yoludur?", ["Çıkarmanın", "Bölmenin", "Toplamanın", "Saymanın"], 2, "Tekrarlı toplamanın kısa yoludur."],
  ["5 kere 4 kaç eder?", ["15", "20", "25", "9"], 1, "5 x 4 = 20."],
  ["3 tane 10 kaç eder?", ["13", "20", "30", "33"], 2, "3 x 10 = 30."],
  ["6 x 2 işleminin sonucu kaçtır?", ["8", "12", "16", "4"], 1, "6 x 2 = 12."],
  ["4 x 3 işleminin sonucu kaçtır?", ["7", "10", "12", "15"], 2, "4 x 3 = 12."],
  ["Hangi sayıyı 1 ile çarparsak sonuç değişmez?", ["5", "10", "100", "Hepsi"], 3, "1 etkisiz elemandır."],
  ["Hangi sayıyı 0 ile çarparsak sonuç 0 olur?", ["5", "100", "1", "Hepsi"], 3, "0 yutan elemandır."],
  ["Tavşanın 4 ayağı vardır. 3 tavşanın toplam kaç ayağı olur?", ["7", "10", "12", "14"], 2, "3 x 4 = 12."],
  ["Bir elin 5 parmağı varsa, 4 elin kaç parmağı vardır?", ["9", "15", "20", "25"], 2, "4 x 5 = 20."],
  
  // Bölme İşlemi
  ["12 elmayı 3 arkadaşa eşit paylaştırırsak her birine kaç elma düşer?", ["3", "4", "5", "6"], 1, "12 / 3 = 4."],
  ["Paylaştırma işlemi hangisidir?", ["Toplama", "Çıkarma", "Çarpma", "Bölme"], 3, "Bölme işlemi paylaştırmadır."],
  ["20 sayısını 2'ye bölersek kaç buluruz?", ["5", "10", "15", "18"], 1, "20'nin yarısı 10'dur."],
  ["15 / 5 işleminin sonucu kaçtır?", ["2", "3", "4", "5"], 1, "15'in içinde 5, 3 kere vardır."],
  ["10 tane cevizi 2 tabağa koyarsak her tabakta kaç ceviz olur?", ["2", "5", "8", "12"], 1, "10 / 2 = 5."],
  
  // Kesirler
  ["Bütünün iki eş parçasından her birine ne denir?", ["Çeyrek", "Yarım", "Bütün", "Parça"], 1, "Yarım denir."],
  ["Bütünün dört eş parçasından her birine ne denir?", ["Çeyrek", "Yarım", "Tam", "Dilim"], 0, "Çeyrek denir."],
  ["4 çeyrek elma kaç bütün elma eder?", ["1", "2", "3", "4"], 0, "4 çeyrek 1 bütün eder."],
  ["2 yarım ekmek kaç bütün ekmek eder?", ["1", "2", "3", "4"], 0, "2 yarım 1 bütün eder."],
  ["Bir pastanın yarısını yedim, ne kadarı kaldı?", ["Çeyreği", "Yarısı", "Tamamı", "Hiçbiri"], 1, "Yarısı kaldı."],

  // Geometri
  ["Üçgenin kaç kenarı vardır?", ["3", "4", "5", "6"], 0, "Üçgenin 3 kenarı vardır."],
  ["Karenin kaç köşesi vardır?", ["3", "4", "5", "0"], 1, "Karenin 4 köşesi vardır."],
  ["Hangi geometrik cismin köşesi yoktur?", ["Küp", "Kare Prizma", "Küre", "Üçgen Prizma"], 2, "Kürenin (top gibi) köşesi yoktur."],
  ["Konserve kutusu hangi şekle benzer?", ["Küp", "Silindir", "Koni", "Küre"], 1, "Silindire benzer."],
  ["Dikdörtgenin kaç kenarı vardır?", ["3", "4", "5", "6"], 1, "4 kenarı vardır (2 uzun, 2 kısa)."],
  ["Hangi şeklin tüm kenarları birbirine eşittir?", ["Dikdörtgen", "Kare", "Üçgen", "Çember"], 1, "Karenin tüm kenarları eşittir."],
  ["Üçgen prizmanın kaç yüzü vardır?", ["3", "4", "5", "6"], 2, "5 yüzü vardır."],
  
  // Ölçme (Zaman, Uzunluk, Para, Tartma)
  ["Yarım saat kaç dakikadır?", ["15", "30", "45", "60"], 1, "30 dakikadır."],
  ["Bir gün kaç saattir?", ["12", "24", "48", "7"], 1, "24 saattir."],
  ["Bir hafta kaç gündür?", ["5", "7", "10", "30"], 1, "7 gündür."],
  ["Akrep 3'ü, yelkovan 12'yi gösteriyorsa saat kaçtır?", ["12:00", "03:00", "06:00", "09:00"], 1, "Saat tam 3'tür."],
  ["Uzunlukları ne ile ölçeriz?", ["Terazi", "Saat", "Metre", "Litre"], 2, "Metre ve santimetre ile ölçeriz."],
  ["Sınıf tahtasının boyunu ne ile ölçmek daha uygundur?", ["Karış", "Kulaç", "Metre", "Parmak"], 2, "Metre ile ölçmek en doğru sonucu verir."],
  ["Cüzdanımda 2 tane 5 lira, 3 tane 1 lira var. Toplam kaç liram var?", ["10", "11", "12", "13"], 3, "13 TL."],
  ["En büyük madeni paramız hangisidir?", ["50 Kuruş", "25 Kuruş", "1 Lira", "10 Kuruş"], 2, "1 Lira."],
  ["Pazardan elmayı ne ile alırız (tartarız)?", ["Metre", "Litre", "Kilogram", "Tane"], 2, "Kilogram ile alırız."],
  ["Süt, su gibi sıvıları ne ile ölçeriz?", ["Metre", "Litre", "Kilogram", "Karış"], 1, "Litre ile ölçeriz."]
];

// =================================================================================================
// 2. SINIF TÜRKÇE (Okuma Anlama, Sözcük Bilgisi, Yazım Kuralları)
// =================================================================================================
const G2_TURKISH: CompactQuestion[] = [
  // Eş ve Zıt Anlam
  ["'Okul' kelimesinin eş anlamlısı nedir?", ["Mektep", "Sınıf", "Bahçe", "Ev"], 0, "Okul = Mektep."],
  ["'Öğrenci' kelimesinin eş anlamlısı nedir?", ["Talebe", "Öğretmen", "Müdür", "Çocuk"], 0, "Öğrenci = Talebe."],
  ["'Doktor' kelimesinin eş anlamlısı nedir?", ["Hekim", "Hemşire", "Hasta", "İlaç"], 0, "Doktor = Hekim."],
  ["'Kırmızı' kelimesinin eş anlamlısı?", ["Al", "Ak", "Kara", "Sarı"], 0, "Kırmızı = Al."],
  ["'Siyah' kelimesinin zıt anlamlısı nedir?", ["Kara", "Beyaz", "Mavi", "Kırmızı"], 1, "Siyah - Beyaz."],
  ["'Yaşlı' kelimesinin zıt anlamlısı nedir?", ["İhtiyar", "Genç", "Büyük", "Küçük"], 1, "Yaşlı - Genç."],
  ["'Uzun' kelimesinin zıt anlamlısı nedir?", ["Kısa", "Büyük", "Geniş", "İnce"], 0, "Uzun - Kısa."],
  ["'Gel' kelimesinin zıt anlamlısı nedir?", ["Koş", "Git", "Dur", "Bak"], 1, "Gel - Git."],
  ["'Ağır' kelimesinin zıt anlamlısı nedir?", ["Büyük", "Hafif", "Küçük", "Zor"], 1, "Ağır - Hafif."],
  ["'Yıl' kelimesinin eş anlamlısı nedir?", ["Ay", "Sene", "Gün", "Hafta"], 1, "Yıl = Sene."],
  ["'Cevap' kelimesinin eş anlamlısı nedir?", ["Soru", "Yanıt", "Söz", "Hece"], 1, "Cevap = Yanıt."],

  // Sözlük ve Alfabe
  ["Alfabemizde kaç harf vardır?", ["21", "28", "29", "30"], 2, "29 harf vardır."],
  ["Hangi kelime sözlükte daha önce gelir?", ["Elma", "Armut", "Muz", "Çilek"], 1, "A harfi (Armut) diğerlerinden öncedir."],
  ["'Kitap' kelimesi sözlükte 'Kalem'den önce mi gelir sonra mı?", ["Önce", "Sonra", "Aynı", "Bilinmez"], 1, "Kalem (Ka), Kitap (Ki). Ka önce gelir, Ki sonra gelir. (Düzeltme: Ka-lem, Ki-tap. a, i'den öncedir. Kalem önce gelir. Kitap SONRA gelir.)"],
  ["Hangi kelime ünlü (sesli) harfle başlar?", ["Masa", "Okul", "Silgi", "Defter"], 1, "O sesi bir ünlü harftir."],
  ["Hangi kelime ünsüz (sessiz) harfle biter?", ["Kedi", "Kapı", "Kitap", "Silgi"], 2, "p sesi bir ünsüz harftir."],
  
  // Hece Bilgisi
  ["'Kelebek' kelimesi kaç hecelidir?", ["2", "3", "4", "1"], 1, "Ke-le-bek (3 hece)."],
  ["'İlköğretim' kelimesi kaç hecelidir?", ["3", "4", "5", "6"], 1, "İl-köğ-re-tim (4 hece)."],
  ["Satır sonuna sığmayan kelimeleri ayırmak için ne kullanırız?", ["Nokta", "Kısa Çizgi", "Virgül", "Soru İşareti"], 1, "Kısa çizgi (-) kullanırız."],
  ["Hangi kelime satır sonunda yanlış ayrılmıştır?", ["A-ra-ba", "O-kul", "Ba-şö-ğret-men", "Uç-urt-ma"], 3, "U-çurt-ma şeklinde ayrılmalıdır."],
  
  // Yazım Kuralları ve Noktalama
  ["Özel isimlerin ilk harfi nasıl yazılır?", ["Küçük", "Büyük", "Eğik", "Altı çizili"], 1, "Daima büyük harfle başlar."],
  ["Soru cümlesinin sonuna ne konur?", ["Nokta", "Soru İşareti", "Ünlem", "Virgül"], 1, "Soru işareti konur."],
  ["Tamamlanmış cümlenin sonuna ne konur?", ["Virgül", "Nokta", "Soru İşareti", "Kısa Çizgi"], 1, "Nokta konur."],
  ["'Eyvah, yandım' cümlesinin sonuna ne konur?", ["Nokta", "Ünlem", "Soru İşareti", "Virgül"], 1, "Korku/telaş bildirdiği için ünlem (!) konur."],
  ["Hangi kelimenin yazımı yanlıştır?", ["Tıren", "Spor", "Plan", "Kral"], 0, "Tren (arada ı olmaz)."],
  ["'Ali eve geldi' cümlesinde 'Ali' neden büyük yazılmıştır?", ["Cümle başı ve özel isim olduğu için", "En sevilen isim olduğu için", "Kısa olduğu için", "Yanlış yazılmış"], 0, "Hem cümle başı hem özel isimdir."],
  ["Bayram adları nasıl yazılır?", ["Küçük harfle", "Büyük harfle", "Farketmez", "Sadece ilki büyük"], 1, "Her kelimesi büyük yazılır (Cumhuriyet Bayramı)."],
  
  // Cümle Bilgisi ve Anlam
  ["Hangi kelime çoğuldur (birden çok)?", ["Kalem", "Silgi", "Kitaplar", "Defter"], 2, "-lar eki almış Kitaplar çoğuldur."],
  ["'Gözlük' kelimesi hangi kelimeden türemiştir?", ["Göz", "Göl", "Güz", "Söz"], 0, "Göz kelimesinden türemiştir."],
  ["Aşağıdakilerden hangisi bir soru cümlesidir?", ["Ali okula gitti", "Ayşe ders çalışıyor", "Bugün hava nasıl", "Kitap okumayı severim"], 2, "Bugün hava nasıl?"],
  ["5N 1K sorularından 'Nerede' neyi sorar?", ["Zamanı", "Kişiyi", "Yeri", "Sebebi"], 2, "Yeri sorar."],
  ["'Elindeki bardağı kırdı.' cümlesinde işi yapan kimdir?", ["Bardak", "El", "O (Gizli Özne)", "Kırık"], 2, "O kırdı."],
  ["'Piknikte top oynadık.' cümlesinde 'nerede' sorusunun cevabı nedir?", ["Top", "Oynadık", "Piknikte", "Biz"], 2, "Piknikte."],
  ["Gerçek olmayan, hayal ürünü cümle hangisidir?", ["Kuş uçtu.", "Güneş bize gülümsedi.", "Bebek ağladı.", "Rüzgar esti."], 1, "Güneşin gülümsemesi hayal ürünüdür."],
  ["Duygularımızı anlatan kelime hangisidir?", ["Masa", "Mutluluk", "Koşmak", "Yeşil"], 1, "Mutluluk bir duygudur."]
];

// =================================================================================================
// 2. SINIF HAYAT BİLGİSİ (Okul, Ev, Sağlık, Güvenlik, Ülkemiz)
// =================================================================================================
const G2_LIFE: CompactQuestion[] = [
  // Okul ve Arkadaşlık
  ["Okulda unuttuğumuz eşyayı nereden sorarız?", ["Kantinden", "Kayıp Eşya Dolabından", "Bahçeden", "Evden"], 1, "Kayıp eşya dolabı veya nöbetçi öğretmenden."],
  ["Arkadaşımızla sorun yaşarsak ne yapmalıyız?", ["Kavga etmeliyiz", "Konuşarak çözmeliyiz", "Ona küsmeliyiz", "Bağırmalıyız"], 1, "Konuşarak anlaşmalıyız."],
  ["Ders araç gereçlerimizi neye göre hazırlarız?", ["Ders programına göre", "Canımızın istediğine göre", "Hepsini koyarak", "Rastgele"], 0, "Haftalık ders programına göre."],
  ["Grup çalışmalarında nasıl davranmalıyız?", ["Sadece kendimiz konuşmalıyız", "Hiçbir şey yapmamalıyız", "Görevimizi yapıp yardımlaşmalıyız", "Oyun oynamalıyız"], 2, "İşbirliği yapmalıyız."],
  ["Sınıf başkanını nasıl seçeriz?", ["Kura ile", "Öğretmen seçer", "Oylama (seçim) ile", "En uzun boylu olanı"], 2, "Demokratik yöntem olan seçimle."],
  
  // Ev ve Aile
  ["Akrabalarımız kimlerdir?", ["Komşularımız", "Öğretmenlerimiz", "Amca, Teyze, Dayı, Hala", "Bakkal"], 2, "Kan bağımız olan kişiler."],
  ["Ev adresimizde hangisi bulunmaz?", ["Mahalle adı", "Sokak adı", "Kapı numarası", "Okul müdürünün adı"], 3, "Okul müdürü ev adresinde olmaz."],
  ["Evdeki işlerde ne yapmalıyız?", ["Sadece izlemeliyiz", "Yaşımıza uygun görevleri yapmalıyız", "Dağıtmalıyız", "Uyumalıyız"], 1, "Yatağımızı toplamak gibi görevleri yapmalıyız."],
  ["Tutumlu olan kişi ne yapar?", ["Parasını boşuna harcar", "Kaynakları dikkatli kullanır", "Musluğu açık bırakır", "Işıkları kapatmaz"], 1, "Tutumlu kişi israf etmez."],
  ["Elektrik, su gibi kaynakları nasıl kullanmalıyız?", ["Tasarruflu", "Bol bol", "Boşa akıtarak", "Hepsini açarak"], 0, "Tasarruflu kullanmalıyız."],
  
  // Sağlıklı Hayat
  ["Yemekten önce ve sonra ne yapmalıyız?", ["Uyumalıyız", "Ellerimizi yıkamalıyız", "Koşmalıyız", "Ders çalışmalıyız"], 1, "Ellerimizi yıkamalıyız."],
  ["Hangi besinler büyümemizi sağlar?", ["Cips ve Kola", "Süt, Yumurta, Et", "Şeker ve Çikolata", "Gazoz"], 1, "Proteinli besinler (Süt, Et)."],
  ["Mevsiminde meyve sebze yemek neden önemlidir?", ["Daha pahalıdır", "Daha sağlıklıdır ve tazedir", "Tadı kötüdür", "Rengi güzeldir"], 1, "Mevsiminde ürünler daha sağlıklıdır."],
  ["Kışın hangi meyveyi daha çok yeriz?", ["Karpuz", "Portakal", "Çilek", "Kiraz"], 1, "Portakal, mandalina C vitamini deposudur."],
  ["Yazın hangi meyveyi yeriz?", ["Karpuz", "Portakal", "Mandalina", "Nar"], 0, "Karpuz yaz meyvesidir."],
  ["Sağlığımız için günde en çok ne içmeliyiz?", ["Kola", "Meyve suyu", "Su", "Çay"], 2, "Bol bol su içmeliyiz."],
  ["Diş sağlığımız için neyden uzak durmalıyız?", ["Süt", "Peynir", "Elma", "Aşırı şekerli gıdalar"], 3, "Şeker dişleri çürütür."],
  
  // Güvenli Hayat
  ["Ulaşım araçlarında nelere dikkat etmeliyiz?", ["Ayakta durmalıyız", "Emniyet kemeri takmalıyız", "Şoförle konuşmalıyız", "Camdan sarkmalıyız"], 1, "Emniyet kemeri hayat kurtarır."],
  ["Hangi ulaşım aracı denizde gider?", ["Tren", "Uçak", "Gemi", "Otobüs"], 2, "Gemi."],
  ["Hangi ulaşım aracı havada gider?", ["Vapur", "Uçak", "Kamyon", "Bisiklet"], 1, "Uçak."],
  ["Hangi ulaşım aracı demir yolunda gider?", ["Tren", "Otobüs", "Taksi", "Gemi"], 0, "Tren, metro, tramvay."],
  ["Trafik ışıklarında 'Sarı' ne anlama gelir?", ["Geç", "Dur", "Hazırlan", "Park et"], 2, "Hazırlan demektir."],
  ["Karşıdan karşıya geçerken önce hangi tarafa bakmalıyız?", ["Sağa", "Sola", "Arkaya", "Yukarı"], 1, "Önce SOLA, sonra SAĞA, sonra tekrar SOLA."],
  ["Acil durumda polisi aramak için hangi numarayı tuşlarız?", ["112", "155", "110", "156"], 0, "Artık hepsi 112'de birleşti (Eskiden 155 idi)."],
  ["Tanımadığımız biri bize hediye verirse ne yapmalıyız?", ["Almalıyız", "Kabul etmemeliyiz ve uzaklaşmalıyız", "Teşekkür etmeliyiz", "Evine gitmeliyiz"], 1, "Hayır demeli ve oradan uzaklaşmalıyız."],
  ["Teknolojik aletleri (Tablet, TV) ne kadar kullanmalıyız?", ["Sabahtan akşama kadar", "Hiç kullanmamalıyız", "Belirlenen süre kadar", "Uyuyana kadar"], 2, "Sınırlı sürede kullanmalıyız."],
  
  // Ülkemizde Hayat
  ["Bayrağımız hangi renktir?", ["Mavi-Beyaz", "Kırmızı-Beyaz", "Sarı-Kırmızı", "Yeşil-Beyaz"], 1, "Al bayrağımız Kırmızı-Beyazdır."],
  ["İstiklal Marşı'mızın şairi kimdir?", ["Atatürk", "Mehmet Akif Ersoy", "Ömer Seyfettin", "Ali Kuşçu"], 1, "Mehmet Akif Ersoy."],
  ["Cumhuriyet Bayramı'nı ne zaman kutlarız?", ["23 Nisan", "19 Mayıs", "29 Ekim", "30 Ağustos"], 2, "29 Ekim Cumhuriyet Bayramı."],
  ["23 Nisan hangi bayramdır?", ["Gençlik Bayramı", "Zafer Bayramı", "Çocuk Bayramı", "Kurban Bayramı"], 2, "Ulusal Egemenlik ve Çocuk Bayramı."],
  ["Atatürk'ün mezarı (Anıtkabir) hangi ilimizdedir?", ["İstanbul", "İzmir", "Ankara", "Samsun"], 2, "Başkent Ankara'dadır."],
  ["Dini bayramlarımızda ne yaparız?", ["Okula gideriz", "Büyüklerimizi ziyaret ederiz", "Denize gireriz", "Resim yaparız"], 1, "Bayramlaşır, büyüklerin elini öperiz."],
  ["Misafire nasıl davranmalıyız?", ["Kapıyı açmamalıyız", "Güler yüzlü ve kibar olmalıyız", "Kızmalıyız", "Odadan çıkmamalıyız"], 1, "Türk kültüründe misafirperverlik önemlidir."],
  
  // Doğada Hayat
  ["Bitkilerin büyümek için neye ihtiyacı vardır?", ["Kola", "Su, Güneş ve Toprak", "Çikolata", "Oyuncak"], 1, "Su, güneş ve toprak."],
  ["Hangi hayvan evcil değildir?", ["Kedi", "Köpek", "Ayı", "Kuş"], 2, "Ayı vahşi bir hayvandır."],
  ["Yönümüzü bulmak için ne kullanırız?", ["Saat", "Pusula", "Termometre", "Cetvel"], 1, "Pusula."],
  ["Doğal afetlerden hangisi yer sarsıntısıdır?", ["Sel", "Çığ", "Deprem", "Heyelan"], 2, "Deprem."],
  ["Geri dönüşüm kutusuna ne atılır?", ["Elma kabuğu", "Plastik şişe", "Yemek artığı", "Islak mendil"], 1, "Plastik, kağıt, cam, metal."],
  ["Bir yılda kaç mevsim vardır?", ["2", "4", "12", "1"], 1, "4 mevsim vardır."],
  ["Ağaçlar yapraklarını hangi mevsimde döker?", ["İlkbahar", "Yaz", "Sonbahar", "Kış"], 2, "Sonbahar."]
];

// =================================================================================================
// 2. SINIF İNGİLİZCE (Words, Numbers, Colors, Body, Animals)
// =================================================================================================
const G2_ENGLISH: CompactQuestion[] = [
    // Words (Kelimeler)
    ["'Pencil' ne demektir?", ["Kitap", "Kalem", "Silgi", "Çanta"], 1, "Pencil = Kalem."],
    ["'Book' ne demektir?", ["Defter", "Kitap", "Masa", "Sıra"], 1, "Book = Kitap."],
    ["'Teacher' ne demektir?", ["Öğrenci", "Öğretmen", "Doktor", "Polis"], 1, "Teacher = Öğretmen."],
    ["'School' ne demektir?", ["Ev", "Okul", "Park", "Bahçe"], 1, "School = Okul."],
    ["'Door' ne demektir?", ["Pencere", "Kapı", "Duvar", "Çatı"], 1, "Door = Kapı."],
    ["'Window' ne demektir?", ["Kapı", "Pencere", "Masa", "Sandalye"], 1, "Window = Pencere."],
    
    // Numbers (Sayılar 1-10 ve fazlası)
    ["'One' hangi sayıdır?", ["1", "2", "3", "4"], 0, "One = 1."],
    ["'Five' hangi sayıdır?", ["4", "5", "6", "7"], 1, "Five = 5."],
    ["'Ten' hangi sayıdır?", ["5", "8", "9", "10"], 3, "Ten = 10."],
    ["'Seven' hangi sayıdır?", ["6", "7", "8", "9"], 1, "Seven = 7."],
    ["'Two' ve 'Three' toplamı kaçtır?", ["Four", "Five", "Six", "Seven"], 1, "2 + 3 = 5 (Five)."],
    
    // Colors (Renkler)
    ["'Blue' hangi renktir?", ["Mavi", "Yeşil", "Sarı", "Siyah"], 0, "Blue = Mavi."],
    ["'Red' hangi renktir?", ["Kırmızı", "Sarı", "Pembe", "Mor"], 0, "Red = Kırmızı."],
    ["'Yellow' hangi renktir?", ["Yeşil", "Turuncu", "Sarı", "Beyaz"], 2, "Yellow = Sarı."],
    ["'Green' hangi renktir?", ["Mavi", "Yeşil", "Gri", "Kahverengi"], 1, "Green = Yeşil."],
    ["'Black' and 'White' ne demektir?", ["Sarı ve Kırmızı", "Siyah ve Beyaz", "Mavi ve Yeşil", "Mor ve Pembe"], 1, "Siyah ve Beyaz."],
    ["'Purple' hangi renktir?", ["Pembe", "Mor", "Turuncu", "Gri"], 1, "Purple = Mor."],
    
    // Greetings (Selamlaşma)
    ["'Good morning' ne zaman söylenir?", ["Akşam", "Gece", "Sabah", "Öğle"], 2, "Sabah (Günaydın)."],
    ["'Good night' ne demektir?", ["Günaydın", "İyi geceler", "Merhaba", "Nasılsın"], 1, "İyi geceler."],
    ["'Hello' ne demektir?", ["Güle güle", "Merhaba", "Teşekkürler", "Evet"], 1, "Merhaba."],
    ["'How are you?' sorusuna ne cevap verilir?", ["I am fine", "I am Ali", "It is a book", "Goodbye"], 0, "İyiyim (I am fine)."],
    ["'What is your name?' ne demektir?", ["Nasılsın?", "Adın ne?", "Kaç yaşındasın?", "Nerelisin?"], 1, "Adın ne?"],
    
    // Body Parts (Vücut Bölümleri)
    ["'Eye' ne demektir?", ["Kulak", "Göz", "Burun", "Ağız"], 1, "Eye = Göz."],
    ["'Ear' ne demektir?", ["Göz", "Kulak", "El", "Ayak"], 1, "Ear = Kulak."],
    ["'Hand' ne demektir?", ["Kafa", "El", "Kol", "Bacak"], 1, "Hand = El."],
    ["'Nose' ne demektir?", ["Ağız", "Burun", "Göz", "Kulak"], 1, "Nose = Burun."],
    ["'Finger' ne demektir?", ["Parmak", "El", "Kol", "Ayak"], 0, "Finger = Parmak."],
    
    // Animals & Fruits (Hayvanlar ve Meyveler)
    ["'Cat' hangi hayvandır?", ["Köpek", "Kedi", "Kuş", "At"], 1, "Cat = Kedi."],
    ["'Dog' hangi hayvandır?", ["Kedi", "Köpek", "Balık", "Maymun"], 1, "Dog = Köpek."],
    ["'Bird' hangi hayvandır?", ["Kuş", "Arı", "Kelebek", "Yılan"], 0, "Bird = Kuş."],
    ["'Apple' ne demektir?", ["Muz", "Elma", "Portakal", "Çilek"], 1, "Apple = Elma."],
    ["'Banana' ne demektir?", ["Elma", "Muz", "Üzüm", "Kavun"], 1, "Banana = Muz."],
    ["'Lemon' ne demektir?", ["Limon", "Kavun", "Karpuz", "Kiraz"], 0, "Lemon = Limon."]
];

export const GRADE_2_POOL = {
  [Subject.MATH]: createQuestions(Subject.MATH, G2_MATH),
  [Subject.TURKISH]: createQuestions(Subject.TURKISH, G2_TURKISH),
  [Subject.LIFE]: createQuestions(Subject.LIFE, G2_LIFE),
  [Subject.ENGLISH]: createQuestions(Subject.ENGLISH, G2_ENGLISH),
};
