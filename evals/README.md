# Routing evals

Each case asserts routing properties—such as a minimum reviewer score, local
eligibility, or effort floor—rather than permanently asserting one model name.
Run `npm run dtr -- evaluate` after changing model metadata or policy. Passing
evals are evidence for a proposed prior change, not authorization to rewrite
`config/models.yaml` automatically.
