export interface AgentRunResult {
  output?: string;
  error?: string;
}

/**
 * Executes the (possibly user-edited) agent orchestration code against a
 * simulated model output, entirely in the visitor's own browser tab — no
 * network call, no real Ollama instance. `code` must define a
 * `runAgentTurn(modelOutput)` function; we call it and capture the result.
 */
export function runAgentCode(code: string, modelOutput: string): AgentRunResult {
  try {
    const fn = new Function(
      "modelOutput",
      `${code}\nreturn runAgentTurn(modelOutput);`
    );
    const result = fn(modelOutput);
    return { output: typeof result === "string" ? result : JSON.stringify(result) };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err) };
  }
}
