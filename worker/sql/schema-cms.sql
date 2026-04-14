-- ============================================
-- GUARDMAN SEO CONTENT SYSTEM - Headless CMS
-- Estructura de D1 como CMS para el sitio
-- ============================================

-- ============================================
-- SERVICIOS (Metadata)
-- ============================================
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_description TEXT,
    price_range TEXT DEFAULT '$$$',
    image TEXT,
    featured INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
    sort INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- SECCIONES DE SERVICIOS
-- Cada sección es un bloque independiente
-- ============================================
CREATE TABLE IF NOT EXISTS service_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT NOT NULL,
    section_key TEXT NOT NULL,  -- hero, intro, features, process, stats, faqs, cta, etc.
    section_order INTEGER DEFAULT 0,
    
    -- Contenido estructurado
    heading TEXT,
    subheading TEXT,
    content_json TEXT,          -- Array de items o párrafos
    
    -- Metadata
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
    word_count INTEGER DEFAULT 0,
    generated_at TEXT DEFAULT (datetime('now')),
    
    UNIQUE(service_slug, section_key)
);

-- ============================================
-- UBICACIONES (Metadata)
-- ============================================
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    zone TEXT,                  -- Oriente, Centro, Industrial, Norte
    status TEXT DEFAULT 'draft',
    sort INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- SECCIONES DE UBICACIONES
-- ============================================
CREATE TABLE IF NOT EXISTS location_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_slug TEXT NOT NULL,
    section_key TEXT NOT NULL,  -- hero, intro, coverage, stats, faqs, cta
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
-- KEYWORDS Y SEO DATA (ya existente)
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
    site_type TEXT,             -- own, competitor, directory, blog
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

-- ============================================
-- SEED DATA - Services
-- ============================================
INSERT OR IGNORE INTO services (slug, name, short_description, price_range, featured, sort) VALUES
('guardias-de-seguridad', 'Guardias de Seguridad', 'Guardias con certificación OS-10 vigente y respaldo de centro de monitoreo propio, disponibles 24/7.', '$$$', 1, 1),
('cctv-videovigilancia', 'CCTV y Videovigilancia', 'Sistemas de cámaras de última generación con monitoreo 24/7 y acceso remoto.', '$$$$', 1, 2),
('control-de-accesos', 'Control de Accesos', 'Sistemas biométricos y RFID para control de ingresos en empresas y condominos.', '$$$', 1, 3),
('escoltas-privados', 'Escoltas Privados', 'Protección personal para ejecutivos y personalidades con guardias OS-10.', '$$$$', 0, 4),
('monitoreo-24-7', 'Monitoreo 24/7', 'Centro de monitoreo propio con operadores capacitados las 24 horas.', '$$$', 1, 5),
('seguridad-eventos', 'Seguridad para Eventos', 'Protección profesional para eventos corporativos, sociales y masivos.', '$$$', 0, 6),
('seguridad-industrial', 'Seguridad Industrial', 'Vigilancia para fábricas, bodegas y centros logísticos.', '$$$', 0, 7),
('auditoria-seguridad', 'Auditoría de Seguridad', 'Evaluación profesional de vulnerabilidades y plan de mejoras.', '$$$', 0, 8),
('guard-pod', 'Guard Pod', 'Unidades móviles de vigilancia autónoma para obras y eventos.', '$$$', 1, 9);

-- ============================================
-- SEED DATA - Locations
-- ============================================
INSERT OR IGNORE INTO locations (slug, name, zone, sort) VALUES
('santiago-centro', 'Santiago Centro', 'Centro', 1),
('las-condes', 'Las Condes', 'Oriente', 2),
('vitacura', 'Vitacura', 'Oriente', 3),
('huechuraba', 'Huechuraba', 'Norte', 4),
('quilicura', 'Quilicura', 'Norte', 5),
('lo-barnechea', 'Lo Barnechea', 'Oriente', 6),
('la-reina', 'La Reina', 'Oriente', 7),
('renca', 'Renca', 'Norte', 8),
('pudahuel', 'Pudahuel', 'Norte', 9),
('la-pintana', 'La Pintana', 'Sur', 10),
('lampa', 'Lampa', 'Norte', 11),
('conchali', 'Conchalí', 'Norte', 12),
('los-andes', 'Los Andes', 'Norte', 13),
('san-felipe', 'San Felipe', 'Norte', 14);

-- ============================================
-- SECTION KEYS STANDARD
-- ============================================
-- hero:       H1, subtitle, cta_text
-- intro:      Array de párrafos
-- features:   Array de items (para cards/grids)
-- process:    Array de pasos (step, description)
-- issues:     Array de problemas que solucionan
-- stats:      Array de estadísticas (label, value)
-- faqs:       Array de preguntas y respuestas
-- cta:        Título, descripción, botón
-- locations:  Array de ubicaciones disponibles