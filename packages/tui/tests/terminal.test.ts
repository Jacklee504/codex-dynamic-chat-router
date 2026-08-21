import { EventEmitter } from "node:events";
import { describe, expect, it } from "vitest";
import { enterAlternateScreen } from "../src/terminal/alternate-screen.js";
import { registerCleanup } from "../src/terminal/cleanup.js";

describe("terminal cleanup", () => {
  it("restores the alternate screen only once", () => {
    const writes: string[] = []; const stream = { isTTY: true, write: (value: string) => { writes.push(value); return true; } } as unknown as NodeJS.WriteStream;
    const restore = enterAlternateScreen(stream); restore(); restore();
    expect(writes).toEqual(["\u001B[?1049h", "\u001B[?1049l"]);
  });
  it("runs registered cleanup idempotently", () => {
    const processRef = new EventEmitter() as NodeJS.Process; let calls = 0; const unregister = registerCleanup(() => { calls += 1; }, processRef);
    processRef.emit("SIGINT"); processRef.emit("SIGTERM"); unregister();
    expect(calls).toBe(1);
  });
});
