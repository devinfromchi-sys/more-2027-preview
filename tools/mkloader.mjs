#!/usr/bin/env node
/**
 * Generates the site-wide pinned loader for Squarespace Settings → Advanced → Code Injection.
 * - Pins every script to the CURRENT commit sha via jsDelivr (immutable, permanently cached).
 * - Emits sha384 SRI (integrity + crossorigin) per file.
 * Usage: node tools/mkloader.mjs [sha]   (defaults to HEAD)
 * Output: prints the loader HTML; also writes tools/loader.html
 */
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const repoDir = new URL('..', import.meta.url).pathname;
const sha = (process.argv[2] || execSync('git rev-parse HEAD', { cwd: repoDir }).toString().trim());
if (!/^[0-9a-f]{40}$/.test(sha)) { console.error('need full 40-char sha'); process.exit(1); }

// path(s) -> page injector. mc-pagefix.js loads on every page.
const ROUTES = [
  [['/', '/moreconference'], 'mc-inject.js'],
];
const FILES = ['mc-pagefix.js', ...ROUTES.map(r => r[1])];

const sri = {};
for (const f of FILES) sri[f] = 'sha384-' + createHash('sha384').update(readFileSync(repoDir + f)).digest('base64');

const base = `https://cdn.jsdelivr.net/gh/devinfromchi-sys/more-2027-preview@${sha}/`;
const routesLit = ROUTES.map(([paths, f]) => `    [${JSON.stringify(paths)}, ${JSON.stringify(f)}, ${JSON.stringify(sri[f])}]`).join(',\n');

const loader = `<!-- MORE 2027 pinned loader · commit ${sha.slice(0, 12)} · generated ${new Date().toISOString().slice(0, 10)} -->
<script src="${base}mc-pagefix.js" integrity="${sri['mc-pagefix.js']}" crossorigin="anonymous" defer></script>
<script>
(function () {
  var p = location.pathname.replace(/\\/+$/, '');
  if (p === '') p = '/';
  var routes = [
${routesLit}
  ];
  for (var i = 0; i < routes.length; i++) {
    if (routes[i][0].indexOf(p) !== -1) {
      var s = document.createElement('script');
      s.src = ${JSON.stringify(base)} + routes[i][1];
      s.integrity = routes[i][2];
      s.crossOrigin = 'anonymous';
      s.defer = true;
      document.head.appendChild(s);
    }
  }
})();
</script>`;

writeFileSync(repoDir + 'tools/loader.html', loader);
console.log(loader);
console.error(`\nwrote tools/loader.html (pin=${sha.slice(0, 12)}, ${FILES.length} files)`);
