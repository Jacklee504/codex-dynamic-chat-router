# Model selection runtime

`config/models.yaml` is the runtime registry. Each model declares its provider,
independent model family, local status, 0–10 role scores, supported internal
reasoning efforts, capabilities, context limit, cost estimate, and privacy
eligibility. The initial values are maintainers' priors for routing; they are
deliberately not presented as benchmark results.

The selector follows this order:

1. Build a deterministic task profile.
2. Reject models that cannot meet hard constraints.
3. Score by the requested role, plus documented local/high-risk/extreme bonuses.
4. Choose effort independently from complexity and risk.
5. Store selection and requested/effective effort metadata without prompts or outputs.

Hard filters include disabled/unavailable models, local-only or no-remote
requests, private-code eligibility, permitted providers/families, context,
tools, write safety, and a capped cost estimate. A zero-cost preference can
break a score tie only after those checks; it cannot override them. See
[reasoning levels](reasoning-levels.md), [privacy](privacy.md), and
[cost routing](cost-routing.md).

For example, `dtr select --role reviewer --complexity difficult --risk high`
is a dry run. It makes availability checks but never starts inference. Its JSON
shows the selected model and the reasons every candidate was rejected or
ranked.

An unavailable first choice falls back only to an eligible model. A local-only
or privacy-sensitive task with no installed local candidate fails. An effort
mapping such as requested `low` to supported `medium` is explicit in the
output and run metadata.
