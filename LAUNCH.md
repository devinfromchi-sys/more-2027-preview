> **ON SALE DATE CONFIRMED: August 20, 2026** (Ryan spec, confirmed by Devin 2026-07-27).
> Early bird: $15 off, applied automatically at checkout, Aug 20 to Oct 31 2026.
> The countdown and all site copy already say August 20. Phone number resolved: (815) 409 0144.

# LAUNCH DAY RUNBOOK — Tickets go live August 20, 2026

When the TicketSpice 2027 form is published, do these in order (~15 minutes):

## 1. Get the live TicketSpice URL
From WebConnex → TicketSpice → the 2027 form (draft page id 1038637 as of July 2026) → publish →
copy the public URL (looks like `https://moreconference.ticketspice.com/<slug>`).
Confirm it shows the 2027 event (April 16–17, 2027), NOT the sold-out 2026 page.
Also confirm the SMS opt-in text includes BOTH "Reply HELP for help" and "STOP to cancel".

## 2. Update mc-tickets.js (the /tickets page)
- Replace the `#ticket-portal` placeholder ("Registration Opens August 20" card) with the real
  registration link/embed. The blob edit workflow: `node tools/blob.mjs decode mc-tickets.js 1 tmp.html`,
  edit, `node tools/blob.mjs encode mc-tickets.js 1 tmp.html`, `node --check mc-tickets.js`.
- Point the page's "Get Tickets"-style buttons at the TicketSpice URL (or keep them anchored to the
  embedded portal section).

## 3. Update mc-inject.js (homepage)
- Countdown target is `mc-inject.js` line ~18: `new Date('2026-08-20T00:00:00-05:00')  (already updated)`.
  After launch, either remove the countdown section or repoint the hero/countdown CTAs from
  "details" copy to direct "Buy Tickets" copy linking to the portal.
- Homepage tier cards: change "Notify Me" buttons (currently `#mc-signup`) to the ticket URL,
  and "Pricing revealed Aug 1" → real prices are already shown; remove the reveal line if present.

## 4. mc-pagefix.js
- The runtime rule `a[href*="ticketspice.com"] → /tickets` (line ~48) must be UPDATED or REMOVED
  before adding real ticketspice links, or it will rewrite your new purchase links back to /tickets!
  This is the single most important line to change on launch day.

## 5. Deploy + verify
Follow DEPLOY.md (push → mkloader → paste loader → `node tools/verify.mjs`).
Update `tools/pages.json` expectations first: allow ticketspice.com anchors ON PURPOSE
(set the harness's no-ticketspice-anchors expectation off for / and /tickets).

## 6. Optional same-day
- Homepage announcement banner for launch (copy drafted in session notes).
- Early-bird end date on /tickets when Teri confirms it.
- Sponsorship proposal PDF: still the 2026 file (`/s/Sponsorship-Proposal-2026.pdf`) behind an
  un-yeared label — swap when the 2027 PDF exists.

## Known items pending elsewhere
- /volunteer native Dates card still says April 24/25 2026 (crawler-only; visitors see the injected
  correct dates). Fix in Squarespace editor when convenient.
- Native ticketspice body links on /, /speakers, /our-story (crawler-only; runtime-rewritten) —
  becomes IRRELEVANT after launch if pagefix rewrite is removed (step 4), but fix natively for cleanliness.
- Recap video for homepage hero: pending file/link from Teri/Ryan.

## LAUNCH DAY: also swap the hero CTA label
The homepage hero CTA (injected by `mc-pagefix.js`, class `.mc-herocta-box`) currently reads
**"View Ticket Details"** and points at `/tickets`, because tickets are not on sale until Aug 20.
On launch day change the label to **"Get Tickets"** and point it at the live TicketSpice URL.
Remember the pagefix rule that rewrites `ticketspice.com` links to `/tickets` must be changed
first, or the new link will be rewritten straight back.
