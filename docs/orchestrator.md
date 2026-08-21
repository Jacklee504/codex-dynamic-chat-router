# Orchestrator runtime

Phase 2 adds deterministic model selection and read-only fan-out to the
runtime at `packages/orchestrator/`. The existing Codex, Claude Code, and Qwen
packages remain host adapters.

## Setup

```bash
npm install
npm run build
npm test
```

The runtime uses the installed, authenticated `claude` and `codex` CLIs. Its
health check uses their auth-status commands without printing their output. It
does not read environment files. Local Ollama tasks run via Codex OSS mode and
never pull a missing model. The optional OpenRouter adapter reads a process
credential only when the user has explicitly enabled an OpenRouter model; see
[providers](providers.md).

## Commands

```bash
npm run dtr -- health
npm run dtr -- models
npm run dtr -- models refresh
npm run dtr -- select --role reviewer --complexity difficult --risk high
npm run dtr -- route --role debugger --prompt "Find why valid signals never reach order submission"
npm run dtr -- fanout --families 2 --role debugger --risk high --prompt "Find why valid signals never reach order submission"
npm run dtr -- run --provider ollama --model qwen-local --role reviewer --cwd /path/to/repo --prompt "Inspect the README. Do not modify anything."
npm run dtr -- evaluate
npm run dtr -- stats
```

`dtr select` is dry-run only. `dtr route` selects one target and `dtr fanout`
selects independent families. `--model` accepts a configured model ID
(recommended) or configured model name for an explicit direct run. All
executions are read-only. Each execution writes metadata only—never the prompt
or response—to `<repository-root>/.dtr/runs/`.

## Configuration

Edit `config/models.yaml` to declare enabled models, model families, role-score
priors, capabilities, and supported effort values. Edit
`config/routing-policy.yaml` for effort, diversity, timeout, and safety policy.
This configuration contains selectors and priors, not credentials. See
[`docs/model-selection.md`](model-selection.md) for the scoring contract.

`limits`, `cost`, and `privacy` are eligibility metadata. They are maintained
manually and never rewritten by a routing run, catalog refresh, evaluation, or
stats command. Record a reviewed outcome with `dtr outcome`; `dtr stats` may
recommend inspecting priors after 20 manual outcomes, but it never changes
configuration.

## Compatibility behavior

The runtime checks CLI help before every execution and refuses a provider when
required read-only flags are absent. Current Codex releases do not expose the
historical `--ask-for-approval never` flag on `codex exec`; the runtime relies
on its supported `--sandbox read-only` mode and does not silently remove that
safety constraint. Claude runs use non-interactive print mode with plan
permissions and no session persistence.
