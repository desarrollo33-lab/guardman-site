/**
 * GUARDMAN AGENT - SEO Content Generation Agent
 * Durable Object that generates all SEO content for guardman.cl
 */

import type { Env } from '../index';

const KNOWLEDGE_CATEGORIES = [
  'security_patterns',
  'industry_regulations', 
  'client_intent',
  'service_signals',
  'regional_patterns',
  'content_templates',
  'exclusion_rules',
  'competitive_moats'
] as const;

type KnowledgeCategory = typeof KNOWLEDGE_CATEGORIES[number];

const MIN_INJECT_CONFIDENCE = 0.6;
const MIN_SAVE_CONFIDENCE = 0.5;
const MAX_INJECT_PER_CATEGORY = 15;

export class GuardmanAgent implements DurableObject {
  private state: DurableObjectState;
  private env: Env;
  private initialized = false;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  private ensureSchema() {
    if (this.initialized) return;
    
    this.state.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS guardman_knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL,
        confidence REAL DEFAULT 0.5,
        hit_count INTEGER DEFAULT 1,
        last_seen TEXT DEFAULT (datetime('now')),
        created_at TEXT DEFAULT (datetime('now')),
        source TEXT DEFAULT 'seed',
        UNIQUE(category, key)
      )
    `);
    
    this.state.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS guardman_corrections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL,
        entity_slug TEXT NOT NULL,
        field TEXT NOT NULL,
        original_output TEXT NOT NULL,
        correction TEXT NOT NULL,
        reason TEXT,
        learned_at TEXT DEFAULT (datetime('now'))
      )
    `);
    
    this.state.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS guardman_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity_type TEXT NOT NULL,
        entity_slug TEXT NOT NULL,
        operation TEXT NOT NULL,
        input_summary TEXT,
        output_json TEXT,
        tokens_used INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
    
    this.state.storage.sql.exec(`
      CREATE TABLE IF NOT EXISTS guardman_meta (key TEXT PRIMARY KEY, value TEXT)
    `);
    
    this.initialized = true;
  }

  private seedCoreKnowledge() {
    const rows = this.state.storage.sql.exec(`SELECT value FROM guardman_meta WHERE key = 'seeded'`);
    const seeded = rows.length > 0 ? rows[0] : null;
    if (seeded) return;

    const seeds = [
      { category: 'security_patterns', key: 'prevencion', value: 'El contenido debe enfatizar prevención activa, no reacción. Los clientes buscan tranquilidad y disuasión.', confidence: 0.95 },
      { category: 'security_patterns', key: 'presencia fisica', value: 'La presencia visible de guardias uniformados es un diferenciador clave.', confidence: 0.9 },
      { category: 'security_patterns', key: '24/7', value: 'Disponibilidad 24/7, 365 días es esperado pero debe mencionarse como garantía.', confidence: 0.95 },
      { category: 'industry_regulations', key: 'ley 21659', value: 'Ley 21.659 de Seguridad Privada - mencionar cumplimiento legal.', confidence: 0.98 },
      { category: 'industry_regulations', key: 'os-10', value: 'Certificación OS-10 de Carabineros es requisito legal y sello de calidad.', confidence: 0.98 },
      { category: 'client_intent', key: 'emergencia', value: 'Quien busca guardia quiere PREVENIR incidentes, no reaccionar.', confidence: 0.9 },
      { category: 'client_intent', key: 'precio', value: 'Queries de precio = alta intención de contratar.', confidence: 0.85 },
      { category: 'competitive_moats', key: 'guard pod', value: 'Guard Pod es tecnología propietaria única - ventaja competitiva real.', confidence: 0.95 },
      { category: 'competitive_moats', key: 'centro monitoreo', value: 'Centro de monitoreo propio = control de calidad y respuesta inmediata.', confidence: 0.9 },
      { category: 'regional_patterns', key: 'oriente premium', value: 'Las Condes, Vitacura, Lo Barnechea = clientes premium.', confidence: 0.9 },
      { category: 'regional_patterns', key: 'industria norte', value: 'Huechuraba, Quilicura, Renca = zona industrial.', confidence: 0.85 },
      { category: 'content_templates', key: 'service structure', value: 'H1 con servicio + ubicación. Secciones: Problema, Solución, Características, Proceso, FAQ, CTA. Mínimo 800 palabras.', confidence: 0.9 },
      { category: 'content_templates', key: 'location structure', value: 'H1: Seguridad en [Ubicación]. Secciones: Intro Local, Cobertura, FAQ, CTA. Mínimo 600 palabras.', confidence: 0.9 },
      { category: 'exclusion_rules', key: 'no seguridad absoluta', value: 'PROHIBIDO prometer "seguridad 100%" - usar "máxima protección".', confidence: 0.95 },
      { category: 'exclusion_rules', key: 'no precios', value: 'PROHIBIDO mencionar precios específicos.', confidence: 0.9 },
    ];

    for (const s of seeds) {
      this.upsertKnowledge(s.category as KnowledgeCategory, s.key, s.value, 'seed', s.confidence);
    }
    
    this.state.storage.sql.exec(`INSERT OR REPLACE INTO guardman_meta (key, value) VALUES ('seeded', '1')`);
  }

  private upsertKnowledge(category: KnowledgeCategory, key: string, value: string, source: string, confidence: number) {
    const rows = this.state.storage.sql.exec(
      `SELECT id, confidence, hit_count FROM guardman_knowledge WHERE category = ? AND key = ?`,
      category, key
    );

    if (rows.length > 0) {
      const row = rows[0] as any;
      const blended = Math.round(((row.confidence * 0.7) + (confidence * 0.3)) * 1000) / 1000;
      this.state.storage.sql.exec(
        `UPDATE guardman_knowledge SET confidence = ?, value = ?, hit_count = ?, last_seen = datetime('now'), source = ? WHERE id = ?`,
        blended, value, row.hit_count + 1, source, row.id
      );
    } else {
      this.state.storage.sql.exec(
        `INSERT OR IGNORE INTO guardman_knowledge (category, key, value, confidence, hit_count, source) VALUES (?, ?, ?, ?, 1, ?)`,
        category, key, value, confidence, source
      );
    }
  }

  private getKnowledgeForPrompt(categories: KnowledgeCategory[]): string {
    const parts: string[] = [];
    
    for (const cat of categories) {
      const rows = this.state.storage.sql.exec(
        `SELECT key, value, confidence, hit_count FROM guardman_knowledge WHERE category = ? AND confidence >= ? ORDER BY confidence DESC LIMIT ?`,
        cat, MIN_INJECT_CONFIDENCE, MAX_INJECT_PER_CATEGORY
      );
      
      if (rows.length === 0) continue;
      
      parts.push(`\n${cat.toUpperCase()} (${rows.length} rules):`);
      for (const r of rows) {
        const row = r as any;
        parts.push(`  - ${row.key}: ${row.value} (conf:${row.confidence.toFixed(2)}, hits:${row.hit_count})`);
      }
    }
    
    return parts.length > 0 ? parts.join('\n') : '';
  }

  private validateAndSaveKnowledge(items: any[], source: string): number {
    const allowedSet = new Set<string>(KNOWLEDGE_CATEGORIES);
    let saved = 0;
    
    for (const item of items) {
      if (!item.category || !item.key || !item.value) continue;
      if (typeof item.confidence !== 'number') continue;
      
      let category = String(item.category);
      if (!allowedSet.has(category as KnowledgeCategory)) continue;
      if (item.confidence < MIN_SAVE_CONFIDENCE) continue;
      
      const confidence = Math.min(1.0, Math.max(0, item.confidence));
      const key = String(item.key).toLowerCase().trim().substring(0, 200);
      const value = String(item.value).trim().substring(0, 500);
      
      this.upsertKnowledge(category as KnowledgeCategory, key, value, source, confidence);
      saved++;
    }
    
    return saved;
  }

  private saveHistory(entityType: string, entitySlug: string, operation: string, inputSummary: string, outputJson: string, tokens: number) {
    this.state.storage.sql.exec(
      `INSERT INTO guardman_history (entity_type, entity_slug, operation, input_summary, output_json, tokens_used) VALUES (?, ?, ?, ?, ?, ?)`,
      entityType, entitySlug, operation, inputSummary, outputJson, tokens
    );
  }

  private safeParseAIResponse(response: string): { data: any; parseSuccess: boolean } {
    try {
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return { data: JSON.parse(cleaned), parseSuccess: true };
    } catch {}

    try {
      const start = response.indexOf('{');
      if (start >= 0) {
        let depth = 0;
        for (let i = start; i < response.length; i++) {
          if (response[i] === '{') depth++;
          if (response[i] === '}') depth--;
          if (depth === 0) {
            const extracted = response.substring(start, i + 1);
            return { data: JSON.parse(extracted), parseSuccess: true };
          }
        }
      }
    } catch {}

    return {
      data: { raw_preview: response.substring(0, 500), parse_error: true },
      parseSuccess: false
    };
  }

  async generateServiceContent(serviceSlug: string, context: any = {}): Promise<any> {
    this.ensureSchema();
    this.seedCoreKnowledge();

    const knowledgeBlock = this.getKnowledgeForPrompt([
      'security_patterns',
      'industry_regulations', 
      'client_intent',
      'competitive_moats',
      'content_templates',
      'exclusion_rules'
    ]);

    const serviceData = context.serviceData || {};
    const keywords = context.keywords || [];

    const sys = `Eres Guardman Agent, especialista en contenido SEO para seguridad privada en Chile.

CONOCIMIENTO:
${knowledgeBlock}

DATOS DEL SERVICIO:
- Nombre: ${serviceData.name || serviceSlug}
- Descripción: ${serviceData.short_description || 'Servicio de seguridad profesional'}

REGLAS:
1. H1 debe contener el nombre del servicio
2. Meta description máximo 160 caracteres con CTA
3. Intro mínimo 150 palabras con keywords naturales
4. Mínimo 5 FAQs con respuestas de 50-100 palabras
5. Incluir stats (500+ guardias, 14 comunas, 8+ años)
6. Mencionar OS-10, Ley 21.659, centro monitoreo propio

RESPONDE SOLO JSON:
{
  "seo_title": "${serviceData.name || serviceSlug} en Chile | GuardMan",
  "meta_description": "Empresa líder con guardias OS-10 certificados. Máximo 160 caracteres.",
  "h1": "${serviceData.name || serviceSlug}",
  "hero_subtitle": "Protección profesional con guardias certificados 24/7",
  "intro_paragraph": "150-200 palabras enfatizando prevención, tranquilidad y diferenciadores",
  "features": ["feature 1", "feature 2", "feature 3"],
  "process": [{"step":"Consulta","description":"..."},{"step":"Propuesta","description":"..."}],
  "common_issues": ["problema 1", "problema 2"],
  "faqs": [{"question":"pregunta 1?","answer":"respuesta..."}],
  "stats": [{"label":"Guardias","value":"500+"}],
  "cta_text": "Cotiza ahora"
}`;

    try {
      const { response, tokens } = await this.callAI(sys, `Genera contenido SEO para: ${serviceSlug}`);
      const { data, parseSuccess } = this.safeParseAIResponse(response);

      if (!parseSuccess) {
        return { success: false, errors: ['AI_RESPONSE_PARSE_FAILED'] };
      }

      this.saveHistory('service', serviceSlug, 'generate', keywords.length + ' keywords', JSON.stringify(data).substring(0, 4000), tokens);

      let learned = 0;
      if (data.new_knowledge) {
        learned = this.validateAndSaveKnowledge(data.new_knowledge, `generate:${serviceSlug}`);
      }

      return {
        success: true,
        entityType: 'service',
        entitySlug,
        content: data,
        tokensUsed: tokens,
        learned
      };

    } catch (error: any) {
      return { success: false, errors: [error.message] };
    }
  }

  async generateLocationContent(locationSlug: string, context: any = {}): Promise<any> {
    this.ensureSchema();
    this.seedCoreKnowledge();

    const knowledgeBlock = this.getKnowledgeForPrompt([
      'regional_patterns',
      'client_intent',
      'competitive_moats',
      'content_templates'
    ]);

    const locationData = context.locationData || {};

    const sys = `Eres Guardman Agent, especialista en contenido SEO para seguridad privada en Chile.

CONOCIMIENTO:
${knowledgeBlock}

DATOS DE LA UBICACIÓN:
- Nombre: ${locationData.name || locationSlug}
- Zona: ${locationData.zone || 'Santiago'}

RESPONDE SOLO JSON:
{
  "seo_title": "Seguridad Privada en ${locationData.name || locationSlug} | GuardMan",
  "meta_description": "Empresa líder con guardias OS-10 en ${locationData.name || locationSlug}. Máximo 160 chars.",
  "h1": "Seguridad Privada en ${locationData.name || locationSlug}",
  "intro_paragraph": "150-200 palabras sobre seguridad en esta comuna",
  "why_this_zone": "Por qué esta zona necesita servicios profesionales",
  "landmarks": ["zona 1", "zona 2"],
  "stats": {"empresas":"X","guardias":"Y"},
  "common_issues": ["problema 1", "problema 2"],
  "faqs": [{"question":"pregunta?","answer":"respuesta..."}],
  "cta_text": "Protege tu propiedad en ${locationData.name || locationSlug}"
}`;

    try {
      const { response, tokens } = await this.callAI(sys, `Genera contenido SEO para: ${locationSlug}`);
      const { data, parseSuccess } = this.safeParseAIResponse(response);

      if (!parseSuccess) {
        return { success: false, errors: ['AI_RESPONSE_PARSE_FAILED'] };
      }

      this.saveHistory('location', locationSlug, 'generate', 'location context', JSON.stringify(data).substring(0, 4000), tokens);

      return {
        success: true,
        entityType: 'location',
        entitySlug: locationSlug,
        content: data,
        tokensUsed: tokens,
        learned: 0
      };

    } catch (error: any) {
      return { success: false, errors: [error.message] };
    }
  }

  async generateComboContent(serviceSlug: string, locationSlug: string, context: any = {}): Promise<any> {
    this.ensureSchema();
    this.seedCoreKnowledge();

    const knowledgeBlock = this.getKnowledgeForPrompt([
      'security_patterns',
      'industry_regulations',
      'regional_patterns',
      'client_intent',
      'content_templates'
    ]);

    const serviceData = context.serviceData || {};
    const locationData = context.locationData || {};
    const keywords = context.keywords || [];

    const sys = `Eres Guardman Agent, especialista en contenido SEO para seguridad privada.

CONOCIMIENTO:
${knowledgeBlock}

SERVICIO: ${serviceData.name || serviceSlug}
UBICACIÓN: ${locationData.name || locationSlug}

RESPONDE SOLO JSON:
{
  "seo_title": "${serviceData.name || serviceSlug} en ${locationData.name || locationSlug} | GuardMan",
  "meta_description": "máximo 160 caracteres",
  "h1": "${serviceData.name || serviceSlug} en ${locationData.name || locationSlug}",
  "intro_paragraph": "150-200 palabras servicio + contexto local",
  "local_context": "contexto local específico",
  "service_in_location": "cómo se aplica el servicio aquí",
  "faqs": [{"question":"pregunta?","answer":"respuesta..."}],
  "cta_text": "Cotiza ${serviceData.name || serviceSlug} en ${locationData.name || locationSlug}"
}`;

    try {
      const { response, tokens } = await this.callAI(sys, `Genera contenido para: ${serviceSlug} + ${locationSlug}`);
      const { data, parseSuccess } = this.safeParseAIResponse(response);

      if (!parseSuccess) {
        return { success: false, errors: ['AI_RESPONSE_PARSE_FAILED'] };
      }

      this.saveHistory('combo', `${serviceSlug}/${locationSlug}`, 'generate', keywords.length + ' keywords', JSON.stringify(data).substring(0, 4000), tokens);

      return {
        success: true,
        entityType: 'combo',
        entitySlug: `${serviceSlug}/${locationSlug}`,
        content: data,
        tokensUsed: tokens,
        learned: 0
      };

    } catch (error: any) {
      return { success: false, errors: [error.message] };
    }
  }

  async learn(correction: any): Promise<any> {
    this.ensureSchema();

    this.state.storage.sql.exec(
      `INSERT INTO guardman_corrections (entity_type, entity_slug, field, original_output, correction, reason) VALUES (?,?,?,?,?,?)`,
      correction.entityType, correction.entitySlug, correction.field, correction.original, correction.correction, correction.reason
    );

    const ruleKey = `${correction.field}: ${correction.correction}`.toLowerCase().trim().substring(0, 100);
    const ruleValue = `CORRECCIÓN HUMANA: ${correction.reason || correction.correction}`;
    this.upsertKnowledge('exclusion_rules', ruleKey, ruleValue, 'human_correction', 0.95);

    return { learned: true };
  }

  getStatus() {
    this.ensureSchema();
    
    const totalRows = this.state.storage.sql.exec(`SELECT COUNT(*) as c FROM guardman_knowledge`);
    const totalKnowledge = totalRows.length > 0 ? (totalRows[0] as any).c || 0 : 0;
    
    const catRows = this.state.storage.sql.exec(
      `SELECT category, COUNT(*) as cnt FROM guardman_knowledge GROUP BY category`
    );
    
    const corrRows = this.state.storage.sql.exec(`SELECT COUNT(*) as c FROM guardman_corrections`);
    const corrections = corrRows.length > 0 ? (corrRows[0] as any).c || 0 : 0;

    return {
      agent: 'GuardmanAgent',
      version: '1.0',
      knowledge: { total: totalKnowledge, by_category: catRows },
      corrections,
      initialized: this.initialized
    };
  }

  private async callAI(systemPrompt: string, userPrompt: string): Promise<{ response: string; tokens: number }> {
    try {
      const result = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2048,
        temperature: 0.7
      });

      const tokens = (result as any).usage?.total_tokens || 0;
      return {
        response: typeof result === 'string' ? result : (result as any).response || JSON.stringify(result),
        tokens
      };
    } catch (error: any) {
      throw new Error(`AI call failed: ${error.message}`);
    }
  }

  async fetch(request: Request): Promise<Response> {
    this.ensureSchema();
    this.seedCoreKnowledge();

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/status') {
      return Response.json(this.getStatus());
    }

    if (path === '/generate/service' && request.method === 'POST') {
      const { serviceSlug, context } = await request.json();
      const result = await this.generateServiceContent(serviceSlug, context);
      return Response.json(result);
    }

    if (path === '/generate/location' && request.method === 'POST') {
      const { locationSlug, context } = await request.json();
      const result = await this.generateLocationContent(locationSlug, context);
      return Response.json(result);
    }

    if (path === '/generate/combo' && request.method === 'POST') {
      const { serviceSlug, locationSlug, context } = await request.json();
      const result = await this.generateComboContent(serviceSlug, locationSlug, context);
      return Response.json(result);
    }

    if (path === '/learn' && request.method === 'POST') {
      const correction = await request.json();
      const result = await this.learn(correction);
      return Response.json(result);
    }

    if (path === '/knowledge') {
      const cat = url.searchParams.get('category');
      if (cat) {
        const rows = this.state.storage.sql.exec(
          `SELECT * FROM guardman_knowledge WHERE category = ? ORDER BY confidence DESC`,
          cat
        );
        return Response.json({ category: cat, items: rows });
      }
      const all = this.state.storage.sql.exec(
        `SELECT category, key, value, confidence, hit_count FROM guardman_knowledge ORDER BY category, confidence DESC`
      );
      return Response.json({ knowledge: all });
    }

    if (path === '/corrections') {
      const rows = this.state.storage.sql.exec(
        `SELECT * FROM guardman_corrections ORDER BY learned_at DESC LIMIT 50`
      );
      return Response.json({ corrections: rows });
    }

    return Response.json({
      error: 'Not found',
      endpoints: ['GET /status', 'POST /generate/service', 'POST /generate/location', 'POST /generate/combo', 'POST /learn', 'GET /knowledge', 'GET /corrections']
    }, { status: 404 });
  }
}
