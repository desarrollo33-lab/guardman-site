# GuardMan Admin Panel v3 — Handoff Completo

**Fecha:** 2026-04-15  
**Versión deployada:** 3.0.0  
**URL:** https://guardman-admin-panel.oficinadesarrollo33.workers.dev  
**Credenciales:** `admin@guardman.cl` / `GuardMan2026!@#Admin`

---

## Arquitectura

```
Cloudflare Worker (src/index.ts) — 723 líneas
├── HTML template literal (const HTML = `...`) — todo el frontend inline
├── API Routes (14 endpoints)
├── D1 Database: guardman-seo (aeaab85c-d4df-46c4-96b9-28d6a95aaec4)
├── R2 Bucket: guardman-images (47 imágenes)
└── MiniMax AI integration (api.minimax.io, model: minimax-m2.7)

Frontend: Vanilla JS string concatenation (NO template literals dentro del HTML)
CSS: Tailwind CDN
Icons: Font Awesome 6.4
```

### Stack y recursos

| Recurso | Binding | ID/Nombre |
|---------|---------|-----------|
| Worker | - | `guardman-admin-panel` |
| D1 Database | `DB` | `guardman-seo` / `aeaab85c-d4df-46c4-96b9-28d6a95aaec4` |
| R2 Bucket | `IMAGES` | `guardman-images` |
| Durable Objects | `AI_GENERATOR` | `AIGenerator`, `ContentQueue` |
| Secret | `AUTH_TOKEN` | Set via `wrangler secret put AUTH_TOKEN` |
| MiniMax API | hardcoded | `sk-cp-U-sq04tch8tjWqmRtwXWoRMvHmOZVM4NnScOFOeWfeDQFcAm-...` |

### Datos en D1 (conteos actuales)

| Tabla | Registros | Descripción |
|-------|-----------|-------------|
| `services` | 9 | Servicios de seguridad |
| `locations` | 14 | Comunas/ubicaciones |
| `sectors` | 7 | Sectores industriales |
| `keywords` | 1,268 | Keywords Serper con SDS score, tier, intent |
| `serper_queries` | 1,387 | Queries ejecutadas contra Serper API |
| `serper_results` | 11 | Resultados SERP (solo 11 con type orgánico) |
| `competitors` | 2,602 | Dominios competidores (638 únicos) |
| `research_cache` | 48 | Cache de research (Serper + OSM) |
| `content_versions` | 28 | Versiones de contenido generado |
| `images` | - | Registro de imágenes |
| `deployments` | 1 | Registro de deployments |
| *+ 20 tablas más* | - | Ver lista completa abajo |

**Tablas completas en D1:** `_cf_KV, agent_corrections, agent_knowledge, audit_reports, combo_content, combo_sections, combos, competitor_analysis, competitors, content_versions, deployments, faqs, images, keywords, landmarks, location_content, location_sections, locations, pipeline_jobs, quality_scores, research_cache, schema_data, sector_sections, sectors, seo_validations, serper_queries, serper_results, service_content, service_sections, service_sectors, services, sqlite_sequence, testimonials, workflow_status`

---

## API Endpoints

### Públicos (sin auth)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Health check, retorna `{"ok":true,"version":"3.0.0"}` |
| GET | `/` | Serve el HTML del panel completo |
| GET | `/api/images/:key` | Obtener imagen de R2 por key (público para `<img>` tags) |
| POST | `/api/login` | Login con email/password |

### Protegidos (requieren Authorization header)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/services` | Listar servicios |
| GET | `/api/locations` | Listar ubicaciones |
| GET | `/api/sectors` | Listar sectores |
| GET | `/api/content/latest/:type/:slug` | Última versión de contenido |
| GET | `/api/content?type=&slug=` | Buscar contenido con filtros |
| POST | `/api/content` | Guardar nueva versión de contenido |
| POST | `/api/ai/generate` | Generar contenido con MiniMax AI |
| GET | `/api/images` | Listar imágenes (URLs apuntan al sitio Astro) |
| POST | `/api/images` | Subir imagen a R2 |
| DELETE | `/api/images/:key` | Eliminar imagen de R2 |
| GET | `/api/seo/dashboard` | Dashboard SEO — métricas agregadas |
| GET | `/api/seo/keywords?tier=&intent=&easy=&limit=` | Keywords con filtros |
| GET | `/api/seo/competitors` | Top 50 dominios competidores |
| GET | `/api/seo/serper?service=&location=` | Serper queries |
| GET | `/api/seo/research` | Research cache |

---

## Secciones del Panel

### Sidebar (9 secciones)

1. **Servicios** — Tarjetas con nombre, descripción, slug, precio, estado
2. **Ubicaciones** — Tarjetas con nombre, zona, región
3. **Sectores** — Tarjetas con nombre, descripción, slug
4. **Imágenes** — Grid de imágenes del sitio Astro + upload a R2
5. **CMS Editor** — Editor de contenido por entidad con tabs (Servicios/Ubicaciones/Sectores)
6. **SEO Dashboard** — Métricas: keywords, easy wins, queries, competidores, research cache + breakdown
7. **Keywords** — Tabla completa con SDS score, tier, intent, easy win flag
8. **Competidores** — Top 50 dominios con tipo, posición promedio, apariciones
9. **Research** — Cache de Serper/OSM + queries con estado

### CMS Editor — Estructura de contenido

El editor genera/edita contenido con esta estructura:

```json
{
  "slug": "guardias-de-seguridad",
  "name": "Guardias de Seguridad",
  "sections": {
    "hero": { "heading": "...", "subheading": "...", "image": "..." },
    "meta": { "title": "...", "description": "..." },
    "intro": { "heading": "...", "paragraphs": ["...", "..."] },
    "features": { "heading": "...", "items": ["..."] },        // solo services/sectors
    "coverage": { "heading": "...", "items": ["..."] },        // solo locations
    "issues": { "heading": "...", "items": ["..."] },
    "stats": { "heading": "...", "items": [{"label": "...", "value": "..."}] },
    "faqs": { "heading": "...", "items": [{"question": "...", "answer": "..."}] },
    "cta": { "heading": "...", "subheading": "...", "button": "...", "image": "..." }
  }
}
```

El editor muestra dinámicamente:
- **Servicios**: hero, meta, intro, features, issues, stats, faqs, cta
- **Ubicaciones**: hero, meta, intro, coverage, issues, stats, faqs, cta
- **Sectores**: hero, meta, intro, features, issues, stats, faqs, cta

---

## Errores Encontrados y Soluciones

### 1. Imágenes no se mostraban (401 Unauthorized)

**Problema:** La ruta `GET /api/images/:key` estaba DESPUÉS del middleware de auth. Los `<img>` tags del navegador no envían Authorization headers, entonces las imágenes devolvían 401.

**Solución:** Se movió la ruta `GET /api/images/:key` ANTES del check de auth. Las imágenes ahora son públicas.

```typescript
// ANTES (roto): auth check primero, luego /api/images/
// DESPUÉS (funcionando): /api/images/:key es público, auth check después
if (path.startsWith('/api/images/') && method === 'GET') {
  const key = path.replace('/api/images/', '');
  const object = await env.IMAGES.get(key);
  // ... servido sin auth
}
// ... luego auth check para el resto
```

### 2. JavaScript no cargaba — SyntaxError por `onclick` con comillas

**Problema:** El HTML está dentro de un template literal de TypeScript (`const HTML = \`...\``). Los atributos inline como `onclick="func('arg')"` se renderizaban mal porque las comillas simples dentro del atributo rompían el parsing: `onclick="func('arg')"` → el browser veía `onclick="func('` y el resto causaba SyntaxError.

**Sintoma:** La página se quedaba en "Cargando..." sin avanzar. Al abrir la consola: `SyntaxError: Unexpected identifier 'none'` en la línea con `onerror="this.style.display='none'"`.

**Solución:** Se eliminaron TODOS los `onclick` y `onerror` inline. Se reemplazaron con:
- Data attributes + `addEventListener` para clicks: `data-action="edit"` + event delegation
- Clase CSS + `document.addEventListener('error', ...)` para error de imágenes: `class="img-fallback"` + listener global

**Patrón problemático (NUNCA hacer):**
```javascript
// Dentro de const HTML = `...`
h += '<button onclick="showTab(\'services\')">...</button>';  // ROMPE
h += '<img onerror="this.style.display=\'none\'">';             // ROMPE
```

**Patrón correcto:**
```javascript
h += '<button data-tab="services" class="cms-tab-btn">...</button>';
// ...
document.querySelectorAll('.cms-tab-btn').forEach(function(btn) {
  btn.addEventListener('click', function() { /* ... */ });
});

// Para imágenes con error:
document.addEventListener('error', function(e) {
  if (e.target && e.target.tagName === 'IMG' && e.target.classList.contains('img-fallback')) {
    e.target.style.display = 'none';
  }
}, true);
```

### 3. Bug `selectImage()` vs `selectImageFor()`

**Problema:** El botón de selección de imagen llamaba a `selectImage()` pero la función se llamaba `selectImageFor()`. Causaba `ReferenceError: selectImage is not defined`.

**Solución:** Se corrigió la referencia:
```javascript
// ANTES (roto):
btn.addEventListener('click', function() { selectImage(btn.dataset.img); });
// DESPUÉS (correcto):
btn.addEventListener('click', function() { selectImageFor(btn.dataset.img); });
```

### 4. Sidebar centrado en pantalla (glitch visual al cargar)

**Problema:** El CSS inline tenía `#app { display:flex; align-items:center; justify-content:center }` permanente, lo que centraba TODO el contenido incluyendo el dashboard.

**Solución:** Se creó una clase `.boot-screen` que solo se aplica al loading inicial, y se quita en `showDashboard()`:
```css
.boot-screen { min-height:100vh; display:flex; align-items:center; justify-content:center; }
```
```javascript
function showDashboard() {
  var app = document.getElementById('app');
  app.classList.remove('boot-screen');  // Quita el centrado
  app.innerHTML = '...';                // Renderiza el dashboard
}
```

### 5. Tailwind CSS causaba flash sin estilos

**Problema:** Tailwind carga desde CDN. Antes de que cargue, las clases no existen, causando que el sidebar se muestre mal por un momento.

**Solución:** 
1. CSS crítico inline para el loading screen (no depende de Tailwind)
2. Tailwind script se mueve antes del script principal
3. Boot se retrasa con `setTimeout(boot, 200)` para que Tailwind cargue primero

### 6. Generación AI no usaba IA real

**Problema:** El botón "Generar con AI" solo hacía string interpolation con templates. Devolvía contenido genérico tipo `"Seguridad Privada en " + name`.

**Solución:** Se integró MiniMax M2.7 API (`api.minimax.io/anthropic/v1/messages`):
- Prompt detallado con contexto de GuardMan (8+ años, 500+ guardias, 14 comunas, OS-10)
- Genera hero, intro, features, issues, stats, faqs, cta, meta con IA
- Fallback automático al template si la API falla (marca `generated_by: 'ai-fallback'`)
- La respuesta de IA se parsea como JSON y se valida

**Ejemplo de respuesta IA real (Providencia):**
```
hero.heading: "Seguridad Privada en Providencia | Guardias 24/7"
hero.subheading: "Protegemos tu hogar, empresa y eventos con guardias certificados y 
tecnología de vanguardia en el corazón de Providencia."
faq.q: "¿Cuánto cuesta un guardia de seguridad en Providencia?"
faq.a: "Los costos varían según las horas de servicio y tipo de vigilancia requerida. 
En GuardMan ofrecemos cotizaciones personalizadas gratuitas, con planes desde $800.000 
mensuales para servicios básicos hasta soluciones integrales para empresas."
```

---

## Convenciones Críticas para el Código

### REGLA #1: Nunca usar template literals `${}` dentro del HTML

El HTML completo vive dentro de un template literal de TypeScript:
```typescript
const HTML = `<!DOCTYPE html>...<script>var x = '...';</script>...</html>`;
```

Cualquier `${}` dentro se evalúa como TypeScript, no como JS del navegador. Use SIEMPRE string concatenation:

```javascript
// ❌ MAL — Se evalúa como TypeScript, busca variable `name` en el server
const HTML = `...<h1>${name}</h1>...`;

// ✅ BIEN — Se evalúa en el navegador como JS
h += '<h1>' + esc(name) + '</h1>';
```

### REGLA #2: Nunca usar inline event handlers con comillas

```javascript
// ❌ MAL — Las comillas se rompen en template literal
h += '<button onclick="editContent(\'service\')">...';

// ✅ BIEN — Data attributes + addEventListener
h += '<button data-type="service" data-slug="guardias" class="edit-btn">...';
// Luego:
document.querySelectorAll('.edit-btn').forEach(function(btn) {
  btn.addEventListener('click', function() { editContent(btn.dataset.type, btn.dataset.slug); });
});
```

### REGLA #3: Siempre usar `esc()` para datos de usuario en HTML

```javascript
function esc(s) { if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
```

### REGLA #4: Rutas de imágenes

Las URLs de imágenes en la API de R2 apuntan al sitio Astro:
```typescript
const siteBase = 'https://4061deb7.guardman-site.pages.dev';
// GET /api/images devuelve: { key: 'images/hero-home.webp', url: siteBase + '/' + key }
```

Las imágenes del sitio están en `public/images/` del proyecto Astro y se acceden como:
```
https://4061deb7.guardman-site.pages.dev/images/hero-home.webp
```

### REGLA #5: Verificar JS syntax antes de deploy

```bash
# Extraer JS del HTML servido y validar
curl -s https://guardman-admin-panel.oficinadesarrollo33.workers.dev/ -o /tmp/admin.html
node -e "
const fs = require('fs');
const html = fs.readFileSync('/tmp/admin.html', 'utf8');
const re = /<script[^>]*>([\s\S]*?)<\/script>/g;
let m;
while ((m = re.exec(html)) !== null) {
  const js = m[1].trim();
  if (js.length > 100) fs.writeFileSync('/tmp/check.js', js);
}
" && node --check /tmp/check.js && echo '✅ OK'
```

---

## Flujo de Autenticación

1. **Login:** `POST /api/login` con `{ email, password }`
2. **Token:** Retorna `{ token: "admin@guardman.cl:TIMESTAMP" }`
3. **Auth check:** Verifica que `Authorization` header contenga `env.AUTH_TOKEN` O empiece con `Bearer admin@guardman.cl:`
4. **Imagen Pública:** `GET /api/images/:key` NO requiere auth (moved before auth middleware)

---

## Estructura de Archivos

```
guardman-admin/
├── wrangler.jsonc              # Configuración del worker
├── src/
│   ├── index.ts               # ★ ENTRY POINT - 723 líneas, todo inline
│   ├── admin-stable.ts        # Backup de la versión estable anterior
│   ├── admin-complete.ts      # Versión completa anterior (no usar)
│   ├── admin-fixed.ts         # Versión fixed anterior (no usar)
│   ├── ai/
│   │   └── minimax.ts          # Integration con MiniMax M2.7
│   ├── durable/
│   │   └── ai-generator.ts    # Durable Object para AI generation (no se usa ahora)
│   └── (otros archivos legacy, no usar)
│
├── guardman-site/             # Proyecto Astro (si existe localmente)
│   └── src/
│       └── data/
│           ├── cms/            # JSON del sitio Astro (referencia de estructura)
│           │   ├── config.json
│           │   ├── services.json
│           │   ├── locations.json
│           │   ├── images.json
│           │   ├── images-generic.json
│           │   ├── images-page.json
│           │   ├── images-sector.json
│           │   └── {service/location/sector}-*.json  (39 archivos total)
│           └── generated/      # Datos generados por la pipeline
│               ├── top-competitors.json
│               ├── easy-keywords.json
│               ├── site-config.json
│               ├── service-pages.json
│               ├── location-pages.json
│               ├── combo-content.json
│               └── ...
```

---

## Comandos Útiles

```bash
# Deploy
cd guardman-admin && npx wrangler deploy

# D1 queries
npx wrangler d1 execute guardman-seo --remote --command "SELECT COUNT(*) as c FROM keywords"

# Listar tablas
npx wrangler d1 execute guardman-seo --remote --command "SELECT name FROM sqlite_master WHERE type='table'"

# R2 listar imágenes
npx wrangler r2 object list guardman-images --limit 10

# R2 subir imagen
npx wrangler r2 object put guardman-images/images/test.webp --file ./test.webp

# Ver secrets
npx wrangler secret list

# Tail de logs en vivo
npx wrangler tail
```

---

## Pendientes / Próximos Pasos

1. **serper_results tiene solo 11 registros** — La tabla debería tener ~2600+ resultados. Parece que el pipeline de Serper no se ejecutó completamente o los resultados se guardaron en la tabla `competitors` en vez de `serper_results`. Investigar.

2. **landmarks y faqs tablas vacías** (0 registros) — Poblar con datos OSM y FAQs generados.

3. **content_versions solo tiene 28 registros** — Los 9 servicios × 14 ubicaciones × 7 sectores = 126 combos necesitan contenido. El CMS editor con IA los genera uno por uno.

4. **Imágenes del R2 apuntan al sitio Astro** — Funciona, pero si el sitio Astro se mueve, las URLs se rompen. Considerar migrar a CDN dedicado o usar un dominio custom.

5. **Versión history/diff** — El CMS guarda versiones pero no hay UI para ver historial o diff entre versiones.

6. **Drag-and-drop upload** — El upload actual usa un input file simple. Mejorar con drag-and-drop area.

7. **Separar frontend** — El HTML inline en TypeScript es difícil de mantener. Considerar migrar a un framework (React/Vue) con build step.

8. **MiniMax API key hardcodeada** — Mover a `wrangler secret put MINIMAX_API_KEY` y leer de `env.MINIMAX_API_KEY`.

9. **Durable Objects sin migrations** — `wrangler.jsonc` tiene `durable_objects` pero no `migrations`. Agregar:

```jsonc
{
  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["AIGenerator", "ContentQueue"]
    }
  ]
}
```

10. **SEO Dashboard mejoras**:
    - Gráficos de trends (keywords por tier over time)
    - Filtros por servicio/ubicación en keywords y competidores
    - Exportar a CSV
    - Botón para re-ejecutar Serper queries
    - Indicador de coverage (cuántos combos tienen contenido vs. vacíos)

---

## Diagrama de Datos del Sitio Astro (referencia)

```
Servicios (9) × Ubicaciones (14) × Sectores (7) = 126 combinaciones SEO

services.json          → 9 servicios con slug, nombre, descripción, precios
locations.json         → 14 comunas con slug, nombre, zona, coordenadas
sectors.json           → 7 sectores con slug, nombre, descripción
config.json            → Metadata global (9 servicios, 14 ubicaciones, 7 sectores, 126 combos)
images.json            → 17 imágenes con slug, alt, entity_type, entity_slug, url, format
service-*.json         → Contenido detallado por servicio (hero, intro, features, etc.)
location-*.json        → Contenido detallado por ubicación
sector-*.json          → Contenido detallado por sector
generated/*.json       → Datos de la pipeline de generación (top-competitors, easy-keywords, etc.)
```

**Convención de slugs:**
- Servicios: `guardias-de-seguridad`, `cctv-videovigilancia`, `control-de-accesos`, etc.
- Ubicaciones: `las-condes`, `vitacura`, `santiago-centro`, etc.
- Sectores: `industrial`, `residencial`, `comercial`, etc.
- Imágenes: `/images/hero-home.webp`, `/images/sector-industrial.webp`, etc.