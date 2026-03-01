const fs = require('fs');

const data = JSON.parse(fs.readFileSync('ChatExport_2026-02-28/result.json', 'utf8'));

let results = [];
for (let msg of data.messages) {
    if (msg.type !== 'message') continue;
    let text = '';

    if (typeof msg.text === 'string') {
        text = msg.text;
    } else if (Array.isArray(msg.text)) {
        text = msg.text.map(t => typeof t === 'string' ? t : (t.text || '')).join('');
    }

    text = text.trim();
    if (text.length < 50) continue;

    let lower = text.toLowerCase();

    // Yalnızca anlamlı deneyim kelimeleri geçenleri topla
    if (lower.includes('problem') || lower.includes('şikayet') || lower.includes('sorun') || lower.includes('rahatsızlık') || lower.includes('ürün') || lower.includes('deneyim') || lower.includes('kulland')) {
        // Tüm metni blok olarak problemin içine atıyoruz ki yarım kalmasın
        results.push({
            id: msg.id.toString(),
            problem: text,
            product: 'Aşağıda ürünleri seçin'
        });
    }
}

let unique = [];
let seen = new Set();

for (let res of results) {
    let rawText = res.problem;
    // Çoğu uzun yazıyı birebir aynı kabul etmesin diye boşlukları silip ilk 100 char'lık bir imza çıkarıyoruz
    let key = rawText.substring(0, 100).toLowerCase().replace(/\s/g, '');

    if (!seen.has(key)) {
        seen.add(key);
        unique.push(res);
    }
}

fs.writeFileSync('data/telegram_experiences.json', JSON.stringify(unique, null, 2));
console.log('Saved fully intact raw experiences:', unique.length);
