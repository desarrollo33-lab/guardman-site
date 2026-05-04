/**
 * Generate SEO meta data from Serper keywords.
 * Uses existing generated data + service/location lists.
 * Output: src/data/generated/seo-keywords.json and seo-meta.json
 *
 * Usage: node scripts/generate-seo-meta.mjs
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';

const CMS_DIR = 'src/data/cms';
const GENERATED_DIR = 'src/data/generated';

function loadJSON(path) {
  if (!existsSync(path)) return null;
  try { return JSON.parse(readFileSync(path, 'utf-8')); } catch { return null; }
}

function generateMetaTitle(serviceName, locationName) {
  const base = `${serviceName} en ${locationName}`;
  const suffix = ' | GuardMan Chile';
  const maxLen = 60;
  if (base.length + suffix.length <= maxLen) return base + suffix;
  return base.substring(0, maxLen - suffix.length - 3) + '...' + suffix;
}

function generateMetaDescription(serviceName, locationName, zone) {
  const desc = `${serviceName} profesional en ${locationName}, zona ${zone}. Guardias certificados OS-10, centro de monitoreo propio 24/7. Cotización gratuita en GuardMan Chile.`;
  return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
}

async function main() {
  console.log('=== SEO Meta Generator v2 ===\n');

  if (!existsSync(GENERATED_DIR)) mkdirSync(GENERATED_DIR, { recursive: true });

  const servicesData = loadJSON(`${CMS_DIR}/services.json`);
  const locationsData = loadJSON(`${CMS_DIR}/locations.json`);
  const easyKeywordsData = loadJSON(`${GENERATED_DIR}/easy-keywords.json`);

  const services = servicesData?.results || servicesData || [];
  const locations = locationsData?.results || locationsData || [];
  const easyKeywords = easyKeywordsData?.results || [];

  console.log(`  Services: ${services.length}`);
  console.log(`  Locations: ${locations.length}`);
  console.log(`  Easy Keywords: ${easyKeywords.length}`);

  // Build easy-win index by keyword text
  const easyWinSet = new Set(easyKeywords.map((k) => k.keyword?.toLowerCase()));

  // Generate SEO meta for each combo
  const seoMeta = {};
  const seoKeywords = {};
  let generated = 0;

  for (const service of services) {
    const serviceSlug = service.slug;
    seoMeta[serviceSlug] = seoMeta[serviceSlug] || {};
    seoKeywords[serviceSlug] = seoKeywords[serviceSlug] || {};

    for (const location of locations) {
      const locationSlug = location.slug;
      const zone = location.zone || 'Centro';
      const serviceName = service.name;
      const locationName = location.name;

      // Generate keyword variations
      const primaryKeyword = `${serviceName} en ${locationName}`;
      const secondaryKeywords = [
        primaryKeyword,
        `${serviceName} ${locationName}`,
        `servicio de ${serviceName.toLowerCase()} en ${locationName}`,
        `${serviceName.toLowerCase()} zona ${zone}`,
        `seguridad privada ${locationName}`,
        `guardias de seguridad ${locationName}`,
        `empresa de seguridad ${locationName}`,
        `${serviceName.toLowerCase()} santiago`,
        `guardman ${locationName}`,
        `cotizar ${serviceName.toLowerCase()} ${locationName}`,
      ];

      // Find easy wins for this combo
      const easyWins = secondaryKeywords
        .filter(kw => easyWinSet.has(kw.toLowerCase()) || easyWinSet.has(kw.split(' ').slice(0, 3).join(' ').toLowerCase()));

      const metaTitle = generateMetaTitle(serviceName, locationName);
      const metaDescription = generateMetaDescription(serviceName, locationName, zone);

      seoMeta[serviceSlug][locationSlug] = {
        primary_keyword: primaryKeyword,
        meta_title: metaTitle,
        meta_description: metaDescription,
      };

      seoKeywords[serviceSlug][locationSlug] = {
        primary_keyword: primaryKeyword,
        secondary_keywords: secondaryKeywords.slice(0, 10),
        easy_wins: easyWins.length > 0 ? easyWins : [primaryKeyword],
      };

      generated++;
    }
  }

  writeFileSync(`${GENERATED_DIR}/seo-meta.json`, JSON.stringify(seoMeta, null, 2));
  writeFileSync(`${GENERATED_DIR}/seo-keywords.json`, JSON.stringify(seoKeywords, null, 2));

  console.log(`\n  Generated SEO meta for ${generated} combos`);
  console.log(`  → ${GENERATED_DIR}/seo-meta.json`);
  console.log(`  → ${GENERATED_DIR}/seo-keywords.json`);
  console.log('\nDone!');
}

main().catch(err => { console.error(err); process.exit(1); });
