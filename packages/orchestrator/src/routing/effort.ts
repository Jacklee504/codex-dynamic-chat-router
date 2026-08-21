import type { ModelConfig, RouterConfig } from "../config.js";
import type { Effort, TaskProfile } from "../types.js";

const effortOrder: Effort[] = ["low", "medium", "high", "xhigh", "max"];

export type EffortSelection = { requested: Effort; effective: Effort; reason?: string };

export function selectEffort(config: RouterConfig, model: ModelConfig, task: TaskProfile): EffortSelection {
  const requested = higherEffort(
    config.policy.effort.complexity[task.complexity],
    config.policy.effort.minimumForRisk[task.risk],
  );
  const minimum = config.policy.effort.minimumForRisk[task.risk];
  const allowed = model.efforts.filter((effort) => effortIndex(effort) >= effortIndex(minimum));
  if (allowed.length === 0) throw new Error(`${model.id} cannot meet the ${minimum} minimum effort for ${task.risk}-risk work`);
  const effective = [...allowed].sort((left, right) => {
    const distance = Math.abs(effortIndex(left) - effortIndex(requested)) - Math.abs(effortIndex(right) - effortIndex(requested));
    return distance || effortIndex(left) - effortIndex(right);
  })[0]!;
  return {
    requested,
    effective,
    ...(requested === effective ? {} : { reason: `requested ${requested}; mapped to supported ${effective}` }),
  };
}

export function effortIndex(effort: Effort): number {
  return effortOrder.indexOf(effort);
}

export function higherEffort(left: Effort, right: Effort): Effort {
  return effortIndex(left) >= effortIndex(right) ? left : right;
}
