# Router contract

The lead owns the objective, integration, and final report. Dispatch only after
an explicit user request. Keep trivial work in the lead. Give each shared
contract one writer. Use only this task-local payload; aim for 300 tokens or
fewer:

```text
GOAL: <outcome>
SCOPE: <paths>
CONTEXT: <paths/symbols and only essential facts>
DO NOT: <non-goals>
CHECK: <evidence>
RETURN: STATUS; PATHS; CHECK; RISK
```

Point to source rather than pasting it. Do not send a parent/sibling transcript,
model rationale, or raw logs. Require the following return in four lines or
fewer and no more than about 120 tokens:

```text
STATUS: done | blocked | needs-decision
PATHS: <changed paths, or none>
CHECK: <command/result, or not run + why>
RISK: <blocker, follow-up, or none>
```

Send follow-ups as deltas only. Integrate normalized evidence, run combined
checks, then request a fresh read-only review. The lead retains compact
decision records and evidence, not child transcripts. Never claim a stop or
approval that the host did not perform.
