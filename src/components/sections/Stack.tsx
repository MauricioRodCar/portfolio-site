import { useTranslations } from "next-intl";
import { Tag } from "@/components/ui/Tag";
import { Reveal } from "@/components/ui/Reveal";

const primaryGroups = [
  {
    key: "iterationSpeed",
    tools: ["React", "TypeScript", "Styled Components"],
  },
  {
    key: "projectGrows",
    tools: ["Node.js", "Express", "NestJS", "MongoDB"],
  },
] as const;

const secondaryGroups = [
  {
    key: "frontend",
    tools: [
      "JavaScript",
      "HTML",
      "CSS",
      "Sass/Less/Scss",
      "jQuery",
      "Angular",
      "Redux",
      "GraphQL",
    ],
  },
  {
    key: "backend",
    tools: ["PHP", "WordPress", "Wagtail", "Python", "Java", "SQL"],
  },
  {
    key: "cloud",
    tools: ["Git", "GitHub", "GitLab", "Bitbucket", "AWS", "GCP", "PM2", "Keycloak"],
  },
  {
    key: "tooling",
    tools: ["Webpack", "npm", "Jest", "Enzyme", "React Testing Library", "SEO"],
  },
] as const;

export function Stack() {
  const t = useTranslations("stack");

  return (
    <section
      id="stack"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-24"
    >
      <Reveal>
        <h2 className="font-mono text-sm uppercase tracking-wide text-accent">
          {t("heading")}
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-8">
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
      </Reveal>

      <Reveal delay={0.2} className="mt-8">
        <p className="text-sm font-semibold text-foreground">
          {t("alsoTitle")}
        </p>
        <p className="mt-1 max-w-2xl text-sm text-muted">{t("alsoIntro")}</p>
        <div className="mt-4 flex flex-col gap-3">
          {secondaryGroups.map((group) => (
            <div key={group.key}>
              <p className="font-mono text-xs uppercase tracking-wide text-muted">
                {t(`secondaryGroups.${group.key}`)}
              </p>
              <p className="mt-1 text-sm text-muted">
                {group.tools.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
