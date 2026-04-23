#!/usr/bin/env node
/**
 * Dynamic Export Script
 * Usa la nueva API pública del Admin Panel con caching
 * 
 * Usage:
 *   node scripts/export-dynamic.mjs           # Export all published
 *   node scripts/export-dynamic.mjs --watch   # Watch mode
 *   node scripts/export-dynamic.mjs --slug=guardias-de-seguridad
 */

import { writeFileSync, mkdirSync, existsSync, watch } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CMS_DIR = join(ROOT, 'src', 'data', 'cms');

// API Configuration
const API_BASE = process.env.ADMIN_API_URL || 'https://guardman-admin-panel.oficinadesarrollo33.workers.dev';
const AUTH_TOKEN = process.env.ADMIN_TOKEN || 'GuardMan2026!@#Admin';

// Fetch with retry
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          ...options.headers
        }
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || `HTTP ${res.status}`);
      }
      
      return res.json();
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

// Export all services
async function exportAllServices() {
  console.log('📥 Fetching published services...');
  
  const response = await fetchWithRetry(`${API_BASE}/public/services`);
  
  if (!response.ok) {
    throw new Error(response.error || 'Failed to fetch services');
  }

  const services = response.data || [];
  console.log(`✅ Found ${services.length} services\n`);

  let exported = 0;
  
  for (const service of services) {
    await exportService(service.slug);
    exported++;
  }

  // Save services list
  writeFileSync(
    join(CMS_DIR, 'services.json'),
    JSON.stringify({ results: services, updatedAt: new Date().toISOString() }, null, 2)
  );

  return exported;
}

// Export single service with full content
async function exportService(slug) {
  process.stdout.write(`  📤 ${slug}... `);
  
  try {
    const response = await fetchWithRetry(
      `${API_BASE}/public/content?slug=${slug}&type=service`
    );

    if (!response.ok) {
      console.log('⚠️ no content');
      return false;
    }

    const { data } = response;
    
    // Transform to site format
    const content = data.content || {};
    const exportData = {
      slug: data.entity_slug,
      name: data.entity_name || slug,
      short_description: data.short_description || '',
      price_range: data.price_range || '$$',
      version: data.version,
      word_count: data.word_count,
      seo_score: data.seo_score,
      published_at: data.published_at,
      sections: {
        hero: content.hero || { heading: '', subheading: '' },
        intro: content.intro || { heading: '', paragraphs: [] },
        features: content.features || { heading: '', items: [] },
        issues: content.issues || { heading: '', items: [] },
        stats: content.stats || { heading: '', items: [] },
        faqs: content.faqs || { heading: '', items: [] },
        cta: content.cta || { heading: '', subheading: '', button: 'Solicitar Cotización' },
        meta: {
          title: content.metaTitle || content.meta_title || '',
          description: content.metaDescription || content.meta_description || ''
        }
      }
    };

    writeFileSync(
      join(CMS_DIR, `${slug}.json`),
      JSON.stringify(exportData, null, 2)
    );

    console.log('✅');
    return true;
  } catch (e) {
    console.log(`❌ ${e.message}`);
    return false;
  }
}

// Export locations
async function exportLocations() {
  console.log('\n📥 Fetching locations...');
  
  const response = await fetchWithRetry(`${API_BASE}/public/locations`);
  
  if (!response.ok) {
    console.log('⚠️ Failed to fetch locations');
    return 0;
  }

  const locations = response.data || [];
  
  // Save locations list
  writeFileSync(
    join(CMS_DIR, 'locations.json'),
    JSON.stringify({ results: locations, updatedAt: new Date().toISOString() }, null, 2)
  );

  // Export each location content
  let exported = 0;
  for (const location of locations) {
    process.stdout.write(`  📤 location-${location.slug}... `);
    
    try {
      const contentRes = await fetchWithRetry(
        `${API_BASE}/public/content?slug=${location.slug}&type=location`
      );
      
      if (contentRes.ok && contentRes.data) {
        const exportData = {
          slug: location.slug,
          name: location.name,
          zone: location.zone,
          region: location.region,
          sections: contentRes.data.content || {}
        };
        
        writeFileSync(
          join(CMS_DIR, `location-${location.slug}.json`),
          JSON.stringify(exportData, null, 2)
        );
        console.log('✅');
        exported++;
      } else {
        console.log('⚠️ no content');
      }
    } catch (e) {
      console.log(`❌ ${e.message}`);
    }
  }

  return exported;
}

// Export sectors
async function exportSectors() {
  console.log('\n📥 Fetching sectors...');
  
  const response = await fetchWithRetry(`${API_BASE}/public/sectors`);
  
  if (!response.ok) {
    console.log('⚠️ Failed to fetch sectors');
    return 0;
  }

  const sectors = response.data || [];
  
  // Save sectors list
  writeFileSync(
    join(CMS_DIR, 'sectors.json'),
    JSON.stringify(sectors, null, 2)
  );

  console.log(`✅ Exported ${sectors.length} sectors`);
  return sectors.length;
}

// Watch mode
async function watchMode() {
  console.log('\n👀 Watch mode enabled. Press Ctrl+C to stop.\n');
  
  // Initial export
  await main();
  
  // Set up polling every 30 seconds
  setInterval(async () => {
    console.log(`\n🔄 [${new Date().toLocaleTimeString()}] Checking for updates...`);
    await main();
  }, 30000);
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const watch = args.includes('--watch');
  const slugArg = args.find(a => a.startsWith('--slug='));
  const specificSlug = slugArg ? slugArg.split('=')[1] : null;

  console.log('🚀 Dynamic Export Started\n');
  console.log(`API: ${API_BASE}\n`);

  // Ensure directory exists
  if (!existsSync(CMS_DIR)) {
    mkdirSync(CMS_DIR, { recursive: true });
  }

  try {
    if (watch) {
      await watchMode();
    } else if (specificSlug) {
      // Export single service
      await exportService(specificSlug);
    } else {
      // Export everything
      const [servicesCount, locationsCount, sectorsCount] = await Promise.all([
        exportAllServices(),
        exportLocations(),
        exportSectors()
      ]);

      console.log(`\n📊 Export Summary:`);
      console.log(`   Services: ${servicesCount}`);
      console.log(`   Locations: ${locationsCount}`);
      console.log(`   Sectors: ${sectorsCount}`);
      console.log(`   Output: ${CMS_DIR}`);
    }

    console.log('\n✨ Export complete!\n');
    
    if (!watch) {
      process.exit(0);
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}\n`);
    if (!watch) {
      process.exit(1);
    }
  }
}

main().catch(console.error);
