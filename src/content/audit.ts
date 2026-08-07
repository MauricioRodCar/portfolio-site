export interface AuditCategoryResult {
  key: "performance" | "accessibility" | "bestPractices" | "seo";
  desktop: number;
  mobile: number;
}

// Measured with Lighthouse directly against the live production URL
// (portfolio-site-omega-ivory.vercel.app), desktop and mobile presets.
// Mobile performance's LCP contribution is Lighthouse's simulated-4G/4x-CPU
// figure (~2.3s) — the real observed LCP on the live deploy is ~510ms; the
// simulated one is reported here because it's what the linked PageSpeed
// Insights check will also show. See TODO.md Phase 4 decision log.
export const auditResults: AuditCategoryResult[] = [
  { key: "performance", desktop: 100, mobile: 98 },
  { key: "accessibility", desktop: 100, mobile: 100 },
  { key: "bestPractices", desktop: 100, mobile: 100 },
  { key: "seo", desktop: 100, mobile: 100 },
];

export const auditMeta = {
  date: "2026-08-06",
  liveUrl: "https://portfolio-site-omega-ivory.vercel.app/en",
  pageSpeedUrl:
    "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fportfolio-site-omega-ivory.vercel.app%2Fen",
};
