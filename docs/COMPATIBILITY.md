# Compatibility and requirements

## Supported use case

App Subchat Router is for a Codex app environment where child tasks are visible
and controlled by the current parent task. The parent must remain the lead: it
defines the outcome, assigns bounded work, integrates returned evidence, and
reports the result.

## Required host controls

| Capability | Why it is required | If unavailable |
| --- | --- | --- |
| Create a child task | Dispatch parent-owned work | Do not route work. |
| List or identify child tasks | Maintain run membership and prevent cross-run actions | Do not claim a routing manifest. |
| Title child tasks | Keep visible lineage and responsibilities clear | Use only if the host supplies another reliable parent-child label. |
| Read task state/results | Produce a trustworthy status or handoff | Report only the known parent state. |
| Send a targeted follow-up | Continue a bounded task safely | Use a fresh route when the objective changes. |
| Stop active children | Abort safely | Ask the user to use the native stop control. |
| Isolated workspaces | Avoid concurrent writes to the same contract | Use a single writer or do not parallelize. |

The exact tool names are host-version details, not part of this skill's public
contract. Discover the capabilities before use.

## What this plugin does not provide

- A background queue, scheduler, or worker runtime.
- Access to other users' tasks.
- A worktree manager.
- Automatic merging, deployment, or permission escalation.
- New Codex app features in a host that does not already expose them.

## Deployment posture

Use this skill as an explicit workflow. It is configured with
`allow_implicit_invocation: false`; callers should invoke
`$app-subchat-router` directly. This keeps delegation, task creation, and
possible workspace changes visible to the user.
