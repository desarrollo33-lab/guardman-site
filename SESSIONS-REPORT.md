# Reporte de Sesiones - GuardMan Site CMS Migration

**Período:** 10-14 Abril 2026  
**Proyecto:** GuardMan Chile - Sitio de Seguridad Privada  
**Worker:** https://guardman-agent.oficinadesarrollo33.workers.dev  
**D1 Database:** guardman-seo (ID: aeaab85c-d4df-46c4-96b9-28d6a95aaec4)

---

## Resumen Ejecutivo

Se implementó un sistema de gestión de contenido (CMS) 100% basado en Cloudflare D1 para el sitio de GuardMan Chile. Anteriormente el sitio usaba Directus como CMS externo, ahora todo el contenido se genera y sirve desde D1.

### Antes vs Después

| Aspecto | Antes | Después |
|---------|-------|---------|
| CMS | Directus ( externo) | D1 (Cloudflare) |
| Contenido | Directus API | JSON files + D1 |
| Worker | Basic | GuardMan Agent (Durable Object) |
| Keywords | - | 1,268 keywords researches |
| Competidores | - | 2,602 analizados |

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
- ✅ D1 database creada con 22 tablas
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
```

### Archivos Creados

#### Section Generator (`worker/handlers/section-generator.ts`)
Contenido único por servicio:
- `GUARDIAS_SECTIONS` - Contenido específico para guardias
- `CCTV_SECTIONS` - Contenido específico para CCTV
- `CONTROL_ACCESOS_SECTIONS` - Contenido específico para control de accesos
- etc.

```typescript
// Ejemplo de sección única por servicio
const GUARDIAS_SECTIONS = {
  hero: { heading: 'Guardias de Seguridad', ... },
  intro: { paragraphs: ['...'] },
  features: ['...'],
  faqs: [{ question: '...', answer: '...' }]
};
```

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
POST /api/sections/combo
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
│   └── sector-construccion.json
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
- Imágenes por sector:
  - `s4-thumbnail.webp` - Comercial, Eventos
  - `sector-industrial.webp` - Industrial, Construcción
  - `sector-residencial.webp` - Residencial
  - `nosotros_seccion.webp` - Salud
- Sección "Sectores Populares" con iconos

---

## API del Worker

### Endpoints Disponibles

```bash
# Generar contenido
POST /api/sections/batch          # Generar todo
POST /api/sections/service/:slug   # Generar servicio
POST /api/sections/location/:slug # Generar ubicación
POST /api/sections/sector/:slug   # Generar sector

# Obtener contenido
GET /api/sections/service/:slug
GET /api/sections/location/:slug
GET /api/sections/sector/:slug
GET /api/sections/combo?service=X&location=Y

# Query D1
POST /api/d1/query  {"sql": "SELECT * FROM services"}

# Generar contenido
POST /api/generate/content
```

### Cron Job
- Se ejecuta diariamente a las 3:00 AM
- Regenera contenido basado en nuevas keywords de Serper

---

## Flujo de Actualización de Contenido

```bash
# 1. Regenerar todo en D1
curl -X POST https://guardman-agent.oficinadesarrollo33.workers.dev/api/sections/batch \
  -H "Content-Type: application/json" \
  -d '{"type": "all"}'

# 2. Exportar a JSON
node scripts/export-sections.mjs

# 3. Build + Deploy
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
| Secciones generadas | 300+ |
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
- `src/data/cms.ts` - Módulo CMS
- `src/data/cms/*.json` - 30+ archivos JSON

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
- `worker/index.ts`
- `worker/handlers/section-generator.ts`
- `worker/handlers/section-handler.ts`
- `worker/handlers/sections-api.ts`
- `worker/handlers/content-generator.ts`

### Scripts
- `scripts/export-sections.mjs`

---

## Pendiente / Próximos Pasos

1. **Combos Content** - Generar contenido para las 126 combinaciones service×location
2. **Blog Migration** - Migrar blog de Directus a CMS
3. **Images CMS** - Agregar gestión de imágenes al CMS
4. **Feedback Loop** - Sistema para correcciones manuales
5. **SEO Monitoring** - Tracking de keywords y rankings

---

*Documento generado: 14 Abril 2026*
*GuardMan Chile - Seguridad Privada Santiago*
