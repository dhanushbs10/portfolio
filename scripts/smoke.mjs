import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = './dist/';

const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) htmlFiles.push(p);
  }
};
walk(dist);

const required = ['index.html', 'work/index.html', 'overview/index.html', 'resume/index.html', 'contact/index.html', '404.html'];
const missing = required.filter((r) => !existsSync(join(dist, r)));
if (missing.length) {
  console.error('Missing routes:', missing);
  process.exit(1);
}

const requiredAssets = ['favicon.svg', 'robots.txt', 'sitemap.xml', 'Dhanush_BS_Resume.pdf', 'resume/page-1.png'];
const missingAssets = requiredAssets.filter((r) => !existsSync(join(dist, r)));
if (missingAssets.length) {
  console.error('Missing assets:', missingAssets);
  process.exit(1);
}

const bad = [];
for (const f of htmlFiles) {
  const route = '/' + f.split('dist')[1].replaceAll('\\', '/').replace(/\/index\.html$/, '').replace(/index\.html$/, '');
  let text = '';
  try {
    text = readFileSync(f, 'utf8');
  } catch {
    bad.push(`${route}: unreadable`);
    continue;
  }
  if (route.includes('/resume') && text.includes('PLACEHOLDER')) bad.push(`${route}: stale placeholder content`);
}

if (bad.length) {
  console.error('Smoke check failed:', bad.join('\n'));
  process.exit(1);
}
console.log(`Smoke check OK: ${htmlFiles.length} HTML files; ${required.length} routes + ${requiredAssets.length} assets verified.`);