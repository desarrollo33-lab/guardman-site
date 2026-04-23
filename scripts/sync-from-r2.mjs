/**
 * Sync from R2 - Sincroniza contenido publicado desde R2 a archivos locales
 * Uso: node scripts/sync-from-r2.mjs
 * 
 * Este script se ejecuta ANTES de astro build para poblar src/data/cms/
 * con el contenido más reciente publicado desde el Admin API.
 */

import { writeFileSync, mkdirSync, existsSync, readdirSync, unlinkSync, rmdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const CMS_DIR = join(ROOT_DIR, 'src', 'data', 'cms');
const PUBLIC_IMAGES_DIR = join(ROOT_DIR, 'public', 'images');

// API Configuration
const API_BASE = 'https://guardman-admin-api.oficinadesarrollo33.workers.dev';
const AUTH_EMAIL = 'admin@guardman.cl';
// Use legacy auth token (same as Bearer admin@guardman.cl:token format)
const AUTH_TOKEN = 'admin@guardman.cl:test';

async function login() {
  // Use legacy auth - just return the token directly since auth is email:token format
  return AUTH_TOKEN;
}

async function fetchAPI(endpoint, token) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  if (!data.ok && data.error) {
    throw new Error(data.error);
  }
  return data;
}

// Download image from URL and save locally
async function downloadImage(url, localPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    
    const buffer = await res.arrayBuffer();
    writeFileSync(localPath, Buffer.from(buffer));
    
    console.log(`  ✓ Downloaded: ${localPath}`);
    return true;
  } catch (e) {
    console.log(`  ✗ Failed: ${url} - ${e.message}`);
    return false;
  }
}

// Convert R2 key to public URL
function r2KeyToUrl(key) {
  return `${API_BASE}/api/images/${key}`;
}

// Download all images for an entity
async function downloadEntityImages(entityType, entitySlug, images) {
  const entityDir = join(PUBLIC_IMAGES_DIR, entityType, entitySlug);
  if (!existsSync(entityDir)) {
    mkdirSync(entityDir, { recursive: true });
  }
  
  let downloaded = 0;
  for (const img of images) {
    const ext = img.url.split('.').pop() || 'jpg';
    const filename = `${img.type}-${img.key.split('/').pop()}`;
    const localPath = join(entityDir, filename);
    
    if (await downloadImage(img.url, localPath)) {
      downloaded++;
    }
  }
  return downloaded;
}

// Transform published content to CMS file format
function transformContent(content, entityType, entitySlug) {
  const sections = content.sections || content;
  const publish = content._publish || {};
  
  // For services and sectors, keep the full content structure
  if (entityType === 'service' || entityType === 'sector') {
    return {
      slug: entitySlug,
      type: entityType,
      sections,
      meta: sections.meta || {},
      _publish: {
        version: publish.version,
        score: publish.score,
        publishedAt: publish.publishedAt,
        heroImage: publish.heroImage,
        ogImage: publish.ogImage,
      }
    };
  }
  
  // For locations, transform to location-{slug}.json format
  if (entityType === 'location') {
    return {
      slug: entitySlug,
      type: 'location',
      sections,
      meta: sections.meta || {},
      _publish: {
        version: publish.version,
        score: publish.score,
        publishedAt: publish.publishedAt,
        heroImage: publish.heroImage,
        ogImage: publish.ogImage,
      }
    };
  }
  
  // For combos, generate separate file
  if (entityType === 'combo') {
    return {
      slug: entitySlug,
      type: 'combo',
      serviceSlug: publish.comboServiceSlug,
      locationSlug: publish.comboLocationSlug,
      sections,
      meta: sections.meta || {},
      _publish: {
        version: publish.version,
        score: publish.score,
        publishedAt: publish.publishedAt,
        heroImage: publish.heroImage,
        ogImage: publish.ogImage,
      }
    };
  }
  
  return { slug: entitySlug, type: entityType, sections };
}

// Fetch and process published content from R2
async function syncPublishedContent(token) {
  console.log('\n📦 Syncing published content from R2...\n');
  
  // Get content overview
  const overview = await fetchAPI('/api/content/overview', token);
  if (!overview.ok) {
    console.error('Failed to get overview:', overview.error);
    return { entities: 0, images: 0 };
  }
  
  const entities = overview.data?.entities || [];
  let synced = 0;
  let skipped = 0;
  let totalImages = 0;
  
  // Process each entity with content
  for (const entity of entities) {
    if (!entity.has_content) {
      skipped++;
      continue;
    }
    
    try {
      // Get latest content
      const latestRes = await fetchAPI(`/api/content/latest/${entity.type}/${entity.slug}`, token);
      const latestData = latestRes.data;
      
      if (!latestData?.content_json) {
        skipped++;
        continue;
      }
      
      let content = typeof latestData.content_json === 'string' 
        ? JSON.parse(latestData.content_json) 
        : latestData.content_json;
      
      // Get images for this entity
      const imagesRes = await fetchAPI(`/api/entities/${entity.type}/${entity.slug}/images`, token);
      const images = imagesRes.data || [];
      
      // Download images locally
      if (images.length > 0) {
        const downloaded = await downloadEntityImages(entity.type, entity.slug, images);
        totalImages += downloaded;
        
        // Update content with local image paths
        const heroImg = images.find(i => i.image_type === 'hero');
        const ogImg = images.find(i => i.image_type === 'og');
        
        if (heroImg) {
          const ext = heroImg.image_url.split('.').pop() || 'jpg';
          const localPath = `/images/${entity.type}/${entity.slug}/hero-${heroImg.image_key.split('/').pop()}`;
          if (content.sections?.hero) {
            content.sections.hero.image = localPath;
          }
        }
        
        // Add _images metadata to content
        content._images = images.map(img => ({
          type: img.image_type,
          local: `/images/${entity.type}/${entity.slug}/${img.image_type}-${img.image_key.split('/').pop()}`,
          original: img.image_url,
          alt: img.alt_text,
          isPrimary: img.is_primary === 1,
        }));
      }
      
      // Transform and save content file
      const transformed = transformContent(content, entity.type, entity.slug);
      
      let filename;
      if (entity.type === 'location') {
        filename = `location-${entity.slug}.json`;
      } else if (entity.type === 'combo') {
        filename = `combo-${entity.slug}.json`;
      } else if (entity.type === 'sector') {
        filename = `sector-${entity.slug}.json`;
      } else {
        filename = `${entity.slug}.json`;
      }
      
      const filePath = join(CMS_DIR, filename);
      writeFileSync(filePath, JSON.stringify(transformed, null, 2));
      
      console.log(`  ✓ ${filename} (${images.length} images, score: ${entity.score})`);
      synced++;
      
    } catch (e) {
      console.log(`  ✗ ${entity.type}/${entity.slug}: ${e.message}`);
      skipped++;
    }
  }
  
  return { synced, skipped, images: totalImages };
}

// Generate metadata files (services.json, locations.json, sectors.json, images.json)
async function generateMetadataFiles(token) {
  console.log('\n📋 Generating metadata files...\n');
  
  // Get overview for metadata
  const overview = await fetchAPI('/api/content/overview', token);
  if (!overview.ok) return;
  
  const entities = overview.data?.entities || [];
  
  // Services metadata
  const services = entities
    .filter(e => e.type === 'service')
    .map(s => ({
      slug: s.slug,
      name: s.name,
      score: s.score,
      hasContent: s.has_content,
      version: s.version,
      updatedAt: s.updated_at,
      keywords: s.keywords || [],
    }));
  writeFileSync(join(CMS_DIR, 'services.json'), JSON.stringify({ results: services }, null, 2));
  console.log(`  ✓ services.json (${services.length} services)`);
  
  // Locations metadata
  const locations = entities
    .filter(e => e.type === 'location')
    .map(l => ({
      slug: l.slug,
      name: l.name,
      zone: l.zone,
      score: l.score,
      hasContent: l.has_content,
      version: l.version,
      updatedAt: l.updated_at,
    }));
  writeFileSync(join(CMS_DIR, 'locations.json'), JSON.stringify({ results: locations }, null, 2));
  console.log(`  ✓ locations.json (${locations.length} locations)`);
  
  // Sectors metadata
  const sectors = entities
    .filter(e => e.type === 'sector')
    .map(s => ({
      slug: s.slug,
      name: s.name,
      score: s.score,
      hasContent: s.has_content,
      version: s.version,
      updatedAt: s.updated_at,
    }));
  writeFileSync(join(CMS_DIR, 'sectors.json'), JSON.stringify({ results: sectors }, null, 2));
  console.log(`  ✓ sectors.json (${sectors.length} sectors)`);
  
  // All images metadata
  const allImages = [];
  for (const entity of entities.filter(e => e.has_content)) {
    try {
      const imagesRes = await fetchAPI(`/api/entities/${entity.type}/${entity.slug}/images`, token);
      for (const img of imagesRes.data || []) {
        allImages.push({
          entity_type: entity.type,
          entity_slug: entity.slug,
          image_type: img.image_type,
          url: img.image_url,
          local: `/images/${entity.type}/${entity.slug}/${img.image_type}-${img.image_key.split('/').pop()}`,
          alt_text: img.alt_text,
          is_hero: img.image_type === 'hero',
          is_primary: img.is_primary === 1,
          uploaded_at: img.uploaded_at,
        });
      }
    } catch {}
  }
  writeFileSync(join(CMS_DIR, 'images.json'), JSON.stringify({ images: allImages }, null, 2));
  console.log(`  ✓ images.json (${allImages.length} images)`);
  
  // Config file
  const config = {
    lastSync: new Date().toISOString(),
    totalServices: services.length,
    totalLocations: locations.length,
    totalSectors: sectors.length,
    totalImages: allImages.length,
    apiBase: API_BASE,
  };
  writeFileSync(join(CMS_DIR, 'config.json'), JSON.stringify(config, null, 2));
  console.log(`  ✓ config.json`);
}

// Main sync function
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🔄 GuardMan CMS Sync - Sincronizando desde Admin API');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`\n📁 CMS Directory: ${CMS_DIR}`);
  console.log(`🖼️ Images Directory: ${PUBLIC_IMAGES_DIR}`);
  
  // Ensure directories exist
  if (!existsSync(CMS_DIR)) {
    mkdirSync(CMS_DIR, { recursive: true });
    console.log('  Created CMS directory');
  }
  if (!existsSync(PUBLIC_IMAGES_DIR)) {
    mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
    console.log('  Created images directory');
  }
  
  const startTime = Date.now();
  
  try {
    // Login
    console.log('\n🔐 Authenticating...');
    const token = await login();
    console.log('  ✓ Authenticated');
    
    // Sync content
    const { synced, skipped, images } = await syncPublishedContent(token);
    
    // Generate metadata
    await generateMetadataFiles(token);
    
    // Summary
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  ✅ Sync Complete!');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`  📦 Content synced: ${synced}`);
    console.log(`  ⏭️  Skipped: ${skipped}`);
    console.log(`  🖼️  Images downloaded: ${images}`);
    console.log(`  ⏱️  Time: ${elapsed}s`);
    console.log('═══════════════════════════════════════════════════════\n');
    
  } catch (e) {
    console.error('\n❌ Sync failed:', e.message);
    process.exit(1);
  }
}

main();