-- ============================================
-- SECCIONES DE SERVICIOS
-- Cada sección es un bloque independiente para el layout
-- ============================================
CREATE TABLE IF NOT EXISTS service_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT NOT NULL,
    section_key TEXT NOT NULL,
    section_order INTEGER DEFAULT 0,
    
    heading TEXT,
    subheading TEXT,
    content_json TEXT,
    
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
    word_count INTEGER DEFAULT 0,
    generated_at TEXT DEFAULT (datetime('now')),
    
    UNIQUE(service_slug, section_key)
);

-- ============================================
-- SECCIONES DE UBICACIONES
-- ============================================
CREATE TABLE IF NOT EXISTS location_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_slug TEXT NOT NULL,
    section_key TEXT NOT NULL,
    section_order INTEGER DEFAULT 0,
    
    heading TEXT,
    subheading TEXT,
    content_json TEXT,
    
    status TEXT DEFAULT 'draft',
    word_count INTEGER DEFAULT 0,
    generated_at TEXT DEFAULT (datetime('now')),
    
    UNIQUE(location_slug, section_key)
);

-- ============================================
-- COMBINACIONES (Servicio × Ubicación)
-- ============================================
CREATE TABLE IF NOT EXISTS combos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT NOT NULL,
    location_slug TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(service_slug, location_slug)
);

-- ============================================
-- SECCIONES DE COMBINACIONES
-- ============================================
CREATE TABLE IF NOT EXISTS combo_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT NOT NULL,
    location_slug TEXT NOT NULL,
    section_key TEXT NOT NULL,
    section_order INTEGER DEFAULT 0,
    
    heading TEXT,
    content_json TEXT,
    
    status TEXT DEFAULT 'draft',
    word_count INTEGER DEFAULT 0,
    generated_at TEXT DEFAULT (datetime('now')),
    
    UNIQUE(service_slug, location_slug, section_key)
);

-- ============================================
-- KEYWORDS Y SEO DATA (ya existente - verificar si necesita ajustes)
-- ============================================
CREATE TABLE IF NOT EXISTS keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT NOT NULL,
    location_slug TEXT,
    keyword TEXT NOT NULL,
    intent TEXT,
    sds_score REAL DEFAULT 0,
    sds_tier TEXT CHECK(sds_tier IN ('easy', 'moderate', 'competitive', 'hard')),
    is_easy_win INTEGER DEFAULT 0,
    priority_score INTEGER DEFAULT 50,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS competitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT NOT NULL,
    service_slug TEXT,
    location_slug TEXT,
    site_type TEXT,
    avg_position REAL,
    is_guardman INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_service_sections_slug ON service_sections(service_slug);
CREATE INDEX IF NOT EXISTS idx_location_sections_slug ON location_sections(location_slug);
CREATE INDEX IF NOT EXISTS idx_combo_sections_combo ON combo_sections(service_slug, location_slug);
CREATE INDEX IF NOT EXISTS idx_keywords_service ON keywords(service_slug);
CREATE INDEX IF NOT EXISTS idx_keywords_easy ON keywords(is_easy_win) WHERE is_easy_win = 1;