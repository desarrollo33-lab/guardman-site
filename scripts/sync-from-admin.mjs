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

  // ===== SYNC BRAND DNA =====
  console.log('Syncing brand DNA...');
  try {
    const brandRes = await fetch(`${API_BASE}/api/brand`);
    const brandData = await brandRes.json();
    if (brandData.ok && brandData.data) {
      // Save as brand.json in cms dir
      writeFileSync(join(CMS_DIR, 'brand.json'), JSON.stringify(brandData.data, null, 2));
      console.log(`Brand synced: ${Object.keys(brandData.data).length} categories`);
    }
  } catch (e) {
    console.warn('Brand sync failed:', e.message);
  }

  // ===== SYNC MEDIA LIBRARY =====
  console.log('Syncing media library...');
  const imgDir = 'public/images';
  if (!existsSync(imgDir)) mkdirSync(imgDir, { recursive: true });

  try {
    // 1. Get media map (image assignments)
    const mapRes = await fetch(`${API_BASE}/api/media/map`);
    const mapData = await mapRes.json();
    if (mapData.ok && mapData.data) {
      // Save media map for the frontend
      writeFileSync(join(CMS_DIR, 'media-map.json'), JSON.stringify(mapData.data, null, 2));
      console.log('Media map saved');
    }

    // 2. Get all registered media
    const mediaRes = await fetch(`${API_BASE}/api/media?limit=500`);
    const mediaData = await mediaRes.json();
    if (mediaData.ok && mediaData.data) {
      const registeredKeys = new Set(mediaData.data.map(m => m.key));
      let imgSynced = 0;
      let imgSkipped = 0;

      // Download only registered images
      for (const img of mediaData.data) {
        const fileName = img.key.replace(/^images\//, '');
        const destPath = join(imgDir, fileName);

        // Skip PNGs if WebP version exists
        if (fileName.endsWith('.png')) {
          const webpPath = join(imgDir, fileName.replace('.png', '.webp'));
          if (existsSync(webpPath)) {
            imgSkipped++;
            continue;
          }
        }

        const alreadyExists = existsSync(destPath);
        if (alreadyExists) {
          imgSkipped++;
          continue;
        }

        const ok = await downloadImage(img.key, imgDir);
        if (ok) imgSynced++;
      }
      console.log(`Images synced: ${imgSynced} downloaded, ${imgSkipped} already present`);

      // 3. Clean orphan images (files not in media_library)
      const fs = await import('fs');
      const localFiles = fs.readdirSync(imgDir).filter(f =>
        f.match(/\.(webp|jpg|jpeg|png)$/)
      );
      let removed = 0;
      for (const f of localFiles) {
        const key = `images/${f}`;
        if (!registeredKeys.has(key)) {
          // Don't remove favicon or special files
          if (f.startsWith('favicon') || f.startsWith('.cache')) continue;
          // Remove orphan
          const fullPath = join(imgDir, f);
          const stat = fs.statSync(fullPath);
          if (stat.size > 100) { // Only real images, not tiny placeholders
            // Check if a webp version of this png exists (we prefer webp)
            if (f.endsWith('.png') && localFiles.includes(f.replace('.png', '.webp'))) {
              fs.unlinkSync(fullPath);
              removed++;
            }
          }
        }
      }
      if (removed > 0) console.log(`Cleaned ${removed} orphan/duplicate images`);
    }
  } catch (e) {
    console.warn('Media sync failed:', e.message);
  }

  console.log('Done!');
}

main().catch(err => { console.error(err); process.exit(1); });
