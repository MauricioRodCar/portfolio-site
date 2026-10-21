import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Reveal } from "@/components/ui/Reveal";
import { ShippedDecisions } from "@/components/shipped/ShippedDecisions";
import { ShippedVideo } from "@/components/shipped/ShippedVideo";
import {
  wispkin,
  SHIPPED_SNIPPETS,
  type ShippedDecisionKey,
} from "@/content/shipped/wispkin";

const SUBAGENTS = [
  "architect",
  "brain",
  "chat-ui",
  "window-shell",
  "avatar-anim",
  "integrations",
  "qa",
  "reviewer",
] as const;

export function Shipped() {
  const t = useTranslations("shipped");
  const locale = useLocale();
  const { media } = wispkin;
  const video = locale === "es" ? media.video.es : media.video.en;

  const code = Object.fromEntries(
    SHIPPED_SNIPPETS.map((s) => [
      s.key,
      <CodeBlock key={s.key} code={s.code} lang={s.lang} filename={s.filename} />,
    ]),
  ) as Record<ShippedDecisionKey, ReactNode>;

  return (
    <section id="shipped" className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24">
      <Reveal>
        <h2 className="font-mono text-sm uppercase tracking-wide text-accent">
          {t("heading")}
        </h2>
        <p className="mt-2 max-w-2xl text-2xl font-semibold text-foreground sm:text-3xl">
          {t("subheading")}
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        {/* Video spans the full card width: it's a 16:9 screen recording of
            a chat UI, and at half-column width its text would be unreadable. */}
        <Card className="grid gap-8 lg:grid-cols-2">
          <figure className="min-w-0 lg:col-span-2">
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="flex items-center gap-1.5 border-b border-border bg-foreground/[0.03] px-4 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="h-2.5 w-2.5 rounded-full bg-border" />
                <span className="ml-2 font-mono text-xs text-muted">
                  {t("mediaLabel")}
                </span>
              </div>
              <ShippedVideo
                src={video.src}
                poster={video.poster}
                width={media.width}
                height={media.height}
                label={t("mediaAlt")}
              />
            </div>
            <figcaption className="mt-2 font-mono text-xs text-muted">
              {t("mediaCaption")}
            </figcaption>
          </figure>

          <div className="flex min-w-0 flex-col gap-4">
            <p className="font-mono text-xs text-muted">
              <span className="text-accent">$</span> wispkin --version
              <br />
              <span className="text-foreground">{wispkin.version}</span>
              {" · "}
              {t("status")} · {wispkin.platform}
            </p>
            <h3 className="text-2xl font-semibold text-foreground">Wispkin</h3>
            <p className="text-foreground">{t("tagline")}</p>
            <p className="text-sm text-muted">{t("description")}</p>
          </div>

          <div className="flex min-w-0 flex-col justify-end gap-4">
            <dl className="grid grid-cols-2 gap-3">
              {wispkin.stats.map((stat) => (
                // Column-reversed so the number reads first visually while
                // the <dt> label still precedes its value for screen readers.
                // justify-end pins the numbers to the top (main axis is
                // flipped) so they align even when labels wrap differently.
                <div
                  key={stat.key}
                  className="flex flex-col-reverse justify-end rounded-md border border-border px-3 py-2"
                >
                  <dt className="text-xs text-muted">{t(`stats.${stat.key}`)}</dt>
                  <dd className="font-mono text-xl text-accent">{stat.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-3">
              <Button href={wispkin.links.download} target="_blank" rel="noopener noreferrer">
                {t("downloadCta")}
              </Button>
              <Button
                href={wispkin.links.repo}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("repoCta")}
              </Button>
            </div>
            <p className="text-xs text-muted">{t("sourceNote")}</p>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.15} className="mt-8">
        <Card>
          <h3 className="font-mono text-sm uppercase tracking-wide text-accent">
            {t("process.heading")}
          </h3>
          <p className="mt-3 max-w-3xl text-foreground">{t("process.lead")}</p>
          <p className="mt-3 max-w-3xl text-sm text-muted">{t("process.body")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SUBAGENTS.map((agent) => (
              <Tag key={agent}>
                <span className="text-accent">@</span>
                {agent}
              </Tag>
            ))}
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.2} className="mt-8">
        <Card>
          <h3 className="mb-4 font-mono text-sm uppercase tracking-wide text-accent">
            {t("decisions.heading")}
          </h3>
          <ShippedDecisions code={code} />
          <div className="mt-6 flex flex-wrap gap-2">
            {wispkin.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
