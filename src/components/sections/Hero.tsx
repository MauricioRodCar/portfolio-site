import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="mb-6 font-mono text-sm text-muted">
        <span className="text-accent">$</span> whoami
        <span className="animate-blink ml-1 inline-block h-4 w-[2px] translate-y-0.5 bg-accent align-middle" />
      </p>
      <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-foreground sm:text-5xl">
        {t.rich("headline", {
          accent: (chunks) => <span className="text-accent">{chunks}</span>,
        })}
      </h1>
    </section>
  );
}
