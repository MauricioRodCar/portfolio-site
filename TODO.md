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
- [ ] Research and implement Sandpack (or an alternative) for the client-side playground (section 6.3).
- [ ] Create `src/components/playground/` when this phase starts — it doesn't exist in the Phase 0 structure.
- [ ] Integrate a simplified version of snippet 3 (Ollama agent) that runs 100% in the browser, without calling a real Ollama instance.
- [ ] Validate that the playground loads lazily/deferred so it doesn't impact the rest of the site's performance.

## Phase 4 — Polish and performance
- [ ] Full Lighthouse audit (target: Performance ≥ 90, LCP < 2s, no noticeable layout shift).
- [ ] Basic accessibility review (contrast, keyboard navigation).
- [ ] Meta tags for link previews (LinkedIn/Slack/email), even though the site isn't indexed.

## Phase 5 — Final deploy and domain
- [ ] Decide whether to buy a custom domain (e.g. `mauriciorodriguez.dev`) or keep the free Vercel subdomain.
- [ ] Verify the final link looks good embedded as a preview on LinkedIn/Slack/email.

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
