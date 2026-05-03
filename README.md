# GuardMan Chile — Sitio Público v1.12

Sitio web de [GuardMan Chile](https://guardman.cl), empresa de seguridad privada.

## Tech Stack
- **Astro 5** + Tailwind CSS v4 + React 19
- Deploy en **Cloudflare Pages**
- CMS: **Cloudflare D1** + Admin Panel Worker

## CMS Architecture
Todo el contenido se gestiona desde el [Admin Panel](https://guardman-admin.pages.dev) y se sincroniza vía GitHub Actions o manualmente.

```
Admin Panel (D1 + R2)
    ↓ sync-from-admin.mjs
guardman-site (src/data/cms/*.json)  ← 171+ JSON files
    ↓ astro build (SSG)
Cloudflare Pages (dist/)             ← 174 pages
```

## Structure
```
src/
├── data/
│   ├── cms/                # 171+ JSON files (CMS sync)
│   │   ├── services.json   # 9 servicios
│   │   ├── locations.json  # 14 ubicaciones
│   │   ├── sectors.json    # 9 sectores
│   │   ├── zones.json      # 6 zonas con contexto
│   │   ├── homepage.json   # Homepage CMS
│   │   ├── brand.json      # Brand DNA
│   │   ├── staff.json      # Staff section
│   │   ├── hub-*.json      # Hub page content
│   │   ├── pages-*.json    # Static page content
│   │   ├── combo-*.json    # 126 combo pages
│   │   └── media-map.json  # Image assignments
│   ├── generated/          # Pipeline data (SEO, blog, etc.)
│   ├── cms.ts              # CMS reader module
│   ├── cms-config.ts       # Visual design tokens only
│   ├── cms-helpers.ts      # Unified parsers (parseIntro, parseFAQs, etc.)
│   ├── media-map.ts        # Image resolver
│   ├── brand.ts            # Brand DNA from CMS
│   ├── directus.ts         # Blog/Clients/SiteConfig (generated data)
│   └── types.ts            # TypeScript interfaces
├── pages/                  # 16 route templates → 174 pages
├── components/             # 20 Astro components
├── layouts/                # BaseLayout
└── styles/                 # app.css (Tailwind v4 theme)
```

## Pages (174 total)
| Route | Count | CMS Source |
|-------|-------|------------|
| `/` | 1 | `homepage.json` |
| `/servicios/` | 1 | `hub-services.json` |
| `/servicios/[slug]` | 9 | `{slug}.json` |
| `/servicios/[slug]/[location]` | 126 | `combo-*.json` |
| `/ubicaciones/` | 1 | `hub-locations.json` |
| `/ubicaciones/[slug]` | 14 | `location-*.json` |
| `/sectores/` | 1 | `hub-sectors.json` |
| `/sectores/[slug]` | 9 | `sector-*.json` |
| `/blog/` | 1 | `hub-blog.json` |
| `/blog/[slug]` | N | `generated/blog.json` |
| `/nosotros` | 1 | `pages-nosotros.json` |
| `/contacto` | 1 | `pages-contacto.json` |
| `/cotizacion` | 1 | `pages-cotizacion.json` |
| `/404` | 1 | `pages-404.json` |
| `/privacidad` | 1 | `pages-privacidad.json` |
| `/terminos` | 1 | `pages-terminos.json` |

## Commands
```bash
npm run dev          # Desarrollo local
npm run build        # Build de producción
npm run sync:all     # Sincronizar contenido desde Admin API
npm run deploy       # Sync + Build + Deploy
node scripts/validate-cms.mjs   # Validar datos CMS
node scripts/clean-chinese.mjs  # Limpiar caracteres chinos
node scripts/generate-seo-meta.mjs  # Generar SEO meta desde keywords
```

## SEO
- **126 páginas combo** (9 servicios × 14 ubicaciones)
- **9 páginas de sector** industrial
- **1,268 keywords** investigadas (Serper data)
- **Schema markup**: Organization, WebSite, Service, LocalBusiness, FAQ, Article, Breadcrumb
- Sitemap automático (`@astrojs/sitemap`)
- `robots.txt` configurado

## Deploy
Automático via GitHub Actions (`repository_dispatch` desde Admin API).

## Documentation
- `docs/PLAN-v1.12.md` — Plan de optimización completo
- `docs/DESIGN.md` — Design system
- `docs/handoffs/` — Session reports y handoffs
