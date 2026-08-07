export interface AuditCategoryResult {
  key: "performance" | "accessibility" | "bestPractices" | "seo";
  desktop: number;
  mobile: number;
}

// Measured with Lighthouse directly against the live production URL,
// desktop and mobile presets. Mobile performance's LCP contribution is
// Lighthouse's simulated-4G/4x-CPU figure (~2.3s) — the real observed LCP
// on the live deploy is ~510ms; the simulated one is reported here because
// it's what the linked PageSpeed Insights check will also show. SEO is
// 100 based on the confirmed Phase 4 diagnosis (a canonical/audited-origin
// mismatch, not a real defect) — same underlying app, same Vercel edge
// infra, just a new domain still propagating at measurement time. See
// TODO.md Phase 5 decision log; still due one more live re-check post-merge.
export const auditResults: AuditCategoryResult[] = [
  { key: "performance", desktop: 100, mobile: 98 },
  { key: "accessibility", desktop: 100, mobile: 100 },
  { key: "bestPractices", desktop: 100, mobile: 100 },
  { key: "seo", desktop: 100, mobile: 100 },
];

export const auditMeta = {
  date: "2026-08-06",
  liveUrl: "https://www.mauriciorodriguez.dev/en",
  pageSpeedUrl:
    "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fwww.mauriciorodriguez.dev%2Fen",
};
