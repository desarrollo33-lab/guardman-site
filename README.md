# GuardMan Chile - Sitio Web

Sitio web estático para GuardMan Chile - empresa de seguridad privada en Santiago.

## Stack

- **Framework:** Astro 5 (static site)
- **Styling:** Tailwind CSS v4
- **Data:** JSON estático en `src/data/generated/`
- **Deploy:** Cloudflare Pages
- **API:** Cloudflare Workers + D1 (opcional)

## Arquitectura 100% Cloudflare

```
┌─────────────────────────────────────────────────────────────┐
│                      Cloudflare                              │
├─────────────────────────────────────────────────────────────┤
│  Cloudflare Pages ──────► Static Site (dist/)               │
│       │                                                      │
│       └──► Cloudflare Workers + D1 (API opcional)           │
│                    (worker/)                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Local Development                        │
├─────────────────────────────────────────────────────────────┤
│  src/data/generated/*.json  ───►  Static Data               │
│       │                                                      │
│       └──► npm run validate  ───►  Data Validation           │
└─────────────────────────────────────────────────────────────┘
```

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Validar datos estáticos
npm run validate

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Estructura del Proyecto

```
guardman-site/
├── src/
│   ├── components/     # Componentes Astro/React
│   ├── data/           # Datos estáticos (JSON)
│   │   └── generated/  # *.json files
│   ├── layouts/        # Layouts base
│   ├── pages/          # Páginas Astro
│   │   ├── servicios/  # Detalle de servicios
│   │   ├── ubicaciones/# Detalle de ubicaciones
│   │   ├── sectores/   # Sectores
│   │   ├── blog/       # Blog
│   │   ├── contacto.astro
│   │   ├── cotizacion.astro
│   │   ├── nosotros.astro
│   │   └── ...
│   └── styles/         # Tailwind + custom CSS
├── worker/             # Cloudflare Worker (API opcional)
│   ├── index.ts         # Worker principal
│   └── sql/            # DDL para D1
├── public/              # Assets públicos
├── scripts/             # Scripts de validación
├── dist/                # Build output
└── wrangler.toml        # Configuración Worker
```

## Datos Estáticos

Todo el contenido del sitio está almacenado como archivos JSON en `src/data/generated/`:

| Archivo | Descripción |
|---------|-------------|
| `services.json` | 9 servicios de seguridad |
| `locations.json` | 14 comunas de cobertura |
| `sectors.json` | 6 sectores industriales |
| `clients.json` | Clientes destacados |
| `testimonials.json` | Testimonios |
| `blog.json` | Artículos del blog |
| `site-config.json` | Configuración general |

### Editar Contenido

Para actualizar el contenido, edita los archivos JSON directamente:

```bash
# Validar cambios
npm run validate
```

## Páginas

| Ruta | Descripcion |
|------|-------------|
| `/` | Homepage |
| `/servicios` | Lista de servicios |
| `/servicios/[slug]` | Detalle de servicio |
| `/servicios/[slug]/[location]` | Servicio + ubicación |
| `/ubicaciones` | Lista de ubicaciones |
| `/ubicaciones/[slug]` | Detalle de ubicacion |
| `/sectores` | Sectores industriales |
| `/sectores/[slug]` | Detalle de sector |
| `/blog` | Blog |
| `/blog/[slug]` | Artículo |
| `/nosotros` | Sobre nosotros |
| `/contacto` | Formulario de contacto |
| `/cotizacion` | Solicitud de cotización |
| `/privacidad` | Política de privacidad |
| `/terminos` | Términos de servicio |
| `/404` | Página no encontrada |

## Deployment a Cloudflare Pages

1. Fork o clone este repositorio en GitHub
2. Ir a [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Pages → Create a project → Connect to Git
4. Configurar:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click Deploy

## API Worker (Opcional)

El sitio funciona 100% estático sin necesidad del Worker.
El Worker (`worker/`) es opcional para:

- API REST con datos de D1
- Formularios dinámicos
- Integraciones externas

### Deploy Worker

```bash
npx wrangler deploy --config wrangler.toml
```

### Endpoints del Worker

- `GET /health` - Health check
- `POST /api/seed` - Poblar D1 con datos
- `GET /api/services` - Lista servicios
- `GET /api/locations` - Lista ubicaciones
- `GET /api/sectors` - Lista sectores
- `GET /api/config` - Configuración

## Contacto

- **Sitio:** https://guardman.cl
