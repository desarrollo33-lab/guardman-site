/**
 * Data Validation Script - GuardMan Chile
 * 
 * This script validates the static JSON data in src/data/generated/
 * Run: node scripts/fetch-cms-data.mjs
 * 
 * The site uses static JSON data - no external CMS required.
 * All content is stored in src/data/generated/*.json
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'src', 'data', 'generated');

// Schema definitions - which fields are required
const SCHEMAS = {
  services: { required: ['id', 'name', 'slug', 'description', 'status'] },
  locations: { required: ['id', 'name', 'slug', 'status'] },
  sectors: { required: ['id', 'name', 'slug', 'status'] },
  clients: { required: ['id', 'name', 'status'] },
  testimonials: { required: ['id', 'name', 'status'] },
  blog: { required: ['id', 'title', 'slug', 'status'] },
  'site-config': { required: ['site_name', 'phone', 'email'] }
};

function loadJson(filename) {
  const filepath = join(DATA_DIR, `${filename}.json`);
  if (!existsSync(filepath)) {
    console.error(`❌ File not found: ${filepath}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(filepath, 'utf-8'));
  } catch (e) {
    console.error(`❌ Invalid JSON in ${filename}.json:`, e.message);
    return null;
  }
}

function validateItem(item, index, requiredFields) {
  const errors = [];

  for (const field of requiredFields) {
    if (!(field in item) || item[field] === undefined || item[field] === null || item[field] === '') {
      errors.push(`Missing: ${field}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    index,
    item: item.name || item.title || item.slug || `Item ${index + 1}`
  };
}

async function main() {
  console.log('🔍 Validating GuardMan Static Data\n');
  console.log('='.repeat(50));
  console.log('📁 Data directory:', DATA_DIR);
  console.log('='.repeat(50));

  let totalValid = 0;
  let totalInvalid = 0;

  for (const filename of Object.keys(SCHEMAS)) {
    console.log(`\n📄 Validating ${filename}.json...`);
    
    const data = loadJson(filename);
    if (!data) {
      console.log(`   ❌ File not found or invalid`);
      totalInvalid++;
      continue;
    }

    const schema = SCHEMAS[filename];
    const isArray = Array.isArray(data);

    if (isArray) {
      console.log(`   Items: ${data.length}`);
      let validCount = 0;
      let invalidCount = 0;

      for (let i = 0; i < data.length; i++) {
        const result = validateItem(data[i], i, schema.required);
        if (result.valid) {
          validCount++;
        } else {
          invalidCount++;
          console.log(`   ❌ [${i}] ${result.item}: ${result.errors.join(', ')}`);
        }
      }

      console.log(`   ${invalidCount === 0 ? '✅' : '❌'} Valid: ${validCount}, Invalid: ${invalidCount}`);
      totalValid += validCount;
      totalInvalid += invalidCount;
    } else {
      // Single object
      const result = validateItem(data, 0, schema.required);
      if (result.valid) {
        console.log(`   ✅ Valid: 1`);
        totalValid++;
      } else {
        console.log(`   ❌ ${result.item}: ${result.errors.join(', ')}`);
        totalInvalid++;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY');
  console.log('='.repeat(50));
  console.log(`   Total valid items: ${totalValid}`);
  console.log(`   Total invalid items: ${totalInvalid}`);
  
  if (totalInvalid === 0) {
    console.log('\n✅ ALL DATA VALID - Site ready for build!');
    process.exit(0);
  } else {
    console.log('\n❌ VALIDATION FAILED - Fix errors before building');
    process.exit(1);
  }
}

main();
