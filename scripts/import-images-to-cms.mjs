/**
 * Import Images to CMS - Importa imágenes existentes al CMS
 * Ejecutar: node scripts/import-images-to-cms.mjs
 */

const WORKER_URL = 'https://guardman-agent.oficinadesarrollo33.workers.dev';

async function registerImage(image) {
  try {
    const res = await fetch(`${WORKER_URL}/api/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(image)
    });
    return res.json();
  } catch (error) {
    return { error: error.message };
  }
}

// Imágenes existentes del sitio
const IMAGES = [
  // Hero images
  {
    slug: 'hero-home',
    alt: 'GuardMan Chile - Seguridad Privada en Santiago',
    title: 'Hero Home',
    url: '/images/hero-home.webp',
    entity_type: 'page',
    entity_slug: 'home',
    format: 'webp',
    is_hero: true,
    is_featured: true,
    status: 'published',
    tags: ['hero', 'home', 'portada']
  },
  {
    slug: 'hero-nosotros',
    alt: 'Sobre GuardMan Chile',
    title: 'Nosotros Sección',
    url: '/images/nosotros_seccion.webp',
    entity_type: 'page',
    entity_slug: 'nosotros',
    format: 'webp',
    is_hero: true,
    status: 'published',
    tags: ['hero', 'nosotros']
  },

  // Client logos
  {
    slug: 'client-avanzapark',
    alt: 'Cliente Avanzapark',
    title: 'Avanzapark',
    url: '/images/client-avanzapark.webp',
    entity_type: 'generic',
    entity_slug: '',
    format: 'webp',
    is_featured: true,
    status: 'published',
    tags: ['cliente', 'logo']
  },
  {
    slug: 'client-courtyardmarriot',
    alt: 'Cliente Courtyard Marriott',
    title: 'Courtyard Marriott',
    url: '/images/client-courtyardmarriot.webp',
    entity_type: 'generic',
    entity_slug: '',
    format: 'webp',
    is_featured: true,
    status: 'published',
    tags: ['cliente', 'logo']
  },
  {
    slug: 'client-hamptons',
    alt: 'Cliente Hamptons',
    title: 'Hamptons',
    url: '/images/client-hamptons.webp',
    entity_type: 'generic',
    entity_slug: '',
    format: 'webp',
    is_featured: true,
    status: 'published',
    tags: ['cliente', 'logo']
  },
  {
    slug: 'client-kavak',
    alt: 'Cliente Kavak',
    title: 'Kavak',
    url: '/images/client-kavak.webp',
    entity_type: 'generic',
    entity_slug: '',
    format: 'webp',
    is_featured: true,
    status: 'published',
    tags: ['cliente', 'logo']
  },
  {
    slug: 'client-workcenter',
    alt: 'Cliente Work Center',
    title: 'Work Center',
    url: '/images/client-workcenter.webp',
    entity_type: 'generic',
    entity_slug: '',
    format: 'webp',
    is_featured: true,
    status: 'published',
    tags: ['cliente', 'logo']
  },

  // Ajax systems
  {
    slug: 'ajax-security-system',
    alt: 'Sistema de seguridad Ajax',
    title: 'Ajax Security System',
    url: '/images/Ajax-Security-system.webp',
    entity_type: 'generic',
    entity_slug: '',
    format: 'webp',
    status: 'published',
    tags: ['ajax', 'sistema', 'tecnologia']
  },
  {
    slug: 'ajax-systems-header',
    alt: 'Ajax Systems',
    title: 'Ajax Systems Header',
    url: '/images/Ajax-systems-header.jpg',
    entity_type: 'generic',
    entity_slug: '',
    format: 'jpg',
    status: 'published',
    tags: ['ajax', 'header']
  },
  {
    slug: 'banner-aktuslnosci-ajax',
    alt: 'Banner Ajax Security',
    title: 'Baner Aktuslnosci Ajax',
    url: '/images/Baner_Aktuslnosci_-AJAX.jpg',
    entity_type: 'generic',
    entity_slug: '',
    format: 'jpg',
    status: 'published',
    tags: ['ajax', 'banner']
  },
  {
    slug: 'less-effort',
    alt: 'Menor esfuerzo con Ajax',
    title: 'Less Effort',
    url: '/images/Less-Effort.jpg',
    entity_type: 'generic',
    entity_slug: '',
    format: 'jpg',
    status: 'published',
    tags: ['ajax', 'marketing']
  },

  // Certificaciones
  {
    slug: 'escudo-os10',
    alt: 'Certificación OS-10',
    title: 'Escudo OS-10',
    url: '/images/escudo-os10.webp',
    entity_type: 'generic',
    entity_slug: '',
    format: 'webp',
    is_featured: true,
    status: 'published',
    tags: ['certificacion', 'os10', 'calidad']
  },

  // Cobertura
  {
    slug: 'cobertura-zonas',
    alt: 'Cobertura de zonas GuardMan Chile',
    title: 'Cobertura Zonas',
    url: '/images/cobertura_zonas.png',
    entity_type: 'page',
    entity_slug: 'ubicaciones',
    format: 'png',
    status: 'published',
    tags: ['cobertura', 'mapa', 'zonas']
  },

  // Sectors
  {
    slug: 's4-thumbnail',
    alt: 'Sector Comercial y Eventos',
    title: 'Sector Thumbnail',
    url: '/images/s4-thumbnail.webp',
    entity_type: 'sector',
    entity_slug: 'comercial',
    format: 'webp',
    is_hero: true,
    status: 'published',
    tags: ['sector', 'comercial', 'eventos']
  },
  {
    slug: 'sector-industrial',
    alt: 'Sector Industrial y Construcción',
    title: 'Sector Industrial',
    url: '/images/sector-industrial.webp',
    entity_type: 'sector',
    entity_slug: 'industrial',
    format: 'webp',
    is_hero: true,
    status: 'published',
    tags: ['sector', 'industrial', 'construccion']
  },
  {
    slug: 'sector-residencial',
    alt: 'Sector Residencial',
    title: 'Sector Residencial',
    url: '/images/sector-residencial.webp',
    entity_type: 'sector',
    entity_slug: 'residencial',
    format: 'webp',
    is_hero: true,
    status: 'published',
    tags: ['sector', 'residencial']
  },

  // OG Images
  {
    slug: 'og-default',
    alt: 'Imagen por defecto para Open Graph',
    title: 'OG Default',
    url: '/images/og-default.png',
    entity_type: 'generic',
    entity_slug: '',
    format: 'png',
    status: 'published',
    tags: ['og', 'social', 'default']
  }
];

async function importImages() {
  console.log('🚀 Importando imágenes al CMS...\n');

  let successCount = 0;
  let updateCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const img of IMAGES) {
    process.stdout.write(`  Registrando: ${img.slug}... `);

    const result = await registerImage(img);

    if (result.success) {
      console.log('✅');
      successCount++;
    } else if (result.error === 'Slug already exists') {
      console.log('🔄 (ya existe)');
      updateCount++;
    } else {
      console.log(`❌ ${result.error}`);
      errorCount++;
      errors.push(`${img.slug}: ${result.error}`);
    }

    // Pequeña pausa
    await new Promise(r => setTimeout(r, 50));
  }

  console.log('\n✨ Importación completada!');
  console.log(`   ✅ Nuevas: ${successCount}`);
  console.log(`   🔄 Actualizadas: ${updateCount}`);
  console.log(`   ❌ Errores: ${errorCount}`);

  if (errors.length > 0) {
    console.log('\n⚠️ Errores:');
    errors.forEach(e => console.log(`   - ${e}`));
  }

  // Mostrar estadísticas
  console.log('\n📊 Estadísticas del CMS de imágenes:');
  const statsRes = await fetch(`${WORKER_URL}/api/images/stats`);
  const stats = await statsRes.json();
  console.log(JSON.stringify(stats, null, 2));
}

importImages().catch(console.error);
