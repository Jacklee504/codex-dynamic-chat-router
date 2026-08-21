import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import type { RunState } from "../types.js";

export interface RunRecord {
  id: string;
  state: RunState;
  strategy: "pipeline" | "single" | "fanout";
  template?: string;
  startedAt: string;
  endedAt?: string;
  stages: Array<{ id: string; state: RunState; model?: string; error?: string; changedPaths?: string[]; checks?: Array<{ command: string; success: boolean }> }>;
  error?: string;
  outcome?: { status: "accepted" | "rejected" | "partial" | "escalated"; reviewFindingsCount?: number; regressionDetected?: boolean; manualScore?: number };
}

export async function createRunRecord(root: string, strategy: RunRecord["strategy"], template?: string): Promise<RunRecord> {
  const record: RunRecord = { id: randomUUID(), state: "queued", strategy, ...(template ? { template } : {}), startedAt: new Date().toISOString(), stages: [] };
  await writeRunRecord(root, record);
  return record;
}

export async function writeRunRecord(root: string, record: RunRecord): Promise<void> {
  const directory = resolve(root, ".dtr", "runs");
  await mkdir(directory, { recursive: true });
  await writeFile(resolve(directory, `${record.id}.status.json`), `${JSON.stringify(record, null, 2)}\n`, "utf8");
}

export async function readRunRecord(root: string, runId: string): Promise<RunRecord> {
  if (!/^[a-f0-9-]{36}$/i.test(runId)) throw new Error("Invalid run ID");
  return JSON.parse(await readFile(resolve(root, ".dtr", "runs", `${runId}.status.json`), "utf8")) as RunRecord;
}

export async function attachRunOutcome(root: string, runId: string, outcome: NonNullable<RunRecord["outcome"]>): Promise<RunRecord> {
  const record = await readRunRecord(root, runId); record.outcome = outcome; await writeRunRecord(root, record); return record;
}
