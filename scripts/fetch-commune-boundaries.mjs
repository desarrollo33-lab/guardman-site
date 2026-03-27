import { writeFileSync, mkdirSync } from 'fs';

const communes = [
  { name: 'Santiago', slug: 'santiago-centro' },
  { name: 'Las Condes', slug: 'las-condes' },
  { name: 'Vitacura', slug: 'vitacura' },
  { name: 'Huechuraba', slug: 'huechuraba' },
  { name: 'Quilicura', slug: 'quilicura' },
  { name: 'Lo Barnechea', slug: 'lo-barnechea' },
  { name: 'La Reina', slug: 'la-reina' },
  { name: 'Renca', slug: 'renca' },
  { name: 'Pudahuel', slug: 'pudahuel' },
  { name: 'La Pintana', slug: 'la-pintana' },
  { name: 'Lampa', slug: 'lampa' },
  { name: 'Conchalí', slug: 'conchali' },
  { name: 'Los Andes', slug: 'los-andes' },
  { name: 'San Felipe', slug: 'san-felipe' },
];

const OUT = 'public/data/commune-boundaries.json';

function simplify(coords, tol = 0.0003) {
  if (coords.length <= 10) return coords;
  const r = [coords[0]];
  let p = coords[0];
  for (let i = 1; i < coords.length - 1; i++) {
    if (Math.sqrt((coords[i][0] - p[0]) ** 2 + (coords[i][1] - p[1]) ** 2) >= tol) {
      r.push(coords[i]); p = coords[i];
    }
  }
  r.push(coords[coords.length - 1]);
  return r;
}

async function getRelationId(communeName) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(communeName + ', Región Metropolitana, Chile')}&format=json&addressdetails=1&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'GuardMan/1.0 (guardman.cl)' },
  });
  const data = await res.json();
  if (!data.length) return null;

  // We need the OSM relation ID - check if it's in the osm_id
  const item = data[0];
  if (item.osm_type === 'relation') return item.osm_id;

  // If it's a node/way, search specifically for the relation
  return null;
}

async function getRelationIdViaSearch(communeName) {
  // Try searching more specifically
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(communeName + ' comuna Chile')}&format=json&limit=5&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'GuardMan/1.0 (guardman.cl)' },
  });
  const data = await res.json();
  const relation = data.find(d => d.osm_type === 'relation' && (d.address?.state === 'Región Metropolitana' || d.address?.state === 'Valparaíso'));
  if (relation) return relation.osm_id;

  // Fallback: any relation match
  const anyRelation = data.find(d => d.osm_type === 'relation');
  if (anyRelation) return anyRelation.osm_id;

  return null;
}

async function fetchPolygonGeoJSON(relationId) {
  const url = `https://polygons.openstreetmap.fr/get_geojson.py?id=${relationId}&params=0`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function main() {
  console.log('🗺️  Fetching commune boundaries...\n');

  const features = [];

  for (const commune of communes) {
    process.stdout.write(`  ${commune.name.padEnd(16)} `);

    try {
      // Step 1: Get relation ID from Nominatim
      let relId = await getRelationId(commune.name);
      if (!relId) {
        relId = await getRelationIdViaSearch(commune.name);
      }
      if (!relId) {
        console.log('⚠️  No relation ID found');
        continue;
      }
      process.stdout.write(`R${relId} `);

      // Step 2: Fetch polygon GeoJSON
      const geojson = await fetchPolygonGeoJSON(relId);

      // The response is a GeoJSON geometry directly (type + coordinates)
      // or wrapped in a Feature (geometry.type + geometry.coordinates)
      const geom = geojson.geometry || geojson;
      if (!geom.coordinates) {
        console.log('⚠️  No coordinates');
        continue;
      }

      // Step 3: Extract outer ring(s)
      let coords;

      if (geom.type === 'Polygon') {
        const outerRing = geom.coordinates.reduce((max, ring) => ring.length > max.length ? ring : max, []);
        coords = outerRing;
      } else if (geom.type === 'MultiPolygon') {
        const allRings = geom.coordinates.flat();
        const largest = allRings.reduce((max, ring) => ring.length > max.length ? ring : max, []);
        coords = largest;
      } else {
        console.log(`⚠️  Unknown type: ${geom.type}`);
        continue;
      }

      const simplified = simplify(coords);
      features.push({
        type: 'Feature',
        properties: { name: commune.name, slug: commune.slug },
        geometry: { type: 'Polygon', coordinates: [simplified] },
      });

      console.log(`✅ ${simplified.length} pts`);
    } catch (err) {
      console.log(`❌ ${err.message}`);
    }

    // Be nice to Nominatim (max 1 req/sec)
    await new Promise(r => setTimeout(r, 1200));
  }

  const collection = { type: 'FeatureCollection', features };
  mkdirSync('public/data', { recursive: true });
  writeFileSync(OUT, JSON.stringify(collection));

  const sizeKB = (Buffer.byteLength(JSON.stringify(collection)) / 1024).toFixed(1);
  console.log(`\n✅ ${features.length}/14 saved to ${OUT} (${sizeKB} KB)`);

  const slugs = features.map(f => f.properties.slug);
  const missing = communes.filter(c => !slugs.includes(c.slug));
  if (missing.length) console.log('Missing:', missing.map(m => m.name).join(', '));
}

main();
