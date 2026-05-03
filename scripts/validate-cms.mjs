/**
 * CMS Data Validator — GuardMan Chile v1.12
 * Validates that all expected CMS JSON files exist and have correct structure.
 * 
 * Usage: node scripts/validate-cms.mjs
 */

import { readFileSync, existsSync, readdirSync } from 'fs';

const CMS_DIR = 'src/data/cms';

const EXPECTED_SERVICES = 9;
const EXPECTED_LOCATIONS = 14;
const EXPECTED_SECTORS = 9;

let errors = 0;
let warnings = 0;

function check(label, condition, level = 'error') {
  if (condition) {
    console.log(`  ✅ ${label}`);
  } else {
    if (level === 'error') {
      console.log(`  ❌ ${label}`);
      errors++;
    } else {
      console.log(`  ⚠️  ${label}`);
      warnings++;
    }
  }
}

function loadJSON(path) {
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    return null;
  }
}

function main() {
  console.log('=== CMS Data Validator ===\n');

  // 1. Core files
  console.log('📦 Core Files:');
  check('services.json exists', existsSync(`${CMS_DIR}/services.json`));
  check('locations.json exists', existsSync(`${CMS_DIR}/locations.json`));
  check('sectors.json exists', existsSync(`${CMS_DIR}/sectors.json`));
  check('homepage.json exists', existsSync(`${CMS_DIR}/homepage.json`));
  check('brand.json exists', existsSync(`${CMS_DIR}/brand.json`));
  check('config.json exists', existsSync(`${CMS_DIR}/config.json`));
  check('zones.json exists', existsSync(`${CMS_DIR}/zones.json`));
  check('staff.json exists', existsSync(`${CMS_DIR}/staff.json`));
  check('media-map.json exists', existsSync(`${CMS_DIR}/media-map.json`));

  // 2. Counts
  console.log('\n📊 Record Counts:');
  const services = loadJSON(`${CMS_DIR}/services.json`);
  const locations = loadJSON(`${CMS_DIR}/locations.json`);
  const sectors = loadJSON(`${CMS_DIR}/sectors.json`);

  const servicesList = services?.results || [];
  const locationsList = locations?.results || [];
  const sectorsList = sectors?.results || [];

  check(`Services: ${servicesList.length} (expected ${EXPECTED_SERVICES})`, servicesList.length >= EXPECTED_SERVICES, 'warn');
  check(`Locations: ${locationsList.length} (expected ${EXPECTED_LOCATIONS})`, locationsList.length >= EXPECTED_LOCATIONS, 'warn');
  check(`Sectors: ${sectorsList.length} (expected ${EXPECTED_SECTORS})`, sectorsList.length >= EXPECTED_SECTORS, 'warn');

  // 3. Service content files
  console.log('\n📄 Service Content Files:');
  for (const service of servicesList) {
    const data = loadJSON(`${CMS_DIR}/${service.slug}.json`);
    check(`Service "${service.slug}" has content file`, data !== null);
    if (data) {
      check(`  └─ has sections`, !!data.sections, 'warn');
    }
  }

  // 4. Location content files
  console.log('\n📍 Location Content Files:');
  for (const location of locationsList) {
    const data = loadJSON(`${CMS_DIR}/location-${location.slug}.json`);
    check(`Location "${location.slug}" has content file`, data !== null);
  }

  // 5. Sector content files
  console.log('\n🏭 Sector Content Files:');
  for (const sector of sectorsList) {
    const data = loadJSON(`${CMS_DIR}/sector-${sector.slug}.json`);
    check(`Sector "${sector.slug}" has content file`, data !== null);
  }

  // 6. Combo pages
  console.log('\n🔗 Combo Pages:');
  let comboCount = 0;
  for (const service of servicesList) {
    for (const location of locationsList) {
      const path = `${CMS_DIR}/combo-${service.slug}-${location.slug}.json`;
      if (existsSync(path)) comboCount++;
    }
  }
  const expectedCombos = servicesList.length * locationsList.length;
  check(`Combo files: ${comboCount}/${expectedCombos}`, comboCount >= expectedCombos * 0.9, 'warn');

  // 7. Hub and static pages
  console.log('\n📃 Hub & Static Pages:');
  const pageFiles = [
    'hub-services.json', 'hub-locations.json', 'hub-sectors.json', 'hub-blog.json',
    'pages-nosotros.json', 'pages-contacto.json', 'pages-cotizacion.json',
    'pages-404.json', 'pages-privacidad.json', 'pages-terminos.json',
  ];
  for (const file of pageFiles) {
    check(file, existsSync(`${CMS_DIR}/${file}`));
  }

  // 8. Homepage content check
  console.log('\n🏠 Homepage Content:');
  const homepage = loadJSON(`${CMS_DIR}/homepage.json`);
  if (homepage) {
    check('Homepage has content.hero', !!homepage.content?.hero);
    check('Homepage has content.nosotros', !!homepage.content?.nosotros);
    check('Homepage has seo.title', !!homepage.seo?.title);
    check('Homepage has seo.description', !!homepage.seo?.description);
  }

  // 9. Content quality
  console.log('\n🔍 Content Quality:');
  const allFiles = readdirSync(CMS_DIR).filter(f => f.endsWith('.json'));
  let chineseChars = 0;
  let emptySections = 0;
  for (const file of allFiles) {
    const content = readFileSync(`${CMS_DIR}/${file}`, 'utf-8');
    if (/[\u4e00-\u9fff]/.test(content)) {
      console.log(`  ⚠️  Chinese characters in ${file}`);
      chineseChars++;
    }
  }
  check('No Chinese characters in any file', chineseChars === 0);

  // Summary
  console.log('\n' + '='.repeat(40));
  if (errors === 0 && warnings === 0) {
    console.log('✅ All validations passed!');
  } else {
    console.log(`❌ ${errors} error(s), ${warnings} warning(s)`);
  }

  process.exit(errors > 0 ? 1 : 0);
}

main();
