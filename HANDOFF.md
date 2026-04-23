# 🔐 GuardMan Admin Panel — Handoff Document

**Fecha:** 15 Abril 2026 (Sesión 2)  
**Proyecto:** guardman-admin (Cloudflare Workers SPA)  
**Worker URL:** `https://guardman-admin-panel.oficinadesarrollo33.workers.dev`  
**D1 Database:** `guardman-seo` / `aeaab85c-d4df-46c4-96b9-28d6a95aaec4`  
**R2 Bucket:** `guardman-images`  
**Deploy command:** `cd guardman-admin && npx wrangler deploy`  
**Last deploy:** Version `73452f47-fd8b-4704-ba86-d643c8e1c5e7`

---

## 📋 Reglas Críticas del Proyecto

1. **NUNCA** usar `${}` template literals dentro del HTML (que vive dentro de `const HTML = \`...\``). Siempre usar concatenación con `+`.
2. **NUNCA** usar `onclick="func('arg')"` o `onerror="..."` inline. Siempre usar `data-attributes` + `addEventListener`.
3. **SIEMPRE** usar `esc()` para datos de usuario en HTML (prevenir XSS).
4. **SIEMPRE** probar en batches pequeños antes de operaciones masivas.
5. El archivo principal es `src/index.ts` (~960 líneas). Todo el HTML+CSS+JS vive adentro de un `const HTML = \`...\`` gigante.
6. Credenciales: `admin@guardman.cl` / `GuardMan2026!@#Admin`

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos Clave

```
guardman-admin/
├── src/
│   ├── index.ts              ← Main Worker (~960 lines). Todo el HTML/JS inline.
│   ├── serper/               ← Serper Agent Pipeline
│   │   ├── types.ts           — TypeScript interfaces (actualizado: paa, credits, query keys)
│   │   ├── layer1-queries.ts  — Strategic query generation
│   │   ├── layer2-executor.ts  — Serper API execution + storage (actualizado: sin fallback API key, soporta paa key)
│   │   ├── layer3-classifier.ts — Domain classification heuristics
│   │   └── index.ts           — Pipeline orchestrator + dashboard data + re-exports
│   ├── routes/               ← API route handlers (legacy, no changes)
│   ├── ai/                   ← MiniMax API wrapper
│   ├── durable/               ← Durable Objects (no changes)
│   └── layers/               ← Old pipeline code (legacy, not used)
├── sql/
│   ├── dynamic-workers-schema.sql
│   ├── seed-landmarks.sql     — 73 landmarks para 14 ubicaciones
│   ├── seed-faqs.py           — Script Python para generar FAQs
│   ├── seed-faqs-inserts.sql  — SQL completo con 630 FAQs
│   └── faqs-batch-{0..12}.sql — Batches para insert en D1
├── scripts/
│   ├── generate-content.sh    — Script para generar contenido AI
│   ├── execute-places.sh      — (obsoleto, usar endpoint execute-places)
│   └── execute-places-batch.sh — (obsoleto, usar endpoint execute-places)
└── wrangler.jsonc             ← Worker config (con migrations section)
```

### Sidebar Actual

```
Servicios | Ubicaciones | Sectores | Imagenes | CMS Editor
── Inteligencia ──
Serper Agent | SEO Dashboard
```

### API Endpoints

**Serper Agent (8 endpoints):**
- `GET /api/serper/dashboard` — Pipeline stats, top competitors, classification breakdown
- `POST /api/serper/plan` — Generate strategic query plan (dry-run)
- `POST /api/serper/execute` — Execute pipeline for service×location combo
- `POST /api/serper/execute-places` — ⭐ NUEVO: Execute only failed places queries (5 per batch)
- `POST /api/serper/classify` — Re-classify all existing results
- `POST /api/serper/reprocess` — ⭐ ACTUALIZADO: Re-parse stored response_json (con offset/limit para batches)
- `GET /api/serper/results?site_type=&limit=` — Results with filters
- `GET /api/serper/competitors` — Competitor domain analysis

**Auth & Content:**
- `POST /api/login` — Autenticación
- `GET|POST /api/services|locations|sectors` — CRUD
- `GET|POST /api/content` — Content versions CRUD
- `GET /api/content/latest/:type/:slug` — Latest content
- `POST /api/ai/generate` — AI content generation via MiniMax
- `GET|POST|DELETE /api/images` — R2 image management
- `GET /api/seo/dashboard` — SEO stats (usa serper/dashboard internamente)

---

## ✅ Trabajo Completado Esta Sesión

### P5 — Generar contenido para los entities faltantes ✅

**Qué se hizo:**
- Se eliminaron 4 registros de test (test, test-ai-service, test-final, test-service) de `content_versions`
- Se generó contenido AI para 5 ubicaciones faltantes: quilicura, renca, san-felipe, santiago-centro, vitacura
- Se generó contenido AI para 6 sectores faltantes: construccion, educacion, eventos, industrial, residencial, salud
- Todos generados con MiniMax M2.7 (no fallback)

**Resultado:**
- **9 servicios** con contenido AI ✅ (al menos 1 versión cada uno)
- **15 ubicaciones** con contenido AI ✅ (incluyendo providencia extra)
- **7 sectores** con contenido AI ✅
- **Total: 43 versiones** en content_versions (sin basura test)

### P7 — Re-ejecutar Places queries ✅

**Qué se hizo:**
- Se creó un nuevo endpoint `POST /api/serper/execute-places` que ejecuta solo las queries tipo `places` con `response_json` null/vacío
- Se ejecutaron las 117 queries places faltantes, una por combo
- 112/119 places queries ahora tienen datos (7 tienen `response_json = {"places":[]}` — zonas sin datos de Google Maps, es normal)
- Se agregaron 572 resultados tipo `place`

**Resultado:**
- Places con datos: 2 → 112 (+7 con arrays vacíos)
- Place results: ~10 → 572

### P8 — Extraer PAA/related_searches del response_json existente ✅ (verificado)

**Qué se hizo:**
- Se verificó que TODAS las 1,277 search queries tienen `paa: []` y `relatedSearches: []` vacíos
- Se actualizó `storeQueryAndResults()` en `layer2-executor.ts` para soportar ambos formatos (`peopleAlsoAsk` y `paa`)
- Se actualizó `SerperResponse` en `types.ts` para incluir `paa?`, `localPack?`, `credits?`, `query?`
- Se re-procesaron todos los datos (1,396 queries × ~10 results = ~13,300 resultados)

**Resultado:**
- No hay datos PAA/related_search/KG para extraer — las queries Serper no los devuelven para estos términos chilenos
- El código ahora soporta correctamente ambos formatos de key de la API

### P9 — Eliminar fallbacks hardcoded de API keys ✅

**Qué se hizo:**
- Eliminado `SERPER_API_KEY_FALLBACK` de `layer2-executor.ts`
- Eliminado fallback de `MINIMAX_API_KEY` de `index.ts`
- Ambos secrets configurados en Cloudflare: `SERPER_API_KEY`, `MINIMAX_API_KEY`, `AUTH_TOKEN`
- El código ahora lanza error si los secrets no están configurados en lugar de usar fallbacks

### Actualización de `storeQueryAndResults()` en layer2-executor.ts

- PAA ahora soporta ambos keys: `response.peopleAlsoAsk` y `response.paa`
- Related searches ahora soporta formato `{query: '...'}` y strings planos
- Knowledge graph ya funcionaba correctamente

### Clasificación re-ejecutada

- Se re-ejecutó `classifyAllResults()` con 13,300 resultados
- Resultado: 1,607 direct_competitor, 5,249 indirect_competitor, 1,881 job_board, 1,614 directory, etc.

---

## 📊 Estado de Datos Actual (D1)

| Tabla | Registros | Estado |
|---|---|---|
| `serper_queries` | 1,396 | 1,396 completed, 0 failed |
| `serper_results` | 13,300 | organic: 12,728, place: 572 |
| `content_versions` | 43 | 9 servicios + 15 ubicaciones + 7 sectores (sin basura) |
| `landmarks` | 73 | 14 ubicaciones con 4-8 landmarks |
| `faqs` | 630 | 9 servicios × 14 ubicaciones × 5 preguntas |
| `combos` | 126 | 9 servicios × 14 ubicaciones |
| `services` | 9 | — |
| `locations` | 14 | — |

**Distribución de site_type en serper_results:**

| site_type | Cantidad |
|---|---|
| indirect_competitor | 5,249 |
| job_board | 1,881 |
| directory | 1,614 |
| direct_competitor | 1,607 |
| social | 1,579 |
| irrelevant | 1,032 |
| marketplace | 157 |
| government | 109 |
| media | 45 |
| own | 27 |

**Top competidores directos:** sicseguridad.cl, federalseguridad.cl, federalchile.cl, federalaccess.cl, guardiasempresas.cl, prosegur.cl, c3a.cl, ayressecurity.cl, etc.

**Places queries:** 112/119 con datos (+7 con arrays vacíos = zonas sin Google Maps)

---

## 🔑 API Keys (Estado Post-Sesión)

| API | Ubicación Código | Wrangler Secret | Estado |
|---|---|---|---|
| Serper Dev | `layer2-executor.ts` — **NO hay fallback** | ✅ `SERPER_API_KEY` | Funciona sin fallback |
| MiniMax | `index.ts` — **NO hay fallback** | ✅ `MINIMAX_API_KEY` | Funciona sin fallback |
| Auth Token | Configurado via env | ✅ `AUTH_TOKEN` | — |

**⚠️ Los archivos legacy (`admin-complete.ts`, `host.ts`, `routes/ai.ts`, `routes/research.ts`) todavía tienen API keys hardcoded. Estos archivos NO se usan en producción (el entry point es `src/index.ts`). Se recomienda limpiarlos eventualmente.**

---

## ⏳ PENDIENTES (En Orden de Prioridad)

### P-FUTURO-1 — Bulk Serper Execution (NUEVO, antes P9)
Ejecutar el pipeline completo para los 126 combos restantes. Actualmente cada combo ya tiene sus 11 queries ejecutadas (1,396 total), así que este punto está parcialmente cubierto.

**Estado:** Las queries ya están ejecutadas. Lo que podría faltar es re-ejecutar queries donde los resultados cambiaron desde la primera ejecución.

### P-FUTURO-2 — Poblar tabla `landmarks` con más datos (OPCIONAL)
Ya hay 73 landmarks (5-8 por ubicación). Se podrían agregar más usando Overpass API de OpenStreetMap.

### P-FUTURO-3 — Mejorar `landmarks` usando datos OSM (OPCIONAL)
Agregarcampos lat/lng a la tabla locations para re-ejecutar places con coordenadas exactas.

### P-FUTURO-4 — Migrar frontend a framework (DESEABLE)
El HTML inline en TypeScript es difícil de mantener. Considerar React/Vue con build step.

### P-FUTURO-5 — Content version history/diff (DESEABLE)
El CMS guarda versiones pero no hay UI para ver historial o diff entre versiones.

### P-FUTURO-6 — Drag-and-drop upload (DESEABLE)
El upload actual usa un input file simple. Mejorar con drag-and-drop area.

---

## 🧪 Cómo Probar

### Deploy
```bash
cd "C:\Users\56930\OneDrive\Escritorio\guardman-admin" && npx wrangler deploy
```

### Verificar Secrets
```bash
npx wrangler secret list
# Debería mostrar: AUTH_TOKEN, MINIMAX_API_KEY, SERPER_API_KEY
```

### Verificar Content
```bash
npx wrangler d1 execute guardman-seo --remote --command="SELECT entity_type, COUNT(DISTINCT entity_slug) as entities FROM content_versions WHERE entity_slug NOT LIKE 'test%' GROUP BY entity_type"
# Esperado: service=9, location=15, sector=7
```

### Verificar Serper Dashboard
```bash
curl -H "Authorization: Bearer admin@guardman.cl:test" https://guardman-admin-panel.oficinadesarrollo33.workers.dev/api/serper/dashboard
```

### Verificar Places
```bash
npx wrangler d1 execute guardman-seo --remote --command="SELECT endpoint, COUNT(*) as total, SUM(CASE WHEN response_json IS NOT NULL AND LENGTH(response_json) > 100 THEN 1 ELSE 0 END) as with_data FROM serper_queries GROUP BY endpoint"
# Esperado: search=1277 con data, places=112 con data (+7 vacíos)
```

### Verificar Classification
```bash
npx wrangler d1 execute guardman-seo --remote --command="SELECT site_type, COUNT(*) as cnt FROM serper_results GROUP BY site_type ORDER BY cnt DESC"
# 10 categorías, total ~13,300
```

---

## 🗺️ Servicios (slugs)
guardias-de-seguridad, cctv-videovigilancia, control-de-accesos, escoltas-privados, monitoreo-24-7, seguridad-eventos, seguridad-industrial, auditoria-seguridad, guard-pod

## 📍 Ubicaciones (slugs)
las-condes, vitacura, lo-barnechea, la-reina, huechuraba, quilicura, conchali, santiago-centro, pudahuel, la-pintana, renca, lampa, los-andes, san-felipe

## Total Combos: 9 × 14 = 126