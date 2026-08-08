# Routing contract

## Invariants

1. The lead owns the user objective, integration, and final report.
2. Create workers only after an explicit request to route or delegate.
3. Give each shared contract and implementation path one writer.
4. Require an observable result, allowed paths, checks, and return format.
5. Treat workers as evidence producers; the lead validates their claims.
6. Review with a fresh, read-only worker after integration.
7. Never claim a stop, merge, approval, or deployment that the host did not do.

## Compact worker contract

Send workers only this task-local information:

```text
GOAL: <observable outcome>
SCOPE: <allowed paths>
DO NOT: <non-goals>
CHECK: <commands or evidence>
RETURN: changed paths; check result; blocker/risk
```

Keep normal returns to five lines or fewer. The worker should not receive the
full routing plan, sibling transcript, model rationale, or parent narrative.

## Lifecycle

| Intent | Lead action |
| --- | --- |
| Route | Define outcome and checks; dispatch only independent workers. |
| Status | Report registered worker state and blockers; do not change work. |
| Continue | Send one task-local follow-up to the same worker. |
| Handoff | Integrate returned evidence and run combined checks. |
| Abort | Stop registered workers through the native host control when available. |
| Restart | Abort first; create fresh workers from the corrected objective. |

## Escalate only when needed

Use more workers, larger context, or stronger models only for a real shared
contract, ambiguity, conflicting evidence, or material safety boundary.
