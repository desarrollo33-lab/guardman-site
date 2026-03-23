/**
 * Script para sincronizar datos desde Directus CMS
 * Ejecutar: node scripts/sync-directus.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://64.176.16.231:8055';
const TOKEN = process.env.DIRECTUS_TOKEN || '';

// Helper para hacer requests a Directus
async function directusFetch(endpoint, options = {}) {
  const url = `${DIRECTUS_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(TOKEN && { 'Authorization': `Bearer ${TOKEN}` }),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    throw new Error(`Directus API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Fetch todos los items de una colección
async function fetchCollection(collection, params = '') {
  try {
    const data = await directusFetch(`/items/${collection}?limit=-1${params}`);
    return data.data || [];
  } catch (error) {
    console.warn(`⚠ No se pudo fetch ${collection}: ${error.message}`);
    return [];
  }
}

// Sync servicios
async function syncServices() {
  console.log('📦 Sincronizando servicios...');
  const services = await fetchCollection('services', '&filter={"status":{"_eq":"published"}}&sort=sort');
  
  const formatted = services.map(s => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description || '',
    short_description: s.short_description || s.name,
    hero_heading: s.hero_heading || s.name,
    meta_title: s.meta_title || `${s.name} | GuardMan Chile`,
    meta_description: s.meta_description || s.description || '',
    price_range: s.price_range || '$$$',
    features: s.features || [],
    process: s.process || [],
    common_issues: s.common_issues || [],
    status: s.status,
    sort: s.sort || 0,
  }));

  writeFileSync(
    join(PROJECT_ROOT, 'src/data/services.json'),
    JSON.stringify(formatted, null, 2)
  );
  console.log(`   ✓ ${formatted.length} servicios`);
  return formatted;
}

// Sync ubicaciones
async function syncLocations() {
  console.log('📦 Sincronizando ubicaciones...');
  const locations = await fetchCollection('locations', '&filter={"status":{"_eq":"published"}}&sort=sort');
  
  const formatted = locations.map(l => ({
    id: l.id,
    name: l.name,
    slug: l.slug,
    zone: l.zone || '',
    description: l.description || '',
    neighborhoods: l.neighborhoods || [],
    priority_score: l.priority_score || 0,
    latitude: l.latitude || 0,
    longitude: l.longitude || 0,
    meta_title: l.meta_title || `Seguridad en ${l.name} | GuardMan`,
    meta_description: l.meta_description || l.description || '',
    status: l.status,
    sort: l.sort || 0,
  }));

  writeFileSync(
    join(PROJECT_ROOT, 'src/data/locations.json'),
    JSON.stringify(formatted, null, 2)
  );
  console.log(`   ✓ ${formatted.length} ubicaciones`);
  return formatted;
}

// Sync testimonios
async function syncTestimonials() {
  console.log('📦 Sincronizando testimonios...');
  const testimonials = await fetchCollection('testimonials', '&filter={"status":{"_eq":"published"}}&sort=sort&limit=10');
  
  const formatted = testimonials.map(t => ({
    id: t.id,
    name: t.name,
    role: t.role || '',
    company: t.company || '',
    quote: t.quote || '',
    rating: t.rating || 5,
    location: t.location || '',
  }));

  writeFileSync(
    join(PROJECT_ROOT, 'src/data/testimonials.json'),
    JSON.stringify(formatted, null, 2)
  );
  console.log(`   ✓ ${formatted.length} testimonios`);
  return formatted;
}

// Sync site config
async function syncSiteConfig() {
  console.log('📦 Sincronizando configuración del sitio...');
  const configs = await fetchCollection('site_config', '&limit=1');
  
  if (configs.length > 0) {
    const config = configs[0];
    const formatted = {
      site_name: config.site_name || 'GuardMan Chile',
      site_url: config.site_url || 'https://guardman.cl',
      phone: config.phone || '+56 2 2400 6000',
      phone_tel: config.phone_tel || '+56224006000',
      email: config.email || 'info@guardman.cl',
      address: config.address || 'Santiago, Chile',
      about_text: config.about_text || '',
      brand_voice: config.brand_voice || 'Profesional',
      hours: config.hours || [],
      usps: config.usps || [],
      social_links: config.social_links || {},
      stats: config.stats || { guards: '500+', clients: '200+', locations: '14', years: '8+' },
    };

    writeFileSync(
      join(PROJECT_ROOT, 'src/data/site-config.json'),
      JSON.stringify(formatted, null, 2)
    );
    console.log('   ✓ Configuración sincronizada');
    return formatted;
  }
  
  console.log('   ⚠ No hay configuración (usando defaults)');
  return null;
}

// Main sync
async function syncAll() {
  console.log('🔄 Iniciando sincronización desde Directus...\n');
  
  try {
    await syncServices();
    await syncLocations();
    await syncTestimonials();
    await syncSiteConfig();
    
    console.log('\n✅ Sincronización completa!');
    console.log('   Datos guardados en src/data/');
  } catch (error) {
    console.error('\n❌ Error en sincronización:', error.message);
    process.exit(1);
  }
}

syncAll();
