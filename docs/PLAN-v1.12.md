# 🛡️ Plan de Optimización GuardMan v1.12

**Versión objetivo:** 1.12.0  
**Fecha:** 2026-05-03  
**Alcance:** guardman-site + guardman-admin  
**Objetivo:** Base estable, limpia, segura y 100% CMS-driven para futuras features

---

## Tabla de Contenidos

1. [Diagnóstico Actual](#1-diagnóstico-actual)
2. [Principios Rectores](#2-principios-rectores)
3. [Fase 0 — Emergencias y Contenido](#fase-0--emergencias-y-contenido)
4. [Fase 1 — Unificación del Data Layer](#fase-1--unificación-del-data-layer)
5. [Fase 2 — CMS-Driven Completo](#fase-2--cms-driven-completo)
6. [Fase 3 — SEO y Serper Data](#fase-3--seo-y-serper-data)
7. [Fase 4 — Admin Panel v1.12](#fase-4--admin-panel-v112)
8. [Fase 5 — Limpieza y Seguridad](#fase-5--limpieza-y-seguridad)
9. [Fase 6 — Optimización Frontend](#fase-6--optimización-frontend)
10. [Fase 7 — Testing y Deploy](#fase-7--testing-y-deploy)
11. [Checklist Final v1.12](#checklist-final-v112)
12. [Post-v1.12 Roadmap](#post-v112-roadmap)

---

## 1. Diagnóstico Actual

### 1.1 Métricas del Sistema

| Métrica | Valor | Estado |
|---------|-------|--------|
| Servicios | 9 | ✅ |
| Ubicaciones | 14 | ✅ |
| Sectores | 9 | ✅ |
| Combo pages | 126 | ✅ |
| CMS JSON files | 171 | ✅ |
| Keywords Serper | 1,268 | ⚠️ No utilizadas en páginas |
| Competidores | 638 únicos | ⚠️ No integrados |
| Imágenes | 27 | ⚠️ Mapeo parcial |
| Build size | 9.1 MB | 🟡 |
| Páginas CMS-driven | ~155/170 | 🟡 |

### 1.2 Problemas Críticos Identificados

| ID | Problema | Severidad | Impacto |
|----|----------|-----------|---------|
| **P0** | Contenido IA sin revisar (texto en chino en `guardias-de-seguridad.json`, texto "papá" en homepage) | 🔴 Crítico | Contenido profesional comprometido |
| **P0** | `sectores/[slug].astro` tiene imports duplicados (`optimizeImageUrl`, `readFileSync`) | 🔴 Crítico | Puede causar build errors |
| **P1** | `intro.content` (string) vs `intro.paragraphs` (array) format mismatch | 🔴 Crítico | Intros del CMS nunca se muestran |
| **P1** | Dos data layers duplicados (`cms.ts` + `directus.ts`) con funciones solapantes | 🟡 Alto | Confusión, mantenimiento difícil |
| **P1** | 14 constantes de contenido hardcoded en `cms-config.ts` en vez de CMS | 🟡 Alto | ~200 líneas no editables desde admin |
| **P2** | Admin panel: API key MiniMax hardcodeada en código fuente | 🔴 Seguridad | Credencial expuesta |
| **P2** | Admin panel: HTML inline en template literal TS (~723 líneas) | 🟡 Mantenibilidad | Cambios frágiles, sin tooling |
| **P3** | `media-map.ts` existe pero `SERVICE_IMAGES`/`SECTOR_IMAGES` se duplican manualmente | 🟡 Medio | Inconsistencia de imágenes |
| **P3** | `sectors.json` tiene 7 registros pero `sectores/` tiene 9 slugs (con hotelería, automotriz) | 🟡 Medio | Datos desalineados |
| **P3** | Serper data (1,268 keywords) no se usa en las páginas para optimización SEO | 🟡 Medio | Datos valiosos desperdiciados |

---

## 2. Principios Rectores

### Para cada cambio en v1.12:

1. **CMS-First:** Todo contenido visible debe provenir del CMS. Cero texto hardcoded excepto labels de UI.
2. **Single Source of Truth:** Un solo data layer. Un solo origen para cada dato.
3. **Fail Safe:** Si el CMS falla, la página se renderiza con fallback razonable — nunca crashea.
4. **Type Safety:** Eliminar `any` progresivamente. Interfaces TypeScript para todo dato del CMS.
5. **Data > Code:** Preferir datos en JSON sobre constantes en TypeScript.
6. **Security First:** Credenciales en secrets, nunca en código. Auth robusta.
7. **No Regresiones:** Cada fase se testea antes de avanzar. Build debe pasar siempre.

---

## Fase 0 — Emergencias y Contenido

**Prioridad:** 🔴 Inmediata  
**Tiempo estimado:** 2-3 horas  
**Objetivo:** Corregir contenido problemático y bugs que afectan producción

### 0.1 Corregir Contenido IA sin revisar

**Problema:** `src/data/cms/guardias-de-seguridad.json` tiene texto en chino en la sección `issues.items`:
> "Inseguridad vecinal: 人口增长的社区需要可见的安保存在来阻止潜在入侵者"

**Acción:**
- [ ] Auditar los 126 combo JSON + 9 service JSON + 14 location JSON + 9 sector JSON en busca de:
  - Texto en chino, inglés u otros idiomas incorrectos
  - Texto de prueba o informal (ej: "papá" en homepage)
  - HTML tags sueltos dentro de texto
  - Placeholders sin reemplazar (ej: `[CIUDAD]`, `TODO`)
- [ ] Reemplazar texto en chino en `guardias-de-seguridad.json → issues.items[0]` con versión correcta en español
- [ ] Corregir `homepage.json → content.hero.subheadline`: cambiar "Protegemos lo que mas te importa papá" → "Protegemos lo que más te importa"
- [ ] Normalizar acentos y ortografía en todo contenido CMS (español chileno formal según Brand DNA)

### 0.2 Corregir Bug de Imports Duplicados

**Problema:** `src/pages/sectores/[slug].astro` líneas 6-8:
```typescript
import { optimizeImageUrl } from '../../data/directus';
import { readFileSync, existsSync } from 'fs';
import SchemaBreadcrumb from '../../components/seo/SchemaBreadcrumb.astro';
import { optimizeImageUrl } from '../../data/directus';  // DUPLICADO
import { readFileSync, existsSync } from 'fs';           // DUPLICADO
```

**Acción:**
- [ ] Eliminar imports duplicados en `sectores/[slug].astro`
- [ ] Audit de imports duplicados en todos los demás archivos `.astro`

### 0.3 Corregir Format Mismatch de `intro`

**Problema:** El CMS genera `intro.content` (string con `\n\n`) pero los templates buscan `intro.paragraphs` (array). Resultado: los intros del CMS **nunca se muestran**, siempre caen al fallback hardcoded.

**Acción:** Crear un helper unificado que maneje ambos formatos:
```typescript
// src/data/cms-helpers.ts
export function parseIntro(intro: any): string[] {
  if (!intro) return [];
  if (Array.isArray(intro.paragraphs)) return intro.paragraphs;
  if (typeof intro.content === 'string' && intro.content.length > 0) {
    return intro.content.split('\n\n').filter(Boolean);
  }
  if (typeof intro === 'string') return [intro];
  return [];
}
```

- [ ] Crear `src/data/cms-helpers.ts` con `parseIntro()` y `parseFAQs()`
- [ ] Actualizar `servicios/[slug].astro` — usar `parseIntro()`
- [ ] Actualizar `ubicaciones/[slug].astro` — usar `parseIntro()`
- [ ] Actualizar `sectores/[slug].astro` — usar `parseIntro()`
- [ ] Actualizar `servicios/[slug]/[location].astro` — usar `parseIntro()`

---

## Fase 1 — Unificación del Data Layer

**Prioridad:** 🟡 Alta  
**Tiempo estimado:** 4-5 horas  
**Objetivo:** Un solo módulo de acceso a datos, types claros, cero duplicación

### 1.1 Eliminar `directus.ts`

**Problema:** `src/data/directus.ts` (170 líneas) es un vestigio del viejo CMS Directus. Contiene:
- Interfaces `Service`, `Location`, `Sector`, `Client`, `Testimonial`, `BlogPost`, `SiteConfig`
- Funciones `getServices()`, `getLocations()`, `getClients()`, etc. que leen de `generated/*.json`
- `optimizeImageUrl()` que actualmente solo retorna el path sin cambios

Las funciones de `directus.ts` **ya no se usan** en las páginas principales — todas leen de `cms.ts`. Sin embargo, algunos templates aún importan `optimizeImageUrl` desde ahí.

**Acción:**
- [ ] Verificar qué archivos importan desde `directus.ts`:
  - `sectores/[slug].astro` — usa `optimizeImageUrl`
  - `index.astro` (homepage) — usa `optimizeImageUrl`
  - `servicios/[slug].astro` — usa `optimizeImageUrl`
- [ ] Mover `optimizeImageUrl()` a `src/data/cms-helpers.ts` (o eliminarla si solo retorna el path)
- [ ] Mover las interfaces TypeScript útiles a `src/data/types.ts`
- [ ] Eliminar `src/data/directus.ts`
- [ ] Actualizar todos los imports

### 1.2 Crear `src/data/types.ts` — Tipos TypeScript centralizados

Reunir todas las interfaces del sistema en un solo archivo:

```typescript
// src/data/types.ts

// === CMS Master Records ===
export interface ServiceMaster {
  id: number;
  slug: string;
  name: string;
  short_description: string;
  price_range: string;
  status: 'active' | 'completed' | 'draft';
  featured: boolean;
  sort: number;
  hero_image: string | null;
  related_services: string;
  upsell_services: string;
  created_at: string;
  updated_at: string;
}

export interface LocationMaster {
  id: number;
  slug: string;
  name: string;
  zone: string;
  region: string;
  latitude: number;
  longitude: number;
  status: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface SectorMaster {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  status: string;
  sort: number;
  hero_image: string | null;
  issues: string | null;
  created_at: string;
  updated_at: string;
}

// === CMS Content Sections ===
export interface HeroSection {
  heading: string;
  subheading: string;
  image?: string;
}

export interface IntroSection {
  heading?: string;
  title?: string;
  content?: string;      // Formato CMS: string con \n\n
  paragraphs?: string[];  // Formato legacy: array
  image?: string;
}

export interface FeaturesSection {
  heading?: string;
  title?: string;
  items?: string[];
}

export interface IssuesSection {
  heading?: string;
  title?: string;
  items?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQsSection {
  heading?: string;
  title?: string;
  items?: FAQItem[];
}

export interface CTASection {
  headline?: string;
  heading?: string;
  description?: string;
  subheading?: string;
  button?: string;
  button_text?: string;
  image?: string;
}

export interface ProcessStep {
  step?: string;
  title?: string;
  description?: string;
}

export interface StatsItem {
  label: string;
  value: string;
}

// === Entity Sections (contenido CMS por entidad) ===
export interface EntitySections {
  hero?: HeroSection;
  meta?: { title: string; description: string };
  intro?: IntroSection;
  features?: FeaturesSection;
  coverage?: { heading?: string; items?: string[] };
  issues?: IssuesSection;
  process?: ProcessStep[] | Record<string, ProcessStep>;
  stats?: { heading?: string; items?: StatsItem[] };
  faqs?: FAQsSection | Record<string, FAQItem>;
  cta?: CTASection;
  staff?: {
    image?: string;
    title?: string;
    description?: string;
    traits?: string[];
  };
}

// === Brand DNA ===
export interface BrandDNA {
  company: Record<string, string>;
  social: Record<string, string>;
  stats: Record<string, string | number>;
  hours: { schedule: { day: string; hours: string }[]; summary: string };
  voice: Record<string, string>;
  differentiators: Record<string, string>;
  exclusions: Record<string, string>;
  certifications: Record<string, string>;
  usps: Record<string, string>;
  colors: Record<string, string>;
}

// === Media ===
export interface MediaEntry {
  key: string;
  alt: string;
}
```

### 1.3 Limpiar `cms.ts` — Eliminar `any`, usar types

- [ ] Reemplazar todos los `any` en `cms.ts` con los tipos de `types.ts`
- [ ] Agregar JSDoc a todas las funciones exportadas
- [ ] Eliminar las funciones de imágenes que leen `images.json` (no existen) y reemplazar con `media-map.ts`

### 1.4 Consolodar `cms-config.ts`

**Objetivo:** `cms-config.ts` solo debe contener **configuración visual** (CSS classes, colores), NO contenido textual.

**Queda:**
```typescript
// Solo design tokens y helpers visuales
SECTOR_COLORS     → queda (CSS class mapping)
ZONE_COLORS       → queda (CSS class mapping)  
HERO_TAG          → queda (CSS classes)
SECTION_BG        → queda (CSS classes)
CARD_LINK         → queda (CSS classes)
CARD_GRID_ITEM    → queda (CSS classes)
getSectorTag()    → queda (helper)
getZoneTag()      → queda (helper)
```

**Se elimina (migrado a CMS):**
```typescript
SERVICE_INTROS        → Eliminar (usar intro.content del CMS)
SERVICE_RELATED       → Eliminar (usar related_services de services.json)
SERVICE_UPSELL        → Eliminar (usar upsell_services de services.json)
SERVICE_IMAGES        → Eliminar (usar media-map.ts)
SECTOR_IMAGES         → Eliminar (usar media-map.ts)
SECTOR_INTROS         → Eliminar (usar intro.content del CMS)
ZONE_CONTEXT          → Eliminar (ya existe zones.json en CMS)
LOCATION_ISSUES       → Eliminar (ya existe en zones.json)
SECTOR_ISSUES         → Eliminar (usar issues de sectors.json)
STAFF_IMAGE           → Eliminar (ya existe staff.json en CMS)
STAFF_TRAITS          → Eliminar (ya existe staff.json en CMS)
```

---

## Fase 2 — CMS-Driven Completo

**Prioridad:** 🟡 Alta  
**Tiempo estimado:** 6-8 horas  
**Objetivo:** Todas las páginas leen 100% del CMS. Cero hardcoded content.

### 2.1 Estado actual de cobertura CMS por página

| Página | CMS coverage | Acción necesaria |
|--------|-------------|-----------------|
| `/` (Homepage) | 90% | Eliminar `SERVICE_IMAGES`/`SECTOR_IMAGES` inline, usar `media-map` |
| `/servicios/[slug]` | 75% | Usar `parseIntro()`, related/upsell desde services.json |
| `/servicios/[slug]/[location]` | 85% | Usar `parseIntro()`, eliminar hardcoded fallbacks |
| `/ubicaciones/[slug]` | 75% | Usar `parseIntro()`, issues desde zones.json |
| `/sectores/[slug]` | 70% | Usar `parseIntro()`, fix imports, issues desde sectors.json |
| `/servicios/` (hub) | 30% | Crear `hub-services.json` CMS |
| `/ubicaciones/` (hub) | 30% | Crear `hub-locations.json` CMS |
| `/sectores/` (hub) | 30% | Crear `hub-sectors.json` CMS |
| `/nosotros` | 40% | Crear `pages-nosotros.json` CMS |
| `/contacto` | 20% | Crear `pages-contacto.json` CMS |
| `/cotizacion` | 15% | Crear `pages-cotizacion.json` CMS |
| `/blog/index` | 10% | Crear `hub-blog.json` CMS |
| `/blog/[slug]` | 10% | Migrar a CMS o mantener como generated |
| `/404` | 0% | Crear `pages-404.json` CMS |
| `/privacidad` | 0% | Crear `pages-privacidad.json` CMS |
| `/terminos` | 0% | Crear `pages-terminos.json` CMS |

### 2.2 Nuevos archivos CMS a crear

Todos estos JSON se crean en `src/data/cms/` y se sincronizan desde el admin:

#### Hub Pages
```json
// hub-services.json
{
  "hero": { "heading": "Servicios de Seguridad Privada en Santiago", "subheading": "..." },
  "intro": "Soluciones integrales...",
  "stats": [
    { "label": "Servicios", "value": "9" },
    { "label": "Guardias", "value": "500+" },
    { "label": "Comunas", "value": "14" }
  ],
  "cta": { "text": "¿No sabes qué servicio necesitas?", "link": "/cotizacion" }
}

// hub-locations.json
{
  "hero": { "heading": "Cobertura en la Región Metropolitana", "subheading": "..." },
  "intro": "Presencia en 14 comunas...",
  "stats": [...],
  "cta": { "text": "...", "link": "/cotizacion" }
}

// hub-sectors.json
{
  "hero": { "heading": "Seguridad por Sector Industrial", "subheading": "..." },
  "intro": "Adaptamos nuestros servicios...",
  "top_sectors": ["industrial", "residencial", "comercial"],
  "cta": { ... }
}
```

#### Static Pages
```json
// pages-nosotros.json
{
  "hero": { "heading": "...", "subheading": "..." },
  "story": { "title": "...", "paragraphs": ["..."] },
  "team": { "title": "...", "description": "..." },
  "stats": { "guards": "500+", "clients": "200+", ... },
  "certifications": [...],
  "values": [...]
}

// pages-contacto.json
{
  "hero": { "heading": "...", "subheading": "..." },
  "info": { "phone": "...", "email": "...", "address": "...", "whatsapp": "..." },
  "form": { "title": "...", "subtitle": "..." },
  "map": { "lat": -33.4569, "lng": -70.6483, "zoom": 12 }
}

// pages-cotizacion.json
{
  "hero": { "heading": "...", "subheading": "..." },
  "form": { "title": "...", "subtitle": "...", "success_message": "..." },
  "trust_badges": [
    { "icon": "shield", "text": "Certificación OS-10" },
    { "icon": "clock", "text": "Respuesta en 24h" },
    { "icon": "lock", "text": "Cotización sin compromiso" }
  ]
}

// pages-404.json → { "heading": "...", "subheading": "...", "cta_text": "...", "cta_link": "/" }
// pages-privacidad.json → contenido legal
// pages-terminos.json → contenido legal
// hub-blog.json → { "hero": {...}, "intro": "..." }
```

### 2.3 Refactor de Templates — Patrón Unificado

Cada template debe seguir este patrón:

```typescript
---
// 1. Imports limpios
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getEntitySections } from '../../data/cms';
import { parseIntro, parseFAQs, getFallbackIntro } from '../../data/cms-helpers';
import type { EntitySections } from '../../data/types';

// 2. Static paths (si aplica)
export async function getStaticPaths() { ... }

// 3. Lectura de datos CMS (una sola fuente)
const sections: EntitySections = getEntitySections('service', slug) || {};

// 4. Resolución con fallback (helper, no hardcoded)
const hero = sections.hero || { heading: serviceName };
const intro = parseIntro(sections.intro) || getFallbackIntro('service', slug);
const faqs = parseFAQs(sections.faqs) || [];
---

<!-- 5. Template limpio con datos resueltos -->
<BaseLayout title={metaTitle} description={metaDescription}>
  ...
</BaseLayout>
```

- [ ] Refactor de `servicios/[slug].astro` al patrón unificado
- [ ] Refactor de `ubicaciones/[slug].astro` al patrón unificado
- [ ] Refactor de `sectores/[slug].astro` al patrón unificado (incluye fix imports)
- [ ] Refactor de `servicios/[slug]/[location].astro` al patrón unificado
- [ ] Refactor de `index.astro` — eliminar SERVICE_IMAGES/SECTOR_IMAGES inline
- [ ] Refactor de hub pages (`servicios/index`, `ubicaciones/index`, `sectores/index`) — usar JSON CMS
- [ ] Refactor de páginas estáticas (`nosotros`, `contacto`, `cotizacion`) — usar JSON CMS
- [ ] Refactor de páginas legales (`privacidad`, `terminos`, `404`) — usar JSON CMS

### 2.4 Eliminar Hardcoded Fallbacks de Contenido

**Principio:** Los fallbacks existen pero son mínimos y genéricos. El contenido real SIEMPRE viene del CMS.

- [ ] Eliminar `SERVICE_INTROS` → usar `intro.content` del CMS con helper `parseIntro()`
- [ ] Eliminar `SERVICE_RELATED` → usar `related_services` de `services.json`
- [ ] Eliminar `SERVICE_UPSELL` → usar `upsell_services` de `services.json`
- [ ] Eliminar `SECTOR_INTROS` → usar `intro.content` del CMS
- [ ] Eliminar `ZONE_CONTEXT` → usar `zones.json` del CMS (ya existe)
- [ ] Eliminar `LOCATION_ISSUES` → usar `zones.json → [zone].issues` (ya existe)
- [ ] Eliminar `SECTOR_ISSUES` → usar `sectors.json → [sector].issues` (ya existe)
- [ ] Eliminar `STAFF_IMAGE`/`STAFF_TRAITS` → usar `staff.json` (ya existe)
- [ ] Eliminar `SERVICE_IMAGES`/`SECTOR_IMAGES` → usar `media-map.ts` helpers

---

## Fase 3 — SEO y Serper Data

**Prioridad:** 🟡 Alta  
**Tiempo estimado:** 5-6 horas  
**Objetivo:** Aprovechar los 1,268 keywords y 638 competidores para optimizar contenido

### 3.1 Integrar Keywords en Meta Tags

Los datos Serper contienen keywords con SDS score, tier, intent y easy-win flag. Actualmente se almacenan en D1 pero NO se usan en las páginas del sitio.

**Acción:**
- [ ] Crear script que extraiga las top keywords por servicio y ubicación desde D1
- [ ] Generar `src/data/generated/seo-keywords.json` con estructura:
  ```json
  {
    "guardias-de-seguridad": {
      "las-condes": {
        "primary_keyword": "guardias de seguridad las condes",
        "secondary_keywords": ["vigilancia privada las condes", "..."],
        "easy_wins": ["guardia las condes precio", "..."],
        "meta_title": "Guardias de Seguridad en Las Condes | OS-10 | GuardMan",
        "meta_description": "..."
      }
    }
  }
  ```
- [ ] Las combo pages (`servicios/[slug]/[location].astro`) deben usar estos keywords para:
  - `<title>` tag — usar el meta_title del keyword research
  - `<meta name="description">` — usar el meta_description optimizado
  - H1 tag — incluir primary keyword
  - Schema markup — agregar keywords relevantes

### 3.2 Generar Meta Titles y Descriptions Optimizados

- [ ] Crear `scripts/generate-seo-meta.mjs` que:
  1. Lee keywords de D1 agrupadas por servicio + ubicación
  2. Rankea por SDS score (lower = easier to rank)
  3. Genera meta title optimizado (≤60 chars, con keyword + "GuardMan" + ubicación)
  4. Genera meta description optimizado (≤155 chars, con keyword + CTA)
  5. Guarda en `src/data/generated/seo-meta.json`
- [ ] Integrar `seo-meta.json` en los templates de combo pages
- [ ] Priorizar "easy wins" (SDS score < 30, is_easy_win = 1) en H2 e intro text

### 3.3 Enriquecer Contenido Combo con Keywords

- [ ] Para cada combo page, inyectar las top 3-5 keywords naturalmente en:
  - `intro.paragraphs[0]` — primary keyword en primera oración
  - `features.items` — secondary keywords como features
  - `faqs.items` — formular preguntas con keywords long-tail
- [ ] Crear script `scripts/enrich-combos-with-keywords.mjs` que actualice los 126 combo JSON

### 3.4 Schema Markup Mejorado

- [ ] `SchemaService.astro` — agregar `areaServed` con nombre de comuna
- [ ] `SchemaFAQ.astro` — usar solo FAQs que tengan question + answer reales
- [ ] `SchemaLocalBusiness.astro` — agregar `priceRange`, `openingHours`, `aggregateRating`
- [ ] Crear `SchemaProduct.astro` para Guard Pod (producto propio)
- [ ] Agregar `SchemaBreadcrumb` a TODAS las páginas (algunas no lo tienen)
- [ ] Validar schema con Google Rich Results Test después de deploy

### 3.5 Sitemap y Robots

- [ ] Verificar que `@astrojs/sitemap` genera URLs correctas para las 170+ páginas
- [ ] Agregar `<link rel="alternate" hreflang="es-CL">` en BaseLayout
- [ ] Crear `public/robots.txt` si no existe con:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://guardman.cl/sitemap-index.xml
  ```

---

## Fase 4 — Admin Panel v1.12

**Prioridad:** 🟡 Alta  
**Tiempo estimado:** 8-10 horas  
**Objetivo:** Admin seguro, limpio, funcional como base para futuras features

### 4.1 Seguridad

| Acción | Detalle |
|--------|---------|
| Mover API key MiniMax | De hardcoded a `wrangler secret put MINIMAX_API_KEY` |
| Auth robusta | Implementar JWT o hash de password (no texto plano) |
| Rate limiting | Agregar rate limit a `/api/login` (max 5 intentos/min) |
| CORS headers | Configurar CORS explícito para dominios permitidos |
| Input validation | Validar todos los inputs en endpoints POST/PUT |
| Sanitización | XSS protection en todo contenido guardado/retornado |

**Acción:**
- [ ] Mover MiniMax API key a `env.MINIMAX_API_KEY`
- [ ] Implementar password hashing con Web Crypto API:
  ```typescript
  async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  ```
- [ ] Agregar rate limiting en login (in-memory con Durable Object o simple timestamp check)
- [ ] Agregar validación de input en `/api/content`, `/api/images`

### 4.2 Sync Pipeline Mejorado

El script `sync-from-admin.mjs` actual es funcional pero puede mejorar:

- [ ] Agregar sync de nuevos tipos de contenido:
  - `hub-services.json`, `hub-locations.json`, `hub-sectors.json`
  - `pages-nosotros.json`, `pages-contacto.json`, `pages-cotizacion.json`
  - `pages-404.json`, `pages-privacidad.json`, `pages-terminos.json`
  - `hub-blog.json`
- [ ] Agregar flag `--incremental` para solo sincronizar lo que cambió (comparar timestamps)
- [ ] Agregar validación de schema JSON antes de escribir (asegurar que sections tiene la estructura correcta)
- [ ] Logging mejorado con timestamps y resumen de cambios
- [ ] Agregar endpoint `/api/cms/hubs` en el admin para servir hub page content
- [ ] Agregar endpoint `/api/cms/pages` en el admin para servir static page content

### 4.3 Nuevos Endpoints del Admin

```typescript
// Hub pages
GET /api/cms/hubs                    → Lista de hub pages con contenido
GET /api/cms/hubs/:type              → Hub content (services|locations|sectors|blog)
POST /api/cms/hubs/:type             → Guardar hub content

// Static pages
GET /api/cms/pages                   → Lista de páginas estáticas
GET /api/cms/pages/:slug             → Contenido de página (nosotros|contacto|cotizacion|etc)
POST /api/cms/pages/:slug            → Guardar contenido de página
```

### 4.4 CMS Editor — Soporte para Nuevos Tipos

- [ ] Agregar tabs en el CMS Editor para:
  - Hub Pages (editar hero, intro, stats, CTA de cada hub)
  - Static Pages (editar contenido de nosotros, contacto, cotización, etc.)
- [ ] Agregar sección de "Global Content" en el admin:
  - Staff section (editar imagen, título, descripción, traits)
  - Brand DNA (editar stats, USPs, certificaciones)
  - Zones (editar contexto por zona: intro, issues, focus)

### 4.5 SEO Dashboard Mejorado

- [ ] Agregar sección "Content Coverage" que muestre:
  - Cuántos combos tienen contenido vs vacíos (126 total)
  - Cuántos servicios tienen todas las secciones completas
  - Cuántas ubicaciones tienen todas las secciones completas
  - Score de completitud por página
- [ ] Agregar filtros por servicio/ubicación en keywords
- [ ] Agregar export a CSV de keywords y competidores
- [ ] Mostrar "easy wins" prioritarios con sugerencias de contenido

### 4.6 Deploy Pipeline Robusto

- [ ] Verificar que el workflow `deploy.yml` usa Node 22 (no 20) — el package.json requiere `>=22.12.0`
- [ ] Agregar step de validación post-sync en CI:
  ```yaml
  - name: Validate CMS data
    run: node scripts/validate-cms.mjs
  ```
- [ ] Crear `scripts/validate-cms.mjs` que verifique:
  - Todos los JSON son válidos
  - Services tienen 9 registros
  - Locations tienen 14 registros
  - Cada service tiene su `{slug}.json`
  - Cada location tiene su `location-{slug}.json`
  - Cada sector tiene su `sector-{slug}.json`
  - Los 126 combos existen
- [ ] Agregar notificación de Slack/email cuando deploy falla

---

## Fase 5 — Limpieza y Seguridad

**Prioridad:** 🟡 Media  
**Tiempo estimado:** 3-4 horas  
**Objetivo:** Código limpio, sin archivos muertos, sin datos residuales

### 5.1 Archivos a Eliminar

- [ ] `src/data/directus.ts` — Migrado a `types.ts` + `cms-helpers.ts`
- [ ] Verificar si `src/data/generated/*` todavía se usa (probablemente solo `services.json`, `locations.json`, `sectors.json` como fallback)
- [ ] Limpiar archivos legacy en `docs/archive/` que ya no son relevantes
- [ ] Limpiar `src/admin/` si existe referencia local al admin panel

### 5.2 Limpieza de Código

- [ ] Eliminar comentarios de código muerto en todos los templates
- [ ] Eliminar `console.error` y `console.warn` en código de producción (cms.ts)
- [ ] Normalizar estilo de imports (orden: externos → internos → tipos)
- [ ] Agregar `// @ts-check` o `strict: true` en tsconfig.json

### 5.3 `.gitignore` Actualizado

```
# Ya existe
node_modules/
dist/
.astro/
.wrangler/

# Agregar
.env.local
.env.*.local
*.log
.DS_Store
Thumbs.db
```

### 5.4 README Actualizado

- [ ] Actualizar README.md con:
  - Arquitectura actualizada (sin Directus)
  - Estructura de archivos correcta
  - Comandos actualizados
  - Link al plan v1.12
  - Estado del proyecto

---

## Fase 6 — Optimización Frontend

**Prioridad:** 🟢 Media  
**Tiempo estimado:** 3-4 horas  
**Objetivo:** Mejor performance, CSS limpio, imágenes optimizadas

### 6.1 CSS y Tailwind

- [ ] Verificar que `app.css` usa solo las custom properties que se necesitan
- [ ] Eliminar clases Tailwind no utilizadas (Tailwind v4 lo hace automáticamente, pero verificar)
- [ ] Asegurar que el theme en `app.css` está sincronizado con `DESIGN.md`
- [ ] Considerar mover los `@theme` values que no se usan (secondary-*, etc.)

### 6.2 Imágenes

- [ ] Verificar que todas las imágenes en `public/images/` son WebP (excepto las que deben ser JPG/PNG)
- [ ] Agregar `width` y `height` attributes a TODAS las `<img>` tags (prevenir CLS)
- [ ] Verificar que hero images usan `loading="eager"` + `fetchpriority="high"`
- [ ] Verificar que todas las demás usan `loading="lazy"` + `decoding="async"`
- [ ] Crear fallback SVG genérico para imágenes que fallen (via `<img onerror>` o component)

### 6.3 Performance

- [ ] Verificar que React solo se hidrata donde es necesario (CoverageMap)
- [ ] Evaluar si Leaflet puede lazy-loadarse (solo en páginas que lo usan)
- [ ] Inline critical CSS para above-the-fold (ya parcialmente hecho en BaseLayout)
- [ ] Verificar que Google Fonts carga de forma no-bloqueante (ya hecho con preload)

### 6.4 Accesibilidad

- [ ] Agregar `alt` text descriptivo a todas las imágenes (usar media-map alt)
- [ ] Verificar que todos los formularios tienen labels asociados
- [ ] Agregar `role` y `aria-label` donde falte
- [ ] Verificar contraste de colores (WCAG AA mínimo)
- [ ] Agregar `skip-to-content` link en BaseLayout

---

## Fase 7 — Testing y Deploy

**Prioridad:** 🟢 Media  
**Tiempo estimado:** 2-3 horas  
**Objetivo:** Verificar que todo funciona antes de marcar como v1.12

### 7.1 Build Testing

- [ ] `npm run build` debe pasar sin errores ni warnings
- [ ] Verificar que se generan las 170+ páginas en `dist/`
- [ ] Verificar que no hay páginas vacías o con contenido fallback incorrecto
- [ ] Verificar que el sitemap se genera correctamente

### 7.2 Content Testing

- [ ] Cada una de las 9 service pages muestra contenido CMS real (no fallback)
- [ ] Cada una de las 14 location pages muestra contenido CMS real
- [ ] Cada una de las 9 sector pages muestra contenido CMS real
- [ ] Sample de 10 combo pages muestra contenido único (no genérico)
- [ ] Homepage muestra todas las secciones correctamente
- [ ] No hay texto en idiomas incorrectos
- [ ] No hay texto de prueba o placeholders

### 7.3 SEO Testing

- [ ] Cada página tiene `<title>` único
- [ ] Cada página tiene `<meta description>` única
- [ ] Cada página tiene `<link rel="canonical">`
- [ ] Schema markup valida en Google Rich Results Test
- [ ] Open Graph tags presentes en todas las páginas
- [ ] Sitemap.xml accesible y completo

### 7.4 Deploy

- [ ] `npm run deploy` (sync + build + deploy) pasa completo
- [ ] Verificar sitio en `https://guardman-site-v2.pages.dev`
- [ ] Verificar sitio en `https://guardman.cl`
- [ ] Verificar que GitHub Actions workflow funciona con `repository_dispatch`

---

## Checklist Final v1.12

### Emergencias
- [ ] Texto en chino eliminado de `guardias-de-seguridad.json`
- [ ] Texto "papá" corregido en `homepage.json`
- [ ] Imports duplicados corregidos en `sectores/[slug].astro`
- [ ] `parseIntro()` helper creado y aplicado en todos los templates

### Data Layer
- [ ] `src/data/types.ts` creado con todas las interfaces
- [ ] `src/data/cms-helpers.ts` creado con helpers unificados
- [ ] `src/data/directus.ts` eliminado
- [ ] `src/data/cms.ts` refactorizado con types (sin `any`)
- [ ] `src/data/cms-config.ts` solo contiene design tokens (cero contenido textual)

### CMS-Driven
- [ ] Hub pages JSON creados (services, locations, sectors, blog)
- [ ] Static pages JSON creados (nosotros, contacto, cotización, 404, privacidad, términos)
- [ ] Todos los templates refactorizados al patrón unificado
- [ ] Cero constantes de contenido en TypeScript (todo en JSON)
- [ ] `media-map.ts` es la única fuente para imágenes

### SEO
- [ ] Keywords Serper integradas en meta tags de combo pages
- [ ] `seo-meta.json` generado con titles/descriptions optimizados
- [ ] Schema markup mejorado y validado
- [ ] Sitemap completo con 170+ URLs

### Admin
- [ ] MiniMax API key en wrangler secret
- [ ] Auth mejorada (password hashing)
- [ ] Endpoints para hub pages y static pages
- [ ] Content coverage dashboard
- [ ] Pipeline de sync actualizado para nuevos tipos de contenido
- [ ] `validate-cms.mjs` script creado

### Limpieza
- [ ] Archivos muertos eliminados
- [ ] Console.logs eliminados de producción
- [ ] README actualizado
- [ ] `.gitignore` actualizado

### Testing
- [ ] Build pasa limpio
- [ ] 170+ páginas generadas correctamente
- [ ] Deploy exitoso a producción
- [ ] Schema markup validado
- [ ] `package.json` version bump → `1.12.0`

---

## Post-v1.12 Roadmap

Con la base v1.12 estable, las próximas features se pueden construir con confianza:

### v1.13 — Blog y Content Marketing
- Blog CMS completo en el admin
- Generación de artículos con IA basada en keywords Serper
- Categorías y tags
- RSS feed

### v1.14 — Analytics y Monitoreo
- Integración con Cloudflare Web Analytics
- Tracking de keywords rankings (Serper scheduled queries)
- Dashboard de rendimiento SEO
- Alertas de caída de rankings

### v1.15 — E-commerce y Cotización
- Formulario de cotización funcional (Cloudflare Workers + D1)
- Precios dinámicos por servicio/ubicación
- PDF generation para cotizaciones
- CRM básico en el admin

### v1.16 — Performance y UX
- Image CDN con Cloudflare Image Resizing
- A/B testing de hero sections
- Chat widget con WhatsApp integration
- PWA support

### v1.17 — Admin Panel Moderno
- Migrar frontend del admin a React/Vue con build step
- WYSIWYG editor para contenido CMS
- Drag-and-drop image upload
- Version history con diff visual
- Multi-user con roles

---

## Estructura de Archivos Objetivo (v1.12)

```
guardman-site/
├── .github/workflows/deploy.yml     # CI/CD (actualizado: Node 22, validación)
├── docs/
│   ├── PLAN-v1.12.md                # Este documento
│   └── archive/                     # Documentación histórica
├── public/
│   ├── images/                      # ~27 imágenes optimizadas (WebP)
│   ├── robots.txt                   # Nuevo
│   └── favicon.ico
├── scripts/
│   ├── sync-from-admin.mjs          # Actualizado: sync de hubs + pages
│   ├── deploy.mjs                   # Sin cambios
│   ├── validate-cms.mjs             # Nuevo: validación de datos CMS
│   └── generate-seo-meta.mjs        # Nuevo: SEO meta desde Serper data
├── src/
│   ├── components/
│   │   ├── cms/
│   │   │   ├── SectionRenderer.astro
│   │   │   └── ServiceContent.astro
│   │   ├── design/
│   │   │   ├── ContentCard.astro
│   │   │   ├── FAQList.astro
│   │   │   ├── PageCTA.astro
│   │   │   ├── PageHero.astro
│   │   │   └── SidebarCTA.astro
│   │   ├── seo/
│   │   │   ├── SEOHead.astro
│   │   │   ├── SchemaArticle.astro
│   │   │   ├── SchemaBreadcrumb.astro
│   │   │   ├── SchemaCollectionPage.astro
│   │   │   ├── SchemaFAQ.astro
│   │   │   ├── SchemaLocalBusiness.astro
│   │   │   ├── SchemaOrganization.astro
│   │   │   ├── SchemaProduct.astro      # Nuevo (Guard Pod)
│   │   │   ├── SchemaService.astro
│   │   │   └── SchemaWebSite.astro
│   │   ├── CoverageMap.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   └── OptimizedImage.astro
│   ├── data/
│   │   ├── cms/                         # 171+ JSON files (CMS sync)
│   │   │   ├── brand.json
│   │   │   ├── config.json
│   │   │   ├── homepage.json
│   │   │   ├── services.json
│   │   │   ├── locations.json
│   │   │   ├── sectors.json
│   │   │   ├── zones.json
│   │   │   ├── staff.json
│   │   │   ├── media-map.json
│   │   │   ├── {service}.json × 9
│   │   │   ├── location-{slug}.json × 14
│   │   │   ├── sector-{slug}.json × 9
│   │   │   ├── combo-{s}-{l}.json × 126
│   │   │   ├── hub-services.json         # Nuevo
│   │   │   ├── hub-locations.json        # Nuevo
│   │   │   ├── hub-sectors.json          # Nuevo
│   │   │   ├── hub-blog.json             # Nuevo
│   │   │   ├── pages-nosotros.json       # Nuevo
│   │   │   ├── pages-contacto.json       # Nuevo
│   │   │   ├── pages-cotizacion.json     # Nuevo
│   │   │   ├── pages-404.json            # Nuevo
│   │   │   ├── pages-privacidad.json     # Nuevo
│   │   │   └── pages-terminos.json       # Nuevo
│   │   ├── generated/                   # Pipeline data
│   │   │   ├── seo-keywords.json        # Nuevo (from Serper)
│   │   │   ├── seo-meta.json            # Nuevo (optimized meta)
│   │   │   └── ... (existing files)
│   │   ├── brand.ts                     # Brand DNA (from cms/brand.json)
│   │   ├── cms.ts                       # CMS reader (refactored, typed)
│   │   ├── cms-config.ts               # Solo design tokens (limpio)
│   │   ├── cms-helpers.ts              # Nuevo: parseIntro, parseFAQs, etc.
│   │   ├── media-map.ts                # Image resolver
│   │   └── types.ts                    # Nuevo: TypeScript interfaces
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   └── markdown.ts
│   ├── pages/
│   │   ├── 404.astro                   # CMS-driven
│   │   ├── blog/
│   │   │   ├── index.astro             # CMS-driven (hub-blog.json)
│   │   │   └── [slug].astro
│   │   ├── contacto.astro              # CMS-driven (pages-contacto.json)
│   │   ├── cotizacion.astro            # CMS-driven (pages-cotizacion.json)
│   │   ├── index.astro                 # CMS-driven (homepage.json, limpio)
│   │   ├── nosotros.astro              # CMS-driven (pages-nosotros.json)
│   │   ├── privacidad.astro            # CMS-driven (pages-privacidad.json)
│   │   ├── sectores/
│   │   │   ├── index.astro             # CMS-driven (hub-sectors.json)
│   │   │   └── [slug].astro            # CMS-driven (fix imports + types)
│   │   ├── servicios/
│   │   │   ├── index.astro             # CMS-driven (hub-services.json)
│   │   │   ├── [slug].astro            # CMS-driven (refactorizado)
│   │   │   └── [slug]/[location].astro # CMS-driven (SEO keywords)
│   │   ├── terminos.astro              # CMS-driven (pages-terminos.json)
│   │   └── ubicaciones/
│   │       ├── index.astro             # CMS-driven (hub-locations.json)
│   │       └── [slug].astro            # CMS-driven (refactorizado)
│   └── styles/
│       └── app.css
├── astro.config.mjs
├── DESIGN.md
├── homepage.json
├── package.json                        # v1.12.0
├── README.md                           # Actualizado
├── tsconfig.json
└── wrangler.jsonc
```

---

## Orden de Ejecución Recomendado

```
Fase 0 (2-3h) → Emergencias y contenido
    ↓
Fase 1 (4-5h) → Unificación data layer
    ↓
Fase 2 (6-8h) → CMS-driven completo
    ↓ commit: "refactor: unified CMS-driven data layer v1.12"
Fase 3 (5-6h) → SEO y Serper integration
    ↓ commit: "feat: Serper keywords integration for SEO optimization"
Fase 4 (8-10h) → Admin panel improvements
    ↓ commit: "feat: admin panel v1.12 - security, hubs, pages, coverage"
Fase 5 (3-4h) → Limpieza
    ↓ commit: "chore: cleanup dead code and files"
Fase 6 (3-4h) → Frontend optimization
    ↓ commit: "perf: frontend optimization and accessibility"
Fase 7 (2-3h) → Testing y deploy
    ↓ commit: "release: v1.12.0 stable"
    ↓
    git tag v1.12.0
    npm run deploy
```

**Tiempo total estimado:** 33-43 horas de trabajo

---

*Documento generado: 2026-05-03*  
*Proyecto: GuardMan Chile — Seguridad Privada Santiago*
*Versión: v1.12.0 Plan*
