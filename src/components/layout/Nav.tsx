import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { LocaleSwitcher } from "@/components/ui/LocaleSwitcher";

export function Nav() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="rounded font-mono text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="text-accent">&gt;</span> mauricio.dev
        </a>
        <div className="flex items-center gap-4 sm:gap-6">
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
          <Button href="#contact" variant="outline" className="px-3 py-1.5">
            {t("contact")}
          </Button>
        </div>
      </nav>
    </header>
  );
}
