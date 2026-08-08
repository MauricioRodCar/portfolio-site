"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ToggleGroup } from "@/components/ui/ToggleGroup";

type View = "visual" | "code";

interface CaseStudyEvidenceProps {
  visual: ReactNode;
  code: ReactNode;
}

export function CaseStudyEvidence({ visual, code }: CaseStudyEvidenceProps) {
  const t = useTranslations("caseStudies.evidence");
  const [view, setView] = useState<View>("visual");

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <ToggleGroup
          value={view}
          onChange={setView}
          ariaLabel={t("viewToggleAriaLabel")}
          options={[
            { value: "visual", label: t("viewVisual") },
            { value: "code", label: t("viewCode") },
          ]}
        />
      </div>
      {view === "visual" ? visual : code}
    </div>
  );
}
