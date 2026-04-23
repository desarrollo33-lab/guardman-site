/**
 * Export all CMS data to JSON - Exporta todos los datos desde D1 a JSON
 * Uso: node scripts/export-all.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const CMS_DIR = join(ROOT_DIR, 'src', 'data', 'cms');

// Ensure CMS directory exists
if (!existsSync(CMS_DIR)) {
  mkdirSync(CMS_DIR, { recursive: true });
}

const API_BASE = 'https://guardman-admin-panel.oficinadesarrollo33.workers.dev';
const AUTH_EMAIL = 'admin@guardman.cl';
const AUTH_PASSWORD = 'GuardMan2026!@#Admin';

async function login() {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: AUTH_EMAIL, password: AUTH_PASSWORD })
  });
  const data = await res.json();
  return data.data.token;
}

async function fetchAPI(endpoint, token) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  return data.data;
}

// Contenido de secciones por defecto
const SERVICE_SECTIONS_TEMPLATE = {
  'guardias-de-seguridad': {
    intro: {
      heading: '¿Por qué elegir Guardias de Seguridad?',
      paragraphs: [
        'En GuardMan Chile ofrecemos guardias de seguridad certificados OS-10 con experiencia comprobada. Nuestro equipo está respaldado por un centro de monitoreo propio que opera las 24 horas, garantizando una respuesta inmediata ante cualquier situación.',
        'Cada guardia recibe capacitación continua en prevención de robos, control de accesos, primeros auxilios y manejo de situaciones de emergencia. Además, coordinamos directamente con Carabineros de Chile para garantizar la seguridad de tu propiedad.'
      ]
    },
    features: {
      heading: '¿Qué incluye el servicio?',
      items: [
        'Guardias certificados OS-10 con formación continua',
        'Monitoreo 24/7 desde nuestro centro de control',
        'Control de accesos y registro de visitantes',
        'Rondas preventivas programadas',
        'Coordinación con Carabineros ante emergencias',
        'Reportes diarios de novedades y métricas',
        'Respuesta inmediata ante alarmas',
        'Cobertura en toda la Región Metropolitana'
      ]
    },
    issues: {
      heading: 'Problemas que solucionamos',
      items: [
        'Robos y hurtos en propiedades comerciales',
        'Acceso no autorizado a áreas restringidas',
        'Vandalismo y deterioro de infraestructura',
        'Necesidad de control perimetral efectivo',
        'Falta de personal de seguridad capacitado',
        'Coordinación lenta ante emergencias'
      ]
    },
    stats: {
      heading: 'Números que nos respaldan',
      items: [
        { label: 'Guardias activos', value: '500+' },
        { label: 'Propiedades protegidas', value: '400+' },
        { label: 'Años de experiencia', value: '8+' },
        { label: 'Comunas cobertura', value: '14' }
      ]
    },
    faqs: {
      heading: 'Preguntas Frecuentes',
      items: [
        {
          question: '¿Cuánto cuesta un guardia de seguridad?',
          answer: 'El precio depende del horario, nivel de riesgo y ubicación. Ofrecemos planes desde $450.000 mensuales por guardia básico. Solicita una cotización personalizada.'
        },
        {
          question: '¿Los guardias están certificados?',
          answer: 'Sí, todos nuestros guardias cuentan con certificación OS-10 vigente y reciben capacitación continua en prevención de delitos y manejo de emergencias.'
        },
        {
          question: '¿Pueden operar las 24 horas?',
          answer: 'Sí, ofrecemos servicio 24/7, 365 días al año. Nuestro centro de monitoreo supervisará constantemente la actividad.'
        }
      ]
    },
    cta: {
      heading: 'Protege tu propiedad hoy',
      subheading: 'Solicita una cotización personalizada',
      button: 'Solicitar Cotización'
    }
  },
  'cctv-videovigilancia': {
    intro: {
      heading: '¿Por qué elegir CCTV con GuardMan?',
      paragraphs: [
        'Somos distribuidores oficiales de Ajax Systems, lo que nos permite ofrecer sistemas de última generación con análisis de video con inteligencia artificial. Nuestras cámaras permiten detección de movimiento, reconocimiento facial y alertas en tiempo real.',
        'Todo el footage se almacena de forma segura en la nube y es accesible desde cualquier dispositivo. Además, nuestro centro de monitoreo puede visualizar las cámaras en vivo y responder ante eventos sospechosos.'
      ]
    },
    features: {
      heading: '¿Qué incluye el servicio?',
      items: [
        'Cámaras IP de alta definición (2K, 4K)',
        'Análisis de video con IA',
        'Monitoreo 24/7 desde nuestro centro',
        'Acceso remoto desde smartphone',
        'Detección de movimiento y personas',
        'Almacenamiento en la nube seguro',
        'Instalación profesional incluida',
        'Soporte técnico 24/7'
      ]
    },
    issues: {
      heading: 'Problemas que solucionamos',
      items: [
        'Robos por falta de supervisión visual',
        'Necesidad de evidencia grabada',
        'Acceso no autorizado sin registro',
        'Imposibilidad de monitoreo remoto',
        'Sistemas de cámaras obsoletos',
        'Falta de respuesta ante incidentes'
      ]
    },
    stats: {
      heading: 'Números que nos respaldan',
      items: [
        { label: 'Cámaras instaladas', value: '2,000+' },
        { label: 'Clientes activos', value: '300+' },
        { label: 'Años de experiencia', value: '8+' },
        { label: 'Uptime del sistema', value: '99.9%' }
      ]
    },
    faqs: {
      heading: 'Preguntas Frecuentes',
      items: [
        {
          question: '¿Pueden ver las cámaras desde mi celular?',
          answer: 'Sí, nuestra app permite visualizar todas las cámaras en vivo desde cualquier dispositivo. También recibirás notificaciones instantáneas ante eventos.'
        },
        {
          question: '¿Instalan las cámaras ustedes?',
          answer: 'Sí, ofrecemos instalación profesional incluida en todos nuestros planes. Nuestros técnicos certificado garantizan una ubicación óptima de las cámaras.'
        },
        {
          question: '¿Graban de noche también?',
          answer: 'Sí, todas nuestras cámaras tienen visión nocturna por infrarrojo y graban 24/7.'
        }
      ]
    },
    cta: {
      heading: 'Protege tu propiedad hoy',
      subheading: 'Solicita una cotización personalizada',
      button: 'Solicitar Cotización'
    }
  },
  'control-de-accesos': {
    intro: {
      heading: '¿Por qué elegir Control de Accesos?',
      paragraphs: [
        'Ofrecemos sistemas biométricos y RFID para control total de ingresos en empresas, condominos y edificios comerciales. Desde lectores de huella digital hasta reconocimiento facial, tenemos la solución perfecta para cada necesidad.',
        'Nuestro sistema permite crear schedules de acceso, generar reportes de entradas y salidas, y recibir alertas en tiempo real ante intentos de acceso no autorizados.'
      ]
    },
    features: {
      heading: '¿Qué incluye el servicio?',
      items: [
        'Lectores biométricos (huella, facial)',
        'Tarjetas RFID de proximidad',
        'Registro automático de ingresos',
        'Reportes de asistencia en tiempo real',
        'Alertas ante intentos no autorizados',
        'Integración con sistemas de alarma',
        'App de gestión para administradores',
        'Soporte técnico incluido'
      ]
    },
    issues: {
      heading: 'Problemas que solucionamos',
      items: [
        'Acceso no controlado a edificios',
        'Pérdida de llaves o tarjetas',
        'No saber quién entra y sale',
        'Acceso de personas no autorizadas',
        'Gestión manual de llaves inefficient',
        'Falta de trazabilidad de visitas'
      ]
    },
    stats: {
      heading: 'Números que nos respaldan',
      items: [
        { label: 'Puertas controladas', value: '1,500+' },
        { label: 'Empresas atendidas', value: '200+' },
        { label: 'Usuarios registrados', value: '50,000+' },
        { label: 'Años de experiencia', value: '8+' }
      ]
    },
    faqs: {
      heading: 'Preguntas Frecuentes',
      items: [
        {
          question: '¿Puedo ver quién entra desde mi celular?',
          answer: 'Sí, nuestra app muestra en tiempo real todos los ingresos y salidas, con foto del usuario y timestamp.'
        },
        {
          question: '¿Qué pasa si pierdo mi tarjeta?',
          answer: 'Puedes bloquear la tarjeta instantáneamente desde la app y reprogramar una nueva en minutos.'
        },
        {
          question: '¿Funciona sin internet?',
          answer: 'Sí, el sistema funciona offline y sincroniza cuando se restaura la conexión.'
        }
      ]
    },
    cta: {
      heading: 'Controla el acceso hoy',
      subheading: 'Solicita una cotización personalizada',
      button: 'Solicitar Cotización'
    }
  }
};

// Template para sectores
const SECTOR_SECTIONS_TEMPLATE = {
  intro: {
    heading: `¿Por qué elegir GuardMan para este sector?`,
    paragraphs: [
      `En GuardMan Chile comprendemos los desafíos únicos de seguridad que enfrenta este sector. ` +
      `Nuestro equipo de profesionales certificados OS-10 está preparado para brindar soluciones integrales adaptadas a tus necesidades específicas.`,
      `Contamos con años de experiencia protegiendo empresas del sector en toda la Región Metropolitana, ` +
      `desde pequeñas operaciones hasta grandes corporaciones.`
    ]
  },
  features: {
    heading: '¿Qué incluye nuestro servicio?',
    items: [
      'Guardias certificados OS-10',
      'Monitoreo 24/7 desde nuestro centro de control',
      'Control de accesos y registro de visitantes',
      'Rondas preventivas programadas',
      'Coordinación con Carabineros',
      'Reportes diarios de novedades'
    ]
  },
  issues: {
    heading: 'Problemas que solucionamos',
    items: [
      'Robos y hurtos',
      'Acceso no autorizado',
      'Vandalismo',
      'Falta de control perimetral',
      'Necesidad de documentar incidentes',
      'Coordinación lenta ante emergencias'
    ]
  },
  stats: {
    heading: 'Números que nos respaldan',
    items: [
      { label: 'Empresas protegidas', value: '200+' },
      { label: 'Guardias activos', value: '500+' },
      { label: 'Años de experiencia', value: '8+' },
      { label: 'Comunas cobertura', value: '14' }
    ]
  },
  faqs: {
    heading: 'Preguntas Frecuentes',
    items: [
      {
        question: '¿Cuánto cuesta la seguridad para este sector?',
        answer: 'El precio depende del tamaño, horarios y nivel de riesgo. Ofrecemos planes personalizados. Solicita una cotización gratuita.'
      },
      {
        question: '¿Pueden adaptar el servicio a nuestras necesidades?',
        answer: 'Sí, diseñamos soluciones a medida según los requerimientos específicos de cada cliente.'
      },
      {
        question: '¿Los guardias tienen experiencia en este sector?',
        answer: 'Sí, capacitamos constantemente a nuestro personal en los protocolos específicos de cada industria.'
      }
    ]
  },
  cta: {
    heading: `Protege tu negocio hoy`,
    subheading: 'Solicita una cotización personalizada',
    button: 'Solicitar Cotización'
  }
};

// Template para servicios específicos
const SERVICE_CONTENT_BY_SLUG = {
  'guardias-de-seguridad': { name: 'Guardias de Seguridad', price_range: '$$$' },
  'cctv-videovigilancia': { name: 'CCTV y Videovigilancia', price_range: '$$$$' },
  'control-de-accesos': { name: 'Control de Accesos', price_range: '$$$' },
  'escoltas-privados': { name: 'Escoltas Privados', price_range: '$$$$' },
  'monitoreo-24-7': { name: 'Monitoreo 24/7', price_range: '$$$' },
  'seguridad-eventos': { name: 'Seguridad para Eventos', price_range: '$$$' },
  'seguridad-industrial': { name: 'Seguridad Industrial', price_range: '$$$' },
  'auditoria-seguridad': { name: 'Auditoría de Seguridad', price_range: '$$$' },
  'guard-pod': { name: 'Guard Pod', price_range: '$$$' }
};

async function exportAll() {
  console.log('🔄 Exportando todos los datos desde D1...\n');
  
  try {
    const token = await login();
    console.log('✅ Autenticado');
    
    // Fetch all data
    const [services, locations, sectors, serviceSector] = await Promise.all([
      fetchAPI('/api/services', token),
      fetchAPI('/api/locations', token),
      fetchAPI('/api/sectors', token),
      fetchAPI('/api/service-sector', token)
    ]);
    
    console.log(`📦 Servicios: ${services.length}`);
    console.log(`📦 Ubicaciones: ${locations.length}`);
    console.log(`📦 Sectores: ${sectors.length}`);
    console.log(`📦 Relaciones: ${serviceSector.length}\n`);
    
    // 1. Export services.json
    const servicesList = services.map(s => ({
      slug: s.slug,
      name: s.name,
      short_description: s.short_description || '',
      price_range: s.price_range || SERVICE_CONTENT_BY_SLUG[s.slug]?.price_range || '$$$',
      status: s.status
    }));
    writeFileSync(join(CMS_DIR, 'services.json'), JSON.stringify(servicesList, null, 2));
    console.log('✅ services.json');
    
    // 2. Export locations.json
    const locationsList = locations.map(l => ({
      slug: l.slug,
      name: l.name,
      zone: l.zone,
      region: l.region || 'Metropolitana',
      status: l.status
    }));
    writeFileSync(join(CMS_DIR, 'locations.json'), JSON.stringify(locationsList, null, 2));
    console.log('✅ locations.json');
    
    // 3. Export sectors.json
    const sectorsList = sectors
      .filter(s => s.status === 'active')
      .map(s => ({
        slug: s.slug,
        name: s.name,
        description: s.description || '',
        icon: s.icon || 'building',
        hero: {
          heading: `Seguridad ${s.name}`,
          subheading: s.description || `Soluciones de seguridad para el sector ${s.name}`,
          cta_text: `Cotiza Seguridad ${s.name}`
        }
      }));
    writeFileSync(join(CMS_DIR, 'sectors.json'), JSON.stringify(sectorsList, null, 2));
    console.log('✅ sectors.json');
    
    // 4. Export service-sector relations
    const serviceSectorsMap = {};
    for (const rel of serviceSector) {
      if (!serviceSectorsMap[rel.service_slug]) {
        serviceSectorsMap[rel.service_slug] = [];
      }
      serviceSectorsMap[rel.service_slug].push(rel.sector_slug);
    }
    writeFileSync(join(CMS_DIR, 'service-sectors.json'), JSON.stringify(serviceSectorsMap, null, 2));
    console.log('✅ service-sectors.json');
    
    // 5. Export individual service JSON files con contenido completo
    for (const service of services) {
      const serviceTemplate = SERVICE_SECTIONS_TEMPLATE[service.slug];
      const defaultInfo = SERVICE_CONTENT_BY_SLUG[service.slug] || {};
      
      const serviceFile = {
        slug: service.slug,
        name: service.name || defaultInfo.name || service.slug,
        short_description: service.short_description || `Servicio de ${service.slug}`,
        price_range: service.price_range || defaultInfo.price_range || '$$$',
        sections: serviceTemplate || SERVICE_SECTIONS_TEMPLATE['guardias-de-seguridad'] // fallback
      };
      
      writeFileSync(join(CMS_DIR, `${service.slug}.json`), JSON.stringify(serviceFile, null, 2));
      console.log(`  ✅ ${service.slug}.json`);
    }
    
    // 6. Export individual sector JSON files con contenido completo
    for (const sector of sectors.filter(s => s.status === 'active')) {
      // Get services for this sector
      const sectorServices = serviceSector
        .filter(rel => rel.sector_slug === sector.slug)
        .map(rel => {
          const service = services.find(s => s.slug === rel.service_slug);
          return service ? {
            slug: service.slug,
            name: service.name,
            short_description: service.short_description || ''
          } : null;
        })
        .filter(Boolean);
      
      // Generar secciones personalizadas por sector
      const sectorFile = {
        slug: sector.slug,
        name: sector.name,
        description: sector.description || '',
        services: sectorServices,
        sections: {
          hero: {
            heading: `Seguridad ${sector.name}`,
            subheading: sector.description || `Soluciones de seguridad especializadas para el sector ${sector.name} en Santiago.`,
            cta_text: `Cotiza Seguridad ${sector.name}`
          },
          intro: {
            heading: `¿Por qué elegir GuardMan para ${sector.name}?`,
            paragraphs: [
              `En GuardMan Chile comprendemos los desafíos únicos de seguridad que enfrenta el sector ${sector.name.toLowerCase()}. ` +
              `Nuestro equipo de profesionales certificados OS-10 está preparado para brindar soluciones integrales adaptadas a tus necesidades específicas.`,
              `Contamos con años de experiencia protegiendo empresas del sector ${sector.name.toLowerCase()} en toda la Región Metropolitana.`
            ]
          },
          features: {
            heading: '¿Qué incluye nuestro servicio?',
            items: [
              'Guardias certificados OS-10',
              'Monitoreo 24/7 desde nuestro centro de control',
              'Control de accesos y registro de visitantes',
              'Rondas preventivas programadas',
              'Coordinación con Carabineros',
              'Reportes diarios de novedades'
            ]
          },
          issues: {
            heading: 'Problemas que solucionamos',
            items: [
              'Robos y hurtos',
              'Acceso no autorizado',
              'Vandalismo',
              'Falta de control perimetral',
              'Necesidad de documentar incidentes',
              'Coordinación lenta ante emergencias'
            ]
          },
          stats: {
            heading: 'Números que nos respaldan',
            items: [
              { label: 'Empresas protegidas', value: '200+' },
              { label: 'Guardias activos', value: '500+' },
              { label: 'Años de experiencia', value: '8+' },
              { label: 'Comunas cobertura', value: '14' }
            ]
          },
          faqs: {
            heading: 'Preguntas Frecuentes',
            items: [
              {
                question: `¿Cuánto cuesta la seguridad para ${sector.name.toLowerCase()}?`,
                answer: 'El precio depende del tamaño, horarios y nivel de riesgo. Ofrecemos planes personalizados. Solicita una cotización gratuita.'
              },
              {
                question: '¿Pueden adaptar el servicio a nuestras necesidades?',
                answer: 'Sí, diseñamos soluciones a medida según los requerimientos específicos de cada cliente.'
              },
              {
                question: '¿Los guardias tienen experiencia en este sector?',
                answer: 'Sí, capacitamos constantemente a nuestro personal en los protocolos específicos de cada industria.'
              }
            ]
          },
          cta: {
            heading: `Protege tu ${sector.name.toLowerCase()} hoy`,
            subheading: 'Solicita una cotización personalizada',
            button: 'Solicitar Cotización'
          }
        }
      };
      
      writeFileSync(join(CMS_DIR, `sector-${sector.slug}.json`), JSON.stringify(sectorFile, null, 2));
      console.log(`  ✅ sector-${sector.slug}.json (${sectorServices.length} servicios)`);
    }
    
    console.log('\n✨ Exportación completada!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

exportAll();
