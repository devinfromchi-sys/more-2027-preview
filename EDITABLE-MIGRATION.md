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


## HARD REQUIREMENT (Devin, 2026-07-27): Teri must edit AND MOVE things
Not just text edits. The end state per page is fully native, draggable Squarespace sections and
blocks. Consequences for the plan:
- Anything custom that survives (countdown, widgets) goes in a **native Code Block inside a normal
  section** so Teri can drag it like any block. No more injector-anchored elements on pages she
  manages (injectors that insert next to native sections break when she rearranges them).
- Speakers: prefer a native reorderable gallery/grid over the code carousel.
- Homepage "stays largely code" is REVISED: homepage sections should become native and movable
  too, with only the countdown as a Code Block. Migrate it like the other pages, last.
- The two temporary code patches (footer newsletter line, hero CTA) must convert to native.

## Suggested order
1. **FAQ** (proof page) — highest value: it is what Teri updates most, and its native content is
   stale so fixing it pays off twice (editable + accurate for crawlers).
2. Our Story, Volunteer, Sponsors, Boutique, Tickets (keep countdown in code).
3. Speakers — keep the carousel in code; make the names/photos native or a simple list.
4. Mission & Purpose — native is empty, needs a full build.
5. Homepage last (most custom); likely stays largely code with a few native-editable text areas.


## OUR STORY — progress (2026-07-13)
Native page fixes DONE + saved (invisible to visitors; injector still overrides):
- Button "Join Us at MORE 2026" -> "**Join Us at MORE 2027**" (link /tickets was already correct)
- Banner heading "About" -> "**Our Story**" (brand color span preserved)
- **5 em dashes -> commas** across Teri's story, mission bullet, and Salvation paragraph.
  All `<em>` italics preserved (verified by counting `<em>` before/after each edit).
Verified natively: banner OK, button 2027, 0 dashes, 0 horizontal overflow.
Verified live (both viewports): unchanged, 0 JS errors, injector still active.

### Squarespace editor methods that WORK (use these, they are proven)
- **Button block text:** select block -> pencil icon -> the Content panel TEXT field is a React
  input, so set it with the native setter, not `.value=`:
  `Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input, txt)`
  then dispatch `input` + `change`.
- **Character-level text edit that preserves inline formatting** (do NOT replace whole paragraphs,
  it destroys `<em>`/`<u>`/color spans): walk text nodes, build a `Range` around just the target
  characters, `sel.removeAllRanges(); sel.addRange(range)`, then
  `document.execCommand('insertText', false, replacement)` and dispatch `input` on the
  `[contenteditable="true"]` ancestor. Verify by counting inline tags before/after.
- Canvas scroll: programmatic `scrollTop` is LOCKED; use real mouse-wheel scroll over the canvas
  (~25 ticks at a time) and re-measure `getBoundingClientRect` between scrolls.
- Coordinates: `computer` clicks use SCREENSHOT pixel space; JS rects are real pixels. Scale by
  (screenshot width / window.innerWidth) before clicking.
- In the editor all native sections are VISIBLE even though the injector also renders, so native
  blocks can be edited without removing the injector first.

## BLOCKERS before removing mc-story.js from the loader
1. ~~**Header contrast.**~~ **RESOLVED 2026-07-27 (pin e81e270).** `#header` was transparent with
   full-bleed banner imagery behind it, so nav text crossed cream AND dark foliage. Fixed in
   `mc-pagefix.js` (`mc-hdr-legible`): a cream scrim on `#header`
   `linear-gradient(180deg,rgba(250,246,234,.96),rgba(250,246,234,.94) 72%,rgba(250,246,234,.80))`
   plus `backdrop-filter: blur(10px)` as progressive enhancement only (the gradient alone
   guarantees the contrast; worst case over the darkest leaf is still about 5:1 for bronze
   #7a5c10). Verified 20/20 (10 pages x desktop + mobile): scrim applied, 0 overflow, 0 JS errors.
   Homepage header is pixel identical (scrim is invisible on already cream backgrounds).
   NOTE: the header children are z-index 1..3 and positioned, so setting `background` directly on
   `#header` is safe; do NOT use a `::before` scrim (it would paint over the static inline svg).

2. **Content parity.** STILL OPEN. The injected page has content the native page does NOT:
   - "2025 and 2026: Where We Have Been" + 2025/2026 Featured Guests
   - Impact bullets (hundreds saved each year, nonprofit partners, ASL via Sonshine Interpreting)
   Removing the injector without adding these natively LOSES that content. **Asked Ryan Hosman
   2026-07-27 (email sent) whether to keep that section.** Native page uniquely has Vision,
   Mission, Spiritual Purpose, and the full Statement of Belief.

## Deploy flow reminder (DEPLOY.md)
Pushing to this repo does NOT change the live site. Release = push -> `node tools/mkloader.mjs` ->
paste `tools/loader.html` into Settings > Advanced > Code Injection (keep the Google Fonts lines)
-> verify. Removing a page's injector = drop its ROUTES line, regenerate, paste.

## Open questions
- RESOLVED: phone is (815) 409 0144; Volunteer typo fixed natively 2026-07-27.
- RESOLVED: 2027 meet and greets per Ryan spec (Friday JJ Barrows included; Saturday Annie F. Downs
  and Sheila Walsh, raffle only).
- OPEN with Ryan: keep the "2025 and 2026: Where We Have Been" section on Our Story?
