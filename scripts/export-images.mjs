/**
 * Export Images from D1 to JSON file
 * Ejecutar: node scripts/export-images.mjs
 */

const WORKER_URL = 'https://guardman-agent.oficinadesarrollo33.workers.dev';

async function queryAPI(endpoint) {
  const res = await fetch(`${WORKER_URL}${endpoint}`);
  return res.json();
}

async function exportImages() {
  console.log('🚀 Exportando imágenes del CMS a JSON...\n');

  // Get all images
  const images = await queryAPI('/api/images?limit=100');
  
  // Get stats
  const stats = await queryAPI('/api/images/stats');

  // Create directory
  const { mkdirSync, writeFileSync, existsSync } = await import('fs');
  const imagesDir = 'src/data/cms';
  if (!existsSync(imagesDir)) {
    mkdirSync(imagesDir, { recursive: true });
  }

  // Organize images by entity type and slug
  const organized = {
    all: images.images || [],
    byEntityType: {},
    heroes: [],
    featured: []
  };

  for (const img of images.images || []) {
    // By entity type
    if (!organized.byEntityType[img.entity_type]) {
      organized.byEntityType[img.entity_type] = [];
    }
    organized.byEntityType[img.entity_type].push(img);

    // Heroes
    if (img.is_hero) {
      organized.heroes.push(img);
    }

    // Featured
    if (img.is_featured) {
      organized.featured.push(img);
    }
  }

  // Write main images file
  const imagesData = {
    lastExport: new Date().toISOString(),
    total: images.images?.length || 0,
    images: images.images || [],
    stats: stats.stats || [],
    organized
  };

  writeFileSync(
    `${imagesDir}/images.json`,
    JSON.stringify(imagesData, null, 2)
  );

  console.log(`✨ Export complete!`);
  console.log(`   Total imágenes: ${images.images?.length || 0}`);
  console.log(`   Héroes: ${organized.heroes.length}`);
  console.log(`   Destacadas: ${organized.featured.length}`);
  console.log(`   Output: ${imagesDir}/images.json`);

  // Write per-entity type files for quick access
  for (const [entityType, imgs] of Object.entries(organized.byEntityType)) {
    writeFileSync(
      `${imagesDir}/images-${entityType}.json`,
      JSON.stringify(imgs, null, 2)
    );
    console.log(`   Written: ${imagesDir}/images-${entityType}.json (${imgs.length} imágenes)`);
  }
}

exportImages().catch(console.error);
