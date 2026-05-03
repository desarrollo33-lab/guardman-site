# HANDOFF: GuardMan Chile - Sistema de Arquitectura 7-Capas

## 📅 Fecha: 14 Abril 2026
## 🤖 Sesión: Implementación Completa del Sistema CMS + AI

---

## 📋 RESUMEN EJECUTIVO

Implementamos un sistema completo de 7 capas para el sitio GuardMan Chile (seguridad privada en Chile):

- **Admin Panel:** Cloudflare Workers con D1 + R2
- **Sitio:** Astro static site en Cloudflare Pages
- **AI:** MiniMax M2.7 para generación de contenido
- **Research:** Serper API para keywords y competidores
- **Total de endpoints:** 40+ APIs REST

### URLs del Sistema

| Recurso | URL | Credenciales |
|---------|-----|--------------|
| Admin Panel | https://guardman-admin-panel.oficinadesarrollo33.workers.dev | admin@guardman.cl / GuardMan2026!@#Admin |
| Sitio Deployado | https://4061deb7.guardman-site.pages.dev | - |
| D1 Database | guardman-seo (aeaab85c-d4df-46c4-96b9-28d6a95aaec4) | - |

---

## 🏗️ ARQUITECTURA IMPLEMENTADA

```
┌─────────────────────────────────────────────────────────────────┐
│                     CAPA 1: CMS Template Editor                  │
│  MiniMax M2.7 → Contenido SEO → D1 (content_versions)          │
├─────────────────────────────────────────────────────────────────┤
│                     CAPA 2: Research & Data Collection           │
│  Serper API → Keywords → Competitors → D1 (research_cache)     │
├─────────────────────────────────────────────────────────────────┤
│                     CAPA 3: SEO Validation & Enhancement         │
│  Validación → Score → Reports → D1 (audit_reports)              │
├─────────────────────────────────────────────────────────────────┤
│                     CAPA 4: Content Deployment                   │
│  Admin Panel → Export API → JSON → Astro Build → Pages          │
├─────────────────────────────────────────────────────────────────┤
│                     CAPA 5: Performance Monitoring              │
│  Deployments → Pipeline Jobs → Analytics → Reports                │
├─────────────────────────────────────────────────────────────────┤
│                     CAPA 6: Uptime Monitoring                   │
│  Health Checks → Alerts → SLA Tracking → Reports                │
├─────────────────────────────────────────────────────────────────┤
│                     CAPA 7: Advanced Analytics                   │
│  Analytics → Rankings → ROI → A/B Testing → Recommendations    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 CAPA 1: CMS Template Editor (COMPLETA)

### Lo que hace
- Editor visual de contenido en el Admin Panel
- Generación automática de contenido usando MiniMax M2.7
- Workflow de estados: draft → generating → reviewing → approved → published

### APIs implementadas

```bash
# Lista de servicios
GET /api/services

# Generar contenido con AI
POST /api/generate/:type/:slug
# Body: vacío
# Auth: Bearer GuardMan2026!@#Admin

# Obtener contenido
GET /api/content/:type/:slug
# Auth: Bearer GuardMan2026!@#Admin

# Guardar contenido
POST /api/content/:type/:slug
# Body: { content: {...} }

# Workflow
GET  /api/workflow/:type/:slug
PUT  /api/workflow/:type/:slug
# Body: { status: 'approved' }
```

### Estructura del contenido generado

```typescript
interface ServiceContent {
  hero: { heading: string; subheading: string };
  intro: { heading: string; paragraphs: string[] };
  features: { heading: string; items: string[] };
  issues: { heading: string; items: string[] };
  stats: { heading: string; items: Array<{label: string; value: string}> };
  faqs: { heading: string; items: Array<{question: string; answer: string}> };
  cta: { heading: string; subheading: string; button: string };
  metaTitle: string;
  metaDescription: string;
}
```

### Errores y Soluciones

**Error 1:** MiniMax devolvía JSON truncado causando parsing failures
- **Solución:** Implementamos parsing inteligente que encuentra el último objeto JSON válido

**Error 2:** MiniMax usaba nombres de campos inconsistentes (titulo vs heading, problema vs problem)
- **Solución:** Normalización robusta con múltiples fallbacks en el código

**Error 3:** Respuestas de MiniMax来得 con bloques `[{type: "thinking"}, {type: "text"}]`
- **Solución:** Extraer específicamente el bloque con `type: "text"`

---

## 🔧 CAPA 2: Research & Data Collection (COMPLETA)

### Lo que hace
- Ejecuta queries de Serper API para keyword research
- Extrae competidores, PAA questions, y keywords long-tail
- Cachea resultados en D1 por 24 horas

### APIs implementadas

```bash
# Ejecutar research (Serper + OSM)
POST /api/research/:type/:slug
# Body: { sources: ['serper', 'osm'], keywords: [] }
# Auth: Bearer GuardMan2026!@#Admin

# Obtener research cacheado
GET /api/research/:type/:slug
# Auth: Bearer GuardMan2026!@#Admin

# Extraer keywords
GET /api/keywords/:type/:slug
# Auth: Bearer GuardMan2026!@#Admin
```

### Queries que ejecuta

| Query | Propósito |
|-------|-----------|
| `{service} Chile` | Keywords principales |
| `{service} empresa seguridad Chile` | Competidores |
| `{service} precio Santiago` | Long-tail |
| `{service} preguntas frecuentes` | PAA questions |
| `{service} {zone}` | Keywords locales |

### API Keys necesarias

```typescript
const SERPER_API_KEY = '560f82db098446d04e390640882b3a4313ffd39b';
const MINIMAX_API_KEY = 'sk-cp-U-sq04tch8tjWqmRtwXWoRMvHmOZVM4NnScOFOeWfeDQFcAm-Tk_ZzOT1tWOCY3S0x2ld0rDZomlMlyaEBKdLppFGFxpafmeB2lq-82VFR1e7FfTG09N1vs';
```

---

## 🔧 CAPA 3: SEO Validation & Enhancement (COMPLETA)

### Lo que hace
- Valida contenido contra mejores prácticas SEO
- Genera scores de 0-100
- Sugiere mejoras basadas en research

### Validaciones implementadas

1. **Meta Title** - Longitud óptima 30-60 chars
2. **Meta Description** - Longitud óptima 120-160 chars
3. **Hero Heading** - Presencia y longitud
4. **Features** - Mínimo 4-6 items
5. **FAQs** - Mínimo 4 items (para featured snippets)
6. **Stats** - Datos numéricos de referencia
7. **CTA** - Botón de llamada a la acción
8. **Intro** - Mínimo 2 párrafos
9. **Keywords** - Presencia de keywords importantes

### APIs implementadas

```bash
# Validación completa
GET /api/validate/:type/:slug

# Sugerencias de mejora
GET /api/enhance/:type/:slug

# Generar reporte SEO
POST /api/seo-report/:type/:slug
```

### Scores generados

| Rango | Status | Decisión |
|-------|--------|----------|
| 80-100 | excellent | APPROVED |
| 50-79 | good | REVISION_REQUIRED |
| 0-49 | poor | REJECTED |

---

## 🔧 CAPA 4: Content Deployment (COMPLETA)

### Lo que hace
- Exporta contenido del Admin Panel al formato del sitio estático
- Genera archivos JSON en `src/data/cms/`
- Se integra con el pipeline de build de Astro

### APIs implementadas

```bash
# Exportar un servicio
GET /api/export/service/:slug
# Header: x-export-key: guardman-export-key-2026

# Exportar todos los servicios
GET /api/export/all
# Header: x-export-key: guardman-export-key-2026
```

### Scripts creados

```bash
# Exportar contenido al sitio
node scripts/export-cms.mjs all

# Export + Build automático
node scripts/build-with-cms.mjs
```

### Pipeline de deployment

```bash
1. node scripts/export-cms.mjs all   # Exportar JSON
2. npm run build                      # Build Astro
3. npx wrangler pages deploy dist     # Deploy a Cloudflare Pages
```

### Archivos modificados/creados

```
guardman-site/
├── scripts/
│   ├── export-cms.mjs          # Script de exportación
│   └── build-with-cms.mjs      # Script de build completo
└── src/data/cms/              # Contenido exportado
    ├── guardias-de-seguridad.json
    ├── cctv-videovigilancia.json
    └── ... (9 servicios)
```

---

## 🔧 CAPA 5: Performance Monitoring (COMPLETA)

### Lo que hace
- Registra deployments realizados
- Hace tracking de pipeline jobs
- Genera reportes de performance

### APIs implementadas

```bash
# Overview de performance
GET /api/performance

# Registrar deployment
POST /api/performance/deploy
# Body: { pages_url, version, items_updated }

# Historial de deployments
GET /api/performance/deployments

# Analytics SEO
GET /api/performance/analytics

# Reporte completo
GET /api/performance/report

# Pipeline jobs
GET    /api/pipeline
POST   /api/pipeline/start
# Body: { job_type, scope, total_items }
PUT    /api/pipeline/:id
# Body: { progress, completed_items, status }
```

---

## 🔧 CAPA 6: Uptime Monitoring (COMPLETA)

### Lo que hace
- Health checks de todos los servicios
- Monitoreo de uptime con SLA tracking
- Generación de alertas automáticas

### APIs implementadas

```bash
# Health check de todos los servicios
GET /api/monitor

# Historial de uptime (24h)
GET /api/monitor/history

# Reporte de uptime
GET /api/monitor/report

# Check on-demand
POST /api/monitor/check
# Body: { url: 'https://...' }

# Alertas activas
GET /api/alerts
```

### Servicios monitoreados

| Servicio | Tipo | Check |
|----------|------|-------|
| Admin Panel | HTTP | GET /health |
| Site Pages | HTTP | GET / |
| D1 Database | D1 | SELECT 1 |
| R2 Storage | R2 | List buckets |

### Tipos de alertas

1. **Deployment desactualizado** - Si > 24 horas
2. **Scores SEO bajos** - Si score < 70
3. **Contenido faltante** - Si hay servicios sin contenido

---

## 🔧 CAPA 7: Advanced Analytics (COMPLETA)

### Lo que hace
- Tracking de conversiones
- Rankings de keywords (simulado)
- Cálculo de ROI
- A/B testing (simulado)

### APIs implementadas

```bash
# Registrar evento de conversión
POST /api/analytics/track
# Body: { event_type, entity_slug, metadata }

# Overview de analytics
GET /api/analytics

# Rankings de keywords
GET /api/analytics/rankings

# Reporte de ROI
GET /api/analytics/roi

# A/B tests
GET /api/analytics/ab-tests

# Reporte completo
GET /api/analytics/report
```

### Métricas disponibles

| Categoría | Métricas |
|-----------|----------|
| Content | Servicios, palabras, scores, ROI |
| Traffic | Visitas, pageviews, bounce rate, time on page |
| Conversions | Conversiones, tasa, top landing pages |
| SEO | Rankings, avg position, improving/declining |
| ROI | Costos, beneficios, ROI percentage |

---

## 📊 TABLAS D1 UTILIZADAS

| Tabla | Propósito | Registros |
|-------|-----------|-----------|
| `content_versions` | Versiones de contenido generado | 9 |
| `research_cache` | Research de Serper/OSM cacheado | 45 |
| `audit_reports` | Reportes SEO con scores | 9 |
| `workflow_status` | Estados del workflow | 9 |
| `deployments` | Historial de deployments | 1 |
| `pipeline_jobs` | Jobs de pipeline (no usado aún) | 0 |

### Schema de content_versions

```sql
CREATE TABLE content_versions (
  id INTEGER PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_slug TEXT NOT NULL,
  version INTEGER,
  content_json TEXT,
  generated_by TEXT,
  llm_model TEXT,
  llm_tokens_used INTEGER,
  confidence_score INTEGER,
  word_count INTEGER,
  created_at TEXT
);
```

---

## 🐛 ERRORES ENCONTRADOS Y SOLUCIONES

### Error 1: MiniMax JSON Parsing Failures

**Problema:** MiniMax devolvía JSON truncado o con caracteres extraños, causando `JSON.parse()` failures.

**Solución implementada:**
```typescript
// 1. Limpiar markdown artifacts
cleanContent = cleanContent.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/gi, '').trim();

// 2. Encontrar el último objeto JSON válido usando bracket counting
let braceCount = 0, bracketCount = 0, inString = false, escapeNext = false;
for (let i = 0; i < cleanContent.length; i++) {
  // Track brackets y encontrar último cierre válido
  if ((char === '}' && braceCount === 0) || (char === ']' && bracketCount === 0)) {
    lastGoodPos = i;
  }
}
cleanContent = cleanContent.substring(0, lastGoodPos + 1);
```

### Error 2: Estructuras de JSON Inconsistentes

**Problema:** MiniMax usaba `titulo` vs `heading`, `problema` vs `problem`, etc.

**Solución implementada:**
```typescript
// Helper de extracción con múltiples fallbacks
const extractString = (val) => {
  if (!val) return '';
  if (typeof val === 'string') return val.trim();
  return String(val);
};

// Uso con múltiples keys
heading: extractString(raw.hero.heading || raw.hero.titulo || raw.hero.title || ''),
```

### Error 3: Bloques de Respuesta de MiniMax

**Problema:** MiniMax M2.7 devuelve `[{type: "thinking"}, {type: "text", text: "..."}]` para respuestas largas.

**Solución implementada:**
```typescript
let content = '';
if (aiData.content && Array.isArray(aiData.content)) {
  for (const block of aiData.content) {
    if (block.type === 'text' || (typeof block.type === 'undefined' && block.text)) {
      content = block.text || block;
      break;
    }
  }
}
```

### Error 4: Constraint Violations en D1

**Problema:** INSERT fallaba por constraints en tablas existentes.

**Ejemplo:** `audit_reports` tenía CHECK constraint en `decision`:
```sql
CHECK (decision IN ('APPROVED', 'REJECTED', 'REVISION_REQUIRED'))
```

**Solución:** Usar valores válidos según el schema existente:
```typescript
const decision = score >= 80 ? 'APPROVED' : score >= 50 ? 'REVISION_REQUIRED' : 'REJECTED';
```

### Error 5: Promises en el Worker

**Problema:** Intentar usar `fetch()` dentro del mismo Worker para endpoints internos causaba loops infinitos.

**Solución:** En el endpoint `/api/analytics/report`, en lugar de hacer fetch a otros endpoints, hacer queries directas a D1:
```typescript
// En lugar de:
const analytics = await fetch('/api/analytics', ...);

// Hacer directamente:
const contentStats = await env.DB.prepare('SELECT COUNT(*)...').first();
const scores = await env.DB.prepare('SELECT AVG(seo_score)...').first();
```

### Error 6: Rate Limiting en D1

**Problema:** D1 tiene límites de queries simultáneas.

**Solución:** Usar `Promise.all()` solo para queries independientes, y secuencial para dependientes.

---

## 💡 APRENDIZAJES CLAVE

### 1. MiniMax API Behavior
- Respuestas cortas (<500 tokens): `[{type: "text", text: "..."}]`
- Respuestas largas (>500 tokens): `[{type: "thinking"}, {type: "text", text: "..."}]`
- Siempre especificar `max_tokens` suficiente (2000-2500 para contenido completo)
- `temperature: 0.4` da resultados consistentes

### 2. D1 Constraints
- Tablas existentes tienen constraints que pueden no estar documentadas
- Usar `PRAGMA table_info(table_name)` para ver schema real
- INSERT con ON CONFLICT puede fallar por constraints

### 3. Cloudflare Workers
- Workers no pueden hacerse fetch a sí mismos fácilmente
- Max execution time: 30s (CPU) / 60s (wall)
- Wrangler deploy得快 pero hay que esperar propagación

### 4. Astro Static Site
- `npm run build` genera sitio en `dist/`
- `npx wrangler pages deploy dist` deploya directamente
- Content en `src/data/cms/` se regenera en cada build

### 5. API Design
- Siempre incluir `ok: boolean` en responses
- Usar `{ data: ... }` wrapper para datos exitosos
- Usar `error: string` para errores

---

## 📋 PENDIENTE / RECOMENDACIONES

### Alta Prioridad

1. **Integrar Google Analytics o similar**
   - El tracking en CAPA 7 es simulado
   - Necesita datos reales de traffic

2. **Implementar verificador de rankings real**
   - APIs de SerpAPI o similar para rankings reales
   - Actualizar rankings periódicamente

3. **Pipeline CI/CD completo**
   - GitHub Actions para automatizar deploy
   - Webhook para triggers en commits

### Media Prioridad

4. **Dashboard visual en el Admin Panel**
   - Actualmente el contenido existe pero no hay UI para verlo
   - Necesita componente React/HTML para mostrar métricas

5. **Regeneración selectiva**
   - Botón para regenerar solo servicios específicos
   - Opción de regenerar con diferentes prompts

6. **Content versioning más robusto**
   - Poder comparar versiones
   - Rollback a versiones anteriores

### Baja Prioridad

7. **Soporte para ubicaciones**
   - Research de OSM ya funciona
   - Generar contenido para ubicaciones (Las Condes, Vitacura, etc.)

8. **Soporte para sectores**
   - Comercial, Industrial, Residencial, etc.
   - Contenido específico por sector

9. **A/B testing real**
   - Implementar variantes de contenido
   - Medir conversiones por variante

---

## 🔗 REFERENCIAS

### Documentación

| Recurso | Ubicación |
|---------|----------|
| Implementación CAPAs | `C:\Users\56930\OneDrive\Escritorio\guardman-site\CAPA1-CMS-IMPLEMENTATION.md` |
| Código Admin Panel | `C:\Users\56930\OneDrive\Escritorio\guardman-admin\src\host.ts` |
| Scripts de export | `C:\Users\56930\OneDrive\Escritorio\guardman-site\scripts\` |

### APIs Externas

| API | Documentación | API Key |
|-----|--------------|---------|
| MiniMax M2.7 | https://api.minimax.io/docs/api/ | `sk-cp-U-...` (Coding Plan) |
| Serper | https://serper.dev/api | `560f82db...` |

### Cloudflare Resources

| Recurso | ID/URL |
|---------|--------|
| Worker | guardman-admin-panel |
| D1 Database | guardman-seo (aeaab85c-d4df-46c4-96b9-28d6a95aaec4) |
| R2 Bucket | guardman-images |
| Pages | guardman-site |

---

## 📝 EJEMPLOS DE USO

### Generar contenido para un servicio

```bash
curl -X POST "https://guardman-admin-panel.oficinadesarrollo33.workers.dev/api/generate/service/guardias-de-seguridad" \
  -H "Authorization: Bearer GuardMan2026!@#Admin" \
  -H "Content-Type: application/json"
```

### Ejecutar research completo

```bash
curl -X POST "https://guardman-admin-panel.oficinadesarrollo33.workers.dev/api/research/service/cctv-videovigilancia" \
  -H "Authorization: Bearer GuardMan2026!@#Admin" \
  -H "Content-Type: application/json" \
  -d '{"sources": ["serper"]}'
```

### Verificar SEO de un servicio

```bash
curl "https://guardman-admin-panel.oficinadesarrollo33.workers.dev/api/validate/service/guardias-de-seguridad" \
  -H "Authorization: Bearer GuardMan2026!@#Admin"
```

### Exportar y rebuild del sitio

```bash
cd "C:\Users\56930\OneDrive\Escritorio\guardman-site"

# Exportar contenido
node scripts/export-cms.mjs all

# Hacer build
npm run build

# Deploy
npx wrangler pages deploy dist --project-name=guardman-site
```

### Ver reporte completo de analytics

```bash
curl "https://guardman-admin-panel.oficinadesarrollo33.workers.dev/api/analytics/report" \
  -H "Authorization: Bearer GuardMan2026!@#Admin"
```

### Ver health del sistema

```bash
curl "https://guardman-admin-panel.oficinadesarrollo33.workers.dev/api/monitor" \
  -H "Authorization: Bearer GuardMan2026!@#Admin"
```

---

## 🚀 PARA CONTINUAR EN OTRA SESIÓN

### Pasos para retomar

1. **Leer este documento** - Entender el estado actual
2. **Verificar acceso** - Admin Panel responde?
3. **Revisar pendientes** - Lista arriba
4. **Elegir prioridad** - Alta/Media/Baja

### Comandos de verificación rápida

```bash
# Health check
curl "https://guardman-admin-panel.oficinadesarrollo33.workers.dev/health"

# Ver APIs disponibles
curl "https://guardman-admin-panel.oficinadesarrollo33.workers.dev/api/services" \
  -H "Authorization: Bearer GuardMan2026!@#Admin"

# Ver analytics
curl "https://guardman-admin-panel.oficinadesarrollo33.workers.dev/api/analytics/report" \
  -H "Authorization: Bearer GuardMan2026!@#Admin"
```

### Si hay errores de deployment

```bash
cd "C:\Users\56930\OneDrive\Escritorio\guardman-admin"
npx wrangler deploy

cd "C:\Users\56930\OneDrive\Escritorio\guardman-site"
npm run build
npx wrangler pages deploy dist --project-name=guardman-site
```

---

**FIN DEL HANDOFF**
