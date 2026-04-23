import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..');

function run(cmd, label) {
  console.log(`\n=== ${label} ===`);
  console.log(`> ${cmd}`);
  try {
    const output = execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf-8', timeout: 120000 });
    const lines = output.trim().split('\n');
    const lastLines = lines.slice(-5).join('\n');
    console.log(lastLines);
    return true;
  } catch (err) {
    console.error(`FAILED: ${err.message}`);
    if (err.stdout) console.log(err.stdout.slice(-500));
    if (err.stderr) console.error(err.stderr.slice(-500));
    return false;
  }
}

async function main() {
  console.log('GuardMan Site - Full Deploy Pipeline');
  console.log('=====================================');

  if (!run('node scripts/sync-from-admin.mjs', '1/3 Sync from Admin API')) {
    process.exit(1);
  }

  if (!run('npm run build', '2/3 Build Astro Site')) {
    process.exit(1);
  }

  if (!run('npx wrangler pages deploy dist --project-name=guardman-site-v2', '3/3 Deploy to Cloudflare Pages')) {
    process.exit(1);
  }

  console.log('\n=====================================');
  console.log('Deploy complete!');
  console.log('https://guardman-site-v2.pages.dev');
}

main().catch(err => { console.error(err); process.exit(1); });
