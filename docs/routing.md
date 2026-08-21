# Routing and fan-out

Use the runtime only for an explicit bounded task. The lead still owns task
decomposition, integration, and final verification.

```sh
npm run dtr -- select --role reviewer --complexity difficult --risk high
npm run dtr -- route --role debugger --prompt "Find why valid signals never reach order submission"
npm run dtr -- fanout --families 2 --role debugger --risk high --prompt "Find why valid signals never reach order submission"
```

Useful profile flags are `--complexity`, `--risk`, `--diversity`,
`--prefer-local`, `--local-only`, `--privacy-sensitive`, `--requires-tools`,
`--private-code`, `--no-remote`, and `--context huge`. `--families 2` asks
fan-out for two independent model families; providers run concurrently when
eligible and each receives the same compact prompt only. The caller receives
separate results and performs any comparison.

`dtr route` refuses a multi-family requirement: use `dtr fanout` instead. All
commands that invoke providers use the Phase 1 read-only adapters and write a
metadata-only record under `.dtr/runs/`.

Private-code, local-only, provider, and family restrictions are hard filters:
the selector fails rather than relaxing them. Cost preference is applied only
after those constraints. See [privacy](privacy.md) and [cost routing](cost-routing.md).

The runtime refuses task packets over 6,000 characters, adds a compact result
contract, caps returned provider output at 4,800 characters, and MCP further
limits returned task result text to 1,200 characters. Reduce a task to its
goal, paths/symbols, necessary evidence, non-goals, and check rather than
sending a transcript.
