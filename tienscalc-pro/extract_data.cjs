const fs = require('fs');

const path = 'parsed_texts.txt';
const content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

const results = [];

for (let line of lines) {
    if (line.includes('[MSG_ID:')) {
        let msgIdMatch = line.match(/\[MSG_ID: (\d+)\]/);
        if (!msgIdMatch) continue;
        let msgId = msgIdMatch[1];

        const getBetweenTags = (str, startTags, endTags) => {
            let startIndex = -1;
            let matchedStartTag = "";
            for (let tag of startTags) {
                let idx = str.toLowerCase().indexOf(tag.toLowerCase());
                if (idx !== -1 && (startIndex === -1 || idx < startIndex)) {
                    startIndex = idx;
                    matchedStartTag = tag;
                }
            }

            if (startIndex === -1) return null;

            let contentStart = startIndex + matchedStartTag.length;
            let remainingStr = str.slice(contentStart);

            let endIndex = remainingStr.length;
            for (let eTag of endTags) {
                let idx = remainingStr.toLowerCase().indexOf(eTag.toLowerCase());
                if (idx !== -1 && idx < endIndex) {
                    endIndex = idx;
                }
            }

            return remainingStr.slice(0, endIndex).trim().replace(/^[—\-\:\.]+\s+/, '').replace(/[:\s\-]+$/, '');
        }

        let endTagsForProblem = ["Hangi ürünleri", "Nasıl kulland", "Kullanılan ürün", "Açıklama", "Ne kadar", "Bu problemi", "Kullanma", "İlk olarak", "Şehir", "Yaş", "Nasıl"];
        let endTagsForProduct = ["Nasıl kulland", "Açıklama", "Ne kadar", "Bu problemi", "Kullanma", "Ne gibi"];

        let problemTags = ["Sağlık Problemi", "Problem", "Rahatsızlık", "Sağlık sorunu", "Sorun", "Hastalık"];
        let productTags = ["Hangi ürünleri kullandınız", "Kullanılan ürünler", "Kullanılan Ürün", "Ürünler", "Ürün"];

        let problem = getBetweenTags(line, problemTags, endTagsForProblem);
        let product = getBetweenTags(line, productTags, endTagsForProduct);

        if (problem && product) {
            // extra basic cleanup
            problem = problem.replace(/^[:\s\-]+/, '').replace(/[:\s\-]+$/, '');
            product = product.replace(/^[:\s\-]+/, '').replace(/[:\s\-]+$/, '');

            if (problem && product && problem.length < 150 && product.length < 150) {
                results.push({ id: msgId, problem, product });
            }
        }
    }
}

fs.writeFileSync('src/data/telegram_experiences.json', JSON.stringify(results, null, 2));
console.log(`Extracted ${results.length} records and saved to src/data/telegram_experiences.json`);
