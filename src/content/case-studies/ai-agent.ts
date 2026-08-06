import type { CaseStudy } from "./types";

export const aiAgent: CaseStudy = {
  slug: "ai-agent",
  lang: "typescript",
  filename: "agent.ts",
  tags: ["TypeScript", "LLM", "Ollama", "Tool calling"],
  code: `
interface Tool {
  name: string;
  description: string;
  execute: (args: Record<string, unknown>) => string;
}

const tools: Tool[] = [
  {
    name: "get_weather",
    description: "Get the current weather for a city",
    execute: ({ city }) => \`\${city}: 22°C, clear skies\`,
  },
  {
    name: "convert_currency",
    description: "Convert an amount from one currency to another",
    execute: ({ amount, from, to }) =>
      \`\${amount} \${from} ≈ \${(Number(amount) * 1.08).toFixed(2)} \${to}\`,
  },
];

// The model never calls a function directly — it returns structured JSON
// naming a tool and its arguments. We parse that decision ourselves and
// decide whether to act on it, which is what keeps the model sandboxed.
interface ToolCall {
  tool: string;
  args: Record<string, unknown>;
}

function parseToolCall(modelOutput: string): ToolCall | null {
  try {
    const parsed = JSON.parse(modelOutput);
    if (typeof parsed.tool === "string") return parsed as ToolCall;
  } catch {
    // Not valid JSON — treat the output as a plain text reply instead.
  }
  return null;
}

export async function runAgentTurn(modelOutput: string): Promise<string> {
  const call = parseToolCall(modelOutput);

  // No tool call parsed: the model just answered in plain text.
  if (!call) return modelOutput;

  const tool = tools.find((t) => t.name === call.tool);
  if (!tool) return \`Error: no tool named "\${call.tool}"\`;

  return tool.execute(call.args);
}
`.trim(),
};
