#!/usr/bin/env node
/**
 * MORE 2027 site verification harness.
 * Layer 1: raw-HTML checks (fetch) — what crawlers/no-JS clients see.
 * Layer 2: rendered checks (puppeteer-core -> installed Chrome) with REAL
 *          CDP device emulation (not --window-size) + console capture +
 *          overflow culprit finder.
 *
 * Usage:
 *   node tools/verify.mjs                    # both layers, all pages, both viewports
 *   node tools/verify.mjs --layer1           # raw checks only
 *   node tools/verify.mjs --pages=/,/tickets # subset
 *   node tools/verify.mjs --viewport=mobile  # mobile only
 *   node tools/verify.mjs --json=out.json    # also write JSON report
 * Exit code: 0 = all pass, 1 = failures.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const cfg = JSON.parse(readFileSync(join(__dir, 'pages.json'), 'utf8'));

const args = Object.fromEntries(process.argv.slice(2).map(a => {
  const m = a.match(/^--([^=]+)(?:=(.*))?$/); return m ? [m[1], m[2] ?? true] : [a, true];
}));
const layer1Only = !!args.layer1;
const layer2Only = !!args.layer2;
const wantPages = args.pages ? String(args.pages).split(',') : null;
const viewports = args.viewport === 'mobile' ? ['mobile'] : args.viewport === 'desktop' ? ['desktop'] : ['desktop', 'mobile'];

const pages = cfg.pages.filter(p => !wantPages || wantPages.includes(p.path));
const results = [];
const fail = (page, layer, check, detail) => results.push({ page, layer, check, ok: false, detail });
const pass = (page, layer, check, detail) => results.push({ page, layer, check, ok: true, detail });

// ---------- Layer 1: raw HTML ----------
async function layer1(p) {
  const url = cfg.base + p.path;
  let res, html;
  try {
    res = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (verify-harness)' } });
    html = await res.text();
  } catch (e) { return fail(p.path, 1, 'fetch', String(e)); }
  res.status === 200 ? pass(p.path, 1, 'http200') : fail(p.path, 1, 'http200', `status ${res.status}`);
  if (p.draft) return; // drafts: only reachability

  for (const s of p.scripts || []) {
    html.includes(s) ? pass(p.path, 1, `script:${s}`) : fail(p.path, 1, `script:${s}`, 'script tag missing in raw HTML');
  }
  const count = (re) => (html.match(re) || []).length;
  const t = count(/ticketspice\.com/gi);
  // raw ticketspice links are a known crawler-facing issue until Phase 3 fixes them natively
  results.push({ page: p.path, layer: 1, check: 'raw:ticketspice', ok: t === 0, detail: `${t} raw occurrence(s)` , knownUntilPhase3: t > 0 });
  const orphan = count(/(^|[^<\w"'/])script>/g);
  orphan === 0 ? pass(p.path, 1, 'raw:no-orphan-script') : fail(p.path, 1, 'raw:no-orphan-script', `${orphan} literal script> in raw HTML`);
  const y = count(/2026/g);
  y <= (p.budget2026 ?? 99) ? pass(p.path, 1, 'raw:2026-budget', `${y} <= ${p.budget2026}`) : fail(p.path, 1, 'raw:2026-budget', `${y} > budget ${p.budget2026}`);
  const desc = html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i) || html.match(/<meta[^>]+content="([^"]*)"[^>]+name="description"/i);
  const descOk = !!(desc && desc[1] && desc[1].trim().length > 20);
  results.push({ page: p.path, layer: 1, check: 'meta:description', ok: descOk, detail: desc ? `"${(desc[1]||'').slice(0,60)}"` : 'missing', knownUntilPhase3: !descOk });
  const og = html.match(/property="og:image"[^>]+content="([^"]+)"/i) || html.match(/content="([^"]+)"[^>]+property="og:image"/i);
  const ogOk = !!(og && og[1].startsWith('https://'));
  results.push({ page: p.path, layer: 1, check: 'meta:og-image-https', ok: ogOk, detail: og ? og[1].slice(0, 80) : 'missing', knownUntilPhase3: !ogOk });
  html.includes('info@morewomensconference.com')
    ? fail(p.path, 1, 'raw:wrong-email', 'info@morewomensconference.com present')
    : pass(p.path, 1, 'raw:wrong-email');
}

// ---------- Layer 2: rendered ----------
async function layer2(browser, p, vp) {
  if (p.draft) return;
  const url = cfg.base + p.path;
  const page = await browser.newPage();
  const consoleErrs = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrs.push(m.text().slice(0, 200)); });
  page.on('pageerror', e => consoleErrs.push('pageerror: ' + String(e).slice(0, 200)));
  if (vp === 'mobile') {
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1');
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  } else {
    await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  }
  const tag = `${p.path}@${vp}`;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 45000 });
    if (p.marker) {
      await page.waitForSelector(p.marker, { timeout: 15000 });
    }
    await new Promise(r => setTimeout(r, 3000)); // let mc-pagefix timers (400-2500ms) run

    const report = await page.evaluate((marker, must) => {
      const out = {};
      if (marker) out.markerCount = document.querySelectorAll(marker).length;
      out.missing = (must || []).filter(s => !document.body.innerText.includes(s) && !document.body.innerHTML.includes(s));
      out.ticketspiceAnchors = document.querySelectorAll('a[href*="ticketspice.com"]').length;
      // literal "script>" text nodes
      let stray = 0;
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) { const v = (w.currentNode.nodeValue || '').trim(); if (v === 'script>' || v === '</script>' || v.startsWith('script>')) stray++; }
      out.strayScriptText = stray;
      out.innerWidth = window.innerWidth;
      out.scrollWidth = document.documentElement.scrollWidth;
      out.culprits = [];
      if (out.scrollWidth > out.innerWidth + 1) {
        document.querySelectorAll('body *').forEach(el => {
          const r = el.getBoundingClientRect();
          if ((r.right > out.innerWidth + 1 || r.left < -1) && r.width > 4 && out.culprits.length < 10) {
            const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
            if (!/grecaptcha/.test(cls)) out.culprits.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${cls ? '.' + cls : ''} right=${Math.round(r.right)}`);
          }
        });
      }
      return out;
    }, p.marker, p.mustContain || []);

    if (p.marker) {
      report.markerCount === 1 ? pass(tag, 2, 'marker-x1') : fail(tag, 2, 'marker-x1', `${p.marker} count=${report.markerCount}`);
    }
    report.missing.length === 0 ? pass(tag, 2, 'content') : fail(tag, 2, 'content', 'missing: ' + report.missing.join(' | '));
    report.ticketspiceAnchors === 0 ? pass(tag, 2, 'no-ticketspice-anchors') : fail(tag, 2, 'no-ticketspice-anchors', `${report.ticketspiceAnchors} anchors`);
    report.strayScriptText === 0 ? pass(tag, 2, 'no-stray-script-text') : fail(tag, 2, 'no-stray-script-text', `${report.strayScriptText} nodes`);
    const overflowOk = report.scrollWidth <= report.innerWidth + 1;
    // filter grecaptcha-only overflow (badge intentionally offscreen)
    overflowOk || report.culprits.length === 0
      ? pass(tag, 2, 'no-h-overflow', `${report.scrollWidth}/${report.innerWidth}`)
      : fail(tag, 2, 'no-h-overflow', `scrollWidth ${report.scrollWidth} > ${report.innerWidth}; culprits: ${report.culprits.join(' ; ')}`);

    if (p.countdown) {
      const s1 = await page.evaluate(() => (document.getElementById('s') || {}).textContent);
      await new Promise(r => setTimeout(r, 1600));
      const s2 = await page.evaluate(() => (document.getElementById('s') || {}).textContent);
      (s1 != null && s2 != null && s1 !== s2) ? pass(tag, 2, 'countdown-ticking', `${s1}->${s2}`) : fail(tag, 2, 'countdown-ticking', `s: ${s1} -> ${s2}`);
    }
    const mcErrs = consoleErrs.filter(e => /mc-|mc /.test(e));
    mcErrs.length === 0 ? pass(tag, 2, 'console-mc-clean') : fail(tag, 2, 'console-mc-clean', mcErrs.join(' | '));
    results.push({ page: tag, layer: 2, check: 'console-all', ok: consoleErrs.length === 0, detail: consoleErrs.slice(0, 3).join(' | ') || 'clean', informational: true });
  } catch (e) {
    fail(tag, 2, 'render', String(e).slice(0, 200));
  } finally {
    await page.close().catch(() => {});
  }
}

// ---------- run ----------
(async () => {
  if (!layer2Only) {
    for (const p of pages) await layer1(p);
  }
  if (!layer1Only) {
    const { default: puppeteer } = await import('puppeteer-core');
    const browser = await puppeteer.launch({ executablePath: cfg.chrome, headless: 'new', args: ['--no-sandbox', '--disable-gpu'] });
    try {
      for (const vp of viewports) {
        for (const p of pages) await layer2(browser, p, vp);
      }
    } finally { await browser.close(); }
  }

  const hard = results.filter(r => !r.ok && !r.informational && !r.knownUntilPhase3);
  const known = results.filter(r => !r.ok && r.knownUntilPhase3);
  const info = results.filter(r => !r.ok && r.informational);
  console.log(`\n===== VERIFY: ${results.filter(r => r.ok).length} pass / ${hard.length} FAIL / ${known.length} known-pending / ${info.length} info =====`);
  for (const r of hard) console.log(`FAIL  [${r.page}] ${r.check}: ${r.detail || ''}`);
  for (const r of known) console.log(`known [${r.page}] ${r.check}: ${r.detail || ''}`);
  for (const r of info) console.log(`info  [${r.page}] ${r.check}: ${r.detail || ''}`);
  if (args.json) writeFileSync(String(args.json), JSON.stringify({ when: new Date().toISOString(), results }, null, 1));
  process.exit(hard.length ? 1 : 0);
})();
