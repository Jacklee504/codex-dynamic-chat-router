import { describe, expect, it } from "vitest";
import { commandRegistry, commandSuggestions, findCommand } from "../src/commands/registry.js";
import { parseInput, tokenize } from "../src/commands/parser.js";

describe("terminal command parsing", () => {
  it("distinguishes normal tasks, slash commands, quotes, and empty input", () => {
    expect(parseInput("Investigate the reconnect failure")).toEqual({ kind: "task", task: "Investigate the reconnect failure" });
    expect(parseInput("/fanout \"reconnect test\" now")).toEqual({ kind: "command", name: "fanout", args: ["reconnect test", "now"] });
    expect(parseInput("   ")).toEqual({ kind: "empty" });
    expect(tokenize("one 'two three' four\\ five")).toEqual(["one", "two three", "four five"]);
  });

  it("exposes every required command from one registry", () => {
    const names = new Set(commandRegistry.map((command) => command.name));
    for (const name of ["route", "fanout", "pipeline", "models", "model", "providers", "provider", "effort", "mode", "usage", "context", "status", "workers", "runs", "run", "abort", "health", "config", "clear", "help", "quit"]) expect(names.has(name)).toBe(true);
    expect(findCommand("m")?.name).toBe("models");
    expect(commandSuggestions("/fa").map((command) => command.name)).toEqual(["fanout"]);
  });
});
