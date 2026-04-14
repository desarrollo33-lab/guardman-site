-- =============================================
-- GUARDMAN SEO - D1 Schema
-- Almacena todo: research recibido + contenido generado
-- =============================================

-- =============================================
-- CAPA 1: SERVICIOS BASE
-- =============================================
CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    short_description TEXT,
    price_range TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'researched', 'generating', 'completed', 'error')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- CAPA 2: UBICACIONES BASE
-- =============================================
CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    zone TEXT,
    region TEXT DEFAULT 'Metropolitana',
    latitude REAL,
    longitude REAL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'researched', 'generating', 'completed', 'error')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- CAPA 3: RESEARCH - QUERIES A SERPER
-- =============================================
CREATE TABLE IF NOT EXISTS serper_queries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT NOT NULL,
    location_slug TEXT NOT NULL,
    query_text TEXT NOT NULL,
    endpoint TEXT NOT NULL CHECK(endpoint IN ('search', 'autocomplete', 'places')),
    response_json TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'completed', 'failed')),
    credits_used INTEGER DEFAULT 0,
    executed_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(service_slug, location_slug, endpoint, query_text)
);

-- =============================================
-- CAPA 4: RESEARCH - RESULTADOS DE SERPER
-- =============================================
CREATE TABLE IF NOT EXISTS serper_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query_id INTEGER NOT NULL,
    result_type TEXT NOT NULL CHECK(result_type IN (
        'organic', 'knowledge_graph', 'paa', 'local_pack', 
        'related_search', 'place', 'ad'
    )),
    position INTEGER,
    title TEXT,
    link TEXT,
    domain TEXT,
    snippet TEXT,
    rating REAL,
    reviews_count INTEGER,
    address TEXT,
    has_website INTEGER DEFAULT 0,
    site_type TEXT CHECK(site_type IN ('authority', 'directory', 'social', 'weak', 'competitor', 'own')),
    is_cl INTEGER DEFAULT 0,
    extra_json TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (query_id) REFERENCES serper_queries(id)
);

-- =============================================
-- CAPA 5: KEYWORDS EXTRAÍDAS
-- =============================================
CREATE TABLE IF NOT EXISTS keywords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT NOT NULL,
    location_slug TEXT NOT NULL,
    keyword TEXT NOT NULL,
    intent TEXT CHECK(intent IN ('informational', 'transactional', 'navigational', 'commercial')),
    sds_score INTEGER,
    sds_tier TEXT CHECK(sds_tier IN ('easy', 'moderate', 'competitive', 'hard')),
    volume_estimate TEXT,
    cpc_estimate TEXT,
    is_easy_win INTEGER DEFAULT 0,
    priority_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'validated', 'used', 'rejected')),
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(service_slug, location_slug, keyword)
);

CREATE INDEX idx_kw_service_location ON keywords(service_slug, location_slug);
CREATE INDEX idx_kw_sds ON keywords(sds_score);
CREATE INDEX idx_kw_easy_win ON keywords(is_easy_win);

-- =============================================
-- CAPA 6: COMPETITORS ANALYZED
-- =============================================
CREATE TABLE IF NOT EXISTS competitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    domain TEXT NOT NULL,
    service_slug TEXT,
    location_slug TEXT,
    site_type TEXT,
    is_guardman INTEGER DEFAULT 0,
    avg_position REAL,
    content_quality_score INTEGER,
    weaknesses TEXT,
    threats TEXT,
    opportunities TEXT,
    analyzed_at TEXT DEFAULT (datetime('now')),
    UNIQUE(domain, service_slug, location_slug)
);

CREATE INDEX idx_comp_domain ON competitors(domain);
CREATE INDEX idx_comp_type ON competitors(site_type);

-- =============================================
-- CAPA 7: FAQs EXTRAÍDAS (de PAA)
-- =============================================
CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT NOT NULL,
    location_slug TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT,
    source TEXT DEFAULT 'paa',
    frequency_rank INTEGER,
    is_generated INTEGER DEFAULT 0,
    generated_answer TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'generated', 'approved', 'rejected')),
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(service_slug, location_slug, question)
);

CREATE INDEX idx_faq_service_location ON faqs(service_slug, location_slug);

-- =============================================
-- CAPA 8: CONTENT GENERADO
-- =============================================
CREATE TABLE IF NOT EXISTS service_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT NOT NULL UNIQUE,
    -- SEO Content
    seo_title TEXT,
    seo_description TEXT,
    meta_description TEXT,
    h1 TEXT,
    hero_subtitle TEXT,
    intro_paragraph TEXT,
    -- Features
    features_json TEXT,
    process_json TEXT,
    common_issues_json TEXT,
    -- Stats
    stats_json TEXT,
    -- Status
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'review', 'approved', 'published')),
    word_count INTEGER,
    generated_at TEXT,
    reviewed_at TEXT,
    published_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS location_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_slug TEXT NOT NULL UNIQUE,
    -- SEO Content
    seo_title TEXT,
    seo_description TEXT,
    meta_description TEXT,
    h1 TEXT,
    intro_paragraph TEXT,
    -- Local Content
    why_this_zone TEXT,
    landmarks_json TEXT,
    neighborhoods_json TEXT,
    stats_json TEXT,
    common_issues_json TEXT,
    -- Status
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'review', 'approved', 'published')),
    word_count INTEGER,
    generated_at TEXT,
    reviewed_at TEXT,
    published_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS combo_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT NOT NULL,
    location_slug TEXT NOT NULL,
    -- SEO Content específico para la combinación
    seo_title TEXT,
    meta_description TEXT,
    h1 TEXT,
    intro_paragraph TEXT,
    local_context TEXT,
    service_in_location TEXT,
    -- FAQs específicas
    faqs_json TEXT,
    -- CTA
    cta_text TEXT,
    cta_button TEXT,
    -- Status
    status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'review', 'approved', 'published')),
    word_count INTEGER,
    generated_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(service_slug, location_slug)
);

-- =============================================
-- CAPA 9: SCHEMA MARKUP DATA
-- =============================================
CREATE TABLE IF NOT EXISTS schema_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL CHECK(entity_type IN ('service', 'location', 'combo', 'organization', 'faq')),
    entity_slug TEXT NOT NULL,
    schema_json TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'generated', 'approved')),
    generated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(entity_type, entity_slug)
);

-- =============================================
-- CAPA 10: LANDMARKS Y DATOS LOCALES
-- =============================================
CREATE TABLE IF NOT EXISTS landmarks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('shopping', 'business', 'landmark', 'transit', 'restaurant', 'park')),
    relevance_score INTEGER DEFAULT 50,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(location_slug, name)
);

-- =============================================
-- CAPA 11: TESTIMONIALS GENERADOS
-- =============================================
CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_slug TEXT,
    location_slug TEXT,
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    quote TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    is_generated INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    created_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- CAPA 12: AGENT KNOWLEDGE BASE
-- =============================================
CREATE TABLE IF NOT EXISTS agent_knowledge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL CHECK(category IN (
        'security_patterns',      -- Patrones de seguridad
        'industry_regulations',    -- Normativas (OS-10, Ley 21.659)
        'client_intent',           -- Intenciones de búsqueda
        'service_signals',         -- Señales de viabilidad
        'regional_patterns',        -- Patrones por zona
        'content_templates',       -- Templates de contenido
        'exclusion_rules',         -- Qué NO decir/hacer
        'competitive_moats'       -- Ventajas competitivas
    )),
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    confidence REAL DEFAULT 0.5,
    hit_count INTEGER DEFAULT 1,
    source TEXT DEFAULT 'seed' CHECK(source IN ('seed', 'research', 'ai', 'correction', 'discovery')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(category, key)
);

CREATE INDEX idx_knowledge_cat ON agent_knowledge(category, confidence DESC);

-- =============================================
-- CAPA 13: AGENT CORRECTIONS (Feedback Loop)
-- =============================================
CREATE TABLE IF NOT EXISTS agent_corrections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL CHECK(entity_type IN ('service', 'location', 'combo')),
    entity_slug TEXT NOT NULL,
    field TEXT NOT NULL,
    original_output TEXT NOT NULL,
    correction TEXT NOT NULL,
    reason TEXT,
    quality_before INTEGER,
    quality_after INTEGER,
    learned_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- CAPA 14: PIPELINE TRACKING
-- =============================================
CREATE TABLE IF NOT EXISTS pipeline_jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    job_type TEXT NOT NULL CHECK(job_type IN (
        'research',        -- Research con Serper
        'keyword_extract', -- Extraer keywords
        'competitor',      -- Analizar competitors
        'content_generate', -- Generar contenido
        'faq_generate',    -- Generar FAQs
        'schema_generate', -- Generar Schema markup
        'full_pipeline'    -- Pipeline completo
    )),
    scope TEXT NOT NULL,  -- 'all', 'service:slug', 'location:slug', 'combo:service:location'
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'running', 'completed', 'failed')),
    progress INTEGER DEFAULT 0,
    total_items INTEGER DEFAULT 0,
    completed_items INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TEXT,
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- CAPA 15: QUALITY SCORES
-- =============================================
CREATE TABLE IF NOT EXISTS quality_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL CHECK(entity_type IN ('service', 'location', 'combo')),
    entity_slug TEXT NOT NULL,
    seo_score INTEGER DEFAULT 0,
    content_score INTEGER DEFAULT 0,
    completeness_score INTEGER DEFAULT 0,
    keyword_score INTEGER DEFAULT 0,
    overall_score INTEGER DEFAULT 0,
    issues_json TEXT,
    checked_at TEXT DEFAULT (datetime('now')),
    UNIQUE(entity_type, entity_slug)
);

-- =============================================
-- CAPA 16: DEPLOYMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS deployments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    version TEXT NOT NULL,
    pages_url TEXT,
    build_id TEXT,
    status TEXT DEFAULT 'building' CHECK(status IN ('building', 'deployed', 'failed')),
    items_updated INTEGER DEFAULT 0,
    deployed_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- =============================================
-- SEEDS: Conocimiento base del agente
-- =============================================
INSERT OR IGNORE INTO agent_knowledge (category, key, value, confidence, source) VALUES
-- Security Patterns
('security_patterns', 'prevencion sobre reaccion', 'El contenido SEO debe enfatizar prevención, no reacción. Los clientes buscan tranquilidad.', 0.95, 'seed'),
('security_patterns', 'presencia fisica disuasoria', 'La presencia visible de guardias es un factor diferenciador clave.', 0.9, 'seed'),
('security_patterns', '24/7 disponibilidad', 'Los clientes valoran especialmente la disponibilidad 24/7 y cobertura los 365 días.', 0.95, 'seed'),
('security_patterns', 'respuesta inmediata', 'Tiempos de respuesta garantizados son un diferenciador competitivo.', 0.85, 'seed'),
('security_patterns', 'personal certificado', 'La certificación OS-10 es un requisito legal y un sello de calidad.', 0.95, 'seed'),

-- Industry Regulations
('industry_regulations', 'ley 21659', 'La Ley 21.659 de Seguridad Privada regula toda la industria en Chile.', 0.98, 'seed'),
('industry_regulations', 'certificacion os-10', 'Todo guardia debe tener certificación OS-10 vigente de Carabineros.', 0.98, 'seed'),
('industry_regulations', 'autorizacion laboral', 'Las empresas necesitan autorización de la Dirección del Trabajo.', 0.9, 'seed'),
('industry_regulations', 'antecedentesvigentes', 'Todo personal debe tener certificados de antecedentes vigentes.', 0.95, 'seed'),

-- Client Intent
('client_intent', 'emergencia busca prevencion', 'Quien busca "guardia de seguridad" quiere prevenir incidentes, no reaccionar.', 0.9, 'seed'),
('client_intent', 'precio como filtro', 'Las queries de precio ("cuanto cuesta") indican intención de contratar.', 0.85, 'seed'),
('client_intent', 'comparacion empresas', 'Queries de comparación ("mejor empresa seguridad") son alto valor.', 0.8, 'seed'),
('client_intent', 'ubicacion especifica', '"Seguridad [comuna]" indica necesidad local específica.', 0.9, 'seed'),
('client_intent', 'tipo de propiedad', 'El tipo de propiedad (casa, edificio, empresa) determina el servicio.', 0.85, 'seed'),

-- Content Templates
('content_templates', 'service_page_structure', '{"h1":"[Servicio] en [Ubicación]","sections":["problema","solucion","caracteristicas","proceso","testimonios","cta"]}', 0.9, 'seed'),
('content_templates', 'location_page_structure', '{"h1":"Seguridad en [Ubicación]","sections":["intro","cobertura","servicios","testimonios","faq","cta"]}', 0.9, 'seed'),
('content_templates', 'faq_structure', '{"question":"[Pregunta común]","answer":"[Respuesta de 50-100 palabras con datos específicos]","include_stats":true}', 0.85, 'seed'),

-- Exclusion Rules
('exclusion_rules', 'no prometer garantias absolutas', 'No prometer "seguridad 100%" - esto es legalmente problematico y poco creíble.', 0.95, 'seed'),
('exclusion_rules', 'no undercutting precios', 'No mencionar precios específicos sin validar - esto puede afectar comerciales.', 0.9, 'seed'),
('exclusion_rules', 'no comparaciones directas', 'No nombrar competidores directamente en contenido - usar "empresas del rubro" o similar.', 0.85, 'seed'),
('exclusion_rules', 'no hype tecnologia', 'No sobrevalorar tecnología - el factor humano sigue siendo clave.', 0.8, 'seed'),

-- Competitive Moats
('competitive_moats', 'certificacion propia', 'GuardMan tiene academia propia para certificación OS-10 - diferenciador único.', 0.9, 'seed'),
('competitive_moats', 'centro monitoreo propio', 'Centro de monitoreo propio (no tercerizado) = control de calidad.', 0.9, 'seed'),
('competitive_moats', 'guard pod tecnologia', 'Guard Pod es tecnología propietaria - ventaja competitiva única.', 0.95, 'seed'),
('competitive_moats', 'cobertura regional', 'Presencia en 14 comunas + Los Andes + San Felipe = escala única.', 0.85, 'seed'),

-- Regional Patterns
('regional_patterns', 'oriente premium', 'Las Condes, Vitacura, Lo Barnechea = clientes premium, valoran exclusividad.', 0.9, 'seed'),
('regional_patterns', 'santiago centro corporativo', 'Santiago Centro, Providencia = clientes corporativos, valoran eficiencia.', 0.85, 'seed'),
('regional_patterns', 'industria norte', 'Huechuraba, Quilicura, Renca = zona industrial, seguridad perimetral.', 0.85, 'seed'),
('regional_patterns', 'residencial sur', 'La Pintana, Pudahuel = clientes residenciales, valoran precio/calidad.', 0.8, 'seed');

-- =============================================
-- SEED: Servicios iniciales
-- =============================================
INSERT OR IGNORE INTO services (slug, name, short_description, price_range) VALUES
('guardias-de-seguridad', 'Guardias de Seguridad', 'Protección profesional con guardias certificados las 24 horas', '$$$'),
('cctv-videovigilancia', 'CCTV y Videovigilancia', 'Cámaras de última generación con monitoreo 24/7', '$$$$'),
('control-de-accesos', 'Control de Accesos', 'Control total de accesos con tecnología biométrica', '$$$'),
('escoltas-privados', 'Escoltas Privados', 'Protección personalizada para executives', '$$$$'),
('monitoreo-24-7', 'Monitoreo 24/7', 'Centro de control con vigilancia las 24 horas', '$$$'),
('seguridad-eventos', 'Seguridad para Eventos', 'Seguridad profesional para todo tipo de eventos', '$$$$'),
('seguridad-industrial', 'Seguridad Industrial', 'Protección para industrias, bodegas y obras', '$$$'),
('auditoria-seguridad', 'Auditoría de Seguridad', 'Evaluación profesional de vulnerabilidades', '$$'),
('guard-pod', 'Guard Pod', 'Unidades móviles de vigilancia 24/7 con tecnología avanzada', '$$$$');

-- =============================================
-- SEED: Ubicaciones iniciales
-- =============================================
INSERT OR IGNORE INTO locations (slug, name, zone, latitude, longitude) VALUES
('las-condes', 'Las Condes', 'Oriente', -33.4017, -70.5783),
('vitacura', 'Vitacura', 'Oriente', -33.3892, -70.5836),
('santiago-centro', 'Santiago Centro', 'Centro', -33.4489, -70.6693),
('huechuraba', 'Huechuraba', 'Norte', -33.35, -70.6833),
('quilicura', 'Quilicura', 'Norte', -33.35, -70.7333),
('lo-barnechea', 'Lo Barnechea', 'Oriente', -33.3056, -70.5186),
('la-reina', 'La Reina', 'Oriente', -33.4522, -70.595),
('renca', 'Renca', 'Poniente', -33.4167, -70.7),
('pudahuel', 'Pudahuel', 'Poniente', -33.45, -70.75),
('la-pintana', 'La Pintana', 'Sur', -33.5833, -70.65),
('lampa', 'Lampa', 'Norte', -33.2833, -70.75),
('conchali', 'Conchalí', 'Poniente', -33.3833, -70.6833),
('los-andes', 'Los Andes', 'Valparaíso', -32.8333, -70.6),
('san-felipe', 'San Felipe', 'Valparaíso', -32.75, -70.7167);
