export function compact(value: string, width = 44): string { return value.length <= width ? value : `${value.slice(0, Math.max(1, width - 1))}…`; }
export function duration(value?: number): string { if (value === undefined) return "unavailable"; return value < 1_000 ? `${value}ms` : `${(value / 1_000).toFixed(1)}s`; }
export function tokens(value?: number): string { return value === undefined ? "unavailable" : value >= 1_000 ? `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K` : String(value); }
