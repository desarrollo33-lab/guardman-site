/**
 * Export Sectors to JSON - Exporta sectores económicos desde D1 a JSON
 * Uso: node scripts/export-sectors.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..');
const CMS_DIR = join(ROOT_DIR, 'src', 'data', 'cms');

// Ensure CMS directory exists
if (!existsSync(CMS_DIR)) {
  mkdirSync(CMS_DIR, { recursive: true });
}

// API endpoint del Admin Panel (que tiene acceso a D1)
const API_BASE = 'https://guardman-admin-panel.oficinadesarrollo33.workers.dev';
const AUTH_EMAIL = 'admin@guardman.cl';
const AUTH_PASSWORD = 'GuardMan2026!@#Admin';

async function login() {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: AUTH_EMAIL, password: AUTH_PASSWORD })
  });
  const data = await res.json();
  return data.data.token;
}

async function fetchSectors(token) {
  const res = await fetch(`${API_BASE}/api/sectors`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  return data.data;
}

async function exportSectors() {
  console.log('🔄 Exportando sectores económicos desde D1...\n');
  
  try {
    // Login
    const token = await login();
    console.log('✅ Autenticado');
    
    // Fetch sectors
    const sectors = await fetchSectors(token);
    console.log(`📦 Encontrados ${sectors.length} sectores\n`);
    
    // Create sectors.json
    const sectorsList = sectors
      .filter(s => s.status === 'active')
      .map(s => ({
        slug: s.slug,
        name: s.name,
        hero: {
          heading: `Seguridad ${s.name}`,
          subheading: s.description || `Soluciones de seguridad para el sector ${s.name}`,
          cta_text: `Cotiza Seguridad ${s.name}`
        }
      }));
    
    writeFileSync(
      join(CMS_DIR, 'sectors.json'),
      JSON.stringify(sectorsList, null, 2)
    );
    console.log('✅ sectors.json creado');
    
    // Create individual sector JSON files
    for (const sector of sectors.filter(s => s.status === 'active')) {
      const sectorFile = {
        slug: sector.slug,
        name: sector.name,
        sections: {
          hero: {
            heading: `Seguridad ${sector.name}`,
            subheading: sector.description || `Soluciones de seguridad especializadas para el sector ${sector.name} en Santiago.`,
            cta_text: `Cotiza Seguridad ${sector.name}`
          },
          intro: {
            heading: `¿Por qué elegir GuardMan para ${sector.name}?`,
            paragraphs: [
              `En GuardMan Chile comprendemos los desafíos únicos de seguridad que enfrenta el sector ${sector.name.toLowerCase()}. ` +
              `Nuestro equipo de profesionales certificados OS-10 está preparado para brindar soluciones integrales adaptadas a tus necesidades específicas.`,
              `Contamos con años de experiencia protegiendo empresas del sector ${sector.name.toLowerCase()} en toda la Región Metropolitana, ` +
              `desde pequeñas operaciones hasta grandes corporaciones.`
            ]
          },
          features: {
            heading: '¿Qué incluye nuestro servicio?',
            items: [
              'Guardias certificados OS-10',
              'Monitoreo 24/7 desde nuestro centro de control',
              'Control de accesos y registro de visitantes',
              'Rondas preventivas programadas',
              'Coordinación con Carabineros',
              'Reportes diarios de novedades'
            ]
          },
          issues: {
            heading: 'Problemas que solucionamos',
            items: [
              'Robos y hurtos',
              'Acceso no autorizado',
              'Vandalismo',
              'Falta de control perimetral',
              'Necesidad de dokumentar incidentes'
            ]
          },
          stats: {
            heading: 'Números que nos respaldan',
            items: [
              { label: 'Empresas protegidas', value: '200+' },
              { label: 'Guardias activos', value: '500+' },
              { label: 'Años de experiencia', value: '8+' },
              { label: 'Comunas cobertura', value: '14' }
            ]
          },
          cta: {
            heading: `Protege tu ${sector.name.toLowerCase()} hoy`,
            subheading: 'Solicita una cotización personalizada',
            button: 'Solicitar Cotización'
          }
        }
      };
      
      writeFileSync(
        join(CMS_DIR, `sector-${sector.slug}.json`),
        JSON.stringify(sectorFile, null, 2)
      );
      console.log(`  ✅ sector-${sector.slug}.json`);
    }
    
    console.log('\n✨ Exportación completada!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

exportSectors();
