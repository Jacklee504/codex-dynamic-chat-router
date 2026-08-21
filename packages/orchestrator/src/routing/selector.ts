import type { ModelConfig, RouterConfig } from "../config.js";
import { selectEffort } from "./effort.js";
import type { ModelSelection, SelectionExplanation, TaskProfile } from "../types.js";

export type Availability = Record<string, boolean | undefined>;
export type SelectionOptions = { requireWrite?: boolean; modelId?: string };

export function selectModel(
  config: RouterConfig,
  task: TaskProfile,
  availability: Availability = {},
  excludedFamilies = new Set<string>(),
  options: SelectionOptions = {},
): ModelSelection | undefined {
  const rejected: Record<string, string[]> = {};
  const eligible: Array<{ model: ModelConfig; score: number; reasons: string[] }> = [];
  for (const model of config.models) {
    const reasons: string[] = [];
    const roleScore = model.roles[task.role];
    const minimumRole = task.risk === "high" || task.complexity === "extreme" ? 8 : task.complexity === "difficult" ? 6 : 1;
    if (!model.enabled) reasons.push("disabled");
    if (options.modelId && model.id !== options.modelId) reasons.push("not selected by the explicit model override");
    if (availability[model.id] === false) reasons.push("provider unavailable");
    if (excludedFamilies.has(model.family)) reasons.push(`family '${model.family}' already selected`);
    if (task.requireLocal && !model.local) reasons.push("local-only task");
    if (task.privacySensitive && !model.local) reasons.push("privacy-sensitive task requires local model");
    if (task.allowRemote === false && !model.local) reasons.push("remote models are disallowed");
    if (task.privateCode && !model.privacy.privateCodeAllowed) reasons.push("private code is not approved for this model");
    if (task.allowedFamilies && !task.allowedFamilies.includes(model.family)) reasons.push("model family is not allowed");
    if (task.allowedProviders && !task.allowedProviders.includes(model.provider)) reasons.push("provider is not allowed");
    if (task.requiresTools && !model.capabilities.tools) reasons.push("required tools unavailable");
    if (options.requireWrite && !model.capabilities.writeSafe) reasons.push("isolated write capability unavailable");
    if (task.contextRequirement === "huge" && !model.capabilities.hugeContext) reasons.push("huge context unavailable");
    if (roleScore < minimumRole) reasons.push(`role score ${roleScore} below minimum ${minimumRole}`);
    try { selectEffort(config, model, task); } catch (error) { reasons.push(error instanceof Error ? error.message : String(error)); }
    const estimatedCost = estimateCost(model);
    if (config.policy.budget.mode === "capped" && estimatedCost > config.policy.budget.max_estimated_cost_usd) reasons.push(`estimated cost $${estimatedCost.toFixed(4)} exceeds cap`);
    if (reasons.length > 0) {
      rejected[model.id] = reasons;
      continue;
    }
    let score = roleScore;
    const scoreReasons = [`${task.role} role score=${roleScore}`];
    if (task.preferLocal && model.local) { score += 2; scoreReasons.push("local preference bonus=2"); }
    if (task.risk === "high") { score += 2; scoreReasons.push("high-risk suitability bonus=2"); }
    if (task.complexity === "extreme") { score += 1; scoreReasons.push("extreme-complexity suitability bonus=1"); }
    if (config.policy.budget.mode === "prefer_free" && estimatedCost === 0) { score += 1; scoreReasons.push("free-model preference bonus=1"); }
    eligible.push({ model, score, reasons: scoreReasons });
  }
  eligible.sort((left, right) => right.score - left.score || left.model.id.localeCompare(right.model.id));
  const winner = eligible[0];
  if (!winner) return undefined;
  const explanation: SelectionExplanation = {
    selected: winner.model.id,
    score: winner.score,
    reasons: winner.reasons,
    rejected,
  };
  return { model: winner.model.id, score: winner.score, explanation };
}

export function estimateCost(model: ModelConfig, inputTokens = 1_000, outputTokens = 500): number {
  return ((inputTokens * model.cost.inputPerMillion) + (outputTokens * model.cost.outputPerMillion)) / 1_000_000;
}

export function eligibleSelections(config: RouterConfig, task: TaskProfile, availability: Availability = {}, options: SelectionOptions = {}): ModelSelection[] {
  const selected: ModelSelection[] = [];
  const excluded = new Set<string>();
  while (true) {
    const selection = selectModel(config, task, availability, excluded, options);
    if (!selection) return selected;
    selected.push(selection);
    const model = config.models.find((item) => item.id === selection.model)!;
    excluded.add(model.family);
  }
}
