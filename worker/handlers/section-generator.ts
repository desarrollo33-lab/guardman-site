/**
 * Section Content Generator - Genera contenido SEO por sección
 * Cada sección es un bloque independiente que mapea al layout
 */

interface SectionSpec {
  serviceSlug: string;
  serviceName: string;
  zone?: string;
}

// ============================================
// CONTENT POR SECCIÓN - GUARDIAS DE SEGURIDAD
// ============================================
const GUARDIAS_SECTIONS = {
  hero: {
    heading: 'Guardias de Seguridad',
    subheading: 'Protección profesional con guardias certificados OS-10 y respaldo de centro de monitoreo propio las 24 horas.',
    cta_text: 'Cotiza Guardias de Seguridad'
  },
  intro: {
    paragraphs: [
      'En GuardMan Chile somos la empresa líder en guardias de seguridad en Santiago. Con más de 8 años de trayectoria y más de 500 guardias certificados OS-10, ofrecemos protección profesional para empresas, condominos y residencias.',
      'Nuestro enfoque se centra en la prevención activa. Trabajamos para que los incidentes de seguridad nunca ocurran, no para reaccionar después. La presencia visible y disuasoria de nuestros guardias uniformados genera un ambiente de tranquilidad.',
      'Cada guardia cuenta con el respaldo de nuestro centro de monitoreo propio, operativo 24/7. Esta sinergia entre presencia física y tecnología eleva sustancialmente la capacidad preventiva del servicio.'
    ]
  },
  features: [
    'Personal con certificación OS-10 vigente y registro actualizado',
    'Disponibles 24 horas, 7 días a la semana, 365 días al año',
    'Uniformados con identificación oficial visible',
    'Capacitados en primeros auxilios y manejo de emergencias',
    'Control de accesos y registro detallado de visitas',
    'Reporte diario de novedades y métricas de seguridad'
  ],
  process: [
    { step: 'Evaluación', description: 'Visitamos su propiedad para identificar puntos críticos' },
    { step: 'Propuesta', description: 'Diseñamos un esquema personalizado con guardias y tecnología' },
    { step: 'Implementación', description: 'Desplegamos al personal capacitado y configuramos protocolos' },
    { step: 'Seguimiento', description: 'Supervisión continua y reportes periódicos' }
  ],
  issues: [
    'Accesos no controlados que permiten entrada de personas no autorizadas',
    'Robos y hurtos en empresas, bodegas y residencias',
    'Falta de supervisión en áreas comunes y perimetrales',
    'Incidentes que escalan por falta de respuesta inmediata'
  ],
  stats: [
    { label: 'Guardias activos', value: '500+' },
    { label: 'Clientes atendidos', value: '200+' },
    { label: 'Años experiencia', value: '8+' },
    { label: 'Comunas cobertura', value: '14' }
  ],
  faqs: [
    { question: '¿Qué documentos deben presentar los guardias de seguridad de GuardMan?', answer: 'Todos nuestros guardias cuentan con certificado de antecedentes vigente, curso de vigilante certificado, registro en Senapred y habilitación de la autoridad competente.' },
    { question: '¿GuardMan ofrece servicios de seguridad las 24 horas?', answer: 'Sí, nuestro servicio opera las 24 horas del día, los 7 días de la semana, incluyendo feriados, con guardias de relevo que garantizan cobertura continua.' },
    { question: '¿Los guardias tienen uniforme profesional?', answer: 'Sí, todos nuestros guardias usan uniforme completo oficial de GuardMan Chile con identificación visible, lo que genera mayor confianza y efecto disuasorio.' },
    { question: '¿Cómo se supervisan los guardias?', answer: 'Cada turno cuenta con supervisor en terreno y respaldo del centro de monitoreo. Realizamos rondas sorpresa y auditorías mensuales.' },
    { question: '¿Cubren toda la Región Metropolitana?', answer: 'Sí, cubrimos las 14 comunas de nuestra zona de cobertura con tiempos de respuesta inferiores a 30 minutos.' }
  ],
  cta: {
    title: 'Contrata Guardias de Seguridad hoy',
    description: 'Nuestro equipo está listo para proteger tu propiedad.',
    button: 'Solicitar Cotización'
  }
};

// ============================================
// CONTENT POR SECCIÓN - CCTV
// ============================================
const CCTV_SECTIONS = {
  hero: {
    heading: 'CCTV y Videovigilancia',
    subheading: 'Sistemas de cámaras de última generación con análisis de video con IA y monitoreo 24/7.',
    cta_text: 'Cotiza CCTV'
  },
  intro: {
    paragraphs: [
      'GuardMan Chile ofrece sistemas de CCTV y videovigilancia de última generación para proteger su empresa, condomino o residencia. Nuestras cámaras de alta definición permiten monitoreo en tiempo real desde cualquier lugar.',
      'La videovigilancia moderna va más allá de grabar imágenes. Nuestros sistemas incluyen análisis de video con inteligencia artificial, detección de movimiento, notificaciones en tiempo real y almacenamiento en la nube.',
      'Todos nuestros equipos son de marcas reconocidas como Hikvision, Dahua y Axis. Ofrecemos opciones desde 2MP hasta 4K, con visión nocturna y análisis de comportamiento.'
    ]
  },
  features: [
    'Cámaras IP de alta definición (2MP a 4K)',
    'Visión nocturna por infrarrojo hasta 50 metros',
    'Análisis de video con IA (detección facial, movimiento)',
    'Monitoreo remoto desde smartphone y computadora',
    'Almacenamiento en la nube con respaldo automático',
    'Integración con acceso remoto y control de luces'
  ],
  process: [
    { step: 'Diagnóstico', description: 'Evaluamos su propiedad y recomendamos las cámaras ideales' },
    { step: 'Cotización', description: 'Presentamos opciones con diferentes rangos de precio' },
    { step: 'Instalación', description: 'Técnicos certificados instalan y configuran el sistema' },
    { step: 'Capacitación', description: 'Entrenamos a su equipo en el uso del sistema' }
  ],
  issues: [
    'Cámaras obsoletas que no permiten identificar rostros o patentes',
    'Sin monitoreo remoto: no puede ver su propiedad desde cualquier lugar',
    'Grabaciones perdidas por fallas en equipos o discos duros'
  ],
  stats: [
    { label: 'Cámaras instaladas', value: '2,000+' },
    { label: 'Clientes activos', value: '350+' },
    { label: 'Garantía equipos', value: '24 meses' }
  ],
  faqs: [
    { question: '¿Puedo ver las cámaras desde mi celular?', answer: 'Sí, todas nuestras instalaciones incluyen acceso remoto mediante aplicación gratuita para iOS y Android, con notificaciones de movimiento.' },
    { question: '¿Cuánto duran las grabaciones?', answer: 'Por defecto almacenamos 30 días de grabaciones. Ofrecemos planes desde 7 hasta 90 días según sus necesidades y presupuesto.' },
    { question: '¿Necesito internet para ver las cámaras?', answer: 'Sí, para acceso remoto se requiere conexión a internet. El sistema sigue grabando localmente aunque pierda conexión.' },
    { question: '¿Qué pasa si se corta la luz?', answer: 'Nuestras cámaras incluyen UPS integrado que permite hasta 4 horas de operación continua sin energía eléctrica.' },
    { question: '¿Ofrecen mantenimiento?', answer: 'Sí, tenemos planes de mantenimiento preventivo trimestral que incluyen limpieza de lentes, verificación de conexiones y actualización de firmware.' }
  ],
  cta: {
    title: 'Cotiza CCTV y Videovigilancia',
    description: 'Protege tu propiedad con la mejor tecnología.',
    button: 'Solicitar Cotización'
  }
};

// ============================================
// CONTENT POR SECCIÓN - CONTROL DE ACCESOS
// ============================================
const CONTROL_ACCESOS_SECTIONS = {
  hero: {
    heading: 'Control de Accesos',
    subheading: 'Sistemas biométricos y RFID para control de ingresos en empresas y condominos.',
    cta_text: 'Cotiza Control de Accesos'
  },
  intro: {
    paragraphs: [
      'En GuardMan Chile somos especialistas en sistemas de control de accesos para empresas, condominos y edificios. Nuestros lectores biométricos y tarjetas RFID le permiten saber quién entra y sale, cuándo y desde dónde.',
      'Un sistema de control de accesos bien diseñado va más allá de abrir puertas. Registra cada ingreso, genera reportes de asistencia, limita horarios por empleado y alerta sobre intentos de acceso no autorizados.',
      'Ofrecemos tecnología de punta: lectores de huella dactilar con precisión del 99.9%, tarjetas de proximidad, cerraduras electromagnéticas y software de gestión intuitivo.'
    ]
  },
  features: [
    'Lectores biométricos de huella dactilar y reconocimiento facial',
    'Tarjetas RFID y tags de proximidad compatibles',
    'Cerraduras electromagnéticas y electroimanes de alta seguridad',
    'Software de gestión con reportes de asistencia y accesos',
    'Integración con sistemas de videovigilancia existentes',
    'Acceso remoto para administradores desde cualquier dispositivo'
  ],
  process: [
    { step: 'Levantamiento', description: 'Identificamos puertas, zonas críticas y cantidad de usuarios' },
    { step: 'Propuesta', description: 'Diseñamos el sistema con la mejor relación precio-cobertura' },
    { step: 'Instalación', description: 'Técnicos certificados instalan lectores, cableado y controlador' },
    { step: 'Configuración', description: 'Programamos horarios, permisos y enseñamos a usar el software' }
  ],
  issues: [
    'Llaves duplicadas que no se pueden controlar ni desactivar',
    'Sin registro de quién entra y sale de zonas restringidas',
    'Empleados que abren la puerta a personas no autorizadas'
  ],
  stats: [
    { label: 'Lectores instalados', value: '800+' },
    { label: 'Empresas protegidas', value: '150+' },
    { label: 'Tiempo instalación', value: '1-3 días' }
  ],
  faqs: [
    { question: '¿Qué incluye el servicio de Control de Accesos?', answer: 'El servicio incluye: lectores biométricos o RFID, controlador central, software de gestión, instalación profesional, configuración de permisos, capacitación y 12 meses de soporte técnico.' },
    { question: '¿Puedo controlar accesos desde mi celular?', answer: 'Sí, nuestra plataforma permite administrar usuarios, crear reportes y recibir alertas de intentos de acceso fallidos desde cualquier dispositivo con internet.' },
    { question: '¿Funciona sin energía eléctrica?', answer: 'Nuestras cerraduras electromagnéticas incluyen batería de respaldo que mantiene el sistema operativo hasta 8 horas sin energía.' },
    { question: '¿Cuántos usuarios puedo gestionar?', answer: 'El sistema base soporta hasta 1,000 usuarios. Para instalaciones más grandes, ofrecemos soluciones empresariales con hasta 10,000 usuarios.' },
    { question: '¿Ofrecen servicio de monitoreo 24/7?', answer: 'Sí, todos nuestros sistemas de control de accesos pueden integrarse con nuestro centro de monitoreo para alertas en tiempo real.' }
  ],
  cta: {
    title: 'Cotiza Control de Accesos',
    description: 'Control total de quién accede a tu propiedad.',
    button: 'Solicitar Cotización'
  }
};

// ============================================
// CONTENT POR SECCIÓN - ESCOLTAS PRIVADOS
// ============================================
const ESCOLTAS_SECTIONS = {
  hero: {
    heading: 'Escoltas Privados',
    subheading: 'Protección personal para ejecutivos y personalidades con guardias OS-10.',
    cta_text: 'Cotiza Escoltas'
  },
  intro: {
    paragraphs: [
      'GuardMan Chile ofrece servicio de escoltas privados para ejecutivos, familias y personas que requieren protección personal. Nuestros escoltas son ex miembros de fuerzas armadas y Carabineros, entrenados en protección ejecutiva.',
      'El servicio de escoltas está diseñado para personas que enfrentan riesgos específicos: ejecutivos de empresas, celebridades, testigos protegidos, víctimas de amenazas o familias que necesitan protección cerca de menores.',
      'Cada escolta cuenta con curso de protección ejecutiva, primeros auxilios avanzados, manejo defensivo de vehículos y protocolos de respuesta ante emergencias.'
    ]
  },
  features: [
    'Ex袈s y Carabineros con experiencia en protección',
    'Capacitación en protección ejecutiva y manejo defensivo',
    'Vehículos equipados para protección móvil',
    'Comunicación directa con centro de monitoreo 24/7',
    'Evaluación de riesgos antes de iniciar el servicio',
    'Protocolos de respuesta ante emergencias personalizados'
  ],
  process: [
    { step: 'Evaluación de riesgo', description: 'Analizamos la situación y nivel de amenaza' },
    { step: 'Selección', description: 'Elegimos al escolta con el perfil adecuado' },
    { step: 'Briefing', description: 'Capacitamos al cliente sobre protocolos y comunicación' },
    { step: 'Despliegue', description: 'Iniciamos el servicio con cobertura acordada' }
  ],
  issues: [
    'Amenazas específicas que requieren protección personal',
    'Eventos públicos donde la seguridad personal es prioritaria',
    'Viajes a zonas de riesgo que requieren cobertura especializada'
  ],
  stats: [
    { label: 'Escoltas disponibles', value: '50+' },
    { label: 'Clientes en protección', value: '25+' },
    { label: 'Años experiencia promedio', value: '12+' }
  ],
  faqs: [
    { question: '¿Los escoltas están armados?', answer: 'No, nuestros escoltas operan sin armas de fuego, siguiendo la normativa chilena. Su protección se basa en prevención, disuasión y respuesta defensiva no letal.' },
    { question: '¿Puedo contratar escoltas solo para eventos específicos?', answer: 'Sí, ofrecemos servicio por evento para reuniones, presentaciones, eventos corporativos y cualquier situación que requiera protección temporal.' },
    { question: '¿Los escoltas manejan vehículos?', answer: 'Sí, todos nuestros escoltas tienen licencia de conducir avanzada y están entrenados en manejo defensivo para proteger al protegido.' },
    { question: '¿Qué pasa si hay una emergencia?', answer: 'El escolta tiene comunicación directa con nuestro centro de monitoreo y conoce los protocolos de evacuación y contacto con Carabineros.' },
    { question: '¿Cómo inicio el servicio de escoltas?', answer: 'Llámenos al +56 9 3000 0010 para una evaluación confidencial. El servicio puede iniciarse en menos de 24 horas.' }
  ],
  cta: {
    title: 'Cotiza Escoltas Privados',
    description: 'Protección personal con profesionales certificados.',
    button: 'Solicitar Cotización'
  }
};

// ============================================
// CONTENT POR SECCIÓN - MONITOREO 24/7
// ============================================
const MONITOREO_SECTIONS = {
  hero: {
    heading: 'Monitoreo 24/7',
    subheading: 'Centro de monitoreo propio con operadores capacitados las 24 horas.',
    cta_text: 'Cotiza Monitoreo'
  },
  intro: {
    paragraphs: [
      'GuardMan Chile cuenta con centro de monitoreo propio operativo las 24 horas, los 7 días de la semana. Más de 40 operadores trabajan en turnos para vigilar su propiedad y responder ante cualquier incidente en tiempo real.',
      'Nuestro centro de monitoreo recibe señales de sensores de movimiento, alarmas, cámaras y botones de pánico. Cuando se detecta una anomalía, nuestros operadores verifican visualmente y coordinan la respuesta apropiada.',
      'La tecnología de nuestro centro incluye videowall con más de 100 cámaras en pantalla, software de gestión de eventos desarrollado internamente, y conexiones redundantes con proveedores de internet y energía.'
    ]
  },
  features: [
    'Centro de monitoreo propio con más de 40 operadores',
    'Videowall con monitoreo en tiempo real de cámaras',
    'Respuesta ante emergencias en menos de 3 minutos',
    'Verificación visual de alarmas antes de contactar carabineros',
    'Notificaciones instantáneas vía SMS, email y app',
    'Respaldo eléctrico y de conectividad garantizado'
  ],
  process: [
    { step: 'Conexión', description: 'Instalamos el equipo de comunicación entre su sistema y nuestro centro' },
    { step: 'Configuración', description: 'Programamos zonas, horarios y contactos de notificación' },
    { step: 'Prueba', description: 'Realizamos pruebas de comunicación y respuesta' },
    { step: 'Monitoreo', description: 'Iniciamos la vigilancia 24/7 con operadores asignados' }
  ],
  issues: [
    'Alarmas que no son atendidas o verificadas por nadie',
    'Emergencias que no se reportan a tiempo porque no hay quien vigile',
    'Sistemas de seguridad sin monitoreo que no previenen nada'
  ],
  stats: [
    { label: 'Propiedades monitoreadas', value: '500+' },
    { label: 'Operadores en centro', value: '40+' },
    { label: 'Tiempo respuesta promedio', value: '3 min' }
  ],
  faqs: [
    { question: '¿Qué pasa si se corta la luz o internet?', answer: 'Nuestras instalaciones tienen UPS con 4 horas de autonomía y conectividad celular de respaldo. El centro sigue operando incluso en desastres.' },
    { question: '¿Cómo sé que están vigilando?', answer: 'Recibirá reportes mensuales con métricas: eventos detectados, respuestas activadas, tiempo promedio de respuesta y estado del sistema.' },
    { question: '¿Puedo ver las cámaras desde la app de GuardMan?', answer: 'Sí, nuestra app permite ver sus cámaras en vivo, recibir notificaciones de eventos y solicitar el historial de grabaciones.' },
    { question: '¿Qué pasa si hay una intrusión?', answer: 'El operador verifica visualmente, contacta al cliente para confirmar si es emergencia real, y si no responde, coordina con Carabineros directamente.' },
    { question: '¿El servicio es solo para alarmas o también para cámaras?', answer: 'Monitoreamos cualquier señal: alarmas de intrusión, cámaras, sensores ambientales, control de accesos y GPS vehicular.' }
  ],
  cta: {
    title: 'Cotiza Monitoreo 24/7',
    description: 'Vigilancia profesional las 24 horas.',
    button: 'Solicitar Cotización'
  }
};

// ============================================
// CONTENT POR SECCIÓN - SEGURIDAD EVENTOS
// ============================================
const EVENTOS_SECTIONS = {
  hero: {
    heading: 'Seguridad para Eventos',
    subheading: 'Protección profesional para eventos corporativos, sociales y masivos.',
    cta_text: 'Cotiza Seguridad para Eventos'
  },
  intro: {
    paragraphs: [
      'GuardMan Chile ofrece servicio de seguridad para eventos corporativos, sociales y masivos en toda la Región Metropolitana. Contamos con personal entrenado para manejar desde reuniones íntimas hasta eventos con más de 5,000 asistentes.',
      'La seguridad en eventos requiere planificación previa, evaluación de riesgos y coordinación con autoridades. Nuestro equipo incluye coordinadores de seguridad certificados que diseñan el plan según el tipo de evento.',
      'Todos nuestros efectivos para eventos cuentan con certificación OS-10 vigente y han sido capacitados en manejo de multitudes, primeros auxilios y protocolos de evacuación.'
    ]
  },
  features: [
    'Coordinadores de seguridad certificados para planificar el evento',
    'Guardias OS-10 capacitados en control masivo',
    'Escoltas VIP discretos para invitados especiales',
    'Postes de control y arcos detectores de metales',
    'Comunicación radial y coordinación con Carabineros',
    'Servicio de primeros auxilios con botiquín completo'
  ],
  process: [
    { step: 'Reunión inicial', description: 'Entendemos el tipo de evento, cantidad esperada y nivel de riesgo' },
    { step: 'Planificación', description: 'Diseñamos el esquema de seguridad con puestos y recursos' },
    { step: 'Coordinación', description: 'Contactamos a Carabineros y otros servicios si es necesario' },
    { step: 'Ejecución', description: 'Desplegamos el personal y supervisamos durante todo el evento' }
  ],
  issues: [
    'Eventos sin control de accesos que permiten entrada de personas no autorizadas',
    'Multitudes que se descontrolan por falta de personal capacitado',
    'Robos durante eventos por falta en la seguridad perimetral'
  ],
  stats: [
    { label: 'Eventos atendidos', value: '300+' },
    { label: 'Asistentes protegidos', value: '50,000+' },
    { label: 'Eventos masivos (>1000)', value: '50+' }
  ],
  faqs: [
    { question: '¿Con cuánta anticipación debo contratar seguridad para mi evento?', answer: 'Recomendamos contactar con al menos 2 semanas de anticipación. Para eventos masivos (>1,000 personas) necesitamos 1 mes.' },
    { question: '¿Cuántos guardias necesito para mi evento?', answer: 'La cantidad depende del tipo de evento y número esperado. Por regla general: 1 guardia cada 100 personas para eventos sociales, 1 cada 50 para corporativos.' },
    { question: '¿Incluyen arcos detectores y postes de seguridad?', answer: 'Sí, ofrecemos el equipamiento necesario como parte del servicio. Incluye arcos, postes, detectores de metales portátiles y equipos de comunicación.' },
    { question: '¿Pueden coordinar con Carabineros?', answer: 'Sí, gestionamos los permisos necesarios ante Carabineros y coordinamos la presencia de efectivo público si el evento lo requiere.' },
    { question: '¿Qué pasa si hay una emergencia durante el evento?', answer: 'Nuestros guardias están entrenados en primeros auxilios y evacuación. Activan protocolos de emergencia y contactan a servicios profesionales inmediatamente.' }
  ],
  cta: {
    title: 'Cotiza Seguridad para Eventos',
    description: 'Protección profesional para tu próximo evento.',
    button: 'Solicitar Cotización'
  }
};

// ============================================
// CONTENT POR SECCIÓN - SEGURIDAD INDUSTRIAL
// ============================================
const INDUSTRIAL_SECTIONS = {
  hero: {
    heading: 'Seguridad Industrial',
    subheading: 'Vigilancia para fábricas, bodegas y centros logísticos.',
    cta_text: 'Cotiza Seguridad Industrial'
  },
  intro: {
    paragraphs: [
      'GuardMan Chile ofrece soluciones de seguridad industrial para fábricas, bodegas, centros logísticos y zonas industriales. Entendemos los riesgos específicos de cada sector y diseñamos esquemas adaptados a la realidad de su operación.',
      'La seguridad industrial requiere vigilancia perimetral, control de acceso de vehículos y personas, y protocolos específicos para áreas clasificadas. Nuestros guardias están entrenados en prevención de accidentes y manejo de materiales peligrosos.',
      'Ofrecemos servicios diurnos y nocturnos, con énfasis en la protección de activos, prevención de robos de mercancía y control de acceso de contratistas y visitantes.'
    ]
  },
  features: [
    'Vigilancia perimetral con rondas programadas',
    'Control de acceso vehicular y peatonal',
    'Registro de contratistas y visitantes con photo ID',
    'Monitoreo de cámaras con enfoque en zonas críticas',
    'Control de horario de turnos y asistencia',
    'Reporte de novedades con fotografías del evento'
  ],
  process: [
    { step: 'Análisis', description: 'Evaluamos la instalación, riesgos y operación de la empresa' },
    { step: 'Diseño', description: 'Creamos el esquema de seguridad con puestos estratégicos' },
    { step: 'Implementación', description: 'Capacitamos al personal en los protocolos específicos' },
    { step: 'Operación', description: 'Iniciamos el servicio con supervisión continua' }
  ],
  issues: [
    'Robos de materiales y equipos de alto valor',
    'Acceso no autorizado de personas ajenas a la empresa',
    'Falta de control sobre contratistas y visitas'
  ],
  stats: [
    { label: 'Plantas industriales protegidas', value: '40+' },
    { label: 'Bodegas aseguradas', value: '60+' },
    { label: 'Horas sin incidentes', value: '500,000+' }
  ],
  faqs: [
    { question: '¿Los guardias tienen experiencia en entornos industriales?', answer: 'Sí, nuestros guardias industriales son seleccionados por su experiencia en el sector y capacitados en seguridad ocupacional, prevención de accidentes y manejo de emergencias.' },
    { question: '¿Cómo controlan el acceso de vehículos?', answer: 'Contamos con garitas equipadas con barreras, cámaras de lectura de patentes y sistema de registro de vehículos autorizados.' },
    { question: '¿El servicio funciona 24/7?', answer: 'Sí, ofrecemos cobertura continua para operaciones que trabajan las 24 horas, con personal de relevo y supervisión constante.' },
    { question: '¿Pueden integrar su servicio con mis cámaras existentes?', answer: 'Sí, podemos monitorear sus cámaras desde nuestro centro de operaciones y coordinar con los guardias en terreno.' },
    { question: '¿Qué reportes recibo?', answer: 'Recibe reportes diarios por email con novedades, conteo de ingresos/egresos, fotografía de incidentes y métricas de turno.' }
  ],
  cta: {
    title: 'Cotiza Seguridad Industrial',
    description: 'Protección para tu operación industrial.',
    button: 'Solicitar Cotización'
  }
};

// ============================================
// CONTENT POR SECCIÓN - AUDITORÍA
// ============================================
const AUDITORIA_SECTIONS = {
  hero: {
    heading: 'Auditoría de Seguridad',
    subheading: 'Evaluación profesional de vulnerabilidades y plan de mejoras.',
    cta_text: 'Cotiza Auditoría'
  },
  intro: {
    paragraphs: [
      'GuardMan Chile ofrece servicios de auditoría y consultoría de seguridad para empresas que quieren evaluar sus vulnerabilidades y diseñar mejoras. Nuestros auditores tienen más de 10 años de experiencia en seguridad privada y pública.',
      'La auditoría de seguridad es el primer paso para proteger su empresa. Analizamos puntos débiles, evaluamos la competencia de su personal actual y recomendamos mejoras basadas en estándares internacionales.',
      'Nuestro servicio incluye evaluación física, evaluación documental y evaluación tecnológica. Al finalizar, entregamos un informe detallado con hallazgos, nivel de riesgo y plan de mejoras priorizadas.'
    ]
  },
  features: [
    'Evaluación de seguridad física: accesos, cerraduras, iluminación',
    'Revisión de sistemas de alarma y videovigilancia',
    'Auditoría de personal de seguridad y sus certificaciones',
    'Análisis de vulnerabilidades y nivel de riesgo',
    'Plan de mejoras priorizadas por urgencia',
    'Informe ejecutivo con recomendaciones'
  ],
  process: [
    { step: 'Levantamiento', description: 'Visitamos su empresa y documentamos el estado actual de seguridad' },
    { step: 'Análisis', description: 'Evaluamos cada punto con checklists internacionales' },
    { step: 'Informe', description: 'Entregamos documento detallado con hallazgos y recomendaciones' },
    { step: 'Seguimiento', description: 'Opcional: acompañamos la implementación de mejoras' }
  ],
  issues: [
    'Seguridad improvisada sin evaluación profesional',
    'Sistemas de seguridad sin mantenimiento ni actualización',
    'Personal de seguridad sin certificaciones ni entrenamiento'
  ],
  stats: [
    { label: 'Auditorías realizadas', value: '100+' },
    { label: 'Empresas evaluadas', value: '80+' },
    { label: 'Vulnerabilidades detectadas', value: '500+' }
  ],
  faqs: [
    { question: '¿Cuánto cuesta una auditoría de seguridad?', answer: 'El valor depende del tamaño de la empresa y alcance de la auditoría. Para empresas pequeñas (hasta 500m²) el valor parte desde $350.000. Solicite cotización.' },
    { question: '¿Cuánto tiempo toma la auditoría?', answer: 'Para empresas medianas, la auditoría toma entre 2 y 5 días hábiles de trabajo en terreno, más 1 semana para elaborar el informe.' },
    { question: '¿La auditoría incluye pruebas técnicas?', answer: 'Sí, probamos los sistemas de alarma, cámaras y control de accesos para verificar que funcionen correctamente.' },
    { question: '¿El informe es confidencial?', answer: 'Sí, el informe es propiedad del cliente y no compartimos información con terceros. Guardamos confidencialidad absoluta.' },
    { question: '¿Pueden implementar las recomendaciones ustedes mismos?', answer: 'Sí, ofrecemos servicio de implementación de mejoras después de la auditoría, pero el cliente tiene total libertad de contratar a otros proveedores.' }
  ],
  cta: {
    title: 'Cotiza Auditoría de Seguridad',
    description: 'Conoce las vulnerabilidades de tu empresa.',
    button: 'Solicitar Cotización'
  }
};

// ============================================
// CONTENT POR SECCIÓN - GUARD POD
// ============================================
const GUARD_POD_SECTIONS = {
  hero: {
    heading: 'Guard Pod',
    subheading: 'Unidades móviles de vigilancia autónoma para obras y eventos.',
    cta_text: 'Cotiza Guard Pod'
  },
  intro: {
    paragraphs: [
      'Guard Pod es la solución de vigilancia móvil patentada por GuardMan Chile. Se trata de una unidad autónoma de vigilancia con cámaras, sensores de movimiento, sirena y comunicación satelital, que se instala donde necesita protección temporal.',
      'El Guard Pod es ideal para obras en construcción, eventos temporales, zonas con alto riesgo de robo, o cualquier lugar donde no existe infraestructura de seguridad. Funciona con energía solar y conexión celular, sin necesidad de electricidad ni internet.',
      'El Guard Pod detecta movimiento en un radio de 30 metros, activa sirena y luces LED, graba video en alta definición, y envía alertas en tiempo real a nuestro centro de monitoreo.'
    ]
  },
  features: [
    'Cámaras HD con visión nocturna y detección de movimiento',
    'Sirena de 120dB y luces LED de alta potencia',
    'Comunicación celular con centro de monitoreo 24/7',
    'Energía solar con batería de respaldo de 72 horas',
    'Instalación en menos de 30 minutos',
    'Alquiler mensual sin contrato mínimo'
  ],
  process: [
    { step: 'Cotización', description: 'Evaluamos la zona a proteger y recomendamos cantidad de Pods' },
    { step: 'Entrega', description: 'Entregamos los Pods instalados y configurados' },
    { step: 'Monitoreo', description: 'Nuestro centro vigila las 24 horas' },
    { step: 'Retiro', description: 'Cuando ya no lo necesite, lo recolhemos sin costo' }
  ],
  issues: [
    'Obras sin protección que sufren robos de materiales',
    'Eventos temporales sin seguridad perimetral',
    'Zonas rurales con alto índice de robos sin vigilancia'
  ],
  stats: [
    { label: 'Guard Pods en operación', value: '30+' },
    { label: 'Obras protegidas', value: '25+' },
    { label: 'Robos prevenidos', value: '100+' }
  ],
  faqs: [
    { question: '¿Qué incluye el servicio de Guard Pod?', answer: 'El alquiler mensual incluye: unidad Guard Pod con cámaras y sensores, energía solar, comunicación celular, monitoreo 24/7 desde nuestro centro, alertas en tiempo real y soporte técnico.' },
    { question: '¿Funciona sin luz ni internet?', answer: 'Sí, el Guard Pod funciona completamente con energía solar y conexión celular. No necesita ningún cableado.' },
    { question: '¿Puedo ver las cámaras desde mi celular?', answer: 'Sí, nuestra app permite ver las cámaras en vivo, recibir alertas y ver grabaciones de eventos.' },
    { question: '¿Qué pasa si alguien intenta robar algo de todas formas?', answer: 'El Pod detecta el movimiento, activa sirena y luces, envía alerta a nuestro centro, y el operador coordina con Carabineros mientras el ladrón huye.' },
    { question: '¿Hay costo de instalación o retiro?', answer: 'No, la entrega y retiro son gratuitos en la Región Metropolitana. El único costo es el alquiler mensual.' }
  ],
  cta: {
    title: 'Cotiza Guard Pod',
    description: 'Vigilancia móvil sin instalación.',
    button: 'Solicitar Cotización'
  }
};

// ============================================
// MAPA DE SERVICIOS A SECCIONES
// ============================================
const SERVICE_SECTIONS_MAP: Record<string, any> = {
  'guardias-de-seguridad': GUARDIAS_SECTIONS,
  'cctv-videovigilancia': CCTV_SECTIONS,
  'control-de-accesos': CONTROL_ACCESOS_SECTIONS,
  'escoltas-privados': ESCOLTAS_SECTIONS,
  'monitoreo-24-7': MONITOREO_SECTIONS,
  'seguridad-eventos': EVENTOS_SECTIONS,
  'seguridad-industrial': INDUSTRIAL_SECTIONS,
  'auditoria-seguridad': AUDITORIA_SECTIONS,
  'guard-pod': GUARD_POD_SECTIONS
};

// ============================================
// GENERATORS
// ============================================

export function generateServiceSections(serviceSlug: string, serviceName: string): any {
  const sections = SERVICE_SECTIONS_MAP[serviceSlug];
  if (!sections) {
    // Default para servicios no mapeados
    return {
      hero: { heading: serviceName, subheading: `${serviceName} con GuardMan Chile`, cta_text: `Cotiza ${serviceName}` },
      intro: { paragraphs: [`Servicio de ${serviceName} disponible en toda la Región Metropolitana.`, 'Personal certificado y disponible 24/7.', 'Contáctenos para más información.'] },
      features: [],
      process: [],
      issues: [],
      stats: [],
      faqs: [],
      cta: { title: `Cotiza ${serviceName}`, description: 'Solicite su cotización', button: 'Cotizar' }
    };
  }

  return sections;
}

export function generateLocationSections(locationSlug: string, locationName: string, zone: string): any {
  const zoneDescriptions: Record<string, { intro: string[]; issues: string[] }> = {
    'Oriente': {
      intro: [
        `En GuardMan Chile entendemos las necesidades específicas de seguridad en ${locationName}. Esta zona premium requiere soluciones de seguridad sofisticadas y discretas.`,
        `Contamos con guardias experimentados que conocen las dinámicas del sector Oriente de Santiago.`,
        `Nuestro conocimiento del territorio nos permite identificar puntos críticos y diseñar esquemas de seguridad efectivos para esta zona.`
      ],
      issues: [
        'Robos a viviendas y vehículos en zonas residenciales',
        'Acceso no autorizado a condominos y edificios',
        'Necesidad de seguridad discreta pero efectiva'
      ]
    },
    'Centro': {
      intro: [
        `${locationName} concentra alta actividad comercial y empresarial. Nuestros servicios de seguridad ayudan a proteger locales comerciales, oficinas y edificios de departamentos.`,
        `La alta densidad de personas y vehículos requiere protocolos específicos de seguridad.`,
        `Contamos con personal desplegado en ${locationName} con tiempos de respuesta inferiores a 30 minutos.`
      ],
      issues: [
        'Alto flujo de personas que dificulta el control de accesos',
        'Robos en locales comerciales y oficinas',
        'Vandalismo y deterioro de espacios públicos'
      ]
    },
    'Industrial': {
      intro: [
        `${locationName} tiene gran actividad industrial y logística. Ofrecemos soluciones de seguridad perimetral y control de acceso para bodegas, fábricas y centros de distribución.`,
        `La seguridad industrial requiere vigilancia constante y protocolos específicos para proteger activos de alto valor.`,
        `Nuestros guardias están entrenados para operar en entornos industriales con protocolos de prevención de accidentes.`
      ],
      issues: [
        'Robos de materiales y equipos de alto valor',
        'Acceso no autorizado de personas ajenas a la empresa',
        'Falta de control sobre contratistas y visitas'
      ]
    },
    'Norte': {
      intro: [
        `${locationName} es una zona en constante crecimiento con proyectos inmobiliarios y comerciales. GuardMan ofrece soluciones de seguridad adaptadas a las necesidades de la zona norte.`,
        `La expansión de la zona requiere cobertura amplia y tiempos de respuesta óptimos.`,
        `Contamos con personal desplegado estratégicamente en la zona norte para garantizar cobertura.`
      ],
      issues: [
        'Obras y proyectos sin protección adecuada',
        'Robos en zonas residenciales en desarrollo',
        'Falta de infraestructura de seguridad en nuevas poblaciones'
      ]
    },
    'Sur': {
      intro: [
        `${locationName} requiere atención especial en seguridad por su densidad poblacional. Ofrecemos soluciones adaptadas a las necesidades del sector sur.`,
        `La seguridad en zonas residenciales requiere un enfoque preventivo y comunitario.`,
        `Contamos con guardias que conocen las dinámicas locales y pueden establecer relaciones de confianza con los residentes.`
      ],
      issues: [
        'Robos en viviendas y vehículos',
        'Accesos no controlados en poblaciones',
        'Falta de iluminación en ciertas calles'
      ]
    }
  };

  const zoneData = zoneDescriptions[zone] || zoneDescriptions['Centro'];

  return {
    hero: {
      heading: `Seguridad Privada en ${locationName}`,
      subheading: `Empresa líder con guardias OS-10 en ${locationName}. Cobertura 24/7.`,
      cta_text: `Cotiza en ${locationName}`
    },
    intro: { paragraphs: zoneData.intro },
    coverage: {
      title: `Cobertura en ${locationName}`,
      items: [
        'Guardias disponibles 24/7',
        'Tiempo de respuesta < 30 minutos',
        'Centro de monitoreo propio',
        'Reportes diarios de novedades'
      ]
    },
    issues: zoneData.issues,
    stats: [
      { label: 'Empresas protegidas', value: '20+' },
      { label: 'Guardias en zona', value: '30+' },
      { label: 'Tiempo respuesta', value: '< 30 min' }
    ],
    faqs: [
      { question: `¿Hay disponibilidad de guardias en ${locationName}?`, answer: `Sí, tenemos guardias disponibles desplegados en ${locationName} listos para comenzar el servicio.` },
      { question: `¿Cuál es el tiempo de respuesta en ${locationName}?`, answer: `Nuestro tiempo de respuesta en ${locationName} es inferior a 30 minutos desde cualquier punto de la comuna.` },
      { question: '¿Qué tipos de propiedades protegen?', answer: 'Protegemos empresas, condominos, residencias, obras y cualquier tipo de propiedad que necesite seguridad.' }
    ],
    cta: {
      title: `Protege tu propiedad en ${locationName}`,
      description: 'Contáctanos para una cotización personalizada.',
      button: 'Solicitar Cotización'
    }
  };
}

export function generateComboSections(serviceSlug: string, serviceName: string, locationSlug: string, locationName: string): any {
  return {
    hero: {
      heading: `${serviceName} en ${locationName}`,
      subheading: `Servicio de ${serviceName.toLowerCase()} disponible en ${locationName} con guardias certificados OS-10.`,
      cta_text: `Cotiza ${serviceName} en ${locationName}`
    },
    intro: {
      paragraphs: [
        `El servicio de ${serviceName.toLowerCase()} en ${locationName} está disponible a través de GuardMan Chile. Contamos con guardias certificados y experiencia en la zona para brindarle la mejor protección.`,
        `Nuestro equipo conoce las dinámicas locales de ${locationName} y puede desplegar el servicio rápidamente.`,
        `Con cobertura en las principales comunas de Santiago, garantizamos tiempos de respuesta óptimos.`
      ]
    },
    faqs: [
      { question: `¿Hay disponibilidad de ${serviceName.toLowerCase()} en ${locationName}?`, answer: `Sí, tenemos personal y equipos disponibles para comenzar el servicio en ${locationName} de inmediato.` },
      { question: `¿Cuál es el tiempo de implementación en ${locationName}?`, answer: `Podemos iniciar el servicio en ${locationName} en menos de 48 horas desde la confirmación.` }
    ],
    cta: {
      title: `Cotiza ${serviceName} en ${locationName}`,
      description: 'Servicio disponible con cobertura inmediata.',
      button: 'Solicitar Cotización'
    }
  };
}

// ============================================
// SECTION KEYS CONSTANTS
// ============================================
export const SECTION_KEYS = {
  HERO: 'hero',
  INTRO: 'intro',
  FEATURES: 'features',
  PROCESS: 'process',
  ISSUES: 'issues',
  STATS: 'stats',
  FAQS: 'faqs',
  CTA: 'cta',
  COVERAGE: 'coverage',
  LOCATIONS: 'locations'
} as const;

export const SERVICE_SECTION_ORDER = [
  SECTION_KEYS.HERO,
  SECTION_KEYS.INTRO,
  SECTION_KEYS.FEATURES,
  SECTION_KEYS.PROCESS,
  SECTION_KEYS.ISSUES,
  SECTION_KEYS.STATS,
  SECTION_KEYS.FAQS,
  SECTION_KEYS.CTA
];

export const LOCATION_SECTION_ORDER = [
  SECTION_KEYS.HERO,
  SECTION_KEYS.INTRO,
  SECTION_KEYS.COVERAGE,
  SECTION_KEYS.ISSUES,
  SECTION_KEYS.STATS,
  SECTION_KEYS.FAQS,
  SECTION_KEYS.CTA
];