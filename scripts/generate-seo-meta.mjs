/**
 * Generate SEO meta data from Serper keywords stored in D1.
 * Creates: src/data/generated/seo-keywords.json and seo-meta.json
 * 
 * Usage: node scripts/generate-seo-meta.mjs
 * 
 * This script reads keywords from the admin API and generates optimized
 * meta titles and descriptions for each service×location combo page.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';

const API_BASE = 'https://guardman-admin-api.oficinadesarrollo33.workers.dev';
const GENERATED_DIR = 'src/data/generated';

async function fetchJSON(path) {
  try {
    const res = await fetch(`${API_BASE}${path}`);
    const data = await res.json();
    return data;
  } catch (e) {
    console.warn(`Failed to fetch ${path}: ${e.message}`);
    return null;
  }
}

function generateMetaTitle(serviceName, locationName) {
  const base = `${serviceName} en ${locationName}`;
  const suffix = ' | GuardMan Chile';
  const maxLen = 60;
  if (base.length + suffix.length <= maxLen) return base + suffix;
  return base.substring(0, maxLen - suffix.length - 3) + '...' + suffix;
}

function generateMetaDescription(serviceName, locationName, zone) {
  const templates = [
    `Servicio de ${serviceName.toLowerCase()} profesional en ${locationName}. Guardias certificados OS-10, cobertura 24/7 en zona ${zone}. Cotiza gratis con GuardMan Chile.`,
    `${serviceName} en ${locationName} y toda la zona ${zone}. Empresa con 8+ años de experiencia, 500+ guardias certificados. Solicita tu cotización sin compromiso.`,
    `Empresa de ${serviceName.toLowerCase()} en ${locationName}, Región Metropolitana. Personal certificado OS-10, monitoreo 24/7. Cotización gratuita en GuardMan Chile.`,
  ];
  const desc = templates[Math.floor(Math.random() * templates.length)];
  return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
}

async function main() {
  console.log('=== SEO Meta Generator ===\n');

  if (!existsSync(GENERATED_DIR)) mkdirSync(GENERATED_DIR, { recursive: true });

  // Fetch data from admin API
  console.log('Fetching services, locations, keywords...');
  const [servicesRes, locationsRes, keywordsRes] = await Promise.all([
    fetchJSON('/api/services'),
    fetchJSON('/api/locations'),
    fetchJSON('/api/seo/keywords?limit=2000'),
  ]);

  const services = servicesRes?.data || [];
  const locations = locationsRes?.data || [];
  const keywords = keywordsRes?.data || [];

  console.log(`  Services: ${services.length}`);
  console.log(`  Locations: ${locations.length}`);
  console.log(`  Keywords: ${keywords.length}`);

  // Build keyword index: serviceSlug-locationSlug → keywords
  const keywordIndex = {};
  for (const kw of keywords) {
    const key = `${kw.service_slug || ''}-${kw.location_slug || ''}`;
    if (!keywordIndex[key]) keywordIndex[key] = [];
    keywordIndex[key].push(kw);
  }

  // Generate SEO meta for each combo
  const seoMeta = {};
  const seoKeywords = {};
  let generated = 0;

  for (const service of services) {
    seoMeta[service.slug] = seoMeta[service.slug] || {};
    seoKeywords[service.slug] = seoKeywords[service.slug] || {};

    for (const location of locations) {
      const zone = location.zone || 'Centro';
      const key = `${service.slug}-${location.slug}`;
      const locationKeywords = keywordIndex[key] || [];

      // Sort by SDS score (lower = easier to rank)
      locationKeywords.sort((a, b) => (a.sds_score || 100) - (b.sds_score || 100));

      const primaryKeyword = locationKeywords[0]?.keyword || `${service.name} en ${location.name}`;
      const easyWins = locationKeywords.filter(k => k.is_easy_win).slice(0, 5).map(k => k.keyword);
      const secondaryKeywords = locationKeywords.slice(0, 10).map(k => k.keyword);

      const metaTitle = generateMetaTitle(service.name, location.name);
      const metaDescription = generateMetaDescription(service.name, location.name, zone);

      seoMeta[service.slug][location.slug] = {
        primary_keyword: primaryKeyword,
        meta_title: metaTitle,
        meta_description: metaDescription,
      };

      seoKeywords[service.slug][location.slug] = {
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords,
        easy_wins: easyWins,
      };

      generated++;
    }
  }

  // Write files
  writeFileSync(`${GENERATED_DIR}/seo-meta.json`, JSON.stringify(seoMeta, null, 2));
  writeFileSync(`${GENERATED_DIR}/seo-keywords.json`, JSON.stringify(seoKeywords, null, 2));

  console.log(`\n  Generated SEO meta for ${generated} combos`);
  console.log(`  → ${GENERATED_DIR}/seo-meta.json`);
  console.log(`  → ${GENERATED_DIR}/seo-keywords.json`);
  console.log('\nDone!');
}

main().catch(err => { console.error(err); process.exit(1); });
