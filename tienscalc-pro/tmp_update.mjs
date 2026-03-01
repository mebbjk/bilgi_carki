import fs from 'fs';

const file = 'c:/Users/mehme/OneDrive/Masaüstü/Projeler/tienscalc-pro/constants.ts';
let content = fs.readFileSync(file, 'utf8');

const imageMap = {
    'C vitamini': 'https://tiens.com.tr/uploads/cache/2025/01/c-vitamini-photo-product.png',
    'Spirulina': 'https://tiens.com.tr/uploads/cache/2020/09/spirulina--2-product.jpg',
    'Propolis Pastil': 'https://tiens.com.tr/uploads/cache/2025/01/propolis-gorsel-product.jpg',
    'Probiyotik': 'https://tiens.com.tr/uploads/cache/2022/12/probiyotik-product.jpg',
    'Kitosan': 'https://tiens.com.tr/uploads/cache/2020/09/kitosan-product.jpg',
    'Çinko ve Yumurta Akı': 'https://tiens.com.tr/uploads/cache/2020/09/cinko--3-product.jpg',
    'D3 Vitamin Damla': 'https://tiens.com.tr/uploads/cache/2023/07/iens-d-vitamini-iceren-takviye-edici-gida-product.png',
    'Nutrient Ca & Lesetin': 'https://tiens.com.tr/uploads/cache/2022/12/tiens-nutrient-kalsiyum-ve-lesitin-product.jpg',
    'Nutrient Ca': 'https://tiens.com.tr/uploads/cache/2020/09/nutrient--1-product.jpg',
    'Vision Lutein & Vitamin A': 'https://tiens.com.tr/uploads/cache/2024/10/tiens-vision-lutein-ve-vitamin-a-iceren-takviye-edici-gida-gorseli-1-product.jpg',
    'Kordiseps Mantarı': 'https://tiens.com.tr/uploads/cache/2020/09/kordiseps--2-product.jpg',
    'İnilin': 'https://tiens.com.tr/uploads/cache/2021/05/inulin-product.jpg',
    'XTR Nutrient Ca': 'https://tiens.com.tr/uploads/cache/2021/05/xtr-nutrient-kalsiyum-product.jpeg',
    'Koenzim Q10 & Quersetin': '',
    'Aprotie Multi-Functional Sprey Serum': '',
    'Airiz Hijyenik Bölge Temizleme Jeli': 'https://tiens.com.tr/uploads/cache/2020/09/airiz-hijyenik-bolge-temizleme-jeli-product.jpg',
    'Arpotie Bebek Saç & Vücut Yıkama Jeli': 'https://tiens.com.tr/uploads/cache/2025/04/baby-product.png',
    'Viewtale Aydınlatıcı Maske': 'https://tiens.com.tr/uploads/cache/2025/04/maske-product.png',
    'Aprotie Sunscreen Krem': 'https://tiens.com.tr/uploads/cache/2025/04/sss-product.png',
    'Aprotie Roll-on': 'https://tiens.com.tr/uploads/cache/2023/07/roll-on-product.jpg',
    'Viewtale Green Bubble': 'https://tiens.com.tr/uploads/cache/2025/04/yeni--3-product.png',
    'Viewtale Fresh Water Jel': 'https://tiens.com.tr/uploads/cache/2025/04/yeni--4-product.png',
    'Orecare Diş Macunu': 'https://tiens.com.tr/uploads/cache/2025/01/orecare-photo-product.jpg',
    'Airiz Hijyenik Ped': 'https://tiens.com.tr/uploads/cache/2020/09/airiz-hijyenik-kadin-pedi-seti-product.jpg',
    'Revitize Şampuan': 'https://tiens.com.tr/uploads/cache/2025/04/sampuan-product.png',
    'Aprotie Multi Balm': '',
    'Aprotie Hepsi Bir Arada': '',
    'Kadın Bileklik': 'https://tiens.com.tr/uploads/cache/2018/11/enerjibileklikleri-product.png',
    'Erkek Bileklik': 'https://tiens.com.tr/uploads/cache/2018/11/enerjibileklikleri-product.png',
    'Dicho Sıvı Çamaşır Deterjan': 'https://tiens.com.tr/uploads/cache/2022/12/dicho-camasir-product.jpg'
};

for (const [name, url] of Object.entries(imageMap)) {
    if (url) {
        const regex = new RegExp(`name: '${name}',`, 'g');
        content = content.replace(regex, `name: '${name}',\n    image: '${url}',`);
    } else {
        const regex = new RegExp(`name: '${name}',`, 'g');
        content = content.replace(regex, `name: '${name}',\n    image: 'https://tiens.com.tr/uploads/cache/2024/02/tiens-saglikli-yasam-product.png',`); // default placeholder
    }
}

fs.writeFileSync(file, content, 'utf8');
console.log("Images injected into constants.ts");
