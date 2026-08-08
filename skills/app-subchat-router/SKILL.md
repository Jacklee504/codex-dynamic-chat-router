---
name: app-subchat-router
description: Route and manage cross-cutting implementation through visible, parent-owned Codex app subchats. Use only when the user explicitly asks to route, delegate, inspect, continue, hand off, abort, or restart bounded work across core code, isolated support changes, tests, documentation, or an independent review.
---

# App Subchat Router

Use visible Codex app **subchats** as the worker surface. A subchat is a child
chat created by and accountable to the current parent chat; it is never a peer,
replacement parent, or independent owner. Keep the parent responsible for
outcomes, evidence, integration, and final reporting.

This skill requires a host that exposes the needed subchat controls. Before
dispatching, read [host compatibility](references/host-compatibility.md). If a
required control is unavailable, do not imitate it with untracked work or claim
that the action occurred.

## Operating principles

- Create subchats only after an explicit user request to route, delegate, or
  start work. Planning alone does not authorize dispatch.
- Give each shared contract and implementation file one writer. Parallelize only
  independent, non-overlapping work or read-only evidence gathering.
- Make each subchat's objective observable and bounded. State allowed files,
  non-goals, constraints, acceptance checks, and a compact return format.
- Keep parent-child lineage, ownership, state, and review visible in the host.
- Respect repository instructions over this skill. Fail closed for unclear
  destructive, production, security, authentication, financial, or privacy work.

## Lifecycle and titles

Treat `route`, `status`, `continue`, `handoff`, `abort`, and `restart` as
operation intents, not invented host commands. On each new `route` or
`restart`, allocate the next numeric run ID by inspecting existing overview
titles. Do not allocate an ID for the other intents.

Use these exact title forms:

```text
<N> — Overview — <short parent objective>
<N> — Subchat — <bounded responsibility>
```

Maintain a parent-owned routing manifest with each registered subchat's ID,
title, responsibility, write boundary, state, evidence, and dependency. Never
operate on unrelated threads.

## Route work

Before creating a worker, state the parent objective, minimum safe change,
acceptance checks, and any meaningful safety boundary. Then show this manifest:

| Subchat / responsibility | Model / effort | Write boundary | Acceptance evidence | Dependency |
| --- | --- | --- | --- | --- |

Create only the workers the declared run needs. Prefer the host's normal model
for a clear implementation; use lower effort for isolated tests, documentation,
or read-only inventory; raise effort only for genuine ambiguity, shared
contracts, or material risk. Use only model and reasoning combinations actually
supported by the host.

Every worker prompt starts with this block:

```text
Role: You are a subchat created by the parent chat "<parent title or ID>".
Parent objective: <shared observable outcome>
Relationship: Return evidence and decisions to the parent. Do not claim final
ownership, create child tasks, or extend scope without parent approval.
```

Then include the worker's `Objective`, `Scope`, `Non-goals`, `Constraints`,
`Acceptance checks`, and `Return to parent`. Ask for a return of: summary;
files changed; verification evidence; remaining risks. Keep ordinary handoffs to
200 words or fewer and do not paste raw logs.

Use a host-managed worktree for each parallel writer when available. Do not
auto-merge or auto-apply another worker's change.

## Manage a run

### Status

Read only registered subchat state and return a compact roster, blockers, and
next owner. Do not create work or change scope.

### Continue

Send one narrow follow-up only to an active subchat whose original objective and
write boundary still match. If the objective has changed, route a fresh subchat.

### Handoff

Collect concise returned evidence and keep this parent checkpoint:

```text
Objective:
Completed:
Open decisions:
Active subchats / owners:
Interfaces or invariants:
Relevant files:
Verification state:
Next action:
```

Integrate only returned evidence. One parent-designated integrator reconciles
candidate diffs and runs combined checks.

### Abort and restart

Identify the registered run before aborting. Stop new dispatches, mark the run
`aborting`, and invoke the host's native stop control when available. If no
termination control is exposed, tell the user that immediate stopping requires
their native app control; never misrepresent archiving or a message as a stop.
Ignore returned results and do not merge changes from an aborted run.

For `restart`, finish the abort first, confirm active registered subchats have
stopped (or that the user stopped them), then allocate a new numeric run and
create fresh workers from the corrected objective.

## Integrate and review

After implementation returns, create a fresh, read-only reviewer subchat. Give
it the original request, changed files or diff, invariants, and actual test
output. Ask only for actionable findings ranked by severity and tied to a
concrete failure scenario. The reviewer never owns implementation or final
sign-off. Repair real findings in a focused follow-up and rerun affected checks.

## Safety invariants

- Never access secrets, environment files, or Codex configuration merely to
  route work.
- Do not make live, destructive, financial, production, or position-closing
  changes without explicit approval and a safe rollback path.
- Do not lower a user-requested model or reasoning assignment after a host
  rejects it; report the incompatibility and ask for a supported replacement.
- Do not reuse a completed or aborted subchat for a different objective.
- Require named invariants, a safe failure path, and relevant verification for
  critical work.

For host prerequisites and prompt examples, read
[host compatibility](references/host-compatibility.md) and
[prompt templates](references/prompt-templates.md).
