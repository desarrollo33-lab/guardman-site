/**
 * Export Sections from D1 to JSON files
 * Runs after sections are generated in D1
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

async function exportAllSections() {
  console.log('🚀 Exporting D1 sections to JSON files...\n');

  // Get all services
  const services = await queryD1('SELECT slug, name, short_description, price_range, image, featured, sort FROM services ORDER BY sort');
  
  // Get all locations  
  const locations = await queryD1('SELECT slug, name, zone FROM locations ORDER BY sort');

  // Export service sections
  const servicesDir = 'src/data/cms';
  
  // Create directory
  const { mkdirSync, writeFileSync, existsSync } = await import('fs');
  if (!existsSync(servicesDir)) {
    mkdirSync(servicesDir, { recursive: true });
  }

  // Export each service with its sections
  const servicePages = [];
  for (const service of services.results || []) {
    console.log(`  Exporting service: ${service.slug}`);
    
    const sections = await getServiceSections(service.slug);
    
    const serviceData = {
      ...service,
      sections
    };
    
    writeFileSync(
      `${servicesDir}/${service.slug}.json`,
      JSON.stringify(serviceData, null, 2)
    );
    
    servicePages.push({
      slug: service.slug,
      name: service.name,
      hero: sections.hero
    });
  }
  
  console.log(`\n  Exported ${services.results?.length || 0} services`);

  // Export location sections
  const locationPages = [];
  for (const location of locations.results || []) {
    console.log(`  Exporting location: ${location.slug}`);
    
    const sections = await getLocationSections(location.slug);
    
    const locationData = {
      ...location,
      sections
    };
    
    writeFileSync(
      `${servicesDir}/location-${location.slug}.json`,
      JSON.stringify(locationData, null, 2)
    );
    
    locationPages.push({
      slug: location.slug,
      name: location.name,
      zone: location.zone,
      hero: sections.hero
    });
  }
  
  console.log(`  Exported ${locations.results?.length || 0} locations`);

  // Export index files
  writeFileSync(
    `${servicesDir}/services.json`,
    JSON.stringify(servicePages, null, 2)
  );
  
  writeFileSync(
    `${servicesDir}/locations.json`,
    JSON.stringify(locationPages, null, 2)
  );
  
  // Export site config
  const config = {
    lastExport: new Date().toISOString(),
    servicesCount: services.results?.length || 0,
    locationsCount: locations.results?.length || 0
  };
  
  writeFileSync(
    `${servicesDir}/config.json`,
    JSON.stringify(config, null, 2)
  );

  console.log('\n✨ Export complete!');
  console.log(`   Services: ${services.results?.length || 0}`);
  console.log(`   Locations: ${locations.results?.length || 0}`);
  console.log(`   Output: ${servicesDir}/`);
}

exportAllSections().catch(console.error);