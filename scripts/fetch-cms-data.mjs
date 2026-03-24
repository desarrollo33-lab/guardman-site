/**
 * Fetch CMS data at build time and save to JSON
 * Run: node scripts/fetch-cms-data.mjs
 * 
 * This script fetches all data from Directus CMS and saves it to src/data/generated/
 * Data is pre-fetched at build time for static site generation
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'src', 'data', 'generated');
const IMAGES_DIR = join(ROOT, 'public', 'images');

const DIRECTUS_URL = 'http://64.176.16.231:8055';

// Default site config based on Brand DNA (used as fallback when CMS is empty)
const DEFAULT_SITE_CONFIG = {
  site_name: 'GuardMan Chile',
  legal_name: 'GuardMan Seguridad Privada SpA',
  rut: '76.123.456-7',
  tagline: 'Protegemos lo que mas te importa',
  description: 'Empresa lider en servicios de seguridad privada en Santiago. Guardias certificados OS-10, CCTV, control de accesos y monitoreo 24/7 en toda la Region Metropolitana.',
  about_text: 'GuardMan Chile es una empresa lider en servicios de seguridad privada en Santiago de Chile. Con mas de 8 anos de experiencia, ofrecemos soluciones integrales de seguridad para empresas, condominos, eventos y residencias particulares. Contamos con un equipo de mas de 500 guardias certificados y un centro de monitoreo propio operate 24/7.',
  phone: '+56 2 2400 6000',
  phone_display: '+56 9 300 000 10',
  whatsapp: '+56 9 3000 0010',
  email: 'info@guardman.cl',
  commercial_email: 'ventas@guardman.cl',
  address: 'Av. Americo Vespucio Norte 1980, Providencia, Santiago, Chile',
  latitude: -33.4569,
  longitude: -70.6483,
  site_url: 'https://guardman.cl',
  social_instagram: 'https://www.instagram.com/grupo_guardman',
  social_youtube: 'https://youtu.be/mqpLsKrwjAI',
  stats_guards: '500+',
  stats_clients: '200+',
  stats_locations: '14',
  stats_years: '8+',
  seo_title: 'GuardMan Chile - Seguridad Privada en Santiago',
  seo_description: 'Empresa lider en servicios de seguridad privada en Santiago. Guardias certificados OS-10, CCTV, control de accesos y monitoreo 24/7 en toda la Region Metropolitana.',
  hero_image: null,
  hours: [
    { day: 'Lunes', hours: '24 horas' },
    { day: 'Martes', hours: '24 horas' },
    { day: 'Miercoles', hours: '24 horas' },
    { day: 'Jueves', hours: '24 horas' },
    { day: 'Viernes', hours: '24 horas' },
    { day: 'Sabado', hours: '24 horas' },
    { day: 'Domingo', hours: '24 horas' },
  ],
  usps: [
    { title: 'GuardPod V1', description: 'Unidad Autonoma de Vigilancia 24/7 - 15 meses de desarrollo propio', icon: 'shield-check' },
    { title: 'Supervision Nocturna Preventiva', description: 'Monitoreo proactivo de conductas sospechosas', icon: 'eye' },
    { title: 'Respuesta Inmediata Certificada', description: 'Tiempos de respuesta garantizados contractualmente', icon: 'clock' },
    { title: 'Personal Certificacion OS-10', description: 'Todos nuestros guardias cuentan con certificacion OS-10 vigente', icon: 'badge-check' },
    { title: 'Centro de Monitoreo Propio', description: 'Con redundancia y supervision 24/7', icon: 'monitor' },
  ],
  certifications: [
    { name: 'Autorizacion Laboral', description: 'Autorizacion de la Autoridad Administrativa Laboral (Chile) para servicios de seguridad privada' },
    { name: 'Seguro RC', description: 'Seguro de responsabilidad civil obligatorio' },
    { name: 'Certificacion OS-10', description: 'Personal con certificacion OS-10 vigente' },
    { name: 'Verificacion Antecedentes', description: 'Verificacion de antecedentes para todo el personal' },
    { name: 'Protocolos Carabineros', description: 'Protocolos de seguridad certificados por Carabineros de Chile' },
  ],
};

// Get token from Directus
async function login() {
  try {
    const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@guardman.cl', password: 'GuardMan2024!' })
    });
    const data = await res.json();
    if (!data.data?.access_token) {
      throw new Error('No access token received');
    }
    return data.data.access_token;
  } catch (error) {
    console.error('❌ Failed to login to Directus:', error.message);
    return null;
  }
}

async function fetchData(token, endpoint) {
  try {
    const res = await fetch(`${DIRECTUS_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.warn(`⚠️ Failed to fetch ${endpoint}:`, error.message);
    return [];
  }
}

function parseJsonField(value) {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  return value || [];
}

// Download image from Directus and save locally
async function downloadImage(token, imageId, filename) {
  if (!imageId) return null;
  
  const localPath = `/images/${filename}`;
  const fullPath = join(IMAGES_DIR, filename);
  
  // Skip if already exists
  if (existsSync(fullPath)) {
    return localPath;
  }
  
  try {
    const res = await fetch(`${DIRECTUS_URL}/assets/${imageId}?access_token=${token}`);
    if (!res.ok) {
      console.warn(`  ⚠️ Failed to download image ${imageId}`);
      return null;
    }
    
    const buffer = await res.arrayBuffer();
    writeFileSync(fullPath, Buffer.from(buffer));
    return localPath;
  } catch (error) {
    console.warn(`  ⚠️ Error downloading image ${imageId}: ${error.message}`);
    return null;
  }
}

// Get list of all files in Directus
async function getDirectusFiles(token) {
  try {
    const res = await fetch(`${DIRECTUS_URL}/files?access_token=${token}&limit=-1`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.warn(`⚠️ Failed to fetch files list:`, error.message);
    return [];
  }
}

async function main() {
  console.log('🔄 Fetching data from Directus CMS...\n');
  
  // Ensure directories exist
  mkdirSync(DATA_DIR, { recursive: true });
  mkdirSync(IMAGES_DIR, { recursive: true });
  
  const token = await login();
  
  if (!token) {
    console.log('⚠️  Using fallback data from Brand DNA...\n');
    writeFileSync(join(DATA_DIR, 'site-config.json'), JSON.stringify(DEFAULT_SITE_CONFIG, null, 2));
    console.log('✅ Site config saved (fallback)\n');
    return;
  }
  
  console.log('✅ Connected to Directus\n');
  
  try {
    // Fetch all data
    const [services, locations, sectors, clients, testimonials, siteConfig] = await Promise.all([
      fetchData(token, '/items/services?filter={"status":{"_eq":"published"}}&sort=sort&limit=-1'),
      fetchData(token, '/items/locations?filter={"status":{"_eq":"published"}}&sort=sort&limit=-1'),
      fetchData(token, '/items/sectors?filter={"status":{"_eq":"published"}}&sort=sort&limit=-1'),
      fetchData(token, '/items/clients?filter={"featured":{"_eq":true},"status":{"_eq":"published"}}&sort=sort&limit=-1'),
      fetchData(token, '/items/testimonials?filter={"featured":{"_eq":true},"status":{"_eq":"published"}}&sort=sort&limit=10'),
      fetchData(token, '/items/site_config?limit=1'),
    ]);
    
    // Get file metadata from Directus for naming
    const files = await getDirectusFiles(token);
    const fileMap = {};
    files.forEach(f => { fileMap[f.id] = f; });
    
    // Site config is a singleton, so it's an object not an array
    const siteConfigData = siteConfig;
    
    // Download images
    console.log('📥 Downloading images from Directus...\n');
    
    // Create image name mapping (Directus ID -> local filename)
    const imageNameMap = {};
    
    // Services images
    for (const s of services) {
      if (s.image && fileMap[s.image]) {
        const ext = fileMap[s.image].type === 'image/png' ? 'png' : 'jpg';
        const filename = `service-${s.slug}.${ext}`;
        imageNameMap[s.image] = filename;
      }
    }
    
    // Sectors images
    for (const s of sectors) {
      if (s.image && fileMap[s.image]) {
        const ext = fileMap[s.image].type === 'image/png' ? 'png' : 'jpg';
        const filename = `sector-${s.slug}.${ext}`;
        imageNameMap[s.image] = filename;
      }
    }
    
    // Locations images
    for (const l of locations) {
      if (l.image && fileMap[l.image]) {
        const ext = fileMap[l.image].type === 'image/png' ? 'png' : 'jpg';
        const filename = `location-${l.slug}.${ext}`;
        imageNameMap[l.image] = filename;
      }
    }
    
    // Hero image from site_config (singleton - object, not array)
    if (siteConfigData && siteConfigData.hero_image) {
      const heroImageId = siteConfigData.hero_image;
      if (fileMap[heroImageId]) {
        const ext = fileMap[heroImageId].type === 'image/png' ? 'png' : 'jpg';
        imageNameMap[heroImageId] = `hero-home.${ext}`;
      }
    }
    
    // Download all images
    let downloadedCount = 0;
    for (const [imageId, filename] of Object.entries(imageNameMap)) {
      const localPath = await downloadImage(token, imageId, filename);
      if (localPath) {
        downloadedCount++;
        console.log(`  ✓ ${filename}`);
      }
    }
    console.log(`  → ${downloadedCount} images downloaded\n`);
    
    // Process and save services
    const processedServices = services.map(s => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description || '',
      short_description: s.short_description || s.name,
      hero_heading: s.hero_heading || `Servicio de ${s.name} en Santiago`,
      meta_title: s.meta_title || `${s.name} | GuardMan Chile`,
      meta_description: s.meta_description || s.description || '',
      price_range: s.price_range || '$$$',
      features: parseJsonField(s.features),
      process: parseJsonField(s.process),
      common_issues: parseJsonField(s.common_issues),
      featured: s.featured || false,
      status: s.status,
      sort: s.sort || 0,
      image: s.image ? imageNameMap[s.image] || s.image : null,
    }));
    writeFileSync(join(DATA_DIR, 'services.json'), JSON.stringify(processedServices, null, 2));
    console.log(`✓ Services: ${processedServices.length} records`);
    
    // Process and save locations
    const processedLocations = locations.map(l => ({
      id: l.id,
      name: l.name,
      slug: l.slug,
      zone: l.zone || '',
      description: l.description || '',
      neighborhoods: parseJsonField(l.neighborhoods),
      priority_score: l.priority_score || 0,
      latitude: l.latitude || 0,
      longitude: l.longitude || 0,
      meta_title: l.meta_title || `Seguridad en ${l.name} | GuardMan`,
      meta_description: l.meta_description || l.description || '',
      featured: l.featured || false,
      image: l.image ? imageNameMap[l.image] || l.image : null,
      status: l.status,
      sort: l.sort || 0,
    }));
    writeFileSync(join(DATA_DIR, 'locations.json'), JSON.stringify(processedLocations, null, 2));
    console.log(`✓ Locations: ${processedLocations.length} records`);
    
    // Process and save sectors
    const processedSectors = sectors.map(s => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      icon: s.icon || 'building',
      description: s.description || '',
      hero_title: s.hero_title || s.name,
      hero_subtitle: s.hero_subtitle || '',
      challenges: parseJsonField(s.challenges),
      meta_title: s.meta_title || `${s.name} | GuardMan Chile`,
      meta_description: s.meta_description || s.description || '',
      featured: s.featured || false,
      image: s.image ? imageNameMap[s.image] || s.image : null,
      status: s.status,
      sort: s.sort || 0,
    }));
    writeFileSync(join(DATA_DIR, 'sectors.json'), JSON.stringify(processedSectors, null, 2));
    console.log(`✓ Sectors: ${processedSectors.length} records`);
    
    // Process and save clients
    const processedClients = clients.map(c => ({
      id: c.id,
      name: c.name,
      industry: c.industry || '',
      services: parseJsonField(c.services),
      logo_url: c.logo_url || '',
      featured: c.featured || false,
      status: c.status,
      sort: c.sort || 0,
    }));
    writeFileSync(join(DATA_DIR, 'clients.json'), JSON.stringify(processedClients, null, 2));
    console.log(`✓ Clients: ${processedClients.length} records`);
    
    // Process and save testimonials
    const processedTestimonials = testimonials.map(t => ({
      id: t.id,
      name: t.name || '',
      role: t.role || '',
      company: t.company || '',
      quote: t.quote || '',
      rating: t.rating || 5,
      sector: t.sector || '',
      featured: t.featured || false,
      status: t.status,
      sort: t.sort || 0,
    }));
    writeFileSync(join(DATA_DIR, 'testimonials.json'), JSON.stringify(processedTestimonials, null, 2));
    console.log(`✓ Testimonials: ${processedTestimonials.length} records`);
    
    // Process and save site config (merge with defaults to ensure all fields exist)
    // Note: siteConfig from Directus singleton is an object, not an array
    let configData = {};
    if (siteConfigData && Object.keys(siteConfigData).length > 0) {
      // Convert hero_image ID to local path if it exists
      const heroImageLocal = siteConfigData.hero_image && imageNameMap[siteConfigData.hero_image] 
        ? imageNameMap[siteConfigData.hero_image] 
        : (siteConfigData.hero_image || null);
      
      configData = {
        ...DEFAULT_SITE_CONFIG,
        ...siteConfigData,
        hero_image: heroImageLocal,
        // Ensure nested arrays are properly parsed
        hours: parseJsonField(siteConfigData.hours).length > 0 ? parseJsonField(siteConfigData.hours) : DEFAULT_SITE_CONFIG.hours,
        usps: parseJsonField(siteConfigData.usps).length > 0 ? parseJsonField(siteConfigData.usps) : DEFAULT_SITE_CONFIG.usps,
        certifications: parseJsonField(siteConfigData.certifications).length > 0 ? parseJsonField(siteConfigData.certifications) : DEFAULT_SITE_CONFIG.certifications,
      };
    } else {
      configData = DEFAULT_SITE_CONFIG;
    }
    writeFileSync(join(DATA_DIR, 'site-config.json'), JSON.stringify(configData, null, 2));
    console.log(`✓ Site config: 1 record`);
    
    console.log('\n✅ Data fetched successfully!');
    console.log(`   Saved to: ${DATA_DIR}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    // Save fallback data on error
    writeFileSync(join(DATA_DIR, 'site-config.json'), JSON.stringify(DEFAULT_SITE_CONFIG, null, 2));
    console.log('✅ Fallback site config saved');
    process.exit(1);
  }
}

main();
