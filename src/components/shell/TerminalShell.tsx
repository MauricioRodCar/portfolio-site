"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

// Loaded only once the visitor actually opens the shell — the command
// logic and history UI cost nothing until then.
const ShellPanel = dynamic(
  () => import("./ShellPanel").then((mod) => mod.ShellPanel),
  { ssr: false }
);

const HINT_STORAGE_KEY = "terminalHintSeen";

export function TerminalShell() {
  const t = useTranslations("shell");
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let seen = true;
    try {
      seen = Boolean(window.localStorage.getItem(HINT_STORAGE_KEY));
    } catch {
      // Storage blocked (private mode, etc.) — just skip the hint.
      return;
    }
    if (seen) return;

    const showTimer = window.setTimeout(() => setShowHint(true), 2000);
    const hideTimer = window.setTimeout(() => {
      setShowHint(false);
      try {
        window.localStorage.setItem(HINT_STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    }, 7000);

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key !== "Tab") return;

      const container = overlayRef.current;
      if (!container) return;
      const focusables = container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function handleOpen() {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    setShowHint(false);
    try {
      window.localStorage.setItem(HINT_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setHasOpenedOnce(true);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        {/* Soft pulsing halo — the button previously blended into the dark
            background (muted border, small footprint on wide desktop
            viewports); this plus the accent border give it enough visual
            weight to notice without any motion louder than the cursor
            blink already used elsewhere. */}
        <span
          aria-hidden="true"
          className="motion-reduce:animate-none pointer-events-none absolute inset-0 -z-10 animate-pulse rounded-md bg-accent/40 blur-md"
        />
        <button
          ref={buttonRef}
          onClick={handleOpen}
          aria-label={t("openLabel")}
          className="relative flex items-center gap-2 rounded-md border border-accent/70 bg-background px-3 py-2 font-mono text-sm text-foreground shadow-lg backdrop-blur transition-colors hover:border-accent hover:bg-foreground/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:gap-2.5 sm:px-4 sm:py-2.5 sm:text-base"
        >
          <span className="text-accent">&gt;</span>
          <span className="animate-blink inline-block h-4 w-[2px] bg-accent sm:h-5" />
          <span className="hidden font-mono text-xs uppercase tracking-wide text-muted sm:inline">
            {t("buttonLabel")}
          </span>
        </button>
      </div>

      {showHint && (
        <div className="fixed bottom-20 right-6 z-40 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-muted shadow-lg">
          {t("hintText")}
        </div>
      )}

      <div
        ref={overlayRef}
        role="dialog"
        aria-modal={isOpen}
        aria-hidden={!isOpen}
        aria-label={t("openLabel")}
        className="motion-reduce:transition-none fixed inset-0 z-50 bg-background transition-[clip-path] duration-300 ease-out"
        style={{
          clipPath: `circle(${isOpen ? 150 : 0}% at ${origin.x}px ${origin.y}px)`,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {isOpen && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 rounded font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {t("closeLabel")}{" "}
            <span className="text-muted/70">({t("closeHint")})</span>
          </button>
        )}
        {hasOpenedOnce && <ShellPanel onClose={handleClose} />}
      </div>
    </>
  );
}
