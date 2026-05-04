/**
 * Content Quality Validator — GuardMan Chile
 * Checks all CMS JSON files for repetition, TTR, banned patterns, and uniqueness.
 *
 * Usage: node scripts/validate-content-quality.mjs
 */

import { readFileSync, existsSync, readdirSync } from 'fs';

const CMS_DIR = 'src/data/cms';
const STOP_WORDS = new Set([
  'para', 'como', 'pero', 'sobre', 'entre', 'cuando', 'donde', 'puede', 'tiene',
  'otra', 'otros', 'otro', 'todas', 'todos', 'todo', 'esta', 'este', 'esto',
  'ese', 'esa', 'eso', 'muy', 'mas', 'menos', 'tambien', 'siempre', 'nunca',
  'antes', 'despues', 'aqui', 'alli', 'bien', 'solo', 'sola', 'cada',
]);

const BLOCKED_PATTERNS = [
  /\bsolución integral\b/i,
  /\bEs una pregunta frecuente que recibimos\b/i,
  /\bMany empresas\b/i,
  /operate\s+\d/i,
  /\bstockage\b/i,
  /\bhandlear\b/i,
];

let errors = 0;
let warnings = 0;

function extractText(sections) {
  const parts = [];
  if (sections.hero?.heading) parts.push(sections.hero.heading);
  if (sections.hero?.subheading) parts.push(sections.hero.subheading);
  if (sections.intro?.paragraphs) parts.push(...sections.intro.paragraphs);
  if (sections.features?.items) {
    for (const item of sections.features.items) {
      parts.push(typeof item === 'string' ? item : '');
    }
  }
  if (sections.issues?.items) {
    for (const item of sections.issues.items) {
      parts.push(typeof item === 'string' ? item : '');
    }
  }
  if (sections.cta?.heading) parts.push(sections.cta.heading);
  if (sections.cta?.subheading) parts.push(sections.cta.subheading);
  return parts.join(' ');
}

function calcTTR(text) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !STOP_WORDS.has(w));
  if (words.length < 20) return { ttr: 1, total: words.length, unique: words.length };
  const unique = new Set(words).size;
  return { ttr: unique / words.length, total: words.length, unique };
}

function findOverusedWords(text, threshold = 0.025) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !STOP_WORDS.has(w));
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  const total = words.length;
  return Object.entries(freq)
    .filter(([, count]) => count > Math.max(total * threshold, 5))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => `"${word}" (${count}x, ${((count/total)*100).toFixed(1)}%)`);
}

function checkFile(file, label) {
  if (!existsSync(`${CMS_DIR}/${file}`)) return null;
  try {
    const data = JSON.parse(readFileSync(`${CMS_DIR}/${file}`, 'utf-8'));
    const sections = data.sections || data;
    return { sections, text: extractText(sections) };
  } catch {
    return null;
  }
}

// ═══ MAIN ═══
console.log('=== Content Quality Validator ===\n');

// 1. Check services for cross-service duplication
console.log('📊 Service Content Uniqueness:');
const serviceFiles = readdirSync(CMS_DIR).filter(f =>
  !f.startsWith('combo-') && !f.startsWith('location-') && !f.startsWith('sector-') &&
  !f.startsWith('hub-') && !f.startsWith('pages-') && f.endsWith('.json') &&
  !['services.json', 'locations.json', 'sectors.json', 'config.json', 'zones.json',
    'staff.json', 'media-map.json', 'brand.json', 'service-sectors.json'].includes(f)
);

const serviceFeatures = {};
for (const file of serviceFiles) {
  const slug = file.replace('.json', '');
  const data = checkFile(file, 'service');
  if (!data) continue;

  const features = data.sections?.features?.items || [];
  serviceFeatures[slug] = new Set(features.map(f => String(f).toLowerCase().substring(0, 40)));

  const ttr = calcTTR(data.text);
  const overused = findOverusedWords(data.text);

  // Check blocked patterns
  let blocked = 0;
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(data.text)) {
      const match = data.text.match(pattern);
      console.log(`  ❌ ${slug}: Patrón bloqueado "${match?.[0]}"`);
      blocked++;
      errors++;
    }
  }

  if (ttr.ttr < 0.35) {
    console.log(`  ❌ ${slug}: TTR ${(ttr.ttr * 100).toFixed(1)}% (${ttr.unique}/${ttr.total} palabras) — MUY REPETITIVO`);
    errors++;
  } else if (ttr.ttr < 0.45) {
    console.log(`  ⚠️  ${slug}: TTR ${(ttr.ttr * 100).toFixed(1)}% — diversidad baja`);
    warnings++;
  } else {
    console.log(`  ✅ ${slug}: TTR ${(ttr.ttr * 100).toFixed(1)}% (${ttr.total} palabras)`);
  }

  if (overused.length > 0) {
    console.log(`     Overused: ${overused.join(', ')}`);
  }

  if (blocked === 0 && ttr.ttr >= 0.35) {
    // OK
  }
}

// 2. Check cross-service feature overlap
console.log('\n📊 Cross-Service Feature Overlap:');
const serviceSlugs = Object.keys(serviceFeatures);
for (let i = 0; i < serviceSlugs.length; i++) {
  for (let j = i + 1; j < serviceSlugs.length; j++) {
    const a = serviceFeatures[serviceSlugs[i]];
    const b = serviceFeatures[serviceSlugs[j]];
    const intersection = [...a].filter(f => b.has(f));
    if (intersection.length > 3) {
      console.log(`  ⚠️  ${serviceSlugs[i]} vs ${serviceSlugs[j]}: ${intersection.length} features idénticos`);
      warnings++;
    }
  }
}

// 3. Sample combo pages for quality
console.log('\n📊 Combo Page Quality (sample):');
const comboFiles = readdirSync(CMS_DIR).filter(f => f.startsWith('combo-') && f.endsWith('.json'));
const sampleCombos = comboFiles.filter((_, i) => i % 14 === 0); // Sample 1 per location

let comboIssues = 0;
for (const file of sampleCombos) {
  const data = checkFile(file, 'combo');
  if (!data) continue;

  const ttr = calcTTR(data.text);

  // Check for template phrases
  const templatePhrases = [
    'está diseñado para cubrir las necesidades específicas',
    'tiene características particulares que requieren',
    'se adapta a los diferentes perfiles de clientes: empresas, condominos y residencias',
  ];

  let hasTemplate = false;
  for (const phrase of templatePhrases) {
    if (data.text.toLowerCase().includes(phrase.toLowerCase())) {
      console.log(`  ❌ ${file}: Frase template "${phrase.substring(0, 50)}..."`);
      hasTemplate = true;
      comboIssues++;
      errors++;
    }
  }

  if (!hasTemplate && ttr.ttr >= 0.35) {
    console.log(`  ✅ ${file}: TTR ${(ttr.ttr * 100).toFixed(1)}%`);
  }
}

console.log(`\n📊 Sample checked: ${sampleCombos.length}/${comboFiles.length} combos`);

// Summary
console.log('\n' + '='.repeat(40));
if (errors === 0 && warnings === 0) {
  console.log('✅ All content quality checks passed!');
} else {
  console.log(`❌ ${errors} error(s), ${warnings} warning(s)`);
}

process.exit(errors > 0 ? 1 : 0);
