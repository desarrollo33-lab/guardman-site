/**
 * Section Handler - Maneja secciones de servicios, ubicaciones y sectores
 */

import type { Env } from '../index';
import { 
  generateServiceSections, 
  generateLocationSections,
  generateComboSections,
  generateSectorSections,
  SECTION_KEYS
} from './section-generator';

const SERVICE_SECTION_ORDER = [
  SECTION_KEYS.HERO,
  SECTION_KEYS.INTRO,
  SECTION_KEYS.FEATURES,
  SECTION_KEYS.PROCESS,
  SECTION_KEYS.ISSUES,
  SECTION_KEYS.STATS,
  SECTION_KEYS.FAQS,
  SECTION_KEYS.CTA
];

const LOCATION_SECTION_ORDER = [
  SECTION_KEYS.HERO,
  SECTION_KEYS.INTRO,
  SECTION_KEYS.COVERAGE,
  SECTION_KEYS.ISSUES,
  SECTION_KEYS.STATS,
  SECTION_KEYS.FAQS,
  SECTION_KEYS.CTA
];

const SECTOR_SECTION_ORDER = [
  SECTION_KEYS.HERO,
  SECTION_KEYS.INTRO,
  SECTION_KEYS.FEATURES,
  SECTION_KEYS.ISSUES,
  SECTION_KEYS.STATS,
  SECTION_KEYS.FAQS,
  SECTION_KEYS.CTA
];

// ============================================
// SERVICE SECTIONS
// ============================================

export async function generateServiceSectionsHandler(
  serviceSlug: string,
  env: Env
): Promise<{ success: boolean; sections: number; errors: string[] }> {
  const errors: string[] = [];
  let sectionsGenerated = 0;

  try {
    const service = await env.DB.prepare(
      `SELECT slug, name FROM services WHERE slug = ?`
    ).bind(serviceSlug).first() as any;

    if (!service) {
      return { success: false, sections: 0, errors: ['Service not found'] };
    }

    const sections = generateServiceSections(serviceSlug, service.name);

    for (let i = 0; i < SERVICE_SECTION_ORDER.length; i++) {
      const sectionKey = SERVICE_SECTION_ORDER[i];
      const sectionData = sections[sectionKey];
      if (!sectionData) continue;

      try {
        const { heading, subheading, contentJson, wordCount } = parseSection(sectionKey, sectionData, serviceName);

        await env.DB.prepare(`
          INSERT OR REPLACE INTO service_sections 
          (service_slug, section_key, section_order, heading, subheading, content_json, status, word_count, generated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'published', ?, datetime('now'))
        `).bind(
          serviceSlug, sectionKey, i, heading, subheading, contentJson, wordCount
        ).run();

        sectionsGenerated++;
      } catch (err: any) {
        errors.push(`${sectionKey}: ${err.message}`);
      }
    }

    return { success: errors.length === 0, sections: sectionsGenerated, errors };

  } catch (err: any) {
    return { success: false, sections: 0, errors: [err.message] };
  }
}

// ============================================
// LOCATION SECTIONS
// ============================================

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

    for (let i = 0; i < LOCATION_SECTION_ORDER.length; i++) {
      const sectionKey = LOCATION_SECTION_ORDER[i];
      const sectionData = sections[sectionKey];
      if (!sectionData) continue;

      try {
        const { heading, subheading, contentJson, wordCount } = parseSection(sectionKey, sectionData, location.name);

        await env.DB.prepare(`
          INSERT OR REPLACE INTO location_sections 
          (location_slug, section_key, section_order, heading, subheading, content_json, status, word_count, generated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'published', ?, datetime('now'))
        `).bind(
          locationSlug, sectionKey, i, heading, subheading, contentJson, wordCount
        ).run();

        sectionsGenerated++;
      } catch (err: any) {
        errors.push(`${sectionKey}: ${err.message}`);
      }
    }

    return { success: errors.length === 0, sections: sectionsGenerated, errors };

  } catch (err: any) {
    return { success: false, sections: 0, errors: [err.message] };
  }
}

// ============================================
// SECTOR SECTIONS
// ============================================

export async function generateSectorSectionsHandler(
  sectorSlug: string,
  env: Env
): Promise<{ success: boolean; sections: number; errors: string[] }> {
  const errors: string[] = [];
  let sectionsGenerated = 0;

  try {
    const sector = await env.DB.prepare(
      `SELECT slug, name FROM sectors WHERE slug = ?`
    ).bind(sectorSlug).first() as any;

    if (!sector) {
      return { success: false, sections: 0, errors: ['Sector not found'] };
    }

    const sections = generateSectorSections(sectorSlug, sector.name);

    for (let i = 0; i < SECTOR_SECTION_ORDER.length; i++) {
      const sectionKey = SECTOR_SECTION_ORDER[i];
      const sectionData = sections[sectionKey];
      if (!sectionData) continue;

      try {
        const { heading, subheading, contentJson, wordCount } = parseSection(sectionKey, sectionData, sector.name);

        await env.DB.prepare(`
          INSERT OR REPLACE INTO sector_sections 
          (sector_slug, section_key, section_order, heading, subheading, content_json, status, word_count, generated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'published', ?, datetime('now'))
        `).bind(
          sectorSlug, sectionKey, i, heading, subheading, contentJson, wordCount
        ).run();

        sectionsGenerated++;
      } catch (err: any) {
        errors.push(`${sectionKey}: ${err.message}`);
      }
    }

    return { success: errors.length === 0, sections: sectionsGenerated, errors };

  } catch (err: any) {
    return { success: false, sections: 0, errors: [err.message] };
  }
}

// ============================================
// COMBO SECTIONS
// ============================================

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

    await env.DB.prepare(`
      INSERT OR IGNORE INTO combos (service_slug, location_slug, status) VALUES (?, ?, 'draft')
    `).bind(serviceSlug, locationSlug).run();

    const sections = generateComboSections(serviceSlug, service.name, locationSlug, location.name);

    const comboSectionKeys = ['hero', 'intro', 'faqs', 'cta'];

    for (let i = 0; i < comboSectionKeys.length; i++) {
      const sectionKey = comboSectionKeys[i];
      const sectionData = sections[sectionKey];
      if (!sectionData) continue;

      try {
        const { heading, contentJson } = parseSection(sectionKey, sectionData, `${service.name} en ${location.name}`);

        await env.DB.prepare(`
          INSERT OR REPLACE INTO combo_sections 
          (service_slug, location_slug, section_key, section_order, heading, content_json, status, word_count, generated_at)
          VALUES (?, ?, ?, ?, ?, ?, 'published', ?, datetime('now'))
        `).bind(
          serviceSlug, locationSlug, sectionKey, i, heading, contentJson, heading.split(/\s+/).length
        ).run();

        sectionsGenerated++;
      } catch (err: any) {
        errors.push(`${sectionKey}: ${err.message}`);
      }
    }

    await env.DB.prepare(`
      UPDATE combos SET status = 'published' WHERE service_slug = ? AND location_slug = ?
    `).bind(serviceSlug, locationSlug).run();

    return { success: errors.length === 0, sections: sectionsGenerated, errors };

  } catch (err: any) {
    return { success: false, sections: 0, errors: [err.message] };
  }
}

// ============================================
// HELPERS
// ============================================

function parseSection(sectionKey: string, sectionData: any, entityName: string): {
  heading: string;
  subheading: string;
  contentJson: string;
  wordCount: number;
} {
  let heading = '';
  let subheading = '';
  let contentJson = '{}';
  let wordCount = 0;

  if (sectionKey === SECTION_KEYS.HERO) {
    heading = sectionData.heading || entityName;
    subheading = sectionData.subheading || '';
    contentJson = JSON.stringify({ cta_text: sectionData.cta_text });
    wordCount = (heading + ' ' + subheading + ' ' + (sectionData.cta_text || '')).split(/\s+/).length;
  } else if (sectionKey === SECTION_KEYS.INTRO) {
    heading = sectionData.heading || 'Introducción';
    contentJson = JSON.stringify({ paragraphs: sectionData.paragraphs || [] });
    wordCount = (heading + ' ' + (sectionData.paragraphs || []).join(' ')).split(/\s+/).length;
  } else if (sectionKey === SECTION_KEYS.FEATURES || sectionKey === SECTION_KEYS.ISSUES) {
    heading = sectionData.heading || (sectionKey === SECTION_KEYS.FEATURES ? 'Qué incluye' : 'Problemas que solucionamos');
    contentJson = JSON.stringify(sectionData);
    wordCount = (heading + ' ' + JSON.stringify(sectionData)).split(/\s+/).length;
  } else if (sectionKey === SECTION_KEYS.PROCESS) {
    heading = sectionData.heading || 'Nuestro proceso';
    contentJson = JSON.stringify(sectionData);
    wordCount = (heading + ' ' + JSON.stringify(sectionData)).split(/\s+/).length;
  } else if (sectionKey === SECTION_KEYS.STATS) {
    heading = sectionData.heading || 'Números que nos respaldan';
    contentJson = JSON.stringify(sectionData);
    wordCount = (heading + ' ' + JSON.stringify(sectionData)).split(/\s+/).length;
  } else if (sectionKey === SECTION_KEYS.FAQS) {
    heading = sectionData.heading || 'Preguntas Frecuentes';
    contentJson = JSON.stringify(sectionData);
    wordCount = (heading + ' ' + JSON.stringify(sectionData)).split(/\s+/).length;
  } else if (sectionKey === SECTION_KEYS.CTA) {
    heading = sectionData.title || `Cotiza ${entityName}`;
    subheading = sectionData.description || '';
    contentJson = JSON.stringify({
      description: sectionData.description,
      button: sectionData.button
    });
    wordCount = (heading + ' ' + subheading + ' ' + (sectionData.button || '')).split(/\s+/).length;
  } else if (sectionKey === SECTION_KEYS.COVERAGE) {
    heading = sectionData.title || 'Cobertura';
    contentJson = JSON.stringify(sectionData.items || sectionData);
    wordCount = (heading + ' ' + JSON.stringify(sectionData)).split(/\s+/).length;
  }

  return { heading, subheading, contentJson, wordCount };
}

// ============================================
// GETTERS
// ============================================

export async function getServiceSections(serviceSlug: string, env: Env): Promise<any> {
  const rows = await env.DB.prepare(`
    SELECT section_key, heading, subheading, content_json
    FROM service_sections
    WHERE service_slug = ? AND status = 'published'
    ORDER BY section_order
  `).bind(serviceSlug).all() as any;

  return parseSectionsFromRows(rows.results || []);
}

export async function getLocationSections(locationSlug: string, env: Env): Promise<any> {
  const rows = await env.DB.prepare(`
    SELECT section_key, heading, subheading, content_json
    FROM location_sections
    WHERE location_slug = ? AND status = 'published'
    ORDER BY section_order
  `).bind(locationSlug).all() as any;

  return parseSectionsFromRows(rows.results || []);
}

export async function getSectorSections(sectorSlug: string, env: Env): Promise<any> {
  const rows = await env.DB.prepare(`
    SELECT section_key, heading, subheading, content_json
    FROM sector_sections
    WHERE sector_slug = ? AND status = 'published'
    ORDER BY section_order
  `).bind(sectorSlug).all() as any;

  return parseSectionsFromRows(rows.results || []);
}

export async function getComboSections(serviceSlug: string, locationSlug: string, env: Env): Promise<any> {
  const rows = await env.DB.prepare(`
    SELECT section_key, heading, content_json
    FROM combo_sections
    WHERE service_slug = ? AND location_slug = ? AND status = 'published'
    ORDER BY section_order
  `).bind(serviceSlug, locationSlug).all() as any;

  const sections: Record<string, any> = {};
  for (const row of rows) {
    const content = row.content_json ? JSON.parse(row.content_json) : {};
    sections[row.section_key] = {
      heading: row.heading,
      ...content
    };
  }
  return sections;
}

function parseSectionsFromRows(rows: any[]): Record<string, any> {
  const sections: Record<string, any> = {};
  for (const row of rows) {
    const content = row.content_json ? JSON.parse(row.content_json) : {};
    sections[row.section_key] = {
      heading: row.heading,
      subheading: row.subheading,
      ...content
    };
  }
  return sections;
}