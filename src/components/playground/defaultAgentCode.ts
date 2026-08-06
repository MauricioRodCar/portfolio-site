// Simplified, plain-JS version of the tool-calling pattern from the
// "Local AI agent with Ollama" case study — trimmed of TypeScript types so
// it can run directly in the browser without a build step.
export const DEFAULT_AGENT_CODE = `const tools = [
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
// naming a tool and its arguments. We parse that decision ourselves.
function parseToolCall(modelOutput) {
  try {
    const parsed = JSON.parse(modelOutput);
    if (typeof parsed.tool === "string") return parsed;
  } catch {
    // Not valid JSON — treat the output as a plain text reply instead.
  }
  return null;
}

function runAgentTurn(modelOutput) {
  const call = parseToolCall(modelOutput);

  // No tool call parsed: the model just answered in plain text.
  if (!call) return modelOutput;

  const tool = tools.find((t) => t.name === call.tool);
  if (!tool) return \`Error: no tool named "\${call.tool}"\`;

  return tool.execute(call.args);
}`;

export const DEFAULT_MODEL_OUTPUT = `{"tool": "get_weather", "args": {"city": "Tokyo"}}`;
