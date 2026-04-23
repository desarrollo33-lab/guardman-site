
const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>GuardMan Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-slate-950 text-white">
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect } = React;
    const API = window.location.origin;
    
    function App() {
      const [user, setUser] = useState(null);
      useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (token) setUser({ email: 'admin@guardman.cl' });
      }, []);
      if (!user) return <Login onLogin={setUser} />;
      return <Dashboard user={user} onLogout={() => { localStorage.removeItem('admin_token'); setUser(null); }} />;
    }
    
    function Login({ onLogin }) {
      const [email, setEmail] = useState('admin@guardman.cl');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      
      const submit = async (e) => {
        e.preventDefault();
        const res = await fetch(API + '/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.ok) {
          localStorage.setItem('admin_token', data.data.token);
          onLogin(data.data.user);
        } else {
          setError(data.error);
        }
      };
      
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-sm p-8 bg-slate-900 rounded-xl border border-slate-800">
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🛡️</div>
              <h1 className="text-2xl font-bold">GuardMan Admin</h1>
            </div>
            {error && <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-lg text-sm">{error}</div>}
            <form onSubmit={submit} className="space-y-4">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="Email" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="Contraseña" />
              <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold">Iniciar Sesión</button>
            </form>
          </div>
        </div>
      );
    }
    
    function ContentEditor() {
      const [entityType, setEntityType] = useState('service');
      const [entities, setEntities] = useState([]);
      const [selectedSlug, setSelectedSlug] = useState('');
      const [content, setContent] = useState(null);
      const [versions, setVersions] = useState([]);
      const [loading, setLoading] = useState(false);
      const [saving, setSaving] = useState(false);
      const [generating, setGenerating] = useState(false);
      const [jsonError, setJsonError] = useState('');
      const [editJson, setEditJson] = useState('');
      
      useEffect(() => {
        loadEntities();
      }, [entityType]);
      
      useEffect(() => {
        if (selectedSlug) {
          loadContent();
          loadVersions();
        }
      }, [selectedSlug]);
      
      const loadEntities = async () => {
        const token = localStorage.getItem('admin_token');
        const res = await fetch(API + '/api/' + entityType + 's', { headers: { 'Authorization': 'Bearer ' + token } });
        const json = await res.json();
        if (json.ok) {
          setEntities(json.data);
          if (json.data.length > 0) setSelectedSlug(json.data[0].slug);
        }
      };
      
      const getDefaultTemplate = () => {
        const entity = entities.find(e => e.slug === selectedSlug);
        const name = entity?.name || selectedSlug;
        
        if (entityType === 'location') {
          return {
            hero: { heading: 'Seguridad Privada en ' + name + ' | GuardMan Chile', subheading: 'Servicios profesionales en ' + name },
            metaTitle: 'Seguridad ' + name + ' Santiago | GuardMan',
            metaDescription: 'Contrata seguridad privada en ' + name + '. Guardias OS-10 certificados.',
            intro: { heading: 'Servicios en ' + name, paragraphs: ['Ofrecemos seguridad privada profesional en ' + name + '.', 'Guardias certificados OS-10.'] },
            features: { heading: 'Por que elegirnos en ' + name, items: ['Cobertura inmediata', 'Guardias OS-10', 'Vehiculos 24/7', 'Coordinacion Carabineros', 'Protocolos adaptados', 'Monitoreo central'] },
            services: { heading: 'Servicios disponibles', items: ['Guardias de seguridad', 'CCTV', 'Control accesos', 'Rondas preventivas'] },
            faqs: { heading: 'Preguntas frecuentes', items: [{question: 'Operan en ' + name + '?', answer: 'Si, cobertura total.'}, {question: 'Tiempo de respuesta?', answer: '5-10 minutos promedio.'}] },
            cta: { heading: 'Proteja su propiedad en ' + name, subheading: 'Cotizacion gratuita en 24 horas', button: 'Solicitar Cotizacion' }
          };
        } else if (entityType === 'sector') {
          return {
            hero: { heading: 'Seguridad Sector ' + name + ' | GuardMan Chile', subheading: 'Soluciones para el sector ' + name },
            metaTitle: 'Seguridad Sector ' + name + ' | GuardMan',
            metaDescription: 'Seguridad privada especializada para empresas del sector ' + name + '.',
            intro: { heading: 'Proteccion para Sector ' + name, paragraphs: ['Entendemos los riesgos del sector ' + name + '.', 'Mas de 8 anos de experiencia.'] },
            features: { heading: 'Ventajas para el sector ' + name, items: ['Personal capacitado', 'Protocolos adaptados', 'Cumplimiento normativas', 'Reportes personalizados', 'Coordinacion autoridades', 'Planes escalables'] },
            risks: { heading: 'Riesgos que mitigamos', items: ['Accesos no autorizados', 'Sustraccion de bienes', 'Incidentes de seguridad', 'Emergencias'] },
            faqs: { heading: 'Preguntas frecuentes', items: [{question: 'Tienen experiencia?', answer: 'Si, amplia trayectoria.'}, {question: 'Servicio 24/7?', answer: 'Si, monitoreo continuo.'}] },
            cta: { heading: 'Asegure su empresa del sector ' + name, subheading: 'Propuesta personalizada para su industria', button: 'Cotizar Ahora' }
          };
        } else {
          return {
            hero: { heading: name + ' en Santiago | GuardMan Chile', subheading: 'Servicio profesional de ' + name },
            metaTitle: name + ' Santiago | GuardMan OS-10',
            metaDescription: 'Contrata ' + name + ' en Santiago. Cotiza gratis.',
            intro: { heading: name + ' con Excelencia', paragraphs: ['Servicio profesional con estandares OS-10.', 'Mas de 8 anos de experiencia.'] },
            features: { heading: 'Caracteristicas de ' + name, items: ['Personal OS-10 certificado', 'Cobertura 24/7', 'Respuesta inmediata', 'Tecnologia avanzada', 'Protocolos estrictos', 'Monitoreo continuo'] },
            issues: { heading: 'Cuando lo necesitas?', items: ['Incidentes de seguridad', 'Accesos no autorizados', 'Falta de vigilancia', 'Eventos especiales'] },
            stats: { heading: 'Nuestros Numeros', items: [{label: 'Anos', value: '8+'}, {label: 'Guardias', value: '500+'}] },
            faqs: { heading: 'Preguntas Frecuentes', items: [{question: 'Como contratar?', answer: 'Contactanos para cotizacion.'}, {question: 'Tienen garantia?', answer: 'Si, garantia de satisfaccion.'}] },
            cta: { heading: 'Contrata Hoy', subheading: 'Cotizacion gratis en 24 horas', button: 'Solicitar Cotizacion' }
          };
      
