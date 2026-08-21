# Isolated write workers

Writing is off by default. `implement-review` becomes write-capable only with
both `--write` and an explicit comma-separated path scope:

```sh
npm run dtr -- pipeline --template implement-review --write --scope src/execution,tests/execution --role implementer --prompt "Fix the confirmed state-sync defect and add regression tests"
```

Before the worker starts, DTR verifies the target repository is Git and clean,
then creates `.dtr/worktrees/<run-id>/<worker-id>` on a unique
`dtr/<run-id>-<worker-id>` branch. Codex uses `workspace-write` only in that
worktree; Claude uses its edit permission mode only in that worktree. Ollama is
not write-capable.

After the worker, DTR records changed paths and runs `git diff --check`. Any
path outside the declared scope fails the run and the worktree remains as
evidence. DTR never auto-merges, force-resets the base checkout, removes a
user worktree, or deletes an unsafe worktree automatically.
