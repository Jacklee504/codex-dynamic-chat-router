import { render } from "ink";
import { DtrApplication } from "@dynamic-task-router/orchestrator";
import { App } from "./app.js";
import { enterAlternateScreen } from "./terminal/alternate-screen.js";
import { registerCleanup } from "./terminal/cleanup.js";

export async function runTui(options: { configDir: string; cwd?: string }): Promise<void> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error("DTR TUI requires an interactive terminal.");
  const restore = enterAlternateScreen(); const unregister = registerCleanup(restore); const app = render(<App application={new DtrApplication(options.configDir, options.cwd)} cwd={options.cwd ?? process.cwd()}/>, { exitOnCtrlC: false });
  try { await app.waitUntilExit(); } finally { unregister(); restore(); }
}
