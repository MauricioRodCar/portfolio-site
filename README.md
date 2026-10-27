# mauriciorodriguez.dev

**Live:** [mauriciorodriguez.dev](https://www.mauriciorodriguez.dev/en) · English / Español

My personal site, built as **evidence rather than a résumé**. Instead of listing jobs, it shows how I solve problems: annotated code from real engineering patterns, an interactive agent playground you can edit and run, and performance numbers you can re-check yourself.

## Verified performance

| Lighthouse | Desktop | Mobile |
| --- | :---: | :---: |
| Performance | 100 | 98 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

Measured against the live production URL. Don't take my word for it: [run PageSpeed Insights yourself](https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.mauriciorodriguez.dev%2Fen). The site has its own Audit section showing these numbers with the same link.

## What's inside

- **Case studies:** three engineering decisions, each with a short context and a commented snippet. They cover stale-while-revalidate caching with request deduplication for traffic spikes, a CI/CD pipeline with quality gates and environment-gated deploys, and tool-calling orchestration for a local LLM agent. Client work is under NDA, so the snippets are rewritten patterns, not client code.
- **Agent playground:** an in-browser editor (CodeMirror) running a simplified tool-calling agent in a sandbox. Visitors can change the code or the simulated model output and see the result live. It needs no backend and no API key.
- **Pathfinding puzzle:** draw walls and move the start and end points while an A\* solver recalculates the route.
- **Shipped product:** Wispkin, an AI desktop assistant, with a demo video and its key architecture decisions.
- **Trading systems:** a cTrader scalper and an RSI signal indicator (C#), shown with visual explanations.

## Engineering decisions

- **Performance budget first.** The target was Performance ≥ 90 and LCP < 2 s, and the result is 100/98. Code is highlighted on the server with Shiki, so it ships no client JavaScript for syntax highlighting.
- **Removed Framer Motion.** Lighthouse flagged about 45 KB of mostly unused JavaScript for a simple fade/slide effect. I rebuilt it with IntersectionObserver and CSS transitions, and the visual behavior is unchanged.
- **Two-layer lazy loading for the playground.** `next/dynamic` splits CodeMirror out of the main bundle, and an IntersectionObserver `LazyMount` doesn't mount it until it scrolls near the viewport. I verified with Playwright that no editor exists before scrolling.
- **Accessibility fixes beyond the score:** WCAG AA contrast fixes (muted text and code comments), a `<main>` landmark, visible `focus-visible` outlines, and a skip-to-content link, all tested by keyboard.
- **A mobile layout bug, root-caused.** `mx-auto` on flex items in a column-flex `body` disables cross-axis stretch, so sections sized themselves to their widest code line and the page scrolled horizontally. I fixed it at the pattern level, not with per-section patches.
- **Honest metrics.** Lighthouse's simulated mobile LCP (~2.3 s) is reported instead of the faster observed one (~510 ms), because the simulated figure is what a visitor's own PageSpeed check will show.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · next-intl · Shiki · CodeMirror · Vercel

## How it was built

I build with an AI-native workflow. I set the product goals, architecture, design system and performance budget in [`CLAUDE.md`](./CLAUDE.md). Claude Code then executed the work in phases on feature branches, and I reviewed and merged each one. [`TODO.md`](./TODO.md) is the running decision log: what was deferred, why, and what changed after testing. Both files are kept in the repo on purpose, because they show the process as well as the result.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000 (redirects to /en)
npm run build && npm start
```

---

**Mauricio Rodríguez Carballo** · Full-stack engineer (React · TypeScript · Node.js) · [LinkedIn](https://www.linkedin.com/in/mauricio-rodriguez-carballo) · [contact.mauricio.rodriguez@gmail.com](mailto:contact.mauricio.rodriguez@gmail.com)
