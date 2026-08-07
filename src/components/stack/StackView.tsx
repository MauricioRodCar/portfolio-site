"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { StackList } from "./StackList";
import { StackConstellation } from "./StackConstellation";

type View = "list" | "constellation";

export function StackView() {
  const t = useTranslations("stack");
  const [view, setView] = useState<View>("list");

  return (
    <div>
      <div
        role="radiogroup"
        aria-label={t("viewToggleAriaLabel")}
        className="mb-6 inline-flex rounded-md border border-border p-0.5 font-mono text-xs uppercase tracking-wide"
      >
        <button
          role="radio"
          aria-checked={view === "list"}
          onClick={() => setView("list")}
          className={`rounded px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            view === "list"
              ? "bg-accent text-accent-foreground"
              : "text-muted hover:text-accent"
          }`}
        >
          {t("viewToggleList")}
        </button>
        <button
          role="radio"
          aria-checked={view === "constellation"}
          onClick={() => setView("constellation")}
          className={`rounded px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            view === "constellation"
              ? "bg-accent text-accent-foreground"
              : "text-muted hover:text-accent"
          }`}
        >
          {t("viewToggleConstellation")}
        </button>
      </div>

      {view === "list" ? <StackList /> : <StackConstellation />}
    </div>
  );
}
