# App Subchat Router

`app-subchat-router` is a Codex skill for routing a cross-cutting task through
visible, parent-owned subchats. It makes delegation deliberate: each worker has
a bounded responsibility, explicit file ownership, acceptance evidence, and a
clear return path to the parent.

It is designed for work that genuinely benefits from coordination—such as a
core implementation plus isolated tests, documentation, and independent review.
It is intentionally not a generic “spawn agents for everything” helper.

## What it does

- Creates a numbered routing run and keeps an auditable manifest of its
  subchats.
- Assigns one writer per implementation contract and parallelizes only
  non-overlapping work.
- Guides `route`, `status`, `continue`, `handoff`, `abort`, and `restart`
  operations.
- Requires evidence-based integration followed by a fresh, read-only review.
- Fails closed when the host lacks a required subchat control or the task has
  an unresolved safety boundary.

## Compatibility

This is a workflow skill, not an orchestration service. It requires a Codex app
host that can create and manage visible child tasks. In practice, useful routing
requires controls to create and title child tasks, inspect their state, send
follow-ups, and stop active workers. Parallel code changes also require
isolated worktrees or an equivalent workspace mechanism.

Installing this skill does **not** add those capabilities to Codex CLI, an IDE,
or another host. If the required controls are unavailable, the skill tells the
parent what cannot safely be performed. Read the full compatibility matrix in
[docs/COMPATIBILITY.md](docs/COMPATIBILITY.md).

## Install from source

1. Clone this repository.
2. Link or copy the skill directory into your Codex user skills directory:

   ```bash
   mkdir -p ~/.agents/skills
   ln -s "$(pwd)/skills/app-subchat-router" ~/.agents/skills/app-subchat-router
   ```

   If your organization uses repository-scoped skills, place the same directory
   under `.agents/skills/` at the repository root instead.

3. Restart Codex if it does not detect the skill automatically.
4. Invoke it explicitly:

   ```text
   $app-subchat-router: route this feature into implementation, tests, and a fresh review
   ```

The skill deliberately opts out of implicit invocation. Delegation can change
work ownership and create side effects, so it should begin with an explicit
user request.

## Install as a plugin

The repository is already a valid plugin source: its manifest is at
`.codex-plugin/plugin.json` and the packaged skill is under `skills/`.

For local exploration, source installation above is the fastest path. For
distribution beyond one repository, publish this package through a Codex plugin
marketplace or the applicable plugin submission flow. Consult the current
[OpenAI skill distribution guidance](https://learn.chatgpt.com/docs/build-skills)
before release, as marketplace availability and submission requirements can
change.

## Quick workflow

1. **Route**: Define the shared result, safe minimum change, verification, and
   workers before creating any child task.
2. **Work**: Give each child a precise scope and return format. Keep one writer
   per shared contract.
3. **Observe**: Use status only to report registered children; do not infer
   state from silence.
4. **Integrate**: Reconcile returned evidence and run combined checks in the
   parent.
5. **Review**: Dispatch a fresh, read-only reviewer with the diff and actual
   test output.
6. **Handoff or abort**: Record the checkpoint before compaction or ownership
   transfer; stop the registered workers before restarting.

More complete operating guidance lives in [docs/OPERATIONS.md](docs/OPERATIONS.md).

## Example

```text
$app-subchat-router: route the billing retry change. One subchat should own
the retry state machine, a second can add isolated tests, and a fresh reviewer
must inspect the final diff. Do not modify payment execution behavior.
```

The parent should first show a routing manifest, then create only those workers
whose file boundaries do not overlap. It should report the verification evidence
and any risks when work returns.

## Repository layout

```text
.
├── .codex-plugin/plugin.json     Plugin metadata
├── skills/app-subchat-router/    Installable Codex skill
│   ├── SKILL.md                  Core workflow
│   ├── agents/openai.yaml        UI and invocation policy
│   └── references/               Capability matrix and prompts
├── docs/                         User and maintainer documentation
├── LICENSE                       MIT license
└── SECURITY.md                   Security reporting policy
```

## Safety model

The router is intentionally conservative. It does not access secrets or Codex
configuration, merge worker changes automatically, or pretend that a stop
occurred when the host provides no stop control. For production, destructive,
financial, authentication, or security-sensitive tasks, use explicit approval,
named invariants, a safe failure path, and relevant verification.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Changes to the skill should preserve
explicit delegation, parent ownership, and fail-closed behavior. Validate the
skill and the plugin manifest before opening a pull request.

## License

Released under the [MIT License](LICENSE).
