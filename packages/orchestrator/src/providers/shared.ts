import type { Command, ProcessRunner, WorkerRequest, WorkerResult } from "../types.js";
import { truncateTaskResult } from "../contracts.js";

export async function commandAvailable(runner: ProcessRunner, command: string, cwd = process.cwd()): Promise<boolean> {
  const result = await runner.run({ command, args: ["--version"] }, { cwd, timeoutMs: 5_000 });
  return result.exitCode === 0;
}

const macosCodexBinaries = ["/Applications/ChatGPT.app/Contents/Resources/codex", "/Applications/Codex.app/Contents/Resources/codex"];

export function codexCommandCandidates(): string[] {
  const configured = process.env.DTR_CODEX_COMMAND?.trim();
  return [...new Set([configured, "codex", ...(process.platform === "darwin" ? macosCodexBinaries : [])].filter((value): value is string => Boolean(value)))];
}

export async function resolveCodexCommand(runner: ProcessRunner, cwd: string, candidates = codexCommandCandidates(), requireLogin = false): Promise<string | undefined> {
  for (const command of candidates) {
    if (!(await commandAvailable(runner, command, cwd))) continue;
    if (!requireLogin) return command;
    const login = await runner.run({ command, args: ["login", "status"] }, { cwd, timeoutMs: 5_000 });
    if (login.exitCode === 0) return command;
  }
  return undefined;
}

export function resultFromProcess(
  provider: WorkerResult["provider"],
  request: WorkerRequest,
  startedAt: number,
  process: { stdout: string; stderr: string; exitCode: number | null; timedOut: boolean; error?: string },
): WorkerResult {
  const error = process.timedOut
    ? "Worker timed out"
    : process.error ?? (process.exitCode === 0 ? undefined : process.stderr.trim() || `Process exited with ${process.exitCode}`);
  return {
    provider,
    model: request.model,
    requestedEffort: request.effort,
    effectiveEffort: request.effort,
    output: truncateTaskResult(process.stdout),
    success: !error,
    durationMs: Date.now() - startedAt,
    ...(error ? { error } : {}),
  };
}

export function ensureReadOnly(request: WorkerRequest): void {
  if (!request.readOnly) {
    throw new Error("Phase 1 supports read-only workers only");
  }
}

export function helpCommand(command: string): Command {
  return { command, args: ["--help"] };
}
