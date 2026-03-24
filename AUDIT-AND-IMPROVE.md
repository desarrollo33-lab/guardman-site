# Code Assistant: Auditoría y Mejora de guardman-site

## Tu Tarea

Eres el code assistant trabajando en el proyecto `guardman-site`. Tu trabajo es:

1. **Investigar** el repositorio de documentación `guardman-seo-template`
2. **Auditar** el estado actual de guardman-site contra los estándares
3. **Implementar** las mejoras priorizadas sin romper nada existente

---

## Paso 1: Investiga el Template

**Repo de documentación:** https://github.com/desarrollo33-lab/guardman-seo-template

**Archivos obligatorios a leer:**

1. `TEMPLATE-STANDARDS.md` - Reglas de construcción
2. `IMPROVEMENTS.md` - Plan de mejoras priorizadas
3. `INVESTIGATION-REPORT.md` - Estado del proyecto

**Puedes clonar o acceder via GitHub API:**

```bash
# Clonar el repo de documentación
git clone https://github.com/desarrollo33-lab/guardman-seo-template.git ../guardman-seo-template
```

---

## Paso 2: Auditoría del Estado Actual

Basándote en `TEMPLATE-STANDARDS.md`, audita cada archivo del proyecto actual:

### Auditoría de SEO

Verifica en cada página:

- [ ] ¿H1 único con keyword?
- [ ] ¿Meta title único (max 60 chars)?
- [ ] ¿Meta description única (max 160 chars)?
- [ ] ¿Canonical tag?
- [ ] ¿Open Graph tags?
- [ ] ¿Schema markup apropiado?

### Auditoría de Imágenes

- [ ] ¿Todas las imágenes en WebP?
- [ ] ¿Alt text en todas?
- [ ] ¿Width/height declarados?
- [ ] ¿Lazy loading donde corresponde?

### Auditoría de Componentes

- [ ] ¿Buttons siguen los estándares?
- [ ] ¿Cards tienen la estructura correcta?
- [ ] ¿Hero sections están bien?

### Auditoría de Contenido

- [ ] ¿Diferenciación de ubicaciones (50%+ único)?
- [ ] ¿FAQs con Schema?
- [ ] ¿Links internos (min 3 por página)?

---

## Paso 3: Reporte de Auditoría

Genera un reporte con este formato:

```markdown
# Auditoría: guardman-site

## Estado: ✅ CUMPLE / ⚠️ PARCIAL / ❌ FALTA

### SEO
| Página | H1 | Meta Title | Meta Desc | Schema | Status |
|--------|-----|------------|-----------|--------|--------|
| Homepage | ✅ | ✅ | ✅ | ⚠️ | OK |
| /servicios | ❌ | ✅ | ⚠️ | ❌ | REVISAR |

### Imágenes
| Componente | WebP | Alt | Size | Lazy | Status |
|------------|-------|-----|------|------|--------|
| HeroHome | ❌ | ✅ | ✅ | ❌ | REVISAR |

## Issues Prioritarios
1. [issue más crítico]
2. [issue]
3. [issue]
```

---

## Paso 4: Implementación de Mejoras

### Orden de Prioridad (basado en IMPROVEMENTS.md)

#### 🔴 CRÍTICAS - Semana 1

**C1: Completar Schema Markup**
- Crear `src/components/seo/SchemaService.astro`
- Crear `src/components/seo/SchemaLocalBusiness.astro`
- Crear `src/components/seo/SchemaFAQ.astro`
- Integrar en las páginas correspondientes

**C2: Optimizar Imágenes**
- Convertir a WebP
- Agregar lazy loading
- Agregar width/height

**C3: Meta Tags Dinámicos**
- Revisar cada página tiene title/description únicos
- Agregar canonical tags

#### 🟠 IMPORTANTES - Semana 2

**I1: Diferenciar Contenido de Ubicaciones**
- Crear contenido único para cada comuna
- Mínimo 50% diferente entre páginas

**I2: Completar Combo Pages**
- Revisar que todas las combinaciones servicio×ubicación tengan página
- Generar las faltantes

---

## Paso 5: Reglas Durante Implementación

### ⚠️ REGLAS CRÍTICAS

1. **NUNCA romper lo existente**
   - Haz backup mental de lo que funciona
   - Testea cada cambio con `npm run dev`
   - Si algo se rompe, revert immediately

2. **Antes de modificar cualquier archivo**
   - Lee el archivo completo
   - Entiende su propósito
   - Verifica contra TEMPLATE-STANDARDS.md

3. **Después de cada mejora**
   - Ejecuta `npm run build`
   - Verifica que no hay errores
   - Ejecuta `npm run preview`
   - Revisa en navegador

4. **Commits atómicos**
   - Un cambio por commit
   - Mensaje claro: `fix: corregir meta title en pagina de servicios`
   - Nunca: `fixes varios` o `mejoras`

### 📋 Formato de Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, linting
refactor: reestructuración sin cambio de behavior
perf: mejora de performance
test: agregar tests
chore: mantenimiento
```

---

## Paso 6: Checklist de Cada Cambio

Antes de marcar como "completado", verifica:

- [ ] `npm run build` pasa sin errores
- [ ] No hay warnings de TypeScript
- [ ] Page loads sin errores en consola
- [ ] Mobile responsive
- [ ] Cumple con TEMPLATE-STANDARDS.md

---

## Paso 7: Flujo de Trabajo

```
┌─────────────────────────────────────────────────────────────┐
│ 1. READ TEMPLATE                                         │
│ Leer TEMPLATE-STANDARDS.md del repo de documentación     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. AUDIT CURRENT STATE                                   │
│ Comparar guardman-site vs estándares                      │
│ Generar reporte de auditoría                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. PRIORITIZE                                           │
│ Seguir orden en IMPROVEMENTS.md                          │
│ C1, C2, C3 primero (CRÍTICAS)                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. IMPLEMENT (uno por uno)                              │
│ • Hacer cambio                                           │
│ • Testear con npm run build && npm run preview           │
│ • Commit con mensaje claro                              │
│ • Verificar que nada se rompió                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. REPEAT                                               │
│ Siguiente mejora → Volver a paso 4                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Archivos Clave del Template

### SEO Components (crear si no existen)
```
src/components/seo/
├── SEOHead.astro          # Ya existe, auditar
├── SchemaOrganization.astro  # Ya existe, auditar
├── SchemaService.astro   # CREAR
├── SchemaLocalBusiness.astro # CREAR
└── SchemaFAQ.astro       # CREAR
```

### Pages a Auditar
```
src/pages/
├── index.astro           # Homepage
├── nosotros.astro       # About
├── contacto.astro       # Contacto
├── cotizacion.astro     # Quote
├── servicios/
│   ├── index.astro
│   └── [slug].astro     # Service pages
├── ubicaciones/
│   ├── index.astro
│   └── [slug].astro     # Location pages
└── sectores/
    ├── index.astro
    └── [slug].astro     # Sector pages
```

### Data Files
```
src/data/
├── generated/           # JSON del CMS (no editar a mano)
├── directus.ts         # Tipos y API
├── brand-dna.ts        # Brand DNA
├── services.ts         # Servicios (fallback)
└── locations.ts        # Ubicaciones (fallback)
```

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar dev server
npm run build        # Build para producción
npm run preview      # Preview del build
npm run sync         # Sync datos desde Directus

# Linting (si existe)
npm run lint
npm run lint:fix

# Type check
npx tsc --noEmit
```

---

## Si Tienes Dudas

1. Revisa `TEMPLATE-STANDARDS.md` - 90% de dudas están respondidas ahí
2. Revisa `IMPROVEMENTS.md` - el orden de prioridades está ahí
3. Si no está claro, pregunta antes de actuar

---

## Output Esperado

Al terminar tu sesión, proporciona:

1. **Reporte de auditoría** - Estado actual vs estándares
2. **Mejoras implementadas** - Lista de cambios hechos
3. **Issues encontrados** - Problemas que no pudiste resolver
4. **Próximos pasos** - Qué hacer en la siguiente sesión

---

## Empezar

```bash
# 1. Ve al directorio del proyecto
cd "C:\Users\56930\OneDrive\Escritorio\guardman-site"

# 2. Clona el repo de documentación (si no lo tienes)
git clone https://github.com/desarrollo33-lab/guardman-seo-template.git ../guardman-seo-template

# 3. Lee los archivos clave
# - ../guardman-seo-template/TEMPLATE-STANDARDS.md
# - ../guardman-seo-template/IMPROVEMENTS.md
# - ../guardman-seo-template/INVESTIGATION-REPORT.md

# 4. Comienza la auditoría
```

¡Empieza!
