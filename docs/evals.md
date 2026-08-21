# Evals and outcomes

Run the version-controlled routing fixtures without inference:

```sh
npm run dtr -- evaluate
npm run dtr -- stats
```

Fixtures assert routing properties such as local privacy handling, minimum
effort, independent review families, and read-only constraints. Record a human
review through `dtr outcome` after a run. After 20 reviewed outcomes, stats may
suggest inspecting routing priors; it never auto-tunes, rewrites YAML, or sends
telemetry externally.
