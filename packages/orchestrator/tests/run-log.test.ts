import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { makeRunLog, writeRunLog } from "../src/telemetry/run-log.js";
import type { RoutingMetadata, WorkerRequest, WorkerResult } from "../src/types.js";

const request: WorkerRequest = {
  prompt: "Sensitive prompt text must not be logged",
  cwd: "/workspace/project",
  role: "reviewer",
  model: "gpt-5.6-terra",
  effort: "high",
  readOnly: true,
};
const result: WorkerResult = {
  provider: "codex",
  model: request.model,
  requestedEffort: request.effort,
  effectiveEffort: "high",
  output: "Sensitive output text must not be logged",
  success: true,
  durationMs: 12,
};
const routing: RoutingMetadata = {
  profile: { role: "reviewer", complexity: "difficult", risk: "high", preferLocal: false, requireLocal: false, privacySensitive: false, diversity: "none", requiresTools: false },
  selectedModel: "codex-terra",
  selection: { selected: "codex-terra", score: 10, reasons: ["reviewer role score=10"], rejected: {} },
  requestedEffort: "high",
  effectiveEffort: "high",
};
const directories: string[] = [];

afterEach(async () => {
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("run logging", () => {
  it("keeps prompts and outputs out of metadata", () => {
    const log = makeRunLog(request, result, "2026-01-01T00:00:00.000Z", routing);
    expect(log).not.toHaveProperty("prompt");
    expect(log).not.toHaveProperty("output");
    expect(log.routing?.selectedModel).toBe("codex-terra");
  });

  it("writes a JSON metadata record", async () => {
    const root = await mkdtemp(join(tmpdir(), "dtr-test-"));
    directories.push(root);
    const path = await writeRunLog(root, request, result);
    const content = await readFile(path, "utf8");
    expect(JSON.parse(content)).toMatchObject({ provider: "codex", readOnly: true, success: true });
    expect(content).not.toContain(request.prompt);
    expect(content).not.toContain(result.output);
  });
});
