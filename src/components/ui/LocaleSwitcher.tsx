"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const locales = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
] as const;

export function LocaleSwitcher() {
  const pathname = usePathname();
  const activeLocale = useLocale();

  return (
    <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-wide">
      {locales.map(({ code, label }, i) => (
        <span key={code} className="flex items-center gap-1">
          {i > 0 && <span className="text-border">/</span>}
          <Link
            href={pathname}
            locale={code}
            className={
              code === activeLocale
                ? "text-accent"
                : "text-muted transition-colors hover:text-accent"
            }
          >
            {label}
          </Link>
        </span>
      ))}
    </div>
  );
}
