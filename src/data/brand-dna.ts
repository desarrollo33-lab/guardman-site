/**
 * GuardMan Chile - Brand DNA
 * Centralized brand configuration for all GuardMan properties
 */

export const BrandDNA = {
  // ============================================
  // IDENTITY
  // ============================================
  identity: {
    companyName: 'GuardMan Chile',
    legalName: 'GuardMan Seguridad Privada SpA',
    brandSlug: 'guardman',
    rut: '76.123.456-7',
    tagline: 'Protegemos lo que mas te importa',
  },

  // ============================================
  // CONTACT
  // ============================================
  contact: {
    primaryPhone: '+56 2 2400 6000',
    whatsappNumber: '+56 9 3000 0010',
    supportEmail: 'info@guardman.cl',
    commercialEmail: 'ventas@guardman.cl',
  },

  // ============================================
  // LOCATION
  // ============================================
  location: {
    headquartersAddress: 'Av. Americo Vespucio Norte 1980, Providencia, Santiago, Chile',
    latitude: -33.4569,
    longitude: -70.6483,
  },

  // ============================================
  // SOCIAL
  // ============================================
  social: {
    website: 'https://guardman.cl',
    instagram: 'https://www.instagram.com/grupo_guardman',
    youtube: 'https://youtu.be/mqpLsKrwjAI',
  },

  // ============================================
  // BRAND VOICE
  // ============================================
  voice: {
    description: 'B2B, profesional, persuasivo, no alarmista, cercano pero formal.',
    characteristics: [
      'Profesional pero accesible',
      'Habla directamente a las preocupaciones de seguridad del cliente chileno',
      'Referencia conocimiento local (comunas santiaguinas, regulacion chilena)',
      'Confianza sin ser agresivo',
      'Serio y genuino, nunca vendedor',
    ],
    avoid: [
      'Lenguaje alarmista o catastrofista',
      'Promesas exageradas',
      'Comparaciones con competidores',
    ],
  },

  // ============================================
  // DIFFERENTIATORS
  // ============================================
  differentiators: [
    {
      id: 1,
      title: 'GuardPod V1',
      description: 'Unidad Autonoma de Vigilancia 24/7 - 15 meses de desarrollo propio',
      icon: 'shield-check',
      featured: true,
    },
    {
      id: 2,
      title: 'Supervision Nocturna Preventiva',
      description: 'Monitoreo proactivo de conductas sospechosas',
      icon: 'eye',
      featured: true,
    },
    {
      id: 3,
      title: 'Respuesta Inmediata Certificada',
      description: 'Tiempos de respuesta garantizados contractualmente',
      icon: 'clock',
      featured: true,
    },
    {
      id: 4,
      title: 'Personal Certificacion OS-10',
      description: 'Todos nuestros guardias cuentan con certificacion OS-10 vigente',
      icon: 'badge-check',
      featured: true,
    },
    {
      id: 5,
      title: 'Centro de Monitoreo Propio',
      description: 'Con redundancia y supervision 24/7',
      icon: 'monitor',
      featured: false,
    },
  ],

  // ============================================
  // CONTENT RULES
  // ============================================
  contentRules: [
    { rule: 'Siempre mencionar: Guardias con certificacion OS-10 vigente', priority: 'high' },
    { rule: 'Referenciar cumplimiento de Ley 21.659 de Seguridad Privada', priority: 'high' },
    { rule: 'Nunca usar lenguaje alarmista o catastrofista', priority: 'high' },
    { rule: 'Enfatizar prevencion y tranquilidad, no reaccion', priority: 'high' },
    { rule: 'Mencionar certificaciones y anos de experiencia', priority: 'medium' },
    { rule: 'Usar datos concretos y verificables', priority: 'medium' },
  ],

  // ============================================
  // STATS
  // ============================================
  stats: {
    guards: '500+',
    clients: '200+',
    locations: '14',
    years: '8+',
    responseTime: '15 min',
    monitoringCenter: '24/7',
  },

  // ============================================
  // BUSINESS HOURS
  // ============================================
  businessHours: [
    { day: 'Lunes', open: '00:00', close: '23:59', closed: false },
    { day: 'Martes', open: '00:00', close: '23:59', closed: false },
    { day: 'Miercoles', open: '00:00', close: '23:59', closed: false },
    { day: 'Jueves', open: '00:00', close: '23:59', closed: false },
    { day: 'Viernes', open: '00:00', close: '23:59', closed: false },
    { day: 'Sabado', open: '00:00', close: '23:59', closed: false },
    { day: 'Domingo', open: '00:00', close: '23:59', closed: false },
  ],

  // ============================================
  // CERTIFICATIONS
  // ============================================
  certifications: [
    {
      name: 'Autorizacion Laboral',
      description: 'Autorizacion de la Autoridad Administrativa Laboral (Chile) para servicios de seguridad privada',
    },
    {
      name: 'Seguro RC',
      description: 'Seguro de responsabilidad civil obligatorio',
    },
    {
      name: 'Certificacion OS-10',
      description: 'Personal con certificacion OS-10 vigente',
    },
    {
      name: 'Verificacion Antecedentes',
      description: 'Verificacion de antecedentes para todo el personal',
    },
    {
      name: 'Protocolos Carabineros',
      description: 'Protocolos de seguridad certificados por Carabineros de Chile',
    },
  ],

  // ============================================
  // SERVICE PURPOSE (for copy)
  // ============================================
  servicePurpose: {
    'guardias-de-seguridad': {
      pain: 'Accesos no controlados, robos en empresas, falta de supervision',
      solution: 'Guardias certificados y uniformados disponibles 24/7',
      benefit: 'Tranquilidad y prevencion de incidentes',
    },
    'cctv-videovigilancia': {
      pain: 'Camaras danadas, sin acceso remoto, grabacion deficiente',
      solution: 'Camaras IP de ultima generacion con monitoreo en la nube',
      benefit: 'Visualizacion remota y evidencia en caso de incidentes',
    },
    'guard-pod': {
      pain: 'Obras sin vigilancia, zonas sin electricidad, eventos temporales',
      solution: 'Unidad autonoma con energia solar, camaras PTZ y 4G',
      benefit: 'Vigilancia inmediata sin infraestructura',
    },
    'monitoreo-24-7': {
      pain: 'Alarmas sin respuesta, emergencias sin coordinacion',
      solution: 'Centro de control propio con operadores 24/7',
      benefit: 'Respuesta inmediata y coordinacion con autoridades',
    },
    'control-de-accesos': {
      pain: 'Llaves perdidas, accesos no autorizados, falta de control',
      solution: 'Sistemas biometricos y RFID con registro completo',
      benefit: 'Control total y registro de ingresos',
    },
    'escoltas-privados': {
      pain: 'Amenazas de seguridad, riesgo por exposicion',
      solution: 'Escoltas certificados con evaluacion de riesgo previa',
      benefit: 'Proteccion personalizada y tranquilidad total',
    },
    'seguridad-eventos': {
      pain: 'Control de invitados, gestion de masas, seguridad VIP',
      solution: 'Planificacion previa y personal especializado',
      benefit: 'Evento seguro y controlado',
    },
    'seguridad-industrial': {
      pain: 'Robos en bodegas, acceso no autorizado a obras',
      solution: 'Vigilancia perimetral y control de vehiculos',
      benefit: 'Proteccion de activos y prevencion de perdidas',
    },
    'auditoria-seguridad': {
      pain: 'No saber que necesita, inversion incorrecta',
      solution: 'Visita tecnica gratuita y analisis de vulnerabilidades',
      benefit: 'Plan documentado con recomendaciones claras',
    },
  },
} as const;

// Type exports for TypeScript
export type Differentiator = typeof BrandDNA.differentiators[number];
export type ContentRule = typeof BrandDNA.contentRules[number];
export type Certification = typeof BrandDNA.certifications[number];
