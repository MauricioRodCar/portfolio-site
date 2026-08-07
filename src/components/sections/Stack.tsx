import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { StackView } from "@/components/stack/StackView";

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
        <StackView />
      </Reveal>
    </section>
  );
}
