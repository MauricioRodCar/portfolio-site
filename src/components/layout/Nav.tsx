import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";

export function Nav() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-4 sm:gap-3 sm:px-6">
        <a
          href="#"
          className="block min-w-0 flex-1 truncate rounded font-mono text-[11px] text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:flex-none sm:text-sm"
        >
          <span className="text-accent">&gt;</span> mauriciorodriguez.dev
        </a>
        <div className="flex shrink-0 items-center gap-2 sm:gap-6">
          {/* Section links hide below md: on narrow viewports there isn't
              room for them without forcing horizontal page scroll, and the
              single-page layout is still fully reachable by scrolling. */}
          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#work"
              className="rounded font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("work")}
            </a>
            <a
              href="#playground"
              className="rounded font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("playground")}
            </a>
            <a
              href="#stack"
              className="rounded font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("stack")}
            </a>
            <a
              href="#audit"
              className="rounded font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("audit")}
            </a>
          </div>
          <LocaleSwitcher />
          <Button
            href="#contact"
            variant="outline"
            className="px-2.5 py-1.5 text-[11px] sm:px-3 sm:text-xs"
          >
            {t("contact")}
          </Button>
        </div>
      </nav>
    </header>
  );
}
