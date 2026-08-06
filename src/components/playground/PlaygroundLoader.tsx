"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

const AgentPlayground = dynamic(
  () => import("./AgentPlayground").then((mod) => mod.AgentPlayground),
  { ssr: false, loading: () => <PlaygroundSkeleton /> }
);

function PlaygroundSkeleton() {
  const t = useTranslations("playground");
  return (
    <div className="flex h-80 items-center justify-center rounded-lg border border-border font-mono text-sm text-muted">
      {t("loading")}
    </div>
  );
}

export function PlaygroundLoader() {
  return <AgentPlayground />;
}
