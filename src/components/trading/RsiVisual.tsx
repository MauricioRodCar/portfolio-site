"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useInViewOnce } from "./useInViewOnce";

interface Point {
  x: number;
  y: number;
}

// Hand-placed points, not real market data — a drift down into a
// support/oversold zone, then a reversal, matching the confluence
// check in the real code (RSI cross back above 30 near a fractal low).
const PRICE_POINTS: Point[] = [
  { x: 20, y: 30 },
  { x: 80, y: 50 },
  { x: 140, y: 75 },
  { x: 200, y: 95 },
  { x: 260, y: 110 },
  { x: 320, y: 118 },
  { x: 380, y: 100 },
  { x: 440, y: 80 },
  { x: 500, y: 60 },
  { x: 560, y: 45 },
];

const RSI_POINTS: Point[] = [
  { x: 20, y: 185 },
  { x: 80, y: 195 },
  { x: 140, y: 210 },
  { x: 200, y: 222 },
  { x: 260, y: 228 },
  { x: 320, y: 230 },
  { x: 380, y: 218 },
  { x: 440, y: 205 },
  { x: 500, y: 195 },
  { x: 560, y: 188 },
];

const SIGNAL_INDEX = 6;
const SR_Y = 120;
const OVERBOUGHT_Y = 180;
const OVERSOLD_Y = 220;

function toPolyline(points: Point[]) {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}

export function RsiVisual() {
  const t = useTranslations("caseStudies.trading.rsi");
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const timerRef = useRef<number | null>(null);

  function play() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setStep(0);
    let i = 0;
    const totalSteps = PRICE_POINTS.length + 1;
    const tick = () => {
      i++;
      setStep(i);
      if (i < totalSteps) {
        timerRef.current = window.setTimeout(
          tick,
          i < PRICE_POINTS.length ? 130 : 550
        );
      }
    };
    timerRef.current = window.setTimeout(tick, 150);
  }

  useEffect(() => {
    if (!inView) return;
    const startTimer = window.setTimeout(play, 0);
    return () => {
      window.clearTimeout(startTimer);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [inView]);

  const visiblePoints = Math.min(step, PRICE_POINTS.length);
  const showSignal = step > PRICE_POINTS.length;

  return (
    <div ref={ref} className="rounded-lg border border-border p-4">
      <svg viewBox="0 0 600 260" className="w-full">
        {/* Price panel */}
        <line
          x1={0}
          y1={SR_Y}
          x2={600}
          y2={SR_Y}
          stroke="var(--border)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <text x={595} y={SR_Y - 6} textAnchor="end" fill="var(--muted)" className="font-mono text-[9px]">
          {t("srLabel")}
        </text>

        {visiblePoints > 1 && (
          <polyline
            points={toPolyline(PRICE_POINTS.slice(0, visiblePoints))}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth={1.5}
          />
        )}
        {PRICE_POINTS.slice(0, visiblePoints).map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === SIGNAL_INDEX ? 3.5 : 2}
            fill={i === SIGNAL_INDEX ? "var(--accent)" : "var(--foreground)"}
          />
        ))}

        {showSignal && (
          <g>
            <circle cx={PRICE_POINTS[SIGNAL_INDEX].x} cy={PRICE_POINTS[SIGNAL_INDEX].y} r={7} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
            <text
              x={PRICE_POINTS[SIGNAL_INDEX].x}
              y={PRICE_POINTS[SIGNAL_INDEX].y - 12}
              textAnchor="middle"
              fill="var(--accent)"
              className="font-mono text-[10px] font-bold"
            >
              {t("entryLabel")}
            </text>
          </g>
        )}

        {/* RSI panel */}
        <line x1={0} y1={OVERBOUGHT_Y} x2={600} y2={OVERBOUGHT_Y} stroke="var(--border)" strokeWidth={1} strokeDasharray="4 4" />
        <line x1={0} y1={OVERSOLD_Y} x2={600} y2={OVERSOLD_Y} stroke="var(--border)" strokeWidth={1} strokeDasharray="4 4" />
        <text x={595} y={OVERSOLD_Y - 6} textAnchor="end" fill="var(--muted)" className="font-mono text-[9px]">
          {t("oversoldLabel")}
        </text>

        {visiblePoints > 1 && (
          <polyline
            points={toPolyline(RSI_POINTS.slice(0, visiblePoints))}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={1.5}
          />
        )}
        {RSI_POINTS.slice(0, visiblePoints).map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === SIGNAL_INDEX ? 3.5 : 2}
            fill={i === SIGNAL_INDEX ? "var(--accent)" : "var(--muted)"}
          />
        ))}
      </svg>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted">{t("caption")}</p>
        <button
          onClick={play}
          className="shrink-0 rounded font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("replayCta")}
        </button>
      </div>
    </div>
  );
}
