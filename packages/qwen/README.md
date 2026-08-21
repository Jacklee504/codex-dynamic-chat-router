# Qwen Code package

The installable extension root is `dynamic-task-router/`.

```bash
qwen extensions install ./packages/qwen/dynamic-task-router --scope project
```

It provides explicit `/router:*` commands and focused subagent profiles. The
router assumes the medium routing level and selects Qwen Code's `fast`, configured
grade, or inherited parent model according to the shared
[model routing policy](../../core/model-routing-policy.md). Low/high routing
adjusts to a cheaper/stronger eligible grade without overriding safety minima.
See [the Qwen Code guide](../../docs/qwen-code.md).
