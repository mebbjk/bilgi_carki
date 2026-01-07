
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
// 3. SINIF MATEMATİK (Doğal Sayılar, Romen Rakamları, Dört İşlem, Kesirler, Ölçme, Geometri)
// =================================================================================================
const G3_MATH: CompactQuestion[] = [
  // Doğal Sayılar & Romen Rakamları
  ["3 basamaklı en küçük doğal sayı kaçtır?", ["100", "101", "99", "111"], 0, "100 en küçük 3 basamaklı sayıdır."],
  ["3 basamaklı en büyük doğal sayı kaçtır?", ["900", "990", "999", "1000"], 2, "999 en büyüğüdür."],
  ["3 basamaklı en küçük çift sayı kaçtır?", ["100", "102", "110", "101"], 0, "100 hem çifttir hem de en küçüktür."],
  ["3 basamaklı en küçük tek sayı kaçtır?", ["100", "101", "103", "111"], 1, "101 sayısı."],
  ["'4 yüzlük + 2 onluk + 5 birlik' hangi sayıdır?", ["425", "452", "245", "524"], 0, "400 + 20 + 5 = 425."],
  ["875 sayısının yüzler basamağındaki rakam kaçtır?", ["5", "7", "8", "800"], 2, "Yüzler basamağında 8 rakamı vardır."],
  ["605 sayısının okunuşu hangisidir?", ["Altı yüz elli", "Altı yüz beş", "Altmış beş", "Altı yüz on beş"], 1, "605 = Altı yüz beş."],
  ["Romen rakamıyla 'V' kaçı ifade eder?", ["1", "5", "10", "50"], 1, "V = 5."],
  ["Romen rakamıyla 'X' kaçı ifade eder?", ["5", "10", "20", "1"], 1, "X = 10."],
  ["Romen rakamıyla 'XX' kaçı ifade eder?", ["10", "15", "20", "30"], 2, "10 + 10 = 20."],
  ["Romen rakamıyla 'III' kaçı ifade eder?", ["1", "2", "3", "4"], 2, "III = 3."],
  ["12. (on ikinci) Romen rakamıyla nasıl yazılır?", ["X", "XII", "VX", "IIX"], 1, "X(10) + II(2) = XII."],
  ["Tek sayıların birler basamağında hangisi bulunmaz?", ["1", "3", "4", "7"], 2, "4 çift sayıdır."],
  ["345 sayısını en yakın onluğa yuvarlarsak kaç olur?", ["340", "350", "300", "400"], 1, "Birler basamağı 5 olduğu için yukarı yuvarlanır: 350."],
  ["423 sayısını en yakın yüzlüğe yuvarlarsak kaç olur?", ["400", "500", "420", "430"], 0, "Onlar basamağı 2 olduğu için kendi yüzlüğünde kalır: 400."],

  // Toplama & Çıkarma
  ["125 + 150 işleminin sonucu kaçtır?", ["200", "275", "300", "250"], 1, "125 + 150 = 275."],
  ["350 + 450 işleminin sonucu kaçtır?", ["700", "800", "900", "600"], 1, "350 + 450 = 800."],
  ["Toplamları 500 olan iki sayıdan biri 200 ise diğeri kaçtır?", ["200", "250", "300", "350"], 2, "500 - 200 = 300."],
  ["500 - 150 işleminin sonucu kaçtır?", ["300", "350", "400", "450"], 1, "350 kalır."],
  ["875 - 325 işleminin sonucu kaçtır?", ["500", "550", "450", "600"], 1, "550 eder."],
  ["Bir çıkarma işleminde eksilen 100, çıkan 40 ise fark kaçtır?", ["60", "140", "40", "100"], 0, "100 - 40 = 60."],
  ["Zihinden toplama: 400 + 300 kaç eder?", ["600", "700", "800", "900"], 1, "4+3=7 ise 700."],

  // Çarpma İşlemi
  ["6 x 6 kaç eder?", ["30", "36", "42", "48"], 1, "6 kere 6, 36 eder."],
  ["7 x 8 kaç eder?", ["54", "56", "58", "60"], 1, "7 kere 8, 56 eder."],
  ["9 x 9 kaç eder?", ["81", "18", "99", "72"], 0, "9 kere 9, 81 eder."],
  ["23 x 3 işleminin sonucu kaçtır?", ["66", "69", "60", "39"], 1, "(20x3) + (3x3) = 60+9=69."],
  ["10 ile kısa yoldan çarpma: 45 x 10 kaçtır?", ["450", "405", "540", "4500"], 0, "Sayının sonuna bir sıfır ekleriz: 450."],
  ["Bir kutuda 12 yumurta var. 5 kutuda kaç yumurta olur?", ["50", "60", "70", "72"], 1, "12 x 5 = 60."],
  ["Çarpma işleminde 'yutan eleman' hangisidir?", ["1", "0", "10", "2"], 1, "0 ile neyi çarparsan çarp sonuç 0 olur."],
  ["Çarpma işleminde 'etkisiz eleman' hangisidir?", ["1", "0", "10", "2"], 0, "1 ile neyi çarparsan çarp sonuç değişmez."],

  // Bölme İşlemi
  ["48 / 6 işleminin sonucu kaçtır?", ["6", "7", "8", "9"], 2, "6 kere 8, 48 eder."],
  ["30'u 5'e bölersek kaç buluruz?", ["5", "6", "7", "10"], 1, "30'un içinde 5, 6 kere vardır."],
  ["Bölünen 20, bölen 4 ise bölüm kaçtır?", ["4", "5", "10", "24"], 1, "20 / 4 = 5."],
  ["Kalanlı bir bölmede, bölen 5 ise kalan en fazla kaç olabilir?", ["3", "4", "5", "6"], 1, "Kalan her zaman bölenden küçük olmalıdır (En fazla 4)."],
  ["Bir sayıyı kendisine bölersek (0 hariç) sonuç kaç olur?", ["0", "1", "Sayının kendisi", "Tanımsız"], 1, "Örneğin 5/5 = 1."],
  ["80 sayısının yarısı kaçtır?", ["20", "30", "40", "50"], 2, "80 / 2 = 40."],

  // Kesirler
  ["Bir bütünün 4 eş parçasından birine ne denir?", ["Bütün", "Yarım", "Çeyrek", "Dilim"], 2, "Çeyrek (1/4)."],
  ["'3 bölü 5' (3/5) kesrinde pay hangisidir?", ["3", "5", "35", "Hiçbiri"], 0, "Üstteki sayı paydır: 3."],
  ["Hangi kesir 'yarım'ı ifade eder?", ["1/4", "1/2", "3/4", "4/4"], 1, "1/2 yarımdır."],
  ["Payı 1 olan kesirlere ne denir?", ["Birim kesir", "Bileşik kesir", "Tam kesir", "Çoklu kesir"], 0, "Birim kesir denir."],
  ["12 elmanın 1/3'ü kaç elma eder?", ["3", "4", "6", "12"], 1, "12'yi 3'e böleriz: 4."],

  // Ölçme (Zaman, Uzunluk, Tartma, Sıvı)
  ["1 saat kaç dakikadır?", ["30", "50", "60", "100"], 2, "60 dakikadır."],
  ["Yarım saat kaç dakikadır?", ["15", "30", "45", "60"], 1, "30 dakikadır."],
  ["Çeyrek saat kaç dakikadır?", ["15", "20", "30", "45"], 0, "15 dakikadır."],
  ["1 yıl kaç gündür?", ["300", "350", "365", "400"], 2, "365 gün 6 saattir."],
  ["Şubat ayı 4 yılda bir kaç gün çeker?", ["28", "29", "30", "31"], 1, "29 gün çeker (Artık yıl)."],
  ["1 metre kaç santimetredir (cm)?", ["10", "50", "100", "1000"], 2, "1 metre = 100 cm."],
  ["Yarım metre kaç santimetredir?", ["25", "50", "75", "100"], 1, "100'ün yarısı 50 cm'dir."],
  ["Kilogramın kısaltması nedir?", ["km", "kg", "gr", "mg"], 1, "kg."],
  ["1 kilogram kaç gramdır?", ["100", "500", "1000", "10"], 2, "1000 gramdır."],
  ["Sıvıları ne ile ölçeriz?", ["Metre", "Kilogram", "Litre", "Saat"], 2, "Litre ile ölçeriz."],
  ["2 tane yarım litre kaç litre eder?", ["1", "2", "3", "4"], 0, "1 litre eder."],

  // Geometri
  ["Hangi şeklin 3 köşesi vardır?", ["Kare", "Üçgen", "Dikdörtgen", "Çember"], 1, "Üçgen."],
  ["Küpün kaç yüzü vardır?", ["4", "6", "8", "12"], 1, "6 yüzü vardır."],
  ["Küpün kaç ayrıtı (kenarı) vardır?", ["8", "10", "12", "6"], 2, "12 ayrıtı vardır."],
  ["Kibrit kutusu hangi geometrik cisme benzer?", ["Küp", "Kare Prizma", "Dikdörtgen Prizma", "Silindir"], 2, "Dikdörtgen prizmaya benzer."],
  ["Top hangi geometrik cisme benzer?", ["Küre", "Daire", "Silindir", "Koni"], 0, "Küreye benzer."],
  ["Konserve kutusu hangi şekildir?", ["Küre", "Koni", "Silindir", "Prizma"], 2, "Silindir."],
  ["Hangi şeklin köşesi ve kenarı yoktur?", ["Kare", "Üçgen", "Daire", "Dikdörtgen"], 2, "Dairenin köşesi yoktur."],
  ["Karenin bir kenarı 5 cm ise çevresi kaç cm'dir?", ["10", "15", "20", "25"], 2, "5 x 4 = 20 cm."],
  ["Simetri doğrusu nedir?", ["Şekli iki eş parçaya bölen çizgi", "Şeklin kenarı", "Şeklin köşesi", "Şeklin alanı"], 0, "İki eş parçaya böler."]
];

// =================================================================================================
// 3. SINIF TÜRKÇE (Sözcük, Cümle, Yazım, Noktalama, Okuma Anlama)
// =================================================================================================
const G3_TURKISH: CompactQuestion[] = [
  // Eş ve Zıt Anlam
  ["'Siyah' kelimesinin eş anlamlısı nedir?", ["Beyaz", "Kara", "Mavi", "Ak"], 1, "Siyah = Kara."],
  ["'Beyaz' kelimesinin eş anlamlısı nedir?", ["Siyah", "Ak", "Al", "Kırmızı"], 1, "Beyaz = Ak."],
  ["'İhtiyar' kelimesinin zıt anlamlısı nedir?", ["Yaşlı", "Genç", "Büyük", "Küçük"], 1, "İhtiyar(Yaşlı) zıttı Genç."],
  ["'Uzak' kelimesinin zıt anlamlısı nedir?", ["Irak", "Yakın", "Uzun", "Kısa"], 1, "Uzak - Yakın."],
  ["'Özgürlük' kelimesinin eş anlamlısı nedir?", ["Esaret", "Hürriyet", "Tutsaklık", "Bağımlılık"], 1, "Özgürlük = Hürriyet."],
  ["'Vatan' kelimesinin eş anlamlısı nedir?", ["Millet", "Yurt", "Bayrak", "Şehir"], 1, "Vatan = Yurt."],
  ["'Taze' kelimesinin zıt anlamlısı nedir?", ["Yeni", "Bayat", "Güzel", "Sıcak"], 1, "Taze - Bayat."],
  ["'Zengin' kelimesinin zıt anlamlısı nedir?", ["Varlıklı", "Fakir", "Güçlü", "Paralı"], 1, "Zengin - Fakir."],
  ["'Savaş' kelimesinin zıt anlamlısı nedir?", ["Barış", "Harp", "Kavga", "Dövüş"], 0, "Savaş - Barış."],
  ["'Cevap' kelimesinin eş anlamlısı nedir?", ["Soru", "Yanıt", "Ses", "Söz"], 1, "Cevap = Yanıt."],

  // Eş Sesli (Sesteş) Kelimeler
  ["Hangi kelime eş seslidir?", ["Masa", "Yüz", "Defter", "Kalem"], 1, "Yüz (Sayı) ve Yüz (Surat) ve Yüzmek."],
  ["Hangi kelime eş seslidir?", ["Çay", "Elma", "Armut", "Okul"], 0, "Çay (İçecek) ve Çay (Dere)."],
  ["Hangi kelime eş seslidir?", ["Gül", "Lale", "Papatya", "Sümbül"], 0, "Gül (Çiçek) ve Gülmek (Eylem)."],
  ["'Yaz' kelimesi hangi cümlede mevsim anlamındadır?", ["Deftere yazı yaz.", "Bu yaz tatile gideceğiz.", "Tahtaya ismini yaz.", "Mektup yaz."], 1, "Bu yaz tatile gideceğiz."],

  // Sözcük Yapısı ve Ekler
  ["'Kitaplık' kelimesindeki '-lık' eki kelimeye ne yapmıştır?", ["Çoğul yapmıştır", "Anlamını değiştirmiştir (Türemiş)", "Hiçbir şey yapmamıştır", "Küçültmüştür"], 1, "Kitap (nesne) -> Kitaplık (eşya), anlam değişti."],
  ["'Simitçi' kelimesinin kökü nedir?", ["Sim", "Simit", "Çi", "Simi"], 1, "Kök: Simit."],
  ["Hangi kelime türemiş kelimedir?", ["Masa", "Gözlük", "Kalem", "Defter"], 1, "Göz -> Gözlük (Ek alarak türemiş)."],
  ["Hangi kelime basit kelimedir (ek almamış veya anlamı değişmemiş)?", ["Balıkçı", "Tuzluk", "Ev", "Evli"], 2, "Ev basittir."],
  ["'Lar/Ler' eki kelimeye ne anlamı katar?", ["Küçültme", "Çoğul (Birden çok)", "Soru", "Olumsuzluk"], 1, "Çoğul anlamı katar (Elmalar)."],

  // Cümle Bilgisi
  ["Duygu, düşünce veya iş bildiren kelime dizisine ne denir?", ["Harf", "Hece", "Kelime", "Cümle"], 3, "Cümle (Tümce)."],
  ["Hangi cümle 'sebep-sonuç' bildirir?", ["Okula gittim.", "Çok çalıştığım için başardım.", "Kitap okudum.", "Yarın geleceğim."], 1, "Başarmasının sebebi çok çalışması."],
  ["Hangisi kurallı bir cümledir?", ["Gitti eve Ali.", "Ali eve gitti.", "Eve Ali gitti.", "Gitti Ali eve."], 1, "Ali eve gitti (Yüklem sonda)."],
  ["'Sakla samanı, gelir zamanı' cümlesi nedir?", ["Deyim", "Atasözü", "Özdeyiş", "Şiir"], 1, "Atasözüdür."],
  ["'Etekleri zil çalmak' deyiminin anlamı nedir?", ["Korkmak", "Çok sevinmek", "Üzülmek", "Koşmak"], 1, "Çok sevinmek."],
  ["'Küplere binmek' deyiminin anlamı nedir?", ["Çok sinirlenmek", "Sevinmek", "Gezmek", "Oturmak"], 0, "Çok sinirlenmek."],

  // Yazım ve Noktalama
  ["Özel isimlere gelen ekler ne ile ayrılır?", ["Nokta", "Virgül", "Kesme İşareti", "Kısa Çizgi"], 2, "Kesme işareti (') ile ayrılır."],
  ["Soru bildiren cümlelerin sonuna ne konur?", ["Nokta", "Ünlem", "Soru İşareti", "Virgül"], 2, "Soru işareti (?)."],
  ["Sevinç, korku, heyecan bildiren cümlelerin sonuna ne konur?", ["Nokta", "Ünlem", "Soru İşareti", "Üç Nokta"], 1, "Ünlem (!) işareti."],
  ["Hangi kelimenin yazımı yanlıştır?", ["Tıren", "Spor", "Plan", "Kral"], 0, "Tren (arada ı olmaz)."],
  ["'Herkez' kelimesinin doğru yazımı nasıldır?", ["Herkes", "Herkez", "Herkeş", "Erkes"], 0, "Herkes."],
  ["'Yalnız' kelimesinin doğru yazımı nasıldır?", ["Yanlız", "Yalnız", "Yalınız", "Yannız"], 1, "Yalnız (Yalın'dan gelir)."],
  ["'Yanlış' kelimesinin doğru yazımı nasıldır?", ["Yalnış", "Yanlış", "Yanılış", "Yannış"], 1, "Yanlış (Yanıl'dan gelir)."],
  ["Şehir isimleri nasıl başlar?", ["Küçük harfle", "Büyük harfle", "Rakamla", "Eğik"], 1, "Büyük harfle başlar (Ankara, İzmir)."],

  // Okuma Anlama (Mantık)
  ["Hikayenin geçtiği yere ne denir?", ["Zaman", "Kişi", "Mekan (Yer)", "Olay"], 2, "Mekan."],
  ["Hikayedeki olayları yaşayan kişilere ne denir?", ["Kahramanlar", "Yazarlar", "Okurlar", "Mekanlar"], 0, "Kahramanlar (Kişiler)."],
  ["Şiir yazan kişiye ne denir?", ["Yazar", "Ressam", "Şair", "Müzisyen"], 2, "Şair."],
  ["Düz yazı yazan kişiye ne denir?", ["Şair", "Yazar", "Heykeltraş", "Mimar"], 1, "Yazar."]
];

// =================================================================================================
// 3. SINIF FEN BİLİMLERİ (Gezegenimiz, Beş Duyu, Kuvvet, Madde, Işık/Ses, Canlılar, Elektrik)
// =================================================================================================
const G3_SCIENCE: CompactQuestion[] = [
  // Gezegenimizi Tanıyalım
  ["Dünya'nın şekli neye benzer?", ["Tepsiye", "Küreye", "Kutuya", "Masaya"], 1, "Küreye benzer (Alttan üstten basık)."],
  ["Dünya'nın yüzeyinde en çok ne bulunur?", ["Karalar", "Sular", "Buzullar", "Ormanlar"], 1, "Sular karalardan daha çok yer kaplar."],
  ["Hava tabakasına ne ad verilir?", ["Atmosfer", "Taş Küre", "Su Küre", "Çekirdek"], 0, "Atmosfer (Hava Küre)."],
  ["Üzerinde yaşadığımız katman hangisidir?", ["Hava küre", "Yer kabuğu (Taş Küre)", "Çekirdek", "Manto"], 1, "Yer kabuğu."],
  ["Dünya'nın en sıcak katmanı hangisidir?", ["Yer kabuğu", "Su küre", "Çekirdek (Ağır Küre)", "Hava küre"], 2, "Çekirdek."],
  ["Dünya'nın içindeki ateşli tabakaya ne denir?", ["Magma (Manto)", "Su", "Hava", "Toprak"], 0, "Magma."],

  // Beş Duyumuz
  ["Çevremizi görmemizi sağlayan duyu organımız?", ["Kulak", "Burun", "Göz", "Deri"], 2, "Göz."],
  ["Sesleri duymamızı sağlayan duyu organımız?", ["Göz", "Kulak", "Burun", "Dil"], 1, "Kulak."],
  ["Kokuları algılamamızı sağlayan duyu organımız?", ["Dil", "Deri", "Burun", "Kulak"], 2, "Burun."],
  ["Tat almamızı sağlayan duyu organımız?", ["Burun", "Göz", "Dil", "Deri"], 2, "Dil."],
  ["Sıcağı, soğuğu, serti, yumuşağı hangi organla hissederiz?", ["Göz", "Deri", "Kulak", "Burun"], 1, "Deri."],
  ["Göz sağlığı için ne yapmalıyız?", ["Yakından TV izlemeliyiz", "Güneşe çıplak gözle bakmamalıyız", "Karanlıkta okumalıyız", "Gözümüzü ovuşturmalıyız"], 1, "Güneşe doğrudan bakmamalıyız."],
  ["Deri sağlığı için en önemlisi nedir?", ["Banyo yapmak (Temizlik)", "Güneşte çok kalmak", "Parfüm sıkmak", "Boyamak"], 0, "Düzenli banyo yapmak."],

  // Kuvveti Tanıyalım
  ["Hareket eden bir cismi durdurmak için ne uygularız?", ["Kuvvet", "Isı", "Işık", "Ses"], 0, "Kuvvet."],
  ["Çekmeceyi açmak için hangi kuvveti uygularız?", ["İtme", "Çekme", "Döndürme", "Sallama"], 1, "Çekme kuvveti."],
  ["Topa vururken hangi kuvveti uygularız?", ["Çekme", "İtme", "Tutma", "Bükme"], 1, "İtme kuvveti."],
  ["Hareket halindeki bir cisme, hareket yönünde kuvvet uygularsak ne olur?", ["Yavaşlar", "Durur", "Hızlanır", "Yön değiştirir"], 2, "Hızlanır."],
  ["Hareket halindeki bir cisme, ters yönde kuvvet uygularsak ne olur?", ["Hızlanır", "Yavaşlar veya durur", "Uçar", "Renk değiştirir"], 1, "Yavaşlar veya durur."],

  // Maddeyi Tanıyalım
  ["Maddenin kaç hali vardır?", ["2", "3", "4", "5"], 1, "Katı, Sıvı, Gaz (3 hal)."],
  ["Kalem, silgi, taş maddenin hangi halidir?", ["Sıvı", "Gaz", "Katı", "Buhar"], 2, "Katı."],
  ["Su, süt, zeytinyağı maddenin hangi halidir?", ["Katı", "Sıvı", "Gaz", "Buz"], 1, "Sıvı."],
  ["Hava, su buharı maddenin hangi halidir?", ["Katı", "Sıvı", "Gaz", "Erime"], 2, "Gaz."],
  ["Hangi madde esnektir?", ["Taş", "Cam", "Sünger", "Tahta"], 2, "Sünger esnektir."],
  ["Hangi madde kırılgandır?", ["Demir", "Cam", "Pamuk", "Lastik"], 1, "Cam kırılgandır."],
  ["Hangi madde pürüzlüdür?", ["Ayna", "Cam", "Zımpara kağıdı", "Kağıt"], 2, "Zımpara kağıdı."],
  ["Hangi madde yumuşaktır?", ["Pamuk", "Taş", "Demir", "Tahta"], 0, "Pamuk."],

  // Işık ve Ses
  ["En büyük doğal ışık kaynağımız nedir?", ["Ay", "Güneş", "Yıldızlar", "Ateş böceği"], 1, "Güneş."],
  ["Ay bir ışık kaynağı mıdır?", ["Evet", "Hayır", "Bazen", "Geceleri"], 1, "Hayır, Güneş'ten aldığı ışığı yansıtır."],
  ["Hangisi doğal ışık kaynağıdır?", ["Mum", "Ampul", "Ateş böceği", "El feneri"], 2, "Ateş böceği."],
  ["Hangisi yapay ışık kaynağıdır?", ["Güneş", "Yıldız", "Ampul", "Şimşek"], 2, "Ampul insan yapımıdır."],
  ["Ses en şiddetli nerede duyulur?", ["Kaynağa yakınken", "Kaynaktan uzakta", "Kapalı odada", "Uzayda"], 0, "Kaynağa ne kadar yakınsak ses o kadar şiddetlidir."],
  ["İnsan kulağı her sesi duyabilir mi?", ["Evet", "Hayır", "Bazen", "Gece duyar"], 1, "Hayır, çok düşük veya çok yüksek sesleri duyamaz."],
  ["Ses kirliliğine ne ad verilir?", ["Işık", "Gürültü", "Müzik", "Melodi"], 1, "Gürültü."],

  // Canlılar Dünyası
  ["Canlıların ortak özelliği nedir?", ["Uçmak", "Yürümek", "Solunum yapmak", "Konuşmak"], 2, "Solunum, beslenme, büyüme, üreme."],
  ["Bitkiler kendi besinini nasıl üretir?", ["Avlanarak", "Güneş ışığı ve su ile", "Marketten alarak", "Uyuyarak"], 1, "Fotosentez (Güneş ve su)."],
  ["Hangisi cansız varlıktır?", ["Kedi", "Çiçek", "Taş", "Ağaç"], 2, "Taş cansızdır."],
  ["Doğal çevreyi kim oluşturur?", ["İnsanlar", "Doğa kendiliğinden", "Mühendisler", "İşçiler"], 1, "Kendiliğinden oluşur (Dağ, deniz)."],
  ["Yapay çevreyi kim oluşturur?", ["Hayvanlar", "İnsanlar", "Rüzgar", "Güneş"], 1, "İnsanlar (Parklar, binalar, yollar)."],
  ["Ormanların faydası nedir?", ["Havayı temizler", "Gürültü yapar", "Çirkin görünür", "Suyu kirletir"], 0, "Oksijen kaynağıdır."],

  // Elektrikli Araçlar
  ["Şehir elektriği ile çalışan alet hangisidir?", ["Kol saati", "TV kumandası", "Buzdolabı", "El feneri"], 2, "Buzdolabı fişe takılır."],
  ["Pil ile çalışan alet hangisidir?", ["Çamaşır makinesi", "Ütü", "TV kumandası", "Fırın"], 2, "Kumanda pil ile çalışır."],
  ["Akü ile çalışan araç hangisidir?", ["Otomobil", "Bisiklet", "Saat", "Hesap makinesi"], 0, "Otomobil."],
  ["Elektrik çarpmaması için ne yapmalıyız?", ["Islak elle dokunmamalıyız", "Kabloları kesmeliyiz", "Prizle oynamalıyız", "Demir sokmalıyız"], 0, "Islak elle dokunmak tehlikelidir."],
  ["Pilleri doğaya atmak neye sebep olur?", ["Toprak kirliliğine", "Ağaçların büyümesine", "Havanın temizlenmesine", "Yağmur yağmasına"], 0, "Toprağı ve suyu zehirler."]
];

// =================================================================================================
// 3. SINIF HAYAT BİLGİSİ (Okul, Ev, Sağlık, Güvenlik, Yönetim, Doğa)
// =================================================================================================
const G3_LIFE: CompactQuestion[] = [
  // Okul Heyecanım
  ["Arkadaş seçerken neye dikkat etmeliyiz?", ["Zengin olmasına", "Dürüst ve saygılı olmasına", "Kavgacı olmasına", "Tembel olmasına"], 1, "Dürüst ve iyi huylu olmasına."],
  ["Kroki ne demektir?", ["Harita", "Kuş bakışı ölçüsüz çizim", "Resim", "Fotoğraf"], 1, "Bir yerin kuş bakışı göz kararı çizimi."],
  ["Okul kaynaklarını nasıl kullanmalıyız?", ["İsraf ederek", "Kırarak", "Özenli ve tasarruflu", "Eve götürerek"], 2, "Özenli kullanmalıyız."],
  ["İstek ve ihtiyaçlarımızda hangisi önceliklidir?", ["İstekler", "İhtiyaçlar", "Oyunlar", "Gezmeler"], 1, "Önce ihtiyaçlar (yemek, barınma) gelir."],
  ["Okuldaki dilek kutusu ne işe yarar?", ["Çöp atmaya", "İstek ve şikayetlerimizi yazmaya", "Para biriktirmeye", "Kalem saklamaya"], 1, "Öneri ve şikayetler için."],

  // Evimizde Hayat
  ["Evdeki aletlerin bakımını kim yapar?", ["Sadece çocuklar", "Tamirci veya büyükler", "Hiç kimse", "Öğretmen"], 1, "Büyükler veya uzmanlar."],
  ["Planlı yaşamak bize ne kazandırır?", ["Zamanı verimli kullanmayı", "Yorgunluk", "Uykusuzluk", "Başarısızlık"], 0, "Başarı ve zaman kazandırır."],
  ["Ev adresimizde hangisi bulunmaz?", ["Sokak adı", "Kapı no", "TC kimlik no", "İlçe adı"], 2, "TC kimlik no adreste yazmaz."],
  ["Komşuluk ilişkilerinde ne önemlidir?", ["Gürültü yapmak", "Yardımlaşma ve saygı", "Kavga etmek", "Hiç konuşmamak"], 1, "Yardımlaşma."],
  
  // Sağlıklı Hayat
  ["Kişisel bakımımızı yapmazsak ne olur?", ["Daha güzel oluruz", "Hasta olabiliriz", "Güçlü oluruz", "Mutlu oluruz"], 1, "Mikrop kapar, hasta oluruz."],
  ["Dengeli beslenme nedir?", ["Sadece et yemek", "Sadece tatlı yemek", "Her besinden yeterince yemek", "Hiç yememek"], 2, "Her besin grubundan yeterince tüketmek."],
  ["Mevsimine uygun sebze meyve yemek neden önemlidir?", ["Daha pahalıdır", "Daha sağlıklıdır", "Tadı kötüdür", "Rengi kötüdür"], 1, "Doğal ve sağlıklıdır."],
  ["Hangi yiyecek dişlerimize zarar verir?", ["Süt", "Peynir", "Elma", "Aşırı şeker ve asitli içecekler"], 3, "Şeker çürük yapar."],

  // Güvenli Hayat
  ["Trafik kazalarından korunmak için ne kullanmalıyız?", ["Üst geçit ve yaya geçidi", "Otoyol", "Tünel", "Araba"], 0, "Güvenli geçiş yerlerini."],
  ["Bisiklet ve kaykay sürerken ne takmalıyız?", ["Gözlük", "Kask ve dizlik", "Şapka", "Atkı"], 1, "Kask, dizlik, dirseklik."],
  ["Tanımadığımız kişilerle nasıl konuşmalıyız?", ["Her şeyi anlatmalıyız", "Evimize davet etmeliyiz", "Mesafeli olmalı, gerekirse konuşmamalıyız", "Para istemeliyiz"], 2, "Güvenliğimiz için mesafeli olmalıyız."],
  ["Evde tek başınayken kapı çalarsa ne yapmalıyız?", ["Hemen açmalıyız", "Kim olduğuna bakmadan açmamalıyız", "Pencereden atlamalıyız", "Ağlamalıyız"], 1, "Tanımadığımıza açmamalıyız."],
  ["Acil durumda 112'yi aradığımızda ne yapmalıyız?", ["Adresimizi sakin ve doğru vermeliyiz", "Şaka yapmalıyız", "Hemen kapatmalıyız", "Şarkı söylemeliyiz"], 0, "Konumu net bildirmeliyiz."],

  // Ülkemizde Hayat
  ["Cumhuriyet ne zaman ilan edildi?", ["19 Mayıs 1919", "23 Nisan 1920", "29 Ekim 1923", "30 Ağustos 1922"], 2, "29 Ekim 1923."],
  ["İlk Cumhurbaşkanımız kimdir?", ["İsmet İnönü", "Mustafa Kemal Atatürk", "Fevzi Çakmak", "Kazım Karabekir"], 1, "Atatürk."],
  ["Yönetim birimlerinden en küçüğü hangisidir?", ["Valilik", "Kaymakamlık", "Belediye", "Muhtarlık"], 3, "Muhtarlık (Köy/Mahalle)."],
  ["İlimizi kim yönetir?", ["Muhtar", "Kaymakam", "Vali", "Belediye Başkanı"], 2, "Vali."],
  ["İlçeyi kim yönetir?", ["Vali", "Kaymakam", "Muhtar", "Müdür"], 1, "Kaymakam."],
  ["Yerel seçimlerde kimi seçeriz?", ["Valiyi", "Kaymakamı", "Belediye Başkanı ve Muhtarı", "Öğretmeni"], 2, "Belediye başkanı ve muhtar halk tarafından seçilir."],
  ["Atatürk'ün anıt mezarı (Anıtkabir) nerededir?", ["İstanbul", "Ankara", "İzmir", "Samsun"], 1, "Ankara."],
  ["Milli Marşımız hangisidir?", ["10. Yıl Marşı", "İstiklal Marşı", "Gençlik Marşı", "İzmir Marşı"], 1, "İstiklal Marşı."],
  ["İstiklal Marşı'nı kim yazmıştır?", ["Atatürk", "Mehmet Akif Ersoy", "Ziya Gökalp", "Namık Kemal"], 1, "Mehmet Akif Ersoy."],

  // Doğada Hayat
  ["Yönümüzü bulmak için ne kullanırız?", ["Pusula", "Saat", "Termometre", "Cetvel"], 0, "Pusula."],
  ["Pusulanın renkli ucu nereyi gösterir?", ["Güney", "Doğu", "Batı", "Kuzey"], 3, "Kuzeyi."],
  ["Doğal unsur hangisidir?", ["Köprü", "Baraj", "Dağ", "Bina"], 2, "Dağ kendiliğinden oluşmuştur."],
  ["Yapay (Beşeri) unsur hangisidir?", ["Göl", "Orman", "Deniz", "Yol"], 3, "Yolu insanlar yapar."],
  ["Geri dönüşümün faydası nedir?", ["Çöpü artırır", "Doğayı ve kaynakları korur", "Maliyeti artırır", "Zararlıdır"], 1, "Kaynakları korur."],
  ["Doğayı korumak için ne yapmalıyız?", ["Ağaç dikmeliyiz", "Yerlere çöp atmalıyız", "Suları kirletmeliyiz", "Hayvanları kovalamalıyız"], 0, "Fidan dikmeli ve korumalıyız."]
];

// =================================================================================================
// 3. SINIF İNGİLİZCE (Greeting, Family, Numbers, Body, Toys, House, Weather)
// =================================================================================================
const G3_ENGLISH: CompactQuestion[] = [
    // Greetings & Intro
    ["'Good afternoon' ne demektir?", ["Günaydın", "Tünaydın (İyi öğlenler)", "İyi akşamlar", "İyi geceler"], 1, "Tünaydın."],
    ["'How are you?' sorusuna nasıl cevap verilir?", ["I am fine, thanks.", "My name is Ali.", "I am ten.", "Goodbye."], 0, "İyiyim, teşekkürler."],
    ["'Nice to meet you' ne demektir?", ["Görüşürüz", "Tanıştığımıza memnun oldum", "Nasılsın", "Teşekkürler"], 1, "Tanıştığımıza memnun oldum."],
    ["'Who is this?' sorusu neyi sorar?", ["Bu ne?", "Bu kim?", "Neredesin?", "Kaç tane?"], 1, "Bu kim?"],
    
    // Family
    ["'Grandmother' kimdir?", ["Anne", "Abla", "Büyükanne (Nine)", "Teyze"], 2, "Grandmother."],
    ["'Grandfather' kimdir?", ["Baba", "Dede", "Amca", "Dayı"], 1, "Grandfather."],
    ["'Uncle' ne demektir?", ["Amca/Dayı", "Hala/Teyze", "Kardeş", "Baba"], 0, "Amca veya Dayı."],
    ["'Aunt' ne demektir?", ["Amca", "Hala/Teyze", "Nine", "Dede"], 1, "Hala veya Teyze."],
    ["'Cousin' ne demektir?", ["Kardeş", "Kuzen", "Arkadaş", "Komşu"], 1, "Kuzen."],
    
    // Numbers (1-20 and tens)
    ["'Twelve' hangi sayıdır?", ["11", "12", "13", "20"], 1, "12."],
    ["'Thirteen' hangi sayıdır?", ["3", "13", "30", "33"], 1, "13."],
    ["'Fifteen' hangi sayıdır?", ["5", "15", "50", "55"], 1, "15."],
    ["'Twenty' hangi sayıdır?", ["12", "20", "30", "10"], 1, "20."],
    ["'Thirty' hangi sayıdır?", ["3", "13", "30", "33"], 2, "30."],
    ["'Fifty' hangi sayıdır?", ["5", "15", "50", "55"], 2, "50."],
    
    // Body Parts
    ["'Head' neresidir?", ["El", "Baş/Kafa", "Ayak", "Omuz"], 1, "Head."],
    ["'Shoulder' neresidir?", ["Diz", "Omuz", "Kol", "Parmak"], 1, "Shoulder."],
    ["'Knee' neresidir?", ["Ayak", "Diz", "Dirsek", "Boyun"], 1, "Diz."],
    ["'Mouth' neresidir?", ["Burun", "Kulak", "Ağız", "Göz"], 2, "Ağız."],
    
    // Toys & Games
    ["'Ball' ne demektir?", ["Bebek", "Top", "Uçurtma", "Araba"], 1, "Top."],
    ["'Doll' ne demektir?", ["Top", "Oyuncak Bebek", "Bilye", "Balon"], 1, "Oyuncak bebek."],
    ["'Kite' ne demektir?", ["Bisiklet", "Uçurtma", "Top", "Blok"], 1, "Uçurtma."],
    ["'Bike' ne demektir?", ["Araba", "Bisiklet", "Otobüs", "Tren"], 1, "Bisiklet."],
    ["'Chess' hangi oyundur?", ["Saklambaç", "Satranç", "Futbol", "Yakan top"], 1, "Satranç."],
    
    // House (Rooms)
    ["'Living room' evin neresidir?", ["Mutfak", "Oturma odası (Salon)", "Yatak odası", "Banyo"], 1, "Oturma odası."],
    ["'Bedroom' evin neresidir?", ["Yatak odası", "Banyo", "Bahçe", "Mutfak"], 0, "Yatak odası."],
    ["'Kitchen' evin neresidir?", ["Salon", "Mutfak", "Banyo", "Garaj"], 1, "Mutfak."],
    ["'Bathroom' evin neresidir?", ["Yatak odası", "Banyo", "Çatı", "Koridor"], 1, "Banyo."],
    
    // In My City
    ["'Hospital' ne demektir?", ["Okul", "Hastane", "Park", "Müze"], 1, "Hastane."],
    ["'Museum' ne demektir?", ["Sinema", "Müze", "Kütüphane", "Market"], 1, "Müze."],
    ["'Zoo' ne demektir?", ["Park", "Hayvanat bahçesi", "Okul", "Kafe"], 1, "Hayvanat bahçesi."],
    ["'Shopping center' ne demektir?", ["Park", "Alışveriş merkezi", "Hastane", "Banka"], 1, "AVM."],
    
    // Feelings & Adjectives
    ["'Happy' ne demektir?", ["Üzgün", "Mutlu", "Kızgın", "Yorgun"], 1, "Mutlu."],
    ["'Sad' ne demektir?", ["Mutlu", "Üzgün", "Şaşkın", "Aç"], 1, "Üzgün."],
    ["'Tired' ne demektir?", ["Enerjik", "Yorgun", "Hızlı", "Güçlü"], 1, "Yorgun."],
    ["'Hungry' ne demektir?", ["Tok", "Aç", "Susuz", "Uykulu"], 1, "Aç."],
    ["'Big' kelimesinin zıttı nedir?", ["Small", "Tall", "Fast", "Red"], 0, "Big (Büyük) - Small (Küçük)."],
    ["'Fast' kelimesinin zıttı nedir?", ["Slow", "Big", "Hot", "Cold"], 0, "Fast (Hızlı) - Slow (Yavaş)."],
    
    // Weather
    ["'Sunny' hava nasıldır?", ["Yağmurlu", "Güneşli", "Karlı", "Rüzgarlı"], 1, "Güneşli."],
    ["'Rainy' hava nasıldır?", ["Güneşli", "Yağmurlu", "Bulutlu", "Sıcak"], 1, "Yağmurlu."],
    ["'Snowy' hava nasıldır?", ["Karlı", "Güneşli", "Sıcak", "Açık"], 0, "Karlı."],
    ["'Hot' ne demektir?", ["Soğuk", "Sıcak", "Ilık", "Serin"], 1, "Sıcak."],
    ["'Cold' ne demektir?", ["Sıcak", "Soğuk", "Kuru", "Islak"], 1, "Soğuk."]
];

export const GRADE_3_POOL = {
  [Subject.MATH]: createQuestions(Subject.MATH, G3_MATH),
  [Subject.TURKISH]: createQuestions(Subject.TURKISH, G3_TURKISH),
  [Subject.SCIENCE]: createQuestions(Subject.SCIENCE, G3_SCIENCE),
  [Subject.LIFE]: createQuestions(Subject.LIFE, G3_LIFE),
  [Subject.ENGLISH]: createQuestions(Subject.ENGLISH, G3_ENGLISH),
};
