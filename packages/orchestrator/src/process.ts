import { spawn } from "node:child_process";

import type { Command, ProcessResult, ProcessRunner } from "./types.js";

export class NodeProcessRunner implements ProcessRunner {
  async run(command: Command, options: { cwd: string; timeoutMs?: number | undefined; signal?: AbortSignal | undefined }): Promise<ProcessResult> {
    return new Promise((resolve) => {
      const child = spawn(command.command, command.args, {
        cwd: options.cwd,
        shell: false,
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      let timedOut = false;
      const timer = options.timeoutMs
        ? setTimeout(() => {
            timedOut = true;
            child.kill("SIGTERM");
          }, options.timeoutMs)
        : undefined;
      const abort = () => child.kill("SIGTERM");
      if (options.signal?.aborted) abort();
      else options.signal?.addEventListener("abort", abort, { once: true });

      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", (chunk: string) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk: string) => {
        stderr += chunk;
      });
      child.on("error", (error: Error) => {
        if (timer) clearTimeout(timer);
        options.signal?.removeEventListener("abort", abort);
        resolve({ stdout, stderr, exitCode: null, timedOut, error: error.message });
      });
      child.on("close", (exitCode) => {
        if (timer) clearTimeout(timer);
        options.signal?.removeEventListener("abort", abort);
        resolve({ stdout, stderr, exitCode, timedOut });
      });
    });
  }
}
