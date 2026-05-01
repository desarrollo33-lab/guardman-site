# 🚀 PROMPT DE ACTIVACIÓN - GuardMan Dynamic Workers

Copia y pega el siguiente prompt en una nueva sesión de Pi para continuar el trabajo:

---

```
# ACTIVAR SESIÓN: GuardMan CMS - Dynamic Workers

## 📋 CONTEXTO INICIAL
Estoy continuando el proyecto GuardMan Chile CMS. Lee completamente el archivo de handoff antes de cualquier acción:

**ARCHIVO HANDOFF:**
```
C:\Users\56930\OneDrive\Escritorio\HANDOFF-GUARDMAN-DYNAMIC-WORKERS.md
```

## 🔗 ACCESOS RÁPIDOS
- **Panel Admin:** https://guardman-admin-panel.oficinadesarrollo33.workers.dev/
- **Credenciales:** admin@guardman.cl / GuardMan2026!@#Admin
- **Health Check:** https://guardman-admin-panel.oficinadesarrollo33.workers.dev/health
- **Sitio Astro:** https://4061deb7.guardman-site.pages.dev

## 📁 ESTRUCTURA DE PROYECTOS
```
C:\Users\56930\OneDrive\Escritorio\guardman-admin\     (Worker + CMS)
C:\Users\56930\OneDrive\Escritorio\guardman-site\      (Astro Site)
```

## 🎯 ESTADO ACTUAL (Resumen)
✅ Panel de Login funcionando 100%
✅ Dashboard React con navegación  
✅ API Ubicaciones funcionando (/api/locations)
✅ API Sectores funcionando (/api/sectors)
⚠️ API Servicios con ERROR 1101 (necesita debug)
⚠️ CMS Editor no implementado
⚠️ AI Generation no implementado

## 🚨 PRIORIDAD 1: DEBUG ERROR 1101
El endpoint `/api/services` retorna "error code: 1101". Necesito:
1. Verificar logs con `wrangler tail`
2. Revisar la query SQL en `src/admin-stable.ts`
3. Probar la query directamente en D1
4. Corregir el error

## 🛠️ TECNOLOGÍAS
- Cloudflare Workers (Dynamic Workers)
- D1 Database (SQLite)
- React 18 + Tailwind CSS (SPA en el worker)
- TypeScript
- Wrangler CLI

## 📚 ARCHIVOS CLAVE
- Worker activo: `guardman-admin/src/admin-stable.ts`
- Config: `guardman-admin/wrangler.jsonc`
- Router modular: `guardman-admin/src/lib/router.ts`
- Durable Objects: `guardman-admin/src/durable/ai-generator.ts`

## ⚠️ ERRORES CONOCIDOS (Ver handoff completo)
- Error 1101 en /api/services
- Durable Objects deben exportarse siempre
- Problemas de directorio entre guardman-site y guardman-admin

## 🎯 TAREAS PENDIENTES (en orden de prioridad)
1. 🔴 CRÍTICO: Solucionar error 1101 en servicios
2. 🟡 ALTA: Implementar CMS Editor completo
3. 🟡 ALTA: Integrar generación AI (MiniMax)
4. 🟢 MEDIA: Implementar Research (Serper)
5. 🟢 BAJA: Agregar SEO Validation

## 🔧 COMANDOS ÚTILES
```bash
# Deploy
cd ../guardman-admin && npx wrangler deploy

# Ver logs
cd ../guardman-admin && npx wrangler tail

# Probar API
curl -H "Authorization: Bearer GuardMan2026!@#Admin" \
  https://guardman-admin-panel.oficinadesarrollo33.workers.dev/api/locations
```

## 💾 BASE DE DATOS D1
- Nombre: guardman-seo
- ID: aeaab85c-d4df-46c4-96b9-28d6a95aaec4
- Tablas: services, locations, sectors, content_versions, workflow_status, research_cache

## 🔐 API KEYS (ya configuradas en worker)
- MiniMax: sk-cp-U-...
- Serper: 560f82db...

---

**INSTRUCCIONES PARA EL AGENTE:**

1. PRIMERO lee completamente: `C:\Users\56930\OneDrive\Escritorio\HANDOFF-GUARDMAN-DYNAMIC-WORKERS.md`

2. Verifica el estado actual:
   ```bash
   curl https://guardman-admin-panel.oficinadesarrollo33.workers.dev/health
   ```

3. Identifica qué tarea prioritaria necesita hacer el usuario

4. NUNCA asumas que estás en el directorio correcto - siempre verifica con `pwd` y `cd` explícito

5. Recuerda: los Durable Objects (AIGenerator, ContentQueue) DEBEN ser exportados siempre o el deploy fallará

6. Si hay que deployar, asegúrate de estar en `../guardman-admin` y usar `npx wrangler deploy`

¿Qué necesitas hacer primero?
```

---

## 📋 CÓMO USAR ESTE PROMPT

1. **Copia** todo el bloque de código arriba (entre los backticks)
2. **Abre una nueva sesión** de Pi
3. **Pega** el prompt completo
4. **Adjunta** el archivo `HANDOFF-GUARDMAN-DYNAMIC-WORKERS.md` si es posible
5. **Envía** y el agente leerá todo el contexto

## 🎯 EXPECTATIVAS DEL PROMPT

Al pegar este prompt, el agente debería:
1. ✅ Leer el handoff completo automáticamente
2. ✅ Verificar el estado actual del worker
3. ✅ Entender la arquitectura Dynamic Workers implementada
4. ✅ Conocer los errores pendientes (especialmente error 1101)
5. ✅ Saber qué tareas están priorizadas
6. ✅ Tener acceso a URLs, credenciales y comandos útiles
7. ✅ Continuar el trabajo sin perder contexto

---

**Archivos a adjuntar con el prompt:**
- `HANDOFF-GUARDMAN-DYNAMIC-WORKERS.md` (documento completo)
- Opcional: `wrangler.jsonc` (configuración actual)
- Opcional: `src/admin-stable.ts` (código actual)

*Generado: 15 Abril 2026*
