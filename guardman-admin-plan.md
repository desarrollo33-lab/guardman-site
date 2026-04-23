# GuardMan Admin Panel - Plan de Implementación Completo

**Proyecto:** Sistema de gestión de contenido para GuardMan Chile  
**Stack:** Cloudflare Dynamic Workers + React + D1 + R2  
**Fecha:** 14 Abril 2026  
**Worker API:** https://guardman-agent.oficinadesarrollo33.workers.dev  
**D1 Database:** guardman-seo (ID: aeaab85c-d4df-46c4-96b9-28d6a95aaec4)

---

## Tabla de Contenidos

1. [Arquitectura del Sistema](#arquitectura)
2. [Estructura de Archivos](#estructura)
3. [Wrangler Configuration](#wrangler)
4. [D1 Schema Actualizado](#d1-schema)
5. [Dynamic Workers - Código Completo](#workers)
6. [React Admin Panel - Código Completo](#react-admin)
7. [Endpoints API](#endpoints)
8. [Pasos de Implementación](#pasos)
9. [Deployment](#deployment)
10. [Prompt de Ejecución Automática](#prompt)

---

## 1. Arquitectura del Sistema {#arquitectura}

```
┌─────────────────────────────────────────────────────────────────┐
│                    GUARDMAN ADMIN PANEL                          │
│                 guardman-admin.pages.dev                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │              REACT ADMIN SPA (Cloudflare Pages)          │     │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐         │     │
│  │  │ Services  │  │ Locations │  │  Sectors  │  ...   │     │
│  │  │  Editor   │  │  Editor   │  │   Editor   │         │     │
│  │  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘         │     │
│  │        │              │              │                 │     │
│  │        └──────────────┼──────────────┘                 │     │
│  │                         │                                 │     │
│  │  ┌─────────────────────┼─────────────────────────┐    │     │
│  │  │              CODE EDITOR (Monaco)              │    │     │
│  │  │  - Syntax highlighting                        │    │     │
│  │  │  - Auto-completion para APIs                  │    │     │
│  │  │  - Preview en tiempo real                     │    │     │
│  │  └─────────────────────┬─────────────────────────┘    │     │
│  └───────────────────────┼───────────────────────────────┘     │
│                          │ POST /api/execute                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              GUARDMAN AGENT (Dynamic Workers)                    │
│           guardman-agent.oficinadesarrollo33.workers.dev         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐     │
│  │                  DYNAMIC WORKER HOST                      │     │
│  │                                                              │     │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │     │
│  │  │  SERVICES   │  │  LOCATIONS  │  │  SECTORS   │     │     │
│  │  │   LOADER    │  │   LOADER    │  │   LOADER   │     │     │
│  │  │   (CRUD)    │  │    (CRUD)    │  │    (CRUD)   │     │     │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │     │
│  │         │                 │                  │             │     │
│  │  ┌──────┴─────────────────┴──────────────────┴──────┐    │     │
│  │  │                  PERMISSIONS LAYER                  │    │     │
│  │  │  - Allowed bindings: DB, R2, KV                     │    │     │
│  │  │  - Denied: filesystem, external network          │    │     │
│  │  └─────────────────────────┬────────────────────────────┘    │     │
│  └───────────────────────────┼────────────────────────────────┘     │
│                              │                                      │
│              ┌───────────────┼───────────────┐                      │
│              ▼               ▼               ▼                      │
│  ┌───────────────────┐ ┌───────────┐ ┌───────────────────┐        │
│  │       D1          │ │    R2     │ │        KV        │        │
│  │  guardman-seo   │ │  images   │ │     sessions     │        │
│  └───────────────────┘ └───────────┘ └───────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Estructura de Archivos {#estructura}

```
guardman-admin/
├── wrangler.jsonc                    # Configuración del Worker
├── package.json                      # Dependencias
├── tsconfig.json                     # TypeScript config
├── vite.config.ts                    # Vite config
│
├── src/
│   ├── index.html                   # HTML entry point
│   │
│   ├── host.ts                      # Dynamic Worker host principal
│   │
│   ├── workers/
│   │   ├── types.ts                # Tipos compartidos
│   │   ├── permissions.ts           # Sistema de permisos
│   │   │
│   │   ├── loaders/
│   │   │   ├── services.loader.ts   # CRUD de servicios
│   │   │   ├── locations.loader.ts  # CRUD de ubicaciones
│   │   │   ├── sectors.loader.ts    # CRUD de sectores
│   │   │   ├── sections.loader.ts   # CRUD de secciones
│   │   │   ├── images.loader.ts     # Gestión de imágenes
│   │   │   └── research.loader.ts   # Investigación SEO
│   │   │
│   │   └── templates/
│   │       ├── service.template.ts   # Template para crear servicio
│   │       ├── section.template.ts   # Template para sección
│   │       └── image.template.ts    # Template para imagen
│   │
│   ├── admin/                      # React Admin SPA
│   │   ├── main.tsx                 # Entry point React
│   │   ├── App.tsx                 # Componente principal
│   │   │
│   │   ├── components/
│   │   │   ├── Layout.tsx          # Layout principal
│   │   │   ├── Sidebar.tsx         # Navegación lateral
│   │   │   ├── Header.tsx         # Header con usuario
│   │   │
│   │   │   ├── editors/
│   │   │   │   ├── CodeEditor.tsx  # Editor Monaco
│   │   │   │   ├── SectionEditor.tsx # Editor de secciones
│   │   │   │   ├── JSONEditor.tsx   # Editor JSON genérico
│   │   │   │   └── RichTextEditor.tsx # Editor rich text
│   │   │
│   │   │   ├── forms/
│   │   │   │   ├── ServiceForm.tsx  # Formulario de servicio
│   │   │   │   ├── LocationForm.tsx  # Formulario de ubicación
│   │   │   │   ├── SectorForm.tsx   # Formulario de sector
│   │   │   │   └── ImageUpload.tsx  # Upload de imágenes
│   │   │
│   │   │   ├── lists/
│   │   │   │   ├── ServiceList.tsx  # Lista de servicios
│   │   │   │   ├── LocationList.tsx # Lista de ubicaciones
│   │   │   │   ├── SectorList.tsx   # Lista de sectores
│   │   │   │   └── ImageGallery.tsx # Galería de imágenes
│   │   │
│   │   └── ui/                 # Componentes UI base
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Table.tsx
│   │       ├── Tabs.tsx
│   │       └── Toast.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx       # Overview
│   │   ├── Services.tsx        # Gestión servicios
│   │   ├── Locations.tsx       # Gestión ubicaciones
│   │   ├── Sectors.tsx         # Gestión sectores
│   │   ├── Images.tsx          # Gestión imágenes
│   │   ├── SEO.tsx             # Investigación SEO
│   │   └── Settings.tsx        # Configuraciones
│   │
│   ├── hooks/
│   │   ├── useAPI.ts           # Hook para llamadas API
│   │   ├── useAuth.ts          # Hook de autenticación
│   │   └── useToast.ts         # Hook para notificaciones
│   │
│   └── styles/
│       └── global.css          # Estilos globales
│
├── public/
│   └── favicon.svg
│
└── tests/
    ├── workers.test.ts             # Tests de workers
    └── api.test.ts                 # Tests de API
```

---

## 3. Wrangler Configuration {#wrangler}

### wrangler.jsonc

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  
  "name": "guardman-agent",
  "main": "src/host.ts",
  "compatibility_date": "2024-01-01",
  
  // Assets para servir el admin SPA
  "assets": {
    "not_found_handling": "single-page-application",
    "run_worker_first": ["/api/*", "/_admin/*"]
  },
  
  // Dynamic Workers binding - REQUIERE PLAN PAGADO
  "worker_loaders": [
    {
      "binding": "LOADER",
    }
  ],
  
  // D1 Database
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "guardman-seo",
      "database_id": "aeaab85c-d4df-46c4-96b9-28d6a95aaec4"
    }
  ],
  
  // R2 Bucket para imágenes
  "r2_buckets": [
    {
      "binding": "IMAGES",
      "bucket_name": "guardman-images"
    }
  ],
  
  // KV para sesiones
  "kv_namespaces": [
    {
      "binding": "SESSIONS",
      "id": "tu-kv-id-aqui"
    }
  ],
  
  // AI binding
  "ai": {},
  
  // Vars
  "vars": {
    "ENVIRONMENT": "production",
    "ADMIN_EMAIL": "admin@guardman.cl"
  },
}
```

---

## 4. D1 Schema Actualizado {#d1-schema}

### Tablas adicionales para el Admin

```sql
-- =============================================
-- ADMIN USERS
-- =============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'editor' CHECK(role IN ('admin', 'editor', 'viewer')),
    avatar_url TEXT,
    last_login_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_admin_email ON admin_users(email);

-- =============================================
-- CONTENT VERSIONS (Audit Trail)
-- =============================================
CREATE TABLE IF NOT EXISTS content_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL CHECK(entity_type IN ('service', 'location', 'sector', 'combo')),
    entity_slug TEXT NOT NULL,
    version_number INTEGER NOT NULL,
    content_json TEXT NOT NULL,
    changed_by TEXT NOT NULL,
    change_summary TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(entity_type, entity_slug, version_number)
);

CREATE INDEX idx_versions_entity ON content_versions(entity_type, entity_slug);

-- =============================================
-- PUBLISH QUEUE
-- =============================================
CREATE TABLE IF NOT EXISTS publish_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    entity_slug TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'published', 'failed')),
    scheduled_at TEXT,
    published_at TEXT,
    error_message TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_publish_status ON publish_queue(status, scheduled_at);

-- =============================================
-- MEDIA LIBRARY (Extiende images existente)
-- =============================================
CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    original_filename TEXT,
    mime_type TEXT,
    size_bytes INTEGER,
    width INTEGER,
    height INTEGER,
    alt_text TEXT,
    caption TEXT,
    credits TEXT,
    entity_type TEXT,
    entity_slug TEXT,
    r2_key TEXT NOT NULL,
    cdn_url TEXT,
    status TEXT DEFAULT 'uploaded' CHECK(status IN ('uploaded', 'processing', 'published', 'archived')),
    usage_count INTEGER DEFAULT 0,
    tags TEXT,
    created_by TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_media_status ON media(status);
CREATE INDEX idx_media_entity ON media(entity_type, entity_slug);

-- =============================================
-- SEO ANALYTICS
-- =============================================
CREATE TABLE IF NOT EXISTS seo_analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    entity_slug TEXT NOT NULL,
    keyword TEXT NOT NULL,
    position INTEGER,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr REAL,
    checked_at TEXT DEFAULT (datetime('now')),
    UNIQUE(entity_type, entity_slug, keyword, checked_at)
);

CREATE INDEX idx_seo_entity ON seo_analytics(entity_type, entity_slug);
```

---

## 5. Dynamic Workers - Código Completo {#workers}

### 5.1 Host Principal (src/host.ts)

```typescript
/**
 * GuardMan Agent Host - Dynamic Workers
 */

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  SESSIONS: KVNamespace;
  AI: Ai;
  LOADER: WorkerLoader;
  AUTH_TOKEN: string;
  ENVIRONMENT: string;
  ADMIN_EMAIL: string;
}

interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

const WORKER_TEMPLATES = {
  services: `
// Template: Services CRUD
export default {
  async fetch(request, env) {
    const { action, id, data } = await request.json();
    
    if (action === 'list') {
      const { results } = await env.DB
        .prepare('SELECT * FROM services ORDER BY name')
        .all();
      return Response.json({ ok: true, data: results });
    }
    
    if (action === 'get') {
      const result = await env.DB
        .prepare('SELECT * FROM services WHERE slug = ?')
        .bind(id)
        .first();
      return Response.json({ ok: true, data: result });
    }
    
    if (action === 'create') {
      const { slug, name, short_description } = data;
      await env.DB
        .prepare(\`
          INSERT INTO services (slug, name, short_description, status)
          VALUES (?, ?, ?, 'pending')
        \`)
        .bind(slug, name, short_description)
        .run();
      return Response.json({ ok: true });
    }
    
    if (action === 'update') {
      const { name, short_description, status } = data;
      await env.DB
        .prepare(\`
          UPDATE services 
          SET name = ?, short_description = ?, status = ?, updated_at = datetime('now')
          WHERE slug = ?
        \`)
        .bind(name, short_description, status, id)
        .run();
      return Response.json({ ok: true });
    }
    
    return Response.json({ ok: false, error: 'Unknown action' }, { status: 400 });
  }
};
`,

  locations: `
// Template: Locations CRUD
export default {
  async fetch(request, env) {
    const { action, id } = await request.json();
    
    if (action === 'list') {
      const { results } = await env.DB
        .prepare('SELECT * FROM locations ORDER BY name')
        .all();
      return Response.json({ ok: true, data: results });
    }
    
    if (action === 'get') {
      const result = await env.DB
        .prepare('SELECT * FROM locations WHERE slug = ?')
        .bind(id)
        .first();
      return Response.json({ ok: true, data: result });
    }
    
    return Response.json({ ok: false, error: 'Unknown action' }, { status: 400 });
  }
};
`,

  sections: `
// Template: Sections CRUD
export default {
  async fetch(request, env) {
    const { action, serviceSlug, sectionKey, data } = await request.json();
    
    if (action === 'get') {
      const { results } = await env.DB
        .prepare(\`
          SELECT * FROM service_sections 
          WHERE service_slug = ? 
          ORDER BY section_order
        \`)
        .bind(serviceSlug)
        .all();
      return Response.json({ ok: true, data: results });
    }
    
    if (action === 'update') {
      const { heading, subheading, content_json } = data;
      await env.DB
        .prepare(\`
          UPDATE service_sections 
          SET heading = ?, subheading = ?, content_json = ?,
              updated_at = datetime('now')
          WHERE service_slug = ? AND section_key = ?
        \`)
        .bind(heading, subheading, content_json, serviceSlug, sectionKey)
        .run();
      return Response.json({ ok: true });
    }
    
    return Response.json({ ok: false, error: 'Unknown action' }, { status: 400 });
  }
};
`,

  images: `
// Template: Images CRUD with R2
export default {
  async fetch(request, env) {
    const { action, slug, data } = await request.json();
    
    if (action === 'list') {
      const { results } = await env.DB
        .prepare('SELECT * FROM images ORDER BY created_at DESC LIMIT 100')
        .all();
      return Response.json({ ok: true, data: results });
    }
    
    if (action === 'upload') {
      const { filename, content, contentType } = data;
      const ext = filename.split('.').pop() || 'webp';
      const key = 'images/' + slug + '.' + ext;
      
      await env.IMAGES.put(key, content, {
        httpMetadata: { contentType }
      });
      
      await env.DB
        .prepare(\`
          INSERT INTO images (slug, url, entity_type, status)
          VALUES (?, ?, ?, 'uploaded')
        \`)
        .bind(slug, '/' + key, data.entity_type || 'generic')
        .run();
      
      return Response.json({ ok: true, data: { url: '/' + key } });
    }
    
    return Response.json({ ok: false, error: 'Unknown action' }, { status: 400 });
  }
};
`
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    
    const authHeader = request.headers.get('Authorization');
    if (path !== '/health' && path !== '/api/login' && authHeader !== 'Bearer ' + env.AUTH_TOKEN) {
      return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }
    
    try {
      if (path === '/api/templates' && request.method === 'GET') {
        return Response.json({ ok: true, data: Object.keys(WORKER_TEMPLATES) }, { headers: corsHeaders });
      }
      
      if (path.startsWith('/api/templates/') && request.method === 'GET') {
        const templateName = path.split('/')[3];
        const code = WORKER_TEMPLATES[templateName as keyof typeof WORKER_TEMPLATES];
        if (!code) {
          return Response.json({ ok: false, error: 'Not found' }, { status: 404, headers: corsHeaders });
        }
        return Response.json({ ok: true, data: { code } }, { headers: corsHeaders });
      }
      
      if (path === '/api/execute/template' && request.method === 'POST') {
        const { template, data } = await request.json();
        const code = WORKER_TEMPLATES[template as keyof typeof WORKER_TEMPLATES];
        
        if (!code) {
          return Response.json({ ok: false, error: 'Template not found' }, { status: 404, headers: corsHeaders });
        }
        
        const worker = await env.LOADER.load({
          compatibilityDate: '2024-01-01',
          mainModule: 'worker.js',
          modules: { 'worker.js': code },
          globalOutbound: null,
          bindings: { DB: env.DB, IMAGES: env.IMAGES },
        });
        
        const result = await worker.getEntrypoint().fetch(
          new Request('https://internal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
        );
        
        const text = await result.text();
        
        return new Response(text, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      if (path === '/api/login' && request.method === 'POST') {
        const { email, password } = await request.json();
        
        if (email === env.ADMIN_EMAIL && password === env.AUTH_TOKEN) {
          const token = btoa(email + ':' + Date.now());
          return Response.json({
            ok: true,
            data: { token, user: { email, name: 'Admin' } }
          }, { headers: corsHeaders });
        }
        
        return Response.json({ ok: false, error: 'Invalid credentials' }, { status: 401, headers: corsHeaders });
      }
      
      if (path === '/health') {
        return Response.json({
          ok: true,
          status: 'healthy',
          timestamp: new Date().toISOString(),
          templates: Object.keys(WORKER_TEMPLATES).length
        }, { headers: corsHeaders });
      }
      
      return Response.json({
        ok: false,
        error: 'Not found',
        routes: [
          'GET /health',
          'POST /api/login',
          'GET /api/templates',
          'POST /api/execute/template'
        ]
      }, { status: 404, headers: corsHeaders });
      
    } catch (error) {
      console.error('Worker error:', error);
      return Response.json({
        ok: false,
        error: error instanceof Error ? error.message : 'Internal error'
      }, { status: 500, headers: corsHeaders });
    }
  }
};
```

### 5.2 Loader de Secciones (src/workers/loaders/sections.loader.ts)

```typescript
/**
 * Sections Loader - CRUD para secciones de contenido
 */

export interface Section {
  id: number;
  service_slug?: string;
  location_slug?: string;
  sector_slug?: string;
  section_key: string;
  section_order: number;
  heading: string;
  subheading?: string;
  content_json: string;
  status: 'pending' | 'published';
  word_count: number;
  generated_at: string;
  updated_at: string;
}

export interface SectionInput {
  heading?: string;
  subheading?: string;
  content_json: string;
  status?: 'pending' | 'published';
}

export class SectionsLoader {
  constructor(private db: D1Database) {}
  
  async getServiceSections(serviceSlug: string): Promise<Section[]> {
    const { results } = await this.db
      .prepare(`
        SELECT * FROM service_sections 
        WHERE service_slug = ?
        ORDER BY section_order
      `)
      .bind(serviceSlug)
      .all();
    
    return results as Section[];
  }
  
  async getSection(
    type: 'service' | 'location' | 'sector',
    slug: string,
    sectionKey: string
  ): Promise<Section | null> {
    const column = `${type}_slug`;
    
    const result = await this.db
      .prepare(`
        SELECT * FROM ${type}_sections 
        WHERE ${column} = ? AND section_key = ?
      `)
      .bind(slug, sectionKey)
      .first();
    
    return result as Section | null;
  }
  
  async updateSection(
    type: 'service' | 'location' | 'sector',
    slug: string,
    sectionKey: string,
    input: SectionInput
  ): Promise<void> {
    const table = `${type}_sections`;
    const column = `${type}_slug`;
    
    const wordCount = (
      (input.heading || '') + ' ' + 
      (input.subheading || '') + ' ' + 
      input.content_json
    ).split(/\s+/).length;
    
    await this.db
      .prepare(`
        UPDATE ${table}
        SET heading = ?, subheading = ?, content_json = ?, status = ?, word_count = ?
        WHERE ${column} = ? AND section_key = ?
      `)
      .bind(
        input.heading || '',
        input.subheading || '',
        input.content_json,
        input.status || 'published',
        wordCount,
        slug,
        sectionKey
      )
      .run();
  }
  
  async getAllSections(
    type: 'service' | 'location' | 'sector',
    slug: string
  ): Promise<Record<string, Section>> {
    const table = `${type}_sections`;
    const column = `${type}_slug`;
    
    const { results } = await this.db
      .prepare(`SELECT * FROM ${table} WHERE ${column} = ?`)
      .bind(slug)
      .all();
    
    const sections: Record<string, Section> = {};
    for (const row of results as Section[]) {
      sections[row.section_key] = row;
    }
    return sections;
  }
  
  async batchUpdate(
    type: 'service' | 'location' | 'sector',
    slug: string,
    sections: Record<string, SectionInput>
  ): Promise<void> {
    for (const [key, input] of Object.entries(sections)) {
      await this.updateSection(type, slug, key, input);
    }
  }
}
```

### 5.3 Loader de Imágenes (src/workers/loaders/images.loader.ts)

```typescript
/**
 * Images Loader - Gestión de imágenes con R2 + D1
 */

export interface Image {
  id: number;
  slug: string;
  alt?: string;
  title?: string;
  description?: string;
  entity_type: 'service' | 'location' | 'sector' | 'page' | 'generic';
  entity_slug?: string;
  filename: string;
  url: string;
  path: string;
  width?: number;
  height?: number;
  size_bytes?: number;
  format?: string;
  usage_pages: string[];
  is_hero: boolean;
  is_featured: boolean;
  status: 'pending' | 'uploaded' | 'published' | 'archived';
  tags: string[];
  created_at: string;
}

export interface ImageInput {
  slug: string;
  alt?: string;
  title?: string;
  description?: string;
  entity_type?: string;
  entity_slug?: string;
  format?: string;
  is_hero?: boolean;
  is_featured?: boolean;
  tags?: string[];
}

export class ImagesLoader {
  constructor(
    private db: D1Database,
    private r2: R2Bucket
  ) {}
  
  async list(
    filters?: {
      entityType?: string;
      entitySlug?: string;
      status?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ images: Image[]; total: number }> {
    let sql = 'SELECT * FROM images WHERE 1=1';
    const params: any[] = [];
    
    if (filters?.entityType) {
      sql += ' AND entity_type = ?';
      params.push(filters.entityType);
    }
    if (filters?.entitySlug) {
      sql += ' AND entity_slug = ?';
      params.push(filters.entitySlug);
    }
    if (filters?.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    if (filters?.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
      if (filters?.offset) {
        sql += ' OFFSET ?';
        params.push(filters.offset);
      }
    }
    
    const { results } = await this.db
      .prepare(sql)
      .bind(...params)
      .all();
    
    let countSql = 'SELECT COUNT(*) as count FROM images WHERE 1=1';
    if (filters?.entityType) countSql += ' AND entity_type = ?';
    if (filters?.entitySlug) countSql += ' AND entity_slug = ?';
    
    const { results: countResults } = await this.db
      .prepare(countSql)
      .bind(...(filters?.entityType ? [filters.entityType] : filters?.entitySlug ? [filters.entitySlug] : []))
      .all();
    
    return {
      images: (results as Image[]).map(img => ({
        ...img,
        usage_pages: img.usage_pages ? JSON.parse(img.usage_pages as any) : [],
        tags: img.tags ? JSON.parse(img.tags as any) : []
      })),
      total: (countResults[0] as any).count
    };
  }
  
  async upload(
    file: ArrayBuffer,
    input: ImageInput & { filename: string; contentType: string }
  ): Promise<Image> {
    const { slug, filename, contentType } = input;
    
    const ext = filename.split('.').pop()?.toLowerCase() || 'webp';
    const r2Key = `images/${slug}.${ext}`;
    
    await this.r2.put(r2Key, file, {
      httpMetadata: { contentType }
    });
    
    await this.db
      .prepare(`
        INSERT INTO images (
          slug, url, path, format, entity_type, entity_slug,
          alt, title, description, is_hero, is_featured, status, tags
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'uploaded', ?)
      `)
      .bind(
        slug,
        `/${r2Key}`,
        r2Key,
        ext,
        input.entity_type || 'generic',
        input.entity_slug || '',
        input.alt || '',
        input.title || '',
        input.description || '',
        input.is_hero ? 1 : 0,
        input.is_featured ? 1 : 0,
        JSON.stringify(input.tags || [])
      )
      .run();
    
    const result = await this.db
      .prepare('SELECT * FROM images WHERE slug = ?')
      .bind(slug)
      .first();
    
    return result as Image;
  }
  
  async update(slug: string, input: Partial<ImageInput>): Promise<void> {
    const updates: string[] = [];
    const params: any[] = [];
    
    if (input.alt !== undefined) { updates.push('alt = ?'); params.push(input.alt); }
    if (input.title !== undefined) { updates.push('title = ?'); params.push(input.title); }
    if (input.description !== undefined) { updates.push('description = ?'); params.push(input.description); }
    if (input.entity_type !== undefined) { updates.push('entity_type = ?'); params.push(input.entity_type); }
    if (input.entity_slug !== undefined) { updates.push('entity_slug = ?'); params.push(input.entity_slug); }
    if (input.is_hero !== undefined) { updates.push('is_hero = ?'); params.push(input.is_hero ? 1 : 0); }
    if (input.is_featured !== undefined) { updates.push('is_featured = ?'); params.push(input.is_featured ? 1 : 0); }
    if (input.tags !== undefined) { updates.push('tags = ?'); params.push(JSON.stringify(input.tags)); }
    
    updates.push("updated_at = datetime('now')");
    params.push(slug);
    
    await this.db
      .prepare(`UPDATE images SET ${updates.join(', ')} WHERE slug = ?`)
      .bind(...params)
      .run();
  }
  
  async delete(slug: string): Promise<void> {
    const image = await this.db
      .prepare('SELECT path FROM images WHERE slug = ?')
      .bind(slug)
      .first() as any;
    
    if (image?.path) {
      await this.r2.delete(image.path);
    }
    
    await this.db
      .prepare('DELETE FROM images WHERE slug = ?')
      .bind(slug)
      .run();
  }
  
  async getStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    heroes: number;
    featured: number;
  }> {
    const { results: totalResult } = await this.db
      .prepare('SELECT COUNT(*) as count FROM images')
      .all();
    
    const { results: typeResult } = await this.db
      .prepare(`SELECT entity_type, COUNT(*) as count FROM images GROUP BY entity_type`)
      .all();
    
    const { results: heroResult } = await this.db
      .prepare('SELECT COUNT(*) as count FROM images WHERE is_hero = 1')
      .all();
    
    const { results: featuredResult } = await this.db
      .prepare('SELECT COUNT(*) as count FROM images WHERE is_featured = 1')
      .all();
    
    const byType: Record<string, number> = {};
    for (const row of typeResult as any[]) {
      byType[row.entity_type] = row.count;
    }
    
    return {
      total: (totalResult[0] as any).count,
      byType,
      heroes: (heroResult[0] as any).count,
      featured: (featuredResult[0] as any).count
    };
  }
}
```

---

## 6. React Admin Panel - Código Completo {#react-admin}

### 6.1 App Principal (src/admin/App.tsx)

```tsx
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Building2,
  Image,
  Search,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { ToastProvider, useToast } from './components/ui/Toast';
import { useAPI } from './hooks/useAPI';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'services', label: 'Servicios', icon: Package },
  { id: 'locations', label: 'Ubicaciones', icon: MapPin },
  { id: 'sectors', label: 'Sectores', icon: Building2 },
  { id: 'images', label: 'Imágenes', icon: Image },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

function AdminApp() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  
  const { call, loading } = useAPI();
  const { showToast } = useToast();
  
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await call('/api/login', {
        method: 'POST',
        body: { email, password }
      });
      
      if (response.ok) {
        localStorage.setItem('admin_token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
        showToast('Bienvenido', 'success');
      } else {
        showToast(response.error || 'Login fallido', 'error');
      }
    } catch (e) {
      showToast('Error de conexión', 'error');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/logo.svg" alt="GuardMan" className="h-12 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">GuardMan Admin</h1>
            <p className="text-gray-600 mt-2">Gestión de contenido</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            handleLogin(
              formData.get('email') as string,
              formData.get('password') as string
            );
          }}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="admin@guardman.cl"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40
        transform transition-transform lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b">
          <img src="/logo.svg" alt="GuardMan" className="h-8" />
        </div>
        
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${activePage === item.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-50'}
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>
      
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {activePage === 'dashboard' && <Dashboard call={call} />}
          {activePage === 'services' && <Services call={call} loading={loading} />}
          {activePage === 'locations' && <Locations call={call} loading={loading} />}
          {activePage === 'sectors' && <Sectors call={call} loading={loading} />}
          {activePage === 'images' && <Images call={call} loading={loading} />}
        </div>
      </main>
    </div>
  );
}

function Dashboard({ call }: { call: any }) {
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    Promise.all([
      call('/api/execute/template', { method: 'POST', body: { template: 'services', data: { action: 'list' } } }),
      call('/api/execute/template', { method: 'POST', body: { template: 'locations', data: { action: 'list' } } }),
      call('/api/execute/template', { method: 'POST', body: { template: 'images', data: { action: 'list' } } }),
    ]).then(([s, l, i]) => {
      setStats({
        services: s.data?.length || 0,
        locations: l.data?.length || 0,
        images: i.data?.length || 0
      });
    });
  }, []);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-4xl font-bold text-blue-600">{stats?.services || 0}</h3>
          <p className="text-gray-600 mt-2">Servicios</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-4xl font-bold text-green-600">{stats?.locations || 0}</h3>
          <p className="text-gray-600 mt-2">Ubicaciones</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-4xl font-bold text-purple-600">{stats?.images || 0}</h3>
          <p className="text-gray-600 mt-2">Imágenes</p>
        </div>
      </div>
    </div>
  );
}

function Services({ call, loading }: { call: any; loading: boolean }) {
  const [services, setServices] = useState<any[]>([]);
  
  useEffect(() => {
    call('/api/execute/template', { method: 'POST', body: { template: 'services', data: { action: 'list' } } })
      .then(r => r.ok && setServices(r.data));
  }, []);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Servicios</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actualizado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map(service => (
              <tr key={service.slug} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{service.name}</td>
                <td className="px-6 py-4 text-gray-500 font-mono text-sm">{service.slug}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    service.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {service.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-sm">
                  {new Date(service.updated_at).toLocaleDateString('es-CL')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <div className="p-8 text-center text-gray-500">Cargando...</div>}
      </div>
    </div>
  );
}

function Locations({ call, loading }: { call: any; loading: boolean }) {
  const [locations, setLocations] = useState<any[]>([]);
  
  useEffect(() => {
    call('/api/execute/template', { method: 'POST', body: { template: 'locations', data: { action: 'list' } } })
      .then(r => r.ok && setLocations(r.data));
  }, []);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ubicaciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map(location => (
          <div key={location.slug} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold text-gray-900">{location.name}</h3>
            <p className="text-gray-500 text-sm mt-1">{location.zone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sectors({ call, loading }: { call: any; loading: boolean }) {
  const [sectors, setSectors] = useState<any[]>([]);
  
  useEffect(() => {
    call('/api/execute/template', { method: 'POST', body: { template: 'locations', data: { action: 'list' } } })
      .then(r => {
        // Los sectores están en locations con zone = sector
        if (r.ok) {
          const uniqueSectors = [...new Set(r.data?.map((l: any) => l.zone) || [])];
          setSectors(uniqueSectors.map(s => ({ name: s, slug: s.toLowerCase().replace(/\s+/g, '-') })));
        }
      });
  }, []);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sectores</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sectors.map(sector => (
          <div key={sector.slug} className="bg-white p-4 rounded-xl shadow text-center">
            <h3 className="font-semibold text-gray-900">{sector.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

function Images({ call, loading }: { call: any; loading: boolean }) {
  const [images, setImages] = useState<any[]>([]);
  
  useEffect(() => {
    call('/api/execute/template', { method: 'POST', body: { template: 'images', data: { action: 'list' } } })
      .then(r => r.ok && setImages(r.data));
  }, []);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Imágenes ({images.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map(img => (
          <div key={img.slug} className="bg-white p-3 rounded-xl shadow">
            <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
              <Image size={24} className="text-gray-400" />
            </div>
            <p className="font-medium text-sm truncate">{img.slug}</p>
            <p className="text-gray-500 text-xs">{img.entity_type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AdminApp />
    </ToastProvider>
  );
}
```

### 6.2 Componente Toast (src/admin/components/ui/Toast.tsx)

```tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);
  
  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };
  
  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    warning: <AlertCircle className="text-yellow-500" size={20} />
  };
  
  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <span className="text-gray-700">{toast.message}</span>
            <button onClick={() => dismissToast(toast.id)} className="ml-2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
```

### 6.3 Hook useAPI (src/admin/hooks/useAPI.ts)

```tsx
import { useState, useCallback } from 'react';

const API_BASE = 'https://guardman-agent.oficinadesarrollo33.workers.dev';

export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const call = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('admin_token');
    
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      } as any);
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error);
      }
      
      return data;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Network error';
      setError(message);
      return { ok: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { call, loading, error };
}
```

---

## 7. Endpoints API {#endpoints}

| Método | Endpoint | Descripción | Permisos |
|--------|----------|-------------|----------|
| GET | `/api/templates` | Listar templates | Admin |
| GET | `/api/templates/:name` | Get template code | Admin |
| POST | `/api/execute/template` | Ejecutar template | Admin |
| POST | `/api/login` | Login admin | Public |
| GET | `/health` | Health check | Public |

---

## 8. Pasos de Implementación {#pasos}

### Fase 1: Setup (1 día)
1. Crear proyecto: `mkdir guardman-admin && cd guardman-admin`
2. Instalar dependencias: `npm install react react-dom lucide-react tailwindcss`
3. Configurar wrangler.jsonc
4. Crear tsconfig.json, vite.config.ts

### Fase 2: Worker Host (1 día)
5. Crear src/host.ts con templates
6. Test local: `wrangler dev`

### Fase 3: React SPA (3 días)
7. Crear estructura src/admin/
8. Implementar App.tsx con login y layout
9. Implementar páginas: Dashboard, Services, Locations, Images
10. Implementar componentes: Toast, useAPI

### Fase 4: Deployment (1 día)
11. Build: `npm run build`
12. Deploy Worker: `wrangler deploy`
13. Deploy Pages: `wrangler pages deploy dist`

---

## 9. Deployment {#deployment}

```bash
# Login
wrangler login

# Deploy Worker
wrangler deploy

# Verificar
curl https://guardman-agent.oficinadesarrollo33.workers.dev/health

# Build React
npm run build

# Deploy Pages
wrangler pages deploy dist --project-name=guardman-admin
```

---

## 10. Prompt de Ejecución Automática {#prompt}

Ver archivo: `guardman-admin-PROMPT.md` (en esta misma carpeta)

---

## Referencias

- [Dynamic Workers](https://developers.cloudflare.com/workers/runtime-apis/bindings/worker-loader/)
- [D1 Database](https://developers.cloudflare.com/d1/)
- [R2 Storage](https://developers.cloudflare.com/r2/)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
