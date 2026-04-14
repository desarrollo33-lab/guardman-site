/**
 * Serper.dev Client - Google Search API
 * API Key: 560f82db098446d04e390640882b3a4313ffd39b
 */

const SERPER_BASE = "https://google.serper.dev";
const SERPER_API_KEY = "560f82db098446d04e390640882b3a4313ffd39b";

export interface OrganicResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
  domain: string;
  isCL: boolean;
  siteType: 'authority' | 'directory' | 'social' | 'weak' | 'competitor' | 'own';
}

export interface KnowledgeGraph {
  title: string;
  type: string;
  description: string;
}

export interface PAAResult {
  question: string;
  answer: string;
}

export interface LocalPackResult {
  title: string;
  rating: number;
  reviewsCount: number;
  address: string;
  hasWebsite: boolean;
}

export interface RelatedSearch {
  query: string;
}

export interface SerperSearchResult {
  organic: OrganicResult[];
  ads: { title: string; link: string }[];
  knowledgeGraph: KnowledgeGraph | null;
  peopleAlsoAsk: PAAResult[];
  localPack: LocalPackResult[];
  relatedSearches: RelatedSearch[];
  query: string;
  creditsUsed: number;
}

export interface PlaceResult {
  title: string;
  category: string;
  rating: number;
  reviewsCount: number;
  address: string;
  website: string | null;
  phone: string | null;
}

export interface SerperPlacesResult {
  places: PlaceResult[];
  query: string;
}

export interface AutocompleteResult {
  suggestions: string[];
  query: string;
}

function classifySiteType(link: string): OrganicResult['siteType'] {
  if (/wikipedia|gob\.cl|chile\.gob|sernatour/i.test(link)) return 'authority';
  if (/amariilas|directorio|guia|yapo|mercadolibre/i.test(link)) return 'directory';
  if (/facebook|instagram|tiktok|linkedin/i.test(link)) return 'social';
  if (/wordpress|blogspot|wix|webs\.com/i.test(link)) return 'weak';
  if (/guardman/i.test(link)) return 'own';
  return 'competitor';
}

function extractDomain(link: string): string {
  try {
    const url = new URL(link);
    return url.hostname;
  } catch {
    return link;
  }
}

export async function serperSearch(
  query: string,
  gl: string = 'cl',
  hl: string = 'es'
): Promise<SerperSearchResult> {
  const res = await fetch(`${SERPER_BASE}/search`, {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: query, gl, hl, num: 10 })
  });

  if (!res.ok) {
    throw new Error(`Serper search failed: ${res.status} - ${await res.text()}`);
  }

  const data = await res.json();

  const organic: OrganicResult[] = (data.organic || []).map((o: any) => ({
    title: o.title || '',
    link: o.link || '',
    snippet: o.snippet || '',
    position: o.position || 0,
    domain: extractDomain(o.link || ''),
    isCL: (o.link || '').includes('.cl'),
    siteType: classifySiteType(o.link || '')
  }));

  return {
    organic,
    ads: (data.ads || []).map((a: any) => ({
      title: a.title || '',
      link: a.link || ''
    })),
    knowledgeGraph: data.knowledgeGraph ? {
      title: data.knowledgeGraph.title || '',
      type: data.knowledgeGraph.type || '',
      description: data.knowledgeGraph.description || ''
    } : null,
    peopleAlsoAsk: (data.peopleAlsoAsk || []).map((p: any) => ({
      question: p.question || '',
      answer: p.answer || ''
    })),
    localPack: (data.localPack || []).map((l: any) => ({
      title: l.title || '',
      rating: l.rating || 0,
      reviewsCount: l.reviewsCount || 0,
      address: l.address || '',
      hasWebsite: !!l.website
    })),
    relatedSearches: (data.relatedSearches || []).map((r: any) => ({
      query: r.query || ''
    })),
    query,
    creditsUsed: 1
  };
}

export async function serperPlaces(
  query: string,
  gl: string = 'cl',
  hl: string = 'es'
): Promise<SerperPlacesResult> {
  const res = await fetch(`${SERPER_BASE}/places`, {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: query, gl, hl, num: 20 })
  });

  if (!res.ok) {
    throw new Error(`Serper places failed: ${res.status} - ${await res.text()}`);
  }

  const data = await res.json();

  return {
    places: (data.places || []).map((p: any) => ({
      title: p.title || '',
      category: p.category || '',
      rating: p.rating || 0,
      reviewsCount: p.reviewsCount || 0,
      address: p.address || '',
      website: p.website || null,
      phone: p.phone || null
    })),
    query
  };
}

export async function serperAutocomplete(
  query: string,
  gl: string = 'cl',
  hl: string = 'es'
): Promise<AutocompleteResult> {
  const res = await fetch(`${SERPER_BASE}/autocomplete`, {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: query, gl, hl })
  });

  if (!res.ok) {
    throw new Error(`Serper autocomplete failed: ${res.status} - ${await res.text()}`);
  }

  const data = await res.json();

  return {
    suggestions: data.suggestions?.map((s: any) => s.value || s) || [],
    query
  };
}

/**
 * Calculate SEO Difficulty Score (SDS) based on SERP results
 * Lower score = easier to rank
 */
export function calculateSDS(
  organic: OrganicResult[],
  hasKnowledgeGraph: boolean,
  paaCount: number
): { sds: number; tier: 'easy' | 'moderate' | 'competitive' | 'hard' } {
  if (organic.length === 0) {
    return { sds: 20, tier: 'easy' };
  }

  let score = 50; // Base score

  // Penalize if there are authority sites
  const authorityCount = organic.filter(r => r.siteType === 'authority').length;
  score += authorityCount * 10;

  // Penalize if there are directories
  const directoryCount = organic.filter(r => r.siteType === 'directory').length;
  score += directoryCount * 5;

  // Penalize if there are weak sites (easier to beat)
  const weakCount = organic.filter(r => r.siteType === 'weak').length;
  score -= weakCount * 5;

  // Penalize if GuardMan already ranks
  const guardmanRank = organic.findIndex(r => r.siteType === 'own');
  if (guardmanRank >= 0) {
    score -= (10 - guardmanRank) * 3; // More bonus for higher positions
  }

  // Bonus for Knowledge Graph (means Google considers this a notable entity)
  if (hasKnowledgeGraph) {
    score += 5;
  }

  // Bonus for PAA (means there's clear informational intent)
  if (paaCount > 0) {
    score += paaCount * 2;
  }

  // Consider .cl domain presence
  const clDomains = organic.filter(r => r.isCL);
  if (clDomains.length === 0) {
    score -= 10; // Easier if no Chilean sites
  } else if (clDomains.length > 5) {
    score += 5;
  }

  // Clamp to 0-100
  score = Math.max(0, Math.min(100, score));

  let tier: 'easy' | 'moderate' | 'competitive' | 'hard';
  if (score < 25) tier = 'easy';
  else if (score < 40) tier = 'moderate';
  else if (score < 60) tier = 'competitive';
  else tier = 'hard';

  return { sds: score, tier };
}

/**
 * Determine search intent from query
 */
export function detectIntent(query: string): 'informational' | 'transactional' | 'navigational' | 'commercial' {
  const lower = query.toLowerCase();
  
  // Transactional signals
  if (/cotizar|contratar|presupuesto|precio|costo|cuanto cuesta| contratar|rentar|alquilar/i.test(lower)) {
    return 'transactional';
  }
  
  // Navigational signals
  if (/guardman|prosegur|Grupo 5|omd/i.test(lower)) {
    return 'navigational';
  }
  
  // Commercial investigation signals
  if (/mejor|comparar|comparacion|reviews?|opiniones|recomendado/i.test(lower)) {
    return 'commercial';
  }
  
  // Default to informational
  return 'informational';
}

/**
 * Generate keyword variations for research
 */
export function generateKeywordVariations(service: string, location: string): string[] {
  const variations: string[] = [];
  
  // Basic combinations
  variations.push(`${service} ${location} Chile`);
  variations.push(`empresa de ${service} ${location}`);
  variations.push(`${service} en ${location}`);
  
  // With "seguridad" prefix if not already
  if (!service.toLowerCase().includes('seguridad')) {
    variations.push(`seguridad ${service} ${location} Chile`);
  }
  
  // Intent variations
  variations.push(`mejor ${service} ${location}`);
  variations.push(`${service} ${location} precio`);
  variations.push(`cotizar ${service} ${location}`);
  variations.push(`urgente ${service} ${location}`);
  
  // Long tail
  variations.push(`donde encontrar ${service} en ${location}`);
  variations.push(`${service} cerca de mi ${location}`);
  variations.push(`profesional ${service} ${location}`);
  
  return [...new Set(variations)];
}
