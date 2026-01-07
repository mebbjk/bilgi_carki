import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM ortamında __dirname tanımlaması
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      {
        name: 'github-pages-fix',
        closeBundle() {
          const dist = path.resolve(__dirname, 'dist');
          if (fs.existsSync(dist)) {
            // .nojekyll dosyası oluşturarak GitHub Pages'in _ ile başlayan dosyaları yoksaymasını engeller
            fs.writeFileSync(path.join(dist, '.nojekyll'), '');
            console.log('Created .nojekyll for GitHub Pages');

            // index.html'i 404.html olarak kopyalar (SPA yönlendirmesi için)
            fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));
            console.log('Created 404.html for GitHub Pages');
          }
        }
      }
    ],
    // PWA ve GitHub Pages için en güvenli yol: './' (Current Directory)
    // Bu, uygulamanın ana dizinde mi yoksa alt klasörde mi olduğuna bakmaksızın çalışmasını sağlar.
    base: './', 
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false
    }
  };
});