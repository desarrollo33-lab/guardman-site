/**
 * Sections API Handler - Endpoints para secciones
 */

import type { Env } from '../index';
import { 
  generateServiceSectionsHandler,
  generateLocationSectionsHandler,
  generateSectorSectionsHandler,
  generateComboSectionsHandler,
  getServiceSections,
  getLocationSections,
  getSectorSections,
  getComboSections
} from './section-handler';

/**
 * Handle section API requests
 */
export async function handleSections(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // POST /api/sections/service/:slug - Generate service sections
  if (path.match(/^\/api\/sections\/service\/([^/]+)$/) && request.method === 'POST') {
    const serviceSlug = path.split('/')[4];
    const result = await generateServiceSectionsHandler(serviceSlug, env);
    return Response.json(result);
  }

  // GET /api/sections/service/:slug - Get service sections
  if (path.match(/^\/api\/sections\/service\/([^/]+)$/) && request.method === 'GET') {
    const serviceSlug = path.split('/')[4];
    const sections = await getServiceSections(serviceSlug, env);
    return Response.json({ serviceSlug, sections });
  }

  // POST /api/sections/location/:slug - Generate location sections
  if (path.match(/^\/api\/sections\/location\/([^/]+)$/) && request.method === 'POST') {
    const locationSlug = path.split('/')[4];
    const result = await generateLocationSectionsHandler(locationSlug, env);
    return Response.json(result);
  }

  // GET /api/sections/location/:slug - Get location sections
  if (path.match(/^\/api\/sections\/location\/([^/]+)$/) && request.method === 'GET') {
    const locationSlug = path.split('/')[4];
    const sections = await getLocationSections(locationSlug, env);
    return Response.json({ locationSlug, sections });
  }

  // POST /api/sections/sector/:slug - Generate sector sections
  if (path.match(/^\/api\/sections\/sector\/([^/]+)$/) && request.method === 'POST') {
    const sectorSlug = path.split('/')[4];
    const result = await generateSectorSectionsHandler(sectorSlug, env);
    return Response.json(result);
  }

  // GET /api/sections/sector/:slug - Get sector sections
  if (path.match(/^\/api\/sections\/sector\/([^/]+)$/) && request.method === 'GET') {
    const sectorSlug = path.split('/')[4];
    const sections = await getSectorSections(sectorSlug, env);
    return Response.json({ sectorSlug, sections });
  }

  // POST /api/sections/combo - Generate combo sections
  if (path === '/api/sections/combo' && request.method === 'POST') {
    const { serviceSlug, locationSlug } = await request.json();
    if (!serviceSlug || !locationSlug) {
      return Response.json({ error: 'serviceSlug and locationSlug required' }, { status: 400 });
    }
    const result = await generateComboSectionsHandler(serviceSlug, locationSlug, env);
    return Response.json(result);
  }

  // GET /api/sections/combo - Get combo sections
  if (path === '/api/sections/combo' && request.method === 'GET') {
    const serviceSlug = url.searchParams.get('service');
    const locationSlug = url.searchParams.get('location');
    
    if (!serviceSlug || !locationSlug) {
      return Response.json({ error: 'service and location params required' }, { status: 400 });
    }
    
    const sections = await getComboSections(serviceSlug, locationSlug, env);
    return Response.json({ serviceSlug, locationSlug, sections });
  }

  // POST /api/sections/batch - Generate all sections
  if (path === '/api/sections/batch' && request.method === 'POST') {
    const { type } = await request.json();
    
    const results: any = { services: 0, locations: 0, sectors: 0, combos: 0 };
    const errors: string[] = [];

    // Generate all services
    if (!type || type === 'all' || type === 'services') {
      const services = await env.DB.prepare(`SELECT slug FROM services`).all() as any;
      for (const s of services.results || []) {
        const r = await generateServiceSectionsHandler(s.slug, env);
        if (r.success) results.services++;
        else errors.push(`${s.slug}: ${r.errors.join(', ')}`);
      }
    }

    // Generate all locations
    if (!type || type === 'all' || type === 'locations') {
      const locations = await env.DB.prepare(`SELECT slug FROM locations`).all() as any;
      for (const l of locations.results || []) {
        const r = await generateLocationSectionsHandler(l.slug, env);
        if (r.success) results.locations++;
        else errors.push(`${l.slug}: ${r.errors.join(', ')}`);
      }
    }

    // Generate all sectors
    if (!type || type === 'all' || type === 'sectors') {
      const sectors = await env.DB.prepare(`SELECT slug FROM sectors`).all() as any;
      for (const s of sectors.results || []) {
        const r = await generateSectorSectionsHandler(s.slug, env);
        if (r.success) results.sectors++;
        else errors.push(`${s.slug}: ${r.errors.join(', ')}`);
      }
    }

    return Response.json({
      success: errors.length === 0,
      generated: results,
      errors: errors.length > 0 ? errors : undefined
    });
  }

  return Response.json({
    error: 'Not found',
    endpoints: [
      'POST /api/sections/service/:slug - Generate service sections',
      'GET /api/sections/service/:slug - Get service sections',
      'POST /api/sections/location/:slug - Generate location sections',
      'GET /api/sections/location/:slug - Get location sections',
      'POST /api/sections/sector/:slug - Generate sector sections',
      'GET /api/sections/sector/:slug - Get sector sections',
      'POST /api/sections/combo - Generate combo sections',
      'GET /api/sections/combo?service=X&location=Y - Get combo sections',
      'POST /api/sections/batch - Generate all sections'
    ]
  }, { status: 404 });
}