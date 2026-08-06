import { useTranslations } from "next-intl";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";

const stackGroups = [
  {
    key: "iterationSpeed",
    tools: ["React", "TypeScript", "Tailwind CSS"],
  },
  {
    key: "projectGrows",
    tools: ["Node.js", "Express", "NestJS", "PostgreSQL"],
  },
] as const;

export function Stack() {
  const t = useTranslations("stack");

  return (
    <section id="stack" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-24">
      <Reveal>
        <h2 className="font-mono text-sm uppercase tracking-wide text-accent">
          {t("heading")}
        </h2>
      </Reveal>

      <div className="mt-8 flex flex-col gap-8">
        {stackGroups.map((group, i) => (
          <Reveal key={group.key} delay={i * 0.1}>
            <p className="mb-3 text-foreground">{t(`groups.${group.key}`)}:</p>
            <div className="flex flex-wrap gap-2">
              {group.tools.map((tool) => (
                <Tag key={tool}>{tool}</Tag>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
