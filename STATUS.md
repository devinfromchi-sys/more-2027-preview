# MORE 2027 — project status
**Last verified: 2026-07-31.** FULL NATIVE MIGRATION COMPLETE: all 9 injected pages are now
native Squarespace content Teri can edit AND drag. Live pin: `3df67f1` (loader now ships ONLY
mc-pagefix.js: a11y + header scrim + homepage hero CTA overlay). Final regression: 20/20 clean
(10 pages x desktop + mobile): 0 injectors, 0 stale 2026/guest refs, 0 console errors, 0 overflow.
Countdown lives in a native movable CODE BLOCK on the homepage (target Aug 20). Footer newsletter
"August 20" is native (pagefix footer matcher deleted). Read this file first; details below are
historical.

## MIGRATION NOTES (2026-07-31 overnight)
- Flipped native: our-story, blooming-boutique, sponsors, volunteer, faqs, speakers,
  mission-purpose, tickets, homepage. mc-inject/mc-speakers/mc-faq/etc. are retired (files kept
  in repo for reference; no page loads them).
- Speakers: 2027 lineup native on desktop AND mobile (old Lisa/Masey/Meredith photo blocks
  replaced or deleted; mobile-only duplicates removed).
- FAQ: Meet & Greet section rewritten (JJ Friday included; Annie F. Downs + Sheila Walsh Saturday
  raffle + disclaimer), Meredith photo/Spotify removed, worship leader name removed (TBA).
- Tickets/Mission/Homepage rebuilt as native sections (spec-correct ticket types, NO Friday-only
  ticket, waitlist note). New sections use theme LIGHTEST 2 (white-bold).
- Remaining code on Teri pages (flagged TODO in mc-pagefix.js): homepage hero CTA overlay, kept
  because the native hero button is orphaned at grid-area 32/3/34/9. One fluid-engine drag by a
  human fixes it; then delete that injection.
- Known visual simplification: homepage speaker carousel / photo band / tier cards became
  text-first native sections. All copy preserved; Teri can re-add galleries natively.


## 1. NEXT UP (in priority order)

### A. Devin, about 2 minutes — finish the navigation
The nav is 10 flat items that wrap onto **two lines** at every desktop width. This is the single
biggest thing making the site look unfinished. Steps are in **NAV-RESTRUCTURE.md**:
- Pages > **+** > **DROPDOWN**, name it **"Event Info"**, then drag in FAQs, Boutique, Volunteer
- Same again for **"About"**, drag in Our Story, Mission, Sponsors
- Drag **Home** into Hidden (the logo already links home)

Result: **5 top level items** (Tickets, Speakers, Event Info, About, Contact) on one line.
Caution: do NOT create a dropdown until you are ready to fill it, an empty one shows live.
I can reorder items but cannot nest them (see NAV-RESTRUCTURE.md for the exact boundary).

### B. Waiting on Ryan — asked 2026-07-27, draft is in Gmail
1. **VIP capacity conflict.** Spec caps VIP at **200 tickets**; the FAQ says a **150 seat** VIP
   section. If both are true, 50 VIP buyers have no VIP seat. Need both numbers separately.
2. **Children.** Spec says children not allowed (infants OK, nursing room); FAQ says girls 12+
   are invited. Affects the FAQ and the ticket policy.
3. **Friday lineup.** Spec lists only Debbie Del Priore; the site says Audra Smith and Debbie
   Del Priore hosted by Stephanie Reynolds. Is Audra still on Friday, is Stephanie hosting?
4. Assets: **2027 sponsorship PDF**, **1200x630 branded share image**, **2027 schedule PDF**,
   and the **worship leader** once confirmed.

### C. Then: FAQ goes natively editable
Everything unambiguous is already done. Remaining work is blocked on B1 to B3 above.
Full change map in **FAQ-MIGRATION-PREP.md**.

### D. Then: Our Story goes natively editable
Only blocker left is a content decision: the code version has a "2025 and 2026: Where We Have
Been" section with past guests and impact stats that the native page lacks. Keep or drop?
Detail in **EDITABLE-MIGRATION.md**.

---

## 2. DONE AND LIVE (2026-07-27)

| Fix | Detail |
|---|---|
| **Ticket launch date** | Site said **August 1**; the real date is **August 20, 2026**. The countdown would have hit zero and announced tickets 19 days early. Countdown target plus 16 copy references updated across Home, Tickets, FAQ, Speakers, and the site wide footer line. |
| **Header legibility** | `#header` was transparent over full bleed floral banners, so nav text crossed cream AND dark foliage. Added a cream scrim (gradient guaranteed, blur as enhancement). Verified 20/20. Homepage header pixel identical. |
| **Interior page titles** | All 8 interior pages had their title rendering underneath the header on both desktop and mobile. Fixed site wide. |
| **Mobile hero** | "Sparkle in 2027" collided with the logo and menu on phones. Fixed, verified at 360, 390 and 430px. |
| **FAQ theme** | Said "A New Thing" (Isaiah 43:18-19), the **2026** theme. Now "Sparkle" (Zechariah 9:16). |
| **FAQ jump links** | All 6 category links pointed at `/event-faq-1`, which **404s**. Now same page anchors. |
| **Phone number** | Volunteer page said 815-**406**-0144. Correct is **(815) 409-0144** per Ryan's spec. Fixed natively. |
| **Volunteer dates** | Dates card still said April 24-25, **2026**. Now April 16-17, **2027**. |
| **Our Story** | Native content corrected: "Join Us at MORE **2027**", banner "Our Story", 5 em dashes removed with all italics preserved. |
| **Nav labels** | "Blooming Boutique" -> "Boutique", "Mission & Purpose" -> "Mission" (nav label only; page titles and URLs untouched). **Tickets** moved to first position. |
| **Footer year** | "(c) 2026" -> "(c) 2027" on all pages. |
| **Speaker order** | Homepage now leads with Annie F. Downs, Sheila Walsh, JJ Barrows. |

---

## 3. KNOWN DEBT (small, tracked, not urgent)

- **Footer newsletter line** ("Tickets go live August 20") is currently corrected by a **patch in
  `mc-pagefix.js`**, not in the Squarespace text, because the editor was unresponsive at deploy
  time. Visitors see the right thing. TODO: fix the native footer text and delete the matcher
  (it is flagged with a TODO in the code).
- **Hero video** shows a **"MEREDITH ANDREWS" banner** in some frames (she was a 2025 guest).
  Consider swapping the video or setting a poster frame that avoids it.
  (The background image is named `MORE 2026 Slides (1).png` but is only decorative florals and
  sparkles, it does not display "2026". Filename only, not a content problem.)
- ~~Hero has no call to action.~~ **DONE 2026-07-27.** Added When/Where plus "View Ticket Details"
  and "See Speakers" to both the desktop hero and the phone hero. Label is deliberately
  "View Ticket Details" because tickets are not live until Aug 20; swap to "Get Tickets" on
  launch day (noted in LAUNCH.md). NOTE: this is injected by `mc-pagefix.js`, because the
  hero's own native button is orphaned at grid-area 32/3/34/9, outside the section's row
  count, so Squarespace collapses it to 0x0 and repositioning needs a fluid-engine drag.
  TODO: reposition or delete that orphaned native button, then this injection can go.
- ~~"You belong here." unreadable~~ **DONE 2026-07-27.** Root cause was self inflicted: the global
  `.goldtext` override recolors gold to a dark bronze, correct on CREAM but it put dark text on a
  dark purple photo. Fixed with a pale gold gradient + stronger scrim + drop shadow, scoped to
  `#mc .moment` only so cream pages keep the bronze. Verified desktop and mobile.
- Legal docs still need the `[bracket]` fills and an attorney review.
- TicketSpice 2027 form still to be built; SMS opt in needs "Reply HELP for help" for compliance.

---

## 4. HOW TO DEPLOY (read before touching code)
Pushing to the repo does **NOT** change the live site. See **DEPLOY.md**. Short version:
```
push  ->  node tools/mkloader.mjs  ->  paste tools/loader.html into
Settings > Advanced > Code Injection (KEEP the Google Fonts lines)  ->  verify
```
The site loads all custom JS from **commit pinned, integrity checked** URLs, so a compromised
GitHub account cannot change what visitors run.

## 5. FILE MAP
- **STATUS.md** (this file) — start here
- **NAV-RESTRUCTURE.md** — the 2 minute nav steps + what drag automation can and cannot do
- **FAQ-MIGRATION-PREP.md** — FAQ change map + everything Ryan's spec answered/contradicted
- **EDITABLE-MIGRATION.md** — making pages editable for Teri + proven Squarespace editor techniques
- **LAUNCH.md** — launch day runbook (includes the critical ticketspice rewrite gotcha)
- **DEPLOY.md** — release process and rollback
- **tools/** — `verify.mjs` (regression harness), `blob.mjs`, `mkloader.mjs`, `pages.json`
