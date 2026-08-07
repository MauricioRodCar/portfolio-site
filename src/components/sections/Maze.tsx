import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { MazeVisualizer } from "@/components/maze/MazeVisualizer";

export function Maze() {
  const t = useTranslations("maze");

  return (
    <section
      id="puzzle"
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
        <MazeVisualizer />
      </Reveal>
    </section>
  );
}
