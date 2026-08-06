const fs = require('fs');
const path = require('path');

['gsap', 'sharp'].forEach(name => {
  const p = path.join('node_modules', name, 'package.json');
  if (fs.existsSync(p)) {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    console.log(name, 'license:', j.license, 'licenseType:', j.licenseType);
  } else { console.log(name, ': no package.json'); }
  // also check for a license file
  ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENSE-MIT.txt', 'LICENSE-CODE'].forEach(f => {
    const fp = path.join('node_modules', name, f);
    if (fs.existsSync(fp)) {
      const header = fs.readFileSync(fp, 'utf8').slice(0, 150).replace(/\n/g,' ');
      console.log('  ', f, ':', header);
    }
  });
});
