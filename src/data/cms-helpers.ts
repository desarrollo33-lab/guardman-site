/**
 * GuardMan Chile — CMS Helpers
 * Unified helpers for parsing CMS content, resolving fallbacks, and image URLs.
 */

// === Intro Parsing ===

/**
 * Parse intro section from CMS into an array of paragraphs.
 * Handles both formats: `intro.content` (string with \n\n) and `intro.paragraphs` (string[]).
 */
export function parseIntro(intro: any): string[] {
  if (!intro) return [];
  if (Array.isArray(intro.paragraphs) && intro.paragraphs.length > 0) {
    return intro.paragraphs;
  }
  if (typeof intro.content === 'string' && intro.content.length > 0) {
    return intro.content.split('\n\n').filter(Boolean);
  }
  if (typeof intro === 'string') return [intro];
  return [];
}

// === FAQ Parsing ===

interface FAQItem { question: string; answer: string }

/**
 * Parse FAQs from CMS into a normalized array of { question, answer }.
 * Handles multiple formats: array, object with numeric keys, items property.
 */
export function parseFAQs(faqs: any): FAQItem[] {
  if (!faqs) return [];

  // Direct array
  if (Array.isArray(faqs)) {
    return faqs.filter((f: any) => f && typeof f === 'object' && f.question).map(normalizeFAQ);
  }

  // Object with .items property
  if (faqs.items && Array.isArray(faqs.items)) {
    return faqs.items.filter((f: any) => f && typeof f === 'object' && f.question).map(normalizeFAQ);
  }

  // Object with numeric keys (legacy format)
  const numericEntries = Object.entries(faqs)
    .filter(([key]) => !isNaN(Number(key)))
    .map(([_, value]) => value)
    .filter((v: any) => v && typeof v === 'object' && v.question);

  if (numericEntries.length > 0) {
    return numericEntries.map(normalizeFAQ);
  }

  return [];
}

function normalizeFAQ(f: any): FAQItem {
  return {
    question: String(f.question || ''),
    answer: String(f.answer || ''),
  };
}

// === Issues Parsing ===

/**
 * Parse issues from CMS into a flat string array.
 * Handles: direct array, .items property, object with numeric keys.
 */
export function parseIssues(issues: any): string[] {
  if (!issues) return [];
  if (Array.isArray(issues.items)) return issues.items.filter((s: any) => typeof s === 'string');
  if (Array.isArray(issues)) return issues.filter((s: any) => typeof s === 'string');

  const numericEntries = Object.entries(issues)
    .filter(([key]) => !isNaN(Number(key)) || key === 'items')
    .flatMap(([key, value]) => key === 'items' ? (Array.isArray(value) ? value : []) : [value])
    .filter((v: any) => typeof v === 'string');

  if (numericEntries.length > 0) return numericEntries;
  return [];
}

// === Features Parsing ===

/**
 * Parse features from CMS into a flat string array.
 */
export function parseFeatures(features: any): string[] {
  if (!features) return [];
  if (Array.isArray(features.items)) return features.items.filter((s: any) => typeof s === 'string');
  if (Array.isArray(features)) return features.filter((s: any) => typeof s === 'string');
  return [];
}

// === Process Parsing ===

interface ProcessStep { step?: string; title?: string; description?: string }

/**
 * Parse process steps from CMS into a normalized array.
 */
export function parseProcess(process: any): ProcessStep[] {
  if (!process) return [];
  if (Array.isArray(process)) return process;
  const numericEntries = Object.entries(process)
    .filter(([key]) => !isNaN(Number(key)))
    .map(([_, v]) => v as ProcessStep);
  return numericEntries;
}

// === Image URL Helper ===

/**
 * Return image path as-is. Previously used Cloudflare Image Resizing.
 * Since we're on Pages, serve directly.
 */
export function optimizeImageUrl(imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return imagePath;
}

// === Text Helpers ===

/**
 * Capitalize first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a slug-like display name from a slug string.
 * e.g. "guardias-de-seguridad" → "Guardias De Seguridad"
 */
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => capitalize(word))
    .join(' ');
}
