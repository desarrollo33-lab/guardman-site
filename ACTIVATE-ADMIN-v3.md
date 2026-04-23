Eres el asistente de desarrollo del proyecto GuardMan Admin Panel.

## Proyecto
- **Worker URL:** https://guardman-admin-panel.oficinadesarrollo33.workers.dev
- **Credenciales:** `admin@guardman.cl` / `GuardMan2026!@#Admin`
- **Repo local:** `C:\Users\56930\OneDrive\Escritorio\guardman-admin`
- **Entry point:** `src/index.ts` (723 líneas, todo inline — HTML+JS+API routes en un solo archivo template literal)
- **Deploy:** `cd guardman-admin && npx wrangler deploy`
- **Site Astro:** `https://4061deb7.guardman-site.pages.dev` (front-end del sitio, imágenes viven acá)
- **Site Astro repo:** `C:\Users\56930\OneDrive\Escritorio\guardman-site`

## Infraestructura Cloudflare
- **D1 Database:** `guardman-seo` / `aeaab85c-d4df-46c4-96b9-28d6a95aaec4`
- **R2 Bucket:** `guardman-images` (47 imágenes, keys con prefijo `images/`)
- **Auth Secret:** `AUTH_TOKEN` set via `wrangler secret put`
- **MiniMax API:** Key hardcoded en `src/index.ts` función `callMiniMaxAI`, model `minimax-m2.7`, endpoint `api.minimax.io/anthropic/v1/messages`

## Datos D1 (conteos)
- services: 9 | locations: 14 | sectors: 7 | keywords: 1,268 | serper_queries: 1,387 | serper_results: 11 (⚠️ debería ser ~2,600) | competitors: 2,602 | research_cache: 48 | content_versions: 28 | landmarks: 0 | faqs: 0

## Reglas CRÍTICAS de código
1. **NUNCA usar `${}` template literals dentro del HTML** — el HTML vive dentro de `const HTML = \`...\`` de TypeScript. Usar SIEMPRE string concatenation: `h += '<div>' + esc(name) + '</div>'`
2. **NUNCA usar `onclick="func('arg')"` o `onerror="..."`** — Las comillas dentro de atributos HTML se rompen en template literal. Usar data attributes + `addEventListener`: `data-action="edit"` + delegación de eventos
3. **SIEMPRE usar `esc()` para datos de usuario en HTML** — Previerte XSS
4. **Verificar JS syntax ANTES de deploy** — Extraer `<script>` del HTML servido y correr `node --check`
5. **Imágenes de R2 son públicas** — La ruta `GET /api/images/:key` está ANTES del auth check para que `<img>` tags funcionen sin auth
6. **URLs de imágenes** apuntan al sitio Astro: `https://4061deb7.guardman-site.pages.dev/images/...`

## Errores conocidos y soluciones (NO repetir)
- Imágenes 401 →移动 ruta `/api/images/:key` antes del auth middleware
- JS SyntaxError por `onclick`/`onerror` inline → usar data attributes + addEventListener
- `selectImage()` vs `selectImageFor()` → corregido nombre de función
- Sidebar centrado → clase `.boot-screen` que se remueve en `showDashboard()`
- Tailwind flash → CSS inline crítico + `setTimeout(boot, 200)`
- Generación AI no usaba IA → integrada MiniMax M2.7 con prompt detallado + fallback a templates

## Secciones del panel (9)
Servicios | Ubicaciones | Sectores | Imágenes | CMS Editor | SEO Dashboard | Keywords | Competidores | Research

## API Endpoints
Públicos: `GET /health`, `GET /`, `GET /api/images/:key`, `POST /api/login`
Protegidos: `GET /api/services`, `GET /api/locations`, `GET /api/sectors`, `GET|POST /api/content`, `GET /api/content/latest/:type/:slug`, `POST /api/ai/generate`, `GET|POST /api/images`, `DELETE /api/images/:key`, `GET /api/seo/dashboard`, `GET /api/seo/keywords`, `GET /api/seo/competitors`, `GET /api/seo/serper`, `GET /api/seo/research`

## Estructura CMS content
```json
{ "slug": "...", "name": "...", "sections": {
    "hero": { "heading": "", "subheading": "", "image": "", "cta_text": "" },
    "meta": { "title": "", "description": "" },
    "intro": { "heading": "", "paragraphs": [] },
    "features": { "heading": "", "items": [] },
    "coverage": { "heading": "", "items": [] },
    "issues": { "heading": "", "items": [] },
    "stats": { "heading": "", "items": [{"label": "", "value": ""}] },
    "faqs": { "heading": "", "items": [{"question": "", "answer": ""}] },
    "cta": { "heading": "", "subheading": "", "button": "", "image": "" }
}}
```

## Pendientes conocidos
1. `serper_results` solo tiene 11 registros (debería tener ~2,600) — investigar pipeline
2. `landmarks` y `faqs` tablas vacías — poblar con datos OSM y FAQs generados
3. Solo 28 `content_versions` de 126 combos posibles — generate contenido para todos
4. MiniMax API key hardcodeada → mover a wrangler secret
5. Durable Objects sin migrations en wrangler.jsonc
6. Considerar migrar frontend a React/Vue con build step

## Archivos de referencia
- `HANDOFF-ADMIN-v3.md` — Handoff completo con detalles, ejemplos de código, y diagnóstico
- `src/admin-stable.ts` — Backup de versión estable anterior
- `src/ai/minimax.ts` — Módulo de integración MiniMax (alternativa, no se usa directamente ahora)
- `src/durable/ai-generator.ts` — Durable Object legacy para AI streaming (no se usa)
- Sitio Astro en `C:\Users\56930\OneDrive\Escritorio\guardman-site\src\data\` — JSON con estructura de datos del sitio