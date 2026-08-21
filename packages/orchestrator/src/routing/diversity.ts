import type { RouterConfig } from "../config.js";
import type { DiversityLevel } from "../types.js";

export function requiredFamilies(config: RouterConfig, diversity: DiversityLevel): number {
  return config.policy.diversity[diversity].minimumFamilies;
}

export function diversityStatus(config: RouterConfig, diversity: DiversityLevel, families: string[]): string | undefined {
  const required = requiredFamilies(config, diversity);
  const actual = new Set(families).size;
  return actual >= required ? undefined : `requires ${required} independent model families; only ${actual} available`;
}
