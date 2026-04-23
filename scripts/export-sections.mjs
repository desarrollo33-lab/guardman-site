/**
 * Export All CMS Content to JSON files
 * Ejecutar después de regenerar contenido: node scripts/export-sections.mjs
 */

const WORKER_URL = 'https://guardman-agent.oficinadesarrollo33.workers.dev';

async function queryD1(sql) {
  const res = await fetch(`${WORKER_URL}/api/d1/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql })
  });
  return res.json();
}

async function getServiceSections(slug) {
  const res = await fetch(`${WORKER_URL}/api/sections/service/${slug}`);
  const data = await res.json();
  return data.sections || {};
}

async function getLocationSections(slug) {
  const res = await fetch(`${WORKER_URL}/api/sections/location/${slug}`);
  const data = await res.json();
  return data.sections || {};
}

async function getSectorSections(slug) {
  const res = await fetch(`${WORKER_URL}/api/sections/sector/${slug}`);
  const data = await res.json();
  return data.sections || {};
}

async function exportAllSections() {
  console.log('🚀 Exporting all CMS content to JSON files...\n');

  const { mkdirSync, writeFileSync, existsSync, readdirSync } = await import('fs');
  const CMS_DIR = 'src/data/cms';
  
  if (!existsSync(CMS_DIR)) {
    mkdirSync(CMS_DIR, { recursive: true });
  }

  // Get all services
  const services = await queryD1('SELECT slug, name, short_description, price_range FROM services');
  const servicesList = services.results || [];

  // Get all locations  
  const locations = await queryD1('SELECT slug, name, zone FROM locations');
  const locationsList = locations.results || [];

  // Get all sectors
  const sectors = await queryD1('SELECT slug, name FROM sectors');
  const sectorsList = sectors.results || [];

  // Export each service with its sections
  console.log('📦 Exporting services...');
  const servicePages = [];
  for (const service of servicesList) {
    console.log(`  - ${service.slug}`);
    
    const sections = await getServiceSections(service.slug);
    
    const serviceData = {
      ...service,
      sections
    };
    
    writeFileSync(
      `${CMS_DIR}/${service.slug}.json`,
      JSON.stringify(serviceData, null, 2)
    );
    
    servicePages.push({
      slug: service.slug,
      name: service.name,
      hero: sections.hero
    });
  }
  console.log(`  ✅ ${servicesList.length} services exported\n`);

  // Export location sections
  console.log('📍 Exporting locations...');
  const locationPages = [];
  for (const location of locationsList) {
    console.log(`  - ${location.slug}`);
    
    const sections = await getLocationSections(location.slug);
    
    const locationData = {
      ...location,
      sections
    };
    
    writeFileSync(
      `${CMS_DIR}/location-${location.slug}.json`,
      JSON.stringify(locationData, null, 2)
    );
    
    locationPages.push({
      slug: location.slug,
      name: location.name,
      zone: location.zone,
      hero: sections.hero
    });
  }
  console.log(`  ✅ ${locationsList.length} locations exported\n`);

  // Export sector sections
  console.log('🏢 Exporting sectors...');
  const sectorPages = [];
  for (const sector of sectorsList) {
    console.log(`  - ${sector.slug}`);
    
    const sections = await getSectorSections(sector.slug);
    
    const sectorData = {
      ...sector,
      sections
    };
    
    writeFileSync(
      `${CMS_DIR}/sector-${sector.slug}.json`,
      JSON.stringify(sectorData, null, 2)
    );
    
    sectorPages.push({
      slug: sector.slug,
      name: sector.name,
      hero: sections.hero
    });
  }
  console.log(`  ✅ ${sectorsList.length} sectors exported\n`);

  // Export index files
  writeFileSync(`${CMS_DIR}/services.json`, JSON.stringify(servicePages, null, 2));
  writeFileSync(`${CMS_DIR}/locations.json`, JSON.stringify(locationPages, null, 2));
  writeFileSync(`${CMS_DIR}/sectors.json`, JSON.stringify(sectorPages, null, 2));

  // Export site config
  const config = {
    lastExport: new Date().toISOString(),
    servicesCount: servicesList.length,
    locationsCount: locationsList.length,
    sectorsCount: sectorsList.length,
    combosCount: servicesList.length * locationsList.length
  };
  
  writeFileSync(`${CMS_DIR}/config.json`, JSON.stringify(config, null, 2));

  console.log('✨ Export complete!');
  console.log(`   Services: ${servicesList.length}`);
  console.log(`   Locations: ${locationsList.length}`);
  console.log(`   Sectors: ${sectorsList.length}`);
  console.log(`   Combos: ${servicesList.length * locationsList.length}`);
  console.log(`   Output: ${CMS_DIR}/`);
}

exportAllSections().catch(console.error);
