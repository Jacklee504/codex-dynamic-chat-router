# Runtime safety

Read-only is the default for every provider and every fan-out task. The router
fails closed on local-only, privacy, capability, reasoning-risk, model-family,
and write-boundary constraints.

Write access needs all of: an explicit write pipeline request, a clean Git base,
a single stage owner, an isolated DTR worktree, a registry model marked
`write_safe`, an allowed path list, and post-run path verification. It is never
available through a raw MCP command or arbitrary CLI flags.

Run records contain routing and execution metadata, not prompt/output bodies or
environment values. A failed/unknown process is not reported as aborted; abort
control is intentionally not exposed in this release.
