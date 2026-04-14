/**
 * Section Handler - Maneja contenido por secciones en D1
 */

import type { Env } from '../index';
import { 
  generateServiceSections, 
  generateLocationSections,
  generateComboSections,
  SECTION_KEYS,
  SERVICE_SECTION_ORDER
} from './section-generator';

/**
 * Generate y guardar secciones para un servicio
 */
export async function generateServiceSectionsHandler(
  serviceSlug: string,
  env: Env
): Promise<{ success: boolean; sections: number; errors: string[] }> {
  const errors: string[] = [];
  let sectionsGenerated = 0;

  try {
    // Get service name
    const service = await env.DB.prepare(
      `SELECT slug, name FROM services WHERE slug = ?`
    ).bind(serviceSlug).first() as any;

    if (!service) {
      return { success: false, sections: 0, errors: ['Service not found'] };
    }

    // Generate sections
    const sections = generateServiceSections(serviceSlug, service.name);

    // Insert each section
    for (let i = 0; i < SERVICE_SECTION_ORDER.length; i++) {
      const sectionKey = SERVICE_SECTION_ORDER[i];
      const sectionData = sections[sectionKey];

      if (!sectionData) continue;

      try {
        let heading = '';
        let subheading = '';
        let contentJson = '';

        // Parse section data based on type
        if (sectionKey === SECTION_KEYS.HERO) {
          heading = sectionData.heading;
          subheading = sectionData.subheading;
          contentJson = JSON.stringify({ cta_text: sectionData.cta_text });
        } else if (sectionKey === SECTION_KEYS.INTRO) {
          heading = 'Introducción';
          contentJson = JSON.stringify({ paragraphs: sectionData.paragraphs });
        } else if (sectionKey === SECTION_KEYS.FEATURES) {
          heading = 'Qué incluye el servicio';
          contentJson = JSON.stringify(sectionData);
        } else if (sectionKey === SECTION_KEYS.PROCESS) {
          heading = 'Nuestro proceso';
          contentJson = JSON.stringify(sectionData);
        } else if (sectionKey === SECTION_KEYS.ISSUES) {
          heading = 'Problemas que solucionamos';
          contentJson = JSON.stringify(sectionData);
        } else if (sectionKey === SECTION_KEYS.STATS) {
          heading = 'Números que nos respaldan';
          contentJson = JSON.stringify(sectionData);
        } else if (sectionKey === SECTION_KEYS.FAQS) {
          heading = 'Preguntas Frecuentes';
          contentJson = JSON.stringify(sectionData);
        } else if (sectionKey === SECTION_KEYS.CTA) {
          heading = sectionData.title;
          contentJson = JSON.stringify({
            description: sectionData.description,
            button: sectionData.button
          });
        }

        const wordCount = (heading + ' ' + subheading + ' ' + contentJson).split(/\s+/).length;

        await env.DB.prepare(`
          -- Don't update service status, just insert sections
          INSERT OR REPLACE INTO service_sections 
          (service_slug, section_key, section_order, heading, subheading, content_json, status, word_count, generated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'published', ?, datetime('now'))
        `).bind(
          serviceSlug,
          sectionKey,
          i,
          heading,
          subheading,
          contentJson,
          wordCount
        ).run();

        sectionsGenerated++;
      } catch (err: any) {
        errors.push(`${sectionKey}: ${err.message}`);
      }
    }

    // Don't update service status - let it remain as is for now
    return { success: errors.length === 0, sections: sectionsGenerated, errors };

  } catch (err: any) {
    return { success: false, sections: 0, errors: [err.message] };
  }
}

/**
 * Generate y guardar secciones para una ubicación
 */
export async function generateLocationSectionsHandler(
  locationSlug: string,
  env: Env
): Promise<{ success: boolean; sections: number; errors: string[] }> {
  const errors: string[] = [];
  let sectionsGenerated = 0;

  try {
    const location = await env.DB.prepare(
      `SELECT slug, name, zone FROM locations WHERE slug = ?`
    ).bind(locationSlug).first() as any;

    if (!location) {
      return { success: false, sections: 0, errors: ['Location not found'] };
    }

    const sections = generateLocationSections(locationSlug, location.name, location.zone || 'Centro');
    const sectionKeys = ['hero', 'intro', 'coverage', 'issues', 'stats', 'faqs', 'cta'];

    for (let i = 0; i < sectionKeys.length; i++) {
      const sectionKey = sectionKeys[i];
      const sectionData = sections[sectionKey];

      if (!sectionData) continue;

      try {
        let heading = '';
        let subheading = '';
        let contentJson = '';

        if (sectionKey === 'hero') {
          heading = sectionData.heading;
          subheading = sectionData.subheading;
          contentJson = JSON.stringify({ cta_text: sectionData.cta_text });
        } else if (sectionKey === 'intro') {
          heading = 'Por qué ' + location.name;
          contentJson = JSON.stringify({ paragraphs: sectionData.paragraphs });
        } else if (sectionKey === 'coverage') {
          heading = sectionData.title;
          contentJson = JSON.stringify(sectionData.items);
        } else if (sectionKey === 'issues') {
          heading = 'Seguridad en ' + location.name;
          contentJson = JSON.stringify(sectionData);
        } else if (sectionKey === 'stats') {
          heading = 'Números en ' + location.name;
          contentJson = JSON.stringify(sectionData);
        } else if (sectionKey === 'faqs') {
          heading = 'Preguntas Frecuentes';
          contentJson = JSON.stringify(sectionData);
        } else if (sectionKey === 'cta') {
          heading = sectionData.title;
          contentJson = JSON.stringify({
            description: sectionData.description,
            button: sectionData.button
          });
        }

        const wordCount = (heading + ' ' + subheading + ' ' + contentJson).split(/\s+/).length;

        await env.DB.prepare(`
          INSERT OR REPLACE INTO location_sections 
          (location_slug, section_key, section_order, heading, subheading, content_json, status, word_count, generated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'published', ?, datetime('now'))
        `).bind(
          locationSlug,
          sectionKey,
          i,
          heading,
          subheading,
          contentJson,
          wordCount
        ).run();

        sectionsGenerated++;
      } catch (err: any) {
        errors.push(`${sectionKey}: ${err.message}`);
      }
    }

    // Don't update location status
    return { success: errors.length === 0, sections: sectionsGenerated, errors };

  } catch (err: any) {
    return { success: false, sections: 0, errors: [err.message] };
  }
}

/**
 * Generate secciones para combo (servicio × ubicación)
 */
export async function generateComboSectionsHandler(
  serviceSlug: string,
  locationSlug: string,
  env: Env
): Promise<{ success: boolean; sections: number; errors: string[] }> {
  const errors: string[] = [];
  let sectionsGenerated = 0;

  try {
    const [service, location] = await Promise.all([
      env.DB.prepare(`SELECT name FROM services WHERE slug = ?`).bind(serviceSlug).first() as any,
      env.DB.prepare(`SELECT name FROM locations WHERE slug = ?`).bind(locationSlug).first() as any
    ]);

    if (!service || !location) {
      return { success: false, sections: 0, errors: ['Service or location not found'] };
    }

    // Ensure combo exists
    await env.DB.prepare(`
      INSERT OR IGNORE INTO combos (service_slug, location_slug, status) VALUES (?, ?, 'draft')
    `).bind(serviceSlug, locationSlug).run();

    const sections = generateComboSections(serviceSlug, service.name, locationSlug, location.name);
    const sectionKeys = ['hero', 'intro', 'faqs', 'cta'];

    for (let i = 0; i < sectionKeys.length; i++) {
      const sectionKey = sectionKeys[i];
      const sectionData = sections[sectionKey];

      if (!sectionData) continue;

      try {
        let heading = '';
        let contentJson = '';

        if (sectionKey === 'hero') {
          heading = sectionData.heading;
          contentJson = JSON.stringify({ subheading: sectionData.subheading, cta_text: sectionData.cta_text });
        } else if (sectionKey === 'intro') {
          heading = 'Servicio en ' + location.name;
          contentJson = JSON.stringify({ paragraphs: sectionData.paragraphs });
        } else if (sectionKey === 'faqs') {
          heading = 'Preguntas Frecuentes';
          contentJson = JSON.stringify(sectionData);
        } else if (sectionKey === 'cta') {
          heading = sectionData.title;
          contentJson = JSON.stringify({
            description: sectionData.description,
            button: sectionData.button
          });
        }

        await env.DB.prepare(`
          INSERT OR REPLACE INTO combo_sections 
          (service_slug, location_slug, section_key, section_order, heading, content_json, status, word_count, generated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'published', ?, datetime('now'))
        `).bind(
          serviceSlug,
          locationSlug,
          sectionKey,
          i,
          heading,
          contentJson,
          heading.split(/\s+/).length
        ).run();

        sectionsGenerated++;
      } catch (err: any) {
        errors.push(`${sectionKey}: ${err.message}`);
      }
    }

    // Update combo status
    await env.DB.prepare(`
      UPDATE combos SET status = 'published' WHERE service_slug = ? AND location_slug = ?
    `).bind(serviceSlug, locationSlug).run();

    return { success: errors.length === 0, sections: sectionsGenerated, errors };

  } catch (err: any) {
    return { success: false, sections: 0, errors: [err.message] };
  }
}

/**
 * Get sections for a service from D1
 */
export async function getServiceSections(serviceSlug: string, env: Env): Promise<any> {
  const rows = await env.DB.prepare(`
    SELECT section_key, heading, subheading, content_json, word_count
    FROM service_sections
    WHERE service_slug = ? AND status = 'published'
    ORDER BY section_order
  `).bind(serviceSlug).all() as any;

  const sections: Record<string, any> = {};
  
  for (const row of rows.results || []) {
    const content = row.content_json ? JSON.parse(row.content_json) : {};
    sections[row.section_key] = {
      heading: row.heading,
      subheading: row.subheading,
      ...content
    };
  }

  return sections;
}

/**
 * Get sections for a location from D1
 */
export async function getLocationSections(locationSlug: string, env: Env): Promise<any> {
  const rows = await env.DB.prepare(`
    SELECT section_key, heading, subheading, content_json
    FROM location_sections
    WHERE location_slug = ? AND status = 'published'
    ORDER BY section_order
  `).bind(locationSlug).all() as any;

  const sections: Record<string, any> = {};
  
  for (const row of rows.results || []) {
    const content = row.content_json ? JSON.parse(row.content_json) : {};
    sections[row.section_key] = {
      heading: row.heading,
      subheading: row.subheading,
      ...content
    };
  }

  return sections;
}

/**
 * Get sections for a combo from D1
 */
export async function getComboSections(serviceSlug: string, locationSlug: string, env: Env): Promise<any> {
  const rows = await env.DB.prepare(`
    SELECT section_key, heading, content_json
    FROM combo_sections
    WHERE service_slug = ? AND location_slug = ? AND status = 'published'
    ORDER BY section_order
  `).bind(serviceSlug, locationSlug).all() as any;

  const sections: Record<string, any> = {};
  
  for (const row of rows.results || []) {
    const content = row.content_json ? JSON.parse(row.content_json) : {};
    sections[row.section_key] = {
      heading: row.heading,
      ...content
    };
  }

  return sections;
}