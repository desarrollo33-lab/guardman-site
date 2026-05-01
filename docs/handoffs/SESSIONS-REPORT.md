# Reporte de Sesiones - GuardMan Site CMS Migration

**Período:** 10-14 Abril 2026  
**Última actualización:** 14 Abril 2026 - Fix Combos + Images CMS  
**Proyecto:** GuardMan Chile - Sitio de Seguridad Privada  
**Worker:** https://guardman-agent.oficinadesarrollo33.workers.dev  
**D1 Database:** guardman-seo (ID: aeaab85c-d4df-46c4-96b9-28d6a95aaec4)

---

## Resumen Ejecutivo

Se implementó un sistema de gestión de contenido (CMS) 100% basado en Cloudflare D1 para el sitio de GuardMan Chile. Anteriormente el sitio usaba Directus como CMS externo, ahora todo el contenido se genera y sirve desde D1.

### Antes vs Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| CMS | Directus (externo) | D1 (Cloudflare) |
| Contenido | Directus API | JSON files + D1 |
| Worker | Basic | GuardMan Agent (Durable Object) |
| Keywords | - | 1,268 keywords researchadas |
| Competidores | - | 2,602 analizados |
| Combos | 0 | 126 service×location |
| Imágenes CMS | - | 17 imágenes registradas |

---

## Sesión 1: Configuración Inicial

### Objetivos
- Crear base de datos D1 `guardman-seo`
- Crear schema con tablas para servicios, ubicaciones, sectores
- Implementar Worker con GuardMan Agent

### Archivos Creados

#### Schema D1 (`worker/sql/schema.sql`)
```sql
-- Tablas principales
CREATE TABLE services (id, slug, name, zone...)
CREATE TABLE locations (id, slug, name, zone, coordinates...)
CREATE TABLE keywords (id, service_slug, location_slug, keyword...)
CREATE TABLE competitors (id, service_slug, location_slug, domain...)
CREATE TABLE serper_queries (id, query, response_json...)
```

#### Worker (`worker/index.ts`)
- Configuración con D1 binding
- Durable Object para GuardMan Agent
- API routes para generación de contenido

#### Agente GuardMan (`worker/agents/guardman.ts`)
- Generación de contenido SEO
- Integración con Serper.dev para keywords
- Análisis de competidores

### Resultados
- ✅ D1 database creada con 22+ tablas
- ✅ Worker desplegado en `https://guardman-agent.oficinadesarrollo33.workers.dev`
- ✅ Agente funcional para generación de contenido

---

## Sesión 2: CMS Modular (Section-Based Architecture)

### Objetivos
- Migrar de contenido monolithic a secciones modulares
- Crear sistema de secciones: hero, intro, features, process, stats, faqs, cta
- Evitar duplicación de contenido entre servicios

### Nueva Arquitectura

```
D1 Tables:
├── service_sections (service_slug, section_key, content_json)
├── location_sections (location_slug, section_key, content_json)
├── sector_sections (sector_slug, section_key, content_json)
├── combo_sections (service_slug, location_slug, section_key, content_json)
├── combos (service_slug, location_slug)
└── images (slug, url, entity_type, entity_slug, is_hero, is_featured)
```

### Archivos Creados

#### Section Generator (`worker/handlers/section-generator.ts`)
Contenido único por servicio:
- `GUARDIAS_SECTIONS` - Contenido específico para guardias
- `CCTV_SECTIONS` - Contenido específico para CCTV
- `CONTROL_ACCESOS_SECTIONS` - Contenido específico para control de accesos
- etc.

#### Section Handler (`worker/handlers/section-handler.ts`)
- `generateServiceSectionsHandler()` - Genera secciones para un servicio
- `generateLocationSectionsHandler()` - Genera secciones para ubicación
- `generateSectorSectionsHandler()` - Genera secciones para sector
- `generateComboSectionsHandler()` - Genera secciones para combo service×location

#### Sections API (`worker/handlers/sections-api.ts`)
```
GET/POST /api/sections/service/:slug
GET/POST /api/sections/location/:slug
GET/POST /api/sections/sector/:slug
GET/POST /api/sections/combo?service=X&location=Y
POST /api/sections/batch
```

### Páginas Migradas a CMS

| Página | Archivo | CMS Usado |
|--------|---------|-----------|
| Servicio | `servicios/[slug].astro` | service_sections |
| Ubicación | `ubicaciones/[slug].astro` | location_sections |
| Combo | `servicios/[slug]/[location].astro` | service + location sections |
| Index Servicios | `servicios/index.astro` | services.json |
| Index Ubicaciones | `ubicaciones/index.astro` | locations.json |

### Componentes CMS

#### SectionRenderer.astro
Renderiza cualquier sección basada en su `section_key`:
```astro
<SectionRenderer section={sections.hero} type="hero" />
<SectionRenderer section={sections.features} type="features" />
<SectionRenderer section={sections.faqs} type="faqs" />
```

#### ServiceContent.astro
Componente especializado para páginas de servicios con interlinking.

### Bugs Corregidos
- ❌ Contenido duplicado (Control de Accesos mostrando texto de Guardias)
- ❌ CTAs mostrando "undefined"
- ❌ Mezcla de idiomas (English/Spanish)

---

## Sesión 3: Sectores y Ubicaciones en CMS

### Objetivos
- Agregar sectores al CMS (7 sectores)
- Crear páginas dinámicas para sectores
- Migrar páginas estáticas restantes

### Sectores Creados

| Sector | Slug | Descripción |
|--------|------|-------------|
| Comercial | `comercial` | Tiendas, oficinas, centros comerciales |
| Industrial | `industrial` | Fábricas, bodegas, centros logísticos |
| Residencial | `residencial` | Condominos, edificios, casas |
| Salud | `salud` | Clínicas, hospitales |
| Educación | `educacion` | Colegios, universidades |
| Eventos | `eventos` | Conciertos, festivales, corporativos |
| Construcción | `construccion` | Obras, proyectos |

### Contenido por Sector
Cada sector tiene secciones únicas:
- Hero con heading y subheading personalizado
- Intro con párrafos únicos
- Features específicas del sector
- Issues (problemas que resuelve)
- Stats relevantes
- FAQs específicas

### Páginas Migradas a CMS

| Página | Antes | Después |
|--------|-------|---------|
| `index.astro` | Directus | CMS (services, sectors, config) |
| `contacto.astro` | Directus | CMS (config) |
| `cotizacion.astro` | Directus | CMS (services, locations) |
| `nosotros.astro` | Directus | CMS (config) |
| `sectores/index.astro` | - | Nuevo (CMS sectors) |
| `sectores/[slug].astro` | - | Nuevo (CMS sectors) |

### Archivos Creados/Modificados

```
src/
├── data/cms/
│   ├── sector-comercial.json
│   ├── sector-industrial.json
│   ├── sector-residencial.json
│   ├── sector-salud.json
│   ├── sector-educacion.json
│   ├── sector-eventos.json
│   ├── sector-construccion.json
│   ├── sectors.json (índice)
│   └── ...
├── pages/sectores/
│   ├── index.astro (nuevo)
│   └── [slug].astro (nuevo)
└── components/Header.astro (actualizado)
```

---

## Sesión 4: Fixes y Mejoras Finales

### Problemas Arreglados

1. **Worker Errors**
   - Error: `serviceName is not defined`
   - Causa: Usaba variable no definida en `parseSection()`
   - Fix: Cambiar a `service.name`

2. **Export Script Errors**
   - Error: `no such column: sort` en locations
   - Fix: Cambiar `ORDER BY sort` a `ORDER BY id`
   
3. **Export Script Errors**
   - Error: `no such column: image` en services
   - Fix: Remover columna del query

4. **Ubicaciones Props Error**
   - Error: Props no se pasaban correctamente
   - Fix: Cambiar de `locationSlug` a `slug, name, zone`

5. **Variable Conflict**
   - Error: `zone` redeclarada
   - Fix: Renombrar a `locationZone`

6. **Header con Links Hardcodeados**
   - Links a sectores inexistentes: hoteleria, corporativo, automotriz, diplomatico
   - Fix: Generar nav desde CMS sectors dinámicamente

### Mejoras Visuales

#### Sectores Index (`/sectores/`)
- Hero con imagen de fondo
- Estadísticas: 200+ empresas, 14 comunas, 8+ años
- Texto introductorio general
- Imágenes por sector

---

## Sesión 5: Fix Combos + Images CMS (14 Abril 2026)

### Problemas Detectados

| Problema | Gravedad | Solución |
|----------|----------|----------|
| Endpoint `/api/sections/combo` error `rows is not iterable` | 🔴 Alta | Fix en `section-handler.ts` - usar `result?.results \|\| []` |
| Solo 14 combos generados (debería ser 126) | 🔴 Alta | Script `generate-all-combos.mjs` |
| Images CMS no existía | 🔴 Alta | Crear tabla y handler `images-api.ts` |

### Soluciones Implementadas

#### 1. Fix section-handler.ts
```typescript
// Antes (error)
export async function getComboSections(...) {
  const rows = await env.DB.prepare(sql).all() as any;
  // rows.results puede ser undefined
}

// Después (corregido)
export async function getComboSections(...) {
  const result = await env.DB.prepare(sql).all() as any;
  const rows = result?.results || [];
}
```

#### 2. Script generate-all-combos.mjs
Generó las 126 combinaciones:
- 9 servicios × 14 ubicaciones = 126 combos
- Cada combo tiene: hero, intro, faqs, cta

#### 3. Images CMS (`worker/handlers/images-api.ts`)
Tabla `images` con campos:
- `slug`, `alt`, `title`, `description`
- `entity_type`: service | location | sector | page | generic
- `entity_slug`: slug de la entidad asociada
- `url`: path de la imagen
- `is_hero`, `is_featured`, `status`
- `tags`, `usage_pages`

Endpoints:
```
GET  /api/images                    - Listar todas
GET  /api/images/stats              - Estadísticas
GET  /api/images/service/:slug      - Imágenes de servicio
GET  /api/images/location/:slug     - Imágenes de ubicación
GET  /api/images/sector/:slug       - Imágenes de sector
GET  /api/images/:slug              - Imagen individual
POST /api/images                    - Registrar imagen
PUT  /api/images/:slug              - Actualizar imagen
DELETE /api/images/:slug            - Eliminar imagen
POST /api/images/batch              - Registro batch
```

#### 4. Script import-images-to-cms.mjs
Importó 17 imágenes existentes al CMS:
- Hero images (home, nosotros)
- Client logos (Avanzapark, Courtyard Marriott, etc.)
- Ajax systems images
- Certificaciones (OS-10)
- Sector thumbnails

### Archivos Creados

```
scripts/
├── generate-all-combos.mjs    # Genera 126 combos
├── import-images-to-cms.mjs    # Importa imágenes al CMS
└── export-images.mjs           # Exporta imágenes a JSON

worker/handlers/
└── images-api.ts              # API de imágenes
```

### Resultados

```
📦 9 servicios
📍 14 ubicaciones
🎯 126 combos generados ✅

📊 Imágenes CMS:
├── generic: 11 imágenes
├── page: 3 imágenes (2 héroes)
├── sector: 3 imágenes (3 héroes)
└── Total: 17 imágenes
```

---

## API del Worker

### Endpoints Disponibles

```bash
# Generar contenido
POST /api/sections/batch          # Generar todo
POST /api/sections/service/:slug   # Generar servicio
POST /api/sections/location/:slug # Generar ubicación
POST /api/sections/sector/:slug   # Generar sector
POST /api/sections/combo          # Generar combo (POST)

# Obtener contenido
GET /api/sections/service/:slug
GET /api/sections/location/:slug
GET /api/sections/sector/:slug
GET /api/sections/combo?service=X&location=Y

# Imágenes CMS
GET  /api/images                    # Listar imágenes
GET  /api/images/stats              # Estadísticas
GET  /api/images/service/:slug      # Imágenes de servicio
GET  /api/images/location/:slug     # Imágenes de ubicación
GET  /api/images/sector/:slug       # Imágenes de sector
POST /api/images                   # Registrar imagen
POST /api/images/batch             # Registro batch

# Query D1
POST /api/d1/query  {"sql": "SELECT * FROM services"}
```

### Cron Job
- Se ejecuta diariamente a las 3:00 AM
- Regenera contenido basado en nuevas keywords de Serper

---

## Flujo de Actualización de Contenido

```bash
# 1. Regenerar combos service×location
curl -X POST https://guardman-agent.oficinadesarrollo33.workers.dev/api/sections/combo \
  -H "Content-Type: application/json" \
  -d '{"serviceSlug": "guardias-de-seguridad", "locationSlug": "las-condes"}'

# 2. Generar todos los combos (script)
node scripts/generate-all-combos.mjs

# 3. Exportar a JSON
node scripts/export-sections.mjs

# 4. Registrar imágenes
node scripts/import-images-to-cms.mjs
node scripts/export-images.mjs

# 5. Build + Deploy
npm run build && wrangler pages deploy dist
```

---

## Estadísticas Finales

| Métrica | Valor |
|---------|-------|
| Páginas generadas | 172 |
| Servicios con CMS | 9 |
| Ubicaciones con CMS | 14 |
| Sectores con CMS | 7 |
| Combos (service×location) | 126 |
| Keywords en D1 | 1,268 |
| Competidores analizados | 2,602 |
| Secciones generadas | 500+ |
| Imágenes en CMS | 17 |
| Build time | ~4 segundos |

---

## URLs del Proyecto

| Recurso | URL |
|---------|-----|
| Sitio Production | https://guardman.cl |
| Preview Actual | https://fd349f63.guardman-site.pages.dev |
| Worker API | https://guardman-agent.oficinadesarrollo33.workers.dev |
| D1 Database | guardman-seo |

---

## Archivos Modificados/Creados

### Core
- `src/data/cms.ts` - Módulo CMS actualizado con sector e imágenes
- `src/data/cms/*.json` - 40+ archivos JSON

### Pages
- `src/pages/index.astro`
- `src/pages/contacto.astro`
- `src/pages/cotizacion.astro`
- `src/pages/nosotros.astro`
- `src/pages/servicios/[slug].astro`
- `src/pages/servicios/[slug]/[location].astro`
- `src/pages/servicios/index.astro`
- `src/pages/ubicaciones/[slug].astro`
- `src/pages/ubicaciones/index.astro`
- `src/pages/sectores/index.astro` (nuevo)
- `src/pages/sectores/[slug].astro` (nuevo)

### Components
- `src/components/cms/SectionRenderer.astro`
- `src/components/cms/ServiceContent.astro`
- `src/components/Header.astro`

### Worker
- `worker/index.ts` (actualizado con images-api)
- `worker/handlers/section-generator.ts`
- `worker/handlers/section-handler.ts` (fix rows error)
- `worker/handlers/sections-api.ts`
- `worker/handlers/images-api.ts` (nuevo)

### Scripts
- `scripts/export-sections.mjs` (actualizado con sectors)
- `scripts/generate-all-combos.mjs` (nuevo)
- `scripts/import-images-to-cms.mjs` (nuevo)
- `scripts/export-images.mjs` (nuevo)

---

## Pendiente / Próximos Pasos

1. ~~**Combos Content** - Generar contenido para las 126 combinaciones service×location~~ ✅
2. ~~**Images CMS** - Agregar gestión de imágenes al CMS~~ ✅
3. **Blog Migration** - Migrar blog de Directus a CMS
4. **Feedback Loop** - Sistema para correcciones manuales
5. **SEO Monitoring** - Tracking de keywords y rankings

---

*Documento actualizado: 14 Abril 2026*  
*GuardMan Chile - Seguridad Privada Santiago*
