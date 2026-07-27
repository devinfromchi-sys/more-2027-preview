# FAQ page (/faqs) — migration prep and change map
Prepared 2026-07-27. Purpose: make `/faqs` natively editable by Teri by removing `mc-faq.js`.
Method: audited the NATIVE page (loaded with `mc-faq.js` blocked, `mc-pagefix.js` still running).

## Headline finding: the native FAQ is BETTER than what visitors see now
- **Native: 51 unique questions** with detailed, genuinely useful answers (security, infants,
  dress code, parking, coffee, seating, VIP logistics, full lunch mechanics, boutique, Friday night).
- **Injected: about 20 simplified questions.**
So migrating is a content UPGRADE, not a downgrade. Most native answers are timeless logistics that
remain true for 2027 (venue, parking, security, refunds, VIP structure, lunch mechanics).
The lunch details already MATCH the approved 2027 copy ($18 box lunch, Smoked Turkey and Swiss
Croissant or Balsamic Grilled Chicken Caprese, pasta salad/chips/fruit/dessert). No prices are
hardcoded on the page, so ticket pricing changes do not affect it.

---

## A. BLOCKING — stale facts, must fix before the injector comes off

| # | Item | Current (native) | Correct for 2027 | Needs |
|---|---|---|---|---|
| A1 | **Theme** (Q "What is the theme this year?") | "A New Thing", Isaiah 43:18 to 19 | **"Sparkle", Zechariah 9:16** | none, confirmed |
| A2 | **Meet and Greet feature section** (top of page, with photo + Spotify link) | Meredith Andrews Meet and Greet, raffled backstage at Saturday lunch | 2027 has a **JJ Barrows meet and greet included for all Friday attendees** | **Ryan** to confirm this replaces the raffle |
| A3 | Q "What is the Meredith Andrews Meet and Greet raffle?" | raffle mechanics, door prizes, sponsors | replace or delete | **Ryan** |
| A4 | Q "Will Lisa Harper, Masey McClain, JJ Barrows or Meredith Andrews be at Even MORE?" answer names Masey McLain | 2026 guests | Friday features **Audra Smith and Debbie Del Priore, hosted by Stephanie Reynolds**; JJ Barrows meet and greet | rewrite question + answer |
| A5 | **Spotify link** "Listen on Spotify" | Meredith Andrews artist page | 2027 worship leader still TBA | **Ryan** (worship leader) or remove |
| A6 | **"MORE Weekend Schedule"** link, appears twice | `/s/2026-MORE-Conference-Friday-Saturday-Schedule.pdf` (still resolves 200, but it is last year's) | 2027 schedule PDF | **Ryan** |

## B. BROKEN — fix regardless of Ryan (I can do these now)

| # | Item | Detail |
|---|---|---|
| B1 | **6 jump links 404** | The FAQ category links (General Info, Ticketing and Check-in, Disability Accommodations, Lunch, Blooming Boutique, Friday Night) point to `/event-faq-1#...`. **`/event-faq-1` returns HTTP 404.** They must become same-page anchors (`#...`). The injector already patches this at runtime, so it is invisible today but breaks the moment we migrate, and crawlers see it now. |
| B2 | **Dashes** | 2 em dashes in page text, plus 12 accordion answers contain em/en dashes. Lower priority polish, per the no-dash rule. |

## C. VERIFY with Teri (logistics likely unchanged, but they are event facts)
- Doors: 7:30 am registration, 7:45 am VIP, 8:15 am General Admission
- Lunch break: 11:30 am to 1:00 pm (90 minutes); afternoon session resumes 1:00 pm
- Coffee station until 2:45 pm
- VIP: 150 reserved seats, separate registration at the West Entrance
- Check-in: registration hall in the South Pavilion
- Hotel: EVEN Hotel, group rate code **MWC**, room block expires **April 1** (confirm April 1, **2027**)
- Boutique located in the North Hall
- Age policy: girls 12 and older

## D. Execution order (once A is answered)
1. Fix B1 (6 jump links) and A1 (theme) natively. Both are unambiguous.
2. Apply A2 to A6 once Ryan answers.
3. Optional: B2 dash cleanup.
4. Remove `["/faqs"], "mc-faq.js"` from ROUTES in `tools/mkloader.mjs`, regenerate, re-pin, paste
   loader into Settings > Advanced > Code Injection.
5. Verify desktop + mobile: accordion opens, jump links land, header scrim intact, 0 overflow,
   0 JS errors. Confirm Teri can edit a question and see it change.

## Notes
- Editor techniques that work are in EDITABLE-MIGRATION.md. Accordion answers live in
  `.accordion-item__description`; questions in `.accordion-item__title`.
- Header legibility is already solved site-wide (pin e81e270), so it is NOT a blocker here.
- The native Location and Time card was already corrected to April 16 and 17, 2027.
