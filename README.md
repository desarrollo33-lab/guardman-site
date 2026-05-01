# GuardMan Chile - SEO Content Generation System

Sistema completo de generación de contenido SEO para [guardman.cl](https://guardman.cl).

## Arquitectura

```
┌────────────────────────────────────────────────────────────────────┐
│                    GUARDMAN SEO SYSTEM                               │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  WORKER: https://guardman-agent.oficinadesarrollo33.workers.dev     │
│  D1: guardman-seo                                                   │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│  │   SERPER     │───▶│  GUARDMAN   │───▶│     D1       │         │
│  │   API        │    │   AGENT     │    │   DATABASE   │         │
│  └──────────────┘    └──────────────┘    └──────────────┘         │
│                                                                     │
└────────────────────────────────────────────────────────────────────┘
```

## Componentes

### Cloudflare Worker
- **URL**: https://guardman-agent.oficinadesarrollo33.workers.dev
- **Endpoints**: Research, Generate, D1, Deploy
- **Schedule**: Daily cron job a las 3:00 AM

### D1 Database
- **Name**: guardman-seo
- **Tables**: 18 tablas para SEO data
- **Status**: 5,357 registros

### Durable Object: GuardmanAgent
- AI-powered content generation
- Learning from corrections
- Knowledge base management

## API Endpoints

### Research
```bash
# Single research
curl -X POST https://guardman-agent.oficinadesarrollo33.workers.dev/api/research \
  -H "Content-Type: application/json" \
  -d '{"serviceSlug": "guardias-de-seguridad", "locationSlug": "las-condes"}'

# Batch research
curl -X POST https://guardman-agent.oficinadesarrollo33.workers.dev/api/batch-research \
  -H "Content-Type: application/json" \
  -d '{"combinations": [{"serviceSlug":"guard-pod","locationSlug":"las-condes"}]}'
```

### Generate
```bash
# Service content
curl -X POST https://guardman-agent.oficinadesarrollo33.workers.dev/api/generate \
  -d '{"type":"service","slug":"guardias-de-seguridad"}'

# Location content
curl -X POST https://guardman-agent.oficinadesarrollo33.workers.dev/api/generate \
  -d '{"type":"location","slug":"las-condes"}'

# Combo content
curl -X POST https://guardman-agent.oficinadesarrollo33.workers.dev/api/generate \
  -d '{"type":"combo","slug":"guard-pod","locationSlug":"las-condes"}'
```

### Status
```bash
curl https://guardman-agent.oficinadesarrollo33.workers.dev/api/d1/status
curl https://guardman-agent.oficinadesarrollo33.workers.dev/api/guardman/status
```

## D1 Tables

| Table | Rows | Description |
|-------|------|-------------|
| services | 9 | Servicios de seguridad |
| locations | 14 | Comunas de cobertura |
| keywords | 1,268 | Keywords con SDS score |
| competitors | 2,602 | Competidores por dominio |
| service_content | 9 | Contenido generado |
| location_content | 14 | Contenido generado |
| combo_content | 14 | Contenido generado |
| agent_knowledge | 29 | Base de conocimiento |

## Scripts

```bash
# Run full pipeline
npm run pipeline

# Export D1 content to JSON
npm run export

# Deploy worker
npm run worker:deploy

# Development
npm run dev
```

## SDS Score (SEO Difficulty Score)

| Tier | Score | Description |
|------|-------|-------------|
| Easy | < 25 | Rápido de posicionar |
| Moderate | 25-40 | Requiere esfuerzo |
| Competitive | 40-60 | Competencia alta |
| Hard | 60+ | Authority required |

## Keywords Easy Win

| Keyword | SDS | Servicio | Ubicación |
|---------|-----|----------|-----------|
| Guard Pod Las Condes | 20 | guard-pod | las-condes |
| Guard Pod Santiago Centro | 20 | guard-pod | santiago-centro |
| Guard Pod Lampa | 20 | guard-pod | lampa |
| Guard Pod Los Andes | 20 | guard-pod | los-andes |
| Guard Pod San Felipe | 23 | guard-pod | san-felipe |

## Services

1. guardias-de-seguridad
2. cctv-videovigilancia
3. control-de-accesos
4. escoltas-privados
5. monitoreo-24-7
6. seguridad-eventos
7. seguridad-industrial
8. auditoria-seguridad
9. guard-pod

## Locations

1. santiago-centro
2. las-condes
3. vitacura
4. huechuraba
5. quilicura
6. lo-barnechea
7. la-reina
8. renca
9. pudahuel
10. la-pintana
11. lampa
12. conchali
13. los-andes
14. san-felipe

## Environment Variables

Configurar en `.env` o Cloudflare dashboard:

```
SERPER_API_KEY=<obtener de serper.dev>
AUTH_PASSWORD=<ver .env>
ENVIRONMENT=production
```

## Tech Stack

- **Frontend**: Astro 5 + Tailwind v4
- **Backend**: Cloudflare Workers + Durable Objects
- **Database**: Cloudflare D1
- **AI**: Workers AI (Llama 3.1 8B)
- **Research**: Serper.dev API
- **Hosting**: Cloudflare Pages

---

Last updated: 2026-04-13