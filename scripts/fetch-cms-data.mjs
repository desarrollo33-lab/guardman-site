/**
 * Fetch CMS data at build time and save to JSON
 * Run: node scripts/fetch-cms-data.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'src', 'data', 'generated');

const DIRECTUS_URL = 'http://64.176.16.231:8055';

// Get token from Directus
async function login() {
  const res = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@guardman.cl', password: 'GuardMan2024!' })
  });
  const data = await res.json();
  return data.data.access_token;
}

async function fetchData(token, endpoint) {
  const res = await fetch(`${DIRECTUS_URL}${endpoint}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  return data.data || [];
}

async function main() {
  console.log('🔄 Fetching data from Directus CMS...\n');
  
  try {
    const token = await login();
    console.log('✅ Connected to Directus\n');
    
    // Ensure directory exists
    mkdirSync(DATA_DIR, { recursive: true });
    
    // Fetch all data
    const [services, locations, sectors, clients, testimonials, siteConfig] = await Promise.all([
      fetchData(token, '/items/services?filter={"status":{"_eq":"published"}}&sort=sort&limit=-1'),
      fetchData(token, '/items/locations?filter={"status":{"_eq":"published"}}&sort=sort&limit=-1'),
      fetchData(token, '/items/sectors?filter={"status":{"_eq":"published"}}&sort=sort&limit=-1'),
      fetchData(token, '/items/clients?filter={"featured":{"_eq":true},"status":{"_eq":"published"}}&sort=sort&limit=-1'),
      fetchData(token, '/items/testimonials?filter={"featured":{"_eq":true},"status":{"_eq":"published"}}&sort=sort&limit=10'),
      fetchData(token, '/items/site_config?limit=1'),
    ]);
    
    // Process and save services
    const processedServices = services.map(s => ({
      ...s,
      features: typeof s.features === 'string' ? JSON.parse(s.features || '[]') : (s.features || []),
      process: typeof s.process === 'string' ? JSON.parse(s.process || '[]') : (s.process || []),
      common_issues: typeof s.common_issues === 'string' ? JSON.parse(s.common_issues || '[]') : (s.common_issues || []),
    }));
    writeFileSync(join(DATA_DIR, 'services.json'), JSON.stringify(processedServices, null, 2));
    console.log(`✓ Services: ${processedServices.length} records`);
    
    // Process and save locations
    const processedLocations = locations.map(l => ({
      ...l,
      neighborhoods: typeof l.neighborhoods === 'string' ? JSON.parse(l.neighborhoods || '[]') : (l.neighborhoods || []),
    }));
    writeFileSync(join(DATA_DIR, 'locations.json'), JSON.stringify(processedLocations, null, 2));
    console.log(`✓ Locations: ${processedLocations.length} records`);
    
    // Process and save sectors
    const processedSectors = sectors.map(s => ({
      ...s,
      challenges: typeof s.challenges === 'string' ? JSON.parse(s.challenges || '[]') : (s.challenges || []),
    }));
    writeFileSync(join(DATA_DIR, 'sectors.json'), JSON.stringify(processedSectors, null, 2));
    console.log(`✓ Sectors: ${processedSectors.length} records`);
    
    // Process and save clients
    const processedClients = clients.map(c => ({
      ...c,
      services: typeof c.services === 'string' ? JSON.parse(c.services || '[]') : (c.services || []),
    }));
    writeFileSync(join(DATA_DIR, 'clients.json'), JSON.stringify(processedClients, null, 2));
    console.log(`✓ Clients: ${processedClients.length} records`);
    
    // Save testimonials
    writeFileSync(join(DATA_DIR, 'testimonials.json'), JSON.stringify(testimonials, null, 2));
    console.log(`✓ Testimonials: ${testimonials.length} records`);
    
    // Save site config (singleton - API returns object not array)
    const configData = siteConfig || {};
    writeFileSync(join(DATA_DIR, 'site-config.json'), JSON.stringify(configData, null, 2));
    console.log(`✓ Site config: ${Object.keys(configData).length > 0 ? '1' : '0'} record(s)`);
    
    console.log('\n✅ Data fetched successfully!');
    console.log(`   Saved to: ${DATA_DIR}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
