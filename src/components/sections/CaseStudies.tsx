import { useTranslations } from "next-intl";
import { caseStudies } from "@/content/case-studies";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Reveal } from "@/components/ui/Reveal";

export function CaseStudies() {
  const t = useTranslations("caseStudies");

  return (
    <section id="work" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-24">
      <Reveal>
        <h2 className="font-mono text-sm uppercase tracking-wide text-accent">
          {t("heading")}
        </h2>
        <p className="mt-2 max-w-2xl text-2xl font-semibold text-foreground sm:text-3xl">
          {t("subheading")}
        </p>
      </Reveal>

      <div className="mt-12 flex flex-col gap-16">
        {caseStudies.map((study, i) => (
          <Reveal key={study.slug} delay={i * 0.1}>
            <Card className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {t(`${study.slug}.title`)}
                </h3>
                <p className="text-sm text-muted">
                  {t(`${study.slug}.context`)}
                </p>
                <p className="text-sm text-foreground">
                  {t(`${study.slug}.proseIntro`)}
                </p>
                <p className="text-sm text-muted">
                  <span className="text-accent">{t("decisionLabel")} </span>
                  {t(`${study.slug}.decision`)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {study.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
              <CodeBlock
                code={study.code}
                lang={study.lang}
                filename={study.filename}
              />
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
