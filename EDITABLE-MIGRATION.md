# MORE 2027 — Making the site editable for Teri

**Decision (Devin):** Hybrid. Move the content Teri actually changes (dates, prices, speakers,
FAQ answers, copy) into native Squarespace blocks she can edit. Keep the countdown, animated
hero, speaker carousel, and brand CSS in code (CSS only styles native content, it does not
overwrite it, so it never blocks editing).

## Why this is needed (root cause)
The homepage and all main interior pages are **rebuilt by JavaScript** (`#mc` / `#mcpg` / `#mcsp`
injectors, from base64 blobs in this repo). When Teri edits those pages in Squarespace, the JS
overwrites her changes on load, so her edits "don't work."

## CRITICAL FINDING (2026-07-13, verified by loading pages with the injectors blocked)
The native pages underneath are NOT clean-but-plain; several still hold **stale 2025/2026 content**:
- `/faqs` — 5,464 chars / 63 blocks. Banner + "Location & Time" card (dates ARE correct 2027, fixed
  natively earlier) BUT also a **"Meredith Andrews Meet & Greet"** section. Meredith was a **2025**
  guest, not a 2027 speaker. Plus "Hotel & Lodging". So the native page is largely last year's FAQ.
- `/our-story` — 5,919 chars / 36 blocks (real content; needs a year/accuracy pass).
- `/mission-purpose` — 885 chars / 18 blocks = **essentially empty**; needs a full native build.

**Consequence:** deleting a page's injector would EXPOSE STALE CONTENT to visitors. So per page the
migration is:
1. Update the native content to 2027 in the Squarespace editor  <-- this is the real work
2. Verify it looks right on desktop + mobile
3. Remove that page's injector from `tools/mkloader.mjs` ROUTES, regenerate, re-pin
4. Re-verify (harness + screenshots)

**Bonus:** this also fixes crawler/SEO exposure, since the raw HTML search engines fetch is the
native content, not the injected content.

## Editor automation reality (learned the hard way — read before editing)
- `cmd+A` in the canvas selects **BLOCKS, not text** (nearly deleted blocks). Do not use it.
- Typing after a double/triple-click lands mid-word and mangles text.
- Undo (`cmd+Z`) frequently does not restore.
- **WORKING METHOD for a text block:** focus the `[contenteditable]`, then
  `range.selectNodeContents(p)` + `document.execCommand('insertText', false, newText)` +
  dispatch `input`/`change`, then click SAVE. Verified on the footer copyright.
- Canvas scroll wedges after edits; scroll with the mouse wheel on a fresh editor entry.
- Only ONE editing session at a time — never hold the editor while Teri is working.

## Suggested order
1. **FAQ** (proof page) — highest value: it is what Teri updates most, and its native content is
   stale so fixing it pays off twice (editable + accurate for crawlers).
2. Our Story, Volunteer, Sponsors, Boutique, Tickets (keep countdown in code).
3. Speakers — keep the carousel in code; make the names/photos native or a simple list.
4. Mission & Purpose — native is empty, needs a full build.
5. Homepage last (most custom); likely stays largely code with a few native-editable text areas.

## Deploy flow reminder (DEPLOY.md)
Pushing to this repo does NOT change the live site. Release = push -> `node tools/mkloader.mjs` ->
paste `tools/loader.html` into Settings > Advanced > Code Injection (keep the Google Fonts lines)
-> verify. Removing a page's injector = drop its ROUTES line, regenerate, paste.

## Open questions for Devin
- Volunteer page phone **815-406-0144** vs footer **815-409-0144** — which is correct?
- Confirm the FAQ content for 2027 (is there a Meet & Greet this year? who?) before rewriting.
