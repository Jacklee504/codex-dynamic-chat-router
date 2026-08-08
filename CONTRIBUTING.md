# Contributing

Thanks for improving App Subchat Router.

## Design constraints

Contributions must preserve these guarantees:

- A parent task owns the objective and final decision.
- Subchat creation requires an explicit user request.
- Shared implementation contracts have one writer.
- Status and handoff report evidence, not assumptions.
- Abort is honest about whether the host actually stopped a child task.
- Critical work fails closed without safety boundaries and verification.

## Development

1. Make a focused change.
2. Keep `SKILL.md` concise; place detailed compatibility information and prompt
   patterns in `references/` or `docs/`.
3. Run the skill and plugin validators listed in [docs/RELEASING.md](docs/RELEASING.md).
4. Include validation evidence in the pull request.

Do not add host-specific internal tool names as hard requirements unless they
are part of a documented public interface.
