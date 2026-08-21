export const MAX_TASK_INPUT_CHARS = 6_000;
export const MAX_TASK_RESULT_CHARS = 4_800;

export function compactTaskPrompt(prompt: string): string {
  const normalized = prompt.trim();
  if (!normalized) throw new Error("Task prompt must not be empty");
  if (normalized.length > MAX_TASK_INPUT_CHARS) throw new Error(`Task prompt exceeds the ${MAX_TASK_INPUT_CHARS}-character bound; reduce it to the required paths, symbols, and evidence.`);
  return `${normalized}\n\nReturn a compact task result: conclusion, changed paths or evidence, checks run, and unresolved risks. Do not include transcripts or unrelated context.`;
}

export function truncateTaskResult(value: string): string {
  return value.length <= MAX_TASK_RESULT_CHARS ? value : `${value.slice(0, MAX_TASK_RESULT_CHARS)}\n[Result truncated by Dynamic Task Router]`;
}
