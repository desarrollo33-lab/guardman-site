/**
 * Generate Handler - Genera contenido SEO desde D1 data
 * Versión simple que usa datos existentes
 */

import type { Env } from '../index';

/**
 * Generate contenido para una entidad
 */
export async function handleGenerate(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  if (request.method === 'GET') {
    const services = await env.DB.prepare(`
      SELECT slug, status FROM services WHERE status IN ('generating', 'completed')
    `).all();

    const locations = await env.DB.prepare(`
      SELECT slug, status FROM locations WHERE status IN ('generating', 'completed')
    `).all();

    return Response.json({
      services: services.results,
      locations: locations.results
    });
  }

  if (request.method === 'POST') {
    const { type, slug, locationSlug } = await request.json();

    if (!type || !slug) {
      return Response.json({ error: 'type and slug required' }, { status: 400 });
    }

    let result;

    if (type === 'service') {
      result = await generateServiceContent(slug, env);
    } else if (type === 'location') {
      result = await generateLocationContent(slug, env);
    } else if (type === 'combo') {
      result = await generateComboContent(slug, locationSlug, env);
    } else {
      return Response.json({ error: 'Invalid type' }, { status: 400 });
    }

    return Response.json(result);
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

async function generateServiceContent(serviceSlug: string, env: Env): Promise<any> {
  try {
    // Get service data
    const service = await env.DB.prepare(
      `SELECT * FROM services WHERE slug = ?`
    ).bind(serviceSlug).first() as any;

    if (!service) {
      return { success: false, errors: ['Service not found'] };
    }

    // Get easy keywords
    const keywords = await env.DB.prepare(`
      SELECT keyword, sds_score FROM keywords 
      WHERE service_slug = ? AND is_easy_win = 1
      ORDER BY sds_score LIMIT 5
    `).bind(serviceSlug).all() as any;

    // Get top competitors
    const competitors = await env.DB.prepare(`
      SELECT domain, site_type FROM competitors 
      WHERE service_slug = ? AND is_guardman = 0
      GROUP BY domain ORDER BY COUNT(*) DESC LIMIT 5
    `).bind(serviceSlug).all() as any;

    // Generate content based on data
    const easyKeywords = (keywords.results || []).map((k: any) => k.keyword).join(', ');
    const topCompetitors = (competitors.results || []).map((c: any) => c.domain).join(', ');

    const content = {
      seo_title: `${service.name} en Chile | GuardMan Chile`,
      meta_description: `Empresa líder con más de 500 guardias certificados OS-10. ${service.name} disponible 24/7 en toda la Región Metropolitana. Solicita cotización gratis.`,
      h1: service.name,
      hero_subtitle: `Protección profesional con guardias certificados y respaldo de centro de monitoreo propio`,
      intro_paragraph: generateIntro(service.name, easyKeywords),
      features: generateFeatures(service.name),
      process: generateProcess(service.name),
      common_issues: generateCommonIssues(service.name),
      faqs: generateFAQs(service.name),
      stats: [
        { label: 'Guardias activos', value: '500+' },
        { label: 'Años experiencia', value: '8+' },
        { label: 'Comunas cobertura', value: '14+' }
      ],
      cta_text: `Cotiza ${service.name} hoy`
    };

    // Save to D1
    await env.DB.prepare(`
      INSERT OR REPLACE INTO service_content
      (service_slug, seo_title, meta_description, h1, hero_subtitle, intro_paragraph,
       features_json, process_json, common_issues_json, stats_json, status, word_count, generated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'review', ?, datetime('now'))
    `).bind(
      serviceSlug,
      content.seo_title,
      content.meta_description,
      content.h1,
      content.hero_subtitle,
      content.intro_paragraph,
      JSON.stringify(content.features),
      JSON.stringify(content.process),
      JSON.stringify(content.common_issues),
      JSON.stringify(content.stats),
      content.intro_paragraph.length + content.features.join('').length
    ).run();

    // Update service status
    await env.DB.prepare(`
      UPDATE services SET status = 'completed', updated_at = datetime('now') WHERE slug = ?
    `).bind(serviceSlug).run();

    return { success: true, entityType: 'service', entitySlug: serviceSlug, content, saved: true };

  } catch (err: any) {
    return { success: false, errors: [err.message] };
  }
}

async function generateLocationContent(locationSlug: string, env: Env): Promise<any> {
  try {
    const location = await env.DB.prepare(
      `SELECT * FROM locations WHERE slug = ?`
    ).bind(locationSlug).first() as any;

    if (!location) {
      return { success: false, errors: ['Location not found'] };
    }

    const content = {
      seo_title: `Seguridad Privada en ${location.name} | GuardMan Chile`,
      meta_description: `Empresa líder con guardias OS-10 en ${location.name}. Cobertura 24/7, centros comerciales, edificios y residencias. Cotiza gratis.`,
      h1: `Seguridad Privada en ${location.name}`,
      intro_paragraph: generateLocationIntro(location.name, location.zone),
      why_this_zone: generateWhyZone(location.name, location.zone),
      landmarks: generateLandmarks(location.name),
      neighborhoods: generateNeighborhoods(location.name),
      stats: generateLocationStats(location.name),
      common_issues: generateLocationIssues(location.name),
      faqs: generateLocationFAQs(location.name),
      cta_text: `Protege tu propiedad en ${location.name}`
    };

    await env.DB.prepare(`
      INSERT OR REPLACE INTO location_content
      (location_slug, seo_title, meta_description, h1, intro_paragraph,
       why_this_zone, landmarks_json, neighborhoods_json, stats_json, 
       status, word_count, generated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'review', ?, datetime('now'))
    `).bind(
      locationSlug,
      content.seo_title,
      content.meta_description,
      content.h1,
      content.intro_paragraph,
      content.why_this_zone,
      JSON.stringify(content.landmarks),
      JSON.stringify(content.neighborhoods),
      JSON.stringify(content.stats),
      content.intro_paragraph.length
    ).run();

    await env.DB.prepare(`
      UPDATE locations SET status = 'completed', updated_at = datetime('now') WHERE slug = ?
    `).bind(locationSlug).run();

    return { success: true, entityType: 'location', entitySlug: locationSlug, content, saved: true };

  } catch (err: any) {
    return { success: false, errors: [err.message] };
  }
}

async function generateComboContent(serviceSlug: string, locationSlug: string, env: Env): Promise<any> {
  try {
    const [service, location] = await Promise.all([
      env.DB.prepare(`SELECT name FROM services WHERE slug = ?`).bind(serviceSlug).first() as any,
      env.DB.prepare(`SELECT name, zone FROM locations WHERE slug = ?`).bind(locationSlug).first() as any
    ]);

    if (!service || !location) {
      return { success: false, errors: ['Service or location not found'] };
    }

    const content = {
      seo_title: `${service.name} en ${location.name} | GuardMan`,
      meta_description: `${service.name} en ${location.name} con guardias certificados OS-10. Disponible 24/7. Cotiza ahora.`,
      h1: `${service.name} en ${location.name}`,
      intro_paragraph: generateComboIntro(service.name, location.name),
      local_context: generateLocalContext(service.name, location.name, location.zone),
      service_in_location: generateServiceInLocation(service.name, location.name),
      faqs: generateComboFAQs(service.name, location.name),
      cta_text: `Cotiza ${service.name} en ${location.name}`,
      cta_button: 'Solicitar Cotización Gratis'
    };

    await env.DB.prepare(`
      INSERT OR REPLACE INTO combo_content
      (service_slug, location_slug, seo_title, meta_description, h1, 
       intro_paragraph, local_context, service_in_location, cta_text, cta_button,
       status, word_count, generated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'review', ?, datetime('now'))
    `).bind(
      serviceSlug,
      locationSlug,
      content.seo_title,
      content.meta_description,
      content.h1,
      content.intro_paragraph,
      content.local_context,
      content.service_in_location,
      content.cta_text,
      content.cta_button,
      content.intro_paragraph.length
    ).run();

    return { success: true, entityType: 'combo', entitySlug: `${serviceSlug}/${locationSlug}`, content, saved: true };

  } catch (err: any) {
    return { success: false, errors: [err.message] };
  }
}

// Content generators
function generateIntro(serviceName: string, keywords: string): string {
  return `En GuardMan Chile somos líderes en ${serviceName.toLowerCase()} en Santiago. Con más de 8 años de experiencia y más de 500 guardias certificados OS-10, ofrecemos soluciones integrales de seguridad para empresas, condominos y residencias particulares.

Nuestro enfoque se basa en la prevención. Lejos de reaccionar ante incidentes, trabajamos para que nunca ocurran. La presencia visible de nuestros guardias uniformados genera una sensación de tranquilidad que permite el desarrollo normal de las actividades diarias.

Contamos con centro de monitoreo propio operate 24/7, lo que nos permite coordinar acciones inmediatas cuando se detecta cualquier anomalía. Esta sinergia entre el personal en terreno y la tecnología eleva sustancialmente la capacidad preventiva de nuestro servicio.

Operamos bajo estricto cumplimiento de la Ley 21.659 de Seguridad Privada, garantizando que todo nuestro personal cuenta con los certificados y habilitaciones requeridos por la normativa chilena.`;
}

function generateFeatures(serviceName: string): string[] {
  return [
    'Personal con certificación OS-10 vigente',
    'Disponibles 24 horas, 7 días a la semana',
    'Uniformados con identificación completa',
    'Capacitados en primeros auxilios y emergencia',
    'Control de accesos y registro de visitas',
    'Centro de monitoreo propio 24/7'
  ];
}

function generateProcess(serviceName: string): any[] {
  return [
    { step: 'Consulta', description: 'Evaluamos tus necesidades de seguridad' },
    { step: 'Propuesta', description: 'Diseñamos un plan a tu medida' },
    { step: 'Implementación', description: 'Iniciamos el servicio con personal capacitado' }
  ];
}

function generateCommonIssues(serviceName: string): string[] {
  return [
    'Accesos no controlados',
    'Robos en empresas y residencias',
    'Falta de supervisión en áreas comunes'
  ];
}

function generateFAQs(serviceName: string): any[] {
  return [
    { question: `¿Qué incluye el servicio de ${serviceName.toLowerCase()}?`, answer: 'Incluye guardias certificados OS-10, uniforme completo, supervisión 24/7 y reporte diario de novedades.' },
    { question: '¿Cuánto cuesta el servicio?', answer: 'El precio depende de las necesidades específicas. Solicita una cotización personalizada sin compromiso.' },
    { question: '¿Están disponibles las 24 horas?', answer: 'Sí, nuestro servicio opera 24/7 los 365 días del año, incluyendo feriados.' },
    { question: '¿Cómo contrato el servicio?', answer: 'Llámanos al +56 9 3000 0010 o填写 nuestro formulario de cotización.' },
    { question: '¿Cubren mi zona?', answer: 'Operamos en toda la Región Metropolitana, incluyendo Santiago Centro, Las Condes, Vitacura y más.' }
  ];
}

function generateLocationIntro(locationName: string, zone: string): string {
  return `En GuardMan Chile entendemos las necesidades específicas de seguridad en ${locationName}. ${zone === 'Oriente' ? 'Esta zona premium requiere soluciones de seguridad sofisticadas y discretas.' : zone === 'Industrial' ? 'La actividad industrial de la zona requiere vigilancia perimetral estricta.' : 'La diversidad de clientes en esta zona requiere adaptarnos a condominos, empresas y comercios.'}

Con cobertura en ${locationName} y comunas aledañas, podemos desplegar guardias en menos de 30 minutos desde cualquier punto de la comuna. Nuestro conocimiento del territorio nos permite identificar puntos críticos y diseñar esquemas de seguridad efectivos.

Todos nuestros guardias conocen las dinámicas locales de ${locationName}, incluyendo horarios de mayor actividad, zonas de riesgo y puntos de acceso principales.`;
}

function generateWhyZone(locationName: string, zone: string): string {
  const reasons: Record<string, string> = {
    'Oriente': `${locationName} es una de las zonas con mayor índice de robos a viviendas y vehículos en Santiago. La presencia de guardias de seguridad reduce significativamente el riesgo.`,
    'Centro': `${locationName} concentra alto flujo de personas y actividad comercial. El control de accesos y la vigilancia son esenciales.`,
    'Industrial': `${locationName} tiene gran cantidad de bodegas y naves industriales. La seguridad perimetral es prioritaria.`,
    'default': `${locationName} requiere servicios de seguridad profesionales para proteger empresas y residencias.`
  };
  return reasons[zone] || reasons['default'];
}

function generateLandmarks(locationName: string): string[] {
  return [`${locationName} centro`, `${locationName} sur`, `${locationName} norte`];
}

function generateNeighborhoods(locationName: string): string[] {
  return [`Sector centro`, `Sector residencial`, `Sector comercial`];
}

function generateLocationStats(locationName: string): any {
  return { empresas: '200+', guardias: '50+', experiencia: '8+ años' };
}

function generateLocationIssues(locationName: string): string[] {
  return [
    `Accesos no controlados en edificios`,
    `Robos en residencias y vehículos`,
    `Falta de iluminación en ciertas calles`
  ];
}

function generateLocationFAQs(locationName: string): any[] {
  return [
    { question: `¿Cubren el sector de ${locationName}?`, answer: `Sí, tenemos cobertura total en ${locationName} y tiempos de respuesta inferiores a 30 minutos.` },
    { question: `¿Tienen guardias disponibles en ${locationName}?`, answer: `Sí, contamos con personal desplegado en ${locationName} listo para comenzar.` },
    { question: '¿Qué documentos necesito para contratar?', answer: 'Solo necesitamos datos del lugar a proteger y preferimos un reunión para evaluar in situ.' }
  ];
}

function generateComboIntro(serviceName: string, locationName: string): string {
  return `El servicio de ${serviceName.toLowerCase()} en ${locationName} está diseñado para cubrir las necesidades específicas de esta zona. Nuestro equipo en ${locationName} combina experiencia local con los estándares de calidad de GuardMan Chile.`;
}

function generateLocalContext(serviceName: string, locationName: string, zone: string): string {
  return `${locationName} tiene características particulares que requieren un enfoque especializado en ${serviceName.toLowerCase()}. Nuestro equipo conoce las dinámicas de la zona y puede adaptarse rápidamente a las necesidades del sector.`;
}

function generateServiceInLocation(serviceName: string, locationName: string): string {
  return `En ${locationName}, el ${serviceName.toLowerCase()} se adapta a los diferentes perfiles de clientes: empresas, condominos y residencias particulares. Cada esquema de seguridad se diseña a medida.`;
}

function generateComboFAQs(serviceName: string, locationName: string): any[] {
  return [
    { question: `¿Hay disponibilidad de ${serviceName.toLowerCase()} en ${locationName}?`, answer: `Sí, tenemos personal disponible para comenzar en ${locationName} de inmediato.` },
    { question: `¿Cuál es el tiempo de respuesta en ${locationName}?`, answer: `Nuestro tiempo de respuesta en ${locationName} es inferior a 30 minutos.` }
  ];
}
