const fs = require('fs');

const data = JSON.parse(fs.readFileSync('ChatExport_2026-02-28/result.json', 'utf8'));

let results = [];
let videoCount = 0;

for (let msg of data.messages) {
    if (msg.type !== 'message') continue;

    // Check if it has a video attachment
    let isVideo = (msg.media_type === 'video_file' || (msg.file && msg.file.endsWith('.mp4')));

    // Extract text
    let text = '';
    if (typeof msg.text === 'string') {
        text = msg.text;
    } else if (Array.isArray(msg.text)) {
        text = msg.text.map(t => typeof t === 'string' ? t : (t.text || '')).join('');
    }

    if (text.length < 20) continue;

    let problem = null;
    let product = null;

    let lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let l = lines[i].trim();
        let lower = l.toLowerCase();

        if (lower.includes('problem') || lower.includes('şikayet') || lower.includes('sorun') || lower.includes('rahatsızlık') || lower.includes('durum')) {
            let split = l.split(/[:\-]/);
            if (split.length > 1 && split.slice(1).join('-').trim().length > 3) {
                problem = split.slice(1).join('-').trim();
            } else if (i + 1 < lines.length && lines[i + 1].trim().length > 3) {
                problem = lines[i + 1].trim();
            }
        }

        if (lower.includes('ürün') || lower.includes('kullanılan')) {
            let split = l.split(/[:\-]/);
            if (split.length > 1 && split.slice(1).join('-').trim().length > 3) {
                product = split.slice(1).join('-').trim();
            } else if (i + 1 < lines.length && lines[i + 1].trim().length > 3) {
                product = lines[i + 1].trim();
            }
        }
    }

    if (!problem || !product) {
        // regex fallback
        let problemMatch = text.match(/(?:PROBLEMİ|Rahatsızlık|Sorun|Hastalık|Şikayet)[^\n:]*[:\-\s]+([^\n]*?)(?=\n|$)/i);
        let productMatch = text.match(/(?:ÜRÜNLER|Ürün|Kullandığınız|Kullanılan)[^\n:]*[:\-\s]+([^\n]+?)(?=\n|$)/i);

        if (problemMatch && (!problem || problem.length < 5)) problem = problemMatch[1].trim();
        if (productMatch && (!product || product.length < 5)) product = productMatch[1].trim();
    }

    if (problem && product && problem.length >= 3 && product.length >= 3) {
        if (problem.length > 200) problem = problem.substring(0, 200) + '...';
        if (product.length > 200) product = product.substring(0, 200) + '...';

        results.push({
            id: msg.id.toString(),
            problem: problem,
            product: product,
            isVideo: isVideo
        });
        if (isVideo) videoCount++;
    }
}

// remove duplicates based on problem+product string match
let unique = [];
let seen = new Set();
for (let res of results) {
    res.problem = res.problem.replace(/^[\-\.\,\:\;\s\*\#]+|[\-\.\,\:\;\s\*\#]+$/g, '');
    res.product = res.product.replace(/^[\-\.\,\:\;\s\*\#]+|[\-\.\,\:\;\s\*\#]+$/g, '');

    // skip garbage
    if (res.problem.length < 5 || res.product.length < 5) continue;
    let probLower = res.problem.toLowerCase();
    let prodLower = res.product.toLowerCase();
    if (probLower.includes('deneyim') && probLower.length < 15) continue;
    if (prodLower.includes('deneyim') && prodLower.length < 15) continue;
    if (probLower === 'imiz var. i̇yi ki tiens.' || prodLower === 'imiz var. i̇yi ki tiens.') continue;
    if (probLower.startsWith('i : ') || probLower === 'i') continue;
    if (probLower.includes('http') || prodLower.includes('http')) continue;

    let key = probLower + '|' + prodLower;
    if (!seen.has(key)) {
        seen.add(key);
        unique.push(res);
    }
}

fs.writeFileSync('data/telegram_experiences.json', JSON.stringify(unique, null, 2));
console.log(`Extracted: ${unique.length} (Videos: ${unique.filter(u => u.isVideo).length}). Saved to data/telegram_experiences.json`);
