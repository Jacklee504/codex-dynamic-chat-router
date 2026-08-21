import { describe, expect, it } from "vitest";
import { readOllamaRuntime, safeError } from "../src/application.js";

describe("application observability", () => {
  it("normalizes documented local Ollama runtime metadata without a live server", async () => {
    const runtime = await readOllamaRuntime(async () => new Response(JSON.stringify({ models: [{ name: "qwen3.5:9b", size: 5_500_000_000, size_vram: 4_000_000_000, context_length: 4096, expires_at: "2030-01-01T00:00:00Z" }] }), { status: 200 }));
    expect(runtime).toMatchObject({ available: true, models: [{ name: "qwen3.5:9b", runtimeSizeBytes: 4_000_000_000, contextLength: 4096 }] });
  });
  it("redacts provider-style credentials from UI-safe errors", () => {
    expect(safeError("OPENROUTER_API_KEY=secret Authorization: Bearer abc")).not.toContain("secret");
    expect(safeError("OPENROUTER_API_KEY=secret Authorization: Bearer abc")).not.toContain("abc");
  });
});
