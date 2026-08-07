"use client";

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useTranslations } from "next-intl";
import { runAgentCode, type AgentRunResult } from "./runAgentCode";
import { DEFAULT_AGENT_CODE, DEFAULT_MODEL_OUTPUT } from "./defaultAgentCode";

export function AgentPlayground() {
  const t = useTranslations("playground");
  const [code, setCode] = useState(DEFAULT_AGENT_CODE);
  const [modelOutput, setModelOutput] = useState(DEFAULT_MODEL_OUTPUT);
  const [result, setResult] = useState<AgentRunResult | null>(null);

  function handleRun() {
    setResult(runAgentCode(code, modelOutput));
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border bg-foreground/[0.03] px-4 py-2 font-mono text-xs text-muted">
        agent.js
      </div>
      <div className="min-w-0 overflow-x-auto">
        <CodeMirror
          value={code}
          onChange={setCode}
          theme="dark"
          height="320px"
          extensions={[javascript()]}
          basicSetup={{ foldGutter: false }}
          className="text-sm"
        />
      </div>
      <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-end">
        <label className="flex-1 font-mono text-xs text-muted">
          {t("modelOutputLabel")}
          <input
            value={modelOutput}
            onChange={(e) => setModelOutput(e.target.value)}
            spellCheck={false}
            className="mt-1 w-full rounded-md border border-border bg-transparent px-3 py-2 font-mono text-sm text-foreground focus:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          />
        </label>
        <button
          onClick={handleRun}
          className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 font-mono text-xs uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("runCta")}
        </button>
      </div>
      {result && (
        <div className="border-t border-border p-4 font-mono text-sm">
          {result.error ? (
            <p className="text-red-400">
              {t("errorPrefix")} {result.error}
            </p>
          ) : (
            <p className="text-foreground">
              <span className="text-accent">$ </span>
              {result.output}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
