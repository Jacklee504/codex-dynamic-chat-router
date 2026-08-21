#!/usr/bin/env node
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";
import { realpathSync } from "node:fs";

import { findModel, loadConfig, repositoryRootFromConfig } from "./config.js";
import { compactTaskPrompt } from "./contracts.js";
import { NodeProcessRunner } from "./process.js";
import { createProviders } from "./providers/index.js";
import { OllamaProvider } from "./providers/ollama.js";
import { readOpenRouterCatalog, refreshOpenRouterCatalog } from "./providers/openrouter.js";
import { classifyTask, diversityFromFamilies } from "./routing/classifier.js";
import { selectEffort } from "./routing/effort.js";
import { explainSelection } from "./routing/explain.js";
import { modelAvailability } from "./routing/runtime.js";
import { estimateCost, selectModel } from "./routing/selector.js";
import { runFanout } from "./strategies/fanout.js";
import { runPipeline } from "./strategies/pipeline.js";
import { runSingle } from "./strategies/single.js";
import { writeRunLog } from "./telemetry/run-log.js";
import { readRunRecord } from "./telemetry/run-registry.js";
import { attachRunOutcome } from "./telemetry/run-registry.js";
import { evaluateDirectory } from "./evals.js";
import { summarizeRuns } from "./stats.js";
import type { Complexity, ContextRequirement, DiversityLevel, Effort, RiskLevel, TaskProfile, WorkerRequest, WorkerRole } from "./types.js";

type Flags = Record<string, string | boolean>;
const roles: WorkerRole[] = ["architect", "implementer", "debugger", "reviewer", "researcher", "test", "log-analysis"];
const complexities: Complexity[] = ["trivial", "normal", "difficult", "extreme"];
const risks: RiskLevel[] = ["low", "medium", "high"];
const diversities: DiversityLevel[] = ["none", "low", "medium", "high"];
const contexts: ContextRequirement[] = ["small", "medium", "large", "huge"];

export async function main(argv: string[]): Promise<number> {
  const [command, ...rest] = argv;
  const flags = parseFlags(rest);
  const configDir = typeof flags["config-dir"] === "string" ? resolve(flags["config-dir"]) : resolve(dirname(fileURLToPath(import.meta.url)), "../../../config");
  try {
    if (!command || command === "tui") {
      if (!process.stdin.isTTY || !process.stdout.isTTY) { printUsage(); return 1; }
      const { runTui } = await import("@dynamic-task-router/tui");
      await runTui({ configDir, cwd: cwdFrom(flags) });
      return 0;
    }
    const config = await loadConfig(configDir);
    const providers = createProviders(new NodeProcessRunner());
    if (command === "health") return reportHealth(config.models, providers);
    if (command === "models") return flags.refresh ? refreshModels(configDir) : reportModels(config, providers);
    if (command === "run") return runExplicit(configDir, flags, config, providers);
    if (command === "select") return selectOnly(flags, config, providers);
    if (command === "route") return route(configDir, flags, config, providers);
    if (command === "fanout") return fanout(configDir, flags, config, providers);
    if (command === "pipeline") return pipeline(flags, config, providers);
    if (command === "status") return status(flags);
    if (command === "evaluate") return evaluate(configDir, config);
    if (command === "stats") return stats(flags);
    if (command === "outcome") return outcome(flags);
    printUsage(); return 1;
  } catch (error) {
    console.error(`dtr: ${error instanceof Error ? error.message : String(error)}`); return 1;
  }
}

async function reportHealth(models: Awaited<ReturnType<typeof loadConfig>>["models"], providers: ReturnType<typeof createProviders>): Promise<number> {
  for (const [id, provider] of Object.entries(providers)) console.log(`${id}: ${(await provider.health()) ? "available" : "unavailable"}`);
  const ollama = providers.ollama as OllamaProvider;
  for (const model of models.filter((item) => item.provider === "ollama" && item.enabled)) console.log(`ollama model ${model.model}: ${(await ollama.isModelAvailable(model.model)) ? "installed" : "not installed"}`);
  return 0;
}

async function reportModels(config: Awaited<ReturnType<typeof loadConfig>>, providers: ReturnType<typeof createProviders>): Promise<number> {
  const availability = await modelAvailability(config, providers);
  for (const model of config.models) console.log(`${model.id}\t${model.provider}\t${model.family}\t${model.model}\t${model.enabled ? "enabled" : "disabled"}\t${availability[model.id] ? "available" : "unavailable"}`);
  return 0;
}

async function refreshModels(configDir: string): Promise<number> {
  const root = repositoryRootFromConfig(configDir);
  try {
    const cache = await refreshOpenRouterCatalog(root);
    console.log(JSON.stringify({ refreshed: true, fetchedAt: cache.fetchedAt, models: cache.models.length }, null, 2));
    return 0;
  } catch (error) {
    const cached = await readOpenRouterCatalog(root);
    console.error(`dtr: ${error instanceof Error ? error.message : String(error)}`);
    if (!cached.cache) return 1;
    console.log(JSON.stringify({ refreshed: false, stale: cached.stale, fetchedAt: cached.cache.fetchedAt, models: cached.cache.models.length }, null, 2));
    return 0;
  }
}

async function runExplicit(configDir: string, flags: Flags, config: Awaited<ReturnType<typeof loadConfig>>, providers: ReturnType<typeof createProviders>): Promise<number> {
  const providerId = requiredFlag(flags, "provider"); const modelIdentifier = requiredFlag(flags, "model"); const role = enumFlag(flags, "role", roles); const prompt = requiredFlag(flags, "prompt");
  const model = findModel(config, modelIdentifier);
  if (!model) throw new Error(`Configured, enabled model not found: ${modelIdentifier}`);
  if (model.provider !== providerId) throw new Error(`Model '${model.id}' belongs to '${model.provider}', not '${providerId}'`);
  if (model.roles[role] === 0) throw new Error(`Role '${role}' is not allowed for '${model.id}'`);
  const profile = profileFrom(flags, prompt);
  if ((profile.requireLocal || profile.allowRemote === false || profile.privacySensitive) && !model.local) throw new Error(`Model '${model.id}' is remote but this task requires local execution`);
  if (profile.privateCode && !model.privacy.privateCodeAllowed) throw new Error(`Model '${model.id}' is not approved for private code`);
  if (config.policy.budget.mode === "capped" && estimateCost(model) > config.policy.budget.max_estimated_cost_usd) throw new Error(`Model '${model.id}' exceeds the configured cost cap`);
  const effort = (typeof flags.effort === "string" ? flags.effort : model.defaultEffort) as Effort;
  if (!model.efforts.includes(effort)) throw new Error(`Effort '${effort}' is not allowed for '${model.id}'`);
  const request: WorkerRequest = { prompt: compactTaskPrompt(prompt), cwd: cwdFrom(flags), role, model: model.model, effort, readOnly: true, timeoutMs: config.policy.defaults.timeoutMs };
  const provider = providers[model.provider];
  if (!provider) throw new Error(`Provider '${model.provider}' is not implemented`);
  const result = await provider.run(request); const logPath = await writeRunLog(repositoryRootFromConfig(configDir), request, result);
  printResult(result.output, result.error, logPath); return result.success ? 0 : 1;
}

async function selectOnly(flags: Flags, config: Awaited<ReturnType<typeof loadConfig>>, providers: ReturnType<typeof createProviders>): Promise<number> {
  const prompt = typeof flags.prompt === "string" ? flags.prompt : ""; const profile = profileFrom(flags, prompt); const selection = selectModel(config, profile, await modelAvailability(config, providers));
  if (!selection) { console.log(JSON.stringify(explainSelection(profile, undefined), null, 2)); return 1; }
  const model = findModel(config, selection.model)!; const effort = selectEffort(config, model, profile);
  console.log(JSON.stringify({ ...explainSelection(profile, selection), effort, provider: model.provider, model: model.model }, null, 2)); return 0;
}

async function route(configDir: string, flags: Flags, config: Awaited<ReturnType<typeof loadConfig>>, providers: ReturnType<typeof createProviders>): Promise<number> {
  const prompt = requiredFlag(flags, "prompt"); const run = await runSingle(configDir, config, providers, prompt, cwdFrom(flags), profileFrom(flags, prompt));
  console.log(JSON.stringify({ routing: run.routing, runId: run.runLog, success: run.result.success }, null, 2)); printResult(run.result.output, run.result.error, run.runLog); return run.result.success ? 0 : 1;
}

async function fanout(configDir: string, flags: Flags, config: Awaited<ReturnType<typeof loadConfig>>, providers: ReturnType<typeof createProviders>): Promise<number> {
  const prompt = requiredFlag(flags, "prompt"); const families = typeof flags.families === "string" ? Number.parseInt(flags.families, 10) : undefined;
  if (families !== undefined && (!Number.isInteger(families) || families < 2)) throw new Error("--families must be an integer of at least 2");
  const runs = await runFanout(configDir, config, providers, prompt, cwdFrom(flags), profileFrom(flags, prompt, families), families);
  for (const run of runs) { console.log(JSON.stringify({ model: run.model, routing: run.routing, runId: run.runLog, success: run.result.success }, null, 2)); printResult(run.result.output, run.result.error, run.runLog); }
  return runs.every((run) => run.result.success) ? 0 : 1;
}

async function pipeline(flags: Flags, config: Awaited<ReturnType<typeof loadConfig>>, providers: ReturnType<typeof createProviders>): Promise<number> {
  const prompt = requiredFlag(flags, "prompt"); const template = requiredFlag(flags, "template"); const write = boolFlag(flags, "write");
  const scope = typeof flags.scope === "string" ? flags.scope.split(",").map((item) => item.trim()).filter(Boolean) : [];
  if (write && scope.length === 0) throw new Error("--write requires --scope path1,path2");
  const run = await runPipeline(config, providers, template, prompt, cwdFrom(flags), profileFrom(flags, prompt), { write, scope });
  console.log(JSON.stringify({ runId: run.record.id, state: run.record.state, stages: run.record.stages }, null, 2)); return run.record.state === "succeeded" ? 0 : 1;
}

async function status(flags: Flags): Promise<number> { console.log(JSON.stringify(await readRunRecord(cwdFrom(flags), requiredFlag(flags, "run-id")), null, 2)); return 0; }
async function evaluate(configDir: string, config: Awaited<ReturnType<typeof loadConfig>>): Promise<number> { const result = await evaluateDirectory(config, resolve(repositoryRootFromConfig(configDir), "evals", "cases")); console.log(JSON.stringify(result, null, 2)); return result.passed === result.total ? 0 : 1; }
async function stats(flags: Flags): Promise<number> { console.log(JSON.stringify(await summarizeRuns(cwdFrom(flags)), null, 2)); return 0; }
async function outcome(flags: Flags): Promise<number> { const status = enumFlag(flags, "status", ["accepted", "rejected", "partial", "escalated"] as const); const findings = typeof flags.findings === "string" ? Number.parseInt(flags.findings, 10) : undefined; const score = typeof flags.score === "string" ? Number.parseFloat(flags.score) : undefined; console.log(JSON.stringify(await attachRunOutcome(cwdFrom(flags), requiredFlag(flags, "run-id"), { status, ...(findings !== undefined ? { reviewFindingsCount: findings } : {}), ...(score !== undefined ? { manualScore: score } : {}), ...(boolFlag(flags, "regression") ? { regressionDetected: true } : {}) }), null, 2)); return 0; }

function profileFrom(flags: Flags, prompt: string, families?: number): TaskProfile {
  const complexity = optionalEnumFlag(flags, "complexity", complexities);
  const risk = optionalEnumFlag(flags, "risk", risks);
  const diversity = optionalEnumFlag(flags, "diversity", diversities) ?? (families ? diversityFromFamilies(families) : undefined);
  const contextRequirement = optionalEnumFlag(flags, "context", contexts);
  return classifyTask(prompt, enumFlag(flags, "role", roles), {
    ...(complexity ? { complexity } : {}), ...(risk ? { risk } : {}), ...(diversity ? { diversity } : {}), ...(contextRequirement ? { contextRequirement } : {}),
    preferLocal: boolFlag(flags, "prefer-local"), requireLocal: boolFlag(flags, "local-only"), privacySensitive: boolFlag(flags, "privacy-sensitive"), privateCode: boolFlag(flags, "private-code"), allowRemote: !boolFlag(flags, "no-remote"), requiresTools: boolFlag(flags, "requires-tools"),
  });
}
function cwdFrom(flags: Flags): string { return typeof flags.cwd === "string" ? resolve(flags.cwd) : process.cwd(); }
function boolFlag(flags: Flags, name: string): boolean { return flags[name] === true || flags[name] === "true"; }
function enumFlag<T extends string>(flags: Flags, name: string, values: readonly T[]): T { const value = requiredFlag(flags, name); if (!values.includes(value as T)) throw new Error(`Invalid --${name}: ${value}`); return value as T; }
function optionalEnumFlag<T extends string>(flags: Flags, name: string, values: readonly T[]): T | undefined { return flags[name] === undefined ? undefined : enumFlag(flags, name, values); }
function parseFlags(args: string[]): Flags { const flags: Flags = {}; for (let index = 0; index < args.length; index += 1) { const arg = args[index]; if (!arg?.startsWith("--")) throw new Error(`Unexpected argument: ${arg ?? ""}`); const key = arg.slice(2); const value = args[index + 1]; if (!value || value.startsWith("--")) { flags[key] = true; continue; } flags[key] = value; index += 1; } return flags; }
function requiredFlag(flags: Flags, name: string): string { const value = flags[name]; if (typeof value !== "string" || value.length === 0) throw new Error(`--${name} is required`); return value; }
function printResult(output: string, error: string | undefined, logPath: string): void { if (output) process.stdout.write(output.endsWith("\n") ? output : `${output}\n`); if (error) console.error(`dtr: ${error}`); console.error(`dtr: run log ${logPath}`); }
function printUsage(): void { console.error("Usage: dtr <tui|health|models|run|select|route|fanout|pipeline|status|evaluate|stats|outcome> [options]"); console.error("TUI: dtr tui [--cwd <target-repository>]"); console.error("Select: dtr select --role <role> [--prompt <text>] [--complexity <level>] [--risk <level>] [--diversity <level>]"); console.error("Route: dtr route --role <role> --prompt <text> [profile flags]"); console.error("Fanout: dtr fanout --families <n> --role <role> --prompt <text> [profile flags]"); console.error("Pipeline: dtr pipeline --template <name> --role <role> --prompt <text> [--write --scope path1,path2]"); console.error("Status: dtr status --run-id <uuid> [--cwd <repo>]"); }
function isMainModule(): boolean { try { return Boolean(process.argv[1]) && import.meta.url === pathToFileURL(realpathSync(process.argv[1]!)).href; } catch { return false; } }
if (isMainModule()) main(process.argv.slice(2)).then((code) => { process.exitCode = code; });
