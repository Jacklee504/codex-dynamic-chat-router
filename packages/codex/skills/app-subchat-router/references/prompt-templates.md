# Prompt templates

## Writer subchat

```text
PARENT: <title or ID>
GOAL: <observable outcome>
SCOPE: <allowed paths>
DO NOT: <non-goals>
CHECK: <commands or evidence>
RETURN: changed paths; check result; blocker/risk
```

Do not add a parent brief, model rationale, sibling summaries, or raw logs.

## Read-only reviewer subchat

```text
GOAL: find actionable regressions only
TARGET: <diff or changed paths>
INVARIANTS: <must-hold properties>
EVIDENCE: <checks run>
RETURN: severity; location; failure case; correction
```

Do not edit, create tasks, repeat the request, or provide final sign-off.

## Parent checkpoint

```text
Objective:
Completed:
Open decisions:
Active subchats / owners:
Interfaces or invariants:
Relevant files:
Verification state:
Next action:
```
