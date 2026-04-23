/**
 * Generate Combo Content - Crea contenido específico para service × location
 * Genera JSON para los combos más importantes
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const CMS_DIR = join(ROOT_DIR, 'src', 'data', 'cms');

// All locations (todas las comunas con status completed)
const ALL_LOCATIONS = [
  { slug: 'santiago-centro', name: 'Santiago Centro', zone: 'Centro' },
  { slug: 'huechuraba', name: 'Huechuraba', zone: 'Norte' },
  { slug: 'lampa', name: 'Lampa', zone: 'Norte' },
  { slug: 'quilicura', name: 'Quilicura', zone: 'Norte' },
  { slug: 'la-reina', name: 'La Reina', zone: 'Oriente' },
  { slug: 'las-condes', name: 'Las Condes', zone: 'Oriente' },
  { slug: 'lo-barnechea', name: 'Lo Barnechea', zone: 'Oriente' },
  { slug: 'vitacura', name: 'Vitacura', zone: 'Oriente' },
  { slug: 'conchali', name: 'Conchalí', zone: 'Poniente' },
  { slug: 'pudahuel', name: 'Pudahuel', zone: 'Poniente' },
  { slug: 'renca', name: 'Renca', zone: 'Poniente' },
  { slug: 'la-pintana', name: 'La Pintana', zone: 'Sur' },
  { slug: 'los-andes', name: 'Los Andes', zone: 'Valparaíso' },
  { slug: 'san-felipe', name: 'San Felipe', zone: 'Valparaíso' },
];

// All services (todos los servicios del CMS)
const ALL_SERVICES = [
  { slug: 'guardias-de-seguridad', name: 'Guardias de Seguridad' },
  { slug: 'cctv-videovigilancia', name: 'CCTV y Videovigilancia' },
  { slug: 'auditoria-seguridad', name: 'Auditoría de Seguridad' },
  { slug: 'monitoreo-24-7', name: 'Monitoreo 24/7' },
  { slug: 'control-de-accesos', name: 'Control de Accesos' },
  { slug: 'escoltas-privados', name: 'Escoltas Privados' },
  { slug: 'guard-pod', name: 'Guard Pod' },
  { slug: 'seguridad-industrial', name: 'Seguridad Industrial' },
  { slug: 'seguridad-eventos', name: 'Seguridad para Eventos' },
];

// Zone context for all locations
const ZONE_CONTEXT = {
  // Oriente
  'las-condes': {
    zone: 'Oriente',
    challenges: 'residencias de lujo, embajadas, oficinas corporativas y centros comerciales',
    needs: 'control de accesos VIP, escoltas personales, monitoreo perimetral y CCTV de alta definición',
  },
  'vitacura': {
    zone: 'Oriente',
    challenges: 'casas de alto valor, clínicas privadas y oficinas ejecutivas',
    needs: 'vigilancia residencial de lujo, monitoreo perimetral, control de accesos biométrico y respuesta rápida',
  },
  'la-reina': {
    zone: 'Oriente',
    challenges: 'viviendas residenciales, schools and oficinas pequeñas',
    needs: 'rondas preventivas, control de acceso residencial y monitoreo perimetral',
  },
  'lo-barnechea': {
    zone: 'Oriente',
    challenges: 'condominios de lujo, vineyards y propiedades rurales',
    needs: 'vigilancia perimetral, control vehicular y respuestas de emergencia',
  },
  // Centro
  'santiago-centro': {
    zone: 'Centro',
    challenges: 'bancos, oficinas públicas, hoteles, retail y centros comerciales',
    needs: 'control de flujos de personas, seguridad para eventos, CCTV comercial y guardias experimentados',
  },
  // Norte
  'huechuraba': {
    zone: 'Norte',
    challenges: 'centros comerciales, malls and oficinas corporativas',
    needs: 'seguridad comercial, control de accesos y monitoreo CCTV',
  },
  'quilicura': {
    zone: 'Norte',
    challenges: 'industrias, bodegas y centros logísticos',
    needs: 'vigilancia perimetral, control vehicular y seguridad industrial',
  },
  'lampa': {
    zone: 'Norte',
    challenges: 'parques industriales y terrenos de expansión',
    needs: 'vigilancia perimetral, control de accesos y rondas programadas',
  },
  // Poniente
  'conchali': {
    zone: 'Poniente',
    challenges: 'establecimientos comerciales y residenciales',
    needs: 'rondas preventivas, control vecinal y coordinación comunitaria',
  },
  'pudahuel': {
    zone: 'Poniente',
    challenges: 'cercanías del aeropuerto, hoteles y negocios',
    needs: 'seguridad hotelera, control vehicular y respuesta rápida',
  },
  'renca': {
    zone: 'Poniente',
    challenges: 'empresas industriales y residenciales',
    needs: 'vigilancia industrial, control perimetral y rondas preventivas',
  },
  // Sur
  'la-pintana': {
    zone: 'Sur',
    challenges: 'residencial y pequeños comercios',
    needs: 'rondas preventivas, control vecinal y coordinación con Carabineros',
  },
  // Valparaíso
  'los-andes': {
    zone: 'Valparaíso',
    challenges: 'centros urbanos y zonas turísticas',
    needs: 'vigilancia turística, seguridad comercial y control de eventos',
  },
  'san-felipe': {
    zone: 'Valparaíso',
    challenges: 'comercios, servicios y zonas residenciales',
    needs: 'seguridad comercial, control de accesos y rondas preventivas',
  },
};

// Zone text variations
const ZONE_TEXT = {
  'las-condes': 'el sector oriente de Santiago',
  'santiago-centro': 'el centro de Santiago',
  'vitacura': 'el sector oriente premium',
  'la-reina': 'el sector oriente de Santiago',
  'lo-barnechea': 'el sector oriente de Santiago',
  'huechuraba': 'el sector norte de Santiago',
  'quilicura': 'el sector norte de Santiago',
  'lampa': 'el sector norte de Santiago',
  'conchali': 'el sector poniente de Santiago',
  'pudahuel': 'el sector poniente de Santiago',
  'renca': 'el sector poniente de Santiago',
  'la-pintana': 'el sector sur de Santiago',
  'los-andes': 'Los Andes y la zona de Valparaíso',
  'san-felipe': 'San Felipe y la zona de Valparaíso',
};

function generateComboContent(serviceSlug, serviceName, locationSlug, locationName) {
  const locCtx = ZONE_CONTEXT[locationSlug] || { zone: 'Otro', challenges: 'diversas propiedades', needs: 'soluciones de seguridad adaptadas' };
  const zoneText = ZONE_TEXT[locationSlug] || locationName;

  return {
    slug: `${serviceSlug}-${locationSlug}`,
    service_slug: serviceSlug,
    location_slug: locationSlug,
    service_name: serviceName,
    location_name: locationName,
    zone: locCtx.zone,
    sections: {
      hero: {
        heading: `${serviceName} en ${locationName}`,
        subheading: `Servicio profesional con guardias OS-10 certificados y monitoreo 24/7 en ${zoneText}.`,
      },
      intro: {
        heading: `¿Por qué elegir ${serviceName} en ${locationName}?`,
        paragraphs: [
          `En GuardMan Chile somos especialistas en ${serviceName.toLowerCase()} en ${locationName}. Nuestra experiencia en ${zoneText} nos permite ofrecer soluciones adaptadas a las necesidades específicas de la zona, ya sea para empresas, residencias o eventos.`,
          `Contamos con guardias certificados OS-10, monitoreo propio 24/7 y tiempos de respuesta inferiores a 30 minutos en ${locationName} y toda la zona ${locCtx.zone}.`,
        ],
      },
      issues: {
        heading: `Desafíos de seguridad en ${locationName}`,
        items: [
          `${locCtx.challenges} requieren soluciones especializadas que van más allá de la vigilancia básica.`,
          `La necesidad de ${locCtx.needs} es cada vez más urgente en ${zoneText}.`,
          ` muchas empresas y residencias en ${locationName} enfrentan riesgos específicos de seguridad que no se resuelven con guardias genéricos.`,
        ],
      },
      stats: {
        heading: `Números en ${locationName}`,
        items: [
          { label: 'Tiempo de respuesta en ' + locCtx.zone, value: '< 30 min' },
          { label: 'Cobertura', value: locCtx.zone },
          { label: 'Guardias OS-10', value: 'Disponibles' },
        ],
      },
      cta: {
        heading: `Protege tu propiedad en ${locationName}`,
        subheading: `Solicita una cotización sin compromiso. Evaluamos tu caso y te entregamos una propuesta personalizada.`,
        button: 'Cotizar en ' + locationName,
      },
      meta: {
        title: `${serviceName} en ${locationName} | GuardMan Chile`,
        description: `Servicio de ${serviceName.toLowerCase()} profesional en ${locationName}. Guardias OS-10, monitoreo 24/7. Cotiza ahora.`,
      },
    },
  };
}

async function main() {
  console.log('🔄 Generando contenido para combos...\n');

  // Ensure CMS directory exists
  if (!existsSync(CMS_DIR)) {
    mkdirSync(CMS_DIR, { recursive: true });
  }

  let generated = 0;

  for (const service of ALL_SERVICES) {
    for (const location of ALL_LOCATIONS) {
      const combo = generateComboContent(service.slug, service.name, location.slug, location.name);

      const filename = `combo-${service.slug}-${location.slug}.json`;
      writeFileSync(
        join(CMS_DIR, filename),
        JSON.stringify(combo, null, 2)
      );

      console.log(`  ✅ combo-${service.slug}-${location.slug}.json`);
      generated++;
    }
  }

  console.log(`\n✨ Generados ${generated} combos (${ALL_SERVICES.length} servicios × ${ALL_LOCATIONS.length} ubicaciones)`);
  console.log('   Ubicaciones:', ALL_LOCATIONS.map(l => l.name).join(', '));
  console.log('   Servicios:', ALL_SERVICES.map(s => s.name).join(', '));
}

main();
