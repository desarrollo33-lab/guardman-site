# 📋 PLAN DE CORRECCIÓN - GuardMan Site

> Documento de seguimiento para correcciones de SEO y cumplimiento del template.
> Estado: **✅ COMPLETADO** - Todas las correcciones implementadas.

---

## ✅ CORRECCIONES APLICADAS

### Prioridad 1: CRÍTICOS

| # | Corrección | Archivo | Estado |
|---|------------|---------|--------|
| 1 | Agregar campo `logo` en SchemaOrganization | `src/components/seo/SchemaOrganization.astro` | ✅ |
| 2 | Ratings dinámicos en site-config.json | `src/data/generated/site-config.json` | ✅ |
| 3 | Ratings dinámicos en SchemaOrganization | `src/components/seo/SchemaOrganization.astro` | ✅ |
| 4 | Props ratingValue/ratingCount en SchemaService | `src/components/seo/SchemaService.astro` | ✅ |
| 5 | Props ratingValue/ratingCount en SchemaLocalBusiness | `src/components/seo/SchemaLocalBusiness.astro` | ✅ |
| 6 | H1 con keyword principal en homepage | `src/pages/index.astro` | ✅ |
| 7 | Optimización de imagen hero con WebP | `src/pages/index.astro` | ✅ |

### Prioridad 2: MODERADOS

| # | Corrección | Archivo | Estado |
|---|------------|---------|--------|
| 8 | FAQs específicas para 9 servicios | `src/data/generated/services.json` | ✅ |
| 9 | Tipo Service actualizado con faqs | `src/data/directus.ts` | ✅ |
| 10 | Página de servicio usa FAQs del CMS | `src/pages/servicios/[slug].astro` | ✅ |
| 11 | Descripciones únicas para 14 ubicaciones | `src/data/generated/locations.json` | ✅ |
| 12 | FAQs específicas para 14 ubicaciones | `src/data/generated/locations.json` | ✅ |
| 13 | Campo why_this_zone por ubicación | `src/data/generated/locations.json` | ✅ |
| 14 | Stats locales por ubicación | `src/data/generated/locations.json` | ✅ |
| 15 | Landmarks por ubicación | `src/data/generated/locations.json` | ✅ |
| 16 | Tipo Location actualizado | `src/data/directus.ts` | ✅ |
| 17 | Página de ubicación usa FAQs del CMS | `src/pages/ubicaciones/[slug].astro` | ✅ |

### Pendiente (sin acción del equipo)

| # | Corrección | Estado | Motivo |
|---|------------|--------|--------|
| 18 | Archivo logo.png | ⏳ | Pendiente de recibir diseño |

---

## 📊 RESUMEN DE CAMBIOS

### Archivos Modificados (15)

```
src/
├── components/
│   └── seo/
│       ├── SchemaOrganization.astro  ← ratings dinámicos + logo field
│       ├── SchemaService.astro      ← props rating configurables
│       └── SchemaLocalBusiness.astro ← props rating configurables
├── data/
│   ├── directus.ts                  ← tipos Service/Location actualizados
│   └── generated/
│       ├── site-config.json         ← aggregate_rating_* fields
│       ├── services.json            ← 9 servicios con FAQs propias
│       └── locations.json           ← 14 ubicaciones con contenido único
└── pages/
    ├── index.astro                  ← H1 + hero image WebP
    ├── servicios/[slug].astro       ← usa FAQs del CMS
    └── ubicaciones/[slug].astro     ← usa FAQs y datos del CMS
```

### Archivos Nuevos/Creados (1)

```
CORRECTION-PLAN.md  ← este documento
```

---

## 📋 DETALLE DE CORRECCIONES

### 1. SchemaOrganization.astro

**Antes:**
```javascript
"aggregateRating": {
  "ratingValue": "4.8",  // hardcodeado
  "reviewCount": "127"
}
```

**Después:**
```javascript
ratingValue: config?.aggregate_rating_value || '4.8',
ratingCount: config?.aggregate_rating_count || '127',
// ...
"aggregateRating": {
  "ratingValue": siteConfig.ratingValue,  // dinámico
  "reviewCount": siteConfig.ratingCount
}
```

### 2. services.json - FAQs específicas

Cada servicio ahora tiene 5 FAQs únicas con contenido diferenciado:

| Servicio | Pregunta ejemplo |
|----------|------------------|
| Guardias | "¿Cuánto cuesta un guardia de seguridad?" |
| CCTV | "¿Cuántas cámaras necesito para mi negocio?" |
| Control Accesos | "¿Puedo controlar horarios específicos?" |
| Escoltas | "¿En qué situaciones se requiere escolta?" |
| Monitoreo | "¿Cuál es el tiempo de respuesta?" |
| Eventos | "¿Cuántos guardias necesito para mi evento?" |
| Industrial | "¿Cuál es el principal riesgo en industrias?" |
| Auditoría | "¿Qué incluye la auditoría gratuita?" |
| Guard Pod | "¿Dónde puede funcionar el Guard Pod?" |

### 3. locations.json - Contenido diferenciado

Cada ubicación ahora incluye:

- `description`: texto único de min 150 palabras
- `landmarks`: 4-5 lugares estratégicos
- `stats`: { empresas, guardias, experiencia }
- `why_this_zone`: razón única de cobertura
- `faqs`: 2-3 preguntas específicas

### 4. Homepage H1

**Antes:** "Protegemos lo que más te importa" (tagline genérica)

**Después:** "Seguridad Privada en Santiago, Chile" (keyword principal)

---

## 🚀 PRÓXIMOS PASOS

### Deploy

```bash
git add .
git commit -m "fix: correcciones SEO - ratings dinamicos, FAQs unicas por servicio/ubicacion"
git push
```

### Post-Deploy

1. ✅ Build verificado (165 páginas)
2. ⏳ Subir logo.png cuando esté disponible
3. ⏳ Actualizar campo logo_url en Directus cuando haya logo real
4. ⏳ Verificar en producción con Google Rich Results Test

---

## 📁 DOCUMENTACIÓN

| Archivo | Descripción |
|---------|-------------|
| `AUDIT-AND-IMPROVE.md` | Auditoría original |
| `CORRECTION-PLAN.md` | Estado de correcciones |

---

*Plan creado: 2026-03-25*
*Completado: 2026-03-25*
