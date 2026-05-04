/**
 * SEO Data Module — Loads Serper-derived keywords and meta for use in pages.
 * Reads from src/data/generated/seo-keywords.json and seo-meta.json
 */

import { readFileSync, existsSync } from 'fs';

export interface SEOKeywordData {
  primary_keyword: string;
  secondary_keywords: string[];
  easy_wins: string[];
}

export interface SEOMetaData {
  primary_keyword: string;
  meta_title: string;
  meta_description: string;
}

// Indexed by serviceSlug → locationSlug → data
let keywordsIndex: Record<string, Record<string, SEOKeywordData>> = {};
let metaIndex: Record<string, Record<string, SEOMetaData>> = {};

export function loadSEOData(): void {
  const kwPath = 'src/data/generated/seo-keywords.json';
  const metaPath = 'src/data/generated/seo-meta.json';

  if (existsSync(kwPath)) {
    try {
      keywordsIndex = JSON.parse(readFileSync(kwPath, 'utf-8'));
    } catch { /* ignore parse errors */ }
  }

  if (existsSync(metaPath)) {
    try {
      metaIndex = JSON.parse(readFileSync(metaPath, 'utf-8'));
    } catch { /* ignore parse errors */ }
  }
}

export function getSEOKeywords(serviceSlug: string, locationSlug?: string): SEOKeywordData | null {
  if (!locationSlug) return null;
  return keywordsIndex[serviceSlug]?.[locationSlug] || null;
}

export function getSEOMeta(serviceSlug: string, locationSlug?: string): SEOMetaData | null {
  if (!locationSlug) return null;
  return metaIndex[serviceSlug]?.[locationSlug] || null;
}

export function getEasyWins(serviceSlug: string): string[] {
  const easyWins: string[] = [];
  const serviceData = keywordsIndex[serviceSlug];
  if (!serviceData) return easyWins;

  for (const locationData of Object.values(serviceData)) {
    if (locationData.easy_wins) {
      easyWins.push(...locationData.easy_wins);
    }
  }

  // Deduplicate and return top 20
  return [...new Set(easyWins)].slice(0, 20);
}

export function getServiceKeywords(serviceSlug: string): string[] {
  const keywords: string[] = [];
  const serviceData = keywordsIndex[serviceSlug];
  if (!serviceData) return keywords;

  for (const locationData of Object.values(serviceData)) {
    if (locationData.secondary_keywords) {
      keywords.push(...locationData.secondary_keywords);
    }
  }

  return [...new Set(keywords)].slice(0, 30);
}

// Preload on import
loadSEOData();
