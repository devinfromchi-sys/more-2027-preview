# Deploying changes to moreconference.org custom code

The live site loads all custom JS from **commit-pinned, integrity-checked jsDelivr URLs** via a single
loader in Squarespace → Settings → Advanced → **Code Injection (Header)**. A push to this repo does
NOT change the live site until the loader's pin is updated. That is intentional (supply-chain safety):
even if this GitHub account is compromised, an attacker cannot change what visitors execute.

## Release steps
1. Edit files, `node --check` anything you changed, commit, push to `main`.
2. Run the harness against a preview if needed: `node tools/verify.mjs --layer1`.
3. Generate the new pinned loader at the release commit:
   `node tools/mkloader.mjs` → prints HTML and writes `tools/loader.html`.
4. Pre-verify the pinned URLs (the script hashes must match your local files):
   for each file: `curl -sL https://cdn.jsdelivr.net/gh/devinfromchi-sys/more-2027-preview@<sha>/<file> | shasum -a 256`
5. Squarespace → Settings → Advanced → Code Injection → HEADER:
   replace the previous loader block (everything from `<!-- MORE 2027 pinned loader` to its closing
   `</script>`) with the new `tools/loader.html` content. KEEP the Google Fonts lines above it. Save.
6. Verify: `node tools/verify.mjs` must be green (exit 0). Spot-check one page in a real browser.

## Rollback tiers
1. **Bad release:** re-run step 5 with the PREVIOUS loader (each loader is self-contained and pinned —
   keeping the last-known-good `tools/loader.html` in git history makes this a 30-second paste).
2. **One page broken:** the per-page Header Code Injections were removed during the pinning migration;
   restore that page's old tag from `ops-log` snapshots if ever needed.
3. **jsDelivr outage (rare):** temporarily paste GH Pages URLs
   (`https://devinfromchi-sys.github.io/more-2027-preview/<file>.js`) into the loader block.
   This reintroduces the mutable path — switch back to pinned URLs as soon as the outage ends.
   Do NOT build an automatic fallback; it would silently defeat the pinning.

## Invariants (do not break)
- Repo must stay public (GitHub Pages hosts `assets/*.jpg` used by the homepage blob).
- `main` has branch protection: no force pushes, no deletion (applies to admins too).
- All injectors are idempotent (`if (document.getElementById(...)) return`) — double-loading is safe;
  keep that guard in any new injector.
- No secrets in this repo, ever — it is public and its content executes on the live site.
- The no-dash rule: no em/en dashes in any user-facing copy inside the blobs.

## Tools
- `tools/verify.mjs` — 2-layer live-site regression harness (raw HTML + rendered/emulated, desktop+mobile).
- `tools/blob.mjs` — safe base64 blob decode/edit/re-encode with round-trip assertion.
- `tools/mkloader.mjs` — pinned+SRI loader generator.
- `tools/pages.json` — page manifest the harness runs from.
