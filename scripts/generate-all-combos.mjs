/**
 * Generate All Combos - Genera las 126 combinaciones service×location
 * Ejecutar: node scripts/generate-all-combos.mjs
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

async function generateCombo(serviceSlug, locationSlug) {
  try {
    const res = await fetch(`${WORKER_URL}/api/sections/combo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceSlug, locationSlug })
    });
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function generateAllCombos() {
  console.log('🚀 Generando todas las combinaciones service×location...\n');

  // Obtener servicios y ubicaciones
  const services = await queryD1('SELECT slug, name FROM services');
  const locations = await queryD1('SELECT slug, name, zone FROM locations');

  const servicesList = services.results || [];
  const locationsList = locations.results || [];

  console.log(`📦 ${servicesList.length} servicios`);
  console.log(`📍 ${locationsList.length} ubicaciones`);
  console.log(`🎯 ${servicesList.length * locationsList.length} combos a generar\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const service of servicesList) {
    for (const location of locationsList) {
      const comboKey = `${service.slug} × ${location.slug}`;
      
      process.stdout.write(`  Generando: ${comboKey}... `);

      const result = await generateCombo(service.slug, location.slug);
      
      if (result.success) {
        console.log('✅');
        successCount++;
      } else {
        console.log(`❌ ${result.errors?.join(', ') || 'error'}`);
        errorCount++;
        errors.push(`${comboKey}: ${result.errors?.join(', ')}`);
      }

      // Pequeña pausa para no saturar el worker
      await new Promise(r => setTimeout(r, 100));
    }
  }

  console.log('\n✨ Generación completada!');
  console.log(`   ✅ Exitosos: ${successCount}`);
  console.log(`   ❌ Errores: ${errorCount}`);

  if (errors.length > 0) {
    console.log('\n⚠️ Errores encontrados:');
    errors.forEach(e => console.log(`   - ${e}`));
  }
}

generateAllCombos().catch(console.error);
