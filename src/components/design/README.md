# Diseño - Normalización y Estandarización

## 📊 Resumen de Niveles

| Nivel | Tipo | Páginas | Ejemplo |
|-------|------|---------|---------|
| **N0** | Homepage | 1 | `/` |
| **N1A** | Estáticas | 6 | `/contacto`, `/cotizacion`, `/nosotros`, `/privacidad`, `/terminos`, `/404` |
| **N1B** | Colecciones | 4 | `/servicios`, `/ubicaciones`, `/sectores`, `/blog` |
| **N2** | Detalle | 45 | `/servicios/[slug]`, `/ubicaciones/[slug]`, `/sectores/[slug]`, `/blog/[slug]` |
| **N3** | Combo | 126 | `/servicios/[slug]/[location]` |

---

## 🧩 Componentes de Diseño

```
src/components/design/
├── PageHero.astro        → Hero estandarizado (N0, N1, N2)
├── PageCTA.astro         → Llamada a la acción (todas)
├── ContentCard.astro     → Tarjeta para grids (N1, N2)
├── SidebarCTA.astro      → Sidebar de cotización (N2, N3)
├── FAQList.astro          → Preguntas frecuentes (N2, N3)
└── DESIGN-TEMPLATES.md   → Plantillas completas
```

---

## 📋 Estructura por Nivel

### N0 - Homepage
- Hero completo con imagen + CTAs
- 8-9 secciones: Nosotros, Servicios, Guard Pod, Sectores, Ajax, Clientes, Ubicaciones, CTA
- NO tiene sidebar

### N1A - Páginas Estáticas
- Hero simple (título + subtitle)
- Contenido específico por página
- CTA al final

### N1B - Colecciones
- Hero simple
- Grid de ContentCards
- CTA al final

### N2 - Detalles
- Breadcrumb visual
- Hero con badge de zona
- Grid 2/3 + 1/3 (con SidebarCTA)
- FAQList
- CTA al final

### N3 - Combo
- Breadcrumb completo (4 niveles)
- Hero con título específico
- Grid 2/3 + 1/3 (SidebarCTA + ubicaciones cercanas)
- FAQList con contexto de zona
- CTA específico

---

## 🎨 Tokens de Diseño

### Colores
| Token | Valor | Uso |
|-------|-------|-----|
| `primary-600` | `#1A2744` | Principal (botones, links) |
| `primary-700` | `#152038` | Fondos oscuros |
| `neutral-900` | `#0D0D0D` | Textos headings |
| `neutral-600` | `#495057` | Textos secundarios |
| `success` | `#10B981` | Checks, confirmaciones |

### Espaciado
| Clase | Uso |
|-------|-----|
| `py-16 lg:py-24` | Secciones principales |
| `container mx-auto px-4` | Contenedor |
| `gap-6` | Entre cards |
| `gap-4` | Entre elementos |

### Componentes
| Tipo | Clases |
|------|--------|
| Card hover | `hover:shadow-xl hover:-translate-y-1 transition-all` |
| Botón primario | `bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold` |
| Botón secundario | `border-2 border-primary-600 text-primary-600` |
| Tag | `bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm` |

---

## ✅ Checklist de Calidad

Para cada página, verificar:

- [ ] Hero con `<PageHero>` o estructura equivalente
- [ ] Título H1 único con keyword
- [ ] Grid responsive (mobile → desktop)
- [ ] SidebarCTA en páginas N2 y N3
- [ ] FAQList con 4-5 FAQs contextualizadas
- [ ] PageCTA al final
- [ ] Breadcrumb en N2 y N3
- [ ] Alt text en todas las imágenes
- [ ] No hardcoded colors (usar tokens)
- [ ] Links internos relevantes (min 3)

---

## 🔄 Estado de Implementación

### ✅ Completado (N2 y N3)

| Página | Archivo | Estado |
|--------|---------|--------|
| Detalle Ubicaciones | `src/pages/ubicaciones/[slug].astro` | ✅ Normalizado |
| Detalle Servicios | `src/pages/servicios/[slug].astro` | ✅ Normalizado |
| Detalle Sectores | `src/pages/sectores/[slug].astro` | ✅ Normalizado |
| Combo Pages | `src/pages/servicios/[slug]/[location].astro` | ✅ Normalizado |

### ⏳ Pendiente

| Página | Archivo | Prioridad |
|--------|---------|-----------|
| Blog Posts | `src/pages/blog/[slug].astro` | Media |
| N1A Estáticas | contacto, cotizacion, nosotros | Baja |
| N1B Colecciones | servicios/index, ubicaciones/index | Media |
| Homepage | `src/pages/index.astro` | Alta |

---

## 🔄 Próximos Pasos

1. ✅ Crear componentes base (completado)
2. ✅ Normalizar N2 - Detalle Ubicaciones (completado)
3. ✅ Normalizar N2 - Detalle Servicios (completado)
4. ✅ Normalizar N2 - Detalle Sectores (completado)
5. ✅ Normalizar N3 - Combo Pages (completado)
6. ⏳ Normalizar Blog Posts (próximo)
7. ⏳ Normalizar Homepage (N0) - complejo, requiere cuidado
8. ⏳ Normalizar Colecciones (N1B)

---

*Documento actualizado: 2026-04-13*