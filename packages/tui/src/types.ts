import type { DtrApplication, DtrEvent, ModelView, ProviderView } from "@dynamic-task-router/orchestrator";
import type { Effort, ProviderId } from "@dynamic-task-router/orchestrator";

export type ScreenId = "dashboard" | "runs" | "run-detail" | "models" | "providers" | "config" | "help" | "usage" | "context";
export type Overrides = { provider?: ProviderId | undefined; modelId?: string | undefined; effort?: Effort | undefined; mode?: "auto" | "single" | "fanout" | "pipeline" | undefined };
export type ActiveRun = { id: string; task: string; state: string; model?: string; provider?: string; effort?: string; latest?: string; startedAt: string };
export type TuiSnapshot = { providers: ProviderView[]; models: ModelView[]; activeRuns: Record<string, ActiveRun>; events: DtrEvent[]; screen: ScreenId; selectedRunId?: string; message?: string; overrides: Overrides };
export type CommandContext = { application: DtrApplication; cwd: string; overrides: Overrides; activeRunId?: string | undefined };
export type CommandResult = { screen?: ScreenId | undefined; message?: string | undefined; overrides?: Overrides | undefined; runId?: string | undefined; selectedRunId?: string | undefined; clear?: boolean | undefined };
