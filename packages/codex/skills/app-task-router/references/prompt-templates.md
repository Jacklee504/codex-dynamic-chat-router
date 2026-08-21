# Prompt templates

## Writer subchat

```text
GOAL: <observable outcome>
SCOPE: <allowed paths>
CONTEXT: <paths/symbols and only essential facts>
DO NOT: <non-goals>
CHECK: <commands or evidence>
RETURN: STATUS; PATHS; CHECK; RISK
```

Aim for 300 tokens or fewer. Point to paths and symbols instead of pasting
source. Do not add a parent brief, model rationale, sibling summaries, raw
logs, or a restatement of the goal. Return four lines or fewer:

```text
STATUS: done | blocked | needs-decision
PATHS: <changed paths, or none>
CHECK: <command/result, or not run + why>
RISK: <blocker, follow-up, or none>
```

## Read-only reviewer subchat

```text
GOAL: find actionable regressions only
TARGET: <diff or changed paths>
INVARIANTS: <must-hold properties>
EVIDENCE: <checks run>
RETURN: severity; location; failure case; correction
```

Do not edit, create tasks, repeat the request, or provide final sign-off. Keep
the request and return under 120 tokens when possible; report no more than
three findings and no raw log output.

## Parent checkpoint

```text
STATE: <completed / active targets / one open decision>
EVIDENCE: <paths; checks; risk>
NEXT: <one owner/action>
```

Update this checkpoint only when state changes. Inspect named files or child
state directly rather than copying a child transcript into the parent context.
