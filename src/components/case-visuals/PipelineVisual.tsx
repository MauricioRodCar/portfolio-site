"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useInViewOnce } from "@/components/ui/useInViewOnce";

const BOX_W = 100;
const BOX_H = 40;
const LINT = { x: 20, y: 70 };
const TEST = { x: 160, y: 70 };
const BUILD = { x: 300, y: 70 };
const QA = { x: 500, y: 20 };
const PROD = { x: 500, y: 120 };

// step 0: nothing. 1-3: lint/test/build light up. 4: both branches
// diverge, QA deploys immediately (no gate). 5: production box appears
// locked, pending approval. 6: approval clears, production deploys.
const TOTAL_STEPS = 6;

interface StageProps {
  x: number;
  y: number;
  label: string;
  state: "pending" | "lit" | "locked";
  statusLabel?: string;
}

function Stage({ x, y, label, state, statusLabel }: StageProps) {
  const stroke = state === "lit" ? "var(--accent)" : "var(--border)";
  const textColor = state === "lit" ? "var(--accent)" : "var(--muted)";
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={BOX_W}
        height={BOX_H}
        rx={4}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeDasharray={state === "locked" ? "3 3" : undefined}
      />
      <text x={x + BOX_W / 2} y={y + BOX_H / 2 + 4} textAnchor="middle" fill={textColor} className="font-mono text-[10px]">
        {state === "lit" ? "✓ " : state === "locked" ? "🔒 " : ""}
        {label}
      </text>
      {statusLabel && (
        <text x={x + BOX_W / 2} y={y - 6} textAnchor="middle" fill="var(--muted)" className="font-mono text-[8px]">
          {statusLabel}
        </text>
      )}
    </g>
  );
}

export function PipelineVisual() {
  const t = useTranslations("caseStudies.pipeline");
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
        timerRef.current = window.setTimeout(tick, i === 5 ? 800 : 550);
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

  const lintLit = step >= 1;
  const testLit = step >= 2;
  const buildLit = step >= 3;
  const branchesShown = step >= 4;
  const prodShown = step >= 5;
  const prodApproved = step >= 6;

  return (
    <div ref={ref} className="rounded-lg border border-border p-4">
      <svg viewBox="0 0 620 180" className="w-full">
        <line x1={LINT.x + BOX_W} y1={90} x2={TEST.x} y2={90} stroke={testLit ? "var(--accent)" : "var(--border)"} strokeWidth={1.5} />
        <line x1={TEST.x + BOX_W} y1={90} x2={BUILD.x} y2={90} stroke={buildLit ? "var(--accent)" : "var(--border)"} strokeWidth={1.5} />

        <Stage x={LINT.x} y={LINT.y} label={t("lintLabel")} state={lintLit ? "lit" : "pending"} />
        <Stage x={TEST.x} y={TEST.y} label={t("testLabel")} state={testLit ? "lit" : "pending"} />
        <Stage x={BUILD.x} y={BUILD.y} label={t("buildLabel")} state={buildLit ? "lit" : "pending"} />

        {branchesShown && (
          <>
            <line x1={BUILD.x + BOX_W} y1={90} x2={QA.x} y2={QA.y + BOX_H / 2} stroke="var(--accent)" strokeWidth={1.5} />
            <line x1={BUILD.x + BOX_W} y1={90} x2={PROD.x} y2={PROD.y + BOX_H / 2} stroke="var(--muted)" strokeWidth={1.5} />
            <Stage x={QA.x} y={QA.y} label={t("qaLabel")} state="lit" statusLabel={t("qaBranchLabel")} />
          </>
        )}

        {prodShown && (
          <Stage
            x={PROD.x}
            y={PROD.y}
            label={prodApproved ? t("prodLabel") : t("approvalLabel")}
            state={prodApproved ? "lit" : "locked"}
            statusLabel={prodApproved ? t("approvedLabel") : t("prodBranchLabel")}
          />
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
