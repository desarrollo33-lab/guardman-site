/**
 * Clean Chinese characters from CMS JSON files.
 * Replaces Chinese text with generic Spanish fallbacks.
 * 
 * Usage: node scripts/clean-chinese.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';

const CMS_DIR = 'src/data/cms';

// Chinese character pattern
const chineseRegex = /[\u4e00-\u9fff]+/g;

// Service-specific fallbacks for common contexts
const fallbackReplacements = {
  // Generic fallbacks for Chinese text found in security content
  '人口增长的社区需要可见的安保存在来阻止潜在入侵者': 'Comunidades en crecimiento requieren presencia de seguridad visible para disuadir intrusos',
  '你需要联系我们的顾问团队': 'Contacta a nuestro equipo de asesores',
  '合作伙伴': 'socios comerciales',
  '有任何疑问': 'Para cualquier consulta',
};

let totalCleaned = 0;
let totalFiles = 0;

function cleanString(str) {
  if (typeof str !== 'string') return str;
  
  let cleaned = str;
  let changed = false;
  
  // Try known replacements first
  for (const [chinese, spanish] of Object.entries(fallbackReplacements)) {
    if (cleaned.includes(chinese)) {
      cleaned = cleaned.replace(chinese, spanish);
      changed = true;
    }
  }
  
  // Remove remaining Chinese characters
  if (chineseRegex.test(cleaned)) {
    // Replace Chinese segments with empty string, clean up resulting punctuation issues
    cleaned = cleaned.replace(/[\u4e00-\u9fff]+/g, '').trim();
    // Fix double spaces, orphaned punctuation
    cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
    cleaned = cleaned.replace(/[，,]\s*[，,]/g, ',').trim();
    cleaned = cleaned.replace(/^[,，:：\s]+/, '').trim();
    cleaned = cleaned.replace(/[,，:：\s]+$/, '').trim();
    changed = true;
  }
  
  if (changed) totalCleaned++;
  return cleaned;
}

function cleanObject(obj) {
  if (typeof obj === 'string') return cleanString(obj);
  if (Array.isArray(obj)) return obj.map(item => cleanObject(item));
  if (obj && typeof obj === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      cleaned[key] = cleanObject(value);
    }
    return cleaned;
  }
  return obj;
}

function main() {
  console.log('=== Chinese Character Cleaner ===\n');

  const files = readdirSync(CMS_DIR).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = `${CMS_DIR}/${file}`;
    const content = readFileSync(filePath, 'utf-8');
    
    if (!chineseRegex.test(content)) continue;
    
    const data = JSON.parse(content);
    const cleaned = cleanObject(data);
    
    writeFileSync(filePath, JSON.stringify(cleaned, null, 2));
    
    // Verify
    const newContent = readFileSync(filePath, 'utf-8');
    const remaining = (newContent.match(chineseRegex) || []).length;
    
    if (remaining > 0) {
      console.log(`⚠️  ${file}: cleaned but ${remaining} Chinese chars remain`);
    } else {
      console.log(`✅ ${file}: cleaned`);
    }
    totalFiles++;
  }

  console.log(`\n${'='.repeat(40)}`);
  console.log(`Files cleaned: ${totalFiles}`);
  console.log(`Strings modified: ${totalCleaned}`);
  console.log('Done!');
}

main();
