/**
 * Generate Handler - Genera contenido SEO único por servicio
 */

import type { Env } from '../index';
import { 
  generateServiceContent as generateSvcContent, 
  generateLocationContent as generateLocContent, 
  generateComboContent as generateCboContent 
} from './content-generator';

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
    const service = await env.DB.prepare(
      `SELECT * FROM services WHERE slug = ?`
    ).bind(serviceSlug).first() as any;

    if (!service) {
      return { success: false, errors: ['Service not found'] };
    }

    const content = generateSvcContent(serviceSlug, service.name);

    await env.DB.prepare(`
      INSERT OR REPLACE INTO service_content
      (service_slug, seo_title, meta_description, h1, hero_subtitle, intro_paragraph,
       features_json, process_json, common_issues_json, stats_json, status, word_count, generated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, datetime('now'))
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

    const content = generateLocContent(location.name, location.zone);

    await env.DB.prepare(`
      INSERT OR REPLACE INTO location_content
      (location_slug, seo_title, meta_description, h1, intro_paragraph,
       why_this_zone, landmarks_json, neighborhoods_json, stats_json, 
       status, word_count, generated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, datetime('now'))
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

    const content = generateCboContent(service.name, serviceSlug, location.name, locationSlug);

    await env.DB.prepare(`
      INSERT OR REPLACE INTO combo_content
      (service_slug, location_slug, seo_title, meta_description, h1, 
       intro_paragraph, local_context, service_in_location, cta_text, cta_button,
       status, word_count, generated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, datetime('now'))
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