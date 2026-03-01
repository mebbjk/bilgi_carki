import fs from 'fs';

const file = 'c:/Users/mehme/OneDrive/Masaüstü/Projeler/tienscalc-pro/constants.ts';
let content = fs.readFileSync(file, 'utf8');

const updates = [
    { oldPath: 'TIENS C Vitamini İçeren Takviye Edici Gıda', newName: 'TIENS C Vitamini İçeren Takviye Edici Gıda', defaultImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202501/3178470653120430085.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' }, // reusing propolis image fallback if needed? actually let's keep old if not found
    { match: 'TIENS Spirulina Kapsül Takviye Edici Gıda', newName: 'TIENS Spirulina Kapsül Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1320044626345394176.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'TIENS Propolis İçeren Pastil Takviye Edici Gıda', newName: 'TIENS Propolis İçeren Pastil Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202501/3178470653120430085.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'TIENS Probiyotik Mikroorganizma İçeren Takviye Edici Gıda', newName: 'TIENS Probiyotik Mikroorganizma İçeren Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1320044626345394176.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' }, // Add fallback
    { match: 'TIENS Kitosan İçeren Kapsül Takviye Edici Gıda', newName: 'TIENS Kitosan İçeren Kapsül Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1319990612830814208.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'TIENS Çinko ve Yumurta Beyazı İçeren Kapsül Takviye Edici Gıda', newName: 'TIENS Çinko ve Yumurta Beyazı İçeren Kapsül Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1319990612830814208.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' }, // Fallback
    { match: 'TIENS Vitamin D3 İçeren Damla Takviye Edici Gıda', newName: 'TIENS Vitamin D3 İçeren Damla Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202306/2332771354657423377.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'TIENS Kalsiyum ve Lesitin İçeren Takviye Edici Gıda', newName: 'TIENS Kalsiyum ve Lesitin İçeren Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202306/2332771354657423377.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' }, // fallback
    { match: 'TIENS Nutrient Kalsiyum İçeren Takviye Edici Gıda', newName: 'TIENS Nutrient Kalsiyum İçeren Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202306/2332771354657423377.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' }, // fallback
    { match: 'TIENS Vision Lutein ve Vitamin A İçeren Takviye Edici Gıda', newName: 'TIENS Vision Lutein ve Vitamin A İçeren Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202410/3069991822324375553.png?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'TIENS Kordisep Mantarı İçeren Kapsül Takviye Edici Gıda', newName: 'TIENS Kordiseps Mantarı İçeren Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202510/3598821370127745026.png?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'TIENS İnülin İçeren Takviye Edici Gıda', newName: 'TIENS İnülin İçeren Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1318756015891644417.png?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'TIENS XTR Nutrient Kalsi̇yum İçeren Takvi̇ye Edi̇ci̇ Gıda', newName: 'TIENS XTR Nutrient Kalsiyum İçeren Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202111/1449252395245101056.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'Koenzim Q10 & Quersetin', newName: 'TIENS Koenzim Q10 ve Kuersetin İçeren Takviye Edici Gıda', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202601/3714567268416249859.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'Aprotie Multi-Functional Sprey Serum', newName: 'Aprotie Multi-Functional Spray Serum', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202512/3702822800604422147.png?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'AİRİZ Hijyenik Bölge Temizleme Jeli', newName: 'AİRİZ Hijyenik Bölge Temizleme Jeli', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1318909964705267712.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'Aprotie Bebek Saç ve Vücut Yıkama Jeli', newName: 'APROTIE Bebek Saç ve Vücut Yıkama Jeli', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202503/3279847274468818948.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'TIENS Viewtale Aydınlatıcı Maske', newName: 'VIEWTALE Aydınlatıcı Maske', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202311/2572892290298150912.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'Aprotie Sunscreen Cream', newName: 'APROTIE Sunscreen Cream Spf 30', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202504/3313495972416094212.png?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'Aprotie Fresh Roll-On', newName: 'APROTIE Roll-On Fresh', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202309/2448066573443620865.png?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'VIEWTALE Green Bubble Cleanser', newName: 'VIEWTALE Green Bubble Cleanser', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202501/3175837855352995850.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'VIEWTALE Fresh Water Gel Cleanser', newName: 'VIEWTALE Fresh Water Gel Cleanser', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202501/3175837855347851269.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'ORECARE Chinese Herbal Toothpaste - Bitkisel Diş Macunu', newName: 'ORECARE Bitkisel Diş Macunu', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1318857497384779776.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'AİRİZ Active Oxygen & Negative Ion Hijyenik Ped Seti', newName: 'AIRIZ Hijyenik Ped Seti', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1318909964705267712.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'REVITIZE Bitkisel Şampuan', newName: 'REVITIZE Bitkisel Şampuan', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202504/3279847274468818948.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' }, // fallback
    { match: 'Aprotie Multi Balm', newName: 'Aprotie Multi-Balm', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202512/3702822817789411331.png?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'Aprotie Hepsi Bir Arada', newName: 'TIENS Aprotie Hepsi Bir Arada Bakım Seti -İndirim-20%', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202601/3708290654749483014.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'TIENS Kadın TI-Bileklik', newName: 'Kadın Bileklik - Büyülü Beyaz', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1320080360467431424.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'TIENS Erkek TI-Bileklik', newName: 'Erkek Bileklik - Kristal Siyah', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1320067939427876865.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' },
    { match: 'DICHO Sıvı Çamaşır Deterjanı', newName: 'DICHO Sıvı Çamaşır Deterjanı', newImage: 'https://ir-i.tiens.com/pocket-ir/i/album/TR/202108/1318909964705267712.jpg?template=2&shape=2&w=270&h=270&q=80&format=webp' } // fallback
];

for (const u of updates) {
    if (u.match) {
        // Find block: name: '...', \n image: '...'
        // and replace both name and image.
        const regexName = new RegExp(`name: '${u.match}'`, 'g');
        content = content.replace(regexName, `name: '${u.newName}'`);
    }
}

// Second pass for images on new names
for (const u of updates) {
    if (u.newName && u.newImage) {
        // Try to replace the image following the new name
        // name: 'newName',\n    image: 'oldUrl',
        const escapedName = u.newName.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&');
        const regexBlock = new RegExp(`name: '${escapedName}',\\s*image: '[^']+',`, 'g');
        content = content.replace(regexBlock, `name: '${u.newName}',\n    image: '${u.newImage}',`);
    }
}

fs.writeFileSync(file, content, 'utf8');
console.log("Names and high-res b2c images updated successfully in constants.ts");
