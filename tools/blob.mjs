#!/usr/bin/env node
/**
 * Base64 blob editor for the mc-*.js injectors.
 * The injectors decode blobs with:
 *   b64(s) = decodeURIComponent(atob(s) chars -> %hex)   [UTF-8 safe]
 * so encoding here MUST be Buffer.from(str,'utf8').toString('base64').
 *
 * Commands:
 *   node tools/blob.mjs list   <file.js>                 # index blobs (>=200 chars)
 *   node tools/blob.mjs decode <file.js> <idx> <out>     # write decoded text
 *   node tools/blob.mjs encode <file.js> <idx> <in>      # splice re-encoded text back
 * Every encode asserts decode(encode(x)) === x before writing.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [cmd, file, idxArg, ioArg] = process.argv.slice(2);
if (!cmd || !file) { console.error('usage: blob.mjs list|decode|encode <file.js> [idx] [in|out]'); process.exit(2); }

const src = readFileSync(file, 'utf8');
const re = /[A-Za-z0-9+/=]{200,}/g;
const blobs = [...src.matchAll(re)];

const decode = (b64) => Buffer.from(b64, 'base64').toString('utf8');
const encode = (txt) => Buffer.from(txt, 'utf8').toString('base64');

if (cmd === 'list') {
  blobs.forEach((m, i) => {
    const d = decode(m[0]);
    const kind = d.trimStart().startsWith('<') ? 'HTML' : /[{;].*:/.test(d.slice(0, 200)) ? 'CSS' : '?';
    console.log(`[${i}] offset=${m.index} b64len=${m[0].length} decoded=${d.length} kind=${kind} head="${d.slice(0, 70).replace(/\n/g, ' ')}"`);
  });
  process.exit(0);
}

const idx = Number(idxArg);
if (!(idx >= 0 && idx < blobs.length)) { console.error(`blob idx out of range (0..${blobs.length - 1})`); process.exit(2); }
const m = blobs[idx];

if (cmd === 'decode') {
  writeFileSync(ioArg, decode(m[0]));
  console.log(`decoded blob ${idx} -> ${ioArg} (${decode(m[0]).length} chars)`);
  process.exit(0);
}

if (cmd === 'encode') {
  const txt = readFileSync(ioArg, 'utf8');
  const b = encode(txt);
  if (decode(b) !== txt) { console.error('ROUND-TRIP FAILED — aborting, file untouched'); process.exit(1); }
  const out = src.slice(0, m.index) + b + src.slice(m.index + m[0].length);
  writeFileSync(file, out);
  console.log(`spliced blob ${idx} in ${file}: ${m[0].length} -> ${b.length} b64 chars (round-trip OK)`);
  process.exit(0);
}
console.error('unknown command'); process.exit(2);
