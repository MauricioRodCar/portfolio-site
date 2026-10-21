"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import type { ShippedDecisionKey } from "@/content/shipped/wispkin";

interface ShippedDecisionsProps {
  // Code blocks are highlighted on the server (Shiki) and handed in
  // pre-rendered, so the tabs ship no highlighter JS to the client.
  code: Record<ShippedDecisionKey, ReactNode>;
}

const KEYS: ShippedDecisionKey[] = ["providers", "stateMachine", "guardrails"];

export function ShippedDecisions({ code }: ShippedDecisionsProps) {
  const t = useTranslations("shipped.decisions");
  const [active, setActive] = useState<ShippedDecisionKey>("providers");

  return (
    <div className="min-w-0">
      <div className="mb-4 overflow-x-auto">
        <ToggleGroup
          value={active}
          onChange={setActive}
          ariaLabel={t("ariaLabel")}
          options={KEYS.map((key) => ({ value: key, label: t(`${key}.tab`) }))}
        />
      </div>
      {/* Stacked rather than side by side: these snippets are real code with
          long signatures, and a half-width column would clip most lines. */}
      <div className="flex flex-col gap-6">
        <div className="flex max-w-3xl flex-col gap-3">
          <h4 className="text-lg font-semibold text-foreground">
            {t(`${active}.title`)}
          </h4>
          <p className="text-sm text-muted">{t(`${active}.body`)}</p>
          <p className="text-sm text-muted">
            <span className="text-accent">{t("whyLabel")} </span>
            {t(`${active}.why`)}
          </p>
        </div>
        <div className="min-w-0">{code[active]}</div>
      </div>
    </div>
  );
}
