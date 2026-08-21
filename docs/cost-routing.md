# Cost routing

Each registry entry has static estimated input and output prices per million
tokens. The selector estimates a bounded 1,000-input / 500-output task cost.
`budget.mode` supports `ignore`, `prefer_free`, and `capped`.

`prefer_free` favors an eligible zero-estimate model; `capped` rejects models
above `max_estimated_cost_usd`. Neither setting can bypass privacy, locality,
role, capability, write, or diversity requirements. Prices and limits are
manually maintained priors, not billing data; verify them before enabling a
paid model.
