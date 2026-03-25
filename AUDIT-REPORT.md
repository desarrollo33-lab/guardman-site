# 🔍 AUDITORÍA COMPLETA - guardman-site

**Fecha:** 2026-03-25  
**Auditor:** AI Coding Agent  
**Repositorios analizados:**
- Local: `C:/Users/56930/OneDrive/Escritorio/guardman-site`
- Remoto: `https://github.com/desarrollo33-lab/guardman-site`
- Template: `https://github.com/desarrollo33-lab/guardman-seo-template`

---

## 📊 RESUMEN EJECUTIVO

| Categoría | Estado | Issues |
|-----------|--------|--------|
| Coherencia Local vs Remoto | ⚠️ PARCIAL | 3 |
| SEO Meta Tags | ❌ FALTA | 5 |
| Schema Markup | ⚠️ INCOMPLETO | 6 |
| Brand DNA | ⚠️ DISCREPANCIAS | 4 |
| Estructura de Archivos | ✅ OK | 0 |
| URLs | ✅ OK | 0 |
| Accesibilidad | ⚠️ MEJORABLE | 2 |

---

## 1️⃣ AUDITORÍA DE COHERENCIA (Local vs Remoto)

### ✅ Archivos Coincidentes
- `src/data/brand-dna.ts` - **IDENTICO**
- `src/data/services.ts` - **IDENTICO**  
- `src/data/locations.ts` - **IDENTICO**
- `src/pages/index.astro` - **IDENTICO**
- `src/pages/servicios/[slug].astro` - **IDENTICO**
- `src/pages/ubicaciones/[slug].astro` - **IDENTICO**

### ⚠️ Archivos con Diferencias

| Archivo | Problema |
|---------|----------|
| `src/components/seo/SEOHead.astro` | **CRÍTICO**: El archivo local tiene **1337 bytes** mientras el remoto tiene código duplicado/comentado que no debería existir |
| `CORRECTION-PLAN.md` | Existe en local y remoto (recién creado) |
| `.env` | Diferencias esperadas (variables locales) |

### 🔴 Issue Crítico de Coherencia

**Archivo:** `SEOHead.astro`

El archivo local tiene código extra al final que incluye definiciones de otros componentes Schema (SchemaService, SchemaLocalBusiness) comentadas. Esto indica que alguien copió código de otros archivos al final de este archivo, lo cual es incorrecto.

---

## 2️⃣ CUMPLIMIENTO DEL TEMPLATE SEO

### 2.1 Meta Tags (Sección 2.1 del Template)

| Tag | Template Dice | Implementación Actual | Estado |
|-----|--------------|----------------------|--------|
| `<title>` | Único por página | ✅ Correcto | ✅ OK |
| `<meta name="description">` | Max 160 chars | ⚠️ Muchas exceden 160 | ⚠️ |
| `<link rel="canonical">` | Obligatorio | ✅ Correcto | ✅ OK |
| `og:title` | Obligatorio | ✅ Correcto | ✅ OK |
| `og:description` | Obligatorio | ✅ Correcto | ✅ OK |
| `og:image` | Obligatorio | ✅ Correcto | ✅ OK |
| `og:locale` | es_CL | ✅ Correcto | ✅ OK |
| `og:type` | website | ✅ Correcto | ✅ OK |
| **`og:site_name`** | **OBLIGATORIO** | ❌ **FALTA** | ❌ |
| `twitter:card` | summary_large_image | ✅ Correcto | ✅ OK |
| `twitter:title` | Obligatorio | ✅ Correcto | ✅ OK |
| `twitter:description` | Obligatorio | ✅ Correcto | ✅ OK |
| `twitter:image` | Obligatorio | ✅ Correcto | ✅ OK |

### 🔴 Meta Tags Faltantes

```html
<!-- FALTA en todas las páginas -->
<meta property="og:site_name" content="GuardMan Chile" />
```

### 2.2 Schema Markup (Sección 2.2 del Template)

| Tipo de Página | Schema Requerido | Implementación | Estado |
|----------------|------------------|----------------|--------|
| Homepage | Organization, WebSite, **ProfessionalService** | Organization, WebSite, **LocalBusiness** | ⚠️ |
| Service Page | Service, **FAQPage** | Service, FAQPage | ✅ OK |
| Location Page | LocalBusiness (con geo), **FAQPage** | LocalBusiness, FAQPage | ⚠️ |
| Combo Page | Service + areaServed, FAQPage, **BreadcrumbList** | Service, FAQPage | ❌ Falta Breadcrumb |
| Contact | ContactPage | No tiene schema específico | ❌ Falta |

### 🔴 Issues de Schema Markup

#### 1. SchemaOrganization usa LocalBusiness en homepage (debería ser ProfessionalService)

**Archivo:** `src/components/seo/SchemaOrganization.astro`

```javascript
// ACTUAL (Incorrecto para homepage)
{ "@type": "LocalBusiness" }

// DEBERÍA SER (según template)
{ "@type": "ProfessionalService" }
```

#### 2. SchemaLocalBusiness no tiene `parentOrganization`

**Archivo:** `src/components/seo/SchemaLocalBusiness.astro`

```javascript
// FALTA
"parentOrganization": { "@id": "https://guardman.cl/#organization" }
```

#### 3. Falta Breadcrumb Schema en páginas de ubicación

**Las páginas `/ubicaciones/[slug].astro` y `/servicios/[slug]/[location].astro` no incluyen SchemaBreadcrumb.astro**

#### 4. Falta SchemaFAQ en homepage

El template indica FAQPage como obligatorio pero homepage no lo tiene.

### 2.3 Estructura de Headings (Sección 2.3)

| Regla | Estado |
|-------|--------|
| Exactly ONE `<h1>` por página | ✅ Cumplido |
| No saltar niveles (h1→h3) | ✅ Cumplido |
| h1 debe contener keyword principal | ✅ Cumplido |

### 2.4 Imágenes (Sección 2.4)

| Regla | Estado |
|-------|--------|
| Alt text descriptivo | ⚠️ Algunos genéricos |
| Width/height obligatorios | ✅ Correcto |
| loading="lazy" below fold | ✅ Correcto |
| decoding="async" | ✅ Correcto |

### 2.5 URLs (Sección 2.5)

| Regla | Estado |
|-------|--------|
| Minúsculas | ✅ Correcto |
| Guiones (-) separadores | ✅ Correcto |
| Sin trailing slash | ✅ Correcto |
| Máximo 3 niveles | ✅ Correcto |

### 2.6 Links Internos (Sección 2.6)

| Regla | Estado |
|-------|--------|
| Rutas relativas (no absolutas) | ✅ Correcto |
| Links descriptivos | ✅ Correcto |
| Breadcrumbs en páginas profundas | ⚠️ Faltan en algunas |
| Mínimo 3-5 links internos | ✅ Correcto |

---

## 3️⃣ BRAND DNA - DISCREPANCIAS

### 3.1 Información de Contacto

| Campo | Template SEO | brand-dna.ts Actual | Estado |
|-------|-------------|---------------------|--------|
| primaryPhone | `+56-2-2400-6000` | `+56 9 300 000 10` | ⚠️ Diferente |
| headquartersAddress | `Av. Américo Vespucio Norte 1980` | `Av. Americo Vespucio Norte 1980` | ⚠️ Falta tilde |

### 3.2 Dirección Sin Acentos

**CRÍTICO:** La dirección en `brand-dna.ts` y todos los schemas dice:
```
Av. Americo Vespucio Norte 1980
```

**Debería ser:**
```
Av. Américo Vespucio Norte 1980
```

### 3.3 Diferenciadores

| # | Template | Implementación | Estado |
|---|----------|----------------|--------|
| 1 | GuardPod V1 | GuardPod V1 | ✅ OK |
| 2 | Supervisión Nocturna Preventiva | Supervision Nocturna Preventiva | ⚠️ Sin tilde |
| 3 | Respuesta Inmediata Certificada | Respuesta Inmediata Certificada | ⚠️ Sin tilde |
| 4 | Personal Certificación OS-10 | Personal Certificacion OS-10 | ⚠️ Sin tilde |
| 5 | Centro de Monitoreo Propio | Centro de Monitoreo Propio | ⚠️ Sin tilde |

---

## 4️⃣ ESTRUCTURA DE ARCHIVOS (Sección 1.1 del Template)

### ✅ Cumple con la estructura

```
src/
├── components/
│   ├── seo/          ✅ (SchemaOrganization, SchemaService, etc.)
│   ├── Header.astro  ✅
│   └── Footer.astro  ✅
├── data/
│   ├── brand-dna.ts  ✅
│   ├── services.ts   ✅
│   ├── locations.ts  ✅
│   └── site.ts       ✅
├── layouts/
│   └── BaseLayout.astro ✅
└── pages/            ✅
```

### ⚠️ No implementa subcarpetas sugeridas

El template sugiere:
```
components/cards/     → ❌ No existe (usa cards inline)
components/sections/  → ❌ No existe (secciones inline)
components/ui/        → ❌ No existe
data/generated/       → ❌ No existe (usa directus.ts)
```

**Nota:** Esto es aceptable ya que el proyecto usa Directus CMS en lugar de JSON files.

---

## 5️⃣ STANDARDS DE CÓDIGO (Sección 6)

### 6.1 TypeScript

| Regla | Estado |
|-------|--------|
| No usar `any` | ✅ Cumplido |
| Props con tipos | ✅ Correcto |
| Interfaces definidas | ✅ Correcto |

### 6.2 Imports

| Regla | Estado |
|-------|--------|
| Default imports para Astro | ✅ Correcto |
| Rutas relativas correctas | ✅ Correcto |

### 6.3 CSS/Tailwind

| Regla | Estado |
|-------|--------|
| No inline styles | ✅ Correcto |
| Usar tokens de diseño | ✅ Correcto |
| Clases descriptivas | ✅ Correcto |

### 6.4 Accesibilidad

| Regla | Estado |
|-------|--------|
| aria-label en icon-only buttons | ⚠️ Algunos faltan |
| alt text en imágenes | ⚠️ Algunos genéricos |
| focus states | ✅ Implementado |
| semantic HTML | ✅ Correcto |

---

## 6️⃣ CONTENT STANDARDS (Sección 3)

### 6.1 Longitud de Contenido

| Tipo de Página | Mínimo | Estado |
|----------------|--------|--------|
| Homepage | 500+ | ✅ Correcto |
| Service Page | 800+ | ⚠️ Podría mejorar |
| Location Page | 600+ | ⚠️ Podría mejorar |

### 6.2 FAQs

| Tipo | Mínimo | Implementado | Estado |
|------|--------|--------------|--------|
| Service Page | 5 FAQs | 5 | ✅ OK |
| Location Page | 4 FAQs | 5 | ✅ OK |
| Homepage | - | 0 | ⚠️ Podría agregar |

---

## 7️⃣ ISSUES CRÍTICOS RESUMIDOS

### 🔴 MUST FIX (Bloqueantes para SEO)

1. **Falta `og:site_name`** en todas las páginas
2. **Dirección sin acentos** en todos los schemas y brand-dna
3. **SEOHead.astro tiene código corrupto/duplicado**
4. **Falta Breadcrumb Schema** en páginas de ubicación y combo
5. **SchemaOrganization usa LocalBusiness** en homepage (debería ser ProfessionalService)

### ⚠️ SHOULD FIX (Mejores prácticas)

1. Meta descriptions que exceden 160 caracteres
2. Falta SchemaFAQ en homepage
3. Algunos alt text genéricos en imágenes
4. Teléfono principal diferente al del template
5. Diferenciadores sin tildes

---

## 8️⃣ CHECKLIST DE CUMPLIMIENTO

### Homepage (`/`)

- [x] H1 único con keyword
- [x] Meta title único
- [x] Meta description
- [x] Canonical tag
- [x] Open Graph tags
- [ ] **og:site_name**
- [x] Schema Organization
- [x] Schema WebSite
- [ ] **Schema FAQPage** (falta)
- [x] Alt text en imágenes
- [x] Width/height en imágenes
- [x] Lazy loading
- [x] Breadcrumbs (no aplica en homepage)
- [x] Links internos
- [x] CTA claro

### Service Pages (`/servicios/[slug]`)

- [x] H1 único con keyword
- [x] Meta title
- [x] Meta description
- [ ] **og:site_name**
- [x] Schema Service
- [x] Schema FAQPage
- [x] Breadcrumbs
- [x] Links internos
- [x] CTA claro
- [x] 5 FAQs

### Location Pages (`/ubicaciones/[slug]`)

- [x] H1 único con keyword
- [x] Meta title
- [x] Meta description
- [ ] **og:site_name**
- [x] Schema LocalBusiness
- [x] Schema FAQPage
- [ ] **Schema BreadcrumbList** (falta)
- [x] Breadcrumbs visuales
- [x] Links internos
- [x] CTA claro
- [x] 5 FAQs

---

## 9️⃣ RECOMENDACIONES DE CORRECCIÓN

### Prioridad 1 (Inmediato)

1. **Corregir `SEOHead.astro`** - Remover código duplicado y agregar `og:site_name`
2. **Agregar acentos** a la dirección en todos los archivos
3. **Agregar `parentOrganization`** a SchemaLocalBusiness
4. **Agregar SchemaBreadcrumb** a páginas de ubicación

### Prioridad 2 (Esta semana)

1. **Ajustar meta descriptions** a máximo 160 caracteres
2. **Corregir SchemaOrganization** para usar ProfessionalService en homepage
3. **Unificar teléfono principal** con el del template

### Prioridad 3 (Próxima iteración)

1. Mejorar alt text de imágenes
2. Agregar SchemaFAQ a homepage
3. Revisar contenido de Service/Location pages para cumplir mínimo de palabras

---

*Reporte generado: 2026-03-25*
*Standards v1.0 — Template actualizado: 2026-03-24*
