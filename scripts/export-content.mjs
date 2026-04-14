/**
 * Export D1 content to JSON files for Astro
 * Runs after research and generation complete
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';

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
  console.log('🚀 Exporting D1 content to JSON files...\n');

  // Load existing services
  const servicesPath = 'src/data/generated/services.json';
  const services = JSON.parse(readFileSync(servicesPath, 'utf-8'));

  // Get content from D1
  const serviceContent = await queryD1('SELECT * FROM service_content');
  const locationContent = await queryD1('SELECT * FROM location_content');
  const comboContent = await queryD1('SELECT * FROM combo_content');

  // Enrich services with generated content
  const contentMap = new Map(
    serviceContent.results.map(c => [c.service_slug, c])
  );

  for (const service of services) {
    const content = contentMap.get(service.slug);
    if (content) {
      // Update meta fields
      service.meta_title = content.seo_title;
      service.meta_description = content.meta_description;
      service.hero_heading = content.h1;
      service.hero_subtitle = content.hero_subtitle;
      
      // Update description with generated content
      service.description = `${content.intro_paragraph}

## Características del Servicio

${(JSON.parse(content.features_json) || []).map(f => `- ${f}`).join('\n')}

## Proceso de Trabajo

${(JSON.parse(content.process_json) || []).map(p => `### ${p.step}\n${p.description}`).join('\n\n')}

## Preguntas Frecuentes

${(JSON.parse(content.common_issues_json) || []).map(i => `- ${i}`).join('\n')}

${(JSON.parse(content.stats_json) || []).map(s => `- **${s.label}**: ${s.value}`).join('\n\n')}

${service.faqs?.map(f => `### ${f.question}\n${f.answer}`).join('\n\n') || ''}

## Cotiza ${service.name}

${content.cta_text}`;
    }
  }

  // Save enriched services
  writeFileSync(servicesPath, JSON.stringify(services, null, 2));
  console.log(`✅ Updated ${services.length} services`);

  // Generate service pages JSON for static generation
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

  // Generate combo pages (service × location)
  const comboPages = [];
  for (const service of services.slice(0, 3)) { // Top 3 services for demo
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

  // Update site-config with SEO stats
  const configPath = 'src/data/generated/site-config.json';
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  
  config.seo = {
    ...config.seo,
    keywords: serviceContent.results.length + locationContent.results.length + comboContent.results.length,
    totalPages: services.length + locations.length + comboPages.length,
    generatedAt: new Date().toISOString()
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✅ Updated site-config.json`);

  console.log('\n✨ Export complete!');
  console.log(`   Services: ${services.length}`);
  console.log(`   Locations: ${locations.length}`);
  console.log(`   Combo pages: ${comboPages.length}`);
  console.log(`   Total pages: ${services.length + locations.length + comboPages.length}`);
}

exportContent().catch(console.error);