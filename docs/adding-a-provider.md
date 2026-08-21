# Adding a provider

Implement the `Provider` interface: a fixed provider ID, a non-sensitive
health check, and a `run` method returning the standard metadata-only result.
Never add a shell passthrough or let task input select an executable.

Add registry entries with a distinct model family, role priors, supported
efforts, capabilities, context limit, estimated input/output cost, and explicit
private-code policy. A provider must reject unsupported reasoning controls
rather than pretend they were applied. Its adapter should enforce timeouts,
return bounded errors, avoid retries for non-idempotent writes, and ensure
telemetry omits prompts, outputs, and credentials.

New providers are read-only by default. Write support additionally requires
an explicit write boundary, an isolated worktree, provider-specific safe write
mode, boundary verification, and tests. Add mock-only tests for authentication
absence, timeout/error handling, privacy and cost filters, and no configuration
mutation.
