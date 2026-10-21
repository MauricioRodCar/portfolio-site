/**
 * Wispkin — a shipped product, not a case study. Unlike the "How I think"
 * snippets (rewritten from scratch because of NDAs), these are condensed
 * from the real source of a personal project: identifiers translated to
 * English and trimmed for length, logic unchanged.
 */

export const RELEASES_REPO = "https://github.com/MauricioRodCar/wispkin-releases";

export const wispkin = {
  version: "0.1.0-beta.2",
  platform: "Windows 10 / 11",
  links: {
    download: `${RELEASES_REPO}/releases/latest`,
    repo: RELEASES_REPO,
  },
  media: {
    image: {
      src: "/shipped/wispkin-desktop.png",
      width: 520,
      height: 440,
    },
    // Set once the demo recording exists (see TODO.md). When present, the
    // section shows the video and keeps the screenshot as its poster frame.
    video: null as { src: string; poster?: string } | null,
  },
  stats: [
    { key: "adrs", value: "12" },
    { key: "subagents", value: "8" },
    { key: "tests", value: "381" },
    { key: "qaChecks", value: "265" },
  ],
  tags: [
    "Electron",
    "TypeScript",
    "Claude Agent SDK",
    "Ollama",
    "Vitest",
    "GitHub Actions",
  ],
} as const;

export type ShippedDecisionKey = "providers" | "stateMachine" | "guardrails";

export interface ShippedSnippet {
  key: ShippedDecisionKey;
  filename: string;
  lang: string;
  code: string;
}

export const SHIPPED_SNIPPETS: ShippedSnippet[] = [
  {
    key: "providers",
    filename: "packages/brain/src/index.ts",
    lang: "typescript",
    code: `
// Every AI backend implements the same contract and emits the same
// AgentEvents. The avatar, the chat and the state machine never know
// who is answering — adding a provider touches one file, not the UI.
export interface BrainProvider {
  // Declares capabilities (tools? local? billed per use?) so the UI
  // shows or hides features instead of branching on provider ids.
  readonly info: ProviderInfo;
  check(ctx: ProviderContext): Promise<CheckResult>;
  listModels(ctx: ProviderContext): Promise<ModelList>;
  openConversation(opts: ConversationOptions): Conversation;
}

export interface Conversation {
  send(text: string): void;
  // Every permission request MUST be answered: closing the bubble or
  // interrupting resolves it as "deny". Nothing is ever left hanging.
  answerPermission(requestId: string, decision: PermissionDecision): void;
  interrupt(): Promise<void>;
  onEvent(listener: (event: AgentEvent) => void): () => void;
}

/** Decrypted API key: lives only in the main process memory. */
export interface ProviderContext {
  config: ProviderConfig;
  secret: string | null; // never logged, never sent to the renderer
}

export function createProviders(): Record<ProviderId, BrainProvider> {
  return {
    "claude-agent": createClaudeAgentProvider(), // Agent SDK, user's own key
    ollama: createOllamaProvider(), // local HTTP API: free, stays on-device
  };
}
`.trim(),
  },
  {
    key: "stateMachine",
    filename: "packages/core/src/machine.ts",
    lang: "typescript",
    code: `
// The avatar's mood is a pure function of events + time. \`now\` is a
// parameter, never Date.now(), so every state is unit-testable without
// fake timers or a running Electron window.
export function reduce(m: PetMachine, e: PetEvent, now: number): PetMachine {
  const s = { ...m, lastActivity: now };
  switch (e.type) {
    case "agent.turn.start":
      return s.turn === "none" ? { ...s, turn: "thinking" } : s;
    case "agent.tool.start":
      return { ...s, turn: "working", activeTools: addOnce(s.activeTools, e.toolUseId) };
    case "agent.tool.end": {
      const activeTools = s.activeTools.filter((id) => id !== e.toolUseId);
      return { ...s, activeTools, turn: activeTools.length > 0 ? "working" : "thinking" };
    }
    case "agent.permission.request":
      return { ...s, pendingPermissions: addOnce(s.pendingPermissions, e.requestId) };
    case "agent.turn.end":
      return { ...endTurn(s), ephemerals: flash(s.ephemerals, "success", now) };
    case "agent.error":
      return { ...endTurn(s), ephemerals: flash(s.ephemerals, "error", now) };
    // ...drag, click, chat open/close, Claude Code heartbeats
  }
}

// What gets drawn, highest priority first. A pending permission outranks
// everything but a drag: the user must never miss that the agent is
// waiting on them.
export function visibleState(m: PetMachine, now: number): PetState {
  if (m.dragging) return "dragged";
  if (m.pendingPermissions.length > 0) return "needs-permission";
  const top = topEphemeral(m, now);
  if (top === "error") return "error";
  if (m.turn !== "none") return m.turn;
  if (top !== null) return top;
  if (m.chatOpen) return "listening";
  if (!isBusy(m, now) && now >= m.lastActivity + m.config.sleepAfterMs) return "sleeping";
  return "idle";
}
`.trim(),
  },
  {
    key: "guardrails",
    filename: "packages/brain/src/providers/claude-agent/conversation.ts",
    lang: "typescript",
    code: `
// The agent can edit files and run commands — but only after a "yes".
const canUseTool: CanUseTool = (toolName, input, opts) => {
  if (closed) return Promise.resolve({ behavior: "deny", message: DENY_MESSAGE });
  const requestId = randomUUID();
  return new Promise<PermissionResult>((resolve) => {
    pending.set(requestId, {
      resolve,
      input,
      // "Always allow" is scoped to this session. Suggestions that would
      // write permanent rules into the user's settings are dropped.
      suggestions: sessionOnlyRules(opts.suggestions ?? []),
    });
    // The SDK has no timeout here: if the turn is aborted we answer
    // "deny" ourselves, so the promise can never leak.
    opts.signal.addEventListener("abort", () => resolvePermission(requestId, "deny"), {
      once: true,
    });
    // The preview escapes control/bidi characters and collapses long
    // whitespace runs, so a command can't hide what it really does.
    emit({ type: "agent.permission.request", requestId, toolName, ...permissionPreview(toolName, input) });
  });
};

// Daily spending cap, enforced twice: the chat bubble refuses to send,
// and the main process re-checks before forwarding to the agent — the
// renderer is never the only line of defense. Local models never block.
admit(event: UserEvent): boolean {
  if (event.type !== "user.message.send" || !engine.billable || !spending.capReached()) return true;
  spending.blocked(); // friendly notice: "raise the cap" or "continue tomorrow"
  return false;
}
`.trim(),
  },
];
