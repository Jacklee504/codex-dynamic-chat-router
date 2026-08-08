# Operating guide

## Before routing

State four things in the parent:

1. **Objective** — a result someone can observe or test.
2. **Minimum safe change** — the smallest change that meets the objective.
3. **Acceptance evidence** — commands, tests, or checks required to finish.
4. **Safety boundary** — any production, destructive, financial, auth,
   security, privacy, or rollback concern.

Read repository instructions before dispatch. Do not create workers merely
because a plan could be divided.

## Routing manifest

Before dispatching, produce the following table and make one child responsible
for every shared implementation contract:

| Subchat / responsibility | Model / effort | Write boundary | Acceptance evidence | Dependency |
| --- | --- | --- | --- | --- |

Use the host-supported normal model for clear implementation. Use lower effort
for an isolated test, documentation edit, or read-only inventory. Increase
reasoning only for genuine ambiguity, shared contracts, conflicting evidence,
or material risk.

## Scope a worker

Every worker needs:

- a parent identity and shared objective;
- one observable outcome;
- an allowlist of files or directories;
- explicit non-goals;
- constraints from the repository and safety boundary;
- exact acceptance checks; and
- a concise return format.

Keep routine handoffs under 200 words. Ask for the outcome, changed files,
verification, needed decision, and remaining risk—not a transcript.

## Integrate

The parent integrates only evidence returned by its registered workers. It
reconciles diffs, resolves shared interfaces, and runs the combined checks.
Never auto-merge a worker workspace or let a reviewer own the implementation.

## Review

Create the reviewer after integration, not alongside the original writer. It
must be a new, read-only child and receive the original request, final diff,
invariants, and test output. Ask for actionable findings ranked by severity and
backed by a concrete failure scenario.

## Abort

To abort safely:

1. Identify the routing run and its registered children.
2. Stop new dispatches and mark it `aborting`.
3. Use the host's native stop action for its active children.
4. Confirm their state before reporting success.
5. Ignore late results and do not merge their changes.

Do not represent a follow-up message, archive, or task rename as a stop.

## Restart

Restart means aborting the old run first. Create a new numeric run only after
active workers are stopped—or the user confirms that they stopped them. Never
reuse an aborted child for a changed objective.
