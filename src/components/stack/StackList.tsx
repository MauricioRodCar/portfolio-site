import { useTranslations } from "next-intl";
import { Tag } from "@/components/ui/Tag";
import { primaryGroups, secondaryGroups } from "./data";

export function StackList() {
  const t = useTranslations("stack");

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center gap-1.5 border-b border-border bg-foreground/[0.03] px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="ml-2 font-mono text-xs text-muted">
            toolkit.json
          </span>
        </div>
        <div className="overflow-x-auto p-6 font-mono text-sm leading-relaxed">
          <p className="text-muted">
            <span className="text-accent">$</span> cat toolkit.json
          </p>
          <div className="mt-4 flex flex-col gap-5">
            {primaryGroups.map((group) => (
              <div key={group.key}>
                <p className="text-accent">{`// ${t(`groups.${group.key}`)}`}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.tools.map((tool) => (
                    <Tag key={tool}>{tool}</Tag>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-sm font-semibold text-foreground">
          {t("alsoTitle")}
        </p>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t("alsoIntro")}</p>
        <div className="mt-4 flex flex-col gap-3">
          {secondaryGroups.map((group) => (
            <div key={group.key}>
              <p className="font-mono text-xs font-semibold uppercase tracking-wide text-accent">
                {t(`secondaryGroups.${group.key}`)}
              </p>
              <p className="mt-1 text-sm text-muted">
                {group.tools.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
