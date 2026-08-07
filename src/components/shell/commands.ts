// Commands shown as suggestion chips, in display order. `help`, `clear`,
// and `exit`/`back` also work if typed but aren't chipped — they're meta
// commands rather than content, and `help` lists them in its own output.
export const CHIP_COMMANDS = [
  "whoami",
  "work",
  "stack",
  "playground",
  "puzzle",
  "audit",
  "contact",
  "resume",
  "help",
] as const;
