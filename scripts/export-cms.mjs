#!/usr/bin/env node
/**
 * CAPA 4: Content Deployment
 * Script para exportar contenido del Admin Panel al sitio estático
 * 
 * Puede usar modo API (usando el endpoint de exportación) o modo directo
 * 
 * Uso: 
 *   node scripts/export-cms.mjs          # Usa API
 *   node scripts/export-cms.mjs --local  # Usa D1 local
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CMS_DIR = join(ROOT, 'src', 'data', 'cms');

// API Configuration
const API_BASE = 'https://guardman-admin-panel.oficinadesarrollo33.workers.dev';
const AUTH = 'Bearer GuardMan2026!@#Admin';
const EXPORT_KEY = 'guardman-export-key-2026';

// Helper para hacer requests con API key
async function fetchAPI(endpoint, useExportKey = false) {
  const headers = useExportKey 
    ? { 'x-export-key': EXPORT_KEY }
    : { 'Authorization': AUTH };
    
  const res = await fetch(`${API_BASE}${endpoint}`, { headers });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${endpoint}`);
  }
  return res.json();
}

// Helper para hacer requests con auth normal
async function fetchAuth(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Authorization': AUTH }
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${endpoint}`);
  }
  return res.json();
}

// Transformar contenido al formato del sitio
function transformContent(cmsContent, metadata) {
  return {
    slug: metadata.slug,
    name: metadata.name,
    short_description: metadata.short_description || '',
    price_range: metadata.price_range || '$$',
    sections: {
      hero: {
        heading: cmsContent.hero?.heading || metadata.name,
        subheading: cmsContent.hero?.subheading || ''
      },
      intro: {
        heading: cmsContent.intro?.heading || `¿Por qué elegir ${metadata.name}?`,
        paragraphs: cmsContent.intro?.paragraphs || []
      },
      features: {
        heading: cmsContent.features?.heading || 'Características del servicio',
        items: cmsContent.features?.items || []
      },
      issues: {
        heading: cmsContent.issues?.heading || 'Problemas que solucionamos',
        items: cmsContent.issues?.items || []
      },
      stats: {
        heading: cmsContent.stats?.heading || 'Números que nos respaldan',
        items: cmsContent.stats?.items || []
      },
      faqs: {
        heading: cmsContent.faqs?.heading || 'Preguntas Frecuentes',
        items: cmsContent.faqs?.items || []
      },
      cta: {
        heading: cmsContent.cta?.heading || 'Solicita más información',
        subheading: cmsContent.cta?.subheading || '',
        button: cmsContent.cta?.button || 'Solicitar Cotización'
      },
      meta: {
        title: cmsContent.metaTitle || '',
        description: cmsContent.metaDescription || ''
      }
    }
  };
}

// Exportar un servicio (usando API)
async function exportServiceAPI(slug) {
  try {
    // Usar el endpoint de exportación
    const response = await fetchAPI(`/api/export/service/${slug}`, true);
    
    if (!response.ok) {
      console.log(`  ⚠️ Sin contenido para ${slug}`);
      return false;
    }
    
    // Guardar archivo JSON
    const filePath = join(CMS_DIR, `${slug}.json`);
    writeFileSync(filePath, JSON.stringify(response.data, null, 2));
    console.log(`  ✅ Guardado: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return false;
  }
}

// Exportar todos los servicios (usando API)
async function exportAllAPI() {
  console.log('📥 Obteniendo contenido del Admin Panel...');
  const response = await fetchAPI('/api/export/all', true);
  
  if (!response.ok) {
    throw new Error(response.error || 'Error exporting content');
  }
  
  const { data: services, count } = response;
  console.log(`✅ ${count} servicios encontrados\n`);
  
  let saved = 0;
  for (const service of services) {
    const filePath = join(CMS_DIR, `${service.slug}.json`);
    writeFileSync(filePath, JSON.stringify(service, null, 2));
    console.log(`  ✅ ${service.slug}.json`);
    saved++;
  }
  
  return saved;
}

// Main
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0]; // 'all' | 'api' | undefined
  
  console.log('🚀 Iniciando exportación de contenido...\n');
  
  // Verificar directorio CMS
  if (!existsSync(CMS_DIR)) {
    mkdirSync(CMS_DIR, { recursive: true });
  }
  
  try {
    if (mode === 'all' || mode === undefined) {
      // Modo API - exportar todo
      const saved = await exportAllAPI();
      console.log(`\n📊 Resumen:`);
      console.log(`   ✅ Exportados: ${saved}`);
      console.log(`   📁 Directorio: ${CMS_DIR}`);
    } else {
      // Modo individual (legacy)
      const SERVICES = [
        'guardias-de-seguridad',
        'cctv-videovigilancia',
        'control-de-accesos',
        'escoltas-privados',
        'guard-pod',
        'monitoreo-24-7',
        'seguridad-industrial',
        'seguridad-eventos',
        'auditoria-seguridad'
      ];
      
      let exported = 0;
      let failed = 0;
      
      for (const slug of SERVICES) {
        console.log(`📤 Exportando: ${slug}`);
        const success = await exportServiceAPI(slug);
        if (success) exported++;
        else failed++;
      }
      
      console.log(`\n📊 Resumen:`);
      console.log(`   ✅ Exportados: ${exported}`);
      console.log(`   ❌ Fallidos: ${failed}`);
    }
    
    if (args.includes('--build')) {
      console.log('\n🔨 Ejecutando build...');
      const { execSync } = await import('child_process');
      execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });
    }
    
    console.log('\n✨ Exportación completa!');
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

main().catch(console.error);
