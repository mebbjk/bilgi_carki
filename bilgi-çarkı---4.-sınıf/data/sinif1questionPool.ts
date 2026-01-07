
import { QuestionData, Subject } from '../types';

// Sıkıştırılmış Soru Formatı: [Soru Metni, [Şık1, Şık2, Şık3, Şık4], DoğruCevapIndexi, Açıklama]
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
// 1. SINIF MATEMATİK SORULARI (Rakamlar, Ritmik Sayma, İşlemler, Geometri)
// =================================================================================================
const G1_MATH: CompactQuestion[] = [
  // Rakamlar ve Sayma
  ["Aşağıdakilerden hangisi bir rakamdır?", ["A", "5", "K", "?"], 1, "0,1,2,3,4,5,6,7,8,9 birer rakamdır."],
  ["Bir elimde 5 parmak var, iki elimde kaç parmak olur?", ["5", "8", "10", "12"], 2, "5 + 5 = 10 parmak eder."],
  ["10'dan geriye sayarken 9'dan sonra hangi sayı gelir?", ["10", "8", "7", "11"], 1, "10, 9, 8... diye sayarız."],
  ["Hangi sayı 10'dan küçüktür?", ["12", "15", "8", "20"], 2, "8 sayısı 10'dan küçüktür."],
  ["Hangi sayı 15 ile 17 arasındadır?", ["14", "16", "18", "19"], 1, "15, 16, 17..."],
  ["2 onluk kaç eder?", ["2", "12", "20", "22"], 2, "1 onluk 10'dur, 2 onluk 20 eder."],
  ["Hangi sayı 'on dokuz' diye okunur?", ["91", "19", "9", "109"], 1, "19 = On dokuz."],
  ["Bir düzine kalemin içinde kaç kalem vardır?", ["10", "12", "5", "20"], 1, "Bir düzine 12 tanedir."],
  ["Bir deste kalemin içinde kaç kalem vardır?", ["10", "12", "5", "20"], 0, "Bir deste 10 tanedir."],
  ["Sınıfımızda 10 kız, 5 erkek öğrenci var. Sınıf mevcudu kaçtır?", ["10", "5", "15", "20"], 2, "10 + 5 = 15 öğrenci."],
  ["Aşağıdaki sayılardan hangisi en büyüktür?", ["8", "19", "11", "5"], 1, "19 en büyük sayıdır."],
  ["Aşağıdaki sayılardan hangisi en küçüktür?", ["20", "10", "2", "12"], 2, "2 en küçük sayıdır."],
  
  // 2. KONU: RİTMİK SAYMA
  ["2, 4, 6, ... Sırada hangi sayı gelir?", ["7", "8", "9", "10"], 1, "İkişer ritmik sayma: 6'dan sonra 8 gelir."],
  ["5, 10, 15, ... Sırada hangi sayı gelir?", ["16", "20", "25", "18"], 1, "Beşer ritmik sayma: 15'ten sonra 20 gelir."],
  ["10, 20, 30, ... Sırada hangi sayı gelir?", ["35", "40", "50", "31"], 1, "Onar ritmik sayma: 30'dan sonra 40 gelir."],
  ["1'den başlayarak birer birer sayarken 5'ten sonra ne söyleriz?", ["4", "6", "7", "8"], 1, "1, 2, 3, 4, 5, 6..."],
  ["Geriye doğru sayarken: 5, 4, 3, ... Sırada ne var?", ["2", "6", "1", "0"], 0, "5, 4, 3, 2."],
  ["20'den geriye ikişer sayarken: 20, 18, ... Sırada ne var?", ["17", "16", "15", "14"], 1, "20, 18, 16..."],
  ["Hangi sayı dizisi 5'er ritmik saymadır?", ["5, 6, 7", "5, 10, 15", "10, 20, 30", "2, 4, 6"], 1, "5, 10, 15 beşer saymadır."],
  
  // Toplama İşlemi
  ["5 + 3 işleminin sonucu kaçtır?", ["7", "8", "9", "6"], 1, "5'in üzerine 3 sayarsak 8 eder."],
  ["2 + 2 kaç eder?", ["2", "3", "4", "5"], 2, "2, 3, 4. Sonuç 4."],
  ["7 + 0 işleminin sonucu kaçtır?", ["0", "7", "70", "1"], 1, "0 etkisiz elemandır, sonuç değişmez."],
  ["6 cevizim vardı, 4 tane daha aldım. Kaç cevizim oldu?", ["8", "9", "10", "11"], 2, "6 + 4 = 10 eder."],
  ["10 + 5 işleminin sonucu kaçtır?", ["105", "15", "50", "5"], 1, "10 + 5 = 15."],
  ["8 + 8 işleminin sonucu kaçtır?", ["16", "18", "10", "14"], 0, "8 + 8 = 16."],
  ["3 + 3 + 3 işleminin sonucu kaçtır?", ["6", "9", "12", "3"], 1, "3, 6, 9."],
  ["Hangi iki sayıyı toplarsak 10 eder?", ["5 ve 4", "5 ve 5", "6 ve 3", "7 ve 2"], 1, "5 + 5 = 10."],
  ["Bahçede 3 kedi vardı, 2 kedi daha geldi. Toplam kaç kedi oldu?", ["3", "4", "5", "6"], 2, "3 + 2 = 5."],

  // Çıkarma İşlemi
  ["Tabağımda 3 kurabiye vardı, 1 tanesini yedim. Kaç kaldı?", ["1", "2", "3", "4"], 1, "3 - 1 = 2 kaldı."],
  ["5'ten 2 çıkarsa kaç kalır?", ["2", "3", "4", "5"], 1, "5, 4, 3. Sonuç 3."],
  ["10 - 5 işleminin sonucu kaçtır?", ["2", "4", "5", "6"], 2, "10'un yarısı 5'tir."],
  ["9 yumurtanın 3 tanesi kırıldı. Kaç yumurta kaldı?", ["5", "6", "7", "12"], 1, "9 - 3 = 6."],
  ["Elimde 8 balon vardı, 2 tanesi patladı. Kaç balon kaldı?", ["5", "6", "7", "10"], 1, "8 - 2 = 6."],
  ["15 sayfalık kitabın 5 sayfasını okudum. Kaç sayfa kaldı?", ["5", "10", "15", "20"], 1, "15 - 5 = 10."],
  ["20 - 10 işleminin sonucu kaçtır?", ["0", "5", "10", "30"], 2, "20'den 10 çıkarsa 10 kalır."],
  ["Hangi işlemde sonuç sıfır (0) olur?", ["5 - 5", "5 - 0", "5 + 0", "5 + 5"], 0, "Bir sayıdan kendisi çıkarsa 0 kalır."],
  
  // Geometri ve Şekiller
  ["Hangi şekil bir topa benzer?", ["Kare", "Üçgen", "Daire (Çember)", "Dikdörtgen"], 2, "Top yuvarlaktır, daireye benzer."],
  ["Üçgenin kaç kenarı vardır?", ["2", "3", "4", "5"], 1, "Üçgenin 3 kenarı vardır."],
  ["Karenin kaç kenarı vardır?", ["3", "4", "5", "6"], 1, "Karenin 4 eşit kenarı vardır."],
  ["Hangi şeklin köşesi yoktur?", ["Kare", "Üçgen", "Daire", "Dikdörtgen"], 2, "Dairenin köşesi yoktur."],
  ["Küp şekeri neye benzer?", ["Küp", "Küre", "Silindir", "Koni"], 0, "Küp şeker küp şeklindedir."],
  ["Sınıf tahtası hangi şekle benzer?", ["Üçgen", "Kare", "Dikdörtgen", "Daire"], 2, "Genellikle dikdörtgen şeklindedir."],
  ["Dondurma külahı hangi şekle benzer?", ["Küre", "Koni", "Küp", "Prizma"], 1, "Koniye benzer."],

  // Ölçme, Zaman ve Paralar
  ["Yarım elma + Yarım elma ne eder?", ["2 Elma", "1 Bütün Elma", "3 Elma", "Hiç"], 1, "İki yarım bir bütün eder."],
  ["Bir bütün ekmekte kaç yarım ekmek vardır?", ["1", "2", "3", "4"], 1, "Bir bütünde 2 yarım vardır."],
  ["Saat tam 12'de akrep nerededir?", ["6'da", "12'de", "3'te", "9'da"], 1, "Tam saat 12'de akrep 12'yi gösterir."],
  ["Yelkovan 12'de, akrep 3'te ise saat kaçtır?", ["12:00", "03:00", "06:00", "09:00"], 1, "Saat tam 3'tür."],
  ["Aşağıdakilerden hangisi daha ağırdır?", ["Tüy", "Silgi", "Masa", "Kalem"], 2, "Masa en ağırıdır."],
  ["Aşağıdakilerden hangisi daha hafiftir?", ["Fil", "Kuş", "At", "Aslan"], 1, "Kuş diğerlerinden daha hafiftir."],
  ["Hangi para daha büyüktür?", ["1 Lira", "50 Kuruş", "25 Kuruş", "10 Kuruş"], 0, "1 Lira en büyüktür."],
  ["2 tane 50 kuruş ne eder?", ["1 Lira", "2 Lira", "5 Lira", "10 Lira"], 0, "50+50=100 kuruş yani 1 Lira eder."],
  ["Bir haftada kaç gün vardır?", ["5", "6", "7", "8"], 2, "Pazartesi'den Pazar'a 7 gün vardır."],
  ["Okullar haftanın kaç günü açıktır?", ["2", "3", "5", "7"], 2, "Pazartesi, Salı, Çarşamba, Perşembe, Cuma (5 gün)."],
  ["Bugün Pazartesi ise yarın hangi gündür?", ["Pazar", "Salı", "Çarşamba", "Cuma"], 1, "Pazartesi'den sonra Salı gelir."],
  ["Hangi mevsimde kar yağar?", ["Yaz", "Kış", "İlkbahar", "Sonbahar"], 1, "Kış mevsiminde kar yağar."],
  ["Yazın havalar nasıl olur?", ["Soğuk", "Karlı", "Sıcak", "Yağmurlu"], 2, "Yazın havalar sıcak olur."],
  ["Bir yılda kaç mevsim vardır?", ["2", "4", "6", "12"], 1, "Sonbahar, Kış, İlkbahar, Yaz (4 mevsim)."]
];

// =================================================================================================
// 1. SINIF TÜRKÇE SORULARI (Harf, Hece, Kelime, Cümle)
// =================================================================================================
const G1_TURKISH: CompactQuestion[] = [
  // Harf ve Hece Bilgisi
  ["Alfabemizin ilk harfi nedir?", ["B", "Z", "A", "C"], 2, "A harfidir."],
  ["Alfabemizin son harfi nedir?", ["A", "Z", "Y", "V"], 1, "Z harfidir."],
  ["Aşağıdakilerden hangisi ünlü (sesli) harftir?", ["B", "K", "E", "Z"], 2, "E bir ünlü harftir."],
  ["Aşağıdakilerden hangisi ünsüz (sessiz) harftir?", ["A", "İ", "O", "M"], 3, "M bir ünsüz harftir."],
  ["'Türkiye' kelimesinin baş harfi nedir?", ["t", "T", "ü", "y"], 1, "Büyük T ile başlar."],
  ["Hangi kelime 'K' harfi ile başlar?", ["Elma", "Armut", "Kedi", "Balık"], 2, "Kedi."],
  ["Hangi kelime 'A' harfi ile biter?", ["Okul", "Kalem", "Masa", "Defter"], 2, "Mas-a."],
  ["Hangi kelimenin içinde 'o' harfi vardır?", ["Kedi", "Köpek", "Top", "Kuş"], 2, "T-o-p."],
  
  // 2. KONU: HECE BİLGİSİ
  ["'Anne' kelimesi kaç hecelidir?", ["1", "2", "3", "4"], 1, "An-ne (2 hece)."],
  ["'Kitap' kelimesi kaç hecelidir?", ["1", "2", "3", "4"], 1, "Ki-tap (2 hece)."],
  ["'Okul' kelimesini hecelerine nasıl ayırırız?", ["O-kul", "Ok-ul", "Oku-l", "O-k-ul"], 0, "O-kul şeklinde ayrılır."],
  ["'Araba' kelimesi kaç hecelidir?", ["2", "3", "4", "5"], 1, "A-ra-ba (3 hece)."],
  ["'Bilgisayar' kelimesi kaç hecelidir?", ["3", "4", "5", "6"], 1, "Bil-gi-sa-yar (4 hece)."],
  ["Hangisi tek heceli bir kelimedir?", ["Masa", "Kalem", "Top", "Oyun"], 2, "Top tek hecelidir."],
  ["Hangisi üç heceli bir kelimedir?", ["Ev", "Sıra", "Öğrenci", "Ders"], 2, "Öğ-ren-ci (3 hece)."],
  ["Satır sonuna sığmayan kelimeleri ayırmak için ne kullanırız?", ["Nokta", "Virgül", "Kısa Çizgi", "Soru İşareti"], 2, "Kısa çizgi (-) kullanırız."],
  ["'Portakal' kelimesi satır sonunda nasıl ayrılır?", ["Po-rtakal", "Por-takal", "Porta-kal", "Portak-al"], 1, "Por-takal veya Porta-kal."],

  // Yazım Kuralları ve Noktalama
  ["Cümlenin sonuna hangi işaret konur?", ["Virgül", "Nokta", "Çizgi", "Kare"], 1, "Cümle bitince nokta konur."],
  ["Soru soran cümlenin sonuna ne konur?", ["Nokta", "Ünlem", "Soru İşareti", "Virgül"], 2, "Soru işareti (?) konur."],
  ["Şaşırma veya korkma anlatan cümlenin sonuna ne konur?", ["Nokta", "Ünlem", "Soru İşareti", "Virgül"], 1, "Ünlem (!) konur."],
  ["Özel isimlerin (insan isimleri) ilk harfi nasıl yazılır?", ["Küçük", "Büyük", "Eğik", "Altı çizili"], 1, "Daima büyük harfle başlar."],
  ["'ali okula gitti.' cümlesindeki yanlış nedir?", ["Nokta yok", "Ali büyük harfle başlamalı", "Okul yanlış yazılmış", "Gitti yanlış"], 1, "Ali özel isimdir ve cümle başıdır, büyük olmalı."],
  ["Aşağıdaki kelimelerden hangisi büyük harfle başlar?", ["elma", "masa", "ahmet", "kalem"], 2, "Ahmet bir insan ismidir."],
  ["Şehir isimleri nasıl başlar?", ["Küçük harfle", "Büyük harfle", "Rakamla", "Şekille"], 1, "Büyük harfle başlar (İzmir, Ankara)."],
  
  // Kelime Bilgisi ve Anlam
  ["'Siyah' kelimesinin zıt anlamlısı nedir?", ["Mavi", "Yeşil", "Beyaz", "Sarı"], 2, "Siyah - Beyaz."],
  ["'Büyük' kelimesinin zıt anlamlısı nedir?", ["Uzun", "Küçük", "Geniş", "Ağır"], 1, "Büyük - Küçük."],
  ["'Uzun' kelimesinin zıt anlamlısı nedir?", ["Kısa", "İnce", "Kalın", "Dar"], 0, "Uzun - Kısa."],
  ["'Sıcak' kelimesinin zıt anlamlısı nedir?", ["Ilık", "Soğuk", "Kaynar", "Serin"], 1, "Sıcak - Soğuk."],
  ["'Gel' kelimesinin zıt anlamlısı nedir?", ["Koş", "Git", "Dur", "Bak"], 1, "Gel - Git."],
  ["'İhtiyar' kelimesinin eş anlamlısı nedir?", ["Genç", "Çocuk", "Yaşlı", "Bebek"], 2, "İhtiyar = Yaşlı."],
  ["'Al' kelimesinin eş anlamlısı nedir?", ["Ver", "Kırmızı", "Beyaz", "Mor"], 1, "Al bayrak = Kırmızı bayrak."],
  ["'Talebe' ne demektir?", ["Öğretmen", "Müdür", "Öğrenci", "Veli"], 2, "Talebe = Öğrenci."],
  ["'Hediye' kelimesinin eş anlamlısı nedir?", ["Armağan", "Para", "Kutu", "Oyuncak"], 0, "Hediye = Armağan."],
  
  // Cümle Bilgisi
  ["'Ali topu at.' cümlesi kaç kelimeden oluşur?", ["2", "3", "4", "1"], 1, "Ali - topu - at (3 kelime)."],
  ["'Annemi çok seviyorum.' cümlesi kaç kelimedir?", ["2", "3", "4", "5"], 1, "Annemi - çok - seviyorum (3 kelime)."],
  ["Hangi cümle kurallıdır?", ["Gitti eve Ali", "Ali eve gitti", "Eve Ali gitti", "Gitti Ali eve"], 1, "Ali eve gitti."],
  ["Kelimelerden anlamlı bir cümle yap: 'süt - içtim - sabah'", ["Sabah içtim süt", "Süt sabah içtim", "Sabah süt içtim", "İçtim sabah süt"], 2, "Sabah süt içtim."],
  ["'Lale' kelimesi hem bir çiçek hem de bir ... ismidir?", ["Şehir", "İnsan", "Meyve", "Sebze"], 1, "Lale bir insan ismidir."],
  ["Hangi hayvanın adı 'M' harfi ile başlar?", ["Kedi", "Köpek", "Maymun", "Fil"], 2, "Maymun."],
  ["'Limon' tadı nasıldır?", ["Tatlı", "Acı", "Ekşi", "Tuzlu"], 2, "Limon ekşidir."],
  ["Kitap okuyan kişiye ne denir?", ["Yazar", "Okur", "Çizer", "Satıcı"], 1, "Okur."],
  ["Hangi kelime çoğuldur (birden çok)?", ["Kalem", "Silgi", "Kitaplar", "Defter"], 2, "-lar eki almış Kitaplar çoğuldur."],
  ["Hangi kelime tekildir (bir tane)?", ["Kuşlar", "Ağaçlar", "Çiçek", "Evler"], 2, "Çiçek tekildir."]
];

// =================================================================================================
// 1. SINIF HAYAT BİLGİSİ SORULARI (Okul, Aile, Sağlık, Güvenlik)
// =================================================================================================
const G1_LIFE: CompactQuestion[] = [
  // Okul Heyecanım
  ["Sınıfımıza girerken ne deriz?", ["Güle güle", "Günaydın / Merhaba", "Afiyet olsun", "İyi geceler"], 1, "Günaydın veya Merhaba deriz."],
  ["Okula giderken neyimizi unutmamalıyız?", ["Oyuncaklarımızı", "Çantamızı", "Televizyonu", "Yastığımızı"], 1, "Okul çantamızı almalıyız."],
  ["Teneffüste ne yaparız?", ["Uyuruz", "Ders çalışırız", "Oyun oynar ve dinleniriz", "Eve gideriz"], 2, "Teneffüs dinlenme vaktidir."],
  ["İstiklal Marşı okunurken ne yapmalıyız?", ["Konuşmalıyız", "Oturmalıyız", "Hazırolda saygıyla durmalıyız", "Yürümeliyiz"], 2, "Saygıyla dinlemeliyiz."],
  ["Sınıfta söz almak için ne yapmalıyız?", ["Bağırmalıyız", "Ayağa kalkmalıyız", "Parmak kaldırmalıyız", "Arkadaşımıza vurmalıyız"], 2, "Parmak kaldırarak izin isteriz."],
  ["Çöpleri nereye atmalıyız?", ["Yere", "Sıranın altına", "Çöp kutusuna", "Bahçeye"], 2, "Çöpler çöp kutusuna atılır."],
  ["Okul eşyalarımızı nasıl kullanmalıyız?", ["Kırmalıyız", "Özenli ve dikkatli", "Eve götürmeliyiz", "Boyamalıyız"], 1, "Özenli kullanmalıyız."],
  ["Sınıf kurallarını kim belirler?", ["Sadece öğretmen", "Sadece öğrenciler", "Öğretmen ve öğrenciler birlikte", "Müdür"], 2, "Birlikte belirlenir."],
  ["Şeref Köşesi'nde hangisi bulunmaz?", ["Atatürk resmi", "İstiklal Marşı", "Gençliğe Hitabe", "Yemek listesi"], 3, "Yemek listesi bulunmaz."],
  ["Okuldaki tuvaletleri nasıl bırakmalıyız?", ["Kirli", "Temiz", "Su açık", "Işık açık"], 1, "Bulduğumuz gibi temiz bırakmalıyız."],
  
  // 2. KONU: EVİMİZDE HAYAT (Ailem ve Evim)
  ["Anne ve babamızın anne-babasına ne deriz?", ["Kardeş", "Dede ve Nine", "Amca", "Teyze"], 1, "Dede ve Nine (Büyükanne)."],
  ["Babamızın kız kardeşine ne deriz?", ["Teyze", "Hala", "Yenge", "Abla"], 1, "Hala."],
  ["Annemizin erkek kardeşine ne deriz?", ["Amca", "Dayı", "Enişte", "Dede"], 1, "Dayı."],
  ["Ev adresimizde hangisi bulunmaz?", ["Mahalle adı", "Sokak adı", "Kapı numarası", "Okul müdürünün adı"], 3, "Müdürün adı ev adresinde olmaz."],
  ["Evde elektrik ve suyu nasıl kullanmalıyız?", ["İstediğimiz gibi", "Tasarruflu", "Hepsini açarak", "Boşa akıtarak"], 1, "Tasarruflu kullanmalıyız."],
  ["Evdeki işlerde ne yapmalıyız?", ["Sadece izlemeliyiz", "Yardım etmeliyiz", "Dağıtmalıyız", "Uyumalıyız"], 1, "Ailemize yardım etmeliyiz."],
  ["Ev adresimizi kiminle paylaşmamalıyız?", ["Polis", "Öğretmen", "Tanımadığımız kişiler", "Doktor"], 2, "Yabancılarla paylaşmamalıyız."],
  ["Sabah uyanınca yatağımızı kim toplamalı?", ["Annemiz", "Babamız", "Kendimiz", "Hiç kimse"], 2, "Kendi sorumluluğumuzdur."],
  ["Aile bireylerine nasıl davranmalıyız?", ["Kaba", "Saygılı ve yardımsever", "Küs", "Kızgın"], 1, "Saygılı ve yardımsever olmalıyız."],
  ["Eve gelen misafire ne deriz?", ["Güle güle", "Hoş geldiniz", "Neden geldin", "Sus"], 1, "Hoş geldiniz deriz."],
  
  // Sağlıklı Hayat
  ["Yemekten önce ne yapmalıyız?", ["Uyumalıyız", "Ellerimizi yıkamalıyız", "Koşmalıyız", "Ders çalışmalıyız"], 1, "Ellerimizi sabunla yıkamalıyız."],
  ["Dişlerimizi ne zaman fırçalamalıyız?", ["Sadece sabah", "Yemeklerden sonra", "Hiç", "Okulda"], 1, "Yemeklerden sonra ve yatmadan önce."],
  ["Sağlıklı olmak için hangisini yemeliyiz?", ["Cips", "Kola", "Meyve ve Sebze", "Şeker"], 2, "Meyve ve sebze sağlıklıdır."],
  ["Hangisi kişisel bakım eşyamızdır?", ["Diş fırçası", "Tencere", "Televizyon", "Sandalye"], 0, "Diş fırçası kişiye özeldir."],
  ["Hastalanınca kime gideriz?", ["Öğretmene", "Polise", "Doktora", "İtfaiyeye"], 2, "Doktora gideriz."],
  ["Tırnaklarımızı ne zaman kesmeliyiz?", ["Uzayınca", "Hiçbir zaman", "Okulda", "Yemek yerken"], 0, "Uzayınca kesmeliyiz."],
  ["Kahvaltıda hangisini yeriz?", ["Peynir", "Dondurma", "Cips", "Kola"], 0, "Peynir, zeytin, yumurta."],
  ["Spor yapmak bizi nasıl etkiler?", ["Hasta eder", "Yorar", "Sağlıklı ve güçlü yapar", "Üzer"], 2, "Sağlıklı ve güçlü yapar."],
  
  // Güvenli Hayat
  ["Karşıdan karşıya geçerken nerden geçmeliyiz?", ["Her yerden", "Yaya geçidinden", "Arabaların arasından", "Koşarak"], 1, "Yaya geçidi veya üst geçitten."],
  ["Trafik lambasında 'Kırmızı' yanınca ne yaparız?", ["Geçeriz", "Dururuz", "Koşarız", "Otururuz"], 1, "Kırmızıda durulur."],
  ["Trafik lambasında 'Yeşil' yanınca ne yaparız?", ["Dururuz", "Bekleriz", "Geçeriz", "Uyuruz"], 2, "Yeşilde geçilir."],
  ["Tanımadığımız kişilerle konuşmalı mıyız?", ["Evet", "Hayır", "Bazen", "Belki"], 1, "Tanımadığımız kişilerle konuşmamalıyız."],
  ["Acil durumda, yangın çıkarsa kimi ararız?", ["112 (İtfaiye)", "Arkadaşımızı", "Marketi", "Hiç kimseyi"], 0, "112 Acil Çağrı Merkezi'ni ararız."],
  ["Islak elle prize dokunmak tehlikeli midir?", ["Hayır", "Evet", "Biraz", "Farketmez"], 1, "Evet, elektrik çarpabilir."],
  ["Pencereden sarkmak doğru mudur?", ["Evet", "Hayır", "Eğlencelidir", "Güzeldir"], 1, "Hayır, düşebiliriz."],
  ["Bıçak ve makasla oynamak nasıldır?", ["Güvenli", "Tehlikeli", "Komik", "Güzel"], 1, "Kesici aletler tehlikelidir."],
  
  // Ülkemizde ve Doğada Hayat
  ["Bayrağımız hangi renklerdir?", ["Mavi-Beyaz", "Sarı-Kırmızı", "Kırmızı-Beyaz", "Yeşil-Beyaz"], 2, "Kırmızı ve Beyazdır."],
  ["Başkentimiz neresidir?", ["İstanbul", "İzmir", "Ankara", "Bursa"], 2, "Ankara."],
  ["Atatürk nerede doğdu?", ["Ankara", "Selanik", "İstanbul", "İzmir"], 1, "Selanik."],
  ["23 Nisan'da neyi kutlarız?", ["Cumhuriyet'i", "Çocuk Bayramı'nı", "Zafer'i", "Gençlik Bayramı'nı"], 1, "Ulusal Egemenlik ve Çocuk Bayramı."],
  ["Hangi hayvan evcil değildir (evde beslenmez)?", ["Kedi", "Köpek", "Aslan", "Kuş"], 2, "Aslan vahşi bir hayvandır."],
  ["Bitkilerin büyümek için neye ihtiyacı vardır?", ["Kola", "Su ve Güneş", "Çikolata", "Oyun"], 1, "Su ve Güneş."],
  ["Çevremizi nasıl tutmalıyız?", ["Kirli", "Çöplü", "Temiz", "Dağınık"], 2, "Temiz tutmalıyız."],
  ["Geri dönüşüm kutusuna ne atılır?", ["Yemek artığı", "Kağıt ve Plastik", "Meyve kabuğu", "Çamur"], 1, "Kağıt, plastik, cam, metal."]
];

// =================================================================================================
// 1. SINIF İNGİLİZCE SORULARI (Numbers, Colors, Family, Body, School)
// =================================================================================================
const G1_ENGLISH: CompactQuestion[] = [
  // 2. KONU: NUMBERS (Sayılar)
  ["'One' hangi sayıdır?", ["1", "2", "3", "4"], 0, "One = 1."],
  ["'Two' hangi sayıdır?", ["1", "2", "3", "5"], 1, "Two = 2."],
  ["'Three' hangi sayıdır?", ["2", "3", "4", "5"], 1, "Three = 3."],
  ["'Four' hangi sayıdır?", ["3", "4", "5", "6"], 1, "Four = 4."],
  ["'Five' hangi sayıdır?", ["4", "5", "6", "7"], 1, "Five = 5."],
  ["'Six' hangi sayıdır?", ["5", "6", "7", "8"], 1, "Six = 6."],
  ["'Seven' hangi sayıdır?", ["6", "7", "8", "9"], 1, "Seven = 7."],
  ["'Eight' hangi sayıdır?", ["7", "8", "9", "10"], 1, "Eight = 8."],
  ["'Nine' hangi sayıdır?", ["8", "9", "10", "1"], 1, "Nine = 9."],
  ["'Ten' hangi sayıdır?", ["1", "5", "8", "10"], 3, "Ten = 10."],
  ["'One' + 'One' kaç eder?", ["Two", "Three", "Four", "Five"], 0, "1 + 1 = 2 (Two)."],
  ["'Three' + 'Two' kaç eder?", ["Four", "Five", "Six", "Seven"], 1, "3 + 2 = 5 (Five)."],
  ["Hangi sayı 'Six' tir?", ["6", "7", "8", "9"], 0, "Six = 6."],
  
  // Colors (Renkler)
  ["'Red' hangi renktir?", ["Mavi", "Sarı", "Kırmızı", "Yeşil"], 2, "Red = Kırmızı."],
  ["'Blue' hangi renktir?", ["Mavi", "Yeşil", "Sarı", "Siyah"], 0, "Blue = Mavi."],
  ["'Yellow' hangi renktir?", ["Sarı", "Kırmızı", "Beyaz", "Mor"], 0, "Yellow = Sarı."],
  ["'Green' hangi renktir?", ["Mavi", "Yeşil", "Turuncu", "Pembe"], 1, "Green = Yeşil."],
  ["'Pink' hangi renktir?", ["Mor", "Pembe", "Siyah", "Beyaz"], 1, "Pink = Pembe."],
  ["'Black' hangi renktir?", ["Beyaz", "Gri", "Siyah", "Kahverengi"], 2, "Black = Siyah."],
  ["'White' hangi renktir?", ["Beyaz", "Sarı", "Mavi", "Kırmızı"], 0, "White = Beyaz."],
  ["'Orange' hangi renktir?", ["Turuncu", "Mor", "Yeşil", "Gri"], 0, "Orange = Turuncu."],
  
  // School Objects (Okul Eşyaları)
  ["'Book' ne demektir?", ["Kalem", "Silgi", "Çanta", "Kitap"], 3, "Book = Kitap."],
  ["'Pencil' ne demektir?", ["Kalem", "Kitap", "Masa", "Sıra"], 0, "Pencil = Kalem."],
  ["'Eraser' ne demektir?", ["Silgi", "Cetvel", "Kalem", "Çanta"], 0, "Eraser = Silgi."],
  ["'School' ne demektir?", ["Ev", "Okul", "Park", "Bahçe"], 1, "School = Okul."],
  ["'Teacher' ne demektir?", ["Öğrenci", "Öğretmen", "Doktor", "Polis"], 1, "Teacher = Öğretmen."],
  ["'Student' ne demektir?", ["Öğretmen", "Öğrenci", "Müdür", "Baba"], 1, "Student = Öğrenci."],
  ["'Bag' ne demektir?", ["Çanta", "Kitap", "Kalem", "Silgi"], 0, "Bag = Çanta."],
  ["'Desk' ne demektir?", ["Sıra", "Kapı", "Pencere", "Duvar"], 0, "Desk = Sıra/Masa."],
  
  // Greetings & Basics (Selamlaşma)
  ["'Hello' ne demektir?", ["Güle güle", "Merhaba", "Teşekkürler", "Evet"], 1, "Hello = Merhaba."],
  ["'Good morning' ne demektir?", ["İyi geceler", "Günaydın", "İyi akşamlar", "Merhaba"], 1, "Günaydın."],
  ["'Goodbye' ne demektir?", ["Merhaba", "Güle güle", "Nasılsın", "Teşekkürler"], 1, "Güle güle."],
  ["'What is your name?' ne sorar?", ["Nasılsın?", "Adın ne?", "Kaç yaşındasın?", "Nerelisin?"], 1, "Adın ne?"],
  ["'Yes' ne demektir?", ["Hayır", "Evet", "Belki", "Lütfen"], 1, "Yes = Evet."],
  ["'No' ne demektir?", ["Evet", "Hayır", "Tamam", "Lütfen"], 1, "No = Hayır."],
  
  // Family & Animals (Aile ve Hayvanlar)
  ["'Mother' kimdir?", ["Baba", "Anne", "Kardeş", "Dede"], 1, "Mother = Anne."],
  ["'Father' kimdir?", ["Anne", "Baba", "Abla", "Nine"], 1, "Father = Baba."],
  ["'Sister' kimdir?", ["Erkek kardeş", "Kız kardeş", "Bebek", "Anne"], 1, "Sister = Kız kardeş."],
  ["'Brother' kimdir?", ["Erkek kardeş", "Kız kardeş", "Baba", "Dede"], 0, "Brother = Erkek kardeş."],
  ["'Cat' hangi hayvandır?", ["Köpek", "Kedi", "Kuş", "Balık"], 1, "Cat = Kedi."],
  ["'Dog' hangi hayvandır?", ["Kedi", "Köpek", "At", "İnek"], 1, "Dog = Köpek."],
  ["'Fish' hangi hayvandır?", ["Kuş", "Balık", "Maymun", "Yılan"], 1, "Fish = Balık."],
  ["'Bird' hangi hayvandır?", ["Kuş", "Kedi", "Aslan", "Fil"], 0, "Bird = Kuş."]
];

export const GRADE_1_POOL = {
  [Subject.MATH]: createQuestions(Subject.MATH, G1_MATH),
  [Subject.TURKISH]: createQuestions(Subject.TURKISH, G1_TURKISH),
  [Subject.LIFE]: createQuestions(Subject.LIFE, G1_LIFE),
  [Subject.ENGLISH]: createQuestions(Subject.ENGLISH, G1_ENGLISH),
};
