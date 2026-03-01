import fs from 'fs';

const file = 'c:/Users/mehme/OneDrive/Masaüstü/Projeler/tienscalc-pro/constants.ts';
let content = fs.readFileSync(file, 'utf8');

const nameMap = {
    'C vitamini': 'TIENS C Vitamini İçeren Takviye Edici Gıda',
    'Spirulina': 'TIENS Spirulina Kapsül Takviye Edici Gıda',
    'Propolis Pastil': 'TIENS Propolis İçeren Pastil Takviye Edici Gıda',
    'Probiyotik': 'TIENS Probiyotik Mikroorganizma İçeren Takviye Edici Gıda',
    'Kitosan': 'TIENS Kitosan İçeren Kapsül Takviye Edici Gıda',
    'Çinko ve Yumurta Akı': 'TIENS Çinko ve Yumurta Beyazı İçeren Kapsül Takviye Edici Gıda',
    'D3 Vitamin Damla': 'TIENS Vitamin D3 İçeren Damla Takviye Edici Gıda',
    'Nutrient Ca & Lesetin': 'TIENS Kalsiyum ve Lesitin İçeren Takviye Edici Gıda',
    'Nutrient Ca': 'TIENS Nutrient Kalsiyum İçeren Takviye Edici Gıda',
    'Vision Lutein & Vitamin A': 'TIENS Vision Lutein ve Vitamin A İçeren Takviye Edici Gıda',
    'Kordiseps Mantarı': 'TIENS Kordisep Mantarı İçeren Kapsül Takviye Edici Gıda',
    'İnilin': 'TIENS İnülin İçeren Takviye Edici Gıda',
    'XTR Nutrient Ca': 'TIENS XTR Nutrient Kalsi̇yum İçeren Takvi̇ye Edi̇ci̇ Gıda',
    'Airiz Hijyenik Bölge Temizleme Jeli': 'AİRİZ Hijyenik Bölge Temizleme Jeli',
    'Arpotie Bebek Saç & Vücut Yıkama Jeli': 'Aprotie Bebek Saç ve Vücut Yıkama Jeli',
    'Viewtale Aydınlatıcı Maske': 'TIENS Viewtale Aydınlatıcı Maske',
    'Aprotie Sunscreen Krem': 'Aprotie Sunscreen Cream',
    'Aprotie Roll-on': 'Aprotie Fresh Roll-On',
    'Viewtale Green Bubble': 'VIEWTALE Green Bubble Cleanser',
    'Viewtale Fresh Water Jel': 'VIEWTALE Fresh Water Gel Cleanser',
    'Orecare Diş Macunu': 'ORECARE Chinese Herbal Toothpaste - Bitkisel Diş Macunu',
    'Airiz Hijyenik Ped': 'AİRİZ Active Oxygen & Negative Ion Hijyenik Ped Seti',
    'Revitize Şampuan': 'REVITIZE Bitkisel Şampuan',
    'Kadın Bileklik': 'TIENS Kadın TI-Bileklik',
    'Erkek Bileklik': 'TIENS Erkek TI-Bileklik',
    'Dicho Sıvı Çamaşır Deterjan': 'DICHO Sıvı Çamaşır Deterjanı'
};

for (const [oldName, newName] of Object.entries(nameMap)) {
    const regex = new RegExp(`name: '${oldName}',`, 'g');
    content = content.replace(regex, `name: '${newName}',`);
}

fs.writeFileSync(file, content, 'utf8');
console.log("Names updated successfully in constants.ts");
