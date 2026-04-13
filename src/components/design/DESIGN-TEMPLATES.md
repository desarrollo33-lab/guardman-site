# 📐 Sistema de Diseño - Plantillas por Nivel

Este documento define las plantillas estandarizadas para cada nivel de página del sitio GuardMan Chile.

---

## 🏗️ COMPONENTES DISPONIBLES

```
src/components/design/
├── PageHero.astro      → Hero de página
├── PageCTA.astro        → Llamada a la acción
├── ContentCard.astro    → Tarjetas de contenido
├── SidebarCTA.astro     → Sidebar de cotización
├── FAQList.astro        → Preguntas frecuentes
└── STATS.md             → Este archivo
```

---

## 📋 PLANTILLA NIVEL 0 - HOMEPAGE

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (siempre visible)                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [1] HERO SECTION                                           │
│  ├── Badge: "Grupo GuardMan Chile"                          │
│  ├── H1: "Seguridad Privada en Santiago, Chile"             │
│  ├── Subtitle: Descripción del servicio                     │
│  ├── Imagen hero (con overlay gradient)                     │
│  └── CTAs: [Escudo OS-10] + [Llamar ahora]                  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [2] NOSOTROS SECTION                                       │
│  ├── Fondo: neutral-900 (oscuro)                           │
│  ├── Título + descripción + imagen                          │
│  ├── Grid 2x2: Features (íconos)                            │
│  └── CTA: "Conoce más sobre nosotros"                       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [3] SERVICIOS SECTION                                      │
│  ├── Título: "Soluciones de seguridad..."                   │
│  ├── Grid 4 columnas: Cards de servicios                     │
│  └── CTA: "Ver todos los servicios"                         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [4] GUARD POD SECTION                                      │
│  ├── Fondo: gradient primary-700                            │
│  ├── Badge: "Tecnología Propia GuardMan"                   │
│  ├── Título + descripción + imagen                          │
│  ├── Grid 2x2: Features                                     │
│  └── CTA: "Conocer Guard Pod"                               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [5] SECTORES SECTION                                       │
│  ├── Título + descripción                                   │
│  ├── Grid 3 columnas: Cards de sectores                      │
│  └── CTA: "Ver todos los sectores"                          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [6] AJAX SYSTEMS SECTION                                   │
│  ├── Fondo: gradient primary-700                            │
│  ├── Badge: "Distribuidor Oficial Ajax Systems"              │
│  ├── Título + descripción + imagen                          │
│  └── CTA: "Conocer Ajax Systems"                           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [7] CLIENTES SECTION                                       │
│  ├── Título: "Empresas que confían en GuardMan"             │
│  ├── Grid logos de clientes (5 columnas)                    │
│  └── CTA: "Conoce más sobre nosotros"                       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [8] UBICACIONES SECTION                                    │
│  ├── Fondo: gradient primary-700                            │
│  ├── Título + mapa interactivo                              │
│  ├── Grid badges de comunas (7 columnas)                    │
│  └── CTA: "Ver todas las ubicaciones"                       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [9] CTA FINAL                                              │
│  ├── Título: "Protección profesional..."                     │
│  ├── Descripción                                            │
│  ├── [Solicitar Cotización] [Contactar]                      │
│  └── Escudo OS-10                                           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ FOOTER (siempre visible)                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 PLANTILLA NIVEL 1A - PÁGINAS ESTÁTICAS

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [1] HERO                                                   │
│  ├── Título H1                                              │
│  └── Subtitle                                               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [2] CONTENIDO PRINCIPAL                                    │
│  ├── Para /contacto: Info contacto + Formulario             │
│  ├── Para /cotizacion: Formulario de cotización             │
│  └── Para /nosotros: Historia + Valores + Stats            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [3] CTA (opcional)                                         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

**Estructura:
```
<PageHero 
  title="..." 
  subtitle="..."
  variant="default"
/>

<!-- Contenido específico por página -->

<PageCTA 
  title="..."
  description="..."
  variant="primary"
  showPhone={true}
/>
```
*/

---

## 📋 PLANTILLA NIVEL 1B - COLECCIONES

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [1] HERO                                                   │
│  ├── Título H1                                              │
│  └── Subtitle                                               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [2] FILTROS (si aplica)                                    │
│  ├── Para /blog: Por categoría                               │
│  └── Para /servicios: Ninguno                               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [3] GRID DE CARDS                                          │
│  ├── /servicios: Grid 3 columnas, cards de servicio          │
│  ├── /ubicaciones: Grid por zona (N/O/C/P/S/V)             │
│  ├── /sectores: Grid 3 columnas                             │
│  └── /blog: Featured + Grid por categoría                   │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [4] CTA                                                    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

**Componente:
```
<ContentCard 
  href="/servicios/..."
  title="..."
  description="..."
  image="..."
  variant="grid"
/>
```
*/

---

## 📋 PLANTILLA NIVEL 2 - DETALLES

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [1] BREADCRUMB                                             │
│  └── Inicio > [Colección] > [Item actual]                    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [2] HERO                                                   │
│  ├── Badge de zona (para ubicaciones)                       │
│  ├── H1: [Nombre del item]                                  │
│  └── Description (250 chars max)                            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [3] STATS BAR (solo ubicaciones)                           │
│  └── 3 columnas: Empresas | Guardias | Experiencia           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [4] CONTENIDO PRINCIPAL (Grid 3 columnas)                  │
│  │                                                           │
│  ├── Columna 1-2 (2/3):                                    │
│  │   ├── Servicios disponibles (grid)                      │
│  │   ├── Descripción completa (markdown)                   │
│  │   ├── Barrios/Sectores (tags)                           │
│  │   ├── Lugares estratégicos (list with icons)            │
│  │   └── FAQs                                              │
│  │                                                           │
│  └── Columna 3 (1/3):                                      │
│      └── SidebarCTA                                         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [5] CTA                                                    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

**Componentes:
```
<SidebarCTA 
  title="Cotizar en [Ubicación]"
  service="[Servicio]"
  location="[Ubicación]"
/>

<FAQList 
  faqs={faqs}
  title="Preguntas Frecuentes sobre seguridad en [Ubicación]"
/>
```
*/

---

## 📋 PLANTILLA NIVEL 3 - COMBO PAGES

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [1] BREADCRUMB                                             │
│  └── Inicio > Servicios > [Servicio] > [Ubicación]          │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [2] HERO                                                   │
│  ├── Badge zona                                             │
│  ├── H1: [Servicio] en [Ubicación]                         │
│  └── Description short                                      │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [3] CONTENIDO PRINCIPAL (Grid 3 columnas)                  │
│  │                                                           │
│  ├── Columna 1-2 (2/3):                                    │
│  │   ├── Introducción del servicio                         │
│  │   ├── Features (grid 2 columnas)                       │
│  │   ├── Contenido específico de ubicación                 │
│  │   ├── Proceso (4 pasos)                                 │
│  │   ├── Otros servicios en esta ubicación                 │
│  │   └── FAQs                                              │
│  │                                                           │
│  └── Columna 3 (1/3):                                      │
│      └── SidebarCTA                                         │
│      └── Ubicaciones cercanas                               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  [4] CTA                                                    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ FOOTER                                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 TOKENS DE DISEÑO

### Colores
```
Primary:       primary-50    → primary-900  (Navy Blue)
Neutral:      neutral-50    → neutral-900  (Cool Grays)
Success:      #10B981
Warning:      #F59E0B
Error:        #EF4444
```

### Tipografía
```
Font Family:  Inter (Google Fonts)
Heading:      font-bold
Body:         font-normal
```

### Espaciado
```
Section:      py-16 lg:py-24
Container:    container mx-auto px-4
Gap:          gap-6 (cards), gap-4 (elements)
```

### Bordes
```
Radius cards: rounded-xl
Radius buttons: rounded-lg
Radius tags: rounded-full
```

### Sombras
```
Hover cards: shadow-xl hover:shadow-lg
Sidebar:      sticky top-24
```

---

## 🔧 CÓMO USAR LOS COMPONENTES

### Importar componentes
```astro
---
import PageHero from '../components/design/PageHero.astro';
import PageCTA from '../components/design/PageCTA.astro';
import ContentCard from '../components/design/ContentCard.astro';
import SidebarCTA from '../components/design/SidebarCTA.astro';
import FAQList from '../components/design/FAQList.astro';
---
```

### Ejemplo: Página de ubicación (N2)
```astro
<BaseLayout title="..." description="...">
  <!-- Hero -->
  <PageHero 
    title={`Seguridad en ${location.name}`}
    subtitle={location.description}
    badge={location.zone}
  />
  
  <!-- Main Content -->
  <section class="py-16 lg:py-24 bg-white">
    <div class="container mx-auto px-4">
      <div class="grid lg:grid-cols-3 gap-12">
        <!-- Content -->
        <div class="lg:col-span-2">
          <h2>Servicios disponibles en {location.name}</h2>
          <!-- ... servicios grid -->
          
          <h2>Barrios y sectores</h2>
          <!-- ... tags -->
          
          <!-- FAQs -->
          <FAQList faqs={locationFAQs} />
        </div>
        
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <SidebarCTA location={location.name} />
        </div>
      </div>
    </div>
  </section>
  
  <!-- CTA -->
  <PageCTA 
    title={`Protege tu propiedad en ${location.name}`}
    variant="primary"
  />
</BaseLayout>
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

Para cada nueva página, verificar:

- [ ] ¿Usa PageHero con título y subtitle?
- [ ] ¿Tiene sidebar con SidebarCTA?
- [ ] ¿Tiene FAQList con 4-5 FAQs?
- [ ] ¿Tiene PageCTA al final?
- [ ] ¿Los colores usan tokens de Tailwind (primary-600, neutral-900)?
- [ ] ¿Las imágenes tienen alt text?
- [ ] ¿Los grids son responsive (mobile-first)?
- [ ] ¿Los CTAs usan clases semánticas?

---

*Última actualización: 2026-04-13*