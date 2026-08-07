"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ToggleGroup } from "@/components/ui/ToggleGroup";
import { StackList } from "./StackList";
import { StackConstellation } from "./StackConstellation";

type View = "list" | "constellation";

export function StackView() {
  const t = useTranslations("stack");
  const [view, setView] = useState<View>("list");

  return (
    <div>
      <ToggleGroup
        value={view}
        onChange={setView}
        ariaLabel={t("viewToggleAriaLabel")}
        className="mb-6"
        options={[
          { value: "list", label: t("viewToggleList") },
          { value: "constellation", label: t("viewToggleConstellation") },
        ]}
      />

      {view === "list" ? <StackList /> : <StackConstellation />}
    </div>
  );
}
