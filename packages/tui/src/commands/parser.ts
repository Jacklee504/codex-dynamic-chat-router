export type ParsedInput = { kind: "task"; task: string } | { kind: "command"; name: string; args: string[] } | { kind: "empty" };

export function parseInput(value: string): ParsedInput {
  const trimmed = value.trim();
  if (!trimmed) return { kind: "empty" };
  if (!trimmed.startsWith("/")) return { kind: "task", task: trimmed };
  const tokens = tokenize(trimmed.slice(1));
  return tokens.length ? { kind: "command", name: tokens[0]!.toLowerCase(), args: tokens.slice(1) } : { kind: "empty" };
}

export function tokenize(value: string): string[] {
  const tokens: string[] = []; let token = ""; let quote: string | undefined; let escaped = false;
  for (const character of value) {
    if (escaped) { token += character; escaped = false; continue; }
    if (character === "\\") { escaped = true; continue; }
    if (quote) { if (character === quote) quote = undefined; else token += character; continue; }
    if (character === '"' || character === "'") { quote = character; continue; }
    if (/\s/.test(character)) { if (token) { tokens.push(token); token = ""; } continue; }
    token += character;
  }
  if (token) tokens.push(token);
  return tokens;
}
