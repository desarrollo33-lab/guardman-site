# Reporte de Sesiones - GuardMan Admin Panel + CMS

**Período:** 14 Abril 2026  
**Última actualización:** 14 Abril 2026 - Implementación completa CRUD + Relaciones  
**Proyecto:** GuardMan Chile - Sitio de Seguridad Privada  
**Admin Panel:** https://guardman-admin-panel.oficinadesarrollo33.workers.dev  
**D1 Database:** guardman-seo (ID: aeaab85c-d4df-46c4-96b9-28d6a95aaec4)  
**R2 Bucket:** guardman-images

---

## Resumen Ejecutivo

Se implementó un Admin Panel completo con CRUD para servicios, ubicaciones y sectores económicos. Se corrigió un error estructural grave donde "sectores" se usaban incorrectamente para zonas geográficas (cuando correspondía a ubicaciones) y se creó la estructura correcta.

### Antes vs Después

| Concepto | Antes (INCORRECTO) | Después (CORRECTO) |
|----------|--------------------|--------------------|
| **Sectores** | Zonas geográficas (Oriente, Norte, etc.) | Sectores económicos (Comercial, Industrial, etc.) |
| **Ubicaciones** | — | Comunas de cobertura (Las Condes, Santiago Centro, etc.) |

---

## Arquitectura Implementada

### Stack Tecnológico

- **Frontend Admin:** React 19 via CDN, Tailwind CSS via CDN
- **Backend:** Cloudflare Worker (guardman-admin-panel)
- **Base de Datos:** Cloudflare D1 (guardman-seo)
- **Storage:** Cloudflare R2 (guardman-images)

### Tablas D1

```
├── services              - 9 servicios base
├── locations             - 14 ubicaciones (comunas)
├── sectors               - 7 sectores económicos
├── service_sectors       - 39 relaciones servicio×sector
├── images                 - Galería de imágenes
├── keywords              - SEO keywords
├── serper_queries        - Queries a Serper API
└── serper_results         - Resultados de búsqueda
```

---

## Funcionalidades Implementadas

### Admin Panel

| Sección | CRUD | Funcionalidades |
|---------|------|-----------------|
| **Dashboard** | — | Stats generales, estado del sistema |
| **Servicios** | ✅ | Crear, editar, eliminar, estados |
| **Ubicaciones** | ✅ | CRUD con coordenadas lat/lng |
| **Sectores** | ✅ | CRUD sectores económicos |
| **Servicio×Sector** | ✅ | Matriz visual de relaciones |
| **Imágenes** | ✅ Read + Upload | Galería, drag & drop a R2 |

### Página `/servicios`

- Filtro por sector económico
- Badges de sectores en cada card
- Links a sectores aplicados

### Página `/servicios/[slug]`

- Badges de sectores en hero
- Sidebar con sectores atendidos
- Lista de servicios relacionados

### Página `/sectores`

- Lista de sectores económicos
- Cards con servicios del sector
- Páginas individuales por sector

---

## API Endpoints

```
# Auth
POST /api/login              - Login

# Services
GET    /api/services        - Listar servicios
POST   /api/services        - Crear servicio
GET    /api/services/:slug  - Obtener servicio
PUT    /api/services/:slug  - Actualizar servicio
DELETE /api/services/:slug  - Eliminar servicio

# Locations
GET    /api/locations       - Listar ubicaciones
POST   /api/locations       - Crear ubicación
GET    /api/locations/:slug - Obtener ubicación
PUT    /api/locations/:slug  - Actualizar ubicación
DELETE /api/locations/:slug  - Eliminar ubicación

# Sectors
GET    /api/sectors         - Listar sectores
POST   /api/sectors         - Crear sector
GET    /api/sectors/:slug   - Obtener sector
PUT    /api/sectors/:slug   - Actualizar sector
DELETE /api/sectors/:slug   - Eliminar sector

# Service-Sector Relations
GET    /api/service-sector          - Listar relaciones
POST   /api/service-sector          - Crear relación
DELETE /api/service-sector          - Eliminar relación

# Images
GET    /api/images          - Listar imágenes
POST   /api/upload          - Subir imagen a R2

# R2 Images
GET /r2/*                   - Servir imágenes desde R2
```

---

## Scripts de Exportación

```bash
npm run export:all      # Exporta todos los datos D1 → JSON
npm run export:sectors  # Solo sectores económicos
```

Flujo de trabajo:
```
Admin Panel → D1 → Scripts export → JSON → Astro build → Sitio público
```

---

## Credenciales

- **Email:** admin@guardman.cl
- **Password:** GuardMan2026!@#Admin

---

## Archivos Modificados

### Admin Panel (`guardman-admin/`)

- `src/host.ts` - Worker con HTML embebido + React SPA

### Sitio Público (`guardman-site/`)

- `src/pages/servicios/index.astro` - Filtro por sector
- `src/pages/servicios/[slug].astro` - Badges de sectores
- `src/pages/sectores/[slug].astro` - Servicios del sector
- `scripts/export-all.mjs` - Exportar todos los datos
- `scripts/export-sectors.mjs` - Exportar sectores
- `package.json` - Scripts de exportación

---

## Próximos Pasos Sugeridos

1. **Edición de secciones CMS** - Editar contenido desde Admin Panel
2. **Preview en tiempo real** - Ver cambios antes de guardar
3. **Logs de actividad** - Quién editó qué y cuándo
4. **Gestión de usuarios** - Roles y permisos
5. **Integración con mapa** - Visualizar ubicaciones en mapa

---

## Comandos Útiles

```bash
# Deploy Admin Panel
cd guardman-admin && wrangler deploy

# Exportar datos
cd guardman-site && npm run export:all

# Build sitio
cd guardman-site && npm run build

# Deploy Worker principal
cd guardman-site && npm run worker:deploy

# Query D1 remoto
wrangler d1 execute guardman-seo --remote --command="SELECT * FROM services"
```

---

**Fecha:** 14 Abril 2026
