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
| A1 | ~~**Theme**~~ **DONE 2026-07-27** (Q "What is the theme this year?") | "A New Thing", Isaiah 43:18 to 19 | **"Sparkle", Zechariah 9:16** | none, confirmed |
| A2 | **Meet and Greet feature section** (top of page, with photo + Spotify link) | Meredith Andrews Meet and Greet, raffled backstage at Saturday lunch | 2027 has a **JJ Barrows meet and greet included for all Friday attendees** | **Ryan** to confirm this replaces the raffle |
| A3 | Q "What is the Meredith Andrews Meet and Greet raffle?" | raffle mechanics, door prizes, sponsors | replace or delete | **Ryan** |
| A4 | Q "Will Lisa Harper, Masey McClain, JJ Barrows or Meredith Andrews be at Even MORE?" answer names Masey McLain | 2026 guests | Friday features **Audra Smith and Debbie Del Priore, hosted by Stephanie Reynolds**; JJ Barrows meet and greet | rewrite question + answer |
| A5 | **Spotify link** "Listen on Spotify" | Meredith Andrews artist page | 2027 worship leader still TBA | **Ryan** (worship leader) or remove |
| A6 | **"MORE Weekend Schedule"** link, appears twice | `/s/2026-MORE-Conference-Friday-Saturday-Schedule.pdf` (still resolves 200, but it is last year's) | 2027 schedule PDF | **Ryan** |

## B. BROKEN — fix regardless of Ryan (I can do these now)

| # | Item | Detail |
|---|---|---|
| B1 | ~~**6 jump links 404**~~ **DONE 2026-07-27** | The FAQ category links (General Info, Ticketing and Check-in, Disability Accommodations, Lunch, Blooming Boutique, Friday Night) point to `/event-faq-1#...`. **`/event-faq-1` returns HTTP 404.** They must become same-page anchors (`#...`). The injector already patches this at runtime, so it is invisible today but breaks the moment we migrate, and crawlers see it now. |
| B2 | **Dashes** | 2 em dashes in page text, plus 12 accordion answers contain em/en dashes. Lower priority polish, per the no-dash rule. |

## C. VERIFY with Teri (logistics likely unchanged, but they are event facts)
- Doors: 7:30 am registration, 7:45 am VIP, 8:15 am General Admission
- Lunch break: 11:30 am to 1:00 pm (90 minutes); afternoon session resumes 1:00 pm
- Coffee station until 2:45 pm
- VIP: 150 reserved seats  <-- CONFLICTS with spec (200 VIP tickets). Asked Ryan 2026-07-27.
- Check-in: registration hall in the South Pavilion
- Hotel: EVEN Hotel, group rate code **MWC**, room block expires **April 1** (confirm April 1, **2027**)
- Boutique located in the North Hall
- Age policy: girls 12 and older  <-- CONFLICTS with spec (children not allowed). Asked Ryan 2026-07-27.

## D. Execution order (once A is answered)
1. ~~Fix B1 (6 jump links) and A1 (theme) natively.~~ **DONE and saved 2026-07-27.**
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

---

# ANSWERS FROM RYAN'S SPEC (2027 MORE Women's Conference Details (2).docx, received 2026-07-27)
This doc resolves nearly every open question AND contradicts several things currently live.

## ~~CRITICAL: ticket on-sale date is WRONG on the live site~~ RESOLVED 2026-07-27
- **Spec says tickets go live August 20th, 2026** (appears 5 times in the doc).
- **Live site says "August 1"** on `/`, `/tickets`, and `/faqs`, and the homepage countdown was
  reading **4 days** remaining. It would hit zero on Aug 1 and imply tickets are live 19 days early.
- Early bird per spec: **$15 off, applied automatically at checkout, Aug 20 2026 to Oct 31 2026.**
- ~~ACTION NEEDED~~ **DONE:** Devin confirmed Aug 20. Countdown target moved to 2026-08-20 and all
  16 "August 1" strings updated across homepage, tickets, FAQ, speakers + the footer line.

## Meet and greets (this was the blocking question for FAQ)
- **Friday: JJ Barrows** meet and greet + book signing, included with Both Days and VIP Both Days.
- **Saturday: Annie F. Downs and Sheila Walsh**, **raffle only**, not purchasable.
- So the old "Meredith Andrews Meet and Greet raffle" becomes the **Annie F. Downs and Sheila Walsh**
  raffle, and the Friday JJ Barrows meet and greet is a separate, included perk.
- Spec: "Include separate disclaimer that meet and greet access is limited and not guaranteed for
  Saturday only."

## Ticket types (live FAQ is WRONG)
- Saturday Only $69 / Saturday Only VIP $99 / Regular Bundle Both Days $99 / VIP Bundle Both Days $129
- **There is NO "Friday Only" ticket.** Friday is add-on/bundle only, with a **waitlist form** for
  Friday-only interest. The live `/faqs` currently lists "Friday Only" as a ticket type. FIX.

## Other corrections vs the native FAQ
| Item | Native FAQ says | Spec says |
|---|---|---|
| VIP capacity | 150-seat VIP section | **200 total VIP** |
| Doors / registration | 7:30 registration, 7:45 VIP doors, 8:15 GA doors | **doors 7:30 am, registration 7:45 am** (verify with Teri, these conflict) |
| Children | girls 12 and older invited | **children not allowed**; infants OK with mom, nursing room available |
| Saturday capacity | not stated | **1500** Saturday limit; venue/total goal **2300** |
| Friday capacity | not stated | **500 limit** |
| Worship | Meredith Andrews references | **worship NOT confirmed yet** (so remove the Spotify link) |
| Friday lineup | 2026 guests | **Debbie Del Priore** + worship + JJ Barrows meet and greet |

NOTE: the injected 2027 copy currently says Friday features "Audra Smith and Debbie Del Priore,
hosted by Stephanie Reynolds". The spec lists only **Debbie Del Priore**. CONFIRM with Ryan/Teri.

## Answered incidentally
- **Phone RESOLVED:** (815) 409 0144 is correct; the Volunteer page typo was fixed natively 2026-07-27.
- Hotel: EVEN Hotel Chicago Tinley Park Convention Center by IHG; **group code "coming soon"**
  (native FAQ currently says code MWC, verify); room block deadline **April 1**.
- Lunch: $18, Saturday only, required selection per ticket, no capacity limit, non refundable.
- Accessibility details live **only in the FAQ** per spec.
