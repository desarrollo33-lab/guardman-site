# Plan de Recuperación CMS — GuardMan Chile
## Fecha: 2026-05-04 | Basado en auditoría completa del sistema guardman-admin + guardman-site
## Estado: ✅ IMPLEMENTADO — Todas las fases ejecutadas y pusheadas a GitHub

---

## Índice

1. [Resumen de Problemas](#1-resumen-de-problemas)
2. [Fase 0 — Estabilización Inmediata](#2-fase-0--estabilización-inmediata)
3. [Fase 1 — Unificar Save → Deploy](#3-fase-1--unificar-save--deploy)
4. [Fase 2 — Integrar Datos Serper](#4-fase-2--integrar-datos-serper)
5. [Fase 3 — Unificar Scoring SEO](#5-fase-3--unificar-scoring-seo)
6. [Fase 4 — Eliminar Textos Repetitivos](#6-fase-4--eliminar-textos-repetitivos)
7. [Fase 5 — Regeneración Masiva de Contenido](#7-fase-5--regeneración-masiva-de-contenido)
8. [Fase 6 — Verificación y Smoke Tests](#8-fase-6--verificación-y-smoke-tests)
9. [Checklist de Aceptación Final](#9-checklist-de-aceptación-final)
10. [Anexo A: Archivos a Modificar](#anexo-a-archivos-a-modificar)
11. [Anexo B: Datos Técnicos de la Auditoría](#anexo-b-datos-técnicos-de-la-auditoría)

---

## 1. Resumen de Problemas

| # | Problema | Severidad | Impacto |
|---|----------|-----------|---------|
| P1 | CMS editor no hace cambios reales | 🔴 Crítico | Ediciones se pierden, site nunca se actualiza |
| P2 | Datos Serper no se usan | 🟠 Alto | Keywords, competidores y gaps de contenido ignorados |
| P3 | Puntajes SEO inconsistentes | 🟠 Alto | 3 sistemas distintos dan scores diferentes |
| P4 | Textos repetitivos y keyword stuffing | 🔴 Crítico | 9 servicios con texto idéntico, 126 combos con template |
| P5 | Push a GitHub falla post-save | 🔴 Crítico | Token expirado, commit sin push, rebuild no dispara |

---

## 2. Fase 0 — Estabilización Inmediata

**Objetivo:** Restaurar funcionalidad básica del deploy.
**Duración estimada:** 30 minutos
**Prioridad:** Ejecutar ANTES que cualquier otra fase.

### 0.1 — Hacer push del commit pendiente

```bash
cd guardman-site
git push origin main
```

**Verificación:** `git log --oneline -1` en GitHub debe coincidir con local.

### 0.2 — Regenerar token de GitHub

1. Ir a GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Crear token con permisos:
   - `contents: write` en repo `desarrollo33-lab/guardman-site`
   - `actions: write` en repo `desarrollo33-lab/guardman-site`
3. Guardar el nuevo token como `GITHUB_PUSH_TOKEN` en:
   - **Cloudflare Worker env vars** del guardman-admin
   - **GitHub Actions secrets** del repo guardman-site (solo si se necesita para otros workflows)

### 0.3 — Limpiar remote URL del token expuesto

```bash
cd guardman-site
git remote set-url origin https://github.com/desarrollo33-lab/guardman-site.git
```

### 0.4 — Verificar que el deploy manual funciona

```bash
cd guardman-site
node scripts/sync-from-admin.mjs
npm run build
npx wrangler pages deploy dist --project-name=guardman-site-v2
```

**Verificación:** El site en `guardman-site-v2.pages.dev` carga correctamente.

### 0.5 — Verificar `CF_API_TOKEN` en GitHub Secrets

Ir a GitHub → repo Settings → Secrets and variables → Actions:
- Confirmar que `CF_API_TOKEN` existe y es válido

---

## 3. Fase 1 — Unificar Save → Deploy

**Objetivo:** Cuando el usuario guarda en el Admin, los cambios deben llegar al site publicado automáticamente.
**Duración estimada:** 2-3 horas

### 1.1 — Problema raíz

El flujo actual es:

```
Admin UI → POST /api/cms/save → D1 database
                                             ↓ (requiere sync manual)
                                     guardman-site/build
                                             ↓ (requiere push manual)  
                                     Cloudflare Pages
```

### 1.2 — Nuevo flujo unificado

```
Admin UI → POST /api/cms/save → D1 database
                                ↓ (automático)
                           GitHub Actions dispatch
                                ↓ (automático)
                           sync-from-admin → build → deploy
```

### 1.3 — Cambios en `guardman-admin/src/api/routes/cms.ts`

#### 1.3.1 — Reparar `triggerSiteRebuild()`

```typescript
// ANTES (problemático):
async function triggerSiteRebuild(env: any): Promise<void> {
  if (!env.CACHE) return;  // ← Si CACHE no existe, NUNCA se ejecuta
  const lastTrigger = await env.CACHE.get('last-rebuild-trigger');
  if (lastTrigger) return;  // ← Debounce de 5min silencia todos los saves
  // ...
}

// DESPUÉS:
async function triggerSiteRebuild(env: any): Promise<void> {
  const token = env.GITHUB_PUSH_TOKEN;
  if (!token) {
    console.error('[CMS] GITHUB_PUSH_TOKEN not configured');
    return;
  }

  // Debounce: solo 1 rebuild cada 2 minutos
  try {
    if (env.CACHE) {
      const lastTrigger = await env.CACHE.get('last-rebuild-trigger');
      if (lastTrigger) {
        console.log('[CMS] Rebuild debounced, skipping');
        return;
      }
      await env.CACHE.put('last-rebuild-trigger', Date.now().toString(), { expirationTtl: 120 });
    }
  } catch {
    // Si CACHE falla, continuar igual
  }

  try {
    const resp = await fetch(`https://api.github.com/repos/desarrollo33-lab/guardman-site/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'User-Agent': 'guardman-admin',
      },
      body: JSON.stringify({
        event_type: 'cms-update',
        client_payload: {
          timestamp: new Date().toISOString(),
          source: 'guardman-admin-cms-save',
          changed_entity: `${entityType}/${entitySlug}`,  // nuevo: para debugging
        },
      }),
    });

    if (!resp.ok) {
      const body = await resp.text();
      console.error(`[CMS] GitHub dispatch failed: ${resp.status} ${body}`);
    } else {
      console.log(`[CMS] Site rebuild triggered for ${entityType}/${entitySlug}`);
    }
  } catch (e) {
    console.error('[CMS] Rebuild trigger error:', (e as Error).message);
  }
}
```

#### 1.3.2 — Unificar formato de guardado para combos

El problema: `sync-from-admin.mjs` guarda combos como:
```json
{ "sections": { "hero": {...}, ... } }
```

Pero el admin guarda en D1 como `content_json` que puede ser:
```json
{ "sections": { "hero": {...} } }
```
o directamente:
```json
{ "hero": {...}, "intro": {...} }
```

**Solución:** Estandarizar en `cms.ts`, ruta `/api/cms/save`:

```typescript
// Normalizar antes de guardar:
const rawContent: any = content;
let sections: any;

if (rawContent.content && rawContent.content.hero) {
  // Formato API: { content: { hero: {...} }, seo: {...} }
  sections = rawContent.content;
} else if (rawContent.sections) {
  // Formato CMS JSON: { sections: { hero: {...} } }
  sections = rawContent.sections;
} else {
  // Formato plano: { hero: {...}, intro: {...} }
  sections = rawContent;
}

const dbContent = { sections };
if (rawContent.seo) dbContent.seo = rawContent.seo;
if (rawContent.related_content) dbContent.related_content = rawContent.related_content;
const contentJson = JSON.stringify(dbContent);
```

#### 1.3.3 — Homepage: guardar en D1 en vez de solo GitHub

El homepage actualmente solo se guarda en GitHub via Octokit. Necesitamos guardarlo también en D1 para que `sync-from-admin.mjs` pueda bajarlo.

```typescript
// En el handler de /api/cms/save, agregar después del guardado en GitHub:
if (path === 'homepage.json') {
  // ... existing GitHub save code ...

  // NUEVO: Guardar también en D1 para que sync pueda bajarlo
  await env.DB.prepare(`
    INSERT INTO content_versions (entity_type, entity_slug, version, content_json, generated_by, word_count)
    VALUES ('page', 'homepage', 1, ?, 'manual', ?)
    ON CONFLICT(entity_type, entity_slug) DO UPDATE SET
      content_json = excluded.content_json,
      generated_by = 'manual',
      word_count = excluded.word_count
  `).bind(JSON.stringify(content), JSON.stringify(content).split(/\s+/).length).run();
}
```

Y en `sync-from-admin.mjs`, cambiar la sección de homepage para que también intente D1:

```javascript
// Sync homepage — try D1 first, then GitHub
try {
  const hpRes = await fetch(`${API_BASE}/api/cms/homepage`);
  const hpData = await hpRes.json();
  if (hpData.ok && hpData.content) {
    const hpJson = JSON.stringify(hpData.content, null, 2);
    writeFileSync('homepage.json', hpJson);
    writeFileSync(join(CMS_DIR, 'homepage.json'), hpJson);
    console.log('Homepage synced');
  }
} catch (e) {
  console.warn('Homepage sync failed:', e.message);
}
```

### 1.4 — Actualizar `deploy.yml` para mejor logging

```yaml
name: Sync & Deploy Site

on:
  repository_dispatch:
    types: [cms-update]
  workflow_dispatch:

jobs:
  sync-build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Sync from Admin API
        run: node scripts/sync-from-admin.mjs
        env:
          NODE_ENV: production

      - name: Validate CMS data
        run: node scripts/validate-cms.mjs

      - name: Build Astro Site
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          command: pages deploy dist --project-name=guardman-site-v2

      - name: Health Check
        run: |
          sleep 30
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://guardman-site-v2.pages.dev/)
          if [ "$STATUS" != "200" ]; then echo "Health check failed: $STATUS"; exit 1; fi
          echo "Deploy successful - HTTP $STATUS"

      - name: Notify success
        if: success()
        run: echo "✅ Site deployed at $(date)"

      - name: Notify failure
        if: failure()
        run: echo "❌ Deploy failed!"
```

### 1.5 — Verificación de Fase 1

- [ ] Guardar un cambio en el Admin → verificar que aparece en D1
- [ ] Verificar que el dispatch a GitHub Actions se dispara (revisar logs del Worker)
- [ ] Verificar que el workflow de GitHub Actions ejecuta sync + build + deploy
- [ ] Verificar que el cambio aparece en el site publicado

---

## 4. Fase 2 — Integrar Datos Serper

**Objetivo:** Las 1,268 keywords, competidores, y gaps de contenido deben influir en el SEO del site.
**Duración estimada:** 3-4 horas

### 2.1 — Crear un módulo SEO unificado en el site

**Nuevo archivo: `src/data/seo-data.ts`**

```typescript
/**
 * SEO Data Module — Loads Serper-derived data for use in pages
 * Reads from src/data/generated/seo-keywords.json and seo-meta.json
 */
import { readFileSync, existsSync } from 'fs';

interface SEOKeywordData {
  primary_keyword: string;
  secondary_keywords: string[];
  easy_wins: string[];
}

interface SEOMetaData {
  primary_keyword: string;
  meta_title: string;
  meta_description: string;
}

// Indexed by serviceSlug → locationSlug → data
let keywordsIndex: Record<string, Record<string, SEOKeywordData>> = {};
let metaIndex: Record<string, Record<string, SEOMetaData>> = {};

export function loadSEOData(): void {
  const kwPath = 'src/data/generated/seo-keywords.json';
  const metaPath = 'src/data/generated/seo-meta.json';

  if (existsSync(kwPath)) {
    try {
      keywordsIndex = JSON.parse(readFileSync(kwPath, 'utf-8'));
    } catch { /* ignore */ }
  }

  if (existsSync(metaPath)) {
    try {
      metaIndex = JSON.parse(readFileSync(metaPath, 'utf-8'));
    } catch { /* ignore */ }
  }
}

export function getSEOKeywords(serviceSlug: string, locationSlug?: string): SEOKeywordData | null {
  if (!locationSlug) return null;
  return keywordsIndex[serviceSlug]?.[locationSlug] || null;
}

export function getSEOMeta(serviceSlug: string, locationSlug?: string): SEOMetaData | null {
  if (!locationSlug) return null;
  return metaIndex[serviceSlug]?.[locationSlug] || null;
}

export function getEasyWins(serviceSlug: string): string[] {
  const easyWins: string[] = [];
  const serviceData = keywordsIndex[serviceSlug];
  if (!serviceData) return easyWins;

  for (const locationData of Object.values(serviceData)) {
    if (locationData.easy_wins) {
      easyWins.push(...locationData.easy_wins);
    }
  }

  // Deduplicate and return top 20
  return [...new Set(easyWins)].slice(0, 20);
}

// Preload
loadSEOData();
```

### 2.2 — Modificar las páginas combo para usar datos Serper

**Archivo: `src/pages/servicios/[slug]/[location].astro`**

Cambios en el frontmatter:

```typescript
// Agregar import:
import { getSEOKeywords, getSEOMeta } from '../../../data/seo-data';

// En el cuerpo del script, después de las variables existentes:
const seoKeywords = getSEOKeywords(serviceSlug, locationSlug);
const seoMeta = getSEOMeta(serviceSlug, locationSlug);

// Reemplazar la generación de metaTitle y metaDescription:
const metaTitle = comboSections?.meta?.title
  || seoMeta?.meta_title
  || `${hero.heading} en ${locationName} | GuardMan`;
const metaDescription = comboSections?.meta?.description
  || seoMeta?.meta_description
  || `Servicio de ${serviceName.toLowerCase()} profesional en ${locationName}. Solicita tu cotización.`;
```

Y en el HTML, agregar keywords al schema markup:

```astro
<!-- En SchemaService, agregar keywords si disponibles -->
{s seoKeywords && (
  <meta name="keywords" content={seoKeywords.secondary_keywords.join(', ')} />
)}
```

### 2.3 — Modificar páginas de servicio para usar easy-wins

**Archivo: `src/pages/servicios/[slug].astro`**

```typescript
import { getEasyWins } from '../../data/seo-data';

const easyWins = getEasyWins(slug);
```

En el `<head>` via BaseLayout o directamente:

```astro
{easyWins.length > 0 && (
  <meta name="keywords" content={easyWins.join(', ')} />
)}
```

### 2.4 — Actualizar `generate-seo-meta.mjs` para incluir datos de competidores

El script actual genera SEO meta básico. Mejorarlo para:

```javascript
// Agregar generación de meta descriptions que mencionen diferenciadores:
function generateMetaDescription(serviceName, locationName, zone, competitors) {
  // Si tenemos datos de competidores, mencionar diferenciación
  const hasCompetitorData = competitors && competitors.length > 0;

  if (hasCompetitorData) {
    return `${serviceName} en ${locationName} con guardias certificados OS-10 y centro de monitoreo propio. A diferencia de otras empresas, ofrecemos respuesta en menos de 30 minutos y cobertura 24/7 en ${zone}. Cotiza gratis.`;
  }

  // Fallback
  return `Servicio profesional de ${serviceName.toLowerCase()} en ${locationName}, zona ${zone}. Guardias certificados OS-10, monitoreo 24/7. Cotización gratuita en GuardMan Chile.`;
}
```

### 2.5 — Persistir keywords Serper en los JSON del CMS

**Modificar `sync-from-admin.mjs`:** Al guardar combo JSON, agregar campo `_seo` con keywords:

```javascript
// En la sección de combo sync:
for (const s of services) {
  for (const l of locations) {
    const content = await fetchCMSContent('combo', s.slug, l.slug);
    if (content) {
      const enriched = typeof content === 'object' ? content : {};
      // Agregar keywords si están disponibles
      const keywords = keywordIndex[s.slug]?.[l.slug];
      if (keywords) {
        enriched._seo = {
          primary_keyword: keywords.primary_keyword,
          secondary_keywords: keywords.secondary_keywords?.slice(0, 10),
          easy_wins: keywords.easy_wins?.slice(0, 5),
        };
      }
      writeFileSync(
        join(CMS_DIR, `combo-${s.slug}-${l.slug}.json`),
        JSON.stringify({ sections: enriched.content || enriched }, null, 2)
      );
      synced++;
    }
  }
}
```

### 2.6 — Verificación de Fase 2

- [ ] `seo-data.ts` carga correctamente las keywords desde los archivos generados
- [ ] Las páginas combo usan meta title/description de Serper cuando están disponibles
- [ ] Las páginas de servicio incluyen meta keywords con easy-wins
- [ ] Los JSON de CMS incluyen campo `_seo` con keywords relevantes
- [ ] `generate-seo-meta.mjs` produce meta descriptions diferenciadas

---

## 5. Fase 3 — Unificar Scoring SEO

**Objetivo:** Un solo sistema de scoring que sea consistente entre backend y frontend.
**Duración estimada:** 2-3 horas

### 3.1 — Crear scoring unificado

**Modificar `guardman-admin/src/services/scoring.ts`:**

```typescript
// scoring.ts v2 — Unified scoring system

export interface ContentScore {
  score: number;          // 0-100
  details: {
    localRelevance: number;  // 0-20
    seoOptimization: number; // 0-25
    contentQuality: number;  // 0-25
    differentiation: number; // 0-15
    structure: number;       // 0-15
  };
  breakdown: { [key: string]: { points: number; max: number; notes: string[] } };
  warnings: string[];      // Nuevo: advertencias de repetición
}

export function calculateContentScore(contentJson: any, serperKeywords?: string[]): ContentScore {
  // ... (mantener la estructura existente pero agregar:)

  // ═══ NUEVO: Verificación de repetición de palabras ═══
  const warnings: string[] = [];
  const wordFreq: Record<string, number> = {};
  const words = allText.toLowerCase().split(/\s+/).filter(w => w.length > 4);

  for (const word of words) {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  }

  const totalWords = words.length;
  const repeatedWords = Object.entries(wordFreq)
    .filter(([word, count]) => count > totalWords * 0.03 && count > 3)
    .map(([word, count]) => ({ word, count, pct: ((count / totalWords) * 100).toFixed(1) }));

  for (const rw of repeatedWords) {
    warnings.push(`"${rw.word}" aparece ${rw.count} veces (${rw.pct}%) — posible keyword stuffing`);
    br.contentQuality.points -= 2;  // Penalizar
  }

  // ═══ NUEVO: Diversidad léxica (Type-Token Ratio) ═══
  const uniqueWords = new Set(words).size;
  const ttr = totalWords > 0 ? uniqueWords / totalWords : 0;
  if (ttr < 0.4) {
    warnings.push(`Type-Token Ratio: ${(ttr * 100).toFixed(1)}% — texto muy repetitivo (mínimo 40%)`);
    br.contentQuality.points -= 3;
  } else if (ttr >= 0.5) {
    br.contentQuality.points += 2;  // Bonus por diversidad
  }

  // ═══ NUEVO: Verificar keywords Serper si están disponibles ═══
  if (serperKeywords && serperKeywords.length > 0) {
    const coveredKeywords = serperKeywords.filter(kw =>
      allText.toLowerCase().includes(kw.toLowerCase())
    );
    const keywordCoverage = coveredKeywords.length / Math.min(serperKeywords.length, 10);

    if (keywordCoverage >= 0.3) {
      br.seoOptimization.points += 4;  // Bonus por usar keywords reales
    } else {
      br.seoOptimization.notes.push(`Solo ${coveredKeywords.length}/${serperKeywords.length} keywords Serper presentes`);
    }
  }

  // Clamp scores
  for (const key of Object.keys(br) as (keyof typeof br)[]) {
    br[key].points = Math.max(0, Math.min(br[key].max, br[key].points));
  }

  const total = Object.values(br).reduce((sum, b) => sum + b.points, 0);

  return {
    score: total,
    details: {
      localRelevance: br.localRelevance.points,
      seoOptimization: br.seoOptimization.points,
      contentQuality: br.contentQuality.points,
      differentiation: br.differentiation.points,
      structure: br.structure.points,
    },
    breakdown: br,
    warnings,
  };
}
```

### 3.2 — Sincronizar SEOPanel del frontend con el scoring del backend

**Modificar `guardman-admin-ui/src/components/CMS/SEOPanel.tsx`:**

Reemplazar la función `calculateScore()` con una llamada al backend:

```typescript
// En CMSPage.tsx, agregar endpoint de scoring:
const scoreContent = async () => {
  if (!content) return;
  try {
    const result = await fetch(`${API_BASE}/api/cms/score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('gm_token') || ''}`
      },
      body: JSON.stringify({ content })
    });
    const data = await result.json();
    if (data.ok) {
      setBackendScore(data.score);
      setScoreWarnings(data.warnings || []);
    }
  } catch (err: any) {
    console.error('Scoring failed:', err);
  }
};
```

**Agregar ruta en `cms.ts`:**

```typescript
{
  pattern: /^\/api\/cms\/score$/,
  methods: ['POST'],
  handler: async (request: Request, env: any): Promise<Response | null> => {
    const { content } = await request.json();
    const { calculateContentScore } = await import('../../services/scoring');
    const score = calculateContentScore(content);
    return Response.json({ ok: true, ...score }, { headers: CORS_HEADERS });
  }
}
```

**En el SEOPanel**, usar el score del backend cuando esté disponible, con fallback al scoring local:

```typescript
// Reemplazar calculateScore local con:
const backendScore = /* prop pasada desde CMSPage */;
const displayScore = backendScore !== null ? backendScore : calculateLocalScore(checks);
```

### 3.3 — Verificación de Fase 3

- [ ] El scoring del backend detecta repetición de palabras y penaliza
- [ ] El Type-Token Ratio se calcula correctamente
- [ ] Las keywords Serper se verifican contra el contenido
- [ ] El SEOPanel muestra el mismo score que el backend
- [ ] Las advertencias de repetición son visibles en el UI

---

## 6. Fase 4 — Eliminar Textos Repetitivos

**Objetivo:** Cada servicio, ubicación y combo debe tener contenido único y diferenciado.
**Duración estimada:** 4-5 horas (incluye mejoras al prompt + guardrails)

### 4.1 — Mejorar el prompt de generación AI

**Modificar `guardman-admin/src/services/content-generation.ts` o el prompt en `cms.ts`:**

El prompt actual es genérico. Nuevo prompt para servicios:

```typescript
const SERVICE_PROMPTS: Record<string, string> = {
  'guardias-de-seguridad': `
SERVICIO: Guardias de Seguridad Presenciales
ENFOQUE: Personal físico uniformado, vigilancia humana, control de accesos, rondas perimetrales.
DIFERENCIADOR vs competencia: Centro de monitoreo propio (no tercearizado), certificación OS-10 interna, supervisores de campo en cada zona.
NO MENCIONAR: cámaras, CCTV, tecnología, videovigilancia (eso es otro servicio).
PALABRAS CLAVE OBLIGATORIAS: guardia, vigilancia, portería, ronda, turno, OS-10, presencia disuasoria.
`,
  'cctv-videovigilancia': `
SERVICIO: CCTV y Videovigilancia
ENFOQUE: Cámaras IP, grabación, almacenamiento, acceso remoto, analítica de video.
DIFERENCIADOR vs competencia: Diseño personalizado post-auditoría, integración con centro de monitoreo propio, acceso app móvil.
NO MENCIONAR: guardias físicos, rondas, portería (eso es guardias-de-seguridad).
PALABRAS CLAVE OBLIGATORIAS: cámara, CCTV, videovigilancia, grabación, remoto, monitoreo, resolución, cobertura.
`,
  'control-de-accesos': `
SERVICIO: Control de Accesos
ENFOQUE: Biométricos, RFID, torniquetes, portones automáticos, registro digital de visitas.
DIFERENCIADOR vs competencia: Integración total con CCTV y monitoreo centralizado, sistema de alertas en tiempo real.
NO MENCIONAR: guardias de seguridad física, videovigilancia (otros servicios).
PALABRAS CLAVE OBLIGATORIAS: acceso, biométrico, RFID, registro, visitante, autorización, perímetro, ingreso.
`,
  'escoltas-privados': `
SERVICIO: Escoltas Privados
ENFOQUE: Protección ejecutiva, traslados de alto valor, evaluación de riesgos, conducción evasiva.
DIFERENCIADOR vs competencia: Personal con formación en protección ejecutiva internacional, coordinación con Carabineros.
NO MENCIONAR: guardias fijos, CCTV, control de accesos (otros servicios).
PALABRAS CLAVE OBLIGATORIAS: escolta, protección ejecutiva, traslado, ruta, riesgo, VIP, diplomático, valor.
`,
  'monitoreo-24-7': `
SERVICIO: Monitoreo 24/7
ENFOQUE: Centro de control, operadores certificados, verificación de alarmas, coordinación con Carabineros.
DIFERENCIADOR vs competencia: Centro de monitoreo PROPIO (no tercearizado), operadores dedicados por cliente.
NO MENCIONAR: guardias físicos en terreno, cámaras (otros servicios).
PALABRAS CLAVE OBLIGATORIAS: monitoreo, centro de control, operador, alarma, respuesta, 24/7, verificación, coordinación.
`,
  'seguridad-eventos': `
SERVICIO: Seguridad para Eventos
ENFOQUE: Control de masas, protección VIP, planes de evacuación, logística de seguridad.
DIFERENCIADOR vs competencia: Planos de seguridad con aforo, personal entrenado en control de masas.
NO MENCIONAR: guardias fijos, monitoreo remoto (otros servicios).
PALABRAS CLAVE OBLIGATORIAS: evento, aforo, evacuación, multitud, VIP, recinto, logística, protocolo.
`,
  'seguridad-industrial': `
SERVICIO: Seguridad Industrial
ENFOQUE: Vigilancia perimetral, control vehicular, protección de mercadería, fábricas y bodegas.
DIFERENCIADOR vs competencia: Guard Pod para perímetros extensos, protocolos específicos para cadenas productivas.
NO MENCIONAR: eventos, escoltas, residencial (otros servicios/sectores).
PALABRAS CLAVE OBLIGATORIAS: industrial, perímetro, bodega, fábrica, maquinaria, carga, naviero, logístico.
`,
  'auditoria-seguridad': `
SERVICIO: Auditoría de Seguridad
ENFOQUE: Diagnóstico profesional, informe de vulnerabilidades, recomendaciones priorizadas.
DIFERENCIADOR vs competencia: Servicio gratuito y sin compromiso, informe técnico con fotografías, seguimiento post-auditoría.
NO MENCIONAR: guardias, cámaras, monitoreo (venta directa de otros servicios).
PALABRAS CLAVE OBLIGATORIAS: auditoría, diagnóstico, vulnerabilidad, evaluación, informe, recomendación, riesgo, prevención.
`,
  'guard-pod': `
SERVICIO: Guard Pod (Unidad Autónoma)
ENFOQUE: Unidad solar, cámaras PTZ 360°, visión nocturna, 4G, despliegue en 2 horas.
DIFERENCIADOR vs competencia: Diseñado y fabricado en Chile, 15 meses de I+D, no requiere infraestructura eléctrica.
NO MENCIONAR: guardias humanos, turnos, personal físico (es un producto tecnológico).
PALABRAS CLAVE OBLIGATORIAS: Guard Pod, autónomo, solar, PTZ, 360°, 4G, despliegue, vigilancia remota.
`,
};
```

### 4.2 — Mejorar el prompt de combos (location-specific)

Para combos, el prompt debe ser específico a la zona:

```typescript
const ZONE_PROMPTS: Record<string, string> = {
  'Oriente': `
ZONA ORIENTE (Las Condes, Vitacura, Lo Barnechea, La Reina):
- Perfil: Residencias de alto nivel, embajadas, centros corporativos Sanhattan.
- Problemas: Robo de vehículos de lujo, ingreso no autorizado a edificios inteligentes, vandalismo en áreas verdes.
- Tono: Discreto, profesional, orientado a ejecutivos y familias de alto poder adquisitivo.
- Mencionar: Torres corporativas, condominios premium, centros financieros.
`,
  'Centro': `
ZONA CENTRO (Santiago Centro):
- Perfil: Alto flujo peatonal, comercio tradicional, oficinas gubernamentales, turismo.
- Problemas: Hurto en locales comerciales, carterismo en zonas de alta afluencia, acceso no controlado a edificios públicos.
- Tono: Eficiente, orientado a control de flujos, protección patrimonial.
- Mencionar: Paseo Ahumada, Plaza de Armas, La Alameda, Barrio Lastarria.
`,
  'Norte': `
ZONA NORTE (Huechuraba, Quilicura, Renca, Conchalí, Lampa):
- Perfil: Zona industrial, bodegas, centros logísticos, urbanizaciones nuevas.
- Problemas: Robo de materiales, intrusión perimetral en bodegas, accidentes laborales.
- Tono: Orientado a operación industrial, seguridad perimetral, control vehicular.
- Mencionar: Parques industriales, centros logísticos, bodegas.
`,
  'Sur': `
ZONA SUR (La Pintana, Puente Alto):
- Perfil: Zona residencial en crecimiento, comercio local, comunidades vulnerables.
- Problemas: Delincuencia en pasajes sin vigilancia, robo de especies, microtráfico en espacios públicos.
- Tono: Cercano, comunitario, preventivo, accesible.
- Mencionar: Poblaciones, pasajes, comunidades, vecindarios.
`,
};
```

### 4.3 — Agregar guardrails de repetición

**Modificar `guardman-admin/src/services/guardrails.ts`:**

```typescript
export interface GuardrailResult {
  passed: boolean;
  violations: string[];
  warnings: string[];
  ttr: number;  // Type-Token Ratio
}

export function checkContentGuardrails(content: any): GuardrailResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  const sections = content.sections || content;
  const allText = extractAllText(sections);

  // 1. Verificar Type-Token Ratio
  const words = allText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const uniqueWords = new Set(words).size;
  const ttr = words.length > 0 ? uniqueWords / words.length : 0;

  if (ttr < 0.35) {
    violations.push(`Type-Token Ratio ${(ttr * 100).toFixed(1)}% es demasiado bajo (mínimo 35%)`);
  } else if (ttr < 0.45) {
    warnings.push(`Type-Token Ratio ${(ttr * 100).toFixed(1)}% es bajo (recomendado >45%)`);
  }

  // 2. Detectar palabras repetidas excesivamente
  const freq: Record<string, number> = {};
  for (const w of words) {
    freq[w] = (freq[w] || 0) + 1;
  }

  const totalWords = words.length;
  const overused = Object.entries(freq)
    .filter(([word, count]) => {
      // Ignorar stop words comunes en español
      const stopWords = ['para', 'como', 'pero', 'sobre', 'entre', 'cuando', 'donde', 'puede', 'tiene', 'otra', 'otros', 'todas', 'todas'];
      if (stopWords.includes(word)) return false;
      return count > Math.max(totalWords * 0.025, 5);
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  for (const [word, count] of overused) {
    const pct = ((count / totalWords) * 100).toFixed(1);
    warnings.push(`"${word}" aparece ${count} veces (${pct}% del texto)`);
  }

  // 3. Verificar que features/issues no son idénticos entre secciones
  const featureText = (sections.features?.items || []).join(' ');
  const issueText = (sections.issues?.items || []).join(' ');
  if (featureText && issueText) {
    const overlap = calculateTextOverlap(featureText, issueText);
    if (overlap > 0.3) {
      warnings.push(`Features e Issues comparten ${Math.round(overlap * 100)}% de contenido`);
    }
  }

  // 4. Verificar que intro no copia de hero
  const heroText = [sections.hero?.heading, sections.hero?.subheading].join(' ');
  const introText = (sections.intro?.paragraphs || []).join(' ');
  if (heroText && introText) {
    const overlap = calculateTextOverlap(heroText, introText);
    if (overlap > 0.5) {
      warnings.push('Intro repite contenido del hero');
    }
  }

  return {
    passed: violations.length === 0,
    violations,
    warnings,
    ttr,
  };
}

function calculateTextOverlap(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 4));
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 4));
  if (words1.size === 0 || words2.size === 0) return 0;

  const intersection = [...words1].filter(w => words2.has(w));
  return intersection.length / Math.min(words1.size, words2.size);
}

function extractAllText(sections: any): string {
  const parts: string[] = [];
  if (sections.hero?.heading) parts.push(sections.hero.heading);
  if (sections.hero?.subheading) parts.push(sections.hero.subheading);
  if (sections.intro?.paragraphs) parts.push(...sections.intro.paragraphs);
  if (sections.features?.items) parts.push(...sections.features.items);
  if (sections.issues?.items) parts.push(...sections.issues.items);
  if (sections.cta?.heading) parts.push(sections.cta.heading);
  if (sections.cta?.subheading) parts.push(sections.cta.subheading);
  return parts.join(' ');
}
```

### 4.4 — Modificar content-agent para usar prompts específicos

En `content-agent.ts`, la llamada a `callMiniMaxAI` debe recibir el contexto específico del servicio:

```typescript
// Antes de la generación AI:
const servicePrompt = SERVICE_PROMPTS[job.entitySlug] || '';
const locationPrompt = job.comboLocationSlug ? ZONE_PROMPTS[location.zone] || '' : '';

// Inyectar en el contexto AI:
const specificContext = `
${servicePrompt}
${locationPrompt}

REGLAS DE CALIDAD:
- Cada feature debe ser ÚNICO para este servicio. NO usar features genéricos como "Personal con certificación OS-10" en todos los servicios.
- Las issues deben ser específicas al tipo de propiedad y zona. NO repetir "Accesos no controlados" en todas las páginas.
- El proceso debe ser diferente según el servicio. Una auditoría no tiene el mismo proceso que una escolta.
- El intro debe hablar específicamente del servicio, NO de la empresa en general.
- NUNCA repitas la misma palabra más del 2.5% del total del texto.
- Type-Token Ratio mínimo: 45%.
`;
```

### 4.5 — Verificación de Fase 4

- [ ] Los prompts específicos por servicio generan contenido diferenciado
- [ ] Los guardrails detectan y bloquean contenido repetitivo (TTR < 35%)
- [ ] Los features de cada servicio son únicos
- [ ] Los combos de diferentes zonas tienen texto diferente
- [ ] No hay frases idénticas entre servicios

---

## 7. Fase 5 — Regeneración Masiva de Contenido

**Objetivo:** Regenerar todo el contenido con el pipeline mejorado.
**Duración estimada:** 6-8 horas (la generación AI toma tiempo)

### 5.1 — Preparación

1. Hacer backup de los JSON actuales:

```bash
cd guardman-site
cp -r src/data/cms src/data/cms-backup-$(date +%Y%m%d)
```

2. Verificar que las mejoras de Fases 2-4 están deployadas en el Admin API.

### 5.2 — Regeneración por prioridad

**Prioridad 1: Servicios (9 páginas)**

```bash
# Via Admin API - regenerar cada servicio
for slug in guardias-de-seguridad cctv-videovigilancia control-de-accesos escoltas-privados monitoreo-24-7 seguridad-eventos seguridad-industrial auditoria-seguridad guard-pod; do
  curl -X POST https://guardman-admin-api.oficinadesarrollo33.workers.dev/api/cms/regenerate \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"type\": \"service\", \"slug\": \"$slug\"}"
  echo "Regenerated: $slug"
  sleep 30  # Rate limiting
done
```

**Prioridad 2: Combos más importantes (top 20 por tráfico potencial)**

```
guardias-de-seguridad × las-condes
guardias-de-seguridad × santiago-centro
guardias-de-seguridad × vitacura
guardias-de-seguridad × huechuraba
cctv-videovigilancia × las-condes
cctv-videovigilancia × santiago-centro
control-de-accesos × las-condes
monitoreo-24-7 × las-condes
guard-pod × las-condes
seguridad-industrial × quilicura
... (top 20 basados en priority_score de Serper)
```

**Prioridad 3: Resto de combos (106 páginas)**

Usar el endpoint bulk del ContentAgent.

### 5.3 — Verificación post-regeneración

Para cada página regenerada:

1. **Scoring:** Score >= 70 (sin warnings de repetición)
2. **Unicidad:** Verificar que el contenido no es idéntico a otros servicios
3. **Keywords:** Al menos 3 keywords Serper presentes en el texto
4. **Longitud:** Intro >= 3 párrafos de 50+ palabras cada uno
5. **Features:** >= 6 features únicos para el servicio específico

Script de verificación:

```javascript
// verify-content.mjs
import { readFileSync, readdirSync } from 'fs';

const CMS_DIR = 'src/data/cms';

// Cargar todos los servicios
const services = readdirSync(CMS_DIR)
  .filter(f => !f.startsWith('combo-') && !f.startsWith('location-') && !f.startsWith('sector-') && !f.startsWith('hub-') && !f.startsWith('pages-') && f.endsWith('.json') && !['services.json', 'locations.json', 'sectors.json', 'config.json', 'zones.json', 'staff.json', 'media-map.json', 'brand.json'].includes(f))
  .map(f => JSON.parse(readFileSync(`${CMS_DIR}/${f}`, 'utf-8')));

// Verificar unicidad de features entre servicios
const allFeatures: Map<string, Set<string>> = new Map();
for (const svc of services) {
  const features = svc.sections?.features?.items || [];
  const slug = Object.keys(svc).length ? 'unknown' : 'unknown';
  // ... comparar features entre servicios
}

// Verificar TTR de cada combo
const combos = readdirSync(CMS_DIR)
  .filter(f => f.startsWith('combo-') && f.endsWith('.json'));

for (const combo of combos) {
  const data = JSON.parse(readFileSync(`${CMS_DIR}/${combo}`, 'utf-8'));
  const text = extractText(data.sections);
  const words = text.split(/\s+/).filter(w => w.length > 3);
  const ttr = new Set(words).size / words.length;

  if (ttr < 0.35) {
    console.log(`❌ ${combo}: TTR ${(ttr * 100).toFixed(1)}% — REPETITIVO`);
  } else {
    console.log(`✅ ${combo}: TTR ${(ttr * 100).toFixed(1)}%`);
  }
}
```

### 5.4 — Sincronizar y deployar

```bash
cd guardman-site
node scripts/sync-from-admin.mjs
node scripts/validate-cms.mjs
npm run build
npx wrangler pages deploy dist --project-name=guardman-site-v2
```

---

## 8. Fase 6 — Verificación y Smoke Tests

**Objetivo:** Confirmar que todo funciona end-to-end.
**Duración estimada:** 1-2 horas

### 6.1 — Tests manuales del flujo completo

#### Test 1: Edición en Admin → Deploy automático

1. Abrir Admin Panel → CMS Editor
2. Seleccionar un servicio → Editar texto del hero
3. Guardar → Verificar mensaje de éxito
4. Esperar 3 minutos → Verificar en GitHub Actions que el workflow se ejecutó
5. Verificar que el cambio aparece en `guardman-site-v2.pages.dev`

#### Test 2: Regeneración AI con calidad

1. Admin Panel → CMS Editor → Seleccionar un combo
2. Clic en "Regenerar con IA"
3. Verificar que el score SEO aparece y es consistente
4. Verificar que no hay warnings de repetición
5. Guardar → Verificar deploy

#### Test 3: Homepage save + deploy

1. Admin Panel → CMS Editor → Home
2. Editar hero headline
3. Guardar → Verificar mensaje de éxito
4. Verificar que el homepage se actualiza en el site

### 6.2 — Tests automatizados

```bash
# Verificar que todas las páginas generan correctamente
cd guardman-site
npm run build 2>&1 | grep -i error

# Verificar que no hay contenido chino
node scripts/clean-chinese.mjs

# Verificar CMS data
node scripts/validate-cms.mjs
```

### 6.3 — Verificación de SEO

Para cada página service, verificar:
- [ ] Meta title: 30-60 caracteres, incluye nombre del servicio
- [ ] Meta description: 120-160 caracteres, incluye keywords
- [ ] H1 único (no repetido entre servicios)
- [ ] Keywords Serper presentes en el contenido
- [ ] Schema markup válido

### 6.4 — Verificación de contenido

- [ ] Cada servicio tiene features únicos (no compartidos con otros servicios)
- [ ] Cada combo tiene contexto local específico (no template)
- [ ] TTR > 40% en todas las páginas
- [ ] No hay keyword stuffing (>2.5% para ninguna palabra)
- [ ] No hay frases copiadas entre servicios

---

## 9. Checklist de Aceptación Final

### Funcionalidad CMS

- [ ] Guardar un cambio en el Admin → cambio aparece en el site en <5 minutos
- [ ] Guardar homepage → cambio aparece en el site
- [ ] "Regenerar con IA" produce contenido diferenciado
- [ ] "Publicar Sitio" funciona (no queda en "Publicando..." infinito)
- [ ] Score SEO es consistente entre panel y backend

### Contenido

- [ ] Los 9 servicios tienen intro, features, issues, faqs ÚNICOS cada uno
- [ ] Los 126 combos no usan templates idénticos
- [ ] Cada combo menciona características específicas de la zona
- [ ] TTR > 40% en todas las páginas
- [ ] No hay texto en chino
- [ ] No hay frases de "Es una pregunta frecuente que recibimos"

### SEO

- [ ] Keywords Serper se usan en meta titles y descriptions
- [ ] Los easy-wins de Serper están integrados en las páginas
- [ ] Schema markup es válido en todas las páginas
- [ ] Sitemap se genera correctamente

### Deploy

- [ ] `git push origin main` funciona sin error de autenticación
- [ ] GitHub Actions workflow se ejecuta correctamente
- [ ] `sync-from-admin.mjs` descarga correctamente desde la API
- [ ] El build de Astro no tiene errores
- [ ] El deploy a Cloudflare Pages es exitoso

---

## Anexo A: Archivos a Modificar

### guardman-admin

| Archivo | Cambio |
|---------|--------|
| `src/api/routes/cms.ts` | Reparar `triggerSiteRebuild()`, normalizar save, agregar ruta `/api/cms/score`, homepage a D1 |
| `src/services/scoring.ts` | Agregar TTR, detección de repetición, verificación de keywords Serper |
| `src/services/guardrails.ts` | Agregar TTR check, detección de keyword stuffing, overlap entre secciones |
| `src/agents/content-agent.ts` | Inyectar prompts específicos por servicio y zona, usar guardrails mejorados |
| `src/services/banned-patterns.ts` | Agregar patterns detectados: "Es una pregunta frecuente", "Many empresas" |
| `src/services/content-generation.ts` | Prompts específicos por servicio con keywords obligatorias |

### guardman-admin-ui

| Archivo | Cambio |
|---------|--------|
| `src/components/CMS/CMSPage.tsx` | Agregar llamada a `/api/cms/score`, pasar score al SEOPanel |
| `src/components/CMS/SEOPanel.tsx` | Usar score del backend, mostrar warnings de repetición |

### guardman-site

| Archivo | Cambio |
|---------|--------|
| `src/data/seo-data.ts` | **NUEVO** — Módulo para cargar keywords Serper |
| `src/pages/servicios/[slug]/[location].astro` | Importar y usar seo-data para meta tags |
| `src/pages/servicios/[slug].astro` | Importar easy-wins para keywords |
| `scripts/sync-from-admin.mjs` | Enriquecer combos con `_seo` desde Serper data |
| `scripts/generate-seo-meta.mjs` | Generar descriptions diferenciadas |
| `.github/workflows/deploy.yml` | Agregar validation, health check, mejor logging |

---

## Anexo B: Datos Técnicos de la Auditoría

### Contenido actual (发现问题)

**9 servicios en `generated/service-content.json`:**
- `hero_subtitle`: IDÉNTICO en los 9 → "Protección profesional con guardias certificados y respaldo de centro de monitoreo propio"
- `intro_paragraph`: Template idéntico, solo cambia `[servicio]`
- `features_json`: Idéntico en los 9 → 6 features genéricos
- `process_json`: Idéntico en los 9 → "Consulta, Propuesta, Implementación"
- `common_issues_json`: Idéntico en los 9 → "Accesos no controlados, Robos, Falta de supervisión"
- Contiene texto en inglés: "operate" → "operate 24/7", "adaptée", "consistency", "merchandise", "referentees", "handlear"

**126 combos en `generated/combo-content.json`:**
- Intro: Template "El servicio de [servicio] en [location] está diseñado para cubrir las necesidades específicas de esta zona."
- Local context: Template "[Location] tiene características particulares que requieren un enfoque especializado"
- Service in location: Template "En [Location], el [servicio] se adapta a los diferentes perfiles de clientes: empresas, condominos y residencias particulares."
- Sin FAQs (`faqs_json: null`)
- Word count: 200-220 palabras (debería ser 500+)

**Contenido en `src/data/cms/*.json` (archivos sincronizados):**
- Los combos CMS son de mejor calidad (5-9 KB cada uno vs 2 KB de generated)
- Pero algunos servicios CMS aún copian features entre sí
- Los combos sí tienen FAQs y contenido local diferenciado

### Datos Serper disponibles

- **1,268 keywords** investigadas con SDS scores
- **5 easy-wins** identificados (SDS < 25)
- **20 competidores** mapeados (federalseguridad.cl, sicseguridad.cl, gard.cl, etc.)
- **Top competidor:** cl.jooble.org (101 apariciones)
- **Competidores directos:** federalseguridad.cl, sicseguridad.cl, gard.cl, branner.cl

### Infraestructura

- **Site:** Astro 5 + Tailwind CSS v4, deploy en Cloudflare Pages
- **Admin API:** Cloudflare Workers + D1 + R2
- **174 páginas** generadas estáticamente
- **171+ archivos JSON** de CMS
- **Git remote:** GitHub (desarrollo33-lab/guardman-site)
- **Token:** `gho_...` expirado (en URL del remote)
