# Architecture Brief — Mauricio Rodríguez Carballo's Portfolio

**Role of whoever reads this:** You are the developer (Claude Code) executing this project in VS Code. This document is your architecture spec, defined together with Mauricio (product owner) and a Claude acting as software architect. It is not a résumé — it's a living cover letter. Follow the phases in order; don't jump to detailed implementation without closing the previous phase.

---

## 1. Product goal

A personal site that works as **proof of skill, not a summary**. The visitor (technical recruiter, hiring manager, lead) should:
1. In the first 5-10 seconds, feel the quality of execution (speed, design, polish).
2. In 30-60 seconds, understand what kind of problems Mauricio solves and how he thinks.
3. If they decide to dig deeper, be able to **see and touch real code** — not just read about it.

**Don't duplicate the résumé.** No "Experience 2019-2022, Octopy, React Developer" in list format. Résumé info lives on LinkedIn/attached PDF; here we show *evidence*, not biography.

---

## 2. Target audience and attention constraint

- Non-technical recruiters: skim for 15-45s. They need visual impact + a clear value-proposition message.
- Technical leads/hiring managers: if they arrive, they'll want to see real code, not just a pretty portfolio.
- **Design implication:** the site can't depend on the user interacting to "understand" who Mauricio is. Interactivity is a bonus for whoever digs deeper, not a requirement for whoever skims.

---

## 3. Architecture decision: Hybrid (fast static + 1-2 strong interactive pieces)

- Site base: static or pre-rendered content, subtle scroll/entrance animations, zero loading friction.
- Exception: a **live code playground** (see section 6) as the centerpiece of differentiation.
- Performance budget: Lighthouse Performance ≥ 90, LCP < 2s on an average connection, no noticeable layout shift.

---

## 4. Tech stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js (React + TypeScript)** | SSG for speed, App Router, allows using Route Handlers if the playground needs a lightweight backend |
| Styling | Tailwind CSS | Fast iteration, consistent with the design system defined below |
| Animations | Framer Motion | Subtle scroll/entrance transitions, no over-engineering |
| Code playground | Sandpack (CodeSandbox) or CodeMirror + client-side runtime | Must run client-side, without exposing secrets or requiring a persistent backend |
| Hosting | **Vercel (free subdomain, e.g. `mauricio-rodriguez.vercel.app`)** | Native integration with Next.js, automatic deploy from GitHub, zero upfront cost. A custom domain remains an optional future improvement, not a launch blocker |
| Typeface | Monospace for code/accents (e.g. JetBrains Mono) + readable sans-serif for long text (e.g. Inter) | Reinforces "technical" identity without sacrificing readability |
| Internationalization | `next-intl` (or Next App Router's native `i18n`) | Default language: **English**. Spanish as a second language via selector. Implemented in Phase 2 (not Phase 0/1) so as not to slow down initial development with the translation layer |

**Note:** no CMS or database. All content lives in files (MDX or JSON) within the repo — it's a personal site, it doesn't need that operational complexity.

---

## 5. Design system — visual direction

**Chosen tone: Minimalist and technical.**

- Dark mode as default (optional light mode possible, not a priority in v1).
- "Code editor / terminal" aesthetic: monospace typography in details (nav, tags, labels), reduced palette (near-black background, 1-2 vivid accent colors — e.g. terminal green or cyan, used sparingly, not oversaturated).
- Micro-details reinforcing dev identity: blinking cursors, `$`-style prompts, line numbers in snippets, real syntax highlighting (not screenshots of code).
- No personal photo, no stock photos, no generic "developer with laptop" illustrations. Visual identity is built 100% from typography, real code, and the color/spacing system — the site should feel so polished it doesn't need a face to convey personality.
- Purposeful motion: subtle fade/slide as sections enter on scroll, hover states with immediate feedback. Avoid decorative animation with no function.

---

## 6. Content architecture / site sections

### 6.1 Hero
**Final copy (defined with Mauricio):**
> "Math taught me to see problems as puzzles. Code taught me to solve them. Now, I'm teaching an AI to join in."

This is the hero's main text. Timeless (no years-of-experience figure), no filler, with a math → code → AI progression that connects directly to the 3 case studies in section 6.2. Do not modify this copy without Mauricio's approval — it's closed content, not a placeholder.

### 6.2 "How I think" / Case studies (Code X-rays)
3 cases, each with: brief problem context (1-2 lines, no real client/company names due to NDA), the key technical decision, and a curated, commented code snippet illustrating that decision.

Selected cases:
1. **Optimization under high traffic** (domain: media/marketing) — show the real optimization pattern used (e.g. caching strategy, lazy loading, or refactor of deprecated code), generalized and anonymized.
2. **Multi-repo / DevOps** (based on experience at Octopy) — not a feature snippet, it's evidence of team-level engineering thinking: repo structure, permission management, CI/CD pipeline design (deploy to QA/production via Node.js + PM2). The "snippet" here can be, for example, a fragment of pipeline configuration (YAML) commented to explain the decisions — which quality gates are validated before merging/deploying, and why.
3. **Local AI agent with Ollama** — the most flexible one because it's a personal project, with no NDA restriction. Ideal candidate to also be the base for the interactive playground (section 6.3), since Mauricio can share real code without restriction.

**Rule for all snippets:** never literal client code. Always rewritten/generalized, preserving the pattern and design decision, not the client's business details.

**Process note:** Mauricio will not share real client code due to NDA. The 3 snippets must be **written from scratch by Claude Code**, strictly following the technical pattern specs below — not freely invented. The goal is for the pattern to be technically correct and defensible in an interview (Mauricio must be able to speak about it with authority), not for it to be copied code.

#### Snippet 1 spec — Optimization under high traffic
- **Pattern to illustrate:** *stale-while-revalidate*-style caching strategy for API calls, combined with deduplication of concurrent requests (avoiding N identical simultaneous calls during traffic spikes).
- **Language:** TypeScript, React hook style (e.g. `useCachedFetch` or similar).
- **Required comments:** explain *why* this pattern reduces backend load during spikes, and the trade-off of serving slightly stale data in exchange for resilience.
- **Tone of surrounding copy:** "When traffic spikes, the worst decision is letting every user fire their own call to the backend. Here's how I design the caching layer so it can absorb the spike without falling over."

#### Snippet 2 spec — Multi-repo / DevOps
- **Pattern to illustrate:** CI/CD pipeline configuration fragment (YAML format, GitHub Actions style) with quality stages before deploy: lint → test → build → deploy conditioned on branch/environment (QA vs production).
- **Required comments:** explain the reason for each gate (e.g. why production deploy requires manual approval or a tag, why the QA pipeline is more permissive).
- **Tone of surrounding copy:** emphasize that this isn't "feature code," it's process design — showing that Mauricio thinks about the whole team, not just his own commit.

#### Snippet 3 spec — AI agent with Ollama
- **Pattern to illustrate:** function-calling/tool-use orchestration in a local agent — e.g. how a set of "tools" available to the model is defined, its decision is parsed, and the corresponding function is executed.
- **This is the only snippet that can come close to real code**, since it's a personal project with no NDA. If Mauricio decides to share real fragments later, this is the candidate; otherwise, Claude Code writes it following the general tool-orchestration pattern for agents with local LLMs.
- This snippet is also the base for the interactive playground (section 6.3) — it must be simplified to a version that runs 100% in the browser (without calling a real Ollama instance).

### 6.3 Interactive playground ("wow" piece)
A component where the visitor can:
- View a real, editable snippet related to the AI agent project (e.g. a mini function-calling flow, or an orchestration logic fragment with Ollama).
- Modify parameters or code and see the result/output change live (e.g. in-browser simulation, not a real call to a local model — that isn't deployable on Vercel).
- Must run 100% client-side. Must not depend on Mauricio's local Ollama instance running.

### 6.4 Stack / tools
Not a boring list of logos. Preferred: grouped by "what I use it for" (e.g. "When I need iteration speed: React + TS + Tailwind" / "When the project grows: Node + Express / NestJS + Postgres"). Keep it brief.

### 6.5 Contact / final CTA
Simple, direct: email, LinkedIn, and an optional link to a CV PDF. No complex contact forms — a recruiter isn't going to fill out a form, they're going to copy the email or send a LinkedIn message.

---

## 7. Explicit non-goals (to avoid scope creep)

- No blog.
- No comment system or complex analytics (basic Vercel Analytics is enough if desired).
- No authentication or persistent backend.
- No "perfect" responsiveness across every imaginable breakpoint — yes to functional mobile-friendliness, but the main audience checks from desktop/laptop.
- Internationalization limited to EN/ES via a simple selector (see section 3, `next-intl`). Don't add more languages or automatic region/browser detection logic in v1 — it's a nice-to-have, it shouldn't consume disproportionate roadmap time.

---

## 8. Execution roadmap (phases for Claude Code)

**Phase 0 — Setup**
Next.js + TypeScript + Tailwind project, folder structure, font configuration, color palette in `tailwind.config`, initial "hello world" deploy to Vercel to validate the pipeline from day one.

**Phase 1 — Layout and design system**
Build the navigation shell, hero, and base component system (typography, buttons, cards, tags) following the visual direction in section 5. No final content yet — use placeholder content.

**Phase 2 — Static content sections**
Case studies (6.2), stack section (6.4), contact (6.5), with scroll animations (Framer Motion). Real content for the first 2 already-defined cases.

**Phase 3 — Interactive playground**
Research and implement the client-side sandbox solution (Sandpack or another), integrate the AI project snippet, validate it works well on mobile and doesn't break the rest of the site's performance (load lazily/deferred).

**Phase 4 — Polish and performance**
Lighthouse audit, adjust images/fonts, review basic accessibility (contrast, keyboard navigation), basic meta tags (even if not indexed, useful for the preview when sharing the link on LinkedIn/messages).

**Phase 5 — Final deploy and domain**
Configure a custom domain if Mauricio decides to buy one (e.g. `mauriciorodriguez.dev`), or use the Vercel subdomain. Verify the final link looks good embedded as a preview on LinkedIn/Slack/email.

---

## 9. Open items requiring Mauricio's decision/input before or during the build

**All resolved.** The brief is complete and ready to move to execution (Phase 0).

- ~~Personal photo~~ → No photo. The site relies 100% on typography, code, and design, with no face.
- ~~Domain~~ → Free Vercel subdomain for the initial launch. Custom domain remains a future improvement.
- ~~Language~~ → English as the main language, with internationalization (ES/EN selector) as a Phase 2 feature.
- ~~Third case study~~ → Multi-repo/DevOps (Octopy): repo structure, permissions, CI/CD pipelines.
- ~~Code snippets~~ → No real client code will be used (NDA). Claude Code writes them following the technical pattern specs detailed in section 6.2.
- ~~Hero copy~~ → See section 6.1, final text already closed.

---

## 10. "Ready to launch" criteria

The site is ready when: it loads in <2s, it looks good on desktop and mobile, the playground works with no console errors, there is no placeholder text left ("Lorem ipsum," undrafted content), and Mauricio can share the link and feel it represents his actual level of execution — not a generic portfolio template.

---

## Project conventions

- **Language for docs and comments: English.** All project documentation (this file, `TODO.md`, code comments) is written in English going forward, so the repository can be shared publicly or with English-speaking reviewers without translation. Conversation with Mauricio can still happen in Spanish; written artifacts in the repo are English-only.
