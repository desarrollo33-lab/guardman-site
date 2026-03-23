# GuardMan Chile - Sitio Web

Sitio web estatico para GuardMan Chile - empresa de seguridad privada en Santiago.

## Stack

- **Framework:** Astro 5 (static site)
- **Styling:** Tailwind CSS v4
- **CMS:** Directus (opcional, los datos staticos estan en `src/data/`)
- **Deploy:** Cloudflare Pages

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para produccion
npm run build

# Preview del build
npm run preview
```

## Sincronizar desde Directus (opcional)

```bash
# Login al admin de Directus y obtener un static token
# Luego ejecutar:

DIRECTUS_TOKEN=tu-token npm run sync
```

## Estructura del Proyecto

```
guardman-site/
├── src/
│   ├── components/     # Componentes Astro/React
│   ├── data/           # Datos staticos (services.ts, locations.ts)
│   ├── layouts/        # Layouts base
│   ├── pages/          # Páginas Astro
│   │   ├── servicios/  # Detalle de servicios
│   │   ├── ubicaciones/# Detalle de ubicaciones
│   │   ├── contacto.astro
│   │   ├── cotizacion.astro
│   │   ├── nosotros.astro
│   │   └── ...
│   └── styles/         # Tailwind + custom CSS
├── public/             # Assets publicos
├── scripts/            # Scripts de build/sync
└── dist/               # Build output
```

## Páginas

| Ruta | Descripcion |
|------|-------------|
| `/` | Homepage |
| `/servicios` | Lista de servicios |
| `/servicios/[slug]` | Detalle de servicio |
| `/ubicaciones` | Lista de ubicaciones |
| `/ubicaciones/[slug]` | Detalle de ubicacion |
| `/nosotros` | Sobre nosotros |
| `/contacto` | Formulario de contacto |
| `/cotizacion` | Solicitud de cotizacion |
| `/privacidad` | Politica de privacidad |
| `/terminos` | Terminos de servicio |
| `/404` | Pagina no encontrada |

## Deployment a Cloudflare Pages

1. Fork o clone este repositorio en GitHub
2. Ir a [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Pages → Create a project → Connect to Git
4. Configurar:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click Deploy

## Directus CMS (opcional)

El sitio funciona con datos staticos en `src/data/`. Si quieres usar Directus:

1. Configurar Directus en `http://64.176.16.231:8055`
2. Crear un Static Token en Directus Admin
3. Ejecutar `npm run sync` para baixar los datos
4. Los datos se guardaran como JSON en `src/data/`

## Colecciones Directus esperadas

- `services` - 8 servicios de seguridad
- `locations` - 14 comunas
- `testimonials` - Testimonios de clientes
- `site_config` - Configuracion del sitio

## Contacto

- **Sitio actual:** https://guardman.cl
- **Admin Directus:** http://64.176.16.231:8055/admin
