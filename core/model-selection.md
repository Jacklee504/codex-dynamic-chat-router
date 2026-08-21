# Model selection

The router creates a task profile before choosing a model. It filters
ineligible models first, then ranks remaining candidates by the configured
role score plus small explicit bonuses. Scores in `config/models.yaml` are
manual routing priors, not performance benchmarks or a global ranking.

Hard rejections: disabled or unavailable provider, local-only/privacy work on
a remote model, missing required tools or context capacity, insufficient role
score for difficult/extreme or high-risk work, and inability to meet the risk
minimum reasoning effort.

`preferLocal` is a two-point preference, not a safety gate. `requireLocal` and
`privacySensitive` are safety gates. The result records the winner, score,
reasons, and every rejection.

Select reasoning effort after model selection. Complexity requests an effort;
risk supplies a floor. If the model lacks that exact effort, use the closest
supported effort at or above the risk floor and record both values.

Model-family diversity is independent of provider ID. A request for two
families must use `dtr fanout`; a single route cannot claim to satisfy it.
