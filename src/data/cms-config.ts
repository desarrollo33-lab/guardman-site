/**
 * GuardMan Chile - Centralized CMS Design Config
 * Single source of truth for colors, labels, and structured data
 * used across all detail pages and hub pages.
 */

// ──────────────────────────────────────────────
// SECTOR COLORS
// ──────────────────────────────────────────────
export const SECTOR_COLORS: Record<string, { bg: string; text: string; border: string; tag: string }> = {
  'comercial':    { bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-200',    tag: 'bg-sky-100 text-sky-700 border-sky-200' },
  'industrial':   { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  tag: 'bg-amber-100 text-amber-700 border-amber-200' },
  'residencial':  { bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',tag: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'salud':        { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200',   tag: 'bg-rose-100 text-rose-700 border-rose-200' },
  'educacion':    { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', tag: 'bg-violet-100 text-violet-700 border-violet-200' },
  'eventos':      { bg: 'bg-fuchsia-50',text: 'text-fuchsia-700',border: 'border-fuchsia-200',tag: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200' },
  'construccion': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', tag: 'bg-orange-100 text-orange-700 border-orange-200' },
  'automotriz':   { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200',   tag: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  'hoteleria':    { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', tag: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
};

export const DEFAULT_SECTOR_TAG = 'bg-neutral-100 text-neutral-600 border-neutral-200';

// ──────────────────────────────────────────────
// ZONE COLORS
// ──────────────────────────────────────────────
export const ZONE_COLORS: Record<string, { bg: string; text: string; border: string; tag: string }> = {
  'Oriente': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', tag: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'Centro':  { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',     tag: 'bg-sky-100 text-sky-700 border-sky-200' },
  'Norte':   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   tag: 'bg-amber-100 text-amber-700 border-amber-200' },
  'Sur':     { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    tag: 'bg-rose-100 text-rose-700 border-rose-200' },
};

export const DEFAULT_ZONE_TAG = 'bg-neutral-100 text-neutral-600 border-neutral-200';

// ──────────────────────────────────────────────
// HERO TAG STYLE (for pills shown on dark hero background)
// ──────────────────────────────────────────────
export const HERO_TAG = 'text-sm px-3 py-1 rounded-full border bg-white/15 text-white border-white/25 hover:bg-white/25 transition-colors';
export const HERO_TAG_STATIC = 'text-sm px-3 py-1 rounded-full border bg-white/15 text-white border-white/25';

// ──────────────────────────────────────────────
// SECTION BACKGROUND PATTERN (alternating)
// ──────────────────────────────────────────────
export const SECTION_BG = {
  white:    'bg-white',
  light:    'bg-neutral-50',
  primary:  'bg-primary-600 text-white',
  dark:     'bg-primary-700 text-white rounded-xl',
  warning:  'bg-amber-50 border border-amber-200',
  info:     'bg-primary-50 border border-primary-200',
} as const;

// ──────────────────────────────────────────────
// CARD STYLE
// ──────────────────────────────────────────────
export const CARD_LINK = 'bg-neutral-50 hover:bg-primary-50 border border-neutral-200 hover:border-primary-300 rounded-lg p-4 transition-all group';
export const CARD_GRID_ITEM = 'bg-neutral-50 hover:bg-primary-50 border border-neutral-200 hover:border-primary-300 rounded-lg p-3 text-center text-sm text-neutral-700 hover:text-primary-700 transition-all font-medium';

// ──────────────────────────────────────────────
// SECTOR CONTEXT (intro text by sector)
// ──────────────────────────────────────────────
export const SECTOR_INTROS: Record<string, string> = {
  'comercial': 'El sector comercial exige soluciones de seguridad adaptadas a horarios extendidos, alto flujo de público y protección de mercadería. Diseñamos estrategias de vigilancia que combinan guardias presenciales, circuitos cerrados de televisión y control de accesos para tiendas, malls, oficinas y centros de distribución.',
  'industrial': 'Instalaciones industriales como fábricas, bodegas y centros logísticos enfrentan riesgos de robo, intrusión y accidentes. Nuestros protocolos de seguridad industrial incluyen vigilancia perimetral 24/7, control vehicular, inspecciones programadas y coordinación con Carabineros.',
  'residencial': 'Condominios, edificios y barrios residenciales requieren un enfoque de seguridad cercano y preventivo. Desplegamos guardias de portería, patrullas, control de accesos con tecnología biométrica y monitoreo de cámaras para garantizar la tranquilidad de las familias.',
  'salud': 'Clínicas, hospitales y centros médicos tienen necesidades especiales de seguridad: control de accesos en áreas restringidas, protección del personal médico, manejo de situaciones de crisis y custodia de insumos médicos. Nuestro personal está entrenado para operar en entornos de salud.',
  'educacion': 'Colegios, universidades e institutos necesitan seguridad que proteja a estudiantes, docentes y personal administrativo sin interrumpir la actividad académica. Implementamos protocolos de control de accesos, vigilancia perimetral y planes de emergencia escolar.',
  'eventos': 'Conciertos, ferias, convenciones y eventos corporativos requieren planeación logística de seguridad, gestión de accesos, control de aforo y protección VIP. Nuestro equipo especializado diseña planes de seguridad a medida para cada tipo de evento.',
  'construccion': 'Obras en construcción son vulnerables al robo de materiales, maquinaria y equipos. Protegemos el perímetro con vigilancia nocturna, nuestro sistema autónomo Guard Pod, control de ingreso de contratistas y monitoreo remoto las 24 horas.',
  'automotriz': 'Concesionarios, talleres y estacionamientos manejan activos de alto valor. Protegemos vehículos en exhibición, controlamos accesos de clientes y personal, y monitoreamos instalaciones con CCTV de alta resolución.',
  'hoteleria': 'Hoteles, hostales y residenciales necesitan seguridad discreta que proteja huéspedes y personal sin afectar la experiencia de hospitalidad. Implementamos vigilancia en zonas comunes, control de accesos por piso y protocolos de emergencia.',
};

// ──────────────────────────────────────────────
// ZONE CONTEXT (intro text by zone)
// ──────────────────────────────────────────────
export const ZONE_CONTEXT: Record<string, { focus: string; commonNeeds: string; intro: string }> = {
  'Oriente': {
    focus: 'residencias de lujo, embajadas y oficinas corporativas',
    commonNeeds: 'control de accesos residencial, escoltas VIP y monitoreo perimetral',
    intro: ' es una comuna de la zona Oriente de Santiago, caracterizada por residencias de alto nivel, centros corporativos y sedes diplomáticas. En GuardMan Chile protegemos más de 200 propiedades en esta zona con guardias certificados OS-10, tecnología de vigilancia avanzada y un centro de monitoreo propio operativo las 24 horas.',
  },
  'Centro': {
    focus: 'comercios, oficinas públicas y hoteles',
    commonNeeds: 'control de flujos de personas, seguridad para eventos y CCTV comercial',
    intro: ' se ubica en el corazón de Santiago, con alta actividad comercial, oficinas gubernamentales y hotelería. Nuestro equipo de seguridad cuenta con experiencia protegiendo negocios y edificios corporativos en esta zona, con protocolos adaptados al flujo constante de visitantes y trabajadores.',
  },
  'Norte': {
    focus: 'industrias, bodegas y centros logísticos',
    commonNeeds: 'vigilancia perimetral, control vehicular y seguridad industrial',
    intro: ' en la zona Norte de Santiago concentra actividad industrial, logística y bodegas. GuardMan Chile protege activos industriales en esta zona con vigilancia perimetral, control de accesos vehicular y guardias especializados en seguridad industrial certificados OS-10.',
  },
  'Sur': {
    focus: 'residencial y comercial',
    commonNeeds: 'seguridad general para hogares y negocios',
    intro: ' es una comuna en crecimiento de la zona Sur de Santiago, con una mezcla de barrios residenciales y zonas comerciales. En GuardMan Chile brindamos seguridad integral para hogares, condominios y negocios con guardias certificados, monitoreo 24/7 y respuesta inmediata.',
  },
};

// ──────────────────────────────────────────────
// SERVICE INTROS (fallback when CMS has no intro)
// ──────────────────────────────────────────────
export const SERVICE_INTROS: Record<string, string> = {
  'guardias-de-seguridad': 'Los guardias de seguridad son la base de cualquier estrategia de protección efectiva. En GuardMan Chile contamos con personal certificado OS-10 por Carabineros de Chile, con verificación de antecedentes y entrenamiento continuo. Nuestros guardias operan en turnos 24/7 cubriendo oficinas, industrias, residencias y eventos en toda la Región Metropolitana.',
  'cctv-videovigilancia': 'La videovigilancia moderna va mucho más allá de instalar cámaras. Diseñamos sistemas CCTV con cámaras IP de alta resolución, almacenamiento en la nube, acceso remoto desde tu smartphone y monitoreo desde nuestro centro de control. Cada instalación incluye un análisis previo de vulnerabilidades para maximizar la cobertura.',
  'control-de-accesos': 'El control de accesos es la primera línea de defensa para cualquier propiedad. Implementamos sistemas biométricos, tarjetas RFID, torniquetes y portones automáticos con registro completo de ingresos y egresos. Integración total con CCTV y monitoreo centralizado.',
  'escoltas-privados': 'Nuestros escoltas privados son profesionales con formación en protección ejecutiva, evaluación de riesgos y conducción evasiva. Diseñamos rutas seguras, acompañamos traslados de alto valor y brindamos protección personalizada a ejecutivos, diplomáticos y familias.',
  'monitoreo-24-7': 'El monitoreo permanente es lo que transforma un sistema de seguridad pasivo en uno proactivo. Nuestro centro de control opera 24 horas, 365 días al año, con operadores certificados que verifican alarmas en tiempo real y coordinan la respuesta con Carabineros y equipos de guardias.',
  'seguridad-eventos': 'Cada evento tiene su propia huella de seguridad. Analizamos el recinto, estimamos el aforo, diseñamos rutas de evacuación y desplegamos guardias especializados en control de masas, protección VIP y manejo de crisis. Desde conciertos hasta convenciones corporativas.',
  'seguridad-industrial': 'Las instalaciones industriales requieren protocolos de seguridad específicos: vigilancia perimetral nocturna, control de vehículos pesados, protección de mercadería y coordinación con seguros. Nuestros guardias industriales reciben entrenamiento especializado en seguridad de fábricas y bodegas.',
  'auditoria-seguridad': 'Una auditoría profesional es el primer paso para invertir en seguridad de forma inteligente. Nuestros expertos visitan tu propiedad, identifican vulnerabilidades y entregan un informe detallado con recomendaciones priorizadas por nivel de riesgo. Servicio gratuito y sin compromiso.',
  'guard-pod': 'Guard Pod es nuestra unidad de vigilancia autónoma, diseñada y fabricada en Chile tras 15 meses de investigación y desarrollo. Funciona con energía solar, cámaras PTZ 360° con visión nocturna, conectividad 4G y se despliega en menos de 2 horas en cualquier ubicación sin infraestructura eléctrica.',
};

// ──────────────────────────────────────────────
// SERVICE RELATIONS (semantic related + upsell)
// ──────────────────────────────────────────────
export const SERVICE_RELATED: Record<string, string[]> = {
  'guardias-de-seguridad': ['monitoreo-24-7', 'control-de-accesos', 'auditoria-seguridad'],
  'cctv-videovigilancia': ['monitoreo-24-7', 'control-de-accesos', 'guard-pod'],
  'control-de-accesos': ['guardias-de-seguridad', 'cctv-videovigilancia', 'monitoreo-24-7'],
  'escoltas-privados': ['seguridad-eventos', 'guardias-de-seguridad', 'auditoria-seguridad'],
  'monitoreo-24-7': ['cctv-videovigilancia', 'guardias-de-seguridad', 'guard-pod'],
  'seguridad-eventos': ['escoltas-privados', 'guardias-de-seguridad', 'control-de-accesos'],
  'seguridad-industrial': ['guardias-de-seguridad', 'cctv-videovigilancia', 'auditoria-seguridad'],
  'auditoria-seguridad': ['guardias-de-seguridad', 'cctv-videovigilancia', 'control-de-accesos'],
  'guard-pod': ['cctv-videovigilancia', 'monitoreo-24-7', 'seguridad-industrial'],
};

export const SERVICE_UPSELL: Record<string, string[]> = {
  'guardias-de-seguridad': ['monitoreo-24-7', 'cctv-videovigilancia'],
  'cctv-videovigilancia': ['monitoreo-24-7', 'guard-pod'],
  'control-de-accesos': ['cctv-videovigilancia', 'guardias-de-seguridad'],
  'escoltas-privados': ['seguridad-eventos', 'auditoria-seguridad'],
  'monitoreo-24-7': ['guard-pod', 'cctv-videovigilancia'],
  'seguridad-eventos': ['escoltas-privados', 'control-de-accesos'],
  'seguridad-industrial': ['guard-pod', 'auditoria-seguridad'],
  'auditoria-seguridad': ['guardias-de-seguridad', 'control-de-accesos'],
  'guard-pod': ['monitoreo-24-7', 'seguridad-industrial'],
};

// ──────────────────────────────────────────────
// SERVICE IMAGES
// ──────────────────────────────────────────────
export const SERVICE_IMAGES: Record<string, string> = {
  'guardias-de-seguridad': 'service-guardias-de-seguridad.webp',
  'cctv-videovigilancia': 'service-cctv-videovigilancia.webp',
  'control-de-accesos': 'service-control-de-accesos.webp',
  'escoltas-privados': 'service-escoltas-privados.webp',
  'monitoreo-24-7': 'service-monitoreo-24-7.webp',
  'seguridad-eventos': 'service-seguridad-eventos.webp',
  'seguridad-industrial': 'service-seguridad-industrial.webp',
  'auditoria-seguridad': 'service-auditoria-seguridad.webp',
  'guard-pod': 's4-thumbnail.webp',
};

export const SECTOR_IMAGES: Record<string, string> = {
  'comercial': 's4-thumbnail.webp',
  'industrial': 'sector-industrial.webp',
  'residencial': 'sector-residencial.webp',
  'salud': 'nosotros_seccion.webp',
  'educacion': 'hero-home.webp',
  'eventos': 's4-thumbnail.webp',
  'construccion': 'sector-industrial.webp',
  'automotriz': 's4-thumbnail.webp',
  'hoteleria': 'hero-home.webp',
};

// ──────────────────────────────────────────────
// LOCATION ISSUES (fallback when CMS has no issues)
// ──────────────────────────────────────────────
export const LOCATION_ISSUES: Record<string, string[]> = {
  'Oriente': [
    'Ingresos no autorizados a condominios y edificios corporativos',
    'Falta de control de visitas en portones y accesos vehiculares',
    'Robo de vehículos y pertrechos en estacionamientos subterráneos',
    'Vulnerabilidad en horarios nocturnos en residencias desocupadas',
  ],
  'Centro': [
    'Alto flujo de personas sin control en accesos principales',
    'Robos y hurtos en locales comerciales y oficinas',
    'Falta de vigilancia en estacionamientos y pasillos',
    'Intrusión en edificios por accesos sin supervisión',
  ],
  'Norte': [
    'Robo de materiales y mercadería en bodegas y naves industriales',
    'Ingresos no autorizados por accesos perimetrales sin control',
    'Falta de vigilancia nocturna en patios y estacionamientos',
    'Vehículos sospechosos sin control de ingreso',
  ],
  'Sur': [
    'Delincuencia en zonas residenciales sin vigilancia',
    'Robo de especies en viviendas y negocios',
    'Accesos sin control en poblaciones y pasajes',
    'Falta de patrullaje preventivo en horarios nocturnos',
  ],
};

// ──────────────────────────────────────────────
// SECTOR ISSUES (fallback when CMS has no issues)
// ──────────────────────────────────────────────
export const SECTOR_ISSUES: Record<string, string[]> = {
  'comercial': [
    'Hurto en tiendas y locales comerciales por falta de vigilancia',
    'Accesos sin control en horarios de alta afluencia',
    'Falta de cámaras en zonas de almacenamiento y bodegas',
  ],
  'industrial': [
    'Robo de materiales y maquinaria en horarios nocturnos',
    'Ingresos no autorizados por perímetros extensos',
    'Falta de protocolos de emergencia y evacuación',
  ],
  'residencial': [
    'Ingresos de desconocidos a condominios y edificios',
    'Robo de vehículos y especies en estacionamientos',
    'Falta de patrullaje nocturno en pasajes y áreas comunes',
  ],
  'salud': [
    'Acceso no autorizado a áreas restringidas',
    'Agresiones al personal médico y de atención',
    'Robo de insumos y medicamentos de alto valor',
  ],
  'educacion': [
    'Ingresos de personas ajenas al establecimiento sin control',
    'Falta de protocolos de emergencia escolar',
    'Robo de equipos y materiales en horarios no lectivos',
  ],
  'eventos': [
    'Falta de control de aforo y aglomeraciones',
    'Accesos no supervisados en recintos masivos',
    'Emergencias sin protocolos de evacuación claros',
  ],
  'construccion': [
    'Robo de materiales y herramientas en horarios nocturnos',
    'Ingresos no autorizados por perímetros sin cerramiento',
    'Falta de vigilancia en obras paralizadas',
  ],
  'automotriz': [
    'Robo de vehículos en exhibición y estacionamientos',
    'Falsa de control de llaves y acceso a unidades',
    'Daños vandálicos sin cobertura de cámaras',
  ],
  'hoteleria': [
    'Ingresos de personas ajenas a zonas de huéspedes',
    'Robo de equipaje y objetos de valor en áreas comunes',
    'Falta de seguridad discreta en recepción y pasillos',
  ],
};

// ──────────────────────────────────────────────
// GUARD STAFF SECTION (replaces stats)
// ──────────────────────────────────────────────
export const STAFF_IMAGE = '/images/nosotros_seccion.webp';
export const STAFF_TRAITS = [
  'Certificación OS-10 vigente verificada por Carabineros de Chile',
  'Capacitación continua en protocolos de seguridad y emergencias',
  'Centro de monitoreo propio 24/7 con operadores especializados',
  '8+ años de experiencia protegiendo empresas y residencias',
];

// ──────────────────────────────────────────────
// HELPER: get sector tag class
// ──────────────────────────────────────────────
export function getSectorTag(slug: string): string {
  return SECTOR_COLORS[slug]?.tag || DEFAULT_SECTOR_TAG;
}

export function getZoneTag(zone: string): string {
  return ZONE_COLORS[zone]?.tag || DEFAULT_ZONE_TAG;
}
