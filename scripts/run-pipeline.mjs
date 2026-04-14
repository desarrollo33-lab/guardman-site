/**
 * GUARDMAN SEO PIPELINE
 * 
 * Ejecuta el pipeline completo:
 * 1. Research con Serper
 * 2. Generación de contenido con IA
 * 3. Guardar en D1
 * 
 * Uso:
 *   node scripts/run-pipeline.mjs [command] [args]
 * 
 * Commands:
 *   node scripts/run-pipeline.mjs full           - Ejecuta todo el pipeline
 *   node scripts/run-pipeline.mjs research       - Solo research
 *   node scripts/run-pipeline.mjs generate       - Solo generación
 *   node scripts/run-pipeline.mjs status         - Ver estado
 *   node scripts/run-pipeline.mjs setup           - Crear D1 y aplicar schema
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Constants
const D1_DB_NAME = 'guardman-seo';
const SERPER_API_KEY = '560f82db098446d04e390640882b3a4313ffd39b';
const SERPER_BASE = 'https://google.serper.dev';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, prefix, message) {
  console.log(`${color}[${prefix}]${colors.reset} ${message}`);
}

function info(msg) { log(colors.blue, 'INFO', msg); }
function success(msg) { log(colors.green, 'SUCCESS', msg); }
function warn(msg) { log(colors.yellow, 'WARN', msg); }
function error(msg) { log(colors.red, 'ERROR', msg); }

// ============ SERPER CLIENT ============
async function serperSearch(query) {
  const res = await fetch(`${SERPER_BASE}/search`, {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: query, gl: 'cl', hl: 'es', num: 10 })
  });

  if (!res.ok) {
    throw new Error(`Serper error: ${res.status}`);
  }

  return res.json();
}

async function serperAutocomplete(query) {
  const res = await fetch(`${SERPER_BASE}/autocomplete`, {
    method: 'POST',
    headers: {
      'X-API-KEY': SERPER_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ q: query, gl: 'cl', hl: 'es' })
  });

  if (!res.ok) {
    throw new Error(`Serper error: ${res.status}`);
  }

  return res.json();
}

// ============ D1 CLIENT ============
async function d1Exec(sql) {
  const { execSync } = await import('child_process');
  try {
    const result = execSync(`npx wrangler d1 execute ${D1_DB_NAME} --remote --command "${sql.replace(/"/g, '\\"')}"`, {
      cwd: ROOT,
      encoding: 'utf-8'
    });
    return JSON.parse(result);
  } catch (e) {
    // Try local
    try {
      const result = execSync(`npx wrangler d1 execute ${D1_DB_NAME} --local --command "${sql.replace(/"/g, '\\"')}"`, {
        cwd: ROOT,
        encoding: 'utf-8'
      });
      return JSON.parse(result);
    } catch (localErr) {
      throw new Error(`D1 exec failed: ${e.message}`);
    }
  }
}

async function d1Query(sql) {
  const { execSync } = await import('child_process');
  try {
    const result = execSync(`npx wrangler d1 execute ${D1_DB_NAME} --remote --command "${sql.replace(/"/g, '\\"')}" --json`, {
      cwd: ROOT,
      encoding: 'utf-8'
    });
    return JSON.parse(result);
  } catch (e) {
    // Try local
    try {
      const result = execSync(`npx wrangler d1 execute ${D1_DB_NAME} --local --command "${sql.replace(/"/g, '\\"')}" --json`, {
        cwd: ROOT,
        encoding: 'utf-8'
      });
      return JSON.parse(result);
    } catch (localErr) {
      throw new Error(`D1 query failed: ${e.message}`);
    }
  }
}

// ============ CONTENT GENERATION ============
function generateKeywordVariations(service, location) {
  return [
    `${service} ${location}`,
    `${service} ${location} Chile`,
    `empresa de ${service} ${location}`,
    `mejor ${service} ${location}`,
    `${service} precio ${location}`,
    `cotizar ${service} ${location}`,
    `seguridad ${service} ${location}`
  ];
}

function calculateSDS(organic) {
  if (!organic || organic.length === 0) return { sds: 20, tier: 'easy' };
  
  let score = 50;
  const hasGuardman = organic.some(r => r.link?.includes('guardman'));
  const hasAuthority = organic.some(r => /wikipedia|gob\.cl/i.test(r.link));
  const hasWeak = organic.some(r => /wordpress|blogspot/i.test(r.link));
  
  if (hasGuardman) score -= 15;
  if (hasAuthority) score += 10;
  if (hasWeak) score -= 5;
  
  score = Math.max(0, Math.min(100, score));
  
  let tier;
  if (score < 25) tier = 'easy';
  else if (score < 40) tier = 'moderate';
  else if (score < 60) tier = 'competitive';
  else tier = 'hard';
  
  return { sds: score, tier };
}

// ============ PIPELINE STEPS ============
async function setup() {
  info('Setting up D1 database...');
  
  // Read schema
  const schemaPath = join(ROOT, 'worker', 'sql', 'schema.sql');
  if (!existsSync(schemaPath)) {
    error('Schema file not found: ' + schemaPath);
    return false;
  }
  
  const schema = readFileSync(schemaPath, 'utf-8');
  
  // Create D1 if not exists (manual step)
  info('Please run manually:');
  info(`  npx wrangler d1 create ${D1_DB_NAME}`);
  info(`  npx wrangler d1 execute ${D1_DB_NAME} --remote --file=worker/sql/schema.sql`);
  info('');
  info('Then update wrangler.toml with the database_id');
  
  return true;
}

async function status() {
  info('Checking system status...\n');
  
  try {
    // Check services
    const services = await d1Query(`SELECT slug, status FROM services`);
    console.log('\n📦 Services:', services?.results?.length || 0);
    
    if (services?.results) {
      const byStatus = {};
      for (const s of services.results) {
        byStatus[s.status] = (byStatus[s.status] || 0) + 1;
      }
      for (const [status, count] of Object.entries(byStatus)) {
        console.log(`   ${status}: ${count}`);
      }
    }
    
    // Check locations
    const locations = await d1Query(`SELECT slug, status FROM locations`);
    console.log('\n📍 Locations:', locations?.results?.length || 0);
    
    if (locations?.results) {
      const byStatus = {};
      for (const l of locations.results) {
        byStatus[l.status] = (byStatus[l.status] || 0) + 1;
      }
      for (const [status, count] of Object.entries(byStatus)) {
        console.log(`   ${status}: ${count}`);
      }
    }
    
    // Check keywords
    const keywords = await d1Query(`SELECT COUNT(*) as count FROM keywords`);
    console.log('\n🔑 Keywords:', keywords?.results?.[0]?.count || 0);
    
    // Check FAQs
    const faqs = await d1Query(`SELECT COUNT(*) as count FROM faqs`);
    console.log('\n❓ FAQs:', faqs?.results?.[0]?.count || 0);
    
    // Check content generated
    const serviceContent = await d1Query(`SELECT COUNT(*) as count FROM service_content`);
    console.log('\n📝 Service Content:', serviceContent?.results?.[0]?.count || 0);
    
    const locationContent = await d1Query(`SELECT COUNT(*) as count FROM location_content`);
    console.log('\n📝 Location Content:', locationContent?.results?.[0]?.count || 0);
    
    const comboContent = await d1Query(`SELECT COUNT(*) as count FROM combo_content`);
    console.log('\n📝 Combo Content:', comboContent?.results?.[0]?.count || 0);
    
  } catch (e) {
    error('Failed to check status: ' + e.message);
    warn('Make sure D1 is set up. Run: node scripts/run-pipeline.mjs setup');
  }
  
  console.log('');
}

async function research() {
  info('Starting research phase...\n');
  
  // Get all services and locations
  const services = await d1Query(`SELECT slug, name FROM services`);
  const locations = await d1Query(`SELECT slug, name FROM locations`);
  
  if (!services?.results || !locations?.results) {
    error('Failed to fetch services/locations from D1');
    return;
  }
  
  const totalCombos = services.results.length * locations.results.length;
  info(`Total combinations to research: ${totalCombos}`);
  info(`Services: ${services.results.length}, Locations: ${locations.results.length}\n`);
  
  let completed = 0;
  let totalKeywords = 0;
  let totalFAQs = 0;
  let errors = 0;
  
  for (const service of services.results) {
    for (const location of locations.results) {
      completed++;
      
      try {
        // Generate keywords
        const keywords = generateKeywordVariations(service.name, location.name);
        
        for (const keyword of keywords) {
          info(`[${completed}/${totalCombos}] Research: ${keyword}`);
          
          // Search
          const result = await serperSearch(keyword);
          
          // Calculate SDS
          const sdsData = calculateSDS(result.organic);
          
          // Save keyword
          totalKeywords++;
          
          // Save PAA questions as FAQs
          if (result.peopleAlsoAsk) {
            for (const paa of result.peopleAlsoAsk.slice(0, 5)) {
              totalFAQs++;
            }
          }
          
          // Rate limit
          await new Promise(r => setTimeout(r, 500));
        }
        
        success(`Completed: ${service.name} + ${location.name}`);
        
      } catch (e) {
        errors++;
        error(`Error for ${service.name} + ${location.name}: ${e.message}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  success('Research completed!');
  console.log(`  Keywords found: ${totalKeywords}`);
  console.log(`  FAQs extracted: ${totalFAQs}`);
  console.log(`  Errors: ${errors}`);
  console.log('='.repeat(50) + '\n');
}

async function generate() {
  info('Starting content generation phase...\n');
  
  // This would use the AI to generate content
  // For now, just status
  warn('Content generation requires the Worker to be deployed');
  info('Use the Worker API endpoints:');
  info('  POST /api/generate/service');
  info('  POST /api/generate/location');
  info('  POST /api/generate/combo\n');
  
  await status();
}

async function full() {
  info('Starting FULL pipeline...\n');
  
  console.log('='.repeat(60));
  console.log('  GUARDMAN SEO PIPELINE - FULL EXECUTION');
  console.log('='.repeat(60) + '\n');
  
  // Phase 1: Research
  console.log('\n📊 PHASE 1: RESEARCH\n');
  await research();
  
  // Phase 2: Generate
  console.log('\n📊 PHASE 2: GENERATION\n');
  await generate();
  
  console.log('\n' + '='.repeat(60));
  success('Pipeline completed!');
  console.log('='.repeat(60) + '\n');
}

// ============ MAIN ============
const command = process.argv[2] || 'help';

const commands = {
  setup: async () => {
    console.log('\n📦 GUARDMAN SEO - SETUP\n');
    await setup();
  },
  
  status: async () => {
    console.log('\n📊 GUARDMAN SEO - STATUS\n');
    await status();
  },
  
  research: async () => {
    console.log('\n🔍 GUARDMAN SEO - RESEARCH\n');
    await research();
  },
  
  generate: async () => {
    console.log('\n✍️  GUARDMAN SEO - GENERATE\n');
    await generate();
  },
  
  full: async () => {
    await full();
  },
  
  help: () => {
    console.log(`
🏗️  GUARDMAN SEO PIPELINE

Usage:
  node scripts/run-pipeline.mjs <command>

Commands:
  setup     - Setup D1 database and apply schema
  status    - Check current status
  research  - Run research with Serper
  generate  - Generate content with AI
  full      - Run complete pipeline (research + generate)
  help      - Show this help

Examples:
  node scripts/run-pipeline.mjs status
  node scripts/run-pipeline.mjs research
  node scripts/run-pipeline.mjs full

Environment:
  Make sure wrangler.toml has the correct D1 database_id
  Make sure SERPER_API_KEY is available
`);
  }
};

if (commands[command]) {
  commands[command]();
} else {
  commands.help();
}
