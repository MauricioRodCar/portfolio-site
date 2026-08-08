"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { ScalperVisual } from "./ScalperVisual";
import { RsiVisual } from "./RsiVisual";

type Tool = "scalper" | "rsi";
type View = "visual" | "code";

interface TradingSystemsEvidenceProps {
  scalperCode: ReactNode;
  rsiCode: ReactNode;
}

export function TradingSystemsEvidence({
  scalperCode,
  rsiCode,
}: TradingSystemsEvidenceProps) {
  const t = useTranslations("caseStudies.trading");
  const tEvidence = useTranslations("caseStudies.evidence");
  const [tool, setTool] = useState<Tool>("scalper");
  const [view, setView] = useState<View>("visual");

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <ToggleGroup
          value={tool}
          onChange={setTool}
          ariaLabel={t("toolToggleAriaLabel")}
          options={[
            { value: "scalper", label: t("toolScalper") },
            { value: "rsi", label: t("toolRsi") },
          ]}
        />
        <ToggleGroup
          value={view}
          onChange={setView}
          ariaLabel={tEvidence("viewToggleAriaLabel")}
          options={[
            { value: "visual", label: tEvidence("viewVisual") },
            { value: "code", label: tEvidence("viewCode") },
          ]}
        />
      </div>

      {view === "visual" ? (
        tool === "scalper" ? (
          <ScalperVisual />
        ) : (
          <RsiVisual />
        )
      ) : tool === "scalper" ? (
        scalperCode
      ) : (
        rsiCode
      )}
    </div>
  );
}
