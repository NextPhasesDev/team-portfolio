# AGENTS: How to work with this codebase (for automated coding agents)

Purpose: Give an AI or coding agent the minimal, targeted knowledge to be productive immediately.

Checklist (what I'll cover)
- Big-picture architecture and why it is organized this way
- Critical developer workflows (local preview, quick debug commands)
- Project-specific conventions and patterns (where to change behavior)
- Integration points and external dependencies to be careful with

Quick summary
- Static, framework-less website (HTML + CSS + one large vanilla `script.js`). No build step.
- Primary entry: `index.html` (other pages mirror the same structure). Global behavior is centralized in `script.js`.

Architecture & major components
- Root HTML pages: `index.html`, `services.html`, `portfolio.html`, `about.html`, `contact.html`, etc. These are static files served as-is.
- Master JS: `script.js` — single large file (client-side app shell) that implements:
  - DOM / UX behaviors (theme, nav, mobile drawer, CTA animations)
  - Pricing & region detection (see `getRegionConfig`, `detectRegionByLocale`, `initPricingCurrency`)
  - Form handling and submission to Formspree (endpoint hard-coded in `script.js` around the contact form submit)
  - Fragment loading: `loadNavbar()` fetches `navbar.html`, `loadFooter()` fetches `footer.html` and falls back to the inline `fallbackFooter` string when fetch fails.
  - Canvas background animations for each page (many init*Animation functions)
- HTML fragments: `navbar.html` and `footer.html` are fetched and injected at runtime. Pages may also include a `navbarMount` element where `navbar.html` is inserted.
- Static assets / pages: `style.css`, `Logo_transparent.webp`, `games/` subfolder (nested route examples e.g. `/games/nsolo/`).

Developer workflows (how to run / test / debug)
- No package manager or build step. To preview locally:
  - Recommended (fast): run a static server from the project root:
    - PowerShell: `python -m http.server 8000 ; Start-Process http://localhost:8000` (if Python available)
    - Or install & use VS Code Live Server extension and open the workspace.
  - Then open `http://localhost:8000/index.html` in a browser.
- Editing + debugging:
  - All interactive logic lives in `script.js`. Use browser DevTools (Sources) to set breakpoints inside `script.js` (it's not split into modules nor sourcemapped).
  - Search `script.js` for a function name to find the behavior to change. Example: to adjust how pricing is chosen search `detectRegionByLocale` or `getPricingTierValues`.
  - To change the contact form endpoint update the endpoint string near `const endpoint = 'https://formspree.io/f/xgoldrwl';` (also update `.env` to reflect the new value for documentation parity).

Project-specific conventions & patterns (explicit examples)
- Single-file logic: The team places almost all runtime behavior into `script.js`. New features should follow the same pattern unless you intentionally refactor into modules.
- DOM-first coordination: components communicate via DOM (IDs, attributes, data-*). Examples:
  - data-tier on pricing elements (used in `updatePricingDisplay`) — update these attributes when altering markup.
  - `data-showcase` on `.pricing-tier` to map carousel slides to tiers in `initShowcaseCarousel`.
  - `data-member` on `.clickable-team` cards (used in `initTeamDetails`).
  - `form.dataset.preselectedPlan` is used to preselect budget options from URL `plan` param.
- Progressive enhancement & graceful fallback:
  - `loadFooter()` attempts fetch('footer.html') and falls back to `fallbackFooter` string embedded in `script.js` — follow that pattern for other fragment injections.
  - Feature detection used widely (e.g., `IntersectionObserver`, `prefers-reduced-motion`, touch detection). Keep those checks when modifying animations.
- Asset resolution: `resolveSitePath(path)` ensures a leading slash; pages assume absolute-like paths (leading `/`). When adding assets use the same path style.

Integration points & external dependencies
- Formspree (contact form): endpoint in `script.js` (see contact form submit logic). `.env` contains a placeholder `FORMSPREE_ENDPOINT` but the runtime uses the string in `script.js`.
- Google Analytics: `gtag.js` is included in `index.html` (G-5T40D6EZG4). If you change GA, update the ID in the markup.
- Google Fonts & Font Awesome: loaded via external CDN in HTML head (`fonts.googleapis.com` and `cdnjs.cloudflare.com`). Keep fallback `<noscript>` links present.
- Social links & metadata: `index.html`, `footer.html` and `script.js` contain hard-coded social links; update them in both HTML and `.env` for clarity.
- Netlify: README notes Netlify auto-deploy on `main`. No CI scripts in this repo—deploy is the standard static deployment (push -> Netlify build which is usually a direct publish for static folders).

What to change vs what to preserve
- Change in `script.js` when you need to modify runtime UX, pricing rules (budget maps at top of file), or contact form behavior.
- Modify HTML (pages or fragments) for structure/content changes. Preserve expected IDs and data-* attributes used by `script.js` (e.g., `contactForm`, `pricingRegion`, `projectType`, `navbarMount`).
- Modify `style.css` for visual updates. CSS variables are used for theming; theme toggle updates `document.documentElement.dataset.theme` and `localStorage.theme`.

Quick pointers for common tasks (examples)
- Change Formspree: edit `script.js` line with `const endpoint = 'https://formspree.io/f/xgoldrwl';` (search `formspree` to find it). Also update `.env.FORMSPREE_ENDPOINT` for documentation.
- Add a new pricing tier: update the budget maps near the top of `script.js` (e.g., `budgetMapDefault` / `budgetMapSystems`) and the `pricingDisplayData` objects.
- Add a new page-specific canvas animation: add `initYourAnimation(canvas, ctx)` and plug it into `initMoonAnimation`'s page selection.
- Make navbar static (server-side): replace client-side fetch + mount by including the content directly in each page — remember the JS `loadNavbar` will try to mount from `#navbarMount` if present.

Notes for automated agents
- Do not assume a JS build step. Tests or linters are not present.
- Always preserve DOM IDs and data-* attributes unless you update `script.js` accordingly.
- When editing `script.js`, run a quick local static server and verify interactions that depend on runtime injection (navbar/footer fetch) because editing fragment files may change runtime DOM.
- Search for the exact string you need to change in `script.js` — functions are grouped and well-named (e.g. `initContactForm`, `initPricingCurrency`, `initShowcaseCarousel`).

Files to review first (entry points)
- `index.html` — site shell & metadata
- `script.js` — master behavior file (largest single source of runtime logic)
- `style.css` — visual styling and theme variables
- `navbar.html`, `footer.html` — fragments injected at runtime
- `.env` — documentation of external endpoints (not automatically loaded at runtime)

If you need help making a specific change, tell me the exact behavior to alter (e.g., "change Formspree endpoint", "add a pricing tier", "convert to modular JS") and I'll modify the files and run quick local checks.


--

Additional guidance (recommended practices)

- Commit & PR conventions
  - Keep changes small and focused. Since there's no build step, each PR should include the minimal set of file edits needed to implement the behavior change.
  - Use descriptive commit messages: what changed and why (e.g. "Update Formspree endpoint and `.env` placeholder").
  - When editing `script.js`, prefer isolated changes near the top (pricing maps) or clearly-named functions (`initContactForm`, `loadFooter`) so reviewers can easily validate behavior.

- Manual testing checklist (before merging)
  - Start a static server from the repo root and open `index.html`.
  - Verify navbar/footer appear and no console errors are shown related to fetches or missing DOM IDs.
  - If you changed the contact form endpoint, submit the form with a test email/disabled side-effects and confirm the fetch returns a 200/202; do not spam external endpoints.
  - Check responsive breakpoints and theme toggle (light/dark) — these are quick visual regressions to catch CSS regressions.

- Troubleshooting common issues
  - "Navbar or footer not loading": ensure `navbar.html`/`footer.html` exist and that `#navbarMount` (if used) is present. Also test `fetch` failures fall back to `fallbackFooter` defined in `script.js`.
  - "Pricing numbers wrong": look for budget maps at the top of `script.js` (`budgetMapDefault`, `budgetMapSystems`) and `pricingDisplayData` objects.
  - "Contact form not submitting": search `formspree` in `script.js` to find the hard-coded endpoint; also check network tab in DevTools for CORS or 4xx/5xx errors.

- Safety notes when refactoring
  - Preserve IDs and data-* attributes unless you update `script.js` accordingly — many behaviors are wired by attribute selectors.
  - If you split `script.js` into modules, keep a compatibility shim or update `index.html` to load the new entry scripts; note this is a larger change and will increase reviewer effort.

Appendix: helpful quick commands (PowerShell)

Start a quick static server (Python must be installed):

```powershell
python -m http.server 8000 ; Start-Process http://localhost:8000
```

Search the repo for the Formspree endpoint:

```powershell
Select-String -Path * -Pattern "formspree" -SimpleMatch
```

Search for a function name in `script.js` (example: `initContactForm`):

```powershell
Select-String -Path script.js -Pattern "initContactForm"
```

Last updated: 2026-05-27

