/**
 * Script para actualizar extensiones de imagen a WebP en datos del CMS
 */
import fs from 'fs';

// Update services.json
const servicesPath = './src/data/generated/services.json';
const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
services.forEach(s => {
  if (s.image) s.image = s.image.replace(/\.png$/i, '.webp');
});
fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
console.log('Updated services.json');

// Update sectors.json
const sectorsPath = './src/data/generated/sectors.json';
const sectors = JSON.parse(fs.readFileSync(sectorsPath, 'utf8'));
sectors.forEach(s => {
  if (s.image) s.image = s.image.replace(/\.png$/i, '.webp');
});
fs.writeFileSync(sectorsPath, JSON.stringify(sectors, null, 2));
console.log('Updated sectors.json');

// Update site-config.json - update hero_image
const configPath = './src/data/generated/site-config.json';
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
if (config.hero_image) {
  config.hero_image = config.hero_image.replace(/\.png$/i, '.webp');
}
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
console.log('Updated site-config.json');

console.log('\nImage extensions updated to WebP!');
