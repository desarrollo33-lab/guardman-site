#!/usr/bin/env node
/**
 * CAPA 4: Content Deployment - Build Script
 * 
 * Este script debe correr ANTES del build del sitio para actualizar
 * el contenido del CMS desde el Admin Panel.
 * 
 * Uso: node scripts/build-with-cms.mjs && npm run build
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CMS_DIR = join(ROOT, 'src', 'data', 'cms');

// API Configuration
const API_BASE = 'https://guardman-admin-panel.oficinadesarrollo33.workers.dev';
const EXPORT_KEY = 'guardman-export-key-2026';

// Helper para hacer requests
async function fetchAPI(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'x-export-key': EXPORT_KEY }
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${endpoint}`);
  }
  return res.json();
}

// Guardar contenido en archivo
function saveServiceContent(slug, data) {
  const filePath = join(CMS_DIR, `${slug}.json`);
  writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
}

// Main
async function main() {
  console.log('🚀 CAPA 4: Content Deployment');
  console.log('=============================\n');
  
  // Verificar directorio CMS
  if (!existsSync(CMS_DIR)) {
    mkdirSync(CMS_DIR, { recursive: true });
    console.log(`📁 Creado directorio: ${CMS_DIR}`);
  }
  
  try {
    // Obtener todos los servicios exportados
    console.log('📥 Obteniendo contenido del Admin Panel...');
    const response = await fetchAPI('/api/export/all');
    
    if (!response.ok) {
      throw new Error(response.error || 'Error exporting content');
    }
    
    const { data: services, exportedAt, count } = response;
    console.log(`✅ ${count} servicios encontrados (exportado: ${exportedAt})\n`);
    
    // Guardar cada servicio
    console.log('💾 Guardando archivos JSON:');
    let saved = 0;
    for (const service of services) {
      const filePath = saveServiceContent(service.slug, service);
      console.log(`   ✅ ${service.slug}.json`);
      saved++;
    }
    
    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ Exportados: ${saved}`);
    console.log(`   📁 Directorio: ${CMS_DIR}`);
    console.log(`\n✨ Listo para build!`);
    console.log(`   Ejecuta: npm run build`);
    
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    console.error(`\n💡 Asegúrate de que:`);
    console.error(`   1. El Admin Panel esté desplegado`);
    console.error(`   2. El EXPORT_API_KEY sea correcto`);
    process.exit(1);
  }
}

main().catch(console.error);
