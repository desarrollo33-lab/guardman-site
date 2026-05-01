# Auditoría CMS → Sitio Público GuardMan Chile

## Resumen

| Tipo de página | Total páginas | CMS JSON | Hardcoded en TS/TSX | Parcial |
|---|---|---|---|---|
| Homepage | 1 | ✅ `homepage.json` | — | `SERVICE_IMAGES`, `SECTOR_IMAGES` inline |
| Service detail | 9 | ✅ `{slug}.json` | ⚠️ fallbacks | `SERVICE_INTROS`, `SERVICE_RELATED`, `SERVICE_UPSELL`, `STAFF_*` |
| Location detail | 14 | ✅ `location-{slug}.json` | ⚠️ fallbacks | `ZONE_CONTEXT`, `LOCATION_ISSUES`, `STAFF_*` |
| Sector detail | 9 | ✅ `sector-{slug}.json` | ⚠️ fallbacks | `SECTOR_INTROS`, `SECTOR_ISSUES`, `STAFF_*` |
| Combo pages | 126 | ✅ `combo-*.json` | — | Usa `zone_specific` como fallback |
| Services hub | 1 | — | ⚠️ parcial | `SERVICE_IMAGES` desde cms-config |
| Locations hub | 1 | — | ⚠️ parcial | No hay CMS dedicado |
| Sectors hub | 1 | — | ⚠️ parcial | `SECTOR_IMAGES` desde cms-config |
| Contacto | 1 | ⚠️ `config.json` | Mayormente | Textos quemados |
| Cotización | 1 | — | ❌ | Todo hardcoded |
| Nosotros | 1 | — | ⚠️ parcial | `brand-dna.ts` + textos quemados |
| Blog index | 1 | — | ❌ | Sin CMS |
| Blog detail | N | — | ❌ | Sin CMS |
| 404 | 1 | — | ❌ | Hardcoded |
| Privacidad | 1 | — | ❌ | Hardcoded |
| Términos | 1 | — | ❌ | Hardcoded |

---

## 1. Fuentes de datos actuales

### A. `src/data/cms/*.json` — CMS principal (D1 export)
Archivos JSON planos generados por el admin panel (Worker + D1).

| Archivo | Registros | Campos |
|---|---|---|
| `services.json` | 9 services | `id, slug, name, short_description, price_range, status, featured, sort` |
| `locations.json` | 14 locations | `id, slug, name, zone, region, latitude, longitude, status, image` |
| `sectors.json` | 9 sectors | `id, slug, name, description, icon, status, sort` |
| `service-sectors.json` | 9→N mapping | `{serviceSlug: [sectorSlug, ...]}` |
| `{service}.json` | 9 files | `sections: {hero, intro, features, issues, stats, faq, cta, breadcrumb}` |
| `location-{slug}.json` | 14 files | `sections: {hero, intro, features, stats, faq, cta, breadcrumb}` |
| `sector-{slug}.json` | 9 files | `sections: {hero, intro, features, stats, faq, cta, breadcrumb}` |
| `combo-*.json` | 126 files | `sections: {hero, intro, features, zone_specific, issues, stats, faq, cta, breadcrumb}` |
| `homepage.json` | 1 file | `content: {hero, nosotros, servicios, guardpod, sectores, ajax, clientes, ubicaciones, cta_final}` + `seo` |
| `config.json` | 1 file | `lastSync, totalServices, totalLocations, totalSectors, apiBase` |
| `images*.json` | 3 files | Sin uso actual (vacío o sin integrar) |

### B. `src/data/cms-config.ts` — Hardcoded config (NO editable desde admin)
Constantes TypeScript que actúan como fallback cuando el CMS no tiene datos:

| Constante | Propósito | Líneas |
|---|---|---|
| `SECTOR_COLORS` | 9 colores por sector | 18 |
| `ZONE_COLORS` | 4 colores por zona | 8 |
| `HERO_TAG`, `HERO_TAG_STATIC` | Estilos de pills en hero | 4 |
| `SECTION_BG` | Backgrounds de secciones | 8 |
| `CARD_LINK`, `CARD_GRID_ITEM` | Estilos de cards | 2 |
| `SECTOR_INTROS` | 9 textos de intro para sectores | ~27 |
| `ZONE_CONTEXT` | 4 zonas con focus, commonNeeds, intro | ~20 |
| `SERVICE_INTROS` | 9 intros para servicios | ~18 |
| `SERVICE_RELATED` | 9→3 servicios relacionados | ~12 |
| `SERVICE_UPSELL` | 9→2 upsells | ~12 |
| `SERVICE_IMAGES` | 9 mapeos de imagen | ~12 |
| `SECTOR_IMAGES` | 9 mapeos de imagen | ~12 |
| `LOCATION_ISSUES` | 4×4 problemas por zona (nuevo) | ~16 |
| `SECTOR_ISSUES` | 9×3 problemas por sector (nuevo) | ~27 |
| `STAFF_IMAGE`, `STAFF_TRAITS` | Sección personal (nuevo) | ~6 |
| `getSectorTag()`, `getZoneTag()` | Helpers de color | ~6 |

### C. `src/data/brand-dna.ts` — Brand DNA (hardcoded)
Datos de marca que **nunca fueron integrados al admin**:

| Sección | Datos |
|---|---|
| `identity` | companyName, legalName, rut, tagline |
| `contact` | 2 teléfonos, 2 emails |
| `location` | dirección HQ, lat/lng |
| `social` | instagram, youtube |
| `voice` | tono de marca, reglas |
| `differentiators` | 5 diferenciadores |
| `contentRules` | 6 reglas de contenido |
| `stats` | 6 estadísticas (500+ guardias, 200+ clientes, etc.) |
| `clients` | 8 clientes |
| `businessHours` | 7 días |
| `certifications` | 5 certificaciones |
| `servicePurpose` | 9 servicios con pain/solution/benefit |

---

## 2. Auditoría por página: ¿qué se renderiza vs. de dónde viene?

### 2.1 Homepage (`src/pages/index.astro`)

| Sección renderizada | Fuente | Editable desde admin | Problema |
|---|---|---|---|
| Hero (headline, subheadline, image, phone, badge) | `homepage.json → content.hero` | ✅ | — |
| Nosotros (title, paragraph, image, features, stats) | `homepage.json → content.nosotros` | ✅ | — |
| Servicios (title, subtitle, cta) | `homepage.json → content.servicios` | ✅ | Imágenes desde `SERVICE_IMAGES` inline |
| Guard Pod (title, paragraph, features, cta) | `homepage.json → content.guardpod` | ✅ | — |
| Sectores (title, subtitle, cta) | `homepage.json → content.sectores` | ✅ | Imágenes desde `SECTOR_IMAGES` inline |
| Ajax (title, paragraph, image, features, cta) | `homepage.json → content.ajax` | ✅ | — |
| Clientes (title, subtitle) | `homepage.json → content.clientes` | ✅ | Logos desde `src/data/clients.ts` |
| Ubicaciones (title, subtitle, cta) | `homepage.json → content.ubicaciones` | ✅ | — |
| CTA Final (badge, title, subtitle, ctas) | `homepage.json → content.cta_final` | ✅ | — |
| SEO (title, description) | `homepage.json → seo` | ✅ | — |
| Service card images | `SERVICE_IMAGES` inline en page | ❌ | Duplicado, no editable |
| Sector card images | `SECTOR_IMAGES` inline en page | ❌ | Duplicado, no editable |

**⚠️ Problemas:**
1. `SERVICE_IMAGES` y `SECTOR_IMAGES` están duplicados (inline en `index.astro` Y en `cms-config.ts`)
2. No hay mapeo CMS para imágenes de servicio/sector. Debería venir de `services.json[].image` y `sectors.json[].image`

---

### 2.2 Service Detail (`src/pages/servicios/[slug].astro`)

| Sección renderizada | Fuente CMS | Fallback hardcoded | Editable |
|---|---|---|---|
| Breadcrumb | `{slug}.json → breadcrumb` | Generado | ⚠️ |
| Hero heading | `{slug}.json → sections.hero.heading` | `service.name` | ✅ |
| Hero subheading | `{slug}.json → sections.hero.subheading` | `service.short_description` | ✅ |
| Hero image | `{slug}.json → sections.hero.image` | `SERVICE_IMAGES[slug]` | ⚠️ Fallback no editable |
| Intro | `{slug}.json → sections.intro.paragraphs` | `SERVICE_INTROS[slug]` | ⚠️ Fallback no editable |
| Cross-link | Calculado (primer related) | — | ❌ No configurable |
| Features | `{slug}.json → sections.features.items` | No muestra nada | ✅ |
| Issues | `{slug}.json → sections.issues.items` | No muestra nada | ✅ |
| Staff section | — | `STAFF_IMAGE` + `STAFF_TRAITS` | ❌ No editable |
| FAQs | `{slug}.json → sections.faq` | No muestra nada | ✅ |
| Locations grid | Calculado de `locations.json` | — | ✅ |
| Sidebar title | `{slug}.json → sections.cta.headline` | `"Cotiza {name}"` | ✅ |
| Sidebar buttons | `{slug}.json → sections.cta.button_text` | Default | ✅ |
| Sidebar: related services | — | `SERVICE_RELATED[slug]` | ❌ No editable |
| Sidebar: upsell | — | `SERVICE_UPSELL[slug]` | ❌ No editable |
| Sidebar: sectors | `service-sectors.json` | — | ✅ |
| Related section | — | `SERVICE_RELATED[slug]` | ❌ No editable |
| CTA final | `{slug}.json → sections.cta` | Default genérico | ✅ |

**❌ Brechas:**
1. **`SERVICE_INTROS`** — 9 intros hardcoded. El CMS tiene `intro.content` pero el template busca `intro.paragraphs[]` (array). El CMS entrega `intro.content` (string). **Format mismatch.**
2. **`SERVICE_RELATED`** — No existe campo en CMS. Hardcoded 9→3.
3. **`SERVICE_UPSELL`** — No existe campo en CMS. Hardcoded 9→2.
4. **`STAFF_IMAGE` + `STAFF_TRAITS`** — Sección completa sin CMS. No editable.
5. **Hero image fallback** — `SERVICE_IMAGES` en cms-config.ts, no en admin.
6. **`intro` format mismatch** — CMS tiene `intro.content` (string con \n\n) pero el template busca `intro.paragraphs` (array). Nunca se usa el intro del CMS.

---

### 2.3 Location Detail (`src/pages/ubicaciones/[slug].astro`)

| Sección renderizada | Fuente CMS | Fallback hardcoded | Editable |
|---|---|---|---|
| Hero heading | `location-{slug}.json → hero.heading` | Generated | ✅ |
| Hero subheading | `location-{slug}.json → hero.subheading` | Generated | ✅ |
| Intro | `location-{slug}.json → intro.content` | `ZONE_CONTEXT[zone]` | ⚠️ Mismo format mismatch |
| Features | `location-{slug}.json → features.items` | No muestra nada | ✅ |
| Issues | — | `LOCATION_ISSUES[zone]` | ❌ No editable |
| Staff section | — | `STAFF_IMAGE` + `STAFF_TRAITS` | ❌ No editable |
| FAQs | `location-{slug}.json → faq` | No muestra nada | ✅ |
| Services grid | Calculado de `services.json` | — | ✅ |
| Nearby locations | Calculado por zona | — | ✅ |
| Sidebar | — | Tags de colores | ✅ (visual) |
| CTA final | `location-{slug}.json → cta` | Default genérico | ✅ |

**❌ Brechas:**
1. **`LOCATION_ISSUES`** — 4 zonas × 4 problemas hardcoded. No existe en CMS.
2. **`ZONE_CONTEXT`** — 4 contextos de zona hardcoded. No existe en CMS.
3. **`STAFF_*`** — No editable.
4. **`intro` format mismatch** — CMS tiene `intro.content` pero template busca `intro.paragraphs`.

---

### 2.4 Sector Detail (`src/pages/sectores/[slug].astro`)

| Sección renderizada | Fuente CMS | Fallback hardcoded | Editable |
|---|---|---|---|
| Hero heading | `sector-{slug}.json → hero.heading` | Capitalized slug | ✅ |
| Hero subheading | `sector-{slug}.json → hero.subheading` | Default | ✅ |
| Hero image | — | `SECTOR_IMAGES[slug]` | ❌ No editable |
| Intro | `sector-{slug}.json → intro.content` | `SECTOR_INTROS[slug]` | ⚠️ Mismo format mismatch |
| Features | `sector-{slug}.json → features.items` | No muestra nada | ✅ |
| Issues | — | `SECTOR_ISSUES[slug]` | ❌ No editable |
| Staff section | — | `STAFF_IMAGE` + `STAFF_TRAITS` | ❌ No editable |
| FAQs | `sector-{slug}.json → faq` | No muestra nada | ✅ |
| Services grid | Calculado de `service-sectors.json` | — | ✅ |
| Locations grid | Calculado de `locations.json` | — | ✅ |
| Related sectors | Calculado | — | ❌ No configurable |
| CTA final | `sector-{slug}.json → cta` | Default genérico | ✅ |

**❌ Brechas:**
1. **`SECTOR_INTROS`** — 9 intros hardcoded. Format mismatch con CMS.
2. **`SECTOR_ISSUES`** — 9×3 problemas hardcoded. No existe en CMS.
3. **`SECTOR_IMAGES`** — No existe campo en CMS.
4. **`STAFF_*`** — No editable.
5. **Related sectors** — No configurable, calculado arbitrariamente.

---

### 2.5 Combo Pages (`src/pages/servicios/[slug]/[location].astro`)

| Sección renderizada | Fuente CMS | Editable |
|---|---|---|
| Hero | `combo-*.json → hero` | ✅ |
| Intro | `combo-*.json → intro` | ✅ |
| Features | `combo-*.json → features.items` | ✅ |
| Zone specific | `combo-*.json → zone_specific.points` | ✅ |
| Issues | `combo-*.json → issues.items` | ✅ |
| Stats | `combo-*.json → stats` | ✅ |
| FAQs | `combo-*.json → faq` | ✅ |
| CTA | `combo-*.json → cta` | ✅ |
| Sidebar: service link | Calculado | ✅ |
| Sidebar: location link | Calculado | ✅ |
| Sidebar: upsell combos | Calculado | ⚠️ |

**✅ Las combo pages están bien cubiertas por el CMS.**

---

### 2.6 Hub Pages

| Hub | Contenido CMS | Hardcoded |
|---|---|---|
| Services index (`/servicios`) | `services.json` para lista | Hero stats, textos introductorios |
| Locations index (`/ubicaciones`) | `locations.json` para lista | Hero stats, textos, sin imágenes propias |
| Sectors index (`/sectores`) | `sector-*.json` para cards | Hero stats, "top sectors" calculado |

**❌ Ningún hub tiene JSON CMS dedicado.** Todo el contenido del hero y secciones descriptivas está hardcoded en el template.

---

### 2.7 Páginas estáticas sin CMS

| Página | Estado | Contenido editable |
|---|---|---|
| `/contacto` | ⚠️ Usa `config.json` solo para API | Textos, teléfono, dirección hardcoded |
| `/cotizacion` | ❌ Solo lee `services.json` y `locations.json` para selectores | Todos los textos hardcoded |
| `/nosotros` | ⚠️ Usa `brand-dna.ts` indirectamente | Textos hardcoded |
| `/blog/index` | ❌ | Sin CMS |
| `/blog/[slug]` | ❌ | Sin CMS |
| `/404` | ❌ | Hardcoded |
| `/privacidad` | ❌ | Hardcoded |
| `/terminos` | ❌ | Hardcoded |

---

## 3. Problema crítico: `intro` format mismatch

El CMS genera:
```json
"intro": {
  "title": "...",
  "content": "Párrafo 1\n\nPárrafo 2\n\nPárrafo 3",
  "image": "/images/..."
}
```

El template busca:
```ts
sections?.intro?.paragraphs  // Array<string>
```

**Resultado:** El intro del CMS **nunca se usa**. Siempre cae al fallback hardcoded.

**Fix:** El template debería hacer `sections.intro.content.split('\n\n')` cuando `paragraphs` no existe.

---

## 4. Plan de acción: Mapear todo al CMS

### Fase 1: Fix format mismatches (sin cambios al admin)

| Item | Cambio en template | Archivo |
|---|---|---|
| Intro: usar `intro.content` | Agregar fallback `.content.split('\n\n')` | `[slug].astro` × 3 |
| Hero image: usar `hero.image` del CMS | Ya funciona para services, agregar a sectors | `sectores/[slug].astro` |

### Fase 2: Mover hardcoded a CMS JSON (requiere admin panel updates)

#### 4.1 Agregar campos a `services.json` (registro maestro)

```jsonc
{
  "slug": "guardias-de-seguridad",
  "name": "Guardias de Seguridad",
  "short_description": "...",
  "price_range": "$$$",
  // NUEVOS:
  "hero_image": "/images/service-guardias-de-seguridad.webp",
  "related_services": ["monitoreo-24-7", "control-de-accesos", "auditoria-seguridad"],
  "upsell_services": ["monitoreo-24-7", "cctv-videovigilancia"]
}
```

#### 4.2 Agregar campos a `sectors.json` (registro maestro)

```jsonc
{
  "slug": "industrial",
  "name": "Industrial",
  "description": "...",
  // NUEVOS:
  "hero_image": "/images/sector-industrial.webp",
  "intro": "Instalaciones industriales como fábricas...",
  "issues": ["Robo de materiales...", "Ingresos no autorizados..."]
}
```

#### 4.3 Agregar campos a `locations.json` (registro maestro)

```jsonc
{
  "slug": "las-condes",
  "name": "Las Condes",
  "zone": "Oriente",
  // NUEVOS:
  "zone_context": {
    "focus": "residencias de lujo, embajadas...",
    "common_needs": "control de accesos residencial...",
    "intro": " es una comuna de la zona Oriente..."
  },
  "issues": ["Ingresos no autorizados...", "..."]
}
```

#### 4.4 Crear nuevo CMS JSON: `staff.json`

```jsonc
{
  "image": "/images/nosotros_seccion.webp",
  "traits": [
    "Certificación OS-10 vigente...",
    "Capacitación continua...",
    "Centro de monitoreo propio 24/7...",
    "8+ años de experiencia..."
  ]
}
```

#### 4.5 Crear CMS JSON para hub pages

```jsonc
// services-hub.json
{
  "hero": { "title": "...", "subtitle": "...", "stats": [...] },
  "intro": "...",
  "cta": { "text": "...", "link": "..." }
}

// locations-hub.json
{
  "hero": { "title": "...", "subtitle": "...", "stats": [...] },
  "coverage": { ... }
}

// sectors-hub.json
{
  "hero": { "title": "...", "subtitle": "...", "stats": [...] },
  "top_sectors": ["industrial", "comercial", "residencial"]
}
```

#### 4.6 Crear CMS JSON para páginas estáticas

```jsonc
// pages/contacto.json
{
  "hero": { "heading": "...", "subheading": "..." },
  "contact_info": { "phone": "...", "email": "...", "address": "..." },
  "form": { "title": "...", "subtitle": "..." },
  "map": { "lat": ..., "lng": ..., "zoom": ... }
}

// pages/cotizacion.json
{
  "hero": { "heading": "...", "subheading": "..." },
  "form": { "title": "...", "fields": [...] },
  "trust_badges": [...]
}

// pages/nosotros.json
{
  "hero": { "heading": "...", "subheading": "..." },
  "story": "...",
  "team": [...],
  "certifications": [...],
  "stats": {...}
}
```

#### 4.7 Agregar a `homepage.json` (ya existe)

```jsonc
// Agregar dentro de content:
"services": {
  // ... lo que ya tiene ...
  "images": {
    "guardias-de-seguridad": "/images/service-guardias-de-seguridad.webp",
    // ...
  }
}
```

---

## 5. Resumen de brechas por prioridad

### 🔴 Crítico (contenido nunca se muestra)

| # | Problema | Impacto | Fix |
|---|---|---|---|
| C1 | `intro.content` vs `intro.paragraphs` format mismatch | Los intros del CMS nunca se usan en service/location/sector detail | Template: `content.split('\n\n')` fallback |
| C2 | `cta.headline` vs `cta.heading` key inconsistence | Sidebar title puede no mostrar el correcto | Unificar key name |

### 🟡 Importante (contenido no editable desde admin)

| # | Elemento | Dónde | Solución |
|---|---|---|---|
| I1 | `SERVICE_INTROS` (9 textos) | cms-config.ts → service detail | Agregar `intro.text` a `services.json` o usar `intro.content` del JSON existente |
| I2 | `SERVICE_RELATED` (9→3 mapping) | cms-config.ts → sidebar + related | Agregar `related_services` a `services.json` |
| I3 | `SERVICE_UPSELL` (9→2 mapping) | cms-config.ts → sidebar | Agregar `upsell_services` a `services.json` |
| I4 | `ZONE_CONTEXT` (4 zonas) | cms-config.ts → location detail | Agregar `zone_context` a `locations.json` o crear `zones.json` |
| I5 | `LOCATION_ISSUES` (16 items) | cms-config.ts → location detail | Agregar `issues` a `location-*.json` |
| I6 | `SECTOR_INTROS` (9 textos) | cms-config.ts → sector detail | Ya existe `intro.content` en `sector-*.json` (fix C1 lo resuelve) |
| I7 | `SECTOR_ISSUES` (27 items) | cms-config.ts → sector detail | Agregar `issues` a `sector-*.json` |
| I8 | `STAFF_IMAGE` + `STAFF_TRAITS` | cms-config.ts → 3 detail pages | Crear `staff.json` o agregar a `homepage.json` |
| I9 | `SERVICE_IMAGES` (9 mapeos) | cms-config.ts + index.astro | Agregar `hero_image` a `services.json` |
| I10 | `SECTOR_IMAGES` (9 mapeos) | cms-config.ts + index.astro | Agregar `hero_image` a `sectors.json` |
| I11 | Hub pages content (3 páginas) | Templates | Crear `*-hub.json` o agregar a `homepage.json` |

### 🟢 Menor (páginas sin CMS)

| # | Página | Solución |
|---|---|---|
| M1 | `/contacto` | Crear `pages/contacto.json` |
| M2 | `/cotizacion` | Crear `pages/cotizacion.json` |
| M3 | `/nosotros` | Crear `pages/nosotros.json` |
| M4 | Hub pages: services, locations, sectors index | Crear JSON o extender homepage |
| M5 | `/blog/*` | Sin CMS (futuro) |
| M6 | `/404`, `/privacidad`, `/terminos` | Crear `pages/{slug}.json` |

---

## 6. Nuevo schema CMS unificado

### 6.1 `services.json` (registro maestro — agregar campos)

```
+ hero_image: string
+ related_services: string[] (slugs)
+ upsell_services: string[] (slugs)
```

### 6.2 `locations.json` (registro maestro — agregar campos)

```
+ zone_context: { focus: string, common_needs: string, intro: string }
+ issues: string[]
+ hero_image: string
```

### 6.3 `sectors.json` (registro maestro — agregar campos)

```
+ hero_image: string
+ issues: string[]
+ intro: string (o usar sector-{slug}.json→intro.content)
```

### 6.4 Nuevos archivos CMS

```
src/data/cms/staff.json              → { image, traits[] }
src/data/cms/pages-contacto.json     → { hero, contact_info, form, map }
src/data/cms/pages-cotizacion.json   → { hero, form, trust_badges }
src/data/cms/pages-nosotros.json     → { hero, story, team, certifications, stats }
src/data/cms/hub-services.json       → { hero, intro, cta }
src/data/cms/hub-locations.json      → { hero, intro, coverage, cta }
src/data/cms/hub-sectors.json        → { hero, intro, top_sectors, cta }
```

### 6.5 `cms-config.ts` evoluciona a:

Solo debe contener **configuración visual** (colores, estilos), NO contenido:

```
SECTOR_COLORS    → queda (design tokens)
ZONE_COLORS      → queda (design tokens)
HERO_TAG         → queda (CSS classes)
SECTION_BG       → queda (CSS classes)
CARD_LINK        → queda (CSS classes)
getSectorTag()   → queda (helper)
getZoneTag()     → queda (helper)

SERVICE_INTROS       → ELIMINAR (usar CMS intro.content)
SERVICE_RELATED      → ELIMINAR (usar CMS related_services)
SERVICE_UPSELL       → ELIMINAR (usar CMS upsell_services)
SERVICE_IMAGES       → ELIMINAR (usar CMS hero_image)
SECTOR_IMAGES        → ELIMINAR (usar CMS hero_image)
SECTOR_INTROS        → ELIMINAR (usar CMS intro.content)
ZONE_CONTEXT         → ELIMINAR (usar CMS zone_context)
LOCATION_ISSUES      → ELIMINAR (usar CMS issues)
SECTOR_ISSUES        → ELIMINAR (usar CMS issues)
STAFF_IMAGE          → ELIMINAR (usar CMS staff.json)
STAFF_TRAITS         → ELIMINAR (usar CMS staff.json)
```
