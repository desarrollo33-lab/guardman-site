/**
 * Research Handler - Usa Serper para gather SEO data
 * Versión simplificada sin foreign keys complejos
 */

import { 
  serperSearch, 
  serperPlaces,
  calculateSDS, 
  detectIntent,
  generateKeywordVariations
} from '../serper';

interface ResearchResult {
  success: boolean;
  serviceSlug: string;
  locationSlug: string;
  keywordsFound: number;
  competitorsAnalyzed: number;
  faqsFound: number;
  errors: string[];
}

/**
 * Research para una combinación servicio × ubicación
 */
export async function handleResearch(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare(`
      SELECT service_slug, location_slug, COUNT(*) as total,
             SUM(credits_used) as credits
      FROM serper_queries
      GROUP BY service_slug, location_slug
    `).all();
    return Response.json({ research_status: results || [] });
  }

  if (request.method === 'POST') {
    const { serviceSlug, locationSlug } = await request.json();
    
    if (!serviceSlug || !locationSlug) {
      return Response.json({ error: 'serviceSlug and locationSlug required' }, { status: 400 });
    }

    const result = await runResearch(serviceSlug, locationSlug, env);
    return Response.json(result);
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}

async function runResearch(
  serviceSlug: string,
  locationSlug: string,
  env: Env
): Promise<ResearchResult> {
  const errors: string[] = [];
  let keywordsFound = 0;
  let competitorsAnalyzed = 0;
  let faqsFound = 0;
  let totalCredits = 0;

  try {
    // Get service info
    const service = await env.DB.prepare(
      `SELECT name FROM services WHERE slug = ?`
    ).bind(serviceSlug).first() as any;

    if (!service) {
      return { success: false, serviceSlug, locationSlug, keywordsFound: 0, competitorsAnalyzed: 0, faqsFound: 0, errors: ['Service not found'] };
    }

    // Get location info
    const location = await env.DB.prepare(
      `SELECT name FROM locations WHERE slug = ?`
    ).bind(locationSlug).first() as any;

    const serviceName = service?.name || serviceSlug;
    const locationName = location?.name || locationSlug;

    // Generate keyword variations
    const keywordQueries = generateKeywordVariations(serviceName, locationName);

    // Run searches
    for (const query of keywordQueries) {
      try {
        const searchResult = await serperSearch(query);
        totalCredits += searchResult.creditsUsed;

        // Save query result (flattened - no foreign key needed)
        const queryData = {
          query,
          organic: searchResult.organic,
          knowledgeGraph: searchResult.knowledgeGraph,
          paa: searchResult.peopleAlsoAsk,
          relatedSearches: searchResult.relatedSearches,
          credits: searchResult.creditsUsed
        };

        await env.DB.prepare(`
          INSERT OR IGNORE INTO serper_queries 
          (service_slug, location_slug, query_text, endpoint, response_json, status, credits_used, executed_at)
          VALUES (?, ?, ?, 'search', ?, 'completed', ?, datetime('now'))
        `).bind(
          serviceSlug, 
          locationSlug, 
          query, 
          JSON.stringify(queryData),
          totalCredits
        ).run();

        // Extract and save keywords with SDS
        const intent = detectIntent(query);
        const sdsData = calculateSDS(
          searchResult.organic,
          !!searchResult.knowledgeGraph,
          searchResult.peopleAlsoAsk.length
        );

        await env.DB.prepare(`
          INSERT OR REPLACE INTO keywords
          (service_slug, location_slug, keyword, intent, sds_score, sds_tier, is_easy_win, priority_score, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'validated')
        `).bind(
          serviceSlug,
          locationSlug,
          query,
          intent,
          sdsData.sds,
          sdsData.tier,
          sdsData.tier === 'easy' ? 1 : 0,
          sdsData.tier === 'easy' ? 100 : (sdsData.tier === 'moderate' ? 70 : 40)
        ).run();
        keywordsFound++;

        // Save competitors
        for (const organic of searchResult.organic.slice(0, 5)) {
          await env.DB.prepare(`
            INSERT OR IGNORE INTO competitors
            (domain, service_slug, location_slug, site_type, avg_position, is_guardman)
            VALUES (?, ?, ?, ?, ?, ?)
          `).bind(
            organic.domain,
            serviceSlug,
            locationSlug,
            organic.siteType,
            organic.position,
            organic.siteType === 'own' ? 1 : 0
          ).run();
          competitorsAnalyzed++;
        }

        // Save FAQs from PAA
        for (const paa of searchResult.peopleAlsoAsk) {
          await env.DB.prepare(`
            INSERT OR IGNORE INTO faqs
            (service_slug, location_slug, question, source, frequency_rank)
            VALUES (?, ?, ?, 'paa', ?)
          `).bind(
            serviceSlug,
            locationSlug,
            paa.question,
            searchResult.peopleAlsoAsk.indexOf(paa) + 1
          ).run();
          faqsFound++;
        }

        // Rate limit
        await new Promise(r => setTimeout(r, 300));

      } catch (err: any) {
        errors.push(`"${query}": ${err.message}`);
      }
    }

    // Places search for local data
    try {
      const placesResult = await serperPlaces(`${serviceName} ${locationName}`);
      
      await env.DB.prepare(`
        INSERT OR IGNORE INTO serper_queries 
        (service_slug, location_slug, query_text, endpoint, status, credits_used, executed_at)
        VALUES (?, ?, ?, 'places', 'completed', 0, datetime('now'))
      `).bind(
        serviceSlug,
        locationSlug,
        `${serviceName} ${locationName}`
      ).run();
    } catch (err: any) {
      // Places es opcional, no fallar por esto
    }

    return {
      success: errors.length === 0,
      serviceSlug,
      locationSlug,
      keywordsFound,
      competitorsAnalyzed,
      faqsFound,
      errors
    };

  } catch (err: any) {
    return {
      success: false,
      serviceSlug,
      locationSlug,
      keywordsFound,
      competitorsAnalyzed,
      faqsFound,
      errors: [err.message, ...errors]
    };
  }
}

/**
 * Batch research - ejecuta research para múltiples combinaciones
 */
export async function handleBatchResearch(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  const { combinations } = await request.json();
  
  if (!Array.isArray(combinations)) {
    return Response.json({ error: 'combinations array required' }, { status: 400 });
  }

  const results: ResearchResult[] = [];
  let totalCredits = 0;

  for (const { serviceSlug, locationSlug } of combinations) {
    const result = await runResearch(serviceSlug, locationSlug, env);
    results.push(result);
    totalCredits += result.keywordsFound;
    
    // Rate limit
    await new Promise(r => setTimeout(r, 500));
  }

  return Response.json({
    total: combinations.length,
    completed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results,
    totalCredits
  });
}
