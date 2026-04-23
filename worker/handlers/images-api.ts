/**
 * Images Handler - Gestión de imágenes del CMS
 */

import type { Env } from '../index';

// ============================================
// IMAGE SCHEMA
// ============================================
const CREATE_IMAGES_TABLE = `
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  alt TEXT,
  title TEXT,
  description TEXT,
  entity_type TEXT CHECK(entity_type IN ('service', 'location', 'sector', 'page', 'generic')),
  entity_slug TEXT,
  filename TEXT,
  url TEXT,
  path TEXT,
  width INTEGER,
  height INTEGER,
  size_bytes INTEGER,
  format TEXT CHECK(format IN ('webp', 'jpg', 'png', 'gif')),
  usage_pages TEXT,
  is_hero INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'uploaded', 'published', 'archived')),
  tags TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
)
`;

const IMAGE_COLUMNS = [
  'id', 'slug', 'alt', 'title', 'description', 'entity_type', 'entity_slug',
  'filename', 'url', 'path', 'width', 'height', 'size_bytes', 'format',
  'usage_pages', 'is_hero', 'is_featured', 'status', 'tags', 'created_at'
];

// ============================================
// HELPERS
// ============================================

async function ensureTable(env: Env): Promise<void> {
  await env.DB.prepare(CREATE_IMAGES_TABLE).run();
}

function parseImage(row: any): any {
  return {
    id: row.id,
    slug: row.slug,
    alt: row.alt,
    title: row.title,
    description: row.description,
    entity_type: row.entity_type,
    entity_slug: row.entity_slug,
    filename: row.filename,
    url: row.url,
    path: row.path,
    dimensions: row.width && row.height ? { width: row.width, height: row.height } : null,
    size_bytes: row.size_bytes,
    format: row.format,
    usage_pages: row.usage_pages ? JSON.parse(row.usage_pages) : [],
    is_hero: Boolean(row.is_hero),
    is_featured: Boolean(row.is_featured),
    status: row.status,
    tags: row.tags ? JSON.parse(row.tags) : [],
    created_at: row.created_at
  };
}

// ============================================
// ENDPOINTS
// ============================================

export async function handleImages(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Ensure table exists
  await ensureTable(env);

  // GET /api/images - List all images
  if (path === '/api/images' && request.method === 'GET') {
    const entityType = url.searchParams.get('entity_type');
    const entitySlug = url.searchParams.get('entity_slug');
    const status = url.searchParams.get('status');
    const isHero = url.searchParams.get('is_hero');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let sql = `SELECT * FROM images WHERE 1=1`;
    const params: any[] = [];

    if (entityType) {
      sql += ` AND entity_type = ?`;
      params.push(entityType);
    }
    if (entitySlug) {
      sql += ` AND entity_slug = ?`;
      params.push(entitySlug);
    }
    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }
    if (isHero === 'true') {
      sql += ` AND is_hero = 1`;
    } else if (isHero === 'false') {
      sql += ` AND is_hero = 0`;
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const { results } = await env.DB.prepare(sql).bind(...params).all();

    return Response.json({
      images: (results || []).map(parseImage),
      meta: {
        count: results?.length || 0,
        limit,
        offset
      }
    });
  }

  // GET /api/images/stats - Get image statistics
  if (path === '/api/images/stats' && request.method === 'GET') {
    const { results } = await env.DB.prepare(`
      SELECT 
        entity_type,
        COUNT(*) as total,
        SUM(CASE WHEN is_hero = 1 THEN 1 ELSE 0 END) as heroes,
        SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published
      FROM images
      GROUP BY entity_type
    `).all();

    return Response.json({ stats: results });
  }

  // GET /api/images/service/:slug - Get images for a service
  if (path.match(/^\/api\/images\/service\/([^/]+)$/) && request.method === 'GET') {
    const serviceSlug = path.split('/')[4];
    const { results } = await env.DB.prepare(`
      SELECT * FROM images 
      WHERE entity_type = 'service' AND entity_slug = ?
      ORDER BY is_featured DESC, is_hero DESC, created_at DESC
    `).bind(serviceSlug).all();

    return Response.json({
      entity_type: 'service',
      entity_slug: serviceSlug,
      images: (results || []).map(parseImage)
    });
  }

  // GET /api/images/location/:slug - Get images for a location
  if (path.match(/^\/api\/images\/location\/([^/]+)$/) && request.method === 'GET') {
    const locationSlug = path.split('/')[4];
    const { results } = await env.DB.prepare(`
      SELECT * FROM images 
      WHERE entity_type = 'location' AND entity_slug = ?
      ORDER BY is_featured DESC, is_hero DESC, created_at DESC
    `).bind(locationSlug).all();

    return Response.json({
      entity_type: 'location',
      entity_slug: locationSlug,
      images: (results || []).map(parseImage)
    });
  }

  // GET /api/images/sector/:slug - Get images for a sector
  if (path.match(/^\/api\/images\/sector\/([^/]+)$/) && request.method === 'GET') {
    const sectorSlug = path.split('/')[4];
    const { results } = await env.DB.prepare(`
      SELECT * FROM images 
      WHERE entity_type = 'sector' AND entity_slug = ?
      ORDER BY is_featured DESC, is_hero DESC, created_at DESC
    `).bind(sectorSlug).all();

    return Response.json({
      entity_type: 'sector',
      entity_slug: sectorSlug,
      images: (results || []).map(parseImage)
    });
  }

  // GET /api/images/:slug - Get single image
  if (path.match(/^\/api\/images\/([^/]+)$/) && request.method === 'GET') {
    const slug = path.split('/')[4];
    const result = await env.DB.prepare(`SELECT * FROM images WHERE slug = ?`).bind(slug).first();

    if (!result) {
      return Response.json({ error: 'Image not found' }, { status: 404 });
    }

    return Response.json({ image: parseImage(result) });
  }

  // POST /api/images - Register new image
  if (path === '/api/images' && request.method === 'POST') {
    const data = await request.json();

    if (!data.slug || !data.url) {
      return Response.json({ error: 'slug and url are required' }, { status: 400 });
    }

    // Check if slug exists
    const existing = await env.DB.prepare(`SELECT id FROM images WHERE slug = ?`).bind(data.slug).first();
    if (existing) {
      return Response.json({ error: 'Slug already exists' }, { status: 409 });
    }

    const result = await env.DB.prepare(`
      INSERT INTO images (
        slug, alt, title, description, entity_type, entity_slug,
        filename, url, path, width, height, size_bytes, format,
        usage_pages, is_hero, is_featured, status, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.slug,
      data.alt || '',
      data.title || '',
      data.description || '',
      data.entity_type || 'generic',
      data.entity_slug || '',
      data.filename || data.slug,
      data.url,
      data.path || '',
      data.width || null,
      data.height || null,
      data.size_bytes || null,
      data.format || 'webp',
      data.usage_pages ? JSON.stringify(data.usage_pages) : '[]',
      data.is_hero ? 1 : 0,
      data.is_featured ? 1 : 0,
      data.status || 'pending',
      data.tags ? JSON.stringify(data.tags) : '[]'
    ).run();

    const newImage = await env.DB.prepare(`SELECT * FROM images WHERE id = ?`).bind(result.meta?.last_row_id).first();

    return Response.json({
      success: true,
      image: parseImage(newImage)
    }, { status: 201 });
  }

  // PUT /api/images/:slug - Update image
  if (path.match(/^\/api\/images\/([^/]+)$/) && request.method === 'PUT') {
    const slug = path.split('/')[4];
    const data = await request.json();

    const existing = await env.DB.prepare(`SELECT * FROM images WHERE slug = ?`).bind(slug).first();
    if (!existing) {
      return Response.json({ error: 'Image not found' }, { status: 404 });
    }

    await env.DB.prepare(`
      UPDATE images SET
        alt = ?,
        title = ?,
        description = ?,
        entity_type = ?,
        entity_slug = ?,
        url = ?,
        path = ?,
        width = ?,
        height = ?,
        size_bytes = ?,
        usage_pages = ?,
        is_hero = ?,
        is_featured = ?,
        status = ?,
        tags = ?,
        updated_at = datetime('now')
      WHERE slug = ?
    `).bind(
      data.alt ?? existing.alt,
      data.title ?? existing.title,
      data.description ?? existing.description,
      data.entity_type ?? existing.entity_type,
      data.entity_slug ?? existing.entity_slug,
      data.url ?? existing.url,
      data.path ?? existing.path,
      data.width ?? existing.width,
      data.height ?? existing.height,
      data.size_bytes ?? existing.size_bytes,
      data.usage_pages ? JSON.stringify(data.usage_pages) : existing.usage_pages,
      data.is_hero !== undefined ? (data.is_hero ? 1 : 0) : existing.is_hero,
      data.is_featured !== undefined ? (data.is_featured ? 1 : 0) : existing.is_featured,
      data.status ?? existing.status,
      data.tags ? JSON.stringify(data.tags) : existing.tags,
      slug
    ).run();

    const updated = await env.DB.prepare(`SELECT * FROM images WHERE slug = ?`).bind(slug).first();

    return Response.json({
      success: true,
      image: parseImage(updated)
    });
  }

  // DELETE /api/images/:slug - Delete image
  if (path.match(/^\/api\/images\/([^/]+)$/) && request.method === 'DELETE') {
    const slug = path.split('/')[4];

    const existing = await env.DB.prepare(`SELECT id FROM images WHERE slug = ?`).bind(slug).first();
    if (!existing) {
      return Response.json({ error: 'Image not found' }, { status: 404 });
    }

    await env.DB.prepare(`DELETE FROM images WHERE slug = ?`).bind(slug).run();

    return Response.json({ success: true });
  }

  // POST /api/images/batch - Batch register images
  if (path === '/api/images/batch' && request.method === 'POST') {
    const images = await request.json();

    if (!Array.isArray(images)) {
      return Response.json({ error: 'Array of images required' }, { status: 400 });
    }

    const results: any[] = [];
    const errors: string[] = [];

    for (const img of images) {
      if (!img.slug || !img.url) {
        errors.push(`${img.slug || 'unknown'}: slug and url required`);
        continue;
      }

      try {
        const existing = await env.DB.prepare(`SELECT id FROM images WHERE slug = ?`).bind(img.slug).first();
        if (existing) {
          // Update instead
          await env.DB.prepare(`
            UPDATE images SET
              alt = ?, title = ?, url = ?, is_hero = ?, is_featured = ?, status = ?,
              updated_at = datetime('now')
            WHERE slug = ?
          `).bind(
            img.alt || '', img.title || '', img.url,
            img.is_hero ? 1 : 0, img.is_featured ? 1 : 0, img.status || 'published',
            img.slug
          ).run();
        } else {
          await env.DB.prepare(`
            INSERT INTO images (slug, alt, title, url, entity_type, entity_slug, format, is_hero, is_featured, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            img.slug, img.alt || '', img.title || '', img.url,
            img.entity_type || 'generic', img.entity_slug || '',
            img.format || 'webp', img.is_hero ? 1 : 0, img.is_featured ? 1 : 0,
            img.status || 'published'
          ).run();
        }
        results.push(img.slug);
      } catch (e: any) {
        errors.push(`${img.slug}: ${e.message}`);
      }
    }

    return Response.json({
      success: results.length,
      errors: errors.length > 0 ? errors : undefined
    });
  }

  return Response.json({
    error: 'Not found',
    endpoints: [
      'GET /api/images - List all images',
      'GET /api/images/stats - Image statistics',
      'GET /api/images/service/:slug - Get service images',
      'GET /api/images/location/:slug - Get location images',
      'GET /api/images/sector/:slug - Get sector images',
      'GET /api/images/:slug - Get single image',
      'POST /api/images - Register new image',
      'PUT /api/images/:slug - Update image',
      'DELETE /api/images/:slug - Delete image',
      'POST /api/images/batch - Batch register images'
    ]
  }, { status: 404 });
}
