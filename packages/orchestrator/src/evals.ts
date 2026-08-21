import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parse } from "yaml";
import type { RouterConfig } from "./config.js";
import { effortIndex, selectEffort } from "./routing/effort.js";
import { eligibleSelections, selectModel } from "./routing/selector.js";
import type { Effort, TaskProfile, WorkerRole } from "./types.js";

type EvalCase = { id: string; role: WorkerRole; complexity: TaskProfile["complexity"]; risk: TaskProfile["risk"]; diversity?: TaskProfile["diversity"]; private_code?: boolean; local_only?: boolean; context?: TaskProfile["contextRequirement"]; expect: { minimum_effort?: Effort; independent_family?: boolean; read_only?: boolean; minimum_reviewer_score?: number; local?: boolean } };
export async function loadEvalCases(directory: string): Promise<EvalCase[]> {
  const files = (await readdir(directory)).filter((name) => name.endsWith(".yaml")).sort();
  return Promise.all(files.map(async (file) => parse(await readFile(resolve(directory, file), "utf8")) as EvalCase));
}
export function evaluateCase(config: RouterConfig, item: EvalCase): { id: string; pass: boolean; reasons: string[] } {
  const profile: TaskProfile = { role: item.role, complexity: item.complexity, risk: item.risk, preferLocal: false, requireLocal: item.local_only ?? false, privacySensitive: item.local_only ?? false, privateCode: item.private_code ?? false, allowRemote: !item.local_only, diversity: item.diversity ?? "none", ...(item.context ? { contextRequirement: item.context } : {}), requiresTools: false };
  const availability = Object.fromEntries(config.models.map((model) => [model.id, model.enabled])); const selection = selectModel(config, profile, availability);
  if (!selection) return { id: item.id, pass: false, reasons: ["no eligible model"] };
  const model = config.models.find((candidate) => candidate.id === selection.model)!; const effort = selectEffort(config, model, profile); const reasons: string[] = [];
  if (item.expect.minimum_effort && effortIndex(effort.effective) < effortIndex(item.expect.minimum_effort)) reasons.push("below minimum effort");
  if (item.expect.local && !model.local) reasons.push("selected model is not local");
  if (item.expect.minimum_reviewer_score && model.roles.reviewer < item.expect.minimum_reviewer_score) reasons.push("reviewer score below expected minimum");
  if (item.expect.independent_family && eligibleSelections(config, profile, availability).length < 2) reasons.push("independent family unavailable");
  if (item.expect.read_only === false) reasons.push("eval cases may not request write access");
  return { id: item.id, pass: reasons.length === 0, reasons };
}
export async function evaluateDirectory(config: RouterConfig, directory: string) { const results = (await loadEvalCases(directory)).map((item) => evaluateCase(config, item)); return { passed: results.filter((result) => result.pass).length, total: results.length, results }; }
