"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { EMAIL, LINKEDIN_URL, RESUME_URL } from "@/content/contact";
import { primaryGroups } from "@/components/stack/data";
import { auditResults } from "@/content/audit";
import { CHIP_COMMANDS } from "./commands";

interface HistoryEntry {
  id: number;
  command?: string;
  output: ReactNode;
}

function JumpLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-1 block text-accent underline underline-offset-2 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {label}
    </button>
  );
}

export function ShellPanel({ onClose }: { onClose: () => void }) {
  const t = useTranslations("shell");
  const tAudit = useTranslations("audit");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [welcomeTyped, setWelcomeTyped] = useState("");
  const [welcomeDone, setWelcomeDone] = useState(false);
  const idCounter = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);
  const welcomeFullRef = useRef(t("welcomeOutput"));

  useEffect(() => {
    const full = welcomeFullRef.current;
    let i = 0;
    const interval = window.setInterval(() => {
      i++;
      setWelcomeTyped(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(interval);
        setWelcomeDone(true);
      }
    }, 16);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ block: "end" });
  }, [history]);

  function jump(sectionId: string) {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "auto", block: "start" });
    onClose();
  }

  function pushEntry(command: string, output: ReactNode) {
    setHistory((prev) => [
      ...prev,
      { id: idCounter.current++, command, output },
    ]);
  }

  function buildOutput(rawCommand: string): ReactNode {
    const command = rawCommand.trim().toLowerCase();

    switch (command) {
      case "help":
        return (
          <div>
            <p>{t("commands.help.output")}</p>
            <p className="mt-1 text-foreground">
              {[...CHIP_COMMANDS, "clear", "exit"].join(" · ")}
            </p>
          </div>
        );
      case "whoami":
        return <p>{t("commands.whoami.output")}</p>;
      case "work":
        return (
          <div>
            <p>{t("commands.work.output")}</p>
            <JumpLink label={t("jumpCta")} onClick={() => jump("work")} />
          </div>
        );
      case "stack": {
        const tools = primaryGroups.flatMap((g) => g.tools).join(" · ");
        return (
          <div>
            <p>{t("commands.stack.output")}</p>
            <p className="mt-1 text-foreground">{tools}</p>
            <JumpLink label={t("jumpCta")} onClick={() => jump("stack")} />
          </div>
        );
      }
      case "playground":
        return (
          <div>
            <p>{t("commands.playground.output")}</p>
            <JumpLink
              label={t("jumpCta")}
              onClick={() => jump("playground")}
            />
          </div>
        );
      case "puzzle":
        return (
          <div>
            <p>{t("commands.puzzle.output")}</p>
            <JumpLink label={t("jumpCta")} onClick={() => jump("puzzle")} />
          </div>
        );
      case "audit":
        return (
          <div>
            <p>{t("commands.audit.output")}</p>
            <div className="mt-1 text-foreground">
              {auditResults.map((r) => (
                <p key={r.key}>
                  {tAudit(`categories.${r.key}`)}:{" "}
                  <span className="text-accent">{r.desktop}/100</span>{" "}
                  desktop · <span className="text-accent">{r.mobile}/100</span>{" "}
                  mobile
                </p>
              ))}
            </div>
            <JumpLink label={t("jumpCta")} onClick={() => jump("audit")} />
          </div>
        );
      case "contact":
        return (
          <div>
            <p>
              <a
                href={`mailto:${EMAIL}`}
                className="text-accent underline underline-offset-2"
              >
                {EMAIL}
              </a>
            </p>
            <p>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-2"
              >
                {LINKEDIN_URL}
              </a>
            </p>
            <JumpLink label={t("jumpCta")} onClick={() => jump("contact")} />
          </div>
        );
      case "resume":
      case "cv":
        return (
          <p>
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2"
            >
              {RESUME_URL}
            </a>
          </p>
        );
      case "sudo hire me":
        return (
          <p>
            {t("commands.sudoHireMe.output")}{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-accent underline underline-offset-2"
            >
              {EMAIL}
            </a>
          </p>
        );
      default:
        return <p>{t("commandNotFound", { command: rawCommand.trim() })}</p>;
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) return;
    setInput("");

    const lower = raw.toLowerCase();
    if (lower === "clear") {
      setHistory([]);
      return;
    }
    if (lower === "exit" || lower === "back") {
      onClose();
      return;
    }
    pushEntry(raw, buildOutput(raw));
  }

  function runChip(command: string) {
    pushEntry(command, buildOutput(command));
    inputRef.current?.focus();
  }

  return (
    <div className="flex h-full flex-col font-mono text-sm">
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-6">
        <p className="text-muted">
          <span className="text-accent">$</span> whoami
        </p>
        <p className="text-foreground">
          {welcomeTyped}
          <span className="animate-blink ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-accent align-middle" />
        </p>
        {welcomeDone && (
          <p className="mt-1 text-muted">{t("welcomeHint")}</p>
        )}

        <div className="mt-4 flex flex-col gap-3">
          {history.map((entry) => (
            <div key={entry.id}>
              <p className="text-muted">
                <span className="text-accent">$</span> {entry.command}
              </p>
              <div className="text-muted">{entry.output}</div>
            </div>
          ))}
        </div>
        <div ref={historyEndRef} />
      </div>

      <div className="border-t border-border p-4 sm:px-8">
        <div className="mb-3 flex flex-wrap gap-2">
          {CHIP_COMMANDS.map((cmd) => (
            <button
              key={cmd}
              onClick={() => runChip(cmd)}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {cmd}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-accent">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("inputPlaceholder")}
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent text-foreground outline-none placeholder:text-muted"
          />
        </form>
      </div>
    </div>
  );
}
