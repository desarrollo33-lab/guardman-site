# GuardMan Chile - Sitio Web con SEO Agent

Sitio web estático para GuardMan Chile + Sistema de generación SEO automatizado.

## Stack

- **Framework:** Astro 5 (static site)
- **Styling:** Tailwind CSS v4
- **Data:** JSON estático en `src/data/generated/`
- **SEO Agent:** Cloudflare Workers + D1 + Durable Objects
- **Deploy:** Cloudflare Pages

## Arquitectura

```
┌────────────────────────────────────────────────────────────────────┐
│                      GUARDMAN SEO SYSTEM                             │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │   SERPER     │───▶│  GUARDMAN   │───▶│     D1       │         │
│  │   CLIENT     │    │   AGENT     │    │   DATABASE   │         │
│  │  (Research)  │    │  (Durable   │    │  (Storage)   │         │
│  │              │    │   Object)   │    │              │         │
│  └──────────────┘    └──────────────┘    └──────────────┘         │
│         │                   │                   │                    │
│         │                   │                   ▼                    │
│         │                   │    ┌──────────────────────────┐      │
│         │                   │    │  STORED DATA             │      │
│         │                   │    │  - Raw research          │      │
│         │                   │    │  - Keywords + SDS         │      │
│         │                   │    │  - FAQs                   │      │
│         │                   │    │  - Competitors            │      │
│         │                   │    │  - Generated content      │      │
│         │                   │    │  - Agent knowledge        │      │
│         │                   │    └──────────────────────────┘      │
│         │                   │                   │                    │
│         │                   ▼                   ▼                    │
│         │          ┌──────────────────┐   ┌──────────────┐        │
│         │          │  CONTENT ENGINE  │   │    ASTRO     │        │
│         │          │  (AI Generated)   │   │   BUILD      │        │
│         │          └──────────────────┘   └──────────────┘        │
│         │                   │                   │                    │
│         └───────────────────┴───────────────────┘                   │
│                              │                                       │
│                              ▼                                       │
│                    ┌──────────────────┐                            │
│                    │  CLOUDFLARE      │                            │
│                    │  PAGES + WORKER   │                            │
│                    └──────────────────┘                            │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup D1 database
npm run d1:local

# 3. Check status
npm run seo:status

# 4. Run research (collect keywords, FAQs, competitors)
npm run seo:research

# 5. Deploy worker
npm run worker:deploy

# 6. Generate content
npm run seo:generate

# 7. Build site
npm run build

# 8. Deploy to Pages
npx wrangler pages deploy dist --project-name=guardman-site
```

## SEO Pipeline Commands

```bash
npm run seo:status    # Check D1 status
npm run seo:setup     # Setup D1 database
npm run seo:research  # Research with Serper
npm run seo:generate  # Generate content
npm run seo:full      # Full pipeline
```

## Worker API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/research` | GET | Research status |
| `/api/research` | POST | Research single combo |
| `/api/generate/service` | POST | Generate service content |
| `/api/generate/location` | POST | Generate location content |
| `/api/generate/combo` | POST | Generate combo content |
| `/api/guardman/status` | GET | Agent status |
| `/api/guardman/learn` | POST | Teach agent |
| `/api/d1/status` | GET | D1 status |
| `/api/deploy` | POST | Trigger deploy |

## D1 Database Schema

### Research Tables
- `services` - 9 servicios de seguridad
- `locations` - 14 comunas de cobertura
- `serper_queries` - Queries ejecutadas
- `serper_results` - Resultados SERP
- `keywords` - Keywords con SDS
- `competitors` - Competidores analizados
- `faqs` - FAQs de PAA

### Generated Content Tables
- `service_content` - Contenido para servicios
- `location_content` - Contenido para ubicaciones
- `combo_content` - Contenido para combinaciones

### Agent Tables
- `agent_knowledge` - Base de conocimiento
- `agent_corrections` - Correcciones humanas
- `guardman_history` - Historial de generaciones

## Guardman Agent

El agente es un Durable Object que:
1. Genera contenido SEO basado en research
2. Aprende de correcciones humanas
3. Mantiene base de conocimiento
4. Optimiza contenido para rankings

### Knowledge Categories
- `security_patterns` - Patrones de seguridad
- `industry_regulations` - Normativas (OS-10, Ley 21.659)
- `client_intent` - Intenciones de búsqueda
- `competitive_moats` - Ventajas competitivas
- `regional_patterns` - Patrones por zona
- `content_templates` - Templates de contenido
- `exclusion_rules` - Qué NO decir

## Desarrollo

```bash
# Development
npm run dev              # Astro dev
npm run worker:dev       # Worker dev

# Build
npm run build            # Astro build

# Validation
npm run validate         # Validate JSON data
```

## Deployment

### Worker
```bash
npx wrangler deploy --config wrangler.toml
```

### Pages
```bash
npx wrangler pages deploy dist --project-name=guardman-site
```

## Estructura del Proyecto

```
guardman-site/
├── src/                    # Astro site
│   ├── components/
│   ├── data/generated/     # JSON data
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── worker/                 # Cloudflare Worker
│   ├── agents/
│   │   └── guardman.ts     # Guardman Agent (Durable Object)
│   ├── handlers/
│   │   ├── research.ts     # Serper research
│   │   ├── generate.ts     # Content generation
│   │   ├── d1.ts          # D1 queries
│   │   └── deploy.ts       # Deployment
│   ├── serper.ts           # Serper client
│   ├── auth.ts             # Auth middleware
│   ├── router.ts           # Router
│   └── index.ts           # Worker entry
├── scripts/
│   ├── run-pipeline.mjs    # Pipeline CLI
│   └── fetch-cms-data.mjs  # Data validation
├── worker/sql/
│   └── schema.sql          # D1 schema
└── wrangler.toml           # Worker config
```

## Contacto

- **Sitio:** https://guardman.cl
