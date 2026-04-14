/**
 * Export D1 content to JSON files for Astro
 * SOLO actualiza metadata - NO toca description para evitar duplicación
 */

import { readFileSync, writeFileSync } from 'fs';

const WORKER_URL = 'https://guardman-agent.oficinadesarrollo33.workers.dev';

async function queryD1(sql) {
  const res = await fetch(`${WORKER_URL}/api/d1/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql })
  });
  return res.json();
}

async function exportContent() {
  console.log('🚀 Exporting SEO metadata to JSON files...\n');

  // Load existing services - NO los modify description
  const servicesPath = 'src/data/generated/services.json';
  const services = JSON.parse(readFileSync(servicesPath, 'utf-8'));

  // Get content from D1
  const serviceContent = await queryD1('SELECT * FROM service_content');
  const locationContent = await queryD1('SELECT * FROM location_content');
  const comboContent = await queryD1('SELECT * FROM combo_content');

  // Create content map
  const contentMap = new Map(
    serviceContent.results.map(c => [c.service_slug, c])
  );

  // Update ONLY metadata fields, keep original description intact
  for (const service of services) {
    const content = contentMap.get(service.slug);
    if (content) {
      // Update meta fields ONLY
      service.meta_title = content.seo_title;
      service.meta_description = content.meta_description;
      service.hero_heading = content.h1;
      service.hero_subtitle = content.hero_subtitle;
      
      // DO NOT change description - page layout uses features, process, etc. separately
      // The description field is just for schema/metadata, not for display
      
      console.log(`  Updated: ${service.slug}`);
    }
  }

  // Save services with updated metadata
  writeFileSync(servicesPath, JSON.stringify(services, null, 2));
  console.log(`\n✅ Updated ${services.length} services (metadata only)`);

  // Generate service pages JSON
  const servicePages = services.map(s => ({
    slug: s.slug,
    name: s.name,
    meta_title: s.meta_title || s.meta_title_override,
    meta_description: s.meta_description || s.meta_description_override,
    h1: s.hero_heading || s.name
  }));

  writeFileSync(
    'src/data/generated/service-pages.json',
    JSON.stringify(servicePages, null, 2)
  );
  console.log(`✅ Generated service-pages.json`);

  // Generate location pages
  const locationsPath = 'src/data/generated/locations.json';
  const locations = JSON.parse(readFileSync(locationsPath, 'utf-8'));
  
  const locContentMap = new Map(
    locationContent.results.map(c => [c.location_slug, c])
  );

  const locationPages = locations.map(l => {
    const content = locContentMap.get(l.slug);
    return {
      slug: l.slug,
      name: l.name,
      zone: l.zone,
      meta_title: content?.seo_title || `Seguridad Privada en ${l.name} | GuardMan`,
      meta_description: content?.meta_description || `Empresa líder con guardias OS-10 en ${l.name}`,
      h1: content?.h1 || `Seguridad Privada en ${l.name}`,
      intro: content?.intro_paragraph || '',
      landmarks: content ? JSON.parse(content.landmarks_json || '[]') : [],
      stats: content ? JSON.parse(content.stats_json || '{}') : {}
    };
  });

  writeFileSync(
    'src/data/generated/location-pages.json',
    JSON.stringify(locationPages, null, 2)
  );
  console.log(`✅ Generated location-pages.json`);

  // Generate combo pages
  const comboPages = [];
  for (const service of services.slice(0, 3)) {
    for (const location of locations) {
      const content = comboContent.results.find(
        c => c.service_slug === service.slug && c.location_slug === location.slug
      );
      comboPages.push({
        service: service.slug,
        location: location.slug,
        seo_title: content?.seo_title || `${service.name} en ${location.name} | GuardMan`,
        h1: content?.h1 || `${service.name} en ${location.name}`
      });
    }
  }

  writeFileSync(
    'src/data/generated/combo-pages.json',
    JSON.stringify(comboPages, null, 2)
  );
  console.log(`✅ Generated combo-pages.json (${comboPages.length} pages)`);

  // Update site-config
  const configPath = 'src/data/generated/site-config.json';
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  
  config.seo = {
    ...config.seo,
    keywords: serviceContent.results.length,
    totalPages: services.length + locations.length + comboPages.length,
    generatedAt: new Date().toISOString()
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✅ Updated site-config.json`);

  console.log('\n✨ Export complete!');
  console.log('   - Metadata updated (meta_title, meta_description, h1, hero_subtitle)');
  console.log('   - Description fields LEFT INTACT (layout uses features, process, FAQs separately)');
}

exportContent().catch(console.error);