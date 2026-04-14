/**
 * D1 Handler - Status y queries directas a D1
 */

import type { Env } from '../index';

export async function handleD1Status(env: Env): Promise<Response> {
  const tables = [
    'services',
    'locations',
    'serper_queries',
    'serper_results',
    'keywords',
    'competitors',
    'faqs',
    'service_content',
    'location_content',
    'combo_content',
    'schema_data',
    'agent_knowledge'
  ];

  const stats = [];

  for (const table of tables) {
    try {
      const { results } = await env.DB.prepare(
        `SELECT COUNT(*) as count FROM ${table}`
      ).all();
      stats.push({
        table,
        rows: results[0]?.count || 0,
        status: 'ok'
      });
    } catch (e: any) {
      stats.push({
        table,
        rows: 0,
        status: 'error',
        error: e.message
      });
    }
  }

  return Response.json({
    total_rows: stats.reduce((sum: number, t: any) => sum + t.rows, 0),
    tables: stats
  });
}

export async function handleD1Query(request: Request, env: Env): Promise<Response> {
  if (request.method === 'GET') {
    return handleD1Status(env);
  }

  if (request.method === 'POST') {
    const { sql, params } = await request.json();

    if (!sql) {
      return Response.json({ error: 'sql required' }, { status: 400 });
    }

    try {
      // Only SELECT queries allowed
      if (!sql.trim().toLowerCase().startsWith('select')) {
        return Response.json({ error: 'Only SELECT queries allowed' }, { status: 400 });
      }

      const stmt = env.DB.prepare(sql);
      const results = params ? await stmt.bind(...params).all() : await stmt.all();

      return Response.json({
        results: results.results,
        meta: {
          count: results.results?.length || 0,
          duration: results.meta?.duration || 0
        }
      });
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 500 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
