# GUARDMAN ADMIN PANEL - PROMPT DE EJECUCIÓN COMPLETA

## CONTEXTO

Proyecto existente: `C:\Users\56930\OneDrive\Escritorio\guardman-site`
- Worker API: https://guardman-agent.oficinadesarrollo33.workers.dev
- D1 Database: guardman-seo (ID: aeaab85c-d4df-46c4-96b9-28d6a95aaec4)

**OBJETIVO:** Crear Admin Panel externo en `C:\Users\56930\OneDrive\Escritorio\guardman-admin`

---

## TAREA

Implementa el GuardMan Admin Panel completo siguiendo el plan de implementación. Ejecuta sin intervención humana hasta completitud.

---

## PASO 1: Crear proyecto base

```bash
cd "C:\Users\56930\OneDrive\Escritorio"
mkdir guardman-admin
cd guardman-admin
npm init -y
```

## PASO 2: Instalar dependencias

```bash
npm install react react-dom lucide-react clsx
npm install -D wrangler vite typescript @types/react @types/react-dom @vitejs/plugin-react tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## PASO 3: Configurar TypeScript (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
```

## PASO 4: Configurar Vite (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', sourcemap: true },
  root: 'src'
});
```

## PASO 5: Crear Tailwind config (tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: { extend: {} },
  plugins: [],
};
```

## PASO 6: Crear wrangler.jsonc

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "guardman-agent",
  "main": "src/host.ts",
  "compatibility_date": "2024-01-01",
  "assets": {
    "not_found_handling": "single-page-application",
    "run_worker_first": ["/api/*"]
  },
  "worker_loaders": [{ "binding": "LOADER" }],
  "d1_databases": [{ "binding": "DB", "database_name": "guardman-seo", "database_id": "aeaab85c-d4df-46c4-96b9-28d6a95aaec4" }],
  "r2_buckets": [{ "binding": "IMAGES", "bucket_name": "guardman-images" }],
  "kv_namespaces": [{ "binding": "SESSIONS", "id": "tu-kv-id-aqui" }],
  "ai": {},
  "vars": { "ENVIRONMENT": "production", "ADMIN_EMAIL": "admin@guardman.cl" }
}
```

## PASO 7: Crear src/host.ts (Dynamic Worker Host)

```typescript
export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  SESSIONS: KVNamespace;
  AI: Ai;
  LOADER: WorkerLoader;
  AUTH_TOKEN: string;
  ENVIRONMENT: string;
  ADMIN_EMAIL: string;
}

const WORKER_TEMPLATES = {
  services: `export default {
  async fetch(request, env) {
    const { action, id, data } = await request.json();
    if (action === 'list') {
      const { results } = await env.DB.prepare('SELECT * FROM services ORDER BY name').all();
      return Response.json({ ok: true, data: results });
    }
    if (action === 'get') {
      const result = await env.DB.prepare('SELECT * FROM services WHERE slug = ?').bind(id).first();
      return Response.json({ ok: true, data: result });
    }
    if (action === 'create') {
      const { slug, name, short_description } = data;
      await env.DB.prepare('INSERT INTO services (slug, name, short_description, status) VALUES (?, ?, ?, ?)').bind(slug, name, short_description, 'pending').run();
      return Response.json({ ok: true });
    }
    if (action === 'update') {
      const { name, short_description, status } = data;
      await env.DB.prepare('UPDATE services SET name = ?, short_description = ?, status = ? WHERE slug = ?').bind(name, short_description, status, id).run();
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false, error: 'Unknown action' }, { status: 400 });
  }
};`,
  locations: `export default {
  async fetch(request, env) {
    const { action, id } = await request.json();
    if (action === 'list') {
      const { results } = await env.DB.prepare('SELECT * FROM locations ORDER BY name').all();
      return Response.json({ ok: true, data: results });
    }
    if (action === 'get') {
      const result = await env.DB.prepare('SELECT * FROM locations WHERE slug = ?').bind(id).first();
      return Response.json({ ok: true, data: result });
    }
    return Response.json({ ok: false, error: 'Unknown action' }, { status: 400 });
  }
};`,
  sections: `export default {
  async fetch(request, env) {
    const { action, serviceSlug, sectionKey, data } = await request.json();
    if (action === 'get') {
      const { results } = await env.DB.prepare('SELECT * FROM service_sections WHERE service_slug = ? ORDER BY section_order').bind(serviceSlug).all();
      return Response.json({ ok: true, data: results });
    }
    if (action === 'update') {
      const { heading, subheading, content_json } = data;
      await env.DB.prepare('UPDATE service_sections SET heading = ?, subheading = ?, content_json = ? WHERE service_slug = ? AND section_key = ?').bind(heading, subheading, content_json, serviceSlug, sectionKey).run();
      return Response.json({ ok: true });
    }
    return Response.json({ ok: false, error: 'Unknown action' }, { status: 400 });
  }
};`,
  images: `export default {
  async fetch(request, env) {
    const { action, slug } = await request.json();
    if (action === 'list') {
      const { results } = await env.DB.prepare('SELECT * FROM images ORDER BY created_at DESC LIMIT 100').all();
      return Response.json({ ok: true, data: results });
    }
    if (action === 'upload') {
      const { filename, content, contentType, entity_type } = data;
      const ext = filename.split('.').pop() || 'webp';
      const key = 'images/' + slug + '.' + ext;
      await env.IMAGES.put(key, content, { httpMetadata: { contentType } });
      await env.DB.prepare('INSERT INTO images (slug, url, entity_type, status) VALUES (?, ?, ?, ?)').bind(slug, '/' + key, entity_type || 'generic', 'uploaded').run();
      return Response.json({ ok: true, data: { url: '/' + key } });
    }
    return Response.json({ ok: false, error: 'Unknown action' }, { status: 400 });
  }
};`
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

    const authHeader = request.headers.get('Authorization');
    if (path !== '/health' && path !== '/api/login' && authHeader !== 'Bearer ' + env.AUTH_TOKEN) {
      return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    try {
      if (path === '/api/templates' && request.method === 'GET') {
        return Response.json({ ok: true, data: Object.keys(WORKER_TEMPLATES) }, { headers: corsHeaders });
      }
      if (path.startsWith('/api/templates/') && request.method === 'GET') {
        const templateName = path.split('/')[3];
        const code = WORKER_TEMPLATES[templateName as keyof typeof WORKER_TEMPLATES];
        if (!code) return Response.json({ ok: false, error: 'Not found' }, { status: 404, headers: corsHeaders });
        return Response.json({ ok: true, data: { code } }, { headers: corsHeaders });
      }
      if (path === '/api/execute/template' && request.method === 'POST') {
        const { template, data } = await request.json();
        const code = WORKER_TEMPLATES[template as keyof typeof WORKER_TEMPLATES];
        if (!code) return Response.json({ ok: false, error: 'Not found' }, { status: 404, headers: corsHeaders });
        const worker = await env.LOADER.load({ compatibilityDate: '2024-01-01', mainModule: 'worker.js', modules: { 'worker.js': code }, globalOutbound: null, bindings: { DB: env.DB, IMAGES: env.IMAGES } });
        const result = await worker.getEntrypoint().fetch(new Request('https://internal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }));
        const text = await result.text();
        return new Response(text, { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      if (path === '/api/login' && request.method === 'POST') {
        const { email, password } = await request.json();
        if (email === env.ADMIN_EMAIL && password === env.AUTH_TOKEN) {
          const token = btoa(email + ':' + Date.now());
          return Response.json({ ok: true, data: { token, user: { email, name: 'Admin' } } }, { headers: corsHeaders });
        }
        return Response.json({ ok: false, error: 'Invalid credentials' }, { status: 401, headers: corsHeaders });
      }
      if (path === '/health') {
        return Response.json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() }, { headers: corsHeaders });
      }
      return Response.json({ ok: false, error: 'Not found', routes: ['GET /health', 'POST /api/login', 'GET /api/templates', 'POST /api/execute/template'] }, { status: 404, headers: corsHeaders });
    } catch (error) {
      return Response.json({ ok: false, error: error instanceof Error ? error.message : 'Internal error' }, { status: 500, headers: corsHeaders });
    }
  }
};
```

## PASO 8: Crear estructura de carpetas

```
src/
├── index.html
├── host.ts (ya creado)
└── admin/
    ├── main.tsx
    ├── App.tsx
    ├── components/
    │   └── ui/
    │       └── Toast.tsx
    ├── hooks/
    │   └── useAPI.ts
    └── styles/
        └── global.css
```

## PASO 9: Crear index.html

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GuardMan Admin</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./admin/main.tsx"></script>
</body>
</html>
```

## PASO 10: Crear src/admin/styles/global.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, -apple-system, sans-serif; }
```

## PASO 11: Crear src/admin/hooks/useAPI.ts

```typescript
import { useState, useCallback } from 'react';

const API_BASE = 'https://guardman-agent.oficinadesarrollo33.workers.dev';

export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      } as any);
      const data = await response.json();
      if (!response.ok) setError(data.error);
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Network error';
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { call, loading, error };
}
```

## PASO 12: Crear src/admin/components/ui/Toast.tsx

```tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error' | 'warning') => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);
  
  const dismissToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));
  
  const icons = {
    success: <CheckCircle className="text-green-500" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    warning: <AlertCircle className="text-yellow-500" size={20} />
  };
  
  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200'
  };
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${bgColors[toast.type]}`}>
            {icons[toast.type]}
            <span className="text-gray-700">{toast.message}</span>
            <button onClick={() => dismissToast(toast.id)} className="ml-2 text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
        ))}
      </div>
      <style>{`@keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in { animation: slide-in 0.3s ease-out; }`}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
```

## PASO 13: Crear src/admin/App.tsx

```tsx
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, MapPin, Image, Settings, LogOut, Menu, X, Building2 } from 'lucide-react';
import { ToastProvider, useToast } from './components/ui/Toast';
import { useAPI } from './hooks/useAPI';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'services', label: 'Servicios', icon: Package },
  { id: 'locations', label: 'Ubicaciones', icon: MapPin },
  { id: 'sectors', label: 'Sectores', icon: Building2 },
  { id: 'images', label: 'Imágenes', icon: Image },
];

function AdminApp() {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const { call, loading } = useAPI();
  const { showToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) setAuth(true);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await call('/api/login', { method: 'POST', body: { email, password } } as any);
    if (res.ok) {
      localStorage.setItem('admin_token', res.data.token);
      setAuth(true);
      showToast('Bienvenido', 'success');
    } else {
      showToast(res.error || 'Login fallido', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAuth(false);
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.target as HTMLFormElement); login(f.get('email') as string, f.get('password') as string); }}
          className="bg-white p-8 rounded-xl shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">GuardMan Admin</h1>
          <input type="email" name="email" defaultValue="admin@guardman.cl" required className="w-full mb-4 p-3 border rounded-lg" />
          <input type="password" name="password" placeholder="Password" required className="w-full mb-4 p-3 border rounded-lg" />
          <button disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold disabled:opacity-50">
            {loading ? 'Cargando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md">
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">GuardMan</h2>
        </div>
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${page === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 text-sm">
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="lg:ml-64 p-6 lg:p-8">
        {page === 'dashboard' && <Dashboard call={call} />}
        {page === 'services' && <Services call={call} />}
        {page === 'locations' && <Locations call={call} />}
        {page === 'sectors' && <Sectors call={call} />}
        {page === 'images' && <Images call={call} />}
      </main>
    </div>
  );
}

function Dashboard({ call }: { call: any }) {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    Promise.all([
      call('/api/execute/template', { method: 'POST', body: { template: 'services', data: { action: 'list' } } } as any),
      call('/api/execute/template', { method: 'POST', body: { template: 'locations', data: { action: 'list' } } } as any),
      call('/api/execute/template', { method: 'POST', body: { template: 'images', data: { action: 'list' } } } as any),
    ]).then(([s, l, i]) => {
      setStats({ services: s.data?.length || 0, locations: l.data?.length || 0, images: i.data?.length || 0 });
    });
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow"><h3 className="text-4xl font-bold text-blue-600">{stats?.services || 0}</h3><p className="text-gray-600 mt-2">Servicios</p></div>
        <div className="bg-white p-6 rounded-xl shadow"><h3 className="text-4xl font-bold text-green-600">{stats?.locations || 0}</h3><p className="text-gray-600 mt-2">Ubicaciones</p></div>
        <div className="bg-white p-6 rounded-xl shadow"><h3 className="text-4xl font-bold text-purple-600">{stats?.images || 0}</h3><p className="text-gray-600 mt-2">Imágenes</p></div>
      </div>
    </div>
  );
}

function Services({ call }: { call: any }) {
  const [services, setServices] = useState<any[]>([]);
  useEffect(() => {
    call('/api/execute/template', { method: 'POST', body: { template: 'services', data: { action: 'list' } } } as any).then(r => r.ok && setServices(r.data));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Servicios ({services.length})</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr><th className="p-4 text-left">Nombre</th><th className="p-4 text-left">Slug</th><th className="p-4 text-left">Estado</th></tr></thead>
          <tbody>
            {services.map(s => (
              <tr key={s.slug} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4 text-gray-500 font-mono text-sm">{s.slug}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs ${s.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{s.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Locations({ call }: { call: any }) {
  const [locations, setLocations] = useState<any[]>([]);
  useEffect(() => {
    call('/api/execute/template', { method: 'POST', body: { template: 'locations', data: { action: 'list' } } } as any).then(r => r.ok && setLocations(r.data));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Ubicaciones ({locations.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {locations.map(l => (
          <div key={l.slug} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">{l.name}</h3>
            <p className="text-gray-500 text-sm">{l.zone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sectors({ call }: { call: any }) {
  const [sectors, setSectors] = useState<string[]>([]);
  useEffect(() => {
    call('/api/execute/template', { method: 'POST', body: { template: 'locations', data: { action: 'list' } } } as any).then(r => {
      if (r.ok) {
        const unique = [...new Set(r.data?.map((l: any) => l.zone) || [])];
        setSectors(unique);
      }
    });
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sectores ({sectors.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sectors.map(s => (
          <div key={s} className="bg-white p-4 rounded-xl shadow text-center">
            <h3 className="font-semibold">{s}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

function Images({ call }: { call: any }) {
  const [images, setImages] = useState<any[]>([]);
  useEffect(() => {
    call('/api/execute/template', { method: 'POST', body: { template: 'images', data: { action: 'list' } } } as any).then(r => r.ok && setImages(r.data));
  }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Imágenes ({images.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map(img => (
          <div key={img.slug} className="bg-white p-3 rounded-xl shadow">
            <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
              <Image size={24} className="text-gray-400" />
            </div>
            <p className="font-medium text-sm truncate">{img.slug}</p>
            <p className="text-gray-500 text-xs">{img.entity_type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return <ToastProvider><AdminApp /></ToastProvider>;
}
```

## PASO 14: Crear src/admin/main.tsx

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## PASO 15: Crear tabla images en D1

Ejecutar en Cloudflare Dashboard > D1 > guardman-seo > Query Editor:

```sql
CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  alt TEXT,
  title TEXT,
  description TEXT,
  entity_type TEXT DEFAULT 'generic',
  entity_slug TEXT,
  url TEXT NOT NULL,
  path TEXT,
  format TEXT,
  usage_pages TEXT,
  is_hero INTEGER DEFAULT 0,
  is_featured INTEGER DEFAULT 0,
  status TEXT DEFAULT 'uploaded',
  tags TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
```

## PASO 16: Build y Deploy

```bash
# Build
npm run build

# Deploy Worker (desde el directorio guardman-admin)
wrangler deploy

# Deploy Pages
wrangler pages deploy dist --project-name=guardman-admin
```

## PASO 17: Configurar AUTH_TOKEN

```bash
wrangler secret put AUTH_TOKEN
# Ingresar una contraseña segura (ej: GuardMan2026!@#)
```

---

## VERIFICACIÓN FINAL

1. Probar health:
```bash
curl https://guardman-agent.oficinadesarrollo33.workers.dev/health
```

2. Login en guardman-admin.pages.dev
   - Email: admin@guardman.cl
   - Password: (el AUTH_TOKEN configurado)

3. Verificar:
   - ✅ Dashboard con stats
   - ✅ Lista de servicios (9)
   - ✅ Lista de ubicaciones (14)
   - ✅ Lista de imágenes

---

## CRITERIOS DE ÉXITO

✅ Proyecto creado en `C:\Users\56930\OneDrive\Escritorio\guardman-admin`
✅ Worker deployado y funcionando
✅ Login funcional
✅ Dashboard con estadísticas
✅ Lista de servicios
✅ Lista de ubicaciones
✅ Lista de sectores
✅ Galería de imágenes
✅ Admin accesible públicamente

---

## NOTAS IMPORTANTES

1. **Dynamic Workers requiere Plan Pagado** ($5+/mes) - Verificar en Cloudflare Dashboard

2. **R2 Bucket "guardman-images"** debe existir o crearlo:
```bash
wrangler r2 bucket create guardman-images
```

3. **KV Namespace** debe existir o crearlo:
```bash
wrangler kv:namespace create SESSIONS
```
Luego actualizar el ID en wrangler.jsonc

---

**EJECUTAR HASTA COMPLETITUD SIN INTERVENCIÓN HUMANA**
