# Host compatibility

## Purpose

App Subchat Router coordinates visible child chats. It does not create an
orchestration backend, provision a worktree system, or grant access to host
controls. The host must provide the controls used in the requested operation.

## Required capabilities by operation

| Operation | Required host capability | Safe fallback |
| --- | --- | --- |
| Route | List or identify parent/child threads; create a child thread; set titles; inspect state | Explain that routing cannot start in this host. |
| Parallel writing | Create isolated workspaces or worktrees | Use one writer in the shared checkout, or do not dispatch. |
| Status | Read registered child-thread state | Report only known parent state; do not infer activity. |
| Continue | Send a targeted follow-up to a registered child | Start a new parent conversation only if the user asks. |
| Handoff | Read returned child results | Ask the user to provide results; do not fabricate a handoff. |
| Abort | Stop the registered active children | Tell the user to use the host's native stop control. |
| Review | Create a fresh read-only child | Perform review in the parent only if the user explicitly permits it. |

## Codex desktop terminology

The UI may label the underlying facility **subagents**, while this skill calls
each visible child task a **subchat**. Use the host's exact label only when
referencing a native control such as **Stop active subagents**.

Host APIs and tool names can change between app versions. Discover available
controls before dispatch rather than assuming a specific internal tool name.

## Capability check

Before routing, confirm all of the following:

1. The parent can identify the active task and its title or ID.
2. The host can create a visible child task attached to the parent.
3. The host can return a child task's state and result to the parent.
4. The host can send a follow-up to a child task.
5. The host exposes a reliable stop action, or the user can perform it.
6. Parallel writers have isolated working directories.

If any needed capability is absent, say which action cannot be performed and
continue only with the safe subset the user requested.
