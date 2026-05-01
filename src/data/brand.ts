// GuardMan Site — Brand DNA Module
// Single source of truth for brand identity, read from synced brand.json

import brandData from './cms/brand.json';

type BrandCategory = typeof brandData;

// Company info
export const COMPANY = brandData.company || {};
export const SOCIAL = brandData.social || {};
export const STATS = brandData.stats || {};
export const HOURS = brandData.hours || {};
export const VOICE = brandData.voice || {};
export const DIFFERENTIATORS = brandData.differentiators || {};
export const EXCLUSIONS = brandData.exclusions || {};
export const CERTIFICATIONS = brandData.certifications || {};
export const USPS = brandData.usps || {};
export const COLORS = brandData.colors || {};

// Parsed USPs as array (for homepage/nosotros)
export const USP_LIST: { key: string; title: string; description: string; icon: string }[] = Object.entries(USPS)
  .map(([key, raw]) => {
    if (typeof raw === 'object' && raw !== null) return { key, ...raw };
    // Legacy pipe format fallback
    const parts = String(raw).split('|');
    return { key, title: parts[0] || '', description: parts[1] || '', icon: parts[2] || 'star' };
  })
  .filter(u => u.title);

// Convenience helpers
export function getBrandStat(key: keyof typeof STATS): string {
  return String(STATS[key] || '');
}

export function getCompanyInfo(key: keyof typeof COMPANY): string {
  return String(COMPANY[key] || '');
}

export function getSocialLink(platform: string): string {
  return String((SOCIAL as Record<string, any>)[platform] || '');
}

// Zone definitions (stored separately in zones.json but referenced by brand colors)
export const ZONES: Record<string, { label: string; color: string }> = {
  Oriente: { label: 'Zona Oriente', color: COLORS.zone_oriente || '' },
  Centro: { label: 'Zona Centro', color: COLORS.zone_centro || '' },
  Norte: { label: 'Zona Norte', color: COLORS.zone_norte || '' },
  Sur: { label: 'Zona Sur', color: COLORS.zone_sur || '' },
  Poniente: { label: 'Zona Poniente', color: COLORS.zone_poniente || '' },
  'Valparaíso': { label: 'Zona Valparaíso', color: COLORS.zone_valparaiso || '' },
};

// Default export for convenience
export default brandData as BrandCategory;
