import type { Complexity, DiversityLevel, RiskLevel, TaskProfile, WorkerRole } from "../types.js";

export type ProfileOverrides = Partial<Omit<TaskProfile, "role">> & { role?: WorkerRole };

const HIGH_RISK = /\b(auth|secret|credential|token|password|payment|financial|trading|order submission|production|deploy|destructive|delete|migration|security|permission)\b/i;
const MEDIUM_RISK = /\b(write|modify|change|implementation|bug|incident)\b/i;
const EXTREME = /\b(architecture|cross-cutting|all services|root cause unknown|redesign|migration)\b/i;
const DIFFICULT = /\b(why|root cause|investigate|debug|regression|ambiguous|failing)\b/i;
const LOCAL = /\b(local[- ]only|offline|do not upload|private data)\b/i;

export function classifyTask(prompt: string, role: WorkerRole, overrides: ProfileOverrides = {}): TaskProfile {
  const inferredComplexity: Complexity = EXTREME.test(prompt) ? "extreme" : DIFFICULT.test(prompt) ? "difficult" : "normal";
  const inferredRisk: RiskLevel = HIGH_RISK.test(prompt) ? "high" : MEDIUM_RISK.test(prompt) ? "medium" : "low";
  const inferredLocal = LOCAL.test(prompt);
  return {
    role: overrides.role ?? role,
    complexity: overrides.complexity ?? inferredComplexity,
    risk: overrides.risk ?? inferredRisk,
    preferLocal: overrides.preferLocal ?? false,
    requireLocal: overrides.requireLocal ?? inferredLocal,
    privacySensitive: overrides.privacySensitive ?? inferredLocal,
    privateCode: overrides.privateCode ?? false,
    allowRemote: overrides.allowRemote ?? true,
    ...(overrides.allowedFamilies ? { allowedFamilies: overrides.allowedFamilies } : {}),
    ...(overrides.allowedProviders ? { allowedProviders: overrides.allowedProviders } : {}),
    diversity: overrides.diversity ?? "none",
    ...(overrides.contextRequirement ? { contextRequirement: overrides.contextRequirement } : {}),
    requiresTools: overrides.requiresTools ?? false,
  };
}

export function diversityFromFamilies(families: number): DiversityLevel {
  if (families >= 2) return "medium";
  return "none";
}
