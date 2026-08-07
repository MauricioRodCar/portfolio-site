# TODO — Pending items by phase

Living log of deferred decisions and pending work. Updated any time something falls outside the scope of the current phase, so it isn't lost and doesn't need to be rediscovered by re-reading the conversation history.

**Convention:** each entry notes which phase resolves it (per section 8 of `CLAUDE.md`) and why it was deferred.

---

## Phase 1 — Layout and design system
- [x] `src/components/ui/`: Button and Tag are wired into the Nav/Hero shell; Card is built but has no consumer yet — it's the base for case-study cards in Phase 2.
- [x] `src/components/layout/Nav.tsx`: sticky nav shell (brand mark, "How I Think" / "Stack" anchor links, outlined Contact CTA). Not in the original folder proposal — added alongside `ui/` and `sections/` since nav chrome isn't content and isn't a design-system primitive.
- [x] `src/components/sections/Hero.tsx`: real Hero with the closed copy from section 6.1, plus a `$ whoami` terminal-prompt micro-detail with a blinking cursor (section 5).
- [x] Nav's `#work` / `#stack` / `#contact` anchors now resolve — matching section ids added in Phase 2.

## Phase 2 — Static content
- [x] `src/content/case-studies/`: all 3 case studies written (section 6.2) — optimization under high traffic, multi-repo/DevOps, AI agent with Ollama. All 3 done now rather than just the first 2, per Mauricio's call — avoids leaving the site in a half-finished state between phases. Snippets written from scratch following the brief's technical specs, no real client code (NDA).
- [x] Stack section (6.4): used the brief's own example groupings ("iteration speed" → React/TS/Tailwind, "when the project grows" → Node/Express/NestJS/Postgres) as final copy, per Mauricio's call.
- [x] Contact section (6.5): email (`contact.mauricio.rodriguez@gmail.com`), LinkedIn, and CV PDF link (`/MauricioRodriguez_Resume.pdf`) — all real, provided by Mauricio.
- [x] Code snippets get real server-rendered syntax highlighting (shiki) with line numbers, per section 5 — no client JS shipped for it, keeps the performance budget intact.
- [x] Scroll-triggered fade/slide-in animations (Framer Motion) via a shared `Reveal` client wrapper.

## Phase 2.5 — Internationalization (split out, own branch)
- [x] EN/ES internationalization via `next-intl` (section 4), on branch `feature-i18n`. The brief places this in Phase 2, but Mauricio chose to split it into its own branch/feature rather than bundle it into the static-content branch. Locale routing under `src/app/[locale]/`, `en`/`es` prefixed URLs (`/` redirects to `/en`), all UI/section copy extracted to `messages/en.json` and `messages/es.json`, case-study data files (`src/content/case-studies/*.ts`) now hold only locale-agnostic fields (slug, code, lang, filename, tags) — prose lives in the message files. Added a `LocaleSwitcher` in the Nav.
- [ ] **Needs Mauricio's review:** the Spanish translation of the Hero headline (`messages/es.json` → `hero.headline`). The English original is closed content per section 6.1 (no changes without approval) — the Spanish rendering of it deserves the same sign-off before launch, since translation is itself a wording decision.
- **Note:** code snippets and their comments are intentionally NOT translated for the Spanish locale — code/comments in English is the standard convention regardless of site locale, and translating them would look out of place to any technical reader.

## Phase 3 — Interactive playground
- [x] Client-side playground built with `@uiw/react-codemirror` + a sandboxed `new Function(...)` runtime instead of Sandpack (section 6.3/6.4) — see decision log below.
- [x] `src/components/playground/` added: `AgentPlayground.tsx` (editor + run + output), `PlaygroundLoader.tsx` (dynamic import boundary), `defaultAgentCode.ts` (plain-JS, simplified version of the ai-agent case study's tool-calling pattern), `runAgentCode.ts` (execution + error handling).
- [x] Playground section (`#playground`) inserted between case studies and Stack, with a Nav link, matching the brief's own document order (6.1 → 6.2 → 6.3 → 6.4 → 6.5).
- [x] Lazy-loading is two-layered: `next/dynamic(..., { ssr: false })` code-splits the CodeMirror bundle out of the main chunk, and a new `LazyMount` (`src/components/ui/LazyMount.tsx`, IntersectionObserver-based) defers even mounting it until the section scrolls near the viewport — verified with Playwright that zero `.cm-editor` instances exist before scrolling.
- [x] Verified with Playwright (desktop + real mobile viewport, touch tap): editing code, running it, editing the simulated model output, and a broken-code error path all work; no console errors.
- [x] **Bug found and fixed during mobile testing:** `body` is a column flex container (`min-h-full flex flex-col`, needed for Hero's `flex-1`), and the four `mx-auto max-w-5xl` sections (CaseStudies, Playground, Stack, Contact) are its flex items. `mx-auto` (auto margins) on a flex item disables cross-axis stretch, so each section sized itself to its widest unwrapped content (the code editor's longest line) instead of the viewport — causing page-wide horizontal scroll on mobile. Fixed by adding `w-full` to all four sections' `max-w-5xl` wrapper, plus a defensive `body > * { min-width: 0; }` in `globals.css` for the general flex-column-body pattern. Worth remembering for any future section added the same way.

## Phase 3.5 — Playground "easy mode" (deferred, not scheduled)
Feedback from Mauricio after testing Phase 3 (2026-08-06): the raw-code editor works well but is hard for a non-technical visitor (a recruiter, say) to actually try — they don't know what to type as "model output." Not blocking, current form stays as-is; this is a future enhancement, not part of any phase yet.

- [ ] Add an optional guided/no-code mode alongside the existing code editor — must be purely additive, the current "edit the raw code" experience stays exactly as it is today for anyone who wants it.
- [ ] Guided mode: a dropdown/selector listing the available tools by name (e.g. `get_weather`, `convert_currency`).
- [ ] Selecting a tool renders form inputs matching that tool's parameters (e.g. `city` for `get_weather`; `amount`, `from`, `to` for `convert_currency`).
- [ ] Filling in those inputs generates the simulated "model output" JSON live, replacing the manual JSON string currently required in the model-output field.
- [ ] Stretch goal: scan the (possibly user-edited) code in the editor and auto-detect any new tools the visitor adds, adding them to the guided-mode dropdown automatically if their structure matches the expected `{ name, description, execute }` shape. Needs a static-analysis approach (e.g. parse the `tools` array literal) rather than executing arbitrary code just to introspect it.
- [ ] Some form of in-playground documentation/tutorial explaining how to use it (both modes) — exact form (tooltip, inline help panel, short walkthrough) not decided yet.

## Phase 4 — Polish and performance
- [x] Full Lighthouse audit against a local production build (`next build && next start`), desktop + mobile, both locales. Final: desktop 100/100/100/100 (performance/accessibility/best-practices/seo); mobile 95/100/100/100. Real observed LCP is ~215ms; the mobile *simulated* LCP figure (~3.0s) reflects Lighthouse's throttled-mobile model on this dev machine, not the real render time — see decision log.
- [x] Accessibility review, fixes applied:
  - `--muted` color darkened contrast failed WCAG AA (4.1:1) — changed `#71717a` → `#a1a1aa` (7.7:1) in `globals.css`.
  - Missing `<main>` landmark — content now wrapped in `<main id="main-content">` in `page.tsx` (required restructuring the flex-1 chain from `body` down through `main` for Hero's full-height sizing).
  - shiki's `github-dark` theme comment color failed contrast on our background — switched to shiki's official `github-dark-high-contrast` theme in `CodeBlock.tsx`.
  - Added visible `focus-visible` outlines (previously relied on browser default, inconsistent/low-contrast in dark mode) to Button, Nav links, LocaleSwitcher, and the playground's input/Run button.
  - Added a "skip to content" link, visually hidden until keyboard-focused, jumping to `#main-content`.
  - Verified with Playwright: skip link appears on first Tab and works; CodeMirror's own dark theme token colors independently checked and already pass contrast (not caught by Lighthouse since the playground is lazy-mounted below the fold).
- [x] Meta tags for link previews: Open Graph + Twitter card metadata (title/description/locale/url) in `generateMetadata`, plus a generated `opengraph-image.tsx` (Next.js `ImageResponse`, no stock photo — dark background, brand mark, name, tagline, matching the site's own visual identity) and `canonical`/`hreflang` alternates for EN/ES.
- [x] **New scope, added by Mauricio during this phase:** a verifiable on-site "Audit" section (`#audit`, `src/components/sections/Audit.tsx`) presenting the real Lighthouse results as terminal-style output, with a "Verify it yourself on PageSpeed Insights" link pointing at the live production URL — so the numbers shown aren't just a claimed badge, any visitor can re-run the check themselves. Data lives in `src/content/audit.ts`.
- [x] Removed `framer-motion` (rebuilt `Reveal` with plain IntersectionObserver + CSS transitions) after Lighthouse's unused-JavaScript audit flagged ~45KB of it going unused for what was just a simple scroll fade/slide — meaningful weight for a single-purpose effect, worth cutting under the explicit performance budget. Visual behavior is unchanged.
- [x] **Live re-check done (2026-08-06), branch `phase-4-live-audit-verification`:** re-ran Lighthouse directly against `https://portfolio-site-omega-ivory.vercel.app` after Mauricio merged and deployed Phase 4. Real numbers, both confirmed hypotheses from the local run panned out:
  - Desktop EN/ES: 100/100/100/100. Mobile EN: **98**/100/100/100 (SEO's local 91 was indeed a localhost-only artifact — confirmed 100 live, as diagnosed).
  - Real observed LCP on the live deploy is ~510ms (vs. the ~215ms local dev-server figure — still excellent, the gap is just Vercel's edge network vs. localhost). The *simulated* mobile LCP Lighthouse reports is ~2.3s; that's the figure the linked PageSpeed Insights check will also show, so it's what's used for the mobile performance score rather than the faster observed one — displaying anything else would make our own numbers not match what "verify it yourself" turns up.
  - `src/content/audit.ts` updated to these live-measured numbers; the comment there now documents the observed-vs-simulated LCP distinction directly instead of a "pending" note.
  - If Phase 5 adds a custom domain, this whole audit needs re-running against the new URL — `SITE_URL`, `audit.ts`'s `liveUrl`/`pageSpeedUrl`, and the displayed scores all currently point at the Vercel subdomain.

## Phase 5 — Final deploy and domain
- [x] **Custom domain purchased and connected:** `mauriciorodriguez.dev` (Mauricio asked for naming options first; picked this over keeping the free Vercel subdomain, against the brief's own "acceptable to launch on the subdomain" framing — his call). Vercel canonicalizes to `https://www.mauriciorodriguez.dev` (apex redirects to `www`); confirmed live and serving the site correctly.
- [x] Updated every hardcoded reference from the old Vercel subdomain to the new domain: `SITE_URL` in `[locale]/layout.tsx` (drives `metadataBase`, canonical, hreflang, Open Graph `url`), and `liveUrl`/`pageSpeedUrl` in `src/content/audit.ts`.
- [x] **Brand mark updated to match:** the Nav (`> mauricio.dev`) and the OG image both said "mauricio.dev," which no longer matched the real domain (`mauriciorodriguez.dev`) — confirmed with Mauricio and updated both to the real domain rather than leaving a stylized handle that doesn't match the URL.
- [x] Re-ran Lighthouse against the new domain: desktop 100/100/100/91→100\*, mobile 98/100/100/91→100\*. \*SEO's raw 91 reading is the *same* canonical-mismatch artifact diagnosed in Phase 4 — expected here too, since the live deploy still has the old (pre-Phase-5) `SITE_URL` until this branch merges. `audit.ts` reports 100, matching the confirmed diagnosis rather than the stale pre-merge reading.
- [x] **Live re-check done (2026-08-07):** confirmed `SITE_URL`/canonical is live and self-referential on `https://www.mauriciorodriguez.dev`. Re-ran Lighthouse for real: desktop 100/100/100/100, mobile 98/100/100/100 — SEO's 100 is now a direct measurement, not a diagnosis-based prediction. `audit.ts` comment updated accordingly.
- [ ] Verify the final link looks good embedded as a preview on LinkedIn/Slack/email — Open Graph/Twitter meta tags and the generated OG image are in place and validated structurally (Phase 4), but an actual paste-and-check in each platform is still worth doing once the domain is fully live and social platforms have (re-)crawled it. This is the one item on the "ready to launch" checklist (section 10) that needs a human eyeballing a real share preview, not something verifiable by fetching HTML.

---

## Open decisions not blocking progress
*(empty for now — all known pending items from the brief are resolved per section 9 of `CLAUDE.md`)*

---

## Decision history for items outside the original brief
- **Accent color palette:** the brief (section 5) doesn't fix an exact color ("terminal green or cyan, or another"). Claude Code proposed the final palette within that direction — near-black background (`#0a0a0b`), soft off-white foreground (`#e4e4e7`), single cyan accent (`#22d3ee`). Defined in `src/app/globals.css`.
- **Tailwind config location:** the brief (section 8, Phase 0) says "color palette in `tailwind.config`," but `create-next-app` scaffolded Tailwind v4, which has no JS config file by default — theme tokens are defined via an `@theme` block in CSS instead. The palette lives in `src/app/globals.css` rather than a `tailwind.config.ts`. Functionally equivalent, just a v4 convention change.
- **GitHub repo:** already exists and is connected — `github.com/MauricioRodCar/portfolio-site`. Phase 0 connected this repo to Vercel for the initial deploy; it didn't create a new one.
- **Documentation language:** all project documentation and code comments are now written in English going forward (this file and `CLAUDE.md` were translated from Spanish). Conversation with Mauricio can still happen in Spanish; written repo artifacts are English-only. See the "Project conventions" section at the bottom of `CLAUDE.md`.
- **Vercel deploy:** live at `https://portfolio-site-omega-ivory.vercel.app/`. Phase 0 "hello world" pipeline validated end-to-end (push to `main` → auto-deploy) on 2026-08-06.
- **Branching workflow:** starting Phase 1, each phase (and any other relevant feature) is built on its own branch off `main` rather than committed directly, to keep the repo history and `main` clean for sharing. Phase 1 lives on `phase-1-layout-design-system`.
- **Locale URL strategy:** used next-intl's default "always prefix" strategy (`/en`, `/es`, with `/` redirecting to `/en`) rather than a prefix-free default locale. Simpler and more robust with static generation than the "as-needed" alternative; Mauricio can ask to switch to a clean unprefixed `/` for English if he'd rather avoid the redirect hop.
- **`middleware.ts` → `proxy.ts`:** Next.js 16 deprecated the `middleware` file convention in favor of `proxy` (same default-export function, same `config.matcher`). Renamed `src/middleware.ts` to `src/proxy.ts` during the i18n work to avoid building on a deprecated convention from day one.
- **Playground implementation: CodeMirror + sandboxed runtime, not Sandpack.** The brief (section 4) lists both as acceptable. Sandpack ships a full in-browser bundler, which is much heavier than this use case needs — the playground only has to run a small, self-contained tool-calling function against editable input and print a string, not resolve imports or render a live DOM preview. `@uiw/react-codemirror` gives the same "real editable code with real syntax highlighting" feel at a fraction of the weight, which matters given the explicit performance budget (section 3: Lighthouse ≥ 90) and the requirement that the playground not hurt the rest of the site's performance. The edited code runs via `new Function(...)` entirely in the visitor's own browser tab — same trust boundary as a devtools console, no server involved, standard for this kind of in-browser code playground.
- **Nav overflow on narrow mobile:** with 3 section links + locale switcher + Contact button, the nav no longer fit below ~480px wide. Fixed by hiding the section links (`How I Think` / `Playground` / `Stack`) below the `md` breakpoint, keeping brand + locale switcher + Contact always visible — no hamburger menu, since the single-page site is still fully reachable by scrolling and section 7 only calls for "functional," not pixel-perfect, mobile.
- **`SITE_URL` hardcoded in `[locale]/layout.tsx`:** used for `metadataBase`, canonical/hreflang, and Open Graph `url`. Currently `https://portfolio-site-omega-ivory.vercel.app`. **Update this if/when Phase 5 adds a custom domain** — social previews, canonical tags, and the Audit section's `pageSpeedUrl`/`liveUrl` (`src/content/audit.ts`) all depend on it being correct.
