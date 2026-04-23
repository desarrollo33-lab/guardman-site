-- ============================================================
-- CAPA 1: CMS Template Schema Extension
-- Agrega tablas para edición completa de contenido
-- y workflow de aprobación con MiniMax
-- ============================================================

-- Content versions para cada servicio
CREATE TABLE IF NOT EXISTS content_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL CHECK(entity_type IN ('service', 'location', 'sector')),
    entity_slug TEXT NOT NULL,
    version INTEGER NOT NULL,
    content_json TEXT NOT NULL,
    generated_by TEXT DEFAULT 'manual' CHECK(generated_by IN ('manual', 'ai', 'hybrid')),
    llm_model TEXT,
    llm_tokens_used INTEGER DEFAULT 0,
    confidence_score INTEGER,
    word_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(entity_type, entity_slug, version)
);

-- Research cache para datos de Serper/OSM
CREATE TABLE IF NOT EXISTS research_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    entity_slug TEXT NOT NULL,
    source TEXT NOT NULL CHECK(source IN ('serper', 'osm', 'crawl', 'manual')),
    query_key TEXT NOT NULL,
    data_json TEXT NOT NULL,
    fetched_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT,
    UNIQUE(entity_type, entity_slug, source, query_key)
);

-- SEO validation results
CREATE TABLE IF NOT EXISTS seo_validations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    entity_slug TEXT NOT NULL,
    check_type TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    passed INTEGER DEFAULT 0,
    issues_json TEXT,
    suggestions_json TEXT,
    validated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(entity_type, entity_slug, check_type)
);

-- Workflow status para cada entidad
CREATE TABLE IF NOT EXISTS workflow_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    entity_slug TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK(status IN (
        'draft',           -- Creado, sin contenido
        'researching',     -- Pesquisando con Serper
        'researched',      -- Research completado
        'generating',      -- Generando con AI
        'reviewing',       -- En revisión
        'approved',        -- Aprobado
        'published',       -- Deployado
        'rejected'         -- Rechazado
    )),
    current_layer INTEGER DEFAULT 1,
    layer_data_json TEXT,
    ai_model_used TEXT,
    generation_count INTEGER DEFAULT 0,
    last_generated_at TEXT,
    reviewed_by TEXT,
    reviewed_at TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(entity_type, entity_slug)
);

-- Competitor analysis cache
CREATE TABLE IF NOT EXISTS competitor_analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    entity_slug TEXT NOT NULL,
    competitor_domain TEXT NOT NULL,
    serp_position INTEGER,
    site_pages_crawled INTEGER DEFAULT 0,
    has_blog INTEGER DEFAULT 0,
    has_faq INTEGER DEFAULT 0,
    has_schema INTEGER DEFAULT 0,
    has_contact_form INTEGER DEFAULT 0,
    content_quality TEXT,
    seo_score INTEGER DEFAULT 0,
    services_listed TEXT,
    keywords_found TEXT,
    weaknesses TEXT,
    crawl_job_id TEXT,
    crawled_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(entity_type, entity_slug, competitor_domain)
);

-- Audit reports
CREATE TABLE IF NOT EXISTS audit_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    entity_slug TEXT NOT NULL,
    seo_score INTEGER DEFAULT 0,
    content_score INTEGER DEFAULT 0,
    technical_score INTEGER DEFAULT 0,
    overall_score INTEGER DEFAULT 0,
    checks_json TEXT NOT NULL,
    decision TEXT NOT NULL CHECK(decision IN ('APPROVED', 'REJECTED', 'REVISION_REQUIRED')),
    notes TEXT,
    auditor TEXT,
    audited_at TEXT DEFAULT (datetime('now'))
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_content_versions_entity 
    ON content_versions(entity_type, entity_slug);

CREATE INDEX IF NOT EXISTS idx_research_cache_entity 
    ON research_cache(entity_type, entity_slug);

CREATE INDEX IF NOT EXISTS idx_workflow_status_entity 
    ON workflow_status(entity_type, entity_slug);

CREATE INDEX IF NOT EXISTS idx_competitor_analysis_entity 
    ON competitor_analysis(entity_type, entity_slug);
