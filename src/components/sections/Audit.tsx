import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { auditResults, auditMeta } from "@/content/audit";

export function Audit() {
  const t = useTranslations("audit");

  return (
    <section
      id="audit"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24"
    >
      <Reveal>
        <h2 className="font-mono text-sm uppercase tracking-wide text-accent">
          {t("heading")}
        </h2>
        <p className="mt-2 max-w-2xl text-2xl font-semibold text-foreground sm:text-3xl">
          {t("subheading")}
        </p>
        <p className="mt-4 max-w-2xl text-sm text-muted">{t("intro")}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-8">
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex items-center gap-1.5 border-b border-border bg-foreground/[0.03] px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="ml-2 font-mono text-xs text-muted">
              lighthouse
            </span>
          </div>
          <div className="overflow-x-auto p-6 font-mono text-sm leading-relaxed">
            <p className="text-muted">
              <span className="text-accent">$</span> lighthouse{" "}
              {auditMeta.liveUrl} --preset=desktop,mobile
            </p>
            <div className="mt-3 flex flex-col gap-1.5">
              {auditResults.map((r) => (
                <div
                  key={r.key}
                  className="flex flex-wrap items-baseline gap-x-3"
                >
                  <span className="text-green-400">✓</span>
                  <span className="w-36 text-foreground">
                    {t(`categories.${r.key}`)}
                  </span>
                  <span className="text-muted">
                    {t("desktopLabel")}{" "}
                    <span className="text-green-400">{r.desktop}/100</span>
                  </span>
                  <span className="text-muted">
                    {t("mobileLabel")}{" "}
                    <span className="text-green-400">{r.mobile}/100</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">
              {t("measuredOn")} {auditMeta.date}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-6">
        <Button
          href={auditMeta.pageSpeedUrl}
          variant="outline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("verifyCta")}
        </Button>
      </Reveal>
    </section>
  );
}
