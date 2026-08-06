import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/Reveal";
import { LazyMount } from "@/components/ui/LazyMount";
import { PlaygroundLoader } from "@/components/playground/PlaygroundLoader";

export function Playground() {
  const t = useTranslations("playground");

  return (
    <section
      id="playground"
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

      <div className="mt-8">
        <LazyMount
          placeholder={
            <div className="flex h-80 items-center justify-center rounded-lg border border-border font-mono text-sm text-muted">
              {t("loading")}
            </div>
          }
        >
          <PlaygroundLoader />
        </LazyMount>
      </div>
    </section>
  );
}
