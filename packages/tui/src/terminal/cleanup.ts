export function registerCleanup(cleanup: () => void, processRef: NodeJS.Process = process): () => void {
  let done = false;
  const run = () => { if (done) return; done = true; cleanup(); };
  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  for (const signal of signals) processRef.once(signal, run);
  processRef.once("exit", run);
  return () => { run(); for (const signal of signals) processRef.removeListener(signal, run); processRef.removeListener("exit", run); };
}
