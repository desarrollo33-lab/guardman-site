/**
 * Script para convertir imágenes PNG/JPG a WebP
 * Requiere: npm install -D sharp
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = './public/images';
const files = fs.readdirSync(imagesDir).filter(f => 
  f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')
);

console.log(`Encontradas ${files.length} imágenes para convertir`);

for (const file of files) {
  const inputPath = path.join(imagesDir, file);
  const webpPath = path.join(imagesDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
  
  try {
    await sharp(inputPath)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(webpPath);
    
    console.log(`✓ Convertido: ${file} → ${path.basename(webpPath)}`);
  } catch (err) {
    console.error(`✗ Error con ${file}:`, err.message);
  }
}

console.log('\nConversión completada!');
