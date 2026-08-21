import type { ModelSelection } from "../types.js";

export function fallbackFrom(selections: ModelSelection[], selected: ModelSelection): string | undefined {
  const first = selections[0];
  return first && first.model !== selected.model ? first.model : undefined;
}
