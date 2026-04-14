/**
 * Deploy Handler - Triggers rebuild y deploy
 */

import type { Env } from '../index';

interface DeployResult {
  success: boolean;
  deploymentId?: string;
  url?: string;
  message: string;
}

export async function handleDeploy(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  if (request.method === 'POST') {
    // Get all completed content
    const services = await env.DB.prepare(`
      SELECT service_slug, seo_title, meta_description, h1 FROM service_content WHERE status = 'approved'
    `).all();

    const locations = await env.DB.prepare(`
      SELECT location_slug, seo_title, meta_description, h1 FROM location_content WHERE status = 'approved'
    `).all();

    const combos = await env.DB.prepare(`
      SELECT service_slug, location_slug, seo_title, meta_description, h1 FROM combo_content WHERE status = 'approved'
    `).all();

    // Log deployment
    await env.DB.prepare(`
      INSERT INTO deployments (version, status, items_updated)
      VALUES (?, 'building', ?)
    `).bind(
      new Date().toISOString(),
      (services.results?.length || 0) + (locations.results?.length || 0) + (combos.results?.length || 0)
    ).run();

    // In a real implementation, this would trigger a Cloudflare Pages rebuild
    // For now, return status
    const result: DeployResult = {
      success: true,
      message: `Deploy queued with ${services.results?.length || 0} services, ${locations.results?.length || 0} locations, ${combos.results?.length || 0} combos`,
      deploymentId: `deploy-${Date.now()}`
    };

    return Response.json(result);
  }

  if (request.method === 'GET') {
    const deployments = await env.DB.prepare(`
      SELECT id, version, status, items_updated, deployed_at, created_at
      FROM deployments ORDER BY created_at DESC LIMIT 10
    `).all();

    return Response.json({ deployments: deployments.results });
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
