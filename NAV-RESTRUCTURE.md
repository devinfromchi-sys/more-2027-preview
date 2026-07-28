# Navigation restructure — status and the 2 minute manual step

## Why: the nav is the biggest visual problem
Ten flat top-level items wrap onto TWO lines at every desktop width (verified 1440, 1280, 1100:
`rows=2`, nav height 54px). That two line wrap is the main thing making the site read as unfinished.

## DONE (automated, live)
Shortened the two longest labels using the **Navigation Title** field in Page Settings, which
changes ONLY the nav label. Page titles and URLs are untouched, both pages still return HTTP 200:
- "Blooming Boutique" -> **"Boutique"** (page title still "Blooming Boutique", slug /blooming-boutique)
- "Mission & Purpose" -> **"Mission"** (page title still "Mission & Purpose", slug /mission-purpose)
Verified live: all 10 nav links resolve correctly, 0 overflow, 0 JS errors.

This helped but did NOT fix the wrap. Ten items simply do not fit on one line.

## WHY THE REST NEEDS A HUMAN (2 minutes)
Squarespace dropdowns are folders, and moving an existing page into a folder requires real
drag and drop in the Pages panel. Three approaches were tried and all failed:
1. The automation drag action (mousedown -> move -> mouseup): page did not move.
2. Synthetic pointer/mouse event sequence with stepped moves and delays: page did not move.
3. Checked Page Settings > Navigation for a parent/folder option: it only has Show Header /
   Show Footer. There is no reparent control and no public API for nav structure.
Creating the dropdown itself IS automatable (Pages "+" > DROPDOWN). Populating it is not.
NOTE: an EMPTY dropdown still renders in the live nav as an extra item, so do not create the
dropdown until you are ready to fill it. (A test dropdown was created and then deleted.)

## THE MANUAL STEPS
In Squarespace: **Pages** panel. For each dropdown: click **+** next to Main Navigation, choose
**DROPDOWN**, type the name, then DRAG the listed pages onto it.

**Dropdown 1: "Event Info"** -> drag in: FAQs, Boutique, Volunteer
**Dropdown 2: "About"** -> drag in: Our Story, Mission, Sponsors

Then drag **Home** down into the "Hidden" / Not Linked section (the logo already links home).

**Result: 5 top level items** — Tickets, Speakers, Event Info, About, Contact — which fits one
line comfortably and reads like a professional conference site.

## Alternative if you would rather not restructure
CSS can force all ten onto one line, but only by shrinking nav text to about 11px
(`font-size:.72rem; letter-spacing:.02em; padding:0 7px`, tested: rows=1 at both 1440 and 1280).
NOT applied, because shrinking nav text undercuts the contrast/legibility work already done and
it leaves ten cluttered items. Available on request as an interim.

---

## UPDATE 2026-07-27: drag IS partly automatable. Precise boundary found.

My earlier "drag is not automatable" was WRONG. The Pages panel uses **dnd-kit**
(`aria-roledescription="sortable"`, `DndDescribedBy-*`). The mistake was dispatching events at the
row; the sensor lives on a **child drag handle**.

### The technique that WORKS (reordering)
```js
const props = n => { const k = Object.keys(n).find(x=>/^__reactProps/.test(x)); return k ? n[k] : null; };
const row    = [...document.querySelectorAll('[aria-roledescription="sortable"]')]
                 .find(n => n.textContent.trim().startsWith(LABEL));
const handle = [...row.querySelectorAll('*')]
                 .find(c => { const p = props(c); return p && typeof p.onMouseDown === 'function'; });
// mousedown on the HANDLE, then mousemove on DOCUMENT, then mouseup on DOCUMENT
```
Split it across TWO tool calls (lift, then glide+drop) or the CDP eval times out mid-drag and
leaves the row stuck in a drag; `Escape` cancels cleanly and restores order.

### What works vs what does not
| Operation | Result |
|---|---|
| **Reorder within a list** | **WORKS**, persists to the live site (verified twice) |
| Nest a page INTO a dropdown | FAILS. Item reorders instead; dropdown stays "empty". Tried the empty placeholder zone, the folder row, and an indented drop with hover dwell. |
| Move between lists (Main Navigation -> Hidden) | FAILS. Item stays in Main Navigation. |

Nesting and cross-list moves evidently need a real trusted pointer, or a droppable that synthetic
events do not activate.

### DONE via reorder
**Tickets is now first** in the nav (primary action first). Verified live, 10 items, 0 overflow,
0 JS errors, no stray dropdown left behind.

### So the manual step is now SMALLER
Devin only needs the nesting drags. Everything else can be automated. Create the two dropdowns and
drag the six pages in, plus Home to Hidden, per the steps above.
