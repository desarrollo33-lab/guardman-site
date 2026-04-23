import { writeFileSync, mkdirSync, existsSync, createWriteStream } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const API_BASE = 'https://guardman-admin-api.oficinadesarrollo33.workers.dev';
const CMS_DIR = 'src/data/cms';
const CMS_NEW_DIR = 'src/data/cms-new';

async function fetchJSON(path) {
  const res = await fetch(`${API_BASE}${path}`);
  const data = await res.json();
  if (!data.ok) throw new Error(`API error ${path}: ${JSON.stringify(data)}`);
  return data.data;
}

async function fetchCMSContent(type, slug, location) {
  let url = `${API_BASE}/api/cms/content?type=${type}&slug=${slug}`;
  if (location) url += `&location=${location}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.ok ? data.content : null;
}

async function downloadImage(key, destDir) {
  const url = `${API_BASE}/api/images/${key}`;
  const fileName = key.split('/').pop();
  const destPath = join(destDir, fileName);
  try {
    const res = await fetch(url);
    if (!res.ok) return false;
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(destPath, buffer);
    return true;
  } catch (e) {
    console.warn(`  Failed to download ${key}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('Syncing from guardman-admin (D1 + CMS)...');

  if (!existsSync(CMS_DIR)) mkdirSync(CMS_DIR, { recursive: true });
  if (!existsSync(CMS_NEW_DIR)) mkdirSync(CMS_NEW_DIR, { recursive: true });

  const services = await fetchJSON('/api/services');
  writeFileSync(join(CMS_DIR, 'services.json'), JSON.stringify({ results: services }, null, 2));
  console.log(`Services: ${services.length}`);

  const locations = await fetchJSON('/api/locations');
  writeFileSync(join(CMS_DIR, 'locations.json'), JSON.stringify({ results: locations }, null, 2));
  console.log(`Locations: ${locations.length}`);

  const sectors = await fetchJSON('/api/sectors');
  writeFileSync(join(CMS_DIR, 'sectors.json'), JSON.stringify({ results: sectors }, null, 2));
  console.log(`Sectors: ${sectors.length}`);

  console.log('Syncing individual content from CMS...');

  // Sync homepage
  try {
    const hpRes = await fetch(`${API_BASE}/api/cms/homepage`);
    const hpData = await hpRes.json();
    if (hpData.ok && hpData.content) {
      writeFileSync('homepage.json', JSON.stringify(hpData.content, null, 2));
      console.log('Homepage synced');
    }
  } catch (e) {
    console.warn('Homepage sync failed:', e.message);
  }

  let synced = 0;

  for (const s of services) {
    const content = await fetchCMSContent('service', s.slug);
    if (content) {
      writeFileSync(join(CMS_DIR, `${s.slug}.json`), JSON.stringify({ sections: content.content || content }, null, 2));
      mkdirSync(`${CMS_NEW_DIR}/services`, { recursive: true });
      writeFileSync(join(CMS_NEW_DIR, 'services', `${s.slug}.json`), JSON.stringify(content, null, 2));
      synced++;
    }
  }

  for (const l of locations) {
    const content = await fetchCMSContent('location', l.slug);
    if (content) {
      writeFileSync(join(CMS_DIR, `location-${l.slug}.json`), JSON.stringify({ sections: content.content || content }, null, 2));
      mkdirSync(`${CMS_NEW_DIR}/locations`, { recursive: true });
      writeFileSync(join(CMS_NEW_DIR, 'locations', `${l.slug}.json`), JSON.stringify(content, null, 2));
      synced++;
    }
  }

  for (const sec of sectors) {
    const content = await fetchCMSContent('sector', sec.slug);
    if (content) {
      writeFileSync(join(CMS_DIR, `sector-${sec.slug}.json`), JSON.stringify({ sections: content.content || content }, null, 2));
      mkdirSync(`${CMS_NEW_DIR}/sectors`, { recursive: true });
      writeFileSync(join(CMS_NEW_DIR, 'sectors', `${sec.slug}.json`), JSON.stringify(content, null, 2));
      synced++;
    }
  }

  mkdirSync(`${CMS_NEW_DIR}/combos`, { recursive: true });
  for (const s of services) {
    for (const l of locations) {
      const content = await fetchCMSContent('combo', s.slug, l.slug);
      if (content) {
        mkdirSync(`${CMS_NEW_DIR}/combos/${s.slug}`, { recursive: true });
        writeFileSync(join(CMS_NEW_DIR, 'combos', s.slug, `${l.slug}.json`), JSON.stringify(content, null, 2));
        writeFileSync(join(CMS_DIR, `combo-${s.slug}-${l.slug}.json`), JSON.stringify({ sections: content.content || content }, null, 2));
        synced++;
      }
    }
  }

  console.log(`Content synced: ${synced} pages`);

  // Sync images from R2
  console.log('Syncing images from admin R2...');
  const imgDir = 'public/images';
  if (!existsSync(imgDir)) mkdirSync(imgDir, { recursive: true });

  try {
    const imgRes = await fetch(`${API_BASE}/api/images`);
    const imgData = await imgRes.json();
    if (imgData.ok && imgData.data) {
      const imageFiles = imgData.data.filter(o => o.key.startsWith('images/') && o.key.match(/\.(webp|jpg|jpeg|png)$/));
      let imgSynced = 0;
      for (const img of imageFiles) {
        const fileName = img.key.replace('images/', '');
        const destPath = join(imgDir, fileName);
        const alreadyExists = existsSync(destPath);
        const localSize = alreadyExists ? (await import('fs')).statSync(destPath).size : 0;
        if (alreadyExists && localSize === img.size) {
          imgSynced++;
          continue;
        }
        const ok = await downloadImage(img.key, imgDir);
        if (ok) imgSynced++;
      }
      console.log(`Images synced: ${imgSynced}/${imageFiles.length}`);
    }
  } catch (e) {
    console.warn('Image sync failed:', e.message);
  }

  console.log('Done!');
}

main().catch(err => { console.error(err); process.exit(1); });
