/**
 * Content Generator - Genera contenido SEO único por servicio
 */

interface ContentSpec {
  serviceName: string;
  serviceSlug: string;
  
  // Intro específico
  intro: {
    paragraph1: string;
    paragraph2: string;
    paragraph3: string;
    paragraph4: string;
  };
  
  // Features específicas del servicio
  features: string[];
  
  // Benefits únicos
  benefits: string[];
  
  // Common issues específicos
  issues: string[];
  
  // Proceso específico
  process: { step: string; description: string }[];
  
  // FAQs únicas
  faqs: { question: string; answer: string }[];
  
  // Stats del servicio
  stats: { label: string; value: string }[];
}

// Servicio específicos
const SERVICE_SPECS: Record<string, ContentSpec> = {
  'guardias-de-seguridad': {
    serviceName: 'Guardias de Seguridad',
    serviceSlug: 'guardias-de-seguridad',
    intro: {
      paragraph1: 'En GuardMan Chile somos la empresa líder en guardias de seguridad en Santiago. Con más de 8 años de trayectoria y más de 500 guardias certificados OS-10, ofrecemos protección profesional para empresas, condominos y residencias.',
      paragraph2: 'Nuestro enfoque se centra en la prevención activa. Trabajamos para que los incidentes de seguridad nunca ocurran, no para reaccionar después. La presencia visible y disuasoria de nuestros guardias uniformados genera un ambiente de tranquilidad que permite el desarrollo normal de todas las actividades.',
      paragraph3: 'Cada guardia cuenta con el respaldo de nuestro centro de monitoreo propio, operativo 24/7. Esta comunicación bidireccional constante permite coordinar respuestas inmediatas ante cualquier anomalía, combinando presencia física con tecnología de vigilancia.',
      paragraph4: 'Operamos bajo estricto cumplimiento de la Ley 21.659 de Seguridad Privada y todas nuestras operaciones están certificadas OS-10 por Carabineros de Chile.'
    },
    features: [
      'Personal con certificación OS-10 vigente y registro actualizado',
      'Disponibles 24 horas, 7 días a la semana, 365 días al año',
      'Uniformados con identificación oficial visible',
      'Capacitados en primeros auxilios y manejo de emergencias',
      'Control de accesos y registro detallado de visitas',
      'Reporte diario de novedades y métricas de seguridad'
    ],
    benefits: [
      'Disuasión inmediata: la presencia de guardias uniformados previene intentos de robo y vandalism',
      'Respuesta rápida: comunicación directa con centro de monitoreo propio',
      'Tranquilidad: Protección continua sin interrupciones',
      'Visibilidad: Reportes diarios para conocer el estado de su propiedad'
    ],
    issues: [
      'Accesos no controlados que permiten entrada de personas no autorizadas',
      'Robos y hurtos en empresas, bodegas y residencias',
      'Falta de supervisión en áreas comunes y perimetrales'
    ],
    process: [
      { step: 'Evaluación', description: 'Visitamos su propiedad para identificar puntos críticos y necesidades específicas' },
      { step: 'Propuesta', description: 'Diseñamos un esquema de seguridad personalizado con guardias y tecnología' },
      { step: 'Implementación', description: 'Desplegamos al personal capacitado y configuramos los protocolos' }
    ],
    faqs: [
      { question: '¿Qué documentos deben presentar los guardias de seguridad de GuardMan?', answer: 'Todos nuestros guardias cuentan con certificado de antecedentes vigente, curso de vigilante certificado, registro en Senapred y habilitación de la autoridad competente en seguridad privada.' },
      { question: '¿GuardMan ofrece servicios de seguridad las 24 horas?', answer: 'Sí, nuestro servicio opera las 24 horas del día, los 7 días de la semana, incluyendo feriados, con guardias de relevo que garantizan cobertura continua.' },
      { question: '¿Los guardias tienen uniforme profesional?', answer: 'Sí, todos nuestros guardias usan uniforme completo oficial de GuardMan Chile con identificación visible, lo que genera mayor confianza y efecto disuasorio.' },
      { question: '¿Cómo se supervisan los guardias?', answer: 'Cada turno cuenta con supervisor en terreno y respaldo del centro de monitoreo. Realizamos rondas sorpresa y auditorías mensuales.' },
      { question: '¿Cubren toda la Región Metropolitana?', answer: 'Sí, cubrimos las 14 comunas de nuestra zona de cobertura con tiempos de respuesta inferiores a 30 minutos.' }
    ],
    stats: [
      { label: 'Guardias activos', value: '500+' },
      { label: 'Clientes atendidos', value: '200+' },
      { label: 'Años experiencia', value: '8+' }
    ]
  },

  'cctv-videovigilancia': {
    serviceName: 'CCTV y Videovigilancia',
    serviceSlug: 'cctv-videovigilancia',
    intro: {
      paragraph1: 'GuardMan Chile ofrece sistemas de CCTV y videovigilancia de última generación para proteger su empresa, condomino o residencia. Nuestras cámaras de alta definición permiten monitoreo en tiempo real desde cualquier lugar.',
      paragraph2: 'La videovigilancia moderna va más allá de grabar imágenes. Nuestros sistemas incluyen análisis de video con inteligencia artificial, detección de movimiento, notificaciones en tiempo real y almacenamiento en la nube con acceso remoto.',
      paragraph3: 'Todos nuestros equipos son de marcas reconocidas como Hikvision, Dahua y Axis. Ofrecemos opciones desde 2MP hasta 4K, con visión nocturna, análisis de comportamiento y integración con centros de monitoreo.',
      paragraph4: 'Contamos con técnicos certificados y servicio de instalación profesional en toda la Región Metropolitana, con garantía de 24 meses en todos los equipos.'
    },
    features: [
      'Cámaras IP de alta definición (2MP a 4K)',
      'Visión nocturna por infrarrojo hasta 50 metros',
      'Análisis de video con IA (detección facial, movimiento)',
      'Monitoreo remoto desde smartphone y computadora',
      'Almacenamiento en la nube con respaldo automático',
      'Integración con acceso remoto y control de luces'
    ],
    benefits: [
      'Monitoreo 24/7 desde cualquier lugar con conexión a internet',
      'Evidencia grabada en caso de incidentes para investigación policial',
      'Disuasión efectivo: la señalización de cámaras previene robos',
      'Acceso histórico: hasta 90 días de grabaciones almacenadas'
    ],
    issues: [
      'Cámaras obsoletas que no permiten identificar rostros o patentes',
      'Sin monitoreo remoto: no puede ver su propiedad desde cualquier lugar',
      'Grabaciones perdidas por fallas en equipos o discos duros'
    ],
    process: [
      { step: 'Diagnóstico', description: 'Evaluamos su propiedad y recomendamos las cámaras ideales para cada zona' },
      { step: 'Cotización', description: 'Presentamos opciones con diferentes rangos de precio y tecnología' },
      { step: 'Instalación', description: 'Técnicos certificados instalan y configuran el sistema' },
      { step: 'Capacitación', description: 'Entrenamos a su equipo en el uso del sistema de monitoreo' }
    ],
    faqs: [
      { question: '¿Puedo ver las cámaras desde mi celular?', answer: 'Sí, todas nuestras instalaciones incluyen acceso remoto mediante aplicación gratuita para iOS y Android, con notificaciones de movimiento.' },
      { question: '¿Cuánto duran las grabaciones?', answer: 'Por defecto almacenamos 30 días de grabaciones. Ofrecemos planes desde 7 hasta 90 días según sus necesidades y presupuesto.' },
      { question: '¿Necesito internet para ver las cámaras?', answer: 'Sí, para acceso remoto se requiere conexión a internet. El sistema sigue grabando localmente aunque pierda conexión.' },
      { question: '¿Qué pasa si se corta la luz?', answer: 'Nuestras cámaras incluyen UPS integrado que permite hasta 4 horas de operación continua sin energía eléctrica.' },
      { question: '¿Ofrecen mantenimiento?', answer: 'Sí, tenemos planes de mantenimiento preventivo trimestral que incluyen limpieza de lentes, verificación de conexiones y actualización de firmware.' }
    ],
    stats: [
      { label: 'Cámaras instaladas', value: '2,000+' },
      { label: 'Clientes activos', value: '350+' },
      { label: 'Garantía equipos', value: '24 meses' }
    ]
  },

  'control-de-accesos': {
    serviceName: 'Control de Accesos',
    serviceSlug: 'control-de-accesos',
    intro: {
      paragraph1: 'En GuardMan Chile somos especialistas en sistemas de control de accesos para empresas, condominos y edificios. Nuestros lectores biométricos y tarjetas RFID le permiten saber quién entra y sale, cuándo y desde dónde.',
      paragraph2: 'Un sistema de control de accesos bien diseñado va más allá de abrir puertas. Registra cada ingreso, genera reportes de asistencia, limita horarios por empleado y alerta sobre intentos de acceso no autorizados.',
      paragraph3: 'Ofrecemos tecnología de punta: lectores de huella dactilar con precisión del 99.9%, tarjetas de proximidad compatibles con la normativa chilena, cerraduras electromagnéticas y software de gestión intuitivo.',
      paragraph4: 'Todos nuestros sistemas cuentan con respaldo en la nube y soporte técnico permanente, con técnicos disponibles las 24 horas para emergencias en toda la Región Metropolitana.'
    },
    features: [
      'Lectores biométricos de huella dactilar y reconocimiento facial',
      'Tarjetas RFID y tags de proximidad compatibles',
      'Cerraduras electromagnéticas y electroimanes de alta seguridad',
      'Software de gestión con reportes de asistencia y accesos',
      'Integración con sistemas de videovigilancia existentes',
      'Acceso remoto para administradores desde cualquier dispositivo'
    ],
    benefits: [
      'Control total: sabe exactamente quién accede a cada zona y a qué hora',
      'Sin llaves perdidas: cada empleado tiene su credential personal e intransferible',
      'Reportes automáticos: genere reportes de asistencia sin punches de reloj',
      'Seguridad reforzada: denied acceso automático fuera de horario o a personas desactivadas'
    ],
    issues: [
      'Llaves duplicadas que no se pueden controlar ni desactivar',
      'Sin registro de quién entra y sale de zonas restringidas',
      'Empleados que abren la puerta a personas no autorizadas'
    ],
    process: [
      { step: 'Levantamiento', description: 'Identificamos puertas, zonas críticas y cantidad de usuarios' },
      { step: 'Propuesta', description: 'Diseñamos el sistema con la mejor relación precio-cobertura' },
      { step: 'Instalación', description: 'Técnicos certificados instalan lectores, cableado y controlador' },
      { step: 'Configuración', description: 'Programamos horarios, permisos y enseñamos a usar el software' }
    ],
    faqs: [
      { question: '¿Qué incluye el servicio de Control de Accesos?', answer: 'El servicio incluye: lectores biométricos o RFID, controlador central, software de gestión, instalación profesional, configuración de permisos, capacitación y 12 meses de soporte técnico.' },
      { question: '¿Puedo controlar accesos desde mi celular?', answer: 'Sí, nuestra plataforma permite administrar usuarios, crear reportes y recibir alertas de intentos de acceso fallidos desde cualquier dispositivo con internet.' },
      { question: '¿Funciona sin energía eléctrica?', answer: 'Nuestras cerraduras electromagnéticas incluyen batería de respaldo que mantiene el sistema operativo hasta 8 horas sin energía.' },
      { question: '¿Cuántos usuarios puedo gestionar?', answer: 'El sistema base soporta hasta 1,000 usuarios. Para instalaciones más grandes, ofrecemos soluciones empresariales con hasta 10,000 usuarios.' },
      { question: '¿Ofrecen servicio de monitoreo 24/7?', answer: 'Sí, todos nuestros sistemas de control de accesos pueden integrarse con nuestro centro de monitoreo para alertas en tiempo real.' }
    ],
    stats: [
      { label: 'Lectores instalados', value: '800+' },
      { label: 'Empresas protegidas', value: '150+' },
      { label: 'Tiempo instalación', value: '1-3 días' }
    ]
  },

  'escoltas-privados': {
    serviceName: 'Escoltas Privados',
    serviceSlug: 'escoltas-privados',
    intro: {
      paragraph1: 'GuardMan Chile ofrece servicio de escoltas privados para ejecutivos, familias y personas que requieren protección personal. Nuestros escoltas son ex miembros de fuerzas armadas y Carabineros, entrenados en protección ejecutiva.',
      paragraph2: 'El servicio de escoltas está diseñado para personas que enfrentan riesgos específicos: ejecutivos de empresas, celebridades, testigos protegidos, víctimas de amenazas o familias que necesitan protección cerca de menores.',
      paragraph3: 'Cada escolta cuenta con curso de protección ejecutiva, primeros auxilios avanzados, manejo defensivo de vehículos y protocolos de respuesta ante emergencias. Operamos bajo la Ley 21.659 de Seguridad Privada.',
      paragraph4: 'Ofrecemos planes desde protección parcial (escolta en horarios específicos) hasta cobertura 24/7 con vehículos blindados y comunicación directa con centro de monitoreo.'
    },
    features: [
      'Ex袈s y Carabineros con experiencia en protección',
      'Capacitación en protección ejecutiva y manejo defensivo',
      'Vehículos equipados para protección móvil',
      'Comunicación directa con centro de monitoreo 24/7',
      'Evaluación de riesgos antes de iniciar el servicio',
      'Protocolos de respuesta ante emergencias personalizados'
    ],
    benefits: [
      'Protección física cerca de la persona en todo momento',
      'Evaluación continua de riesgos del entorno',
      'Disuasión efectiva: la presencia del escolta previene ataques',
      'Respuesta inmediata ante cualquier amenaza o emergencia'
    ],
    issues: [
      'Amenazas específicas que requieren protección personal',
      'Eventos públicos donde la seguridad personal es prioritaria',
      'Viajes a zonas de riesgo que requieren cobertura especializada'
    ],
    process: [
      { step: 'Evaluación de riesgo', description: 'Analizamos la situación y nivel de amenaza para diseñar el protocolo' },
      { step: 'Selección', description: 'Elegimos al escolta con el perfil adecuado para el caso' },
      { step: 'Briefing', description: 'Capacitamos al cliente sobre protocolos y comunicación' },
      { step: 'Despliegue', description: 'Iniciamos el servicio con cobertura acordada' }
    ],
    faqs: [
      { question: '¿Los escoltas están armados?', answer: 'No, nuestros escoltas operan sin armas de fuego, siguiendo la normativa chilena. Su protección se basa en prevención, disuasión y respuesta defensiva no letal.' },
      { question: '¿Puedo contratar escoltas solo para eventos específicos?', answer: 'Sí, ofrecemos servicio por evento para حفلات, presentaciones, reuniones de negocios y cualquier situación que requiera protección temporal.' },
      { question: '¿Los escoltas manejan vehículos?', answer: 'Sí, todos nuestros escoltas tienen licencia de conducir avanzada y están entrenados en manejo defensivo para proteger al protegido.' },
      { question: '¿Qué pasa si hay una emergencia?', answer: 'El escolta tiene comunicación directa con nuestro centro de monitoreo y conoce los protocolos de evacuación y contacto con Carabineros.' },
      { question: '¿Cómo inicio el servicio de escoltas?', answer: 'Llámenos al +56 9 3000 0010 para una evaluación confidencial. El servicio puede iniciarse en menos de 24 horas.' }
    ],
    stats: [
      { label: 'Escoltas disponibles', value: '50+' },
      { label: 'Clientes en protección', value: '25+' },
      { label: 'Años experiencia promedio', value: '12+' }
    ]
  },

  'monitoreo-24-7': {
    serviceName: 'Monitoreo 24/7',
    serviceSlug: 'monitoreo-24-7',
    intro: {
      paragraph1: 'GuardMan Chile cuenta con centro de monitoreo propio operativo las 24 horas, los 7 días de la semana. Más de 40 operadores trabajan en turnos para vigilar su propiedad y responder ante cualquier incidente en tiempo real.',
      paragraph2: 'Nuestro centro de monitoreo recibe señales de sensores de movimiento, alarmas, cámaras y botones de pánico. Cuando se detecta una anomalía, nuestros operadores verifican visualmente y coordinan la respuesta appropriateada.',
      paragraph3: 'La tecnología de nuestro centro incluye videowall con más de 100 cámaras en pantalla, software de gestión de eventos desarrollado internamente, y conexiones redundantes con proveedores de internet y energía.',
      paragraph4: 'Ofrecemos monitoreo para alarmas de intrusión, cámaras de videovigilancia, sensores ambientales (humo, inundación), control de accesos y GPS vehicular.'
    },
    features: [
      'Centro de monitoreo propio con más de 40 operadores',
      'Videowall con monitoreo en tiempo real de cámaras',
      'Respuesta ante emergencias en menos de 3 minutos',
      'Verificación visual de alarmas antes de contactar carabineros',
      'Notificaciones instantáneas vía SMS, email y app',
      'Respaldo eléctrico y de conectividad garantizado'
    ],
    benefits: [
      'Vigilancia continua sin depender de usted para reportar',
      'Respuesta inmediata ante cualquier emergencia las 24 horas',
      'Verificación profesional reduce falsos positivos',
      'Coordinación directa con Carabineros y servicios de emergencia'
    ],
    issues: [
      'Alarmas que no son atendidas o verificadas por nadie',
      'Emergencias que no se reportan a tiempo porque no hay quien vigile',
      'Sistemas de seguridad sin monitoreo que no previenen nada'
    ],
    process: [
      { step: 'Conexión', description: 'Instalamos el equipo de comunicación entre su sistema y nuestro centro' },
      { step: 'Configuración', description: 'Programamos zonas, horarios y contactos de notificación' },
      { step: 'Prueba', description: 'Realizamos pruebas de comunicación y respuesta' },
      { step: 'Monitoreo', description: 'Iniciamos la vigilancia 24/7 con operadores asignados' }
    ],
    faqs: [
      { question: '¿Qué pasa si se corta la luz o internet?', answer: 'Nuestras instalaciones tienen UPS con 4 horas de autonomía y conectividad celular de respaldo. El centro sigue operando incluso en灾难.' },
      { question: '¿Cómo sé que están vigilando?', answer: 'Recibirá reportes mensuales con métricas: eventos detectados, respuestas activadas, tiempo promedio de respuesta y estado del sistema.' },
      { question: '¿Puedo ver las cámaras desde la app de GuardMan?', answer: 'Sí, nuestra app permite ver sus cámaras en vivo, recibir notificaciones de eventos y solicitar el historial de grabaciones.' },
      { question: '¿Qué pasa si hay una intrusión?', answer: 'El operador verifica visualmente, contacta al cliente para confirmar si es emergencia real, y si no responde, coordina con Carabineros directamente.' },
      { question: '¿El servicio es solo para alarmas o también para cámaras?', answer: 'Monitoreamos cualquier señal: alarmas de intrusión, cámaras, sensores ambientales, control de accesos y GPS vehicular.' }
    ],
    stats: [
      { label: 'Propiedades monitoreadas', value: '500+' },
      { label: 'Operadores en centro', value: '40+' },
      { label: 'Tiempo respuesta promedio', value: '3 min' }
    ]
  },

  'seguridad-eventos': {
    serviceName: 'Seguridad para Eventos',
    serviceSlug: 'seguridad-eventos',
    intro: {
      paragraph1: 'GuardMan Chile ofrece servicio de seguridad para eventos corporativos, sociales y masivos en toda la Región Metropolitana. Contamos con personal entrenado para manejar desde reuniones íntimas hasta eventos con más de 5,000 asistentes.',
      paragraph2: 'La seguridad en eventos requiere planificación previa, evaluación de riesgos y coordinación con autoridades. Nuestro equipo incluye coordinadores de seguridad certificados que diseñan el plan según el tipo de evento.',
      paragraph3: 'Para eventos corporativos ofrecemos discretos escoltas para ejecutivos y invitados VIP. Para conciertos y festivales desplegamos equipos completos de Control Masivo (OS-10) con experiencia en ese tipo de operations.',
      paragraph4: 'Todos nuestros efectivos para eventos cuentan con certificación OS-10 vigente y han sido capacitados en manejo de multitudes, primeros auxilios y protocolos de evacuación.'
    },
    features: [
      'Coordinadores de seguridad certificados para planificar el evento',
      'Guardias OS-10 capacitados en control masivo',
      'Escoltas VIP discretos para invitados especiales',
      'Postes de control y arcos detectores de metales',
      'Comunicación radial y coordinación con Carabineros',
      'Servicio de primeros auxilios con botiquín completo'
    ],
    benefits: [
      'Planificación profesional desde 2 semanas antes del evento',
      'Personal con experiencia en eventos similares',
      'Coordinación con Carabineros y servicios de emergencia',
      'Imagen profesional: guardias uniformados que dan confianza'
    ],
    issues: [
      'Eventos sin control de accesos que permiten entrada de personas no autorizadas',
      'Crowds que se descontrolan por falta de personal capacitado',
      'Robos durante eventos por falha en la seguridad perimetral'
    ],
    process: [
      { step: 'Reunión inicial', description: 'Entendemos el tipo de evento, cantidad esperada y nivel de riesgo' },
      { step: 'Planificación', description: 'Diseñamos el esquema de seguridad con puestos y recursos' },
      { step: 'Coordinación', description: 'Contactamos a Carabineros y otros servicios si es necesario' },
      { step: 'Ejecución', description: 'Desplegamos el personal y supervisamos durante todo el evento' }
    ],
    faqs: [
      { question: '¿Con cuánta anticipación debo contratar seguridad para mi evento?', answer: 'Recomendamos contactar con al menos 2 semanas de anticipación. Para eventos masivos (>1,000 personas) necesitamos 1 mes.' },
      { question: '¿Cuántos guardias necesito para mi evento?', answer: 'La cantidad depende del tipo de evento y número esperado. Por regla general: 1 guardia cada 100 personas para eventos sociales, 1 cada 50 para corporativos.' },
      { question: '¿Incluyen arcos detectores y postes de seguridad?', answer: 'Sí, ofrecemos el equipment necesario como parte del servicio. Incluye arcos, postes, detectores de metales porttiles y equipos de comunicación.' },
      { question: '¿Pueden coordinar con Carabineros?', answer: 'Sí, gestionamos los permisos necesarios ante Carabineros y coordinamos la presencia de efectivo público si el evento lo requiere.' },
      { question: '¿Qué pasa si hay una emergencia durante el evento?', answer: 'Nuestros guardias están entrenados en primeros auxilios y evacuación. Activan protocolos de emergencia y contactan a servicios profesionales inmediatamente.' }
    ],
    stats: [
      { label: 'Eventos atendidos', value: '300+' },
      { label: 'Asistentes protegidos', value: '50,000+' },
      { label: 'Eventos masivos (>1000)', value: '50+' }
    ]
  },

  'seguridad-industrial': {
    serviceName: 'Seguridad Industrial',
    serviceSlug: 'seguridad-industrial',
    intro: {
      paragraph1: 'GuardMan Chile ofrece soluciones de seguridad industrial para fábricas, bodegas, centros logísticos y zonas industriales. Entendemos los riesgos específicos de cada sector y diseñamos esquemas adaptados a la realidad de su operación.',
      paragraph2: 'La seguridad industrial requiere vigilancia perimetral, control de acceso de vehículos y personas, y protocolos específicos para áreas clasificadas. Nuestros guardias están entrenados en prevención de accidentes y manejo de materiales peligrosos.',
      paragraph3: 'Ofrecemos servicios diurnos y nocturnos, con énfasis en la protección de activos, prevención de robos de merchandise y control de acceso de contractors y visitantes.',
      paragraph4: 'Todos nuestros guardias industriales cuentan con formación en seguridad ocupacional y están certificados para operar en entornos de alto riesgo.'
    },
    features: [
      'Vigilancia perimetral con rondas programdas',
      'Control de acceso vehicular y peatonal',
      'Registro de contractors y visitantes con photo ID',
      'Monitoreo de cámaras con enfoque en zonas críticas',
      'Control de horario de turnos y asistencia',
      'Reporte de novedades con fotografías del evento'
    ],
    benefits: [
      'Protección de activos y equipment costoso',
      'Control de quién entra y sale de la instalación',
      'Prevención de robos internos y externos',
      'Cumplimiento de normas de seguridad laboral'
    ],
    issues: [
      'Robos de materiales y equipos de alto valor',
      'Acceso no autorizado de personas ajenas a la empresa',
      'Falta de control sobre contractors y visitas'
    ],
    process: [
      { step: 'Análisis', description: 'Evaluamos la instalación, Riesgos y operación de la empresa' },
      { step: 'Diseño', description: 'Creamos el esquema de seguridad con puestos estratégicos' },
      { step: 'Implementación', description: 'Capacitamos al personal en los protocolos específicos' },
      { step: 'Operación', description: 'Iniciamos el servicio con supervisón continua' }
    ],
    faqs: [
      { question: '¿Los guardias tienen experiencia en entornos industriales?', answer: 'Sí, nuestros guardias industriales son seleccionados por su experiencia en el sector y capacitados en seguridad ocupacional, prevención de accidentes y manejo de emergencias.' },
      { question: '¿Cómo controlan el acceso de vehículos?', answer: 'Contamos con garitas equipadas con barreras, cámaras de lectura de patentes y sistema de registro de vehículos autorizados.' },
      { question: '¿El servicio funciona 24/7?', answer: 'Sí, ofrecemos cobertura continua para operaciones que trabajan las 24 horas, con personal de relevo y supervisón constante.' },
      { question: '¿Pueden integrar su servicio con mis cámaras existentes?', answer: 'Sí, podemos monitorear sus cámaras desde nuestro centro de operaciones y coordinar con los guardias en terreno.' },
      { question: '¿Qué reportes recibo?', answer: 'Recibe reportes diarios por email con novedades, conteo de ingresos/egresos, fotografía de incidentes y métricas de turno.' }
    ],
    stats: [
      { label: 'Plantas industriales protegidas', value: '40+' },
      { label: 'Bodegas aseguradas', value: '60+' },
      { label: 'Horas sin incidentes', value: '500,000+' }
    ]
  },

  'auditoria-seguridad': {
    serviceName: 'Auditoría de Seguridad',
    serviceSlug: 'auditoria-seguridad',
    intro: {
      paragraph1: 'GuardMan Chile ofrece servicios de auditoría y consultoría de seguridad para empresas que quieren evaluar sus vulnerabilidades y diseñar mejoras. Nuestros auditores tienen más de 10 años de experiencia en seguridad privada y pública.',
      paragraph2: 'La auditoría de seguridad es el primer paso para proteger su empresa. Analizamos puntos débiles, evaluamos la competencia de su personal actual y recomendamos mejoras basadas en estándares internacionales.',
      paragraph3: 'Nuestro servicio incluye evaluación física (accesos, cámaras, iluminación), evaluación documental (protocolos, certificaciones), y evaluación tecnológica (sistemas de alarma, control de accesos).',
      paragraph4: 'Al finalizar la auditoría, entregamos un informe detallado con hallazgos, nivel de riesgo y plan de mejoras priorizadas por urgencia y presupuesto.'
    },
    features: [
      'Evaluación de seguridad física: accesos, cerraduras, iluminación',
      'Revisión de sistemas de alarma y videovigilancia',
      'Auditoría de personal de seguridad y sus certificaciones',
      'Análisis de vulnerabilidades y nivel de riesgo',
      'Plan de mejoras priorizadas por urgencia',
      'Informe ejecutivo con recomendaciones'
    ],
    benefits: [
      'Conocer las vulnerabilidades antes que los delincuentes',
      'Informe objective que no está atado a venta de servicios',
      'Recomendaciones prácticas según su presupuesto',
      'Baseline para medir mejoras en el futuro'
    ],
    issues: [
      'Seguridad improvisada sin evaluación profesional',
      'Sistemas de seguridad sin mantenimiento ni actualización',
      'Personal de seguridad sin certificaciones ni entrenamiento'
    ],
    process: [
      { step: 'Levantamiento', description: 'Visitamos su empresa y documentamos el estado actual de seguridad' },
      { step: 'Análisis', description: 'Evaluamos cada punto con checklists internacionales' },
      { step: 'Informe', description: 'Entregamos documento detallado con hallazgos y recomendaciones' },
      { step: 'Seguimiento', description: 'Opcional: acompañamos la implementación de mejoras' }
    ],
    faqs: [
      { question: '¿Cuánto cuesta una auditoría de seguridad?', answer: 'El valor depende del tamaño de la empresa y alcance de la auditoría. Para empresas pequeñas (hasta 500m²) el valor parte desde $350.000. Solicite cotización.' },
      { question: '¿Cuánto tiempo toma la auditoría?', answer: 'Para empresas medianas, la auditoría toma entre 2 y 5 días hábiles de trabajo en terreno, más 1 semana para elaborar el informe.' },
      { question: '¿La auditoría incluye pruebas técnicas?', answer: 'Sí, probamos los sistemas de alarma, cámaras y control de accesos para verificar que funcionen correctamente.' },
      { question: '¿El informe es confidencial?', answer: 'Sí, el informe es propiedad del cliente y no compartimos información con terceros. Guardamos confidencialidad absoluta.' },
      { question: '¿Pueden implementar las recomendaciones ustedes mismos?', answer: 'Sí, ofrecemos servicio de implementación de mejoras después de la auditoría, pero el cliente tiene total libertad de contratar a otros proveedores.' }
    ],
    stats: [
      { label: 'Auditorías realizadas', value: '100+' },
      { label: 'Empresas evaluadas', value: '80+' },
      { label: 'Vulnerabilidades detectadas', value: '500+' }
    ]
  },

  'guard-pod': {
    serviceName: 'Guard Pod',
    serviceSlug: 'guard-pod',
    intro: {
      paragraph1: 'Guard Pod es la solución de vigilancia móvil patentada por GuardMan Chile. Se trata de una unidad autónoma de vigilancia con cámaras, sensores de movimiento, sirena y comunicación satelital, que se instala donde necesita protección temporal.',
      paragraph2: 'El Guard Pod es ideal para obras en construcción, eventos temporales, zonas con alto riesgo de robo, o cualquier lugar donde no existe infraestructura de seguridad. Funciona con energía solar y conexión celular, sin necesidad de electricidad ni internet.',
      paragraph3: 'El Guard Pod detecta movimiento en un radio de 30 metros, activa sirena y luces LED, graba video en alta definición, y envía alertas en tiempo real a nuestro centro de monitoreo. Un operador verifica y coordina la respuesta appropriateada.',
      paragraph4: 'Es la solución más efectiva para prevenir robos en obras: según datos de la Cámara Chilena de la Construcción, el 40% de las obras de construcción suffered algún tipo de robo. Con Guard Pod, esa estadística se reduce drásticamente.'
    },
    features: [
      'Cámaras HD con visión nocturna y detección de movimiento',
      'Sirena de 120dB y luces LED de alta potencia',
      'Comunicación celular con centro de monitoreo 24/7',
      'Energía solar con batería de respaldo de 72 horas',
      'Instalación en menos de 30 minutos',
      'Alquiler mensual sin contrato mínimo'
    ],
    benefits: [
      'Protección inmediata en zonas sin infraestructura',
      'Alta disuasión: la sirena y las luces LED prevenan robos',
      'Monitoreo remoto sin costo de vigilancia humana permanente',
      'Sin cables ni instalaciones permanentes'
    ],
    issues: [
      'Obras sin protección que sufren robos de materials',
      'Eventos temporales sin seguridad perimetral',
      'Zonas rurales con alto índice de robos sin vigilancia'
    ],
    process: [
      { step: 'Cotización', description: 'Evaluamos la zona a proteger y recomendamos cantidad de Pods' },
      { step: 'Entrega', description: 'Entregamos los Pods instalados y configurados' },
      { step: 'Monitoreo', description: 'Nuestro centro vigila las 24 horas' },
      { step: 'Retiro', description: 'Cuando ya no lo necesite, lo recolhemos sin costo' }
    ],
    faqs: [
      { question: '¿Qué incluye el servicio de Guard Pod?', answer: 'El alquiler mensual incluye: unidad Guard Pod con cámaras y sensores, energía solar, comunicación celular, monitoreo 24/7 desde nuestro centro, alertas en tiempo real y soporte técnico.' },
      { question: '¿Funciona sin luz ni internet?', answer: 'Sí, el Guard Pod funciona completamente con energía solar y conexión celular. No necesita ningún cableado.' },
      { question: '¿Puedo ver las cámaras desde mi celular?', answer: 'Sí, nuestra app permite ver las cámaras en vivo, recibir alertas y ver grabaciones de eventos.' },
      { question: '¿Qué pasa si alguien intenta robar algo de todas formas?', answer: 'El Pod detecta el movimiento, activa sirena y luces, envía alerta a nuestro centro, y el operador coordina con Carabineros mientras el ladrón huye.' },
      { question: '¿Hay costo de instalación o retiro?', answer: 'No, la entrega y retiro son gratuitos en la Región Metropolitana. El único costo es el alquiler mensual.' }
    ],
    stats: [
      { label: 'Guard Pods en operación', value: '30+' },
      { label: 'Obras protegidas', value: '25+' },
      { label: 'Robos prevenidos', value: '100+' }
    ]
  }
};

// Get default spec for unknown services
function getDefaultSpec(serviceName: string, serviceSlug: string): ContentSpec {
  return {
    serviceName,
    serviceSlug,
    intro: {
      paragraph1: `En GuardMan Chile ofrecemos el mejor servicio de ${serviceName.toLowerCase()} en Santiago. Con años de experiencia y un equipo altamente capacitado, brindamos soluciones de seguridad adaptadas a sus necesidades.`,
      paragraph2: 'Nuestro compromiso es la prevención. Trabajamos para evitar incidentes de seguridad antes de que ocurran, protegiendo a sus colaboradores, clientes y activos.',
      paragraph3: 'Contamos con tecnología de vanguardia y personal certificado bajo la normativa chilena de seguridad privada.',
      paragraph4: 'Operamos las 24 horas, los 7 días de la semana, en toda la Región Metropolitana.'
    },
    features: [
      'Personal certificado y experimentado',
      'Cobertura las 24 horas, 7 días a la semana',
      'Tecnología de última generación',
      'Centro de monitoreo propio',
      'Respuesta inmediata ante emergencias',
      'Reportes y métricas de gestión'
    ],
    benefits: [
      'Protección profesional de sus activos',
      'Prevención de incidentes de seguridad',
      'Tranquilidad para su operación'
    ],
    issues: [
      'Falta de control de seguridad',
      'Necesidad de protección profesional',
      'Vulnerabilidades en su instalación'
    ],
    process: [
      { step: 'Consulta', description: 'Evaluamos sus necesidades de seguridad' },
      { step: 'Propuesta', description: 'Diseñamos una solución a su medida' },
      { step: 'Implementación', description: 'Ejecutamos el plan con personal capacitado' }
    ],
    faqs: [
      { question: '¿Cómo contrato el servicio?', answer: 'Llámenos al +56 9 3000 0010 o complete el formulario de cotización en nuestro sitio web.' },
      { question: '¿Cuánto cuesta?', answer: 'El precio depende de sus necesidades específicas. Solicite una cotización personalizada.' },
      { question: '¿Cubren mi zona?', answer: 'Operamos en toda la Región Metropolitana con tiempos de respuesta inferiores a 30 minutos.' },
      { question: '¿Están certificados?', answer: 'Sí, todo nuestro personal cuenta con certificaciones vigentes según la Ley 21.659.' },
      { question: '¿Ofrecen soporte 24/7?', answer: 'Sí, nuestro centro de monitoreo opera las 24 horas con operadores listos para atender cualquier emergencia.' }
    ],
    stats: [
      { label: 'Clientes atendidos', value: '200+' },
      { label: 'Años experiencia', value: '8+' },
      { label: 'Personal operativo', value: '500+' }
    ]
  };
}

export function generateServiceContent(serviceSlug: string, serviceName: string): any {
  const spec = SERVICE_SPECS[serviceSlug] || getDefaultSpec(serviceName, serviceSlug);
  
  const intro = [
    spec.intro.paragraph1,
    spec.intro.paragraph2,
    spec.intro.paragraph3,
    spec.intro.paragraph4
  ].join('\n\n');

  return {
    seo_title: `${spec.serviceName} en Chile | GuardMan Chile`,
    meta_description: `Empresa líder con guardias OS-10 certificados. ${spec.serviceName} disponible 24/7 en toda la Región Metropolitana. Solicita cotización gratis.`,
    h1: spec.serviceName,
    hero_subtitle: `Protección profesional con guardias certificados y respaldo de centro de monitoreo propio`,
    intro_paragraph: intro,
    features: spec.features,
    benefits: spec.benefits,
    common_issues: spec.issues,
    process: spec.process,
    faqs: spec.faqs,
    stats: spec.stats,
    cta_text: `Cotiza ${spec.serviceName} hoy`
  };
}

export function generateLocationContent(locationName: string, zone: string): any {
  const zoneDescriptions: Record<string, string> = {
    'Oriente': `${locationName} es una de las zonas más exclusivas de Santiago. La seguridad residencial y comercial aquí requiere soluciones sofisticadas y discretas. Contamos con guardias experimentados que conocen las dinámicas del sector.`,
    'Centro': `${locationName} concentra alta actividad comercial y empresarial. Nuestros servicios de seguridad ayudan a proteger locales comerciales, oficinas y edificios de departamentos.`,
    'Industrial': `${locationName} tiene gran actividad industrial y logística. Ofrecemos soluciones de seguridad perimetral y control de acceso para bodegas, fábricas y centros de distribución.`,
    'Norte': `${locationName} es una zona en constante crecimiento con proyectos inmobiliarios y comerciales. GuardMan ofrece soluciones de seguridad adaptadas a las necesidades de la zona norte.`,
    'default': `${locationName} es parte de nuestra zona de cobertura. Contamos con guardias disponibles y tiempos de respuesta inferiores a 30 minutos.`
  };

  const desc = zoneDescriptions[zone] || zoneDescriptions['default'];

  return {
    seo_title: `Seguridad Privada en ${locationName} | GuardMan Chile`,
    meta_description: `Empresa líder con guardias OS-10 en ${locationName}. Cobertura 24/7, centros comerciales, edificios y residencias. Cotiza gratis.`,
    h1: `Seguridad Privada en ${locationName}`,
    intro_paragraph: desc,
    why_this_zone: `${locationName} requiere atención especial en seguridad por su actividad ${zone === 'Oriente' ? 'residencial premium' : zone === 'Industrial' ? 'industrial' : 'comercial y mixta'}. Contamos con personal desplegado en la zona listo para atender sus necesidades.`,
    landmarks: generateZoneLandmarks(locationName, zone),
    neighborhoods: generateZoneNeighborhoods(locationName),
    stats: generateLocationStats(locationName),
    common_issues: generateLocationIssues(locationName, zone),
    faqs: generateLocationFAQs(locationName),
    cta_text: `Protege tu propiedad en ${locationName}`
  };
}

// Helper functions
function generateZoneLandmarks(location: string, zone: string): string[] {
  const landmarks: Record<string, string[]> = {
    'las-condes': ['Apoquindo', 'Manquehue', 'Hernardo de Magallanes', 'Parque Arauco'],
    'vitacura': ['Santa María de Manquehue', 'Camino a Hortografía', 'Rotonda Pérez Zeledón'],
    'santiago-centro': ['Plaza de Armas', 'Paseo Ahumada', 'Metro Universidad de Chile'],
    'huechuraba': ['Ciudad Empresarial', 'Plaza Norte', 'Av. Pedro Fontoye'],
    'quilicura': ['Plaza de Quilicura', 'Av. San Martín', 'Sector Lo Cruz'],
    'lo-barnechea': ['La Dehesa', 'Club de Golf Los Andes', 'Av. El Rodeo'],
    'la-reina': ['Plaza La Reina', 'Av. Larraín', 'Parque Juan XXIII'],
    'renca': ['Plaza de Renca', 'Av. Argentina', 'Sector Santa la Rana'],
    'pudahuel': ['Plaza de Pudahuel', 'Av. Teniente Cruz', 'Cerro San Cristóbal'],
    'la-pintana': ['Plaza La Pintana', 'Av. Santa Rosa', 'Sector Nos'],
    'lampa': ['Plaza de Lampa', 'Camino Lampa', 'Sector Til Til'],
    'conchali': ['Plaza de Conchalí', 'Av. Recoleta', 'Sector norte'],
    'los-andes': ['Plaza de Los Andes', 'Av. Argentina', 'Camino a Chile'],
    'san-felipe': ['Plaza de San Felipe', 'Av. Libertador', 'Sector El Salto']
  };
  
  return landmarks[location] || [`Sector centro de ${location}`, `Sector residencial`, `Sector comercial`];
}

function generateZoneNeighborhoods(location: string): string[] {
  return [
    `Zona norte de ${location}`,
    `Zona centro de ${location}`,
    `Zona sur de ${location}`
  ];
}

function generateLocationStats(location: string): any {
  return {
    empresas_protegidas: '20+',
    guardias_en_zona: '30+',
    tiempo_respuesta: '< 30 min'
  };
}

function generateLocationIssues(location: string, zone: string): string[] {
  return [
    'Accesos no controlados en edificios y condominos',
    `Falta de vigilancia en zonas ${zone === 'Industrial' ? 'industriales' : 'residenciales'}`,
    'Robos en vehículos y residencias'
  ];
}

function generateLocationFAQs(location: string): any[] {
  return [
    { question: `¿Hay disponibilidad de guardias en ${location}?`, answer: `Sí, tenemos guardias disponibles desplegados en ${location} listos para comenzar el servicio.` },
    { question: `¿Cuál es el tiempo de respuesta en ${location}?`, answer: `Nuestro tiempo de respuesta en ${location} es inferior a 30 minutos desde cualquier punto de la comuna.` },
    { question: '¿Qué tipos de propiedades protegen?', answer: 'Protegemos empresas, condominos, residencias, obras y cualquier tipo de propiedad que necesite seguridad.' }
  ];
}

export function generateComboContent(serviceName: string, serviceSlug: string, locationName: string, locationSlug: string): any {
  return {
    seo_title: `${serviceName} en ${locationName} | GuardMan`,
    meta_description: `${serviceName} en ${locationName} con guardias certificados OS-10. Disponible 24/7. Cotiza ahora.`,
    h1: `${serviceName} en ${locationName}`,
    intro_paragraph: `El servicio de ${serviceName.toLowerCase()} en ${locationName} está disponible a través de GuardMan Chile. Contamos con guardias certificados y experiencia en la zona para brindarle la mejor protección.`,
    local_context: `${locationName} requiere soluciones de seguridad adaptadas a sus características. Nuestro equipo conoce la zona y puede desplegar el servicio rápidamente.`,
    service_in_location: `En ${locationName}, el ${serviceName.toLowerCase()} se adapta a las necesidades específicas del sector, ya sea residencial, comercial o industrial.`,
    faqs: [
      { question: `¿Hay disponibilidad de ${serviceName.toLowerCase()} en ${locationName}?`, answer: `Sí, tenemos personal y equipos disponibles para comenzar el servicio en ${locationName} de inmediato.` },
      { question: `¿Cuál es el tiempo de implementación en ${locationName}?`, answer: `Podemos iniciar el servicio en ${locationName} en menos de 48 horas desde la confirmación.` }
    ],
    cta_text: `Cotiza ${serviceName} en ${locationName}`,
    cta_button: 'Solicitar Cotización Gratis'
  };
}