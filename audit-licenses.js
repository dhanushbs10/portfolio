const fs = require('fs');
const path = require('path');

const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
const projectLicense = pkg.license || '(MISSING - no "license" field in package.json)';
const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
const nodes = path.resolve('node_modules');

function readLicense(name) {
  const base = path.join(nodes, name);
  const map = [
    ['package.json', 'json'],
    ['LICENSE', 'file'],
    ['LICENSE.md', 'file'],
    ['LICENSE.txt', 'file'],
    ['LICENSE-MIT.txt', 'file'],
    ['LICENSE-APACHE.txt', 'file'],
    ['LICENSE-CODE', 'file'],
  ];
  for (const [f, kind] of map) {
    const p = path.join(base, f);
    if (fs.existsSync(p)) {
      if (kind === 'json') {
        try {
          const j = JSON.parse(fs.readFileSync(p, 'utf8'));
          if (j.license) return j.license;
        } catch (e) {}
      }
      return '(license file present)';
    }
  }
  return '(no license file found)';
}

// Check a few key deps more thoroughly: read first ~80 chars of license file
function readLicenseHeader(name) {
  const files = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENSE-MIT.txt', 'LICENSE-CODE'];
  const base = path.join(nodes, name);
  for (const f of files) {
    const p = path.join(base, f);
    if (fs.existsSync(p)) {
      try {
        const c = fs.readFileSync(p, 'utf8').slice(0, 200);
        return c;
      } catch (e) {}
    }
  }
  return null;
}

const results = Object.keys(deps).map(name => ({ name, license: readLicense(name) }));

// Flag clear incompatibilities: GPL/LGPL in deps where project does NOT use copyleft
function isCopyleft(l) {
  const lo = String(l).toLowerCase();
  return /gpl|lgpl|agpl/.test(lo);
}
function isPermissive(l) {
  const lo = String(l).toLowerCase();
  return /mit|apache|bsd|isc|unlicense|wtfpl/.test(lo);
}

// Project license: not set => treat as "all rights reserved" (most restrictive baseline)
// Incompatibility flags:
const incompatible = results.filter(r => isCopyleft(r.license));

// Also flag if project says permissive but deps have copyleft
const projectIsPermissive = isPermissive(projectLicense);

console.log('package.json license:', projectLicense);
console.log('Dependencies scanned:', Object.keys(deps).length);
console.log('\n=== All dependency licenses ===');
results.forEach(r => console.log(`  ${r.name}: ${r.license}`));

if (incompatible.length > 0) {
  console.log(`\n=== Potential license incompatibilities (${incompatible.length}) ===`);
  incompatible.forEach(r => console.log(`  ${r.name}: ${r.license}`));
} else {
  console.log('\n=== Potential license incompatibilities: NONE ===');
}

// Root LICENSE file
console.log('\n=== Root LICENSE files ===');
const rootLicenseDir = path.resolve('.');
try {
  const entries = fs.readdirSync(rootLicenseDir);
  const licenseFiles = entries.filter(f => /^LICENSE/i.test(f));
  console.log(licenseFiles.length > 0 ? licenseFiles : '(none found)');
} catch (e) {
  console.log('(error listing root directory)');
}

// Check source for headers
console.log('\n=== Source files with License: headers ===');
const srcDirs = [path.resolve('src'), path.resolve('components'), path.resolve('app')];
let headerCount = 0;
for (const d of srcDirs) {
  if (!fs.existsSync(d)) continue;
  let files;
  try { files = fs.readdirSync(d); } catch (e) { continue; }
  for (const f of files) {
    if (/\.(ts|tsx|js|jsx|json|md)$/.test(f) || !f.includes('.')) {
      const fp = path.join(d, f);
      let stat;
      try { stat = fs.statSync(fp); } catch(e) { continue; }
      if (stat.isDirectory()) {
        try {
          const subs = fs.readdirSync(fp);
          for (const sf of subs) {
            const sfp = path.join(fp, sf);
            if (/\.(ts|tsx|js|jsx)$/.test(sf)) {
              try {
                const content = fs.readFileSync(sfp, 'utf8').slice(0, 30);
                if (/^\/\/\s*License:/.test(content) || /^\/\*\s*License:/.test(content)) {
                  console.log(`  ${path.relative(rootLicenseDir, sfp)}: ${content.trim()}`);
                  headerCount++;
                }
              } catch(e) {}
            }
          }
        } catch(e) {}
      }
    }
  }
}
console.log(headerCount === 0 ? '  (none found)' : `(${headerCount} found)`);

// SPDX check in source
console.log('\n=== SPDX identifiers in source ===');
const spdxRe = /SPDX-License-Identifier|spdx/i;
let spdxCount = 0;
for (const d of srcDirs) {
  if (!fs.existsSync(d)) continue;
  const walk = (dir) => {
    try {
      const entries = fs.readdirSync(dir);
      for (const e of entries) {
        const full = path.join(dir, e);
        if (fs.statSync(full).isDirectory()) { walk(full); continue; }
        if (!/\.(ts|tsx|js|jsx|md|json)$/.test(e)) continue;
        try {
          const c = fs.readFileSync(full, 'utf8');
          if (spdxRe.test(c)) { console.log(`  ${path.relative(rootLicenseDir, full)}`); spdxCount++; }
        } catch(e) {}
      }
    } catch(e) {}
  };
  walk(d);
}
console.log(spdxCount === 0 ? '  (none found)' : `(${spdxCount} found)`);

// Special note on gsap
const gsapLic = readLicenseHeader('gsap');
console.log('\n=== gsap license note ===');
if (gsapLic) {
  console.log('Header snippet:', gsapLic.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim());
} else {
  console.log('(no file found)');
}
