# Codex package

This is the Codex desktop adapter. It routes work through visible,
parent-owned subchats and requires the host controls described in its bundled
compatibility reference.

Install the `skills/app-subchat-router/` directory as a local skill, or package
this directory through the applicable Codex plugin distribution flow. Invoke
`$app-subchat-router` explicitly before creating subchats.

The worker prompt is intentionally six fields and ordinary returns are limited
to five lines. Detailed lifecycle guidance stays in references so the parent
loads it only when needed.
