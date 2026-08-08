"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useInViewOnce } from "@/components/ui/useInViewOnce";

// Hand-placed, illustrative timing — not real traffic data. A burst of
// four near-simultaneous requests, then one more after the cache has
// gone stale, matching the stale-while-revalidate + dedup pattern from
// the real code (not a live/measured trace).
const REQUESTS_LANE_Y = 30;
const CACHE_LANE_Y = 100;
const BACKEND_LANE_Y = 170;
const LANE_START_X = 70;
const LANE_END_X = 560;
const STALE_THRESHOLD_X = 360;

const BURST_X = [100, 160, 220, 280];
const LATE_REQUEST_X = 480;

// step 0: nothing. steps 1-4: burst requests. step 5: stale threshold
// line. step 6: late request (instant, stale). step 7: background
// revalidation call.
const TOTAL_STEPS = 7;

export function TrafficVisual() {
  const t = useTranslations("caseStudies.traffic");
  const tEvidence = useTranslations("caseStudies.evidence");
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const timerRef = useRef<number | null>(null);

  function play() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setStep(0);
    let i = 0;
    const tick = () => {
      i++;
      setStep(i);
      if (i < TOTAL_STEPS) {
        timerRef.current = window.setTimeout(tick, i === 4 ? 700 : 500);
      }
    };
    timerRef.current = window.setTimeout(tick, 200);
  }

  useEffect(() => {
    if (!inView) return;
    const startTimer = window.setTimeout(play, 0);
    return () => {
      window.clearTimeout(startTimer);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [inView]);

  const burstShown = Math.min(step, 4);
  const showThreshold = step >= 5;
  const showLateRequest = step >= 6;
  const showRevalidate = step >= 7;

  return (
    <div ref={ref} className="rounded-lg border border-border p-4">
      <svg viewBox="0 0 600 200" className="w-full">
        <text x={LANE_START_X} y={REQUESTS_LANE_Y - 12} fill="var(--muted)" className="font-mono text-[9px]">
          {t("requestsLabel")}
        </text>
        <line x1={LANE_START_X} y1={REQUESTS_LANE_Y} x2={LANE_END_X} y2={REQUESTS_LANE_Y} stroke="var(--border)" strokeWidth={1} />

        <text x={LANE_START_X} y={CACHE_LANE_Y - 8} fill="var(--muted)" className="font-mono text-[9px]">
          {t("cacheLabel")}
        </text>
        <line x1={LANE_START_X} y1={CACHE_LANE_Y} x2={LANE_END_X} y2={CACHE_LANE_Y} stroke="var(--border)" strokeWidth={1} strokeDasharray="2 4" />

        <text x={LANE_START_X} y={BACKEND_LANE_Y - 8} fill="var(--muted)" className="font-mono text-[9px]">
          {t("backendLabel")}
        </text>
        <line x1={LANE_START_X} y1={BACKEND_LANE_Y} x2={LANE_END_X} y2={BACKEND_LANE_Y} stroke="var(--border)" strokeWidth={1} strokeDasharray="2 4" />

        {showThreshold && (
          <g>
            <line
              x1={STALE_THRESHOLD_X}
              y1={10}
              x2={STALE_THRESHOLD_X}
              y2={190}
              stroke="var(--muted)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <text
              x={STALE_THRESHOLD_X}
              y={10}
              textAnchor="middle"
              fill="var(--muted)"
              className="font-mono text-[8px]"
            >
              {t("staleLabel")}
            </text>
          </g>
        )}

        {BURST_X.slice(0, burstShown).map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={REQUESTS_LANE_Y} r={4} fill="var(--foreground)" />
            <line x1={x} y1={REQUESTS_LANE_Y} x2={x} y2={CACHE_LANE_Y} stroke="var(--muted)" strokeWidth={1.5} />
            {i === 0 && (
              <>
                <line x1={x} y1={CACHE_LANE_Y} x2={x} y2={BACKEND_LANE_Y} stroke="var(--accent)" strokeWidth={1.5} />
                <text x={x + 8} y={(CACHE_LANE_Y + BACKEND_LANE_Y) / 2} fill="var(--accent)" className="font-mono text-[8px]">
                  {t("missLabel")}
                </text>
              </>
            )}
          </g>
        ))}

        {showLateRequest && (
          <g>
            <circle cx={LATE_REQUEST_X} cy={REQUESTS_LANE_Y} r={4} fill="var(--foreground)" />
            <line
              x1={LATE_REQUEST_X}
              y1={REQUESTS_LANE_Y}
              x2={LATE_REQUEST_X}
              y2={CACHE_LANE_Y}
              stroke="var(--muted)"
              strokeWidth={1.5}
            />
          </g>
        )}

        {showRevalidate && (
          <g>
            <line
              x1={LATE_REQUEST_X}
              y1={CACHE_LANE_Y}
              x2={LATE_REQUEST_X}
              y2={BACKEND_LANE_Y}
              stroke="var(--accent)"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
            <text
              x={LATE_REQUEST_X - 8}
              y={(CACHE_LANE_Y + BACKEND_LANE_Y) / 2}
              textAnchor="end"
              fill="var(--accent)"
              className="font-mono text-[8px]"
            >
              {t("revalidateLabel")}
            </text>
          </g>
        )}
      </svg>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted">{t("caption")}</p>
        <button
          onClick={play}
          className="shrink-0 rounded font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {tEvidence("replayCta")}
        </button>
      </div>
    </div>
  );
}
