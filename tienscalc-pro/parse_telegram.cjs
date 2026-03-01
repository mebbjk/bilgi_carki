const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'ChatExport_2026-02-28', 'result.json');
const outputPath = path.join(__dirname, 'parsed_texts.txt');

try {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const messages = data.messages;
  
  let outputText = '';
  let count = 0;
  
  for (const msg of messages) {
    if (msg.type === 'message' && msg.text) {
      let textContent = '';
      if (typeof msg.text === 'string') {
        textContent = msg.text;
      } else if (Array.isArray(msg.text)) {
        textContent = msg.text.map(t => typeof t === 'string' ? t : t.text).join('');
      }
      
      textContent = textContent.trim();
      
      // Basic filtering: useful messages are probably slightly longer and contain keywords
      // But for now let's just grab all substantial messages to see what we have
      if (textContent.length > 30) {
        outputText += `[MSG_ID: ${msg.id}] ${textContent.replace(/\n/g, ' ')}\n`;
        count++;
      }
    }
  }
  
  fs.writeFileSync(outputPath, outputText, 'utf8');
  console.log(`Successfully extracted ${count} messages to parsed_texts.txt`);
  
  const stats = fs.statSync(outputPath);
  console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);
  
} catch (err) {
  console.error("Error parsing JSON:", err);
}
