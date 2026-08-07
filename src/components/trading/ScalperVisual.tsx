"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useInViewOnce } from "./useInViewOnce";

interface Candle {
  o: number;
  c: number;
  h: number;
  l: number;
}

// Hand-placed, not randomly generated — a normal drift, one sharp
// single-tick jump, a brief pause (the confirmation window), then a
// reversion back toward the pre-jump level. Illustrates the pattern
// from the real code, not live/real market data.
const CANDLES: Candle[] = [
  { o: 150, c: 148, h: 146, l: 152 },
  { o: 148, c: 152, h: 145, l: 154 },
  { o: 152, c: 149, h: 147, l: 155 },
  { o: 149, c: 151, h: 146, l: 153 },
  { o: 151, c: 147, h: 145, l: 153 },
  { o: 147, c: 150, h: 144, l: 152 },
  { o: 150, c: 70, h: 68, l: 151 },
  { o: 70, c: 75, h: 68, l: 78 },
  { o: 75, c: 95, h: 76, l: 97 },
  { o: 95, c: 115, h: 93, l: 117 },
  { o: 115, c: 135, h: 113, l: 137 },
  { o: 135, c: 148, h: 133, l: 150 },
  { o: 148, c: 149, h: 146, l: 151 },
];

const JUMP_INDEX = 6;
const ENTRY_INDEX = 8;
const TP_INDEX = 11;
const CANDLE_W = 18;
const SPACING = 43;
const START_X = 30;

function cx(i: number) {
  return START_X + i * SPACING;
}

export function ScalperVisual() {
  const t = useTranslations("caseStudies.trading.scalper");
  const { ref, inView } = useInViewOnce<HTMLDivElement>();
  const [step, setStep] = useState(0);
  const timerRef = useRef<number | null>(null);

  function play() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setStep(0);
    let i = 0;
    const totalSteps = CANDLES.length + 2;
    const tick = () => {
      i++;
      setStep(i);
      if (i < totalSteps) {
        timerRef.current = window.setTimeout(
          tick,
          i < CANDLES.length ? 110 : 550
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

  const visibleCandles = Math.min(step, CANDLES.length);
  const showEntry = step > CANDLES.length;
  const showTp = step > CANDLES.length + 1;

  return (
    <div ref={ref} className="rounded-lg border border-border p-4">
      <svg viewBox="0 0 600 220" className="w-full">
        {CANDLES.slice(0, visibleCandles).map((candle, i) => {
          const isJump = i === JUMP_INDEX;
          const color = isJump ? "var(--accent)" : "var(--muted)";
          const bodyTop = Math.min(candle.o, candle.c);
          const bodyHeight = Math.max(Math.abs(candle.c - candle.o), 2);
          return (
            <g key={i}>
              <line
                x1={cx(i)}
                y1={candle.h}
                x2={cx(i)}
                y2={candle.l}
                stroke={color}
                strokeWidth={1.5}
              />
              <rect
                x={cx(i) - CANDLE_W / 2}
                y={bodyTop}
                width={CANDLE_W}
                height={bodyHeight}
                fill={color}
              />
            </g>
          );
        })}

        {visibleCandles > JUMP_INDEX && (
          <text
            x={cx(JUMP_INDEX)}
            y={CANDLES[JUMP_INDEX].h - 8}
            textAnchor="middle"
            fill="var(--accent)"
            className="font-mono text-[10px]"
          >
            {t("jumpLabel")}
          </text>
        )}

        {showEntry && (
          <g>
            <polygon
              points={`${cx(ENTRY_INDEX) - 5},${CANDLES[ENTRY_INDEX].h - 14} ${cx(ENTRY_INDEX) + 5},${CANDLES[ENTRY_INDEX].h - 14} ${cx(ENTRY_INDEX)},${CANDLES[ENTRY_INDEX].h - 6}`}
              fill="var(--accent)"
            />
            <text
              x={cx(ENTRY_INDEX)}
              y={CANDLES[ENTRY_INDEX].h - 18}
              textAnchor="middle"
              fill="var(--accent)"
              className="font-mono text-[10px]"
            >
              {t("entryLabel")}
            </text>
          </g>
        )}

        {showTp && (
          <text
            x={cx(TP_INDEX)}
            y={CANDLES[TP_INDEX].l + 22}
            textAnchor="middle"
            fill="var(--accent)"
            className="font-mono text-xs font-bold"
          >
            {t("tpLabel")}
          </text>
        )}
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
